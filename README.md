# Walls and Stairs
<br>

## Hakkında
Bu proje; HTML, CSS ve JavaScript teknolojileri kullanılarak Web Tabanlı Programlama dersi ödevi için Canvas ile hazırlanmış bir 2D oyundur. **Oyunun demo adresine şu bağlantı aracılığıyla erişebilirsiniz: http://wallsandstairs.eu5.org/**

## Kullanılan Teknolojiler
##### -HTML
##### -CSS
##### -JavaScript

## Hikaye ve Senaryo Akışı
Oyunda, savaş sırasında düşmekte olan bir kalenin içindeki asker kontrol edilmektedir. Giriş ekranında çizimlerini kendim yaptığım 3 karakter arasından biri seçilerek oyuna giriş yapılmaktadır. Seçilecek karakterin üstüne tıklandıktan sonra JavaScript aracılığıyla CSS kodlarında bir dizi değişiklik yapılarak giriş ekranının "display" özelliği "none" yapılmakta ve canvasın "display" özelliği "block" yapılmakta, bu sayede giriş ekranı kaybolup oyun ekranı belirmektedir. Bu ekranın görünüşü şu şekildedir;
![Screenshot](https://github.com/basturkerhan/walls-and-stairs-2d-game/blob/main/readme-images/0.png)

Oyun içinde karakterin karşısına farklı genişliklerde surlar gelmektedir. Temelde sadece en ince duvarın resim dosyası projenin içinde vardır. Rastgele üretilen sur genişliği değişkenine göre bu ince duvarlar birbiri ardına üretilen sayıda eklenerek daha geniş duvarları oluşturmaktadır. 
```
for(var i=0; i<walls.length; i++) {
  for(var j=0; j<walls[i].blocks; j++) {
    ctx.drawImage(wall,walls[i].x + wallWidth*j, walls[i].y);
  }
...
```
Kodu ile de aynı resim yan yana belirlenen sayıda eklenerek farklı genişliklerde surlar oluşturmaktadır.
<br>
Bu surlar oyun içinde şu şekilde görünecektir;
![Screenshot](https://github.com/basturkerhan/walls-and-stairs-2d-game/blob/main/readme-images/1.png)

## Oynanış
Karakterin klavyeden basacağı boşluk tuşu akabinde bulunduğu konum hizasından başlayacak şekilde bir merdiven uzamaya başlamaktadır. Bu merdivenin boyu, yine klavyeden basılacak bir tuş ile uzamasını durduracaktır. Merdiven, y ekseninde yani yukarı doğru uzamaktadır. Oyuncu, oluşturduğu merdiven; farklı genişliklerde ve farklı uzaklıklarda beliren bu surların birinden diğerine geçebileceği kadar uzamış olduğunu düşündüğü zaman tekrar klavyeden boşluk tuşuna basarak merdiven uzamasını durduracaktır. Ardından oluşan bu merdiven karakterin yürüyebileceği x eksenine taşınacak ve asker, surlar arasında geçiş yapmaya çalışacaktır. Başarılı olan geçişin ardından skor hanesine 1 puan eklenecek, bulunduğu sur ekranın en soluna kayacak ve yeni bir sur daha oluşacaktır. Aşağıdaki resimde çizilen bir merdivenin ardından karakterin karşıya geçme anı görülmektedir.
![Screenshot](https://github.com/basturkerhan/walls-and-stairs-2d-game/blob/main/readme-images/2.png)

### Yeni Sur Nasıl Oluşuyor?
Oyun içinde aynı anda sadece 2 adet sur olmaktadır. Yani "walls" dizisinin içinde oyunun her anında sadece 0 ve 1 indislerinde değer yer almaktadır. 0 indisinde karakterin o an bulunduğu sur ve bilgileri, 1 indisinde ise hedef sur bilgileri yer almaktadır. Karakter hedef sura geçtiği zaman bir önceki indiste bulunan değer silinmekte ve artık 0 indisinde bu sur yer almaktadır. Hemen ardından da 1. indis için yeni bir sur oluşmaktadır. Oyun sona erene kadar bu döngü devam etmektedir. Yeni sur ise şu kod parçacıkları sayesinde eklenmektedir;
```
var blockNum = 1 + Math.floor(Math.random()*3);
  walls.push({
    x: (walls[1].x+walls[1].blocks*wallWidth) + 150 + Math.floor(Math.random()*300),
    y: cvs.height - wallHeight,
    blocks: blockNum
})
walls.splice(0,1);
```
Kodundaki blockNum ile rastgele bir sayı üretilerek yeni gelecek sur genişliğinin ne kadar olacağı belirlenmekte ve walls.splice(0,1); kodu ile de ilk indisteki geçilen blok silinmektedir.

### Oyunun Sona Erme Koşulu
Oyunun sona erme koşulu, karakterin çizilen merdiven ile güvenli bir şekilde karşı surlara geçememesine bağlıdır. Eğer çizilen merdivenin boyu surların başladığı yerden kısa kalırsa, veya surların bittiği yerden uzun kalırsa bu durumda oyun sonlanacaktır. Sona erme durumu koda döküldüğü zaman şu kod parçacığı ortaya çıkacaktır;
```
var distance = nextWallEndPos > stickEndPos ? nextWallEndPos : stickEndPos;

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
```
Distance değişkeni karakterin yürüyeceği yerin adresini tutmaktadır. Eğer merdiven boyu surun bittiği yerden daha uzunsa merdivenin sonuna kadar gitmesi, eğer merdiven surlara başarılı bir şekilde ulaştıysa da karakterin, surların bittiği yere kadar gelebilmesi, tam ortada durmaması için kullanılmaktadır.
İf koşulu içinde bir dizi operatör ile sona erme koşulu belirtilmiştir.
<br>
**Eğer ortada bir merdiven varsa VE (merdivenin boyu surun başladığı yerden kısaysa VEYA bittiği yerden uzunsa)**
<br>
bu durumda oyun sona erecektir.

## Local Storage Bölümü Aracılığıyla Cihazdaki En Yüksek Skorun Alınması
JavaScript ile tarayıcı belleğine oyunda alınan en yüksek skor kaydedilmektedir. Aşağıda bu kısmın kodları yer almaktadır;
```
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
```
Burada, eğer tarayıcı belleğinde daha önce herhangi bir skor kaydı yoksa en yüksek skora 0 değeri atılmakta, eğer varsa bu değer kullanılmakta ve oyun sonu yapılancak kontrolde eğer mevcut skor en yüksek skordan büyükse bellekte yer alan değerin güncellenmesi sağlanmaktadır.

## Oyunu Kendi Cihazımda Nasıl Çalıştırabilirim?
Oyunu demo adresinden oynamak yerine kendi cihazınızda çalıştırmak isterseniz, bu github reposundan indirdiğiniz sıkıştırılmış dosya içindeki klasörü bir dizine alıp ardından içindeki index.html dosyasını herhangi bir tarayıcı üzerinde (Chrome ve Firefox tavsiye edilir) açmanız yeterli olacaktır.
