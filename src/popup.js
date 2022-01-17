const checkbox = document.getElementById("power-checkbox");
browser.storage.local.get("doubleClickTranslate", function(result) {checkbox.checked = result.doubleClickTranslate});

checkbox.addEventListener("click", (e) => {
browser.storage.local.set({ doubleClickTranslate: checkbox.checked });
});
