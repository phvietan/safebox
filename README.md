# Safebox

Safebox is a CLI tool for easy encrypt / decrypt file with password.

Algorithm Safebox uses: AES-CBC256 with key = \<SHA256 password\>

# Installation

Install with npm

```bash
npm i -g @drstrain/safebox
```
# Usage

Help:

```bash
safebox -h
```

Encrypt:

```bash
safebox enc <filename>
```

Decrypt

```bash
safebox dec <filename>
```

# License

Licensed under <a href="./MIT">MIT</a>
