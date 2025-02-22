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

function changeBlurDarken(blur = localStorage.getItem("blur") ?? 0, darken = localStorage.getItem("darken") ?? 0) {
    console.log(blur)
    console.log(darken)
    document.documentElement.style.setProperty('--blur-effect', `blur(${blur}px)`);
    document.documentElement.style.setProperty('--darken-overlay', `rgba(0, 0, 0, ${darken / 100})`);
}

function changePlaceholders() {
    let saveTime = localStorage.getItem("saveTime") ?? 15;
    document.getElementById("fetchTimeInput").placeholder = `Current: ${saveTime}`;
    const navGlass = localStorage.getItem("navGlass");
    const cardGlass = localStorage.getItem("cardGlass");

    document.getElementById("navbarGlassCheck").checked = navGlass === null ? false : navGlass === "true";
    document.getElementById("cardGlassCheck").checked = cardGlass === null ? false : cardGlass === "true";
    document.getElementById("fontSelect").value = localStorage.getItem("selectedFont") || "Inter";
    document.getElementById("backgroundSelect").value = localStorage.getItem("selectedBackground") || "Pick a Background";
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
        if (localStorage.getItem("selectedBackground") === "Light Gradient") {
            const gradient = "linear-gradient(to top, #e0eafc, #cfdef3)";
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
        document.body.style.backdropFilter = "";
    }
}



function Save() {
    saveFont();
    saveTime();
    saveGlass();
    saveBackground();
    saveBlurDarken();
} 

function initializeRangeInputs() {
    const blurRange = document.getElementById('blurRange');
    const darkenRange = document.getElementById('darkenRange');
    const blurValue = document.getElementById('blurValue');
    const darkenValue = document.getElementById('darkenValue');

    blurRange.addEventListener('input', function() {
        blurValue.textContent = this.value + 'px';
        changeBlurDarken(this.value, undefined);
    });

    darkenRange.addEventListener('input', function() {
        darkenValue.textContent = this.value + '%';
        changeBlurDarken(undefined, this.value);
    });
}

function saveBlurDarken() {
    const blur = document.getElementById('blurRange').value;
    const darken = document.getElementById('darkenRange').value;
    localStorage.setItem('blur', blur);
    localStorage.setItem('darken', darken);
    changeBlurDarken(blur, darken);
}

function change() {
    initializeRangeInputs();
    changeGlass();
    changeBackground();
    changeFont();
    changePlaceholders();
    changeBlurDarken();
}

change();