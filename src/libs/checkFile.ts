import { errorLog } from '@drstrain/drutil';
import fs from 'fs';
import { exit } from 'process';

export function isFile(fileLoc: string) {
  const stat = fs.statSync(fileLoc);
  if (!stat.isFile()) {
    errorLog(`${fileLoc} is not a file`);
    exit(1);
    return false;
  }
  return true;
}
