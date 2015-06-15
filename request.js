var http = require('http');

function MyRequest(url, callbacks){
  this._url = url;
  this._options = {
    host: this._url,
    path: '/index.html'
  };
  this._callbacks = callbacks || {};
  this._bodyChunks = [];
}

//download resource from web using the current options
MyRequest.prototype.get = function(){
  //keep ref to MyRequest instance
  var self = this;
  var request = http.request(this._options, function(response) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));

    response.on('data', function (chunk) {
      self._ondata(chunk, self._bodyChunks);
    });
    response.on('end', function () {
      self._onend();
    });
  });

  request.on('error', function(e) {
    console.log('request   > ERROR: ' + e.message);
  });

  request.end();
};

//Process streamed parts here...
MyRequest.prototype._ondata = function(chunk,_bodyChunks){
  //console.log('_ondata: ' + chunk);
  _bodyChunks.push(chunk);
  //console.log('chunks size is: ' + chunk.length);
  if(this._callbacks.ondata) this._callbacks.ondata(chunk);
};

//Process the entire body here
MyRequest.prototype._onend = function(){
  var body = Buffer.concat(this._bodyChunks);
  console.log('request   > body size is: ' + body.length);

  if(this._callbacks.onend) this._callbacks.onend(body);
};

module.exports = MyRequest;
