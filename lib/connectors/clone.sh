__='
   This is the default license template.
   
   File: clone.sh
   Author: angmas
   Copyright (c) 2020 angmas
   
   To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
'

#!/bin/bash

filename=$(echo $1 | tr '[:upper:]' '[:lower:]')
echo $filename
sed -E 's/Template/'$1'/g' template.ts > $filename.ts