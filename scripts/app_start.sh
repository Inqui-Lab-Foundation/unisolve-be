#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"
export PM2_HOME=/home/ubuntu/.pm2
pm2 stop all
pm2 delete all
cd /home/ubuntu/unisolve-be
npm install
npm run build
npm run start:prod
pm2 save --force