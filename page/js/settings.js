"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Settings Modal
  const settingsButton = document.getElementById("settingsButton");
  const settingsModal = document.getElementById("settings");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  settingsButton.addEventListener("click", function () {
    settingsModal.showModal();
  });

  cancelBtn.addEventListener("click", function () {
    settingsModal.close();
    applySettings(); // Changed from change()
  });

  saveBtn.addEventListener("click", function () {
    saveSettings(); // Changed from Save()
    settingsModal.close();
  });

  // Other initializations
  applySettings(); // Changed from change()
  initializeRangeInputs();
});

// --- Refactored Title Function ---
function applyTitle(selectedTitle = localStorage.getItem("selectedTitle") || "Default") {
    const titleDiv = document.getElementById("title");
    while (titleDiv.firstChild) {
        titleDiv.removeChild(titleDiv.firstChild);
    }

    if (selectedTitle !== "Default") {
        const img = document.createElement("img");
        img.src = `page/titles/${selectedTitle}.svg`;
        img.alt = "Hackerfeed";
        img.className = "w-96 md:w-120";
        titleDiv.appendChild(img);
    } else {
        const h1 = document.createElement("h1");
        h1.className = "text-6xl md:text-8xl font-bold text-primary drop-shadow-md";
        h1.textContent = "hackerfeed";
        titleDiv.appendChild(h1);
    }
    document.getElementById("titleSelect").value = selectedTitle;
}

function applyFont(selectedFont = localStorage.getItem("selectedFont") || "Inter") {
    document.documentElement.style.setProperty("--font-display", `"${selectedFont}", "sans-serif"`);
    document.getElementById("fontSelect").value = selectedFont;
}

function applyGlass(navGlass = localStorage.getItem("navGlass") === "true", cardGlass = localStorage.getItem("cardGlass") === "true") {
    document.getElementById("frutigerStyleNav").media = navGlass ? "all" : "none";
    document.getElementById("frutigerStyleCard").media = cardGlass ? "all" : "none";
}

function applyNavbar(ghostNav = localStorage.getItem("ghostNav") === "true") {
    const navbar = document.getElementById("navbar");
    ghostNav ? navbar.classList.remove("bg-base-200") : navbar.classList.add("bg-base-200");
}

function applyBackground(selectedBackground = localStorage.getItem("selectedBackground")) {
    if (selectedBackground) {
        const gifs = ["Matrix", "Genesis"];
        let backgroundUrl = '';

        if (gifs.includes(selectedBackground)) {
            backgroundUrl = `/page/background/${selectedBackground}.gif`;
        } else if (selectedBackground === "Dark Gradient") {
            document.body.style.backgroundImage = "linear-gradient(to top, #0F2027, #203A43, #2C5364)";
            return;
        } else if (selectedBackground === "Light Gradient") {
            document.body.style.backgroundImage = "linear-gradient(to top, #e0eafc, #cfdef3)";
            return;
        } else {
            backgroundUrl = `/page/background/${selectedBackground}.webp`;
        }

        document.body.style.backgroundImage = `url('${backgroundUrl}')`;
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    } else {
        document.body.style.backgroundImage = "";
    }
}

function applyBlurDarken(blur = localStorage.getItem("blur") ?? 0, darken = localStorage.getItem("darken") ?? 0) {
    document.documentElement.style.setProperty("--blur-effect", `blur(${blur}px)`);
    document.documentElement.style.setProperty("--darken-overlay", `rgba(0, 0, 0, ${darken / 100})`);
    document.getElementById("blurValue").textContent = `${blur}px`;
    document.getElementById("darkenValue").textContent = `${darken}%`;
}

