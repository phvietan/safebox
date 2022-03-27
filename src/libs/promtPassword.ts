import { read } from '@drstrain/drutil';

var userPassword: string = null;

export async function promtPassword(s: string) {
  if (!userPassword) {
    userPassword = await read(s);
  }
  return userPassword;
}
