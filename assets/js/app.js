const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");
const englishAudio = new Audio("./assets/audio/Eng.mpeg");
const hindiAudio = new Audio("./assets/audio/Hindi.mpeg");
const gujratiAudio = new Audio("./assets/audio/Gujarati.mpeg");
const DEFAULT_LANG = "English";
const STORAGE_KEY = "selectedLanguage";
let translations = {};

function setActiveButton(activeBtn) {
  const languageContainer = document.querySelector(".language-container");

  [btnEn, btnHi, btnGu].forEach((btn) => {
    if (btn) btn.classList.remove("active");
  });

  if (languageContainer) {
    languageContainer.classList.remove(
      "active-english",
      "active-hindi",
      "active-gujrati",
    );
  }

  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  if (activeBtn === btnEn && languageContainer) {
    languageContainer.classList.add("active-english");
  }

  if (activeBtn === btnHi && languageContainer) {
    languageContainer.classList.add("active-hindi");
  }

  if (activeBtn === btnGu && languageContainer) {
    languageContainer.classList.add("active-gujrati");
  }
}

function applyLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  document.documentElement.lang = lang;

  if (lang === "English") {
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");

    if (langData[key] !== undefined) {
      el.innerHTML = String(langData[key]).replace(/\n/g, "<br>");
    }
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

function isPageRefresh() {
  const navEntries = performance.getEntriesByType("navigation");

  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }

  return performance.navigation.type === 1;
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("./assets/json/data.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;

      let langToApply = DEFAULT_LANG;
      const savedLang = localStorage.getItem(STORAGE_KEY);

      if (isPageRefresh()) {
        langToApply = DEFAULT_LANG;
        localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
      } else {
        langToApply = savedLang || DEFAULT_LANG;
      }

      applyLanguage(langToApply);
    })
    .catch((err) => console.error("Error loading translations:", err));
});

if (btnEn) {
  btnEn.addEventListener("click", () => {
    englishAudio.currentTime = 0;
    englishAudio.play();
    applyLanguage("English");
  });
}

if (btnHi) {
  btnHi.addEventListener("click", () => {
    hindiAudio.currentTime = 0;
    hindiAudio.play();
    applyLanguage("Hindi");
  });
}

if (btnGu) {
  btnGu.addEventListener("click", () => {
    gujratiAudio.currentTime = 0;
    gujratiAudio.play();
    applyLanguage("Gujarati");
  });
}
