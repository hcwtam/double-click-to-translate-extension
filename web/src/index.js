import axios from "axios";

const styles = {
  backgroundColor: "#111",
  color: "#fff",
  padding: "10px",
  position: "absolute",
  fontFamily: "sans-serif",
  whiteSpace: "pre",
  overflow: "auto",
  zIndex: "99999",
  fontSize: "16px",
  borderRadius: "5px",
};

// states
let power = true;
let srcLang = "detect";
let destLang = "zh-TW";

function setStyle(element) {
  for (let key in styles) {
    element.style[key] = styles[key];
  }
}

async function getTranslation(text, sourceLanguage, targetLanguage) {
  const res = await axios
    .post("https://translate.wesleytam.xyz/translate", {
      text,
      target: targetLanguage,
      source: sourceLanguage,
    })
    .catch((e) => {
      console.log(e);
    });
  return res.data.translatedText;
}

function removeTranslateElement() {
  const translateElements = document.getElementsByClassName(
    "translation-element"
  );
  if (translateElements.length > 0) translateElements[0].remove();
}

async function doubleClickToTranslate(event) {
  const selectedString = window.getSelection().toString();
  if (selectedString) {
    const selectedElement = event.target;
    const parent = selectedElement.parentNode;

    const selectionRect = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect(); // get selected string position (DOMRect object)

    // create translation element
    const translationElement = document.createElement("span");
    translationElement.className = "translation-element";
    translationElement.style.position = "relative";
    translationElement.style.left = "0";
    translationElement.style.top = "0";
    translationElement.style.height = "0px";
    translationElement.style.width = "100vw";
    translationElement.style.margin = "0";

    const translatedText = await getTranslation(
      selectedString,
      srcLang,
      destLang
    );

    const translationChild = document.createElement("span");
    translationChild.textContent = translatedText;
    setStyle(translationChild);
    translationChild.style.left =
      (selectionRect.x + document.documentElement.scrollLeft).toString() + "px";
    translationChild.style.top =
      (selectionRect.y - 30 + document.documentElement.scrollTop).toString() +
      "px";
    translationChild.style.maxWidth =
      (window.innerWidth - selectionRect.x - 20).toString() + "px";
    translationElement.appendChild(translationChild);
    document.documentElement.insertBefore(translationElement, document.body);
  }
}

document.addEventListener("click", removeTranslateElement);

browser.storage.local.get("srcLang", function (result) {
  if (result.srcLang) {
    srcLang = result.srcLang;
    return Promise.resolve(true);
  }
});
browser.storage.local.get("destLang", function (result) {
  if (result.destLang) {
    destLang = result.destLang;
    return Promise.resolve(true);
  }
});
browser.storage.local.get("doubleClickTranslate", function (result) {
  if (
    result.doubleClickTranslate ||
    result.doubleClickTranslate === undefined
  ) {
    document.addEventListener("mouseup", doubleClickToTranslate);
  } else {
    power = false;
  }
  return Promise.resolve(true);
});

browser.runtime.onMessage.addListener((message) => {
  if (message.command === "power") {
    if (message.turnedOn) {
      document.removeEventListener("mouseup", doubleClickToTranslate);
      document.addEventListener("mouseup", doubleClickToTranslate);
      power = true;
      return Promise.resolve(true);
    }
    if (message.turnedOn === false) {
      document.removeEventListener("mouseup", doubleClickToTranslate);
      power = false;
      return Promise.resolve(true);
    }
  }
  if (message.command === "srcLang") {
    document.removeEventListener("mouseup", doubleClickToTranslate);
    srcLang = message.srcLang;
    if (power) document.addEventListener("mouseup", doubleClickToTranslate);

    return Promise.resolve(true);
  }
  if (message.command === "destLang") {
    document.removeEventListener("mouseup", doubleClickToTranslate);
    destLang = message.destLang;
    if (power) document.addEventListener("mouseup", doubleClickToTranslate);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
});
