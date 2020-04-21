
# TODO

- PersistentGate causes mismatch when rehydrating and react generates warning - this goes away in production mode but it would be nice to solve this
- React Dev tool extension sometimes causes a lot of lags - disable and re-enable helps

## Squashing
Once in a while we need to reduce the size of the repo so we need to squash all the commits into one

```
cd ./dist
git reset $(git commit-tree HEAD^{tree} -m "Squash - deploy")
git push -f
```

## Deploy

Sometimes deploye gets stuck
```
rm -rf ./dist
git worktree remove dist
./deploy.sh
```
