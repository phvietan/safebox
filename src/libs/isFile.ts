import fs from 'fs';

export function isFile(fileLoc: string) {
  const stat = fs.statSync(fileLoc);
  if (!stat.isFile()) {
    throw new Error(`${fileLoc} is not a file`)
  }
  return true;
}
