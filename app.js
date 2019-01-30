//reference → https://developers.ripple.com/server_info.html
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path');
let config = require('config');

const WebsocketClient = require('websocket').w3cwebsocket;
const transactionParser = require('ripple-lib-transactionparser');
const parseBalanceChanges = transactionParser.parseBalanceChanges
const address = config.env.address;//your wallet address
const ISSUER = config.env.issuer;//holding your IOU's issure
const wsc = new WebsocketClient('wss://s1.ripple.com:443');
//requestFormat refelence→https://developers.ripple.com/websocket-api-tool.html
const requestFormat = {
//sample JSON
   id: 4,
   command: "book_offers",
   taker: "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  taker_gets: {
    currency: "XRP"
  },
  "taker_pays": {
    currency: "USD",
    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  limit: 10
}

const subscribe = (wsc) => {
    wsc.onerror = (error)=>{
      console.log(error);
      wsc.close();
      subscribe(wsc);
    }
    wsc.onopen = ()=>{
      console.log('websocket server connected');
      wsc.send(JSON.stringify(requestFormat))
    }
    wsc.onmessage = (msg)=>{
     const data = JSON.parse(msg.data);
     console.log(data.resultoffers);
      //  const balanceChanges = parserBalanceChanges(data)
      //  transactionlog(balanceChanges,data,transaction);
    }
    wsc.onclose = (e)=>{
      console.log('reconnect web socket',e.code,e.reason);
      wsc.close();
      subscribe(wsc);
    }
}

const transactionlog = (balanceChanges,transaction)=>{
  console.log(balanceChanges)
  console.log(transaction)
}

subscribe(wsc)
