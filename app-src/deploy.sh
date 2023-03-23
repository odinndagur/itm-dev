# npm run build
npx vite build --base=/itm-dev/
cp -r ./dist/* ../
git add --all
git commit -am deploy
git push
