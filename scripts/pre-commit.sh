#!/bin/bash

# Run existing pre-commit checks
npm run format:check || exit 1
npm run lint || exit 1
npm run build || exit 1
npm run test || exit 1

# Check if there are any staged changes
if git diff --cached --quiet; then
  echo "No staged changes to commit. Skipping changeset check."
else
  # Check if a changeset file exists in .changeset directory
  if [ -z "$(ls -A .changeset 2>/dev/null)" ]; then
    echo "No changeset file found. Please run 'npx changeset add' to create one."
    exit 1
  fi
fi