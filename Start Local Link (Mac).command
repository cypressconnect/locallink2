#!/bin/bash
# Double-click to run Local Link. Installs the packages the first time, starts
# the site and opens it in your browser. Close this window to stop the site.
cd "$(dirname "$0")/local-link" || exit 1

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is not installed. Download the LTS version from https://nodejs.org,"
  echo "install it, then double-click this file again."
  read -r -p "Press Enter to close."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing packages (first run only, takes a minute)..."
  npm install || { read -r -p "Install failed. Press Enter to close."; exit 1; }
fi

npm run dev -- --open
