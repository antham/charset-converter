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
 * @method detect
 * @param {String} contentType
 * @param {Buffer} content
 * @return charset
 */
var detect = function (contentType, content)
{
  if(!content)
  {
    throw 'content is not defined';
  }

  var charset = null;
  var datas = null;

  if(contentType)
  {
    datas = contentType.match(/charset=([0-9a-z\-]+)/i);
  }

  if(!datas)
  {
    datas = content.toString().match(/<head>.*?<meta.*?charset=['|"]?([0-9a-z\-]+)['|"]?.*?>.*?<\/head>/i);
  }

  if(!datas)
  {
    datas = content.toString().match(/<\?xml.*?encoding=['|"]?([0-9a-z\-]+)['|"]?.*?\?>/i);
  }

  if(datas && datas[1])
  {
    charset = datas[1].toLowerCase();
  }

  if(!charset)
  {
    charset = charsetDetector.detectCharset(content).toString().toLowerCase();
  }

  return charset;
};

/**
 * Detect and convert page to utf-8
 * @method convert
 * @param {String} contentType
 * @param {Buffer} content
 * @return ConditionalExpression
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
