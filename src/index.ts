#!/usr/bin/env node

import { exit } from 'process';
import { METHOD } from './types';
import { encrypt, decrypt } from './cmds';

function printHelp() {
  const { argv } = process;
  const paths = argv[1].split('/');
  const bin = paths[paths.length - 1];

  const help =
    `Usage: ${bin} <command> <filename>

Commands:
    ${bin} enc/encrypt <filename>      Encrypt with drsafe
    ${bin} dec/decrypt <filename>      Decrypt with drsafe

You need one command with filename before moving on
`;
  console.log(help);
  exit(1);
}

async function main() {
  const { argv } = process;
  const command = argv[2]?.toLowerCase();
  const filename = argv[3];
  if (!filename || !command) printHelp();
  if (METHOD.DECRYPT.includes(command) && METHOD.ENCRYPT.includes(command)) {
    console.log('Error: Ambiguous command');
    exit(1);
  }
  if (METHOD.DECRYPT.includes(command)) {
    await decrypt(filename);
  }
  else if (METHOD.ENCRYPT.includes(command)) {
    await encrypt(filename);
  }
  else {
    console.log('Error: unknown command');
    exit(1);
  }

  exit(0);
}

main();
