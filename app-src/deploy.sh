npm run build
cp -r ./dist/* ../
git add --all
git commit -am deploy
git push
