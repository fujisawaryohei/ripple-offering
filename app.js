let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path');
const Websocket = require('ws')
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
const address ='';//your wallet address

const ISSUER ='';//holding your IOU's issure

let ws = new Websocket(servers[0] + ':443')
  const subscribe = () => {
  let ws = new Websocket(servers[0] + ':443')
    ws.on('open',() => {
      console.log('connected web socket')
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

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
