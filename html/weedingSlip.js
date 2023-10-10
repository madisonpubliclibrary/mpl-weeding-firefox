(function() {
  'use strict';

  const barcode = document.getElementById("barcode");
  const getItemData = document.getElementById("getItemData");
  const title = document.getElementById("title");
  const ccode = document.getElementById("ccode");
  const pubDate = document.getElementById("pubDate");
  const notes = document.getElementById("notes");
  const inCoreColl = document.getElementById("inCoreColl");
  const recLevelWrap = document.getElementById("recLevelWrap");
  const recLevel = document.getElementById("recLevel");
  const noveListWrap = document.getElementById("noveListWrap")
  const inNoveList = document.getElementById("inNoveList");
  const inSeries = document.getElementById("inSeries");
  const seriesName = document.getElementById("seriesName");
  const seriesNumber = document.getElementById("seriesNumber");
  const booklist = document.getElementById("booklist");
  const pubWeekly = document.getElementById("pubWeekly");
  const libJournal = document.getElementById("libJoural");
  const kirkus = document.getElementById("kirkus");
  const awards = document.getElementById("awards");
  const copies = document.getElementById("copies");
  const nonMPLcopies = document.getElementById("nonMPLcopies");
  const printForm = document.getElementById("printForm");
  const startOver = document.getElementById("startOver");

  let copyArray = [];

  // Trigger getItemData() when enter is pressed in barcode input
  barcode.addEventListener("keyup", evt => {
    if (evt.key !== "Enter") return;
    getItemData.click();
    evt.preventDefault();
  });

  getItemData.addEventListener("click", function() {
    if (/^3\d{13}$/.test(barcode.value)) {
      clearForm();
      if (barcode.classList.contains("invalidInput")) {
        barcode.classList.remove("invalidInput");
      }
      browser.runtime.sendMessage({
        "key": "barcode",
        "barcode": barcode.value
      }).then(res => {
        title.value = res.title;
        pubDate.value = res.pubDate;
        ccode.value = res.ccode;
        toggleNovelistCheckbox(ccode.value);
      });
    } else {
      if (!barcode.classList.contains("invalidInput")) {
        barcode.classList.add("invalidInput");
      }
    }
  });

  function toggleNovelistCheckbox(ccode) {
    let enableNoveList = ["BKAFI","BKAFIMY","BKAFIFA","BKAFISF"].includes(ccode)
    inNoveList.disabled = !enableNoveList;
    inNoveList.style.cursor = enableNoveList ? "pointer" : "not-allowed";

    if (!enableNoveList) {
      noveListWrap.style.display = "none";
      inNoveList.checked = false;
      inSeries.checked = false;
      seriesName.value = "";
      seriesNumber.value = "";
      booklist.checked = false;
      pubWeekly.checked = false;
      libJournal.checked = false;
      kirkus.checked = false;
      awards.checked = false;
    }
  }

  inCoreColl.addEventListener("click", evt => {
    recLevelWrap.style.display = inCoreColl.checked ? "block" : "none";
  });

  ccode.addEventListener("keyup", evt => {
    toggleNovelistCheckbox(ccode.value);
  })

  inNoveList.addEventListener("click", evt => {
    noveListWrap.style.display = inNoveList.checked ? "block" : "none";
  });

  printForm.addEventListener("click", function() {
    if (false) {
      alert("Please check that all required fields have been filled in.");
    } else {
      browser.runtime.sendMessage({
        "key": "printWeedingSli[p",
        "data": [
          ["title", title.value],
          ["pubDate", pubDate.value],
          ["ccode", ccode.value],
          ["pubDate", pubDate.value],
          ["notes", notes.value],
          ["inCoreColl", inCoreColl.checked],
          ["recLevel", recLevel.value],
          ["inNoveList", inNoveList.checked],
          ["inSeries", inSeries.checked],
          ["seriesName", seriesName.value],
          ["seriesNumber", seriesNumber.value],
          ["booklist", booklist.checked],
          ["pubWeekly", pubWeekly.checked],
          ["libJournal", libJournal.checked],
          ["kirkus", kirkus.checked],
          ["awards", awards.checked],
          ["copies", copyArray]
          ["nonMPLcopies", nonMPLcopies.value]
        ]
      });
    }
  });

  function clearForm() {
    title.value = "";
    ccode.value = "";
    pubDate.value = "";
    notes.value = "";
    inCoreColl.checked = false;
    recLevelWrap.style.display = "none";
    recLevel.value = "";
    inNoveList.checked = false;
    inNoveList.disabled = true;
    noveListWrap.style.display = "none";
    inSeries.checked = false;
    seriesName.value = "";
    seriesNumber.value = "";
    booklist.checked = false;
    pubWeekly.checked = false;
    libJournal.checked = false;
    kirkus.checked = false;
    awards.checked = false;
    copies.tBodies[0].innerHTML = "";
    copyArray = [];
    nonMPLcopies.value = "";
  }

  startOver.addEventListener('click', function() {
    // Scroll to top of page
    window.scrollTo(0,0);

    // Clear all fields
    barcode.value = "";
    clearForm();
  });
})();