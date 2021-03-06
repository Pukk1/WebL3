let setX = function (value) {
    document.getElementById("Xparent").children[0].value = value;
}
let setY = function (value) {
    document.getElementById("Yparent").children[0].value = value;
}
let setR = function (value) {
    document.getElementById("Rparent").children[0].children[0].ariaValueNow = value;
}
let getX = function () {
    return document.getElementById("Xparent").children[0].value;
}
let getY = function () {
    return document.getElementById("Yparent").children[0].value;
}
let getR = function () {
    return document.getElementById("Rparent").children[0].children[0].ariaValueNow;
}


createXButtonsListener = function () {
    xCommandButtons = document.documentElement.getElementsByClassName("XcommandButton");
    for (let xCommandButton of xCommandButtons) {
        xCommandButton.addEventListener("mousedown", function (e) {
            setX(xCommandButton.value);
            document.getElementById("xParameterTitle").innerText = "Параметр X = " + xCommandButton.value;
        })
    }
}

drawArea = function () {
    let swg = document.getElementById("svgArea");
    let results = document.getElementsByClassName("result");
    let j = 0;
    let r = getR();
    for (let i = results.length / 4; i > 0; i--) {
        let x = results[j++].innerText;
        let y = results[j++].innerText;
        j++;
        if (results[j].innerText === "true") {
            results[j].innerText = "Да";
        } else {
            results[j].innerText = "Нет";
        }
        j++;
        let circle;
        circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', String(250 + (Math.round(x / r * 200 * 10) / 10)));
        circle.setAttribute('cy', String(250 - (Math.round(y / r * 200 * 10) / 10)));
        circle.setAttribute("r", "3")

        if (x > 0 && y > 0) {
            circle.setAttribute("fill", "rgb(182,9,9)");
        } else if (x <= 0 && y >= 0) {
            if (Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2) <= Math.pow(r / 2, 2)) {
                circle.setAttribute("fill", "rgb(5,232,30)")
            } else {
                circle.setAttribute("fill", "rgb(182,9,9)");
            }
        } else if (x <= 0 && y <= 0) {
            if (x >= -r / 2 && y >= -r) {
                circle.setAttribute("fill", "rgb(5,232,30)")
            } else {
                circle.setAttribute("fill", "rgb(182,9,9)");
            }
        } else if (x >= 0 && y <= 0) {
            if (x - r - y <= 0) {
                circle.setAttribute("fill", "rgb(5,232,30)")
            } else {
                circle.setAttribute("fill", "rgb(182,9,9)");
            }
        } else {
            circle.setAttribute("fill", "rgb(182,9,9)");
        }
        swg.appendChild(circle);
    }
}

addDotChecker = function () {
    let swg = document.getElementById("svgArea");
    swg.addEventListener("mousedown", function (e) {
        let x = e.offsetX - 249.5;
        let y = e.offsetY - 249.5;
        let r = getR();
        x = x / 200 * r;
        y = -y / 200 * r;
        x = Math.ceil(x * 1000) / 1000;
        y = Math.ceil(y * 1000) / 1000;
        setX(x);
        document.getElementById("xParameterTitle").innerText = "Параметр X = " + x;
        setY(y);
        let checkButton = document.getElementById("checkButtonParent").children[0];
        if (validate()) {
            checkButton.click();
        }
    })
}

addDotChecker();
createXButtonsListener();

// let timerId = setTimeout();
// clearTimeout(timerId);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    while (getR() == null) {
        await sleep(50);
    }
    drawArea();
}

demo();


setXErr = function (xErrStr) {
    document.getElementById("xErr").innerText = xErrStr;
}
setYErr = function (yErrStr) {
    document.getElementById("yErr").innerText = yErrStr;
}
setRErr = function (rErrStr) {
    document.getElementById("rErr").innerText = rErrStr;
}

clearLastErrs = function () {
    setXErr("");
    setYErr("");
    setRErr("");
}

validateX = function (x) {
    if (isNaN(x)) {
        setXErr("Должно быть выбрано число!")
        return false;
    } else if (!(x >= -5 && x <= 3)) {
        setXErr("Значение должно быть в диапозоне [-5...3]");
        return false;
    } else if (x.length > 17) {
        setXErr("Если это выскочило - значит кто-то решил сломать нас (в поле не может быть больше 17 символов)");
        return false;
    } else {
        return true;
    }
}

validateY = function (y) {
    if (isNaN(y)) {
        setYErr("Должно быть выбрано число!")
        return false;
    } else if (!(y >= -3 && y <= 3)) {
        setYErr("Значение должно быть в диапозоне [-3...3]");
        return false;
    } else if (y.length > 17) {
        setYErr("В поле не может быть больше 17 символов");
        return false;
    } else {
        return true;
    }
}

validateR = function (r) {
    if (isNaN(r)) {
        setRErr("Должно быть выбрано число!")
        return false;
    } else if (!(r > 0 && r <= 3)) {
        setRErr("Значение должно быть в диапозоне (0...3)");
        return false;
    } else if (r.length > 17) {
        setRErr("В поле не может быть больше 17 символов");
        return false;
    } else {
        return true;
    }
}

validate = function () {

    clearLastErrs();

    if (validateX(getX()) && validateY(getY()) && validateR(getR())) {
        return true;
    } else {
        return false;
    }
}


let afterAjaxSuccess = function (data) {
    if (data.status == "success") {
        let results = document.getElementsByClassName("result");
        if (results[0] !== undefined) {
            document.getElementById("xParameterTitle").innerText = "Параметр X = " + results[0].innerText;
        }
        drawArea();
        createXButtonsListener();
        addDotChecker();
    }
}


// <p:spinner id="R" validator="rValidator" value="#{managerBean.r}" required="true"
//            min="0" max="20" maxlength="8" stepFactor="0.1"/>