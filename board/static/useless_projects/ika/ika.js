let humanRead = (num, intSep = ',', floatSep = '.') => {

    return new Intl
        .NumberFormat('en-US')
        .format(num)
        .replaceAll('.', floatSep)
        .replaceAll(',', intSep);

}

function loop() {

    let start_date = new Date("01/03/2004 00:45:00");

    const now = new Date();

    let diff = Math.round(-(start_date.getTime() - now.getTime()) / 1000);
    let diff_minutes = Math.round(diff / 60);
    let diff_hours = Math.round(diff_minutes / 60);
    let diff_days = Math.round(diff_hours / 24);
    let diff_years = (diff_days / 365).toFixed(2);

    document.getElementById("seconds").innerText = `${humanRead(diff)} seconds old.`;
    document.getElementById("minutes").innerText = `${humanRead(diff_minutes)} minutes old.`;
    document.getElementById("hours").innerText = `${humanRead(diff_hours)} hours old.`;
    document.getElementById("days").innerText = `${humanRead(diff_days)} days old.`;
    document.getElementById("years").innerText = `${humanRead(diff_years)} years old.`;

};

loop()
setInterval(loop, 1000);

const now = new Date();
if (now.getDate() <= 2 && now.getMonth() == 0) {
    var next_birthday = new Date(now.getFullYear(), 0, 3);
} else {
    var next_birthday = new Date(now.getFullYear() + 1, 0, 3);
}

let bd_diff = Math.round((next_birthday.getTime() - now.getTime()) / 1000);
let bd_diff_minutes = Math.round(bd_diff / 60);
let bd_diff_hours = Math.round(bd_diff_minutes / 60);
let bd_diff_days = Math.round(bd_diff_hours / 24);

document.getElementById("next").innerText = `03/01/${next_birthday.getFullYear()}`;
document.getElementById("left").innerText = `${bd_diff_days} days left to next birthday.`;

