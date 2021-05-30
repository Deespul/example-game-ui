#!/bin/bash

rm ./env.js

echo "const config = {" >> ./env.js
echo "  API_URL: \"${1}\""  >> ./env.js
echo "};" >> ./env.js
