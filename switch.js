// CAMPAIGN LINKS

var go1 = "https://tsyndicate.com/api/v1/direct/84bba6e390a941dc85cf3f36864d360a?"; // <-Main offer 'click' link
var go2 = "https://tsyndicate.com/api/v1/direct/84bba6e390a941dc85cf3f36864d360a?"; // <- #LP2 'new campaign' link
var goBack = "https://tsyndicate.com/api/v1/direct/84bba6e390a941dc85cf3f36864d360a?"; // <- Back-button campaign link

// SWAP TITLES

var titles;
function swapTitles() {
    var t1 = ["(1) TODAY ONLY!", "(!) Sports Quiz!", "($) Win Cash!"];
    var t2 = ["(1) EXCLUSIVE OFFER!", "(!) Horny Women!", "(*) Want YOU!"];       
    let a = 0;
    setInterval(() => {
        a %= 3, document.title = "swap" === titles ? t2[a] : t1[a];
        a++
    }, 2e3);
}addEventListener("load", swapTitles);

// SWITCH-A-ROO

const buttons = document.getElementsByClassName("clickme");
for (const button of buttons) 
    button.addEventListener("click", function(event) {
    next(event)
});

function next(event) {
    var aa = event.target.parentNode.id;
    document.querySelector(`#LP${aa[1]}`).style.display = "none",
        "a2" === aa && (document.location = this[`go${+aa[1]}`]), window.open(this[`go${+aa[1]}`], "_blank", "noreferrer"), document.querySelector(`#LP${+aa[1]+1}`).style.display = "flex", titles = "swap"
}

// BACK BUTTON

(function() {
    try {
        for (var t = window.location.href.split(/[#]/)[0], a = 0; a < 10; ++a) history.pushState({}, "", t + "#");
        onpopstate = function(t) {
            t.state && top.location.replace(goBack)
        }
    } catch (t) {
        console.log(t)
    }
})();
