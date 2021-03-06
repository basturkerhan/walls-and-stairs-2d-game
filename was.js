var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

function isMobileDevice() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

//! ----------- D????ER DE??????KENLER -----------------------------------------
var wallWidth = 35;
var wallHeight = 160;
var isGameOver = false;
var score = 0;
var sceneTransitionSpeed = 6;
var stairExtensionQuantity = 8;
var soldierWalkSpeed = 2; // buray?? de??i??tirirsem ??nemli ayar k??sm??n?? da de??i??tirece??im
var highscore;
var playerId; // hangi karakterin se??ildi??i bilgisi
var selectPlayerMenuSkipped = false; // karakter se??me ekran?? ge??ildi mi bilgisi
var control = false;
var headerMsg =  `Bo??luk tu??una bir kere bas, merdiven yeterince uzay??nca tekrar basarak durdur!`;

var characterImages = document.querySelectorAll(".characterImage");
var selectPlayerMenu = document.querySelector("#select-player");
var gameArea = document.querySelector("#canvas");
var body = document.querySelector("body");

for (let i = 0; i < characterImages.length; i++) {
  characterImages[i].addEventListener("click", () => {
    playerId = characterImages[i].getAttribute("id");
    selectPlayerMenu.style.display = "none";
    gameArea.style.display = "block";
    body.style.backgroundImage = "none";
    body.style.backgroundColor = "rgb(2,12,13)";
    selectPlayerMenuSkipped = true;
    control = true;
  });
}

//! ----------- RES??M Y??KLEMELER?? -----------------------------------------
var bg = new Image();
var soldier = new Image();
var wall = new Image();
var floor = new Image();

bg.src = "images/bg.png";
wall.src = "images/wall.png";
floor.src = "images/floor.png";

//! ----------- SES Y??KLEMELER?? -----------------------------------------
var scoreSound = new Audio();
scoreSound.src = "sounds/score.mp3";
var gameOverSound = new Audio();
gameOverSound.src = "sounds/gameover.mp3";
var themeSound = new Audio();
themeSound.src = "sounds/theme.mp3";
themeSound.loop = true;
themeSound.volume = 0.25;

//! ----------- BU C??HAZDAK?? EN Y??KSEK SKORU LOCAL STORAGEDEN ALMA -----------------------------------------
window.onload = function () {
  highscore = localStorage.getItem("highscore");
  if (!highscore) {
    localStorage.setItem("highscore", 0);
    highscore = 0;
  }
};

function setHighScoreInLocalStorage() {
  if (score > highscore) {
    localStorage.setItem("highscore", score);
  }
}

//! ----------- SURLAR -----------------------------------------
var walls = [];
walls[0] = {
  x: 0,
  y: cvs.height - wallHeight,
  blocks: 2,
};
walls[1] = {
  x: cvs.width - (128 + Math.floor(Math.random() * 200)),
  y: cvs.height - wallHeight,
  blocks: 1 + Math.floor(Math.random() * 3),
};

//! ----------- Y??R??ME AYARLARI -----------------------------------------
var soldierPos = {
  x: walls[0].blocks * wallWidth - 25,
  y: cvs.height - wallHeight - 30,
};
var isWalkable = false;

//! ----------- GE?????? AYARLARI -----------------------------------------
var isNextScene = false;

//! ----------- MERD??VEN AYARLARI -----------------------------------------
document.addEventListener("keydown", extendStickStartStop);
var isDrawStick = false;
var stick = {
  stickWidth: 6,
  len: 0,
};

function extendStickStartStop(e) {
  // asker y??r??rken ve senaryo ge??erken merdiven ??izemesin ayar??
  if (e.keyCode == 32) {
    if (isWalkable === false && isNextScene === false)
      isDrawStick = !isDrawStick;
  } else if (e.type === "click" && isWalkable === false && isNextScene === false) {
    isDrawStick = !isDrawStick;
    }
}

