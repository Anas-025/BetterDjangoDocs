const sectionContainer = document.querySelector("#docs-content > .section");
const sections = sectionContainer.querySelectorAll(".section");

window.onload = () => {
  addMarkers(sections, sectionContainer);
  addButtonToSections(sections);

  const setup = document.getElementById("setup");
  console.log("setup")
  if (!setup) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.id = "setup.css";
    link.href = chrome.runtime.getURL("setup.css");
    document.head.appendChild(link);
  }
};

const innerDimensions = (node) => {
  var computedStyle = getComputedStyle(node);

  let width = node.getBoundingClientRect().height; // width with padding
  let height = node.getBoundingClientRect().height; // height with padding

  height -=
    parseFloat(computedStyle.paddingTop) +
    parseFloat(computedStyle.paddingBottom);
  width -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);
  return { height, width };
};

const outerDimensions = (node) => {
  var computedStyle = getComputedStyle(node);

  let width = node.getBoundingClientRect().height; // width with padding
  let height = node.getBoundingClientRect().height; // height with padding

  height +=
    parseFloat(computedStyle.marginTop) +
    parseFloat(computedStyle.marginBottom);
  width +=
    parseFloat(computedStyle.marginLeft) +
    parseFloat(computedStyle.marginRight);
  return { height, width };
};

const addButtonToSections = (sections) => {
  sections.forEach((section, index) => {
    const { button, btnContainer, doubtContainer } = createButton();

    button.addEventListener("click", (e) => {
      handleChange("completed", index, button);
    });
    doubtContainer.addEventListener("click", (e) => {
      handleChange("doubt", index, doubtContainer);
    });

    section.appendChild(btnContainer);
  });
};

const addMarkers = (sections, container) => {
  const offset = 20;
  const windowHeight = window.innerHeight - offset;
  const containerHeight = innerDimensions(container).height;

  let total = 0;

  const marker = document.createElement("div");
  marker.classList.add("marker");
  marker.style.top = "-20px";
  document.body.appendChild(marker);

  sections.forEach((section) => {
    const sectionHeight = outerDimensions(section).height;
    const sectionRatio = sectionHeight / containerHeight;
    const markerTop = sectionRatio * windowHeight;
    total += markerTop;

    const marker = createMarker();
    marker.style.top = total + "px";
    document.body.appendChild(marker);

    marker.addEventListener("click", () => {
      section.scrollIntoView();
    });
  });
};

const shuffleStack = (element, stack) => {
  const thirdElement = stack.filter(
    (child) =>
      !child.classList.contains(element) && !child.classList.contains("front")
  )[0];
  const secondElement = stack.filter((child) =>
    child.classList.contains("front")
  )[0];
  const firstElement = stack.filter((child) =>
    child.classList.contains(element)
  )[0];

  firstElement.style = "z-index:  inherit";
  thirdElement.style = "z-index: 1 !important";
  secondElement.style = "z-index: 2 !important;";
  stack.forEach(
    (child) => child != firstElement && child.classList.remove("front")
  );
  firstElement.classList.add("front");
};

const createMarker = () => {
  const marker = document.createElement("div");
  const reading = document.createElement("img");
  const done = document.createElement("img");
  const doubt = document.createElement("img");

  reading.classList = "reading front";
  done.classList.add("done");
  doubt.classList.add("doubt");

  reading.src = chrome.runtime.getURL("images/reading.svg");
  done.src = chrome.runtime.getURL("images/done.svg");
  doubt.src = chrome.runtime.getURL("images/doubt.svg");

  marker.classList.add("marker");

  marker.appendChild(done);
  marker.appendChild(doubt);
  marker.appendChild(reading);

  return marker;
};

const createButton = () => {
  const btnContainer = document.createElement("div");
  const doubtContainer = document.createElement("div");
  const button = document.createElement("button");
  const svg = `<svg width="100%" height="100%" viewBox="0 0 40 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><path d="m 20 10 a 0 0 0 0 1 0 0 s 0 0 0 1 l 0 35 " fill="transparent" stroke="black" stroke-width="10px" stroke-linecap="round"></path><circle cx="20" cy="60" r="6"></circle></svg>`;

  btnContainer.classList.add("button-container");
  doubtContainer.classList.add("doubt-container");

  button.innerText = "Done";
  btnContainer.appendChild(button);
  doubtContainer.innerHTML = svg;
  btnContainer.appendChild(doubtContainer);

  return { button, doubtContainer, btnContainer };
};

// state = completed || doubt
const handleChange = (state, index, target) => {
  const container = target.parentElement;
  const markers = document.querySelectorAll(".marker");
  const markersArray = Array.from(markers[index + 1].children);
  const height =
    parseFloat(markers[index + 1].style.top) -
    parseFloat(markers[index].style.top) - 1;
  state === "completed"
    ? (container.classList.toggle("completed"),
      container.classList.remove("doubt"))
    : (container.classList.toggle("doubt"),
      container.classList.remove("completed"));
  const flag =
    container.classList.contains("completed") ||
    container.classList.contains("doubt");

  markers[index].style.height = flag ? height + "px" : 0;
  markers[index].style.backgroundColor =
    state === "completed" ? "rgb(68 183 139)" : "#ffc72c";

  setTimeout(() => {
    let button;
    target.tagName === "Button"
      ? (button = target)
      : (button = target.parentElement.children[0]);
    button.innerText = flag ? "Undo" : "Done";
  }, 150);
  shuffleStack(
    !flag ? "reading" : state === "completed" ? "done" : "doubt",
    markersArray
  );
};
