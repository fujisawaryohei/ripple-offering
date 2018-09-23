//node_module loading
let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
//Core module
let path = require('path');
//File module
//let indexRouter = require('./routes/index');
//let usersRouter = require('./routes/users');
//let samplesRouter = require('./routes/samples');
//module.exportsで格納されたオブジェクトが返ってくる。今回はrouter
const Websocket = require('ws')
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/samples',samplesRouter);

// catch 404 and forward to error handler エラーハンドリング
app.use(function(req, res, next) {
  let err=new Error('Not Found');
  err.status = 404;
  next(err);
  //next(createError(404));
});
//nextはコールバック引数。非同期的な書き方をnextで実現できる。

const transactionParser = require('ripple-lib-transactionparser');
const parseBalanceChanges = transactionParser.parseBalanceChanges

const servers = [
  'wss://s1.ripple.com',
  'wss://s2.ripple.com'
]
const address ='';//your wallet address

const ISSUER ='';//holding your IOU's issure

let ws = new Websocket(servers[0] + ':443')
  const subscribe = () => {
  let ws = new Websocket(servers[0] + ':443')
    ws.on('open',() => {
      console.log('connected web socket')
    //JSON.stringify JSONフォーマットを成形する。
      ws.send(JSON.stringify({
        id:1,
        command:"subscribe",
        accounts:address,
        streams: [
          "transactions"
      ]
      }))
    })
    ws.on('message',(message)=>{
      const data=JSON.parse(message)
      if (data.type === "transaction"){
        const balanceChanges = parseBalanceChanges(data.meta)
        transactionlog(balanceChanges,data.transaction)
      }
    })
    ws.on('error',(e)=>{
      console.log(e)
      ws.close();
    })
    ws.on('close',(e)=>{
      console.log('reconnect web socket',e.code,e.reason)
      ws.close()
      subscribe(ws)
    })
 }

const transactionlog = (balanceChanges,transaction)=>{
  console.log(balanceChanges)
  console.log(transaction)
}

subscribe(ws)

// error handler development環境でのエラー出力処理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
