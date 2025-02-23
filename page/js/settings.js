"use strict";

function changeFont(selectedFont = localStorage.getItem("selectedFont") || "Inter") {
    console.log(selectedFont);
    document.documentElement.style.setProperty('--font-display', `"${selectedFont}", "sans-serif"`);
    document.getElementById("fontSelect").value = selectedFont;
}

function changeGlass(navGlass = localStorage.getItem("navGlass") === "true", cardGlass = localStorage.getItem("cardGlass") === "true") {
    if (navGlass) {
        document.getElementById("frutigerStyleNav").media = "all";
    } else {
        document.getElementById("frutigerStyleNav").media = "none";
    }

    if (cardGlass) {
        document.getElementById("frutigerStyleCard").media = "all";
    } else {
        document.getElementById("frutigerStyleCard").media = "none";
    }
}

function changeNavbar(ghostNav = localStorage.getItem("ghostNav") === "true") {
    const navbar = document.getElementById("navbar");
    if (ghostNav) {
        navbar.classList.remove("bg-base-200");
    } else {
        navbar.classList.add("bg-base-200");
    }
}

function changeBackground(selectedBackground) {
    selectedBackground = selectedBackground || localStorage.getItem("selectedBackground");
    if (selectedBackground) {
        if (selectedBackground === "Dark Gradient") {
            const gradient = "linear-gradient(to top, #0F2027, #203A43, #2C5364)";
            document.body.style.backgroundImage = gradient;
        } else if (selectedBackground === "Light Gradient") {
            const gradient = "linear-gradient(to top, #e0eafc, #cfdef3)";
            document.body.style.backgroundImage = gradient;
        } else {
            document.body.style.backgroundImage = `url('/page/background/${selectedBackground}.webp')`;
        }
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    } else {
        document.body.style.backgroundImage = "";
    }
}

function changeBlurDarken(blur = localStorage.getItem("blur") ?? 0, darken = localStorage.getItem("darken") ?? 0) {
    document.documentElement.style.setProperty('--blur-effect', `blur(${blur}px)`);
    document.documentElement.style.setProperty('--darken-overlay', `rgba(0, 0, 0, ${darken / 100})`);

    // Update the displayed values
    document.getElementById("blurValue").textContent = `${blur}px`;
    document.getElementById("darkenValue").textContent = `${darken}%`;
}

function changePlaceholders() {
    const saveTime = localStorage.getItem("saveTime") || 15;
    const navGlass = localStorage.getItem("navGlass");
    const cardGlass = localStorage.getItem("cardGlass");
    const blur = localStorage.getItem("blur") || 0;
    const darken = localStorage.getItem("darken") || 0;
    const ghostNav = localStorage.getItem("ghostNav");

    document.getElementById("fetchTimeInput").placeholder = `Current: ${saveTime}`;
    document.getElementById("blurRange").value = blur;
    document.getElementById("ghostNavCheck").checked =  ghostNav === null ? false : ghostNav === "true";
    document.getElementById("darkenRange").value = darken;
    document.getElementById("blurValue").textContent = `${blur}px`;
    document.getElementById("darkenValue").textContent = `${darken}%`;
    document.getElementById("fetchTimeInput").value = saveTime;
    document.getElementById("navbarGlassCheck").checked = navGlass === null ? false : navGlass === "true";
    document.getElementById("cardGlassCheck").checked = cardGlass === null ? false : cardGlass === "true";
    document.getElementById("fontSelect").value = localStorage.getItem("selectedFont") || "Inter";
    document.getElementById("backgroundSelect").value = localStorage.getItem("selectedBackground") || "Pick a Background";
}

function initializeRangeInputs() {
    const blurRange = document.getElementById('blurRange');
    const darkenRange = document.getElementById('darkenRange');
    const fontSelect = document.getElementById('fontSelect');
    const backgroundSelect = document.getElementById('backgroundSelect');
    const navbarGlassCheck = document.getElementById('navbarGlassCheck');
    const cardGlassCheck = document.getElementById('cardGlassCheck');
    const fetchTimeInput = document.getElementById('fetchTimeInput');
    const ghostNavCheck = document.getElementById("ghostNavCheck");

    blurRange.addEventListener('input', function() {
        changeBlurDarken(this.value, document.getElementById('darkenRange').value);
        document.getElementById("blurValue").textContent = `${this.value}px`;
    });

    darkenRange.addEventListener('input', function() {
        changeBlurDarken(document.getElementById('blurRange').value, this.value);
        document.getElementById("darkenValue").textContent = `${this.value}%`;
    });

    fontSelect.addEventListener('change', function() {
        changeFont(this.value);
    });

    backgroundSelect.addEventListener('change', function() {
        changeBackground(this.value);
    });

    navbarGlassCheck.addEventListener('change', function() {
        changeGlass(this.checked, document.getElementById('cardGlassCheck').checked);
    });

    cardGlassCheck.addEventListener('change', function() {
        changeGlass(document.getElementById('navbarGlassCheck').checked, this.checked);
    });

    ghostNavCheck.addEventListener('change', function() {
        changeNavbar(this.checked, document.getElementById('cardGlassCheck').checked);
    });

    fetchTimeInput.addEventListener('input', function() {
        document.getElementById("fetchTimeInput").placeholder = `Current: ${this.value}`;
    });

}

function saveFontValue() {
    console.log("font value", document.getElementById("fontSelect").value);
    return document.getElementById("fontSelect").value;
}

function saveTimeValue() {
    return document.getElementById("fetchTimeInput").value;
}

function saveGlassValues() {
    return {
        navGlass: document.getElementById("navbarGlassCheck").checked,
        cardGlass: document.getElementById("cardGlassCheck").checked
    };
}

function saveNavbar() {
    return document.getElementById("ghostNavCheck").checked;
}

function saveBackgroundValue() {
    return document.getElementById("backgroundSelect").value;
}

function saveBlurDarkenValues() {
    return {
        blur: document.getElementById('blurRange').value,
        darken: document.getElementById('darkenRange').value
    };
}

function Save() {
    localStorage.setItem("selectedFont", saveFontValue());
    localStorage.setItem("saveTime", saveTimeValue());

    const glassValues = saveGlassValues();
    localStorage.setItem("navGlass", glassValues.navGlass);
    localStorage.setItem("cardGlass", glassValues.cardGlass);

    localStorage.setItem("selectedBackground", saveBackgroundValue());

    const blurDarkenValues = saveBlurDarkenValues();
    localStorage.setItem('blur', blurDarkenValues.blur);
    localStorage.setItem('darken', blurDarkenValues.darken);

    const nav = saveNavbar();
    localStorage.setItem("ghostNav", nav);

    change();
}

function change() {
    initializeRangeInputs();
    changeGlass();
    changeBackground();
    changeFont();
    changePlaceholders();
    changeBlurDarken();
    changeNavbar();
}

change();