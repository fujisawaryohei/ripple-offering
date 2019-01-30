let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path');

const WebsocketClient = require('websocket').w3cwebsocket;
const transactionParser = require('ripple-lib-transactionparser');
const parseBalanceChanges = transactionParser.parseBalanceChanges
const address ='';//your wallet address
const ISSUER ='';//holding your IOU's issure
const wsc = new WebsocketClient('wss://s1.ripple.com:443');
//requestFormat refelence→https://developers.ripple.com/websocket-api-tool.html
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

subscribe(wsc)
