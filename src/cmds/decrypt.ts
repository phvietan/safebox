import fs from 'fs';
import crypto from 'crypto';
import { hash } from '@drstrain/drutil';
import { promtPassword } from '../libs/promtPassword';
import { SIGNATURE } from '../types';
import { exit } from 'process';

export async function decrypt(fileLoc: string): Promise<void> {
  const file = fs.readFileSync(fileLoc);
  const sig = file.slice(0, 16);
  if (sig.toString('ascii') !== SIGNATURE) {
    console.log(`Error: file ${fileLoc} is not encrypted with drsafe, please check again`);
    exit(1);
  }

  const password = await promtPassword('Enter password for decrypt');
  const key = Buffer.from(hash(password), 'hex');

  const iv = file.slice(16, 32);
  const ciphertext = file.slice(32);
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);

  fs.writeFileSync(`${fileLoc.replace(/\.enc$/, '')}`, decrypted);
  console.log('Successfully decrypt file');
}
