#!/usr/bin/env bash
set -eo pipefail

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root/Frontend/frontend"

# Git hooks may run without the interactive shell's Node.js setup.
nvm_script="${NVM_DIR:-$HOME/.nvm}/nvm.sh"
if [ -s "$nvm_script" ]; then
    . "$nvm_script"
    nvm use --silent
fi

if ! command -v npm >/dev/null 2>&1; then
    echo 'Frontend checks require Node.js 24 and npm. See Frontend/frontend/.nvmrc.' >&2
    exit 1
fi

npm ci --no-audit --no-fund
npm run lint
npm run build
