#!/bin/bash

filename=$(echo $1 | tr '[:upper:]' '[:lower:]')
echo $filename
sed -E 's/Template/'$1'/g' template.ts > $filename.ts