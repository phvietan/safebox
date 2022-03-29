import { isFile } from "./isFile";

function splitFileNameExtension(fileName: string): [string,string] {
  const parts = fileName.split('.');
  return [
    parts.slice(0, -1).join('.'),
    parts[parts.length - 1],
  ]
}
/**
 * Return new file name that is not already existed
 */
export function getNewFileName(fileName: string): string {
  try {
    const [fileNameWithoutExt, ext] = splitFileNameExtension(fileName);
    const check = isFile(fileName);
    if (check) {
      if (/_\d+$/.test(fileName)) {
        const parts = fileNameWithoutExt.split('_');
        const num = parseInt(parts[parts.length - 1]);
        const newFileName = parts.slice(0, -1).join('_');
        return getNewFileName(newFileName + '_' + (num + 1).toString() + '.' + ext);
      }
      return getNewFileName(fileNameWithoutExt + '_0.' + ext);
    }
  } catch (err) {
    return fileName;
  }
}
