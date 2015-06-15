var Tokenizer = require("./Tokenizer.js");

// constructor
function UrlExtractor(){
  this._tokenizer = new Tokenizer();
  console.log('extractor > created');
}

UrlExtractor.prototype.write = function(data){
  //console.log('extractor > write called');
  this._tokenizer.write(data);
};


module.exports = UrlExtractor;
