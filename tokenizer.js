/*
html -> scanner -> lexer -> parser -> interpreter

- The scanner's job is to read the source file one character at a time.
  For each character, it keeps track of the line and character position where
  the character was found. Each time the scanner is called, it reads the next
  character from the file and returns it.

- The lexer's job is to group the characters of the source file into chunks
  called tokens. Each time the lexer is called, it calls the
  scanner (perhaps several times) to get as many characters as it needs in
  order to assemble the characters into a token. It determines the type of
  token that it has found (a string, a number, an identifier, a comment, etc.)
  and returns the token.

- Parser: This is the part of the compiler that really understands the syntax
  of the language. It calls the lexer to get tokens and processes the tokens
  per the syntax of the language.
*/

module.exports = Tokenizer;

const DATA = 1;
const CHARACTER_REFERENCE_IN_DATA = 2;
const RCDATA = 3;
const CHARACTER_REFERENCE_IN_RCDATA = 4;
const RAWTEXT = 5;
const SCRIPT_DATA = 6;
const PLAINTEXT = 7;
const TAG_OPEN = 8;
const END_TAG_OPEN = 9;
const TAG_NAME = 10;
const RCDATA_LESS_THAN_SIGN = 11;
const RCDATA_END_TAG_OPEN = 12;
const RCDATA_END_TAG_NAME = 13;
const RAWTEXT_LESS_THAN_SIGN = 14;
const RAWTEXT_END_TAG_OPEN = 15;
const RAWTEXT_END_TAG_NAME = 16;
const SCRIPT_DATA_LESS_THAN_SIGN = 17;
const SCRIPT_DATA_END_TAG_OPEN = 18;
const SCRIPT_DATA_END_TAG_NAME = 19;
const SCRIPT_DATA_ESCAPE_START = 20;
const SCRIPT_DATA_ESCAPE_START_DASH = 21;
const SCRIPT_DATA_ESCAPED = 22;
const SCRIPT_DATA_ESCAPED_DASH = 23;
const SCRIPT_DATA_ESCAPED_DASH_DASH = 24;
const SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN = 25;
const SCRIPT_DATA_ESCAPED_END_TAG_OPEN = 26;
const SCRIPT_DATA_ESCAPED_END_TAG_NAME = 27;
const SCRIPT_DATA_DOUBLE_ESCAPE_START = 28;
const SCRIPT_DATA_DOUBLE_ESCAPED = 29;
const SCRIPT_DATA_DOUBLE_ESCAPED_DASH = 30;
const SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH = 31;
const SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN = 32;
const SCRIPT_DATA_DOUBLE_ESCAPE_END = 33;
const BEFORE_ATTRIBUTE_NAME = 34;


const SELF_CLOSING_START_TAG = 43;
const BOGUS_COMMENT = 44;
const MARKUP_DECLARATION_OPEN = 45;

// constructor
function Tokenizer(){

  this._buffer = "";
  this._index = 0;
  this._running = false;
  this._state = DATA;
  this._tempBuffer = "";
  this._currentTagTokenName = ""
  this._lastStartTag = ""
  this._attributes = [];
  console.log('tokenizer > created');
}

//public methods
Tokenizer.prototype.write = function(chunk){
  this._buffer += chunk;
  this._scan();
};


//PRIVATE METHODS//

Tokenizer.prototype._isWhitespace = function (c){
  return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}

Tokenizer.prototype._isUpperCase = function(c){
  return c >= "A" && c <= "Z";
}

Tokenizer.prototype._isLowerCase = function(c){
  return c >= "a" && c <= "z";
}

Tokenizer.prototype._toLowerCase = function (c){
  return String.fromCharCode(c.charCodeAt(0) + 32);
}

Tokenizer.prototype._reconsumeChar = function (){
  this._index--;
  console.log('tokenizer > reconsume : ' + this._index);
}

Tokenizer.prototype._emitToken = function (token, type){
  //console.log('tokenizer > emiting  ' + type + " : " + token);
  console.log('tokenizer > emiting  token : ' + token);
}

/*Tokenizer.prototype._emitEndToken = function (token,type){
  console.log('tokenizer > emiting end tag ' + token );
}*/

