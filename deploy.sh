#!/usr/bin/env sh
set -e
npm run build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:wagntao913/web-word.git master:gh-pages
cd -