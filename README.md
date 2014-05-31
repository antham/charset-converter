Charset-converter
=================

Check encoding in xml/html page using request header, meta and finally using detection charset library and convert to utf-8

## Usage

Require the module :

    var converter = require("charset-converter");

Convert to utf-8 with converter.convert() :

    var string = converter.convert(contentTypeHeader,content);
