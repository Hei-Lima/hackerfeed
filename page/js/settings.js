"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Settings Modal
  const settingsButton = document.getElementById("settingsButton");
  const settingsModal = document.getElementById("settings");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const settingsForm = document.getElementById("settingsForm");

  settingsButton.addEventListener("click", function () {
    settingsModal.showModal();
  });

  cancelBtn.addEventListener("click", function () {
    settingsModal.close();
    change();
  });

  saveBtn.addEventListener("click", function () {
    Save();
    settingsModal.close();
  });

  // Other initializations
  change();
  initializeRangeInputs();
});

function changeTitle(
  selectedTitle = localStorage.getItem("selectedTitle") || "Default"
) {
  const titleDiv = document.getElementById("title");

  // Clear existing content
  while (titleDiv.firstChild) {
    titleDiv.removeChild(titleDiv.firstChild);
  }

  if (selectedTitle != "Default") {
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

function changeFont(
  selectedFont = localStorage.getItem("selectedFont") || "Inter"
) {
  console.log(selectedFont);
  document.documentElement.style.setProperty(
    "--font-display",
    `"${selectedFont}", "sans-serif"`
  );
  document.getElementById("fontSelect").value = selectedFont;
}

function changeGlass(
  navGlass = localStorage.getItem("navGlass") === "true",
  cardGlass = localStorage.getItem("cardGlass") === "true"
) {
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
  selectedBackground =
    selectedBackground || localStorage.getItem("selectedBackground");
  if (selectedBackground) {
    const gifs = ["Matrix", "Genesis"];
    if (gifs.includes(selectedBackground)) {
      console.log(selectedBackground);
      document.body.style.backgroundImage = `url('/page/background/${selectedBackground}.gif')`;
    } else if (selectedBackground === "Dark Gradient") {
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

function changeBlurDarken(
  blur = localStorage.getItem("blur") ?? 0,
  darken = localStorage.getItem("darken") ?? 0
) {
  document.documentElement.style.setProperty(
    "--blur-effect",
    `blur(${blur}px)`
  );
  document.documentElement.style.setProperty(
    "--darken-overlay",
    `rgba(0, 0, 0, ${darken / 100})`
  );

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
  const title = localStorage.getItem("selectedTitle") || "Default";
  const font = localStorage.getItem("selectedFont") || "Inter";
  const fetchLimit = localStorage.getItem("fetchLimit") || 21;

  document.getElementById("titleSelect").value = title;
  document.getElementById("fontSelect").value = font;
  document.getElementById(
    "fetchTimeInput"
  ).placeholder = `Current: ${saveTime}`;
  document.getElementById("blurRange").value = blur;
  document.getElementById("darkenRange").value = darken;
  document.getElementById("ghostNavCheck").checked =
    localStorage.getItem("ghostNav") === "true";
  document.getElementById("blurValue").textContent = `${blur}px`;
  document.getElementById("darkenValue").textContent = `${darken}%`;
  document.getElementById("fetchTimeInput").value = saveTime;
  document.getElementById("navbarGlassCheck").checked =
    navGlass === null ? false : navGlass === "true";
  document.getElementById("cardGlassCheck").checked =
    cardGlass === null ? false : cardGlass === "true";
  document.getElementById("backgroundSelect").value =
    localStorage.getItem("selectedBackground") || "Pick a Background";
  document.getElementById("fetchLimitInput").value = fetchLimit;
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
    changeBlurDarken(this.value, document.getElementById("darkenRange").value);
    document.getElementById("blurValue").textContent = `${this.value}px`;
  });

  darkenRange.addEventListener("input", function () {
    changeBlurDarken(document.getElementById("blurRange").value, this.value);
    document.getElementById("darkenValue").textContent = `${this.value}%`;
  });

  fontSelect.addEventListener("change", function () {
    changeFont(this.value);
  });

  titleSelect.addEventListener("change", function () {
    changeTitle(this.value);
  });

  backgroundSelect.addEventListener("change", function () {
    changeBackground(this.value);
  });

  navbarGlassCheck.addEventListener("change", function () {
    changeGlass(
      this.checked,
      document.getElementById("cardGlassCheck").checked
    );
  });

  cardGlassCheck.addEventListener("change", function () {
    changeGlass(
      document.getElementById("navbarGlassCheck").checked,
      this.checked
    );
  });

  ghostNavCheck.addEventListener("change", function () {
    changeNavbar(
      this.checked,
      document.getElementById("cardGlassCheck").checked
    );
  });

  fetchTimeInput.addEventListener("input", function () {
    document.getElementById(
      "fetchTimeInput"
    ).placeholder = `Current: ${this.value}`;
  });

  fetchLimitInput.addEventListener("input", function () {
    document.getElementById(
      "fetchLimitInput"
    ).placeholder = `Current: ${this.value}`;
  });
}

function saveFontValue() {
  return document.getElementById("fontSelect").value;
}

function saveTitleValue() {
  return document.getElementById("titleSelect").value;
}

function saveFetchLimit() {
  return document.getElementById("fetchLimitInput").value;
}

function saveTimeValue() {
  return document.getElementById("fetchTimeInput").value;
}

function saveGlassValues() {
  return {
    navGlass: document.getElementById("navbarGlassCheck").checked,
    cardGlass: document.getElementById("cardGlassCheck").checked,
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
    blur: document.getElementById("blurRange").value,
    darken: document.getElementById("darkenRange").value,
  };
}

function Save() {
  localStorage.setItem("selectedFont", saveFontValue());
  localStorage.setItem("selectedTitle", saveTitleValue());
  localStorage.setItem("saveTime", saveTimeValue());
  localStorage.setItem("fetchLimit", saveFetchLimit());

  const glassValues = saveGlassValues();
  localStorage.setItem("navGlass", glassValues.navGlass);
  localStorage.setItem("cardGlass", glassValues.cardGlass);

  localStorage.setItem("selectedBackground", saveBackgroundValue());

  const blurDarkenValues = saveBlurDarkenValues();
  localStorage.setItem("blur", blurDarkenValues.blur);
  localStorage.setItem("darken", blurDarkenValues.darken);

  const nav = saveNavbar();
  localStorage.setItem("ghostNav", nav);

  change();
}

function change() {
  changeGlass();
  changeBackground();
  changeFont();
  changeTitle();
  changePlaceholders();
  changeBlurDarken();
  changeNavbar();
}
