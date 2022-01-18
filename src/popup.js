const checkbox = document.getElementById("power-checkbox");
browser.storage.local.get("doubleClickTranslate", function(result) {checkbox.checked = result.doubleClickTranslate});

checkbox.addEventListener("click", async () => {
    await browser.storage.local.set({ doubleClickTranslate: checkbox.checked });
    await browser.tabs.sendMessage(tabs[0].id, { turnedOn: checkbox.checked });
});

browser.tabs.sendMessage(tabs[0].id, { turnedOn: checkbox.checked });
