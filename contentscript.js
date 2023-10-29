const searchContainer = document.querySelector(".form-input");
const container = document.querySelector(".sidebar-right");
const sidebar = document.querySelector("[role='complementary']");
const main = document.querySelector("[role='main']");
const nav = document.querySelector(".copy-banner>div");
const head = sidebar.children[1];

const btn = document.createElement("div");
const closeBtn = document.createElement("span");
const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.id = "focus-mode";
link.href = chrome.runtime.getURL("focus-mode.css");

closeBtn.innerHTML = "&larr;";
closeBtn.classList.add("close-button");

btn.innerText = "x";
btn.classList.add("focus-button");

document.body.appendChild(btn);
main.appendChild(closeBtn);
searchContainer.appendChild(btn);

let state = "open";

document.body.addEventListener("keydown", e => e.key === "b" && handleLoadExtension());

const handleLoadExtension = () => {
  if (window.localStorage.getItem("state") === "closed") {
    document.head.appendChild(link);
    main.appendChild(searchContainer);
    window.localStorage.setItem("state", "open");
  } else if (window.localStorage.getItem("state") === "open") {
    link.remove();
    nav.appendChild(searchContainer);
    window.localStorage.setItem("state", "closed");
  }
};

btn.onclick = handleLoadExtension;

window.onload = () => {
  const state = window.localStorage.getItem("state");

  if (state === "closed") {
    document.head.appendChild(link);

    if (window.localStorage.getItem("close-button") === "closed") {
      container.classList.toggle("closed");
      closeBtn.classList.toggle("button-closed");
    }
  }

  const setup = document.getElementById("setup");
  if (!setup) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.id = "setup.css";
    link.href = chrome.runtime.getURL("setup.css");
    document.head.appendChild(link);
  }
};

closeBtn.addEventListener("click", () => {
  container.classList.toggle("closed");
  closeBtn.classList.toggle("button-closed");

  if (window.localStorage.getItem("close-button") === "closed") {
    localStorage.setItem("close-button", "open");
  } else {
    window.localStorage.setItem("close-button", "closed");
  }
});