function updatePlaceholders() {
    const settings = {
        saveTime: localStorage.getItem("saveTime") || 15,
        navGlass: localStorage.getItem("navGlass"),
        cardGlass: localStorage.getItem("cardGlass"),
        blur: localStorage.getItem("blur") || 0,
        darken: localStorage.getItem("darken") || 0,
        title: localStorage.getItem("selectedTitle") || "Default",
        font: localStorage.getItem("selectedFont") || "Inter",
        background: localStorage.getItem("selectedBackground") || "Default",
        fetchLimit: localStorage.getItem("fetchLimit") || 21
    };

    document.getElementById("titleSelect").value = settings.title;
    document.getElementById("fontSelect").value = settings.font;
    document.getElementById("fetchTimeInput").placeholder = `Current: ${settings.saveTime}`;
    document.getElementById("blurRange").value = settings.blur;
    document.getElementById("darkenRange").value = settings.darken;
    document.getElementById("ghostNavCheck").checked = localStorage.getItem("ghostNav") === "true";
    document.getElementById("blurValue").textContent = `${settings.blur}px`;
    document.getElementById("darkenValue").textContent = `${settings.darken}%`;
    document.getElementById("fetchTimeInput").value = settings.saveTime;
    document.getElementById("navbarGlassCheck").checked = settings.navGlass === null ? false : settings.navGlass === "true";
    document.getElementById("cardGlassCheck").checked = settings.cardGlass === null ? false : settings.cardGlass === "true";
    document.getElementById("backgroundSelect").value = settings.background || "Default";
    document.getElementById("fetchLimitInput").value = settings.fetchLimit;
}

function initializeRangeInputs() {
    const blurRange = document.getElementById("blurRange");
    const darkenRange = document.getElementById("darkenRange");
    const fontSelect = document.getElementById("fontSelect");
    const backgroundSelect = document.getElementById("backgroundSelect");
    const navbarGlassCheck = document.getElementById("navbarGlassCheck");
    const cardGlassCheck = document.getElementById("cardGlassCheck");
    const fetchTimeInput = document.getElementById("fetchTimeInput");
    const ghostNavCheck = document.getElementById("ghostNavCheck");
    const titleSelect = document.getElementById("titleSelect");
    const fetchLimitInput = document.getElementById("fetchLimitInput");

    blurRange.addEventListener("input", function () {
        applyBlurDarken(this.value, document.getElementById("darkenRange").value);
    });

    darkenRange.addEventListener("input", function () {
        applyBlurDarken(document.getElementById("blurRange").value, this.value);
    });

    fontSelect.addEventListener("change", function () {
        applyFont(this.value);
    });

    titleSelect.addEventListener("change", function () {
        applyTitle(this.value);
    });

    backgroundSelect.addEventListener("change", function () {
        applyBackground(this.value);
    });

    navbarGlassCheck.addEventListener("change", function () {
        applyGlass(this.checked, document.getElementById("cardGlassCheck").checked);
    });

    cardGlassCheck.addEventListener("change", function () {
        applyGlass(document.getElementById("navbarGlassCheck").checked, this.checked);
    });

    ghostNavCheck.addEventListener("change", function () {
        applyNavbar(this.checked);
    });

    fetchTimeInput.addEventListener("input", function () {
        this.placeholder = `Current: ${this.value}`;
    });

    fetchLimitInput.addEventListener("input", function () {
        this.placeholder = `Current: ${this.value}`;
    });
}

function getFontValue() {
    return document.getElementById("fontSelect").value;
}

function getTitleValue() {
    return document.getElementById("titleSelect").value;
}

function getFetchLimitValue() {
    return document.getElementById("fetchLimitInput").value;
}

function getFetchTimeValue() {
    return document.getElementById("fetchTimeInput").value;
}

function getGlassValues() {
    return {
        navGlass: document.getElementById("navbarGlassCheck").checked,
        cardGlass: document.getElementById("cardGlassCheck").checked
    };
}

function getNavbarValue() {
    return document.getElementById("ghostNavCheck").checked;
}

function getBackgroundValue() {
    return document.getElementById("backgroundSelect").value;
}

function getBlurDarkenValues() {
    return {
        blur: document.getElementById("blurRange").value,
        darken: document.getElementById("darkenRange").value
    };
}

function saveSettings() {
    localStorage.setItem("selectedFont", getFontValue());
    localStorage.setItem("selectedTitle", getTitleValue());
    localStorage.setItem("saveTime", getFetchTimeValue());
    localStorage.setItem("fetchLimit", getFetchLimitValue());

    const glassValues = getGlassValues();
    localStorage.setItem("navGlass", glassValues.navGlass);
    localStorage.setItem("cardGlass", glassValues.cardGlass);

    localStorage.setItem("selectedBackground", getBackgroundValue());

    const blurDarkenValues = getBlurDarkenValues();
    localStorage.setItem("blur", blurDarkenValues.blur);
    localStorage.setItem("darken", blurDarkenValues.darken);

    localStorage.setItem("ghostNav", getNavbarValue());

    applySettings();
}

function applySettings() {
    applyGlass();
    applyBackground();
    applyFont();
    applyTitle();
    updatePlaceholders();
    applyBlurDarken();
    applyNavbar();
}