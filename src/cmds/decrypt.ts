import fs from 'fs';
import crypto from 'crypto';
import { hash, errorLog } from '@drstrain/drutil';
import { promtPassword } from '../libs/promtPassword';
import { SIGNATURE } from '../types';
import { exit } from 'process';
import { isFile } from '../libs/checkFile';

export async function decrypt(fileLoc: string): Promise<void> {
  if (!isFile(fileLoc)) { exit(1); }

  const file = fs.readFileSync(fileLoc);
  const sig = file.slice(0, SIGNATURE.length / 2);
  if (sig.toString('ascii') !== SIGNATURE) {
    errorLog(`Error: file ${fileLoc} is not encrypted with safebox, please check again`);
    exit(1);
  }

  const password = await promtPassword('Enter password for decrypt');
  const key = Buffer.from(hash(password), 'hex');

  const iv = file.slice(SIGNATURE.length, SIGNATURE.length+16);
  const ciphertext = file.slice(SIGNATURE.length+16);
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);

  fs.writeFileSync(`${fileLoc.replace(/\.enc$/, '')}`, decrypted);
  console.log('Successfully decrypt file');
}
