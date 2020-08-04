#!/bin/bash
set -euox pipefail
aws s3 cp ./dist/bundle.js s3://www.jonathanblock.com/zodiac-340-solver/dist/bundle.js --acl public-read
aws s3 cp ./index.html s3://www.jonathanblock.com/zodiac-340-solver/index.html --acl public-read
aws s3 sync ./css s3://www.jonathanblock.com/zodiac-340-solver/css --acl public-read
