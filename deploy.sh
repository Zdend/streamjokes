#!/usr/bin/env bash

echo "===== DEPLOYING TO NETLIFY.. ====="

rm -rf dist/* && \
git worktree list | grep "\[static\]" && echo "Worktree dist already exists" || git worktree add --checkout ./dist static && \
yarn all-prod && \
cd dist && \
git add --all && \
git commit -m "Deploy to netlify" && \
git push origin static && \

echo "===== DEPLOY WAS SUCCESSFUL! ====="