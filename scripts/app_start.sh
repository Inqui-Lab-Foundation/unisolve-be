#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"
npm install -g pm2@latest
export PM2_HOME=/home/ubuntu/.pm2
pm2 list
cd /home/ubuntu/
pm2 start ./unisolve-be/src/index.js