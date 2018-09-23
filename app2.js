console.log("start");
function puts(str){//関数putsは非同期処理を関数化
  //時間のかかる処理を内包して、thenでコールバック関数を呼び出して非同期処理を実装している.
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(str);
    },1000);
  });
}

puts("async").then(function(result){
  console.log(result);
});
//resolve,reject.callbackObjectでresult.resultはresolveやrejectに返ってきた値を返す。
console.log("end")
