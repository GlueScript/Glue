#!/bin/bash

# run a glue script
# remember the content-type header!

script=$1
glue=http://192.168.59.103:41990/

curl -v -X POST -d @$script -H 'Content-Type: text/plain' $glue
