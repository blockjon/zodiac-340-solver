#!/bin/bash
set -euox pipefail
aws s3 cp ./dist/bundle.js s3://www.jonathanblock.com/zodiac/dist/bundle.js --acl public-read
aws s3 cp ./index.html s3://www.jonathanblock.com/zodiac/index.html --acl public-read
aws s3 sync ./css s3://www.jonathanblock.com/zodiac/css --acl public-read
aws cloudfront create-invalidation --distribution-id E24D7QOY0ABOB2 --paths '/*'
