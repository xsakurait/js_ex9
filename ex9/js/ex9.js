//webcam映像表示するvideoタグをオブジェクト化
let videoObj = document.getElementById("webcam-video");
let width = videoObj.width; //videoタグのwidth:480
let height = videoObj.height; //videoタグのheight

console.log("width=", width);
console.log("height=", height);

let captureObj = document.getElementById("camcap-canvas");
let convertObj = document.getElementById("convert-canvas");

//ボタンオブジェクト化
let capBtnObj = document.getElementById("capBtn");
let convBtnObj = document.getElementById("convBtn");

//captureとconvert表示するcanvasタグオブジェクト化
let capContext = captureObj.getContext("2d");
let convContext = convertObj.getContext("2d");

let selectObj = document.getElementById("select-bit");


// ブラウザがwebCamera取得可能か判断する
navigator.mediaDevices =
  navigator.mediaDevices || //最新のブラウザなど
  navigator.webkitGetUserMedia || //GoogleChrome
  navigator.mozGetUserMedia || //Mozilla Firefox
  navigator.msGetUserMedia; //Microsoft Internet Explorer

if (navigator.mediaDevices) {
  console.log("ブラウザはmediaDevicesに対応");
} else {
  window.alert("ブラウザはmediaDevicesに未対応");
}

//ブラウザ起動で呼び出す
function webcam() {
  //videoを取得してくださいということ
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      try {
        //streamの中に動画が入る
        videoObj.srcObject = stream;
        videoObj.play(); //動画を再生
      } catch (error) {
        videoObj.src = window.URL.createObjectURL(stream);
        videoObj.play();
      }
    })
    .catch(function (error) {
      window.alert("WebCamエラー：" + error);
    });
}

let flg_cap = false; //キャプチャされていないときは、画像変換できないようにする

function capture() {
  flg_cap = true;
  console.log("キャプチャー");
  if (flg_cap) {
    //capContextに書き込む
    capContext.drawImage(videoObj, 0, 0, width, height);
  } else {
    window.alert("キャプチャできません");
  }
}

function convert() {
  console.log("画像変換");
  if (flg_cap) {
    //キャプチャ済みなら
    //書き込まれたcapContextからImafeDataオブジェクトを取得
    //戻り値はImageDataオブジェクト（画素値＋縦横）
    let imageObj = capContext.getImageData(0, 0, width, height);
    let bit= selectObj[selectObj.selectedIndex].value;
    //画像変換処理
    //pixにはRGB+A(アルファー値：不透明度を表す　１００％な完全不透明)を入れる
    let pix = imageObj.data; //ImageDataオブジェクトの画像データ部
    let x, y, pos; //x,yは画像座標、posは一次元の位置
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        //始点(１次元の位置)
        pos = (x + y * width) * 4;
        // //濃淡反転(RGB変換)
        // pix[pos] = 255 - pix[pos]; //R
        // pix[pos + 1] = 255 - pix[pos + 1]; //G
        // pix[pos + 2] = 255 - pix[pos + 2]; //B
        gray = Math.round(
          pix[pos] * 0.3 + pix[pos + 1] * 0.59 + pix[pos + 2] * 0.11
        );
        regray = parseInt(gray / (256 / bit)) * parseInt(256 / (bit - 1));
        pix[pos] = regray;
        pix[pos + 1] = regray;
        pix[pos + 2] = regray;

        //多値化＝１bitから２bit素子を増やすこと
        //２値化＝ 0=黒（濃度地）,1=白としてある一定の画素ちを基準値（しきい値）とし、上か下で分け、画像を黒白に変換すること
        //画像には1bitの二値画像（白黒）と8bitのグレー画像、合計24bitのRGBカラー画像
      }
      //convert画像をブラウザに反映
      convContext.putImageData(imageObj, 0, 0);
    }
    //convContextに書き込む
  } else {
    window.alert("キャプチャ画像を変換できません");
  }
}

window.addEventListener(
  "load",
  function () {
    webcam();
  },
  false
);

capBtnObj.addEventListener(
  "click",
  function () {
    capture();
  },
  false
);

convBtnObj.addEventListener(
  "click",
  function () {
    convert();
  },
  false
);

selectObj.addEventListener(
  "change",
  function () {
    convert();
  },
  false
);