Tokenizer.prototype._emitCurrentTagToken = function (){
  console.log('tokenizer > emiting current tag ' + this._currentTagTokenName);
  this._currentTagTokenName ="";
}

Tokenizer.prototype._isAppropriateEndTagToken = function(c){
  var ret = false;
  if(this._lastStartTag === this._currentTagTokenName){
    return true;
  }
  return ret;
}

//scan
Tokenizer.prototype._scan = function(chunk){
  //console.log('tokenizer > scan - index : ' + this._index + ' - buffer: ' + this._buffer.length);
  while(this._index < this._buffer.length){
    var c = this._buffer.charAt(this._index);
    /*if(!this._isWhitespace(c)){
      this._consumeChar(c);
    }*/
    console.log('tokenizer > scan - index : ' + this._index);
    this._consumeChar(c);
    this._index++;
  }
};

//lexer
Tokenizer.prototype._consumeChar = function(c){
  console.log('tokenizer > state : ' +  this._state + " & char: " + c);
  if(this._state == DATA){
    this._dataState(c);
  }
  else if(this._state == CHARACTER_REFERENCE_IN_DATA){
    this._characterReferenceInDataState(c);
  }
  else if(this._state == RCDATA){
    this._rcDataState(c);
  }
  else if(this._state == CHARACTER_REFERENCE_IN_RCDATA){
    this._characterReferenceInRCDataState(c);
  }
  else if(this._state == RAWTEXT){
    this._rawTextState(c);
  }
  else if(this._state == SCRIPT_DATA){
    this._scriptDataState(c);
  }
  else if(this._state == PLAINTEXT ){
    this._plainTextState(c);
  }
  else if(this._state == TAG_OPEN ){
    this._tagOpenState(c);
  }
  else if(this._state == END_TAG_OPEN ){
    this._endTagOpenState(c);
  }
  else if(this._state == TAG_NAME ){
    this._tagNameState(c);
  }
  else if(this._state == RCDATA_LESS_THAN_SIGN){
    this._rcDataLessThanSignState(c);
  }
  else if(this._state == RCDATA_END_TAG_OPEN){
    this._rcDataEndTagOpenState(c);
  }
  else if(this._state == RCDATA_END_TAG_NAME){
    this._rcDataEndTagNameState(c);
  }
  else if (this._state == RAWTEXT_LESS_THAN_SIGN){
    this._rawTextLessThanSignState(c)
  }
  else if (this._state == RAWTEXT_END_TAG_OPEN){
    this._rawTextEndTagOpenState(c)
  }
  else if (this._state == RAWTEXT_END_TAG_NAME){
    this._rawTextEndTagNameState(c)
  }
  else if(this._state == SCRIPT_DATA_LESS_THAN_SIGN){
    this._scriptDataLessThanSignState(c);
  }
  else if(this._state == SCRIPT_DATA_END_TAG_OPEN){
    this._scriptDataEndTagOpenState(c);
  }
  else if(this._state == SCRIPT_DATA_END_TAG_NAME){
    this._scriptDataEndTagNameState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPE_START){
    this._scriptDataEscapeStartState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPE_START_DASH){
    this._scriptDataEscapeStartDashState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED){
    this._scriptDataEscapedState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED_DASH){
    this._scriptDataEscapedDashState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED_DASH_DASH){
    this._scriptDataEscapedDashDashState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN){
    this._scriptDataEscapedLessThanSignState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED_END_TAG_OPEN){
    this._scriptDataEscapedEndTagOpenState(c);
  }
  else if(this._state == SCRIPT_DATA_ESCAPED_END_TAG_NAME){
    this._scriptDataEscapedEndTagNameState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPE_START){
    this._scriptDataDoubleEscapeStartState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPED){
    this._scriptDataDoubleEscapedState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPED_DASH){
    this._scriptDataDoubleEscapedDashState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH){
    this._scriptDataDoubleEscapedDashDashState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN){
    this._scriptDataDoubleEscapedLessThanSignState(c);
  }
  else if(this._state == SCRIPT_DATA_DOUBLE_ESCAPE_END){
    this._scriptDataDoubleEscapeEndState(c);
  }
  else if(this._state == BEFORE_ATTRIBUTE_NAME){
    this._beforeAttributeNameState(c);
  }




};


