#!/bin/sh
# Remove useless directory
[ -d apps/web/node_modules  ] && rm -r apps/web/node_modules
# Create symbolic link
ln -s ../../node_modules apps/web/node_modules
