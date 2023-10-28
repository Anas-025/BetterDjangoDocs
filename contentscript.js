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

btn.onclick = async () => {
  if (state === "open") {
    document.head.appendChild(link);

    state = "closed";
    window.localStorage.setItem("state", state);
  } else {
    link.remove();

    state = "open";
    window.localStorage.setItem("state", state);
  }
};

document.body.addEventListener("keydown", (e) => {
  if (e.key === "b" && state === "open") {
    document.head.appendChild(link);
    main.appendChild(searchContainer);
    
    state = "closed";
    window.localStorage.setItem("state", state);
  } else if (e.key === "b" && state === "closed") {
    link.remove();
    nav.appendChild(searchContainer);

    state = "open";
    window.localStorage.setItem("state", state);
  }
});

window.onload = () => {
  const state = window.localStorage.getItem("state");
  console.log(state);

  if (state === "closed") {
    document.head.appendChild(link);

    if (window.localStorage.getItem("close-button") === "closed") {
      container.classList.toggle("closed");
      closeBtn.classList.toggle("button-closed");
    }
  }

  const setup = document.getElementById("setup");
  console.log("setup");
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
