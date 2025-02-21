"use strict";

function changeFont() {
    let selectedFont = localStorage.getItem("selectedFont") || "Inter";
    document.documentElement.style.setProperty('--font-display', `"${selectedFont}", "sans-serif"`);
    document.getElementById("fontSelect").value = selectedFont;
}

function saveFont() {
    const selectedFont = document.getElementById("fontSelect").value;
    localStorage.setItem("selectedFont", selectedFont);
    changeFont();
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

function changePlaceholders() {
    let saveTime = localStorage.getItem("saveTime") || 15;
    document.getElementById("fetchTimeInput").placeholder = `Current: ${saveTime}`;
}

function Save() {
    saveFont();
    saveTime();
} 

changeFont();
changePlaceholders();