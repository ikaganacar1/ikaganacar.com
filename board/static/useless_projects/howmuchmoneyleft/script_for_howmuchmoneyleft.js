function loop(){

    let start_date = new Date("03/30/2024");

    let now = new Date();

    let diff = (start_date.getTime() - now.getTime())/1000;

    let diff_days = -(Math.round(diff / (3600 * 24)));

    let balance = Math.round((10000-((-diff)*(10000/(365*24*60*60))))*100)/100
    
    if (balance <= 0) {
        document.getElementById("info_p").innerText = `${diff_days}. Gün. Yağmur'un süresi biti. Ödül sıfırlandı.`
    } else {
        document.getElementById("info_p").innerText = `${diff_days}. Gün ${balance} TL Para Ödülün Kaldı.`
    }
    
};

loop()
setInterval(loop,10000);