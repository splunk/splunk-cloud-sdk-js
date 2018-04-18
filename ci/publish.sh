#!/bin/sh

echo $NPM_TOKEN >> .npmrc
npm publish
