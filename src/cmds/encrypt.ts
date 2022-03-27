import fs from 'fs';
import crypto from 'crypto';
import { hash } from '@drstrain/drutil';
import { promtPassword } from '../libs/promtPassword';
import { SIGNATURE } from '../types';

export async function encrypt(fileLoc: string): Promise<void> {
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

  fs.writeFileSync(`${fileLoc}.enc`, encrypted);
  console.log('Successfully encrypt file');
}
