/**
 * charset-converter - lib/charset-converter.js
 *
 * Copyright (c) 2014, Anthony HAMON
 * MIT Licensed
 *
 */

'use strict';

var charsetDetector = require('node-icu-charset-detector');
var encoding = require('encoding');

/**
 * Detect html/xml page encoding
 *
 * @param  {String} contentType
 * @param  {String} content
 *
 * @return {String}
 */
var detect = function (contentType, content)
{
  if(!content)
  {
    throw 'content is not defined';
  }

  var charset = null;
  var datas = [];

  if(contentType)
  {
    datas = contentType.match(/charset=([0-9a-z\-]+)/i);
  }
  else
  {
    datas = content.match(/<head>.*?<meta.*?charset=['|"]?([0-9a-z\-]+)['|"]?.*?>.*?<\/head>/i);

    if(!datas)
    {
      datas = content.match(/<\?xml.*?encoding=['|"]?([0-9a-z\-]+)['|"]?.*?\?>/i);
    }
  }

  if(datas && datas[1])
  {
    charset = datas[1].toLowerCase();
  }

  if(!charset)
  {
    charset = charsetDetector.detectCharset(new Buffer(content)).toString().toLowerCase();
  }

  return charset;
};

/**
 * Detect and convert page to utf-8
 *
 * @param  {String} contentType
 * @param  {String} content
 *
 * @return {String}
 */
var convert = function(contentType, content)
{
  var fromCharset = detect(contentType, content);

  return !fromCharset || (fromCharset === 'utf8' || fromCharset === 'utf-8') ? content :  encoding.convert(content,'utf-8',fromCharset).toString();
};

module.exports = {
  'detect': detect,
  'convert': convert
};
