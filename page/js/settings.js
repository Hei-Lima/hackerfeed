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
        settingsModal.close();
        saveSettings();
    });

    applySettings(); 
    initializeRangeInputs();
});

function applyFont(selectedFont = localStorage.getItem("selectedFont") || "Inter") {
    document.documentElement.style.setProperty("--font-display", `"${selectedFont}", "sans-serif"`);
    document.getElementById("fontSelect").value = selectedFont;
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
        applyFont(this.value);
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
    localStorage.setItem("selectedFont", getFontValue());
    localStorage.setItem("saveTime", getFetchTimeValue());
    localStorage.setItem("fetchLimit", getFetchLimitValue());

    applySettings();
}

function applySettings() {
    applyFont();
    updatePlaceholders();
}