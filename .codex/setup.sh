#!/bin/bash
set -e

# Ensure apt is up to date and Node.js is installed
if ! command -v node >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nodejs npm
fi

# Install pnpm if missing
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm
fi

# Install project dependencies for the React template
cd "$(dirname "$0")/../react_template"
pnpm install

