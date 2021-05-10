var cvs = document.getElementById('canvas');
var ctx = cvs.getContext("2d");


//! ----------- DİĞER DEĞİŞKENLER -----------------------------------------
var wallWidth = 35;
var wallHeight = 160;
var isGameOver = false;
var score = 0;
var sceneTransitionSpeed = 6;
var stairExtensionQuantity = 8;
var soldierWalkSpeed = 2; // burayı değiştirirsem önemli ayar kısmını da değiştireceğim
var highscore;
var playerId; // hangi karakterin seçildiği bilgisi
var selectPlayerMenuSkipped = false; // karakter seçme ekranı geçildi mi bilgisi
var control = false;

var characterImages = document.querySelectorAll('.characterImage');
var selectPlayerMenu = document.querySelector('#select-player');
var gameArea = document.querySelector('#canvas');
var body = document.querySelector('body');

for(let i=0; i<characterImages.length; i++) {
    characterImages[i].addEventListener("click", () => {
        playerId = characterImages[i].getAttribute('id');
        selectPlayerMenu.style.display = "none";
        gameArea.style.display = "block";
        body.style.backgroundImage = "none";
        body.style.backgroundColor = "rgb(2,12,13)";
        selectPlayerMenuSkipped = true;
        control = true;
    })
}


//! ----------- RESİM YÜKLEMELERİ -----------------------------------------
var bg = new Image();
var soldier = new Image();
var wall = new Image();
var floor = new Image();


bg.src = "images/bg.png";
wall.src = "images/wall.png";
floor.src = "images/floor.png";


//! ----------- SES YÜKLEMELERİ -----------------------------------------
var scoreSound = new Audio();
scoreSound.src = "sounds/score.mp3";
var gameOverSound = new Audio();
gameOverSound.src = "sounds/gameover.mp3";
var themeSound = new Audio();
themeSound.src = "sounds/theme.mp3";
themeSound.loop = true;
themeSound.volume = 0.25;


//! ----------- BU CİHAZDAKİ EN YÜKSEK SKORU LOCAL STORAGEDEN ALMA -----------------------------------------
window.onload=function() {
    highscore = localStorage.getItem("highscore");
    if(!highscore) {
        localStorage.setItem("highscore", 0);
        highscore = 0;
    }
}

function setHighScoreInLocalStorage() {
    if(score>highscore) {
        localStorage.setItem("highscore", score);
    }
}


//! ----------- SURLAR -----------------------------------------
var walls = []
walls[0] = {
    x: 0,
    y: cvs.height-wallHeight,
    blocks: 2
};
walls[1] = {
    x: cvs.width - ( 128+Math.floor(Math.random()*200) ),
    y: cvs.height-wallHeight,
    blocks: 1 + Math.floor(Math.random()*3)
};


//! ----------- YÜRÜME AYARLARI -----------------------------------------
var soldierPos = {
    x: walls[0].blocks*wallWidth-25,
    y: cvs.height-wallHeight-30
}
var isWalkable = false;


//! ----------- GEÇİŞ AYARLARI -----------------------------------------
var isNextScene = false;


//! ----------- MERDİVEN AYARLARI -----------------------------------------
document.addEventListener("keydown", extendStickStartStop);
var isDrawStick = false;
var stick = {
    stickWidth: 6,
    len: 0
}

function extendStickStartStop() {
    // asker yürürken ve senaryo geçerken merdiven çizemesin ayarı
    if(isWalkable===false && isNextScene===false)
        isDrawStick = !isDrawStick;
}


