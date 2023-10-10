/**
 * @param {Boolean} bool 
 * @returns The current date, YYYY-MM-DD if bool is false,
 *          or MM/DD/YYYY if bool is true
 */
let getCurrDate = function(bool) {
  const d = new Date();

  let month = (d.getMonth()+1).toString();
  let day = d.getDate().toString();

  if (month.length == 1 && !bool) {
      month = "0" + month;
  }

  if (day.length == 1 && !bool) {
    day = "0" + day;
  }

  return bool ?
    month + "/" + day + "/" + d.getFullYear() :
    d.getFullYear() + "-" + month + "-" + day;
};

browser.runtime.onMessage.addListener(message => {
  if (message.key === "printProblemForm" ) {
    for (let d of message.data) {
      var elt = document.getElementById(d[0]);

      if (elt) {
        if (d[0] === "ckiBySorter" && d[1] === "true") {
          elt.classList.remove("hide");
        } else {
          if (/cCode|holds|copies|use|patronName|patronBarcode|patronPhone|patronEmail/.test(d[0]) && d[1] == "") {
            document.getElementById(d[0]+"Wrap").classList.add("hide");
          } else {
            elt.textContent = d[1];
          }
        }
      }
    }

    window.print();
  }
});
