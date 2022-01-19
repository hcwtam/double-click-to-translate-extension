import axios from "axios";

const styles = {
  backgroundColor: "#111",
  color: "#fff",
  padding: "10px",
  position: "absolute",
};

// states
let srcLang = "detect";
let destLang = "zh-TW";

function setStyle(element) {
  for (let key in styles) {
    element.style[key] = styles[key];
  }
}

async function getTranslation(text, targetLanguage) {
  const res = await axios
    .post(
      "https://translation.googleapis.com/language/translate/v2?key=KEY",
      {
        q: text,
        target: targetLanguage,
      }
    )
    .catch((e) => {
      console.log(e);
    });
  return res.data.data.translations[0].translatedText; // res.data.data.translations[0] = { translatedText: "Hallo", detectedSourceLanguage: "en" }
}

function removeTranslateElement() {
  const translateElements = document.getElementsByClassName(
    "translation-element"
  );
  if (translateElements.length > 0) translateElements[0].remove();
}

async function doubleClickToTranslate(event) {
  removeTranslateElement();

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
    setStyle(translationElement);
    translationElement.style.left = selectionRect.left.toString() + "px";
    translationElement.style.top = (selectionRect.top - 45).toString() + "px";
    const translatedText = await getTranslation(selectedString, destLang);
    translationElement.textContent = translatedText;
    parent.insertBefore(translationElement, selectedElement);
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.command === "power") {
    if (message.turnedOn) {
      document.addEventListener("mouseup", doubleClickToTranslate);
      return Promise.resolve(true);
    }
    if (!message.turnedOn) {
      document.removeEventListener("mouseup", doubleClickToTranslate);
      return Promise.resolve(true);
    }
  }
  if (message.command === "srcLang") {
    document.removeEventListener("mouseup", doubleClickToTranslate);
    srcLang = message.srcLang;
    document.addEventListener("mouseup", doubleClickToTranslate);

    return Promise.resolve(true);
  }
  if (message.command === "destLang") {
    document.removeEventListener("mouseup", doubleClickToTranslate);
    destLang = message.destLang;
    document.addEventListener("mouseup", doubleClickToTranslate);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
});
