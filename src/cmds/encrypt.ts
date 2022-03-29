import fs from 'fs';
import crypto from 'crypto';
import { hash } from '@drstrain/drutil';
import { promtPassword } from '../libs/promtPassword';
import { SIGNATURE } from '../types';
import { exit } from 'process';
import { isFile } from '../libs/isFile';
import { getNewFileName } from '../libs/newFileName';

export async function encrypt(fileLoc: string): Promise<void> {
  if (!isFile(fileLoc)) { exit(1); }

  const password = await promtPassword('Enter password for encrypt');
  const key = Buffer.from(hash(password), 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  const file = fs.readFileSync(fileLoc);
  const updated = cipher.update(file);
  const encrypted = Buffer.concat([
    Buffer.from(SIGNATURE, 'ascii'),
    iv,
    updated,
    cipher.final()
  ]);

  const encFileName = getNewFileName(`${fileLoc}.enc`);
  fs.writeFileSync(encFileName, encrypted);
  fs.unlinkSync(fileLoc);
  console.log(`Successfully encrypt file into: ${encFileName}`);
}
