export default function (value) {
  let theTime = parseInt(value);
  let theTime1 = 0;// 分
  let theTime2 = 0;// 小时
  let theTime3 = 0;// 天

  if(theTime > 60) {
    theTime1 = parseInt(theTime/60);
    theTime = parseInt(theTime%60);

    if(theTime1 > 60) {
      theTime2 = parseInt(theTime1/60);
      theTime1 = parseInt(theTime1%60);

      if(theTime2 > 24){
        //大于24小时
        theTime3 = parseInt(theTime2/24);
        theTime2 = parseInt(theTime2%24);
      }
    }
  }
  let result = '';

  if(theTime > 0){
    result = ''+parseInt(theTime)+'秒';
  }
  if(theTime1 > 0) {
    result = ''+parseInt(theTime1)+'分'+result;
  }
  if(theTime2 > 0) {
    result = ''+parseInt(theTime2)+'小时'+result;
  }
  if(theTime3 > 0) {
    result = ''+parseInt(theTime3)+'天'+result;
  }
  return result;
}
