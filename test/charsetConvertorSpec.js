'use strict';

var expect = require('chai').expect;
var fs = require('fs');

var charsetConverter = require('lib/charset-converter');

describe('charset-converter', function() {
  describe('.detect()', function() {
    it('should detect charset in content-type header', function() {
      expect(charsetConverter.detect('text/xml; charset=UTF-8','<html><head></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect('text/xml; charset=utf-8','<html><head></head><body></body></html>')).to.equal('utf-8');
    });

    it('should detect charset in meta', function() {
      expect(charsetConverter.detect(null,'<html><head><meta charset=utf-8></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset=UtF-8></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset="utf-8"></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset=\'utf-8\' /></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset="utf-8" http-equiv="Content-Type" content="text/html;"></head><body></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset="utf-8"></head><body><charset="iso-8859-1"></body></html>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<html><head><meta charset="windows-1252"></head><body></body></html>')).to.equal('windows-1252');
    });

    it('should detect charset in xml definition', function() {
      expect(charsetConverter.detect(null,'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title></title></channel></rss>')).to.equal('utf-8');
      expect(charsetConverter.detect(null,'<?xml version="1.0" encoding="windows-1252"?><rss version="2.0"><channel><title></title></channel></rss>')).to.equal('windows-1252');
      expect(charsetConverter.detect(null,'<?xml encoding="iso-8859-1" version="1.0"?><rss version="2.0"><channel><title></title></channel></rss>')).to.equal('iso-8859-1');
    });

    it('should detect charset if nothing is defined', function() {
      expect(charsetConverter.detect(null,'<html><head></head><body>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</body></html>')).to.equal('utf-8');
    });
  });

  describe('.convert()', function() {
    it('should return unchanged content if charset doesn\'t exist', function() {
      expect(charsetConverter.convert(null,'<html><head><meta charset="anything"></head><body>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</body></html>'));
    });

    it('should not transform content with utf8 content-type header defined' , function() {
      expect(charsetConverter.convert('text/xml; charset=UTF-8',fs.readFileSync(__dirname + '/fixtures/utf8-html-without-header').toString())).to.deep.
        equal('<html><head></head><body>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</body></html>');
    });

    it('should not transform content with utf8 xml declaration defined' , function() {
      expect(charsetConverter.convert(null,fs.readFileSync(__dirname + '/fixtures/utf8-xml-with-header').toString())).to.deep.
        equal('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</title></channel></rss>');
    });

    it('should not transform content with utf8 meta defined' , function() {
      expect(charsetConverter.convert(null,fs.readFileSync(__dirname + '/fixtures/utf8-html-with-header',null).toString())).to.deep.
        equal('<html><head><meta charset="UTF-8"></head><body>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</body></html>');
    });

    it('should not transform content with utf8 identified in body' , function() {
      expect(charsetConverter.convert(null,fs.readFileSync(__dirname + '/fixtures/utf8-html-without-header',null).toString())).to.deep.
        equal('<html><head></head><body>Ce livre où vit mon âme, espoir, deuil, rêve, effroi</body></html>');
    });
  });
});
