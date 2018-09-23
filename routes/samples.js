var express=require('express');
var router=express.Router();

router.get('/',function(req,res,next){
  var params={"値":"これはサンプルです"};
  res.header('Content-type','application/json; charset=utf-8')
  res.send(params);
});

router.get('/hello',function(req,res,next){
  var params={"result":"Hello World !"};
  res.header('Content-type','application/json; charset=utf-8')
  res.send(params);
});

router.get('/hello/:place',function(req,res,next){
  var params={"result":"Hello World!"+ "in" + req.params.place + "!"}
  res.header("Content-type","application/json; charset=utf-8")
  res.send(params);
})
module.exports=router; //module.exportsしたオブジェクトは外部ファイルでもrequireされたら参照したりする事ができる。ただ今回の場合は、app.js側でfile moduleとして呼び出している。
