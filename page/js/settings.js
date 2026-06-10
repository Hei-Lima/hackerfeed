"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Settings Modal
    const settingsButton = document.getElementById("settingsButton");
    const settingsModal = document.getElementById("settings");

    settingsButton.addEventListener("click", function () {
        // Reset dialog returnValue before opening
        settingsModal.returnValue = "";
        settingsModal.showModal();
    });

    // Handle closing the dialog (ESC, backdrop click, cancel, save)
    settingsModal.addEventListener("close", function () {
        if (settingsModal.returnValue === "save") {
            saveSettings();
            // Notify other scripts that settings have been saved
            window.dispatchEvent(new Event("settingsUpdated"));
        } else {
            // Revert preview changes (like fonts, gradients) if canceled
            applySettings(); 
        }
    });

    applySettings(); 
    initializeRangeInputs();
});

// Font stacks with suitable fallbacks
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
    
    // Apply font family directly to body
    document.body.style.fontFamily = stack;
    
    const sel = document.getElementById("fontSelect");
    if (sel) sel.value = selectedFont;
    
    console.log(`Font applied: ${selectedFont} -> ${stack}`);
}

function previewGradient(enabled, steps) {
    const titleEl = document.querySelector("#title h1");
    if (!titleEl) return;

    titleEl.classList.remove(
        "text-primary", 
        "bg-gradient-to-r", 
        "from-primary", 
        "via-secondary", 
        "to-accent", 
        "to-secondary",
        "bg-clip-text", 
        "text-transparent"
    );

    if (enabled) {
        titleEl.classList.add(
            "bg-gradient-to-r", 
            "from-primary", 
            "to-accent",
            "bg-clip-text", 
            "text-transparent"
        );
        if (steps === "3") {
            titleEl.classList.add("via-secondary");
        }
    } else {
        titleEl.classList.add("text-primary");
    }
}

function applyTitleGradient() {
    const titleGradient = localStorage.getItem("titleGradient") === "true"; // Default is now false
    const gradientSteps = localStorage.getItem("gradientSteps") || "3";
    previewGradient(titleGradient, gradientSteps);
}

function updatePlaceholders() {
    const settings = {
        saveTime: localStorage.getItem("saveTime") || 15,
        font: localStorage.getItem("selectedFont") || "Inter",
        fetchLimit: localStorage.getItem("fetchLimit") || 21,
        titleGradient: localStorage.getItem("titleGradient") === "true", // Default is now false
        gradientSteps: localStorage.getItem("gradientSteps") || "3"
    };

    const fontSelect = document.getElementById("fontSelect");
    const fetchTimeInput = document.getElementById("fetchTimeInput");
    const fetchLimitInput = document.getElementById("fetchLimitInput");
    const gradientToggle = document.getElementById("gradientToggle");
    const gradientStepsSelect = document.getElementById("gradientStepsSelect");
    const gradientStepsControl = document.getElementById("gradientStepsControl");

    if (fontSelect) fontSelect.value = settings.font;
    
    if (fetchTimeInput) {
        fetchTimeInput.placeholder = `Current: ${settings.saveTime}`;
        fetchTimeInput.value = localStorage.getItem("saveTime") || "";
    }
    
    if (fetchLimitInput) {
        fetchLimitInput.placeholder = `Current: ${settings.fetchLimit}`;
        fetchLimitInput.value = localStorage.getItem("fetchLimit") || "";
    }

    if (gradientToggle) {
        gradientToggle.checked = settings.titleGradient;
    }

    if (gradientStepsSelect) {
        gradientStepsSelect.value = settings.gradientSteps;
    }

    if (gradientStepsControl) {
        gradientStepsControl.style.display = settings.titleGradient ? "block" : "none";
    }
}

function initializeRangeInputs() {
    const fontSelect = document.getElementById("fontSelect");
    const fetchTimeInput = document.getElementById("fetchTimeInput");
    const fetchLimitInput = document.getElementById("fetchLimitInput");
    const gradientToggle = document.getElementById("gradientToggle");
    const gradientStepsSelect = document.getElementById("gradientStepsSelect");
    const gradientStepsControl = document.getElementById("gradientStepsControl");

    if (fontSelect) {
        fontSelect.addEventListener("change", function () {
            const selectedFont = this.value;
            console.log(`Font changed to: ${selectedFont}`);
            applyFont(selectedFont);
        });
    }

    if (fetchTimeInput) {
        fetchTimeInput.addEventListener("input", function () {
            this.placeholder = `Current: ${this.value || (localStorage.getItem("saveTime") || 15)}`;
        });
    }

    if (fetchLimitInput) {
        fetchLimitInput.addEventListener("input", function () {
            this.placeholder = `Current: ${this.value || (localStorage.getItem("fetchLimit") || 21)}`;
        });
    }

    if (gradientToggle) {
        gradientToggle.addEventListener("change", function () {
            const isChecked = this.checked;
            if (gradientStepsControl) {
                gradientStepsControl.style.display = isChecked ? "block" : "none";
            }
            const currentSteps = gradientStepsSelect ? gradientStepsSelect.value : "3";
            previewGradient(isChecked, currentSteps);
        });
    }

    if (gradientStepsSelect) {
        gradientStepsSelect.addEventListener("change", function () {
            const isEnabled = gradientToggle ? gradientToggle.checked : true;
            previewGradient(isEnabled, this.value);
        });
    }
}

function getFontValue() {
    const fontSelect = document.getElementById("fontSelect");
    return fontSelect ? fontSelect.value : "Inter";
}

function getFetchLimitValue() {
    const fetchLimitInput = document.getElementById("fetchLimitInput");
    return fetchLimitInput ? fetchLimitInput.value : "";
}

function getFetchTimeValue() {
    const fetchTimeInput = document.getElementById("fetchTimeInput");
    return fetchTimeInput ? fetchTimeInput.value : "";
}

function saveSettings() {
    const selectedFont = getFontValue();
    const saveTimeRaw = getFetchTimeValue();
    const fetchLimitRaw = getFetchLimitValue();
    const gradientToggle = document.getElementById("gradientToggle");
    const gradientStepsSelect = document.getElementById("gradientStepsSelect");
    
    // Validate Stories Refresh Interval
    const saveTimeParsed = parseInt(saveTimeRaw, 10);
    if (!isNaN(saveTimeParsed) && saveTimeParsed > 0) {
        localStorage.setItem("saveTime", saveTimeParsed);
    } else {
        localStorage.removeItem("saveTime");
    }

    // Validate Fetch Limit
    const fetchLimitParsed = parseInt(fetchLimitRaw, 10);
    if (!isNaN(fetchLimitParsed) && fetchLimitParsed > 0 && fetchLimitParsed <= 50) {
        localStorage.setItem("fetchLimit", fetchLimitParsed);
    } else {
        localStorage.removeItem("fetchLimit");
    }
    
    localStorage.setItem("selectedFont", selectedFont);

    // Save gradient settings
    if (gradientToggle) {
        localStorage.setItem("titleGradient", gradientToggle.checked ? "true" : "false");
    }
    if (gradientStepsSelect) {
        localStorage.setItem("gradientSteps", gradientStepsSelect.value);
    }
    
    console.log(`Settings saved: Font=${selectedFont}, Time=${localStorage.getItem("saveTime")}, Limit=${localStorage.getItem("fetchLimit")}, Gradient=${localStorage.getItem("titleGradient")}, Steps=${localStorage.getItem("gradientSteps")}`);
    
    applySettings();
}

function applySettings() {
    applyFont();
    applyTitleGradient();
    updatePlaceholders();
}
