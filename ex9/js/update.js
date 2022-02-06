//function update(){

    let day = new Date( document.lastModified);//Dateオブジェクト
    let y = day.getFullYear();  //年を取得
    let m = day.getMonth() + 1; //月を取得
    let d = day.getDate();      //日にちを取得
    document.write("<br><br>Last Update: " + y +"年"+ m +"月"+ d +"日");
//}
    
    
