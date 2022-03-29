import fs from 'fs';
import crypto from 'crypto';
import { errorLog, hash } from '@drstrain/drutil';
import { promtPassword } from '../libs/promtPassword';
import { SIGNATURE } from '../types';
import { exit } from 'process';
import { isFile } from '../libs/isFile';
import { getNewFileName } from '../libs/newFileName';

export async function decrypt(fileLoc: string): Promise<void> {
  if (!isFile(fileLoc)) { exit(1); }

  const file = fs.readFileSync(fileLoc);
  const sig = file.slice(0, SIGNATURE.length);
  if (sig.toString('ascii') !== SIGNATURE) {
    throw new Error(`Error: file ${fileLoc} is not encrypted with safebox, please check again`);
  }

  const password = await promtPassword('Enter password for decrypt');
  const key = Buffer.from(hash(password), 'hex');

  const iv = file.slice(SIGNATURE.length, SIGNATURE.length+16);
  const ciphertext = file.slice(SIGNATURE.length+16);
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  try {
    const decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
    const newDecryptedFileName = getNewFileName(`${fileLoc.replace(/\.enc$/, '')}`);
    fs.writeFileSync(newDecryptedFileName, decrypted);
    console.log(`Successfully decrypt file into ${newDecryptedFileName}`);
  } catch (err) {
    errorLog('Cannot decrypt file');
    console.log(err);
    exit(1);
  }
}
