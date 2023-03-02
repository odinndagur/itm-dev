cd app-src
npx webpack build
cd ..
cp app-src/dist/* ./
git add . && git commit -am deploy && git push