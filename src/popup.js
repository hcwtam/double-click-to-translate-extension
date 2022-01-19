const checkbox = document.getElementById("power-checkbox");
browser.storage.local.get("doubleClickTranslate", function (result) {
  checkbox.checked = result.doubleClickTranslate;
});

checkbox.addEventListener("click", async () => {
  await browser.storage.local.set({ doubleClickTranslate: checkbox.checked });
  const tabs = await browser.tabs
    .query({ active: true, currentWindow: true })
    .catch((e) => {
      console.log(e);
    });

  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { turnedOn: checkbox.checked });
});

browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { turnedOn: checkbox.checked });
});
