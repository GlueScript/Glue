Glue
====
[![Build status](https://travis-ci.org/timothy-r/Glue.svg?branch=master)](https://travis-ci.irg/timothy-r/Glue)

Sticky scripting for HTTP

This service runs scripts that connect HTTP requests and responses together. 'Glue scripts' have a clear syntax that declares the order that the request flow takes. An implicit 'payload' exists that is passed from one endpoint to the next.



The common transfer format that allows this to work is that request payloads are either json arrays of 'blobs' or just plain 'blobs'. Content-types of blobs are detected and used when making requests. 

Participating services need to support HTTP and be able to deal with arrays of blobs or just single blobs.

Running scripts
===============

POST the script text with a Content-Type request header of text/plain to the glue service endpoint.

    curl -X POST -d @script.gs -H 'Content-Type: text/plain' http://glue.server/

Single statement script
=======================

    GET http://resource.net/

This script makes a GET request to http://resource.net/ and responds with the response to that request.

Chaining responses to a request
================================

    GET http://resource.net/ POST http://words/
    
A GET request is made to http://resource.net/ when that request responds with success, a POST request with the response body is made to http://words/ . The response from the glue server is the response from the final request in the script.

Longer chains
===========

    GET http://resource.net/ POST http://words/ POST http://to-upper/

Script can chain multiple endpoints together. They can use any HTTP verb that the endpoint supports.

Script execution ends at the first error response, whether it's a client or server error, script execution ends and the current payload forms the response from the glue server.

Splitting payloads
==================

Glue scripts can split a payload that is a json array into individual requests using the / operator. Putting separate request on different lines helps readability.

    GET http://resource.net/ 
        POST http://words/ 
        / POST http://to-upper/ 
        POST http://sort/

When the words service responds with ["dog", "house", "countryside", "dividend"] then 4 requests are made to the to-upper server each containing a single item from the array. Script execution waits for all requests to complete before continuing. 
The to-upper service responds to a request "dog" with "DOG". The glue server joins all the responses into an array so that the request made to the sort service contains ["DOG", "HOUSE", "COUNTRYSIDE", "DIVIDEND"]. 
When sort responds with ["COUNTRYSIDE", "DIVIDEND", "DOG", "HOUSE"] then that response body is the response from the glue service.

Joining payloads
================

Glue scripts can join the responses of 2 or more endpoints into a single payload.

    GET http://resource.net/
    + (
        POST http://dom/?xpath=//a/@href
        POST http://dom/?xpath=//img/@src
    )
    POST http://metadata/
    
The html document from resource.net is POSTed to both http://dom/?xpath=//a/@href and http://dom/?xpath=//img/@src in parallel and the responses from these services are combined into one array which is POSTed to the metadata service.
    

