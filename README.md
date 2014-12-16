Glue
====
[![Build status](https://travis-ci.org/timothy-r/Glue.svg?branch=master)](https://travis-ci.irg/timothy-r/Glue)

Sticky scripting for HTTP

Runs scripts that glue HTTP requests and responses together. The common format that allows this is that request payloads are either json arrays of 'blobs' or just 'blobs'. Content-types of blobs are detected and used when making requests. 

Participating services need to support HTTP and both arrays of blobs or just single blobs.

How to
======

POST 'scripts' with a Content-Type of text/plain to the http://glue-service/ endpoint

* Documentation of glue script syntax and expectations to make this work are on their way
