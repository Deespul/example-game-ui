#!/bin/bash

rm ./env.js

echo "window._env_ = {" >> ./env.js
echo "  API_URL: \"${1}\""  >> ./env.js
echo "};" >> ./env.js
