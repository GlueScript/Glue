Glue
====
[![Build status](https://travis-ci.org/timothy-r/Glue.svg?branch=master)](https://travis-ci.irg/timothy-r/Glue)

Sticky scripting for HTTP

This service runs scripts that connect HTTP requests and responses together. 'Glue scripts' have a clear syntax that declares the order that the request flow takes. An implicit 'payload' exists that is passed from one endpoint to the next.



The common transfer format that allows this to work is that request payloads are either json arrays of 'blobs' or just plain 'blobs'. Content-types of blobs are detected and used when making requests. 

Participating services need to support HTTP and be able to deal with arrays of blobs or just single blobs.

Running scripts
===============

POST the script text with a Content-Type of text/plain to the http://glue-service/ endpoint

    curl -X POST -d @script.gs -H 'Content-Type: text/plain' http://glue.server/

First script
===========

    GET http://resource.net/

This makes a GET request to the uri and responds with the response to that request.


