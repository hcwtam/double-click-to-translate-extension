const LANGUAGES = {
  Afrikaans: "af",
  Albanian: "sq",
  Amharic: "am",
  Arabic: "ar",
  Armenian: "hy",
  Azerbaijani: "az",
  Basque: "eu",
  Belarusian: "be",
  Bengali: "bn",
  Bosnian: "bs",
  Bulgarian: "bg",
  Catalan: "ca",
  Cebuano: "ceb",
  "Chinese (Simplified)": "zh-CN",
  "Chinese (Traditional)": "zh-TW",
  Corsican: "co",
  Croatian: "hr",
  Czech: "cs",
  Danish: "da",
  Dutch: "nl",
  English: "en",
  Esperanto: "eo",
  Estonian: "et",
  Finnish: "fi",
  French: "fr",
  Frisian: "fy",
  Galician: "gl",
  Georgian: "ka",
  German: "de",
  Greek: "el",
  Gujarati: "gu",
  "Haitian Creole": "ht",
  Hausa: "ha",
  Hawaiian: "haw",
  Hebrew: "he",
  Hindi: "hi",
  Hmong: "hmn",
  Hungarian: "hu",
  Icelandic: "is",
  Igbo: "ig",
  Indonesian: "id",
  Irish: "ga",
  Italian: "it",
  Japanese: "ja",
  Javanese: "jv",
  Kannada: "kn",
  Kazakh: "kk",
  Khmer: "km",
  Kinyarwanda: "rw",
  Korean: "ko",
  Kurdish: "ku",
  Kyrgyz: "ky",
  Lao: "lo",
  Latvian: "lv",
  Lithuanian: "lt",
  Luxembourgish: "lb",
  Macedonian: "mk",
  Malagasy: "mg",
  Malay: "ms",
  Malayalam: "ml",
  Maltese: "mt",
  Maori: "mi",
  Marathi: "mr",
  Mongolian: "mn",
  "Myanmar (Burmese)": "my",
  Nepali: "ne",
  Norwegian: "no",
  "Nyanja (Chichewa)": "ny",
  "Odia (Oriya)": "or",
  Pashto: "ps",
  Persian: "fa",
  Polish: "pl",
  Portuguese: "pt",
  Punjabi: "pa",
  Romanian: "ro",
  Russian: "ru",
  Samoan: "sm",
  "Scots Gaelic": "gd",
  Serbian: "sr",
  Sesotho: "st",
  Shona: "sn",
  Sindhi: "sd",
  "Sinhala (Sinhalese)": "si",
  Slovak: "sk",
  Slovenian: "sl",
  Somali: "so",
  Spanish: "es",
  Sundanese: "su",
  Swahili: "sw",
  Swedish: "sv",
  "Tagalog (Filipino)": "tl",
  Tajik: "tg",
  Tamil: "ta",
  Tatar: "tt",
  Telugu: "te",
  Thai: "th",
  Turkish: "tr",
  Turkmen: "tk",
  Ukrainian: "uk",
  Urdu: "ur",
  Uyghur: "ug",
  Uzbek: "uz",
  Vietnamese: "vi",
  Welsh: "cy",
  Xhosa: "xh",
  Yiddish: "yi",
  Yoruba: "yo",
  Zulu: "zu",
};

const checkbox = document.getElementById("power-checkbox");
const srcDropdown = document.getElementById("from-select");
const destDropdown = document.getElementById("to-select");

browser.storage.local.get("doubleClickTranslate", function (result) {
  checkbox.checked = result.doubleClickTranslate;
});

srcDropdown.value = "detect";
destDropdown.value = "zh-TW";


browser.storage.local.get("srcLang", function (result) {
  if (result.srcLang) {
    srcDropdown.value = result.srcLang;
  }
});

browser.storage.local.get("destLang", function (result) {
  if (result.destLang) {
    destDropdown.value = result.destLang;
  }
});

const option = document.createElement("option");
option.value = "detect";
option.innerHTML = "detected language";
option.selected = true;
srcDropdown.appendChild(option);

for (let lang in LANGUAGES) {
  const srcOption = document.createElement("option");
  srcOption.value = LANGUAGES[lang];
  srcOption.innerHTML = lang;
  srcDropdown.appendChild(srcOption);

  const destOption = document.createElement("option");
  destOption.value = LANGUAGES[lang];
  destOption.innerHTML = lang;
  destDropdown.appendChild(destOption);
}

checkbox.addEventListener("click", async () => {
  await browser.storage.local.set({ doubleClickTranslate: checkbox.checked });
  const tabs = await browser.tabs
    .query({ active: true, currentWindow: true })
    .catch((e) => {
      console.log(e);
    });

  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { command: "power", turnedOn: checkbox.checked });
});

srcDropdown.addEventListener("change", async () => {
  await browser.storage.local.set({ srcLang: srcDropdown.value });
  const tabs = await browser.tabs
    .query({ active: true, currentWindow: true })
    .catch((e) => {
      console.log(e);
    });

  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { command: "srcLang", srcLang: srcDropdown.value });
});

destDropdown.addEventListener("change", async () => {
  await browser.storage.local.set({ destLang: destDropdown.value });
  const tabs = await browser.tabs
    .query({ active: true, currentWindow: true })
    .catch((e) => {
      console.log(e);
    });

  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { command: "destLang", destLang: destDropdown.value });
});

browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
  for (const tab of tabs)
    await browser.tabs.sendMessage(tab.id, { command: "power", turnedOn: checkbox.checked });
});
