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
        applySettings(); 
    });

    saveBtn.addEventListener("click", function () {
        saveSettings();
        settingsModal.close();
    });

    applySettings(); 
    initializeRangeInputs();
});

// Pilhas com fallbacks adequados
const FONT_STACKS = {
  "Inter": '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  "Poppins": '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  "EB Garamond": '"EB Garamond", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "IBM Plex Sans": '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  "JetBrains Mono": '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  "Montserrat": '"Montserrat", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  "Newsreader": '"Newsreader", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  "Roboto": '"Roboto", ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

function applyFont(selectedFont = localStorage.getItem("selectedFont") || "Inter") {
    const stack = FONT_STACKS[selectedFont] || FONT_STACKS["Inter"];
    
    // Aplica diretamente no body
    document.body.style.fontFamily = stack;
    
    const sel = document.getElementById("fontSelect");
    if (sel) sel.value = selectedFont;
    
    console.log(`Font applied: ${selectedFont} -> ${stack}`);
}

function updatePlaceholders() {
    const settings = {
        saveTime: localStorage.getItem("saveTime") || 15,
        font: localStorage.getItem("selectedFont") || "Inter",
        fetchLimit: localStorage.getItem("fetchLimit") || 21
    };

    document.getElementById("fontSelect").value = settings.font;
    document.getElementById("fetchTimeInput").placeholder = `Current: ${settings.saveTime}`;
    document.getElementById("fetchTimeInput").value = settings.saveTime;
    document.getElementById("fetchLimitInput").value = settings.fetchLimit;
}

function initializeRangeInputs() {
    const fontSelect = document.getElementById("fontSelect");
    const fetchTimeInput = document.getElementById("fetchTimeInput");
    const fetchLimitInput = document.getElementById("fetchLimitInput");

    fontSelect.addEventListener("change", function () {
        const selectedFont = this.value;
        console.log(`Font changed to: ${selectedFont}`);
        applyFont(selectedFont);
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

function getFetchLimitValue() {
    return document.getElementById("fetchLimitInput").value;
}

function getFetchTimeValue() {
    return document.getElementById("fetchTimeInput").value;
}

function saveSettings() {
    const selectedFont = getFontValue();
    const saveTime = getFetchTimeValue();
    const fetchLimit = getFetchLimitValue();
    
    localStorage.setItem("selectedFont", selectedFont);
    localStorage.setItem("saveTime", saveTime);
    localStorage.setItem("fetchLimit", fetchLimit);
    
    console.log(`Settings saved: Font=${selectedFont}, Time=${saveTime}, Limit=${fetchLimit}`);
    
    applySettings();
}

function applySettings() {
    applyFont();
    updatePlaceholders();
}