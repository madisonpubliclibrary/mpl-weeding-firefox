browser.browserAction.onClicked.addListener((tab, OnClickData) => {
  browser.tabs.create({
    "url": browser.runtime.getURL("./html/weedingSlip.html"),
    "active": true
  });
});

browser.runtime.onMessage.addListener((data, sender) => {
  if (data.key === "barcode") {
    return browser.tabs.create({
      "url": "https://scls.bibliovation.com/app/search/" + data.barcode,
      "active": true
    }).then(tab => {
      return browser.tabs.executeScript(tab.id, {
        "file": "/contentScripts/getItemBib.js"
      }).then(res => {
        browser.tabs.remove(tab.id);
        return res;
      });
    }).then(resArr => {
      let payload = resArr[0];
      
      return browser.tabs.create({
        "url": "https://scls.bibliovation.com/cgi-bin/koha/catalogue/MARCdetail.pl?biblionumber=" + payload.itemBib,
        "active": true
      }).then(tab => {
        return browser.tabs.executeScript(tab.id, {
          "file": "/contentScripts/scrapeMARC.js"
        }).then(resArr => {
          browser.tabs.remove(tab.id);
          // For now, we'll include the full title scraped form the Detail page in getItemBib.js
          // rather than the MARC Title field (which is just one part of the full title).
          //payload.title = resArr[0].title;
          payload.pubDate = resArr[0].pubDate;
          return payload;
        });
      });
    }).then(res => {
      let payload = res;

      return browser.tabs.create({
        "url": "https://scls.bibliovation.com/app/staff/bib/" + payload.itemBib + "/items/circstatus",
        "active": true
      }).then(tab => {
        return browser.tabs.executeScript(tab.id, {
          "file": "/contentScripts/scrapeStatuses.js"
        }).then(resArr => {
          browser.tabs.remove(tab.id);
          payload.mplItems = resArr[0].copies;
          payload.nonMPLcopies = resArr[0].nonMPLcopies;
          return payload;
        });
      });
    });
  } else if (data.key === "printWeedingSlip") {
    browser.tabs.create({
      "active": false,
      "url": browser.runtime.getURL("../html/printWeedingSlip.html")
    }).then(tab => {
      setTimeout(() => {
        browser.tabs.sendMessage(tab.id, {
          "key": "printWeedingSlip",
          "data": data.data
        }).then(() => {
          //browser.tabs.remove(tab.id);
        });
      }, 500);
    });
  }
});