// constructor
function Frontier(){
  this._queue = [];
  console.log('frontier  > created');
}

Frontier.prototype.get = function(){

  var item = this._queue.pop();
  return item;
};

Frontier.prototype.add = function(url){
  this._queue.push(url);
  console.log('frontier  > item pushed');
};

Frontier.prototype.hasData = function(){
  console.log('frontier  > length = ' +   this._queue.length);
  return (this._queue.length > 0);
};

module.exports = Frontier;
