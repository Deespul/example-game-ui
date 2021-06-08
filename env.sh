#!/bin/bash

rm ./env.js

echo "window._env_ = {" >> ./env.js
echo "  API_URL: \"https://demo-backend.${1}/\","  >> ./env.js
echo "  MATCHBOX_API: \"https://api.${1}/\""  >> ./env.js
echo "};" >> ./env.js
