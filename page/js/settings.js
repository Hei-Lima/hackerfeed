"use strict";

function Save() {
    const saveTime = document.getElementById("fetchTimeInput").value;
    console.log(saveTime)
    localStorage.setItem("saveTime", saveTime)
} 

