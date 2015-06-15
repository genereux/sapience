var Frontier = require('./frontier');
var MyRequest = require('./request.js');
var UrlExtractor = require('./urlExtractor.js');

//feed the frontier with some random initial source
var f = new Frontier();
f.add('www.example.com');


while (f.hasData()){
  var url = f.get();
  var extractor = new UrlExtractor();
  var req = new MyRequest(url,{
    ondata: function(chunk){
      extractor.write(chunk);
    }
  });
  req.get();
}
