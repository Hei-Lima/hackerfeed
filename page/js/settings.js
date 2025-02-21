"use strict";

function changeFont() {
    let selectedFont = localStorage.getItem("selectedFont") || "Inter";
    document.documentElement.style.setProperty('--font-display', `"${selectedFont}", "sans-serif"`);
    document.getElementById("fontSelect").value = selectedFont;
}

function saveGlass() {
    const navGlass = document.getElementById("navbarGlassCheck").checked;
    const cardGlass = document.getElementById("cardGlassCheck").checked;
    localStorage.setItem("navGlass", navGlass);
    localStorage.setItem("cardGlass", cardGlass);
    changeGlass();
}

function saveFont() {
    const selectedFont = document.getElementById("fontSelect").value;
    localStorage.setItem("selectedFont", selectedFont);
    changeFont();
}

function saveTime() {
    const saveTime = document.getElementById("fetchTimeInput").value;
    localStorage.setItem("saveTime", saveTime);
}

function saveBackground() {
    const selectedBackground = document.getElementById("backgroundSelect").value;
    if (selectedBackground === "Deafult") {
        localStorage.removeItem("selectedBackground");
        changeBackground();
        return;
    }
    localStorage.setItem("selectedBackground", selectedBackground); 
    changeBackground();
    }

function changePlaceholders() {
    let saveTime = localStorage.getItem("saveTime") || 15;
    document.getElementById("fetchTimeInput").placeholder = `Current: ${saveTime}`;
    const navGlass = localStorage.getItem("navGlass");
    const cardGlass = localStorage.getItem("cardGlass");
    
    document.getElementById("navbarGlassCheck").checked = navGlass === null ? false : navGlass === "true";
    document.getElementById("cardGlassCheck").checked = cardGlass === null ? false : cardGlass === "true";
    document.getElementById("fontSelect").value = localStorage.getItem("selectedFont") || "Inter";
}

function changeGlass() {
    const navGlass = localStorage.getItem("navGlass") === "true";
    const cardGlass = localStorage.getItem("cardGlass") === "true";

    if (navGlass) {
        document.getElementById("frutigerStyleNav").media = "all";
    }
    else {
        document.getElementById("frutigerStyleNav").media = "none";
    }

    if (cardGlass) {
        document.getElementById("frutigerStyleCard").media = "all";
    }
    else {
        document.getElementById("frutigerStyleCard").media = "none";
    }
}

function changeBackground() {
    if (localStorage.getItem("selectedBackground")) {
        if (localStorage.getItem("selectedBackground") === "Dark Gradient") {
            const gradient = "linear-gradient(to top, #0F2027, #203A43, #2C5364)";
            document.body.style.backgroundImage = gradient;
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "cover";
            return;
        }
        let selectedBackground = localStorage.getItem("selectedBackground") || "default.jpg";
        document.body.style.backgroundImage = `url('/page/background/${selectedBackground}.webp')`;
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    }
    else {
        document.body.style.backgroundImage = "";
        document.body.style.backgroundAttachment = "";
        document.body.style.backgroundPosition = "";
        document.body.style.backgroundRepeat = "";
        document.body.style.backgroundSize = "";
    }
}

function Save() {
    saveFont();
    saveTime();
    saveGlass();
    saveBackground();
} 

changeGlass();
changeBackground();
changeFont();
changePlaceholders();