//DETAILED IMPLEMENTATION//

// 8.2.4.1 Data state
Tokenizer.prototype._dataState = function(c){
  if(c === "&"){
    this._state = CHARACTER_REFERENCE_IN_DATA;
  }
  else if(c === "<"){
    this._state = RCDATA_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken("EOF", "End of file");
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.2 Character reference in data state
Tokenizer.prototype._characterReferenceInDataState = function(c){
    //TO BE IMPLEMENTED
}

//8.2.4.3 RCDATA state
Tokenizer.prototype._rcDataState = function(c){
  if(c === "&"){
    this._state = CHARACTER_REFERENCE_IN_RCDATA;
  }
  else if(c === "<"){
    this._state = RCDATA_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken("EOF", "End of file");
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.4 Character reference in RCDATA state
Tokenizer.prototype._characterReferenceInRCDataState = function(c){
    //TO BE IMPLEMENTED
}

//8.2.4.5 RAWTEXT state
Tokenizer.prototype._rawTextState = function(c){
  if(c === "<" ){
    this._state = RAWTEXT_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken("EOF", "End of file");
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.6 Script data state
Tokenizer.prototype._scriptDataState = function(c){
  if(c === "<" ){
    this._state = SCRIPT_DATA_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken("EOF", "End of file");
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.7 PLAINTEXT state
Tokenizer.prototype._plainTextState = function(c){
  if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken("EOF", "End of file");
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.8 Tag open state
Tokenizer.prototype._tagOpenState = function(c){
  if(c === "!" ){
    this._state = MARKUP_DECLARATION_OPEN;
  }
  else if(c === "/" ){
      this._state = END_TAG_OPEN;
  }
  else if(this._isUpperCase(c)){
    this._currentTagTokenName = this._toLowerCase(c);
    this._state = TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    this._currentTagTokenName  += c;
    this._state = TAG_NAME;
  }
  else if(c === "?"){
    //parser error
    this._emitToken(c, "Parse error");
    this._state = BOGUS_COMMENT;
  }
  else{
    //parser error
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._emitToken("<", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  };
};

//8.2.4.9 End tag open state
Tokenizer.prototype._endTagOpenState = function(c){
  if(this._isUpperCase(c)){
    this._currentTagTokenName = this._toLowerCase(c);
    this._state = TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    this._currentTagTokenName  += c;
    this._state = TAG_NAME;
  }
  else if(c === ">" ){
    this._emitToken(c, "Parse error");
    this._state = DATA;
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._emitToken("</","LESS-THAN SIGN + SLASH character token");
    this._reconsumeChar();
  }
  else{
    this._emitToken(c, "Parse error");
    this._state = BOGUS_COMMENT;
  }
};

//8.2.4.10 Tag name state
Tokenizer.prototype._tagNameState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    if(this._isAppropriateEndTagToken()){
      this._state = BEFORE_ATTRIBUTE_NAME
    }
  }
  else if(c === "/"){
    if(this._isAppropriateEndTagToken()){
      this._state = SELF_CLOSING_START_TAG;
    }
  }
  else if(c === ">"){
    if(this._isAppropriateEndTagToken()){
      this._state = DATA;
      this._emitCurrentTagToken();
    }
  }
  else if(this._isUpperCase(c)){
    this._currentTagTokenName += this._toLowerCase(c);
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._currentTagTokenName +="�";
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    //parser error
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else {
    this._currentTagTokenName  += c;
  }
};

//8.2.4.11 RCDATA less-than sign state
Tokenizer.prototype._rcDataLessThanSignState = function(c){
  if(c === "/" ){
    this._tempBuffer = "";
    this._state = RCDATA_END_TAG_OPEN;
  }
  else{
    this._state = RCDATA;
    //emit LESS-THAN SIGN TOKEN
    this._emitToken("<", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  };
};

//8.2.4.12 RCDATA end tag open state
Tokenizer.prototype._rcDataEndTagOpenState = function(c){
  //console.log('tokenizer > _rcDataEndTagOpenState c=' +  c);
  if(this._isUpperCase(c)){
    c = this._toLowerCase(c);
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = RCDATA_END_TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    //console.log('tokenizer > _rcDataEndTagOpenState c=' +  c + ' isLower');
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = RCDATA_END_TAG_NAME;
    //console.log('tokenizer > _rcDataEndTagOpenState buffer : ' +  this._tempBuffer);
  }
  else{
    this._state = RCDATA;
    this._emitToken("</","LESS-THAN SIGN + SLASH character token");
    this._reconsumeChar();
  };
};

//8.2.4.13 RCDATA end tag name state
Tokenizer.prototype._rcDataEndTagNameState = function(c){
  //console.log('tokenizer > _rcDataEndTagNameState c=' +  c );
  var flagAnythingElse = true;
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    if(this._isAppropriateEndTagToken()){
      this._state = BEFORE_ATTRIBUTE_NAME;
      flagAnythingElse = false;
    }
  }
  else if(c === "/"){
    if(this._isAppropriateEndTagToken()){
      this._state = SELF_CLOSING_START_TAG;
      flagAnythingElse = false;
    }
  }
  else if(c === ">"){
    if(this._isAppropriateEndTagToken()){
      this._state = DATA;
      this._emitCurrentTagToken();
      flagAnythingElse = false;
    }
  }
  else if(this._isUpperCase(c)){
    this._tempBuffer += this._toLowerCase(c);
    this._currentTagTokenName += this._toLowerCase(c);
    flagAnythingElse = false;
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    this._currentTagTokenName  += c;
    flagAnythingElse = false;
  }
  else{
    this._state = RCDATA;
    this._emitToken("</" + this._tempBuffer, "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
    flagAnythingElse = false;
  }
  if(flagAnythingElse = true){
    this._state = RCDATA;
    this._emitToken("</" + this._tempBuffer, "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
}

//8.2.4.14 RAWTEXT less-than sign state
Tokenizer.prototype._rawTextLessThanSignState = function(c){
  if(c === "/"){
    this._tempBuffer = "";
    this._state = RAWTEXT_END_TAG_OPEN;
  }
  else{
    this._state = RAWTEXT;
    this._emitToken("<", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  }
}

//8.2.4.15 RAWTEXT end tag open state
Tokenizer.prototype._rawEndTagOpenState = function(c){
  if(this._isUpperCase(c)){
    c = this._toLowerCase(c);
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = RAWTEXT_END_TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = RAWTEXT_END_TAG_NAME;
  }
  else{
    this._state = RAWTEXT;
    this._emitToken("</", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  }
}

//8.2.4.16 RAWTEXT end tag name state
Tokenizer.prototype._rawTextEndTagNameState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    if(this._isAppropriateEndTagToken()){
      this._state = BEFORE_ATTRIBUTE_NAME
    }
  }
  else if(c === "/"){
    if(this._isAppropriateEndTagToken()){
      this._state = SELF_CLOSING_START_TAG;
    }
  }
  else if(c === ">"){
    if(this._isAppropriateEndTagToken()){
      this._state = DATA;
      this._emitCurrentTagToken();
    }
  }
  else if(this._isUpperCase(c)){
    this._currentTagTokenName += this._toLowerCase(c);
    this._tempBuffer += this._toLowerCase(c);
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    this._currentTagTokenName  += c;
  }
  else{
    this._state = RAWTEXT;
    this._emitToken("</" + this._tempBuffer, "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
}

//8.2.4.17 Script data less-than sign state
Tokenizer.prototype._scriptDataLessThanSignState = function(c){
  if(c === "/"){
    this._tempBuffer = "";
    this._state = SCRIPT_DATA_END_TAG_OPEN;
  }
  else if(c === "!"){
    this._tempBuffer = "";
    this._state = SCRIPT_DATA_ESCAPE_START;
    this._emitToken("<!", "LESS-THAN SIGN + EXCLAMATION MARK character token");
  }
  else{
    this._state = SCRIPT_DATA;
    this._emitToken("<", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  }
}

//8.2.4.18 Script data end tag open state
Tokenizer.prototype._scriptDataEndTagOpenState = function(c){
  if(this._isUpperCase(c)){
    c = this._toLowerCase(c);
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = SCRIPT_DATA_END_TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = SCRIPT_DATA_END_TAG_NAME;
  }
  else{
    this._state = SCRIPT_DATA;
    this._emitToken("</", "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
}

//8.2.4.19 Script data end tag name state
Tokenizer.prototype._scriptDataEndTagNameState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    if(this._isAppropriateEndTagToken()){
      this._state = BEFORE_ATTRIBUTE_NAME
    }
  }
  else if(c === "/"){
    if(this._isAppropriateEndTagToken()){
      this._state = SELF_CLOSING_START_TAG;
    }
  }
  else if(c === ">"){
    if(this._isAppropriateEndTagToken()){
      this._state = DATA;
      this._emitCurrentTagToken();
    }
  }
  else if(this._isUpperCase(c)){
    this._currentTagTokenName += this._toLowerCase(c);
    this._tempBuffer += this._toLowerCase(c);
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    this._currentTagTokenName  += c;
  }
  else{
    this._state = SCRIPT_DATA;
    this._emitToken("</" + this._tempBuffer, "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
};

//8.2.4.20 Script data escape start state
Tokenizer.prototype._scriptDataEscapeStartState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_ESCAPE_START_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else{
    this._state = SCRIPT_DATA;
    this._reconsumeChar();
  };
};

//8.2.4.21 Script data escape start dash state
Tokenizer.prototype._scriptDataEscapeStartDashState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_ESCAPED_DASH_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else{
    this._state = SCRIPT_DATA;
    this._reconsumeChar();
  };
};

//8.2.4.22 Script data escaped state
Tokenizer.prototype._scriptDataEscapeState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_ESCAPED_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._state = DATA;
    //parser error
    this._emitToken(c, "Parse error");
    this._reconsumeChar();
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
};

//8.2.4.23 Script data escaped dash state
Tokenizer.prototype._scriptDataEscapeDashState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_ESCAPED_DASH_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    //parser error
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.24 Script data escaped dash dash state
Tokenizer.prototype._scriptDataEscapeDashDashState = function(c){
  if(c === "-" ){
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
  }
  else if(c === ">" ){
    this._state = SCRIPT_DATA;
    this._emitToken(">", "GREATER-THAN SIGN character token");
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    //parser error
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken(c, "Current input character as token");
  };
};

//8.2.4.25 Script data escaped less-than sign state
Tokenizer.prototype._scriptDataEscapedLessThanSignState = function(c){
  if(c === "/"){
    this._tempBuffer = "";
    this._state = SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
  }
  else if(this._isUpperCase(c)){
    this._tempBuffer = this._toLowerCase(c);
    this._state = SCRIPT_DATA_DOUBLE_ESCAPE_START;
    this._emitToken("<" + c, "LESS-THAN SIGN + curent char character token ");
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer = c;
    this._state = SCRIPT_DATA_DOUBLE_ESCAPE_START;
    this._emitToken("<" + c, "LESS-THAN SIGN + curent char character token ");
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken("<", "LESS-THAN SIGN character token");
    this._reconsumeChar();
  }
};

//8.2.4.26 Script data escaped end tag open state
Tokenizer.prototype._scriptDataEscapedEndTagOpenState = function(c){
  if(this._isUpperCase(c)){
    this._currentTagTokenName = this._toLowerCase(c);
    this._tempBuffer += c;
    this._state = SCRIPT_DATA_ESCAPED_END_TAG_NAME;
  }
  else if(this._isLowerCase(c)){
    this._currentTagTokenName = c;
    this._tempBuffer += c;
    this._state = SCRIPT_DATA_ESCAPED_END_TAG_NAME;
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken("</", "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
};

//8.2.4.27 Script data escaped end tag name state
Tokenizer.prototype._scriptDataEndTagNameState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    if(this._isAppropriateEndTagToken()){
      this._state = BEFORE_ATTRIBUTE_NAME
    }
  }
  else if(c === "/"){
    if(this._isAppropriateEndTagToken()){
      this._state = SELF_CLOSING_START_TAG;
    }
  }
  else if(c === ">"){
    if(this._isAppropriateEndTagToken()){
      this._state = DATA;
      this._emitCurrentTagToken();
    }
  }
  else if(this._isUpperCase(c)){
    this._currentTagTokenName += this._toLowerCase(c);
    this._tempBuffer += this._toLowerCase(c);
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    this._currentTagTokenName  += c;
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._emitToken("</" + this._tempBuffer, "LESS-THAN SIGN + SLASH + tempbuffer character token");
    this._reconsumeChar();
  }
}

//8.2.4.28 Script data double escape start state
Tokenizer.prototype._scriptDataDoubleEscapeStartState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " " || c === "/" || c === ">"){
    if(this._tempBuffer === "script"){
      this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    }
    else{
      this._state = SCRIPT_DATA_ESCAPED;
    }
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else if(this._isUpperCase(c)){
    this._tempBuffer += this._toLowerCase(c);
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else{
    this._state = SCRIPT_DATA_ESCAPED;
    this._reconsumeChar();
  }
};

//8.2.4.29 Script data double escaped state
Tokenizer.prototype._scriptDataDoubleEscapedState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
};

//8.2.4.30 Script data double escaped dash state
Tokenizer.prototype._scriptDataDoubleEscapedDashState = function(c){
  if(c === "-" ){
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
    this._emitToken("<", "LESS-THAN SIGN character token");
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
};

//8.2.4.31 Script data double escaped dash dash state
Tokenizer.prototype._scriptDataDoubleEscapedDashDashState = function(c){
  if(c === "-" ){
    this._emitToken("-", "HYPHEN-MINUS character token");
  }
  else if(c === "<" ){
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
    this._emitToken("<", "LESS-THAN SIGN character token");
  }
  else if(c === ">" ){
    this._state = SCRIPT_DATA;
    this._emitToken(">", "GREATER-THAN SIGN character token");
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    this._emitToken("�", "REPLACEMENT CHARACTER character token");
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
};

//8.2.4.32 Script data double escaped less-than sign state
Tokenizer.prototype._scriptDataDoubleEscapeLessThanSignState = function(c){
  if(c === "/" ){
    this._tempBuffer = "";
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED_END_STATE;
    this._emitToken("/", "SLASH character token");
  }
  else{
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    this._reconsumeChar();
  };
};

//8.2.4.33 Script data double escape end state
Tokenizer.prototype._scriptDataDoubleEscapeEndState = function(c){
  if(c === "\t" || c === "\n" || c === "\f" || c === " " || c === "/" || c === ">"){
    if(this._tempBuffer === "script"){
      this._state = SCRIPT_DATA_ESCAPED;
    }
    else{
      this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    }
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else if(this._isUpperCase(c)){
    this._tempBuffer += this._toLowerCase(c);
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else if(this._isLowerCase(c)){
    this._tempBuffer += c;
    //emit current input char as char token
    this._emitToken(c, "Current input character as token");
  }
  else{
    this._state = SCRIPT_DATA_DOUBLE_ESCAPED;
    this._reconsumeChar();
  }
};

//8.2.4.34 Before attribute name state
Tokenizer.prototype._beforeAttributeNameState = function(c){
  var flagAnythingElse = false;
  if(c === "\t" || c === "\n" || c === "\f" || c === " "){
    //ignore the character
  }
  if(c === "/" ){
    this._state = SELF_CLOSING_START_TAG;
  }
  else if(c === ">" ){
    this._state = DATA;
    this._emitCurrentTagToken();
  }
  else if(this._isUpperCase(c)){
    this._attributes.push({"name":this._toLowerCase(c),"value":""});
    this._state = ATTRIBUTE_NAME;
  }
  else if(this._isLowerCase(c)){
    this._attributes.push({"name":c,"value":""});
    this._state = ATTRIBUTE_NAME;
  }
  else if(c === null){
    //parser error
    this._emitToken(c, "Parse error");
    this._attributes.push({"name":"�","value":""});
    this._state = ATTRIBUTE_NAME;
  }
  if(c === "\"" || c === "\'" || c === "<" || c === "="){
    //parser error
    this._emitToken(c, "Parse error");
    flagAnythingElse = true;
  }
  else if(c === "EOF"){
    //end of line
    //TO BE IMPLEMENTED what is EOF in node.js???
    this._emitToken(c, "Parse error");
    this._state = DATA;
    this._reconsumeChar();
  }
  else{
    flagAnythingElse = true;
  }

  if(flagAnythingElse){
    this._attributes.push({"name":c,"value":""});
    this._state = ATTRIBUTE_NAME;
  }
};