//! ----------- DRAW -----------------------------------------
function draw() {
  if (selectPlayerMenuSkipped) {
    if (control) {
      
      soldier.src = `images/${playerId}.png`; // hangi karakter se??ildiyse onun resmi gelsin
      control = false;

      if(isMobileDevice()) {
          headerMsg =  `Ekranda bir yere bas, merdiven yeterince uzay??nca tekrar bir yere basarak durdur!`
          document.addEventListener("click", extendStickStartStop);
      }

    }
    ctx.drawImage(bg, 0, 0);
    ctx.fillStyle = "#0E2733";

    themeSound.play();

    // Duvar cizimi
    for (var i = 0; i < walls.length; i++) {
      for (var j = 0; j < walls[i].blocks; j++) {
        ctx.drawImage(wall, walls[i].x + wallWidth * j, walls[i].y);
      }
      if (isNextScene) {
        walls[i].x -= sceneTransitionSpeed;
        soldierPos.x -= sceneTransitionSpeed / walls.length;
      }

      if (walls[i].x + walls[i].blocks * wallWidth <= 0) {
        var blockNum = 1 + Math.floor(Math.random() * 3);
        walls.push({
          // alttaki de??eri daha hassas ayarlayaca????m
          x:
            walls[1].x +
            walls[1].blocks * wallWidth +
            150 +
            Math.floor(Math.random() * 300),
          y: cvs.height - wallHeight,
          blocks: blockNum,
        });
        walls.splice(0, 1);
      }
    }

    // di??er blo??a ge??ildi??i zaman o blo??un en sola kaymas??ndaki bugu ??nlemek i??in ayar
    if (
      walls[0].x >= 0 &&
      walls[0].x <= sceneTransitionSpeed - 1 &&
      isNextScene
    ) {
      walls[0].x = 0;
      isNextScene = false;
    }

    // ??ubuk Uzatma ????lemi
    if (isDrawStick) {
      stick.len -= stairExtensionQuantity;
      ctx.fillRect(
        walls[0].blocks * wallWidth,
        walls[0].y,
        stick.stickWidth,
        stick.len
      );
      // bulundu??un surun geni??li??inden ba??lat, duvar y??ksekli??inin bitti??i yerden ??izmeye ba??la, ??izgi kal??nl?????? stickWidth, uzunlu??u stick.len
    } else if (isDrawStick === false && stick.len !== 0) {
      // buraya art??k ??ubuk uzamas??n?? bitirdikten sonra olacak ??eyler gelecek
      ctx.fillRect(
        walls[0].blocks * wallWidth,
        walls[0].y,
        Math.abs(stick.len),
        stick.stickWidth
      );
      isWalkable = true;
    }

    // Asker Y??r??me Sistemi
    var stickEndPos =
      Math.abs(stick.len) + walls[0].x + walls[0].blocks * wallWidth;
    var nextWallEndPos = walls[1].x + walls[1].blocks * wallWidth;
    var distance = nextWallEndPos > stickEndPos ? nextWallEndPos : stickEndPos;

    // Asker y??r??rken olacak ??eyler
    if (isWalkable) {
      if (soldierPos.x + soldier.width <= distance) {
        //! Game Over Rules
        soldierPos.x += soldierWalkSpeed;
        if (
          stick.len !== 0 &&
          (stickEndPos < walls[1].x || stickEndPos > nextWallEndPos)
        ) {
          isGameOver = true;
          if (soldierPos.x + soldier.width >= stickEndPos) {
            gameOverSound.play();
            var confirmBtn = confirm(
              `??zg??n??m asker, bu surlara daha fazla dayanamad??k.`
            );
            setHighScoreInLocalStorage();
            if (confirmBtn) {
              location.reload();
              return true;
            }
          }
        }
      }
    }

    //! BURASI ??NEML?? AYARLAR. OYUNCU SON KALEYE GELD?????? ZAMAN SIRADAK?? KALE SPAWN OLSUN ??LK KALE G??TS??N VS.
    if (
      (soldierPos.x + soldier.width === nextWallEndPos ||
        soldierPos.x + soldier.width === nextWallEndPos + 1) &&
      !isGameOver
    ) {
      stick.len = 0;
      if (!isNextScene) {
        score++;
        scoreSound.play();
      }
      isNextScene = true;
      isWalkable = false;
    }

    // Askerin ??izimi
    ctx.drawImage(soldier, soldierPos.x, soldierPos.y);
    // zemin cizimi
    ctx.drawImage(floor, 0, cvs.height - floor.height);

    // Skor Yazma Alan??
    ctx.fillStyle = "rgba(14,39,51,1)";
    ctx.textAlign = "center";

    ctx.font = "18px Arial";
    ctx.fillText(
     headerMsg,
      cvs.width / 2,
      50
    );

    ctx.fillStyle = "rgba(14,39,51,0.7)";
    ctx.font = "25px Arial";
    ctx.fillText(`Cihazdaki En Y??ksek: ${highscore}`, cvs.width / 2, 90);

    ctx.font = "50px Arial";
    ctx.fillText(`${score}`, cvs.width / 2, 150);
  }

  requestAnimationFrame(draw);
}

//! ----------- RUN COMMAND -----------------------------------------
draw();
