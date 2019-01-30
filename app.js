let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path');
// const Websocket = require('ws')
const WebsocketClient = require('websocket').w3cwebsocket;
let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  let err=new Error('Not Found');
  err.status = 404;
  next(err);
});

const transactionParser = require('ripple-lib-transactionparser');
const parseBalanceChanges = transactionParser.parseBalanceChanges
const servers = [
  'wss://s1.ripple.com',
  'wss://s2.ripple.com'
]
const address ='rwuwx3gWe4MC9aLgMm74hFQkJLc5fEz672';//your wallet address
const ISSUER ='rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B';//holding your IOU's issure
const wsc = new WebsocketClient('wss://s1.ripple.com:443');
const requestFormat = {
  id: 1,
  command: "account_info",
  account: "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}

const subscribe = (wsc) => {
    wsc.onerror = (error)=>{
      console.log(error);
      wsc.close();
    }
    wsc.onopen = ()=>{
      console.log('websocket server connected');
      wsc.send(JSON.stringify(requestFormat))
    }
    wsc.onmessage = (msg)=>{
     const data = JSON.parse(msg.data);
     console.log(data);
      //  const balanceChanges = parserBalanceChanges(data)
      //  transactionlog(balanceChanges,data,transaction);
    }
    wsc.onclose = (e)=>{
      console.log('reconnect web socket',e.code,e.reason);
      wsc.close();
    }
 }
const transactionlog = (balanceChanges,transaction)=>{
  console.log(balanceChanges)
  console.log(transaction)
}
subscribe(wsc);


// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