//! ----------- DRAW -----------------------------------------
function draw() {

    if(selectPlayerMenuSkipped) {
        if(control) {
            soldier.src = `images/${playerId}.png`; // hangi karakter seçildiyse onun resmi gelsin
            control = false;
        }
        ctx.drawImage(bg,0,0);
        ctx.fillStyle="#0E2733";

        themeSound.play();

        // Duvar cizimi
        for(var i=0; i<walls.length; i++) {
            for(var j=0; j<walls[i].blocks; j++) {
                ctx.drawImage(wall,walls[i].x + wallWidth*j, walls[i].y);
            }
            if(isNextScene) {
                walls[i].x -= sceneTransitionSpeed;
                soldierPos.x -= sceneTransitionSpeed/walls.length;
            }

            if( ((walls[i].x+walls[i].blocks*wallWidth) <= 0) ) {
                var blockNum = 1 + Math.floor(Math.random()*3);
                walls.push({
                    // alttaki değeri daha hassas ayarlayacağım
                    x: (walls[1].x+walls[1].blocks*wallWidth) + 150 + Math.floor(Math.random()*300),
                    y: cvs.height - wallHeight,
                    blocks: blockNum
                })
                walls.splice(0,1);
            }
        }

        // diğer bloğa geçildiği zaman o bloğun en sola kaymasındaki bugu önlemek için ayar
        if( walls[0].x >= 0 && walls[0].x <= (sceneTransitionSpeed-1) && isNextScene ) {
            walls[0].x = 0;
            isNextScene = false;
        }


        // Çubuk Uzatma İşlemi
        if(isDrawStick) {
            stick.len -= stairExtensionQuantity;
            ctx.fillRect(walls[0].blocks*wallWidth, walls[0].y, stick.stickWidth, stick.len);
            // bulunduğun surun genişliğinden başlat, duvar yüksekliğinin bittiği yerden çizmeye başla, çizgi kalınlığı stickWidth, uzunluğu stick.len    
        }
        else if(isDrawStick===false && stick.len!==0) {
            // buraya artık çubuk uzamasını bitirdikten sonra olacak şeyler gelecek
            ctx.fillRect(walls[0].blocks*wallWidth, walls[0].y, Math.abs(stick.len), stick.stickWidth);
            isWalkable = true;
        }

        // Asker Yürüme Sistemi
        var stickEndPos = (Math.abs(stick.len) + walls[0].x + walls[0].blocks*wallWidth);
        var nextWallEndPos = (walls[1].x + walls[1].blocks*wallWidth);
        var distance = nextWallEndPos > stickEndPos ? nextWallEndPos : stickEndPos;

        // Asker yürürken olacak şeyler
        if(isWalkable) {
            if( (soldierPos.x + soldier.width) <= distance ) {
                //! Game Over Rules
                soldierPos.x += soldierWalkSpeed;
                if( stick.len!==0 && (stickEndPos < walls[1].x || stickEndPos > nextWallEndPos) ) {
                    isGameOver = true;
                    if((soldierPos.x + soldier.width)>=stickEndPos) {
                        gameOverSound.play();
                        var confirmBtn = confirm(`Üzgünüm asker, bu surlara daha fazla dayanamadık.`);
                        setHighScoreInLocalStorage();
                        if(confirmBtn) {
                            location.reload();
                            return true;
                        }
                    }
                }
            }   
        }


        //! BURASI ÖNEMLİ AYARLAR. OYUNCU SON KALEYE GELDİĞİ ZAMAN SIRADAKİ KALE SPAWN OLSUN İLK KALE GİTSİN VS.
        if( ( (soldierPos.x + soldier.width)===nextWallEndPos || (soldierPos.x + soldier.width)===nextWallEndPos+1) 
        && !isGameOver ) {
            stick.len = 0;
            if(!isNextScene) {
                score++;
                scoreSound.play();
            }
            isNextScene = true;
            isWalkable = false;
        }


        // Askerin Çizimi
        ctx.drawImage(soldier, soldierPos.x, soldierPos.y);
        // zemin cizimi
        ctx.drawImage(floor,0,cvs.height-floor.height);

        // Skor Yazma Alanı
        ctx.fillStyle = "rgba(14,39,51,1)";
        ctx.textAlign = "center";

        ctx.font = "18px Arial";
        ctx.fillText(`Bir tuşa bir kere bas, merdiven yeterince uzayınca tekrar basarak durdur!`, cvs.width/2, 50);

        ctx.fillStyle = "rgba(14,39,51,0.7)";
        ctx.font = "25px Arial";
        ctx.fillText(`Cihazdaki En Yüksek: ${highscore}`, cvs.width/2, 90);

        ctx.font = "50px Arial";
        ctx.fillText(`${score}`, cvs.width/2, 150);
    }

    requestAnimationFrame(draw);
}

//! ----------- RUN COMMAND -----------------------------------------
draw();