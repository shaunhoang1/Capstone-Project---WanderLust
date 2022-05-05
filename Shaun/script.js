const sceneEl = document.querySelector("a-scene");
const skyEl = sceneEl.querySelector("#background");
console.log(skyEl);

AFRAME.registerComponent("button-interaction-handler", {
  init: function () {
    this.el.addEventListener("mouseenter", function () {
      skyEl.setAttribute("src", "#chineseTemple");
    });

    this.el.addEventListener("mouseleave", function () {
      skyEl.setAttribute("src", "#backgroundInsideHouse");
    });
  },
});
