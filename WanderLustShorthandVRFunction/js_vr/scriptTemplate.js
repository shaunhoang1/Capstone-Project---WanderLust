/// This is the Javascript file, Copied as template and used as StoryFunctions, which will run all JS Functions to control the VR Story

let objParas = [];
objParas[0]="";
let pageChanging = false;
let storyParagraphs = [];
let imgRepo = [];
let objSky = "";
let sectionImages = []; //Initiate the Array of images for the new section
let sectionObjects = []; //Initiate the Array of Objects for the new section
let sectionAudio =""
let fontSizeInt = 0;
//Define the Backgrounds
let currentSky = 0;
const skies = [];
{
  skies[1] = "#sky1";
  skies[2] = "#sky2";
  skies[3] = "#sky3";
  skies[4] = "#sky4";
  skies[5] = "#sky5";
  skies[6] = "#sky6";
  skies[7] = "#sky7";
  skies[8] = "#sky8";
  skies[9] = "#sky9";
}

const imgPositions = [
  "-2.4 1.5 -2",
  "2.4 1.5 -2",
  "-3.3 1.5 1",
  "3.3 1.5 1"
];

let fontBold="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Bold.fnt";
let fontItalic="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Italic.fnt";
let fontItalicBold="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Italic_Bold.fnt";
let fontLight="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Light.fnt";
let fontRegular="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Regular.fnt";

//Define the page number and change for all text objects
let scrollingHeight = [];
scrollingHeight[0] = -5;
let scrollTick=0.01;
let currentPage = 0;
//the vr controller
AFRAME.registerComponent('thumbstick-logging',{
  init: function () {
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },
  logThumbstick: function (evt) {
    if(!pageChanging){
      if (evt.detail.y > 0.95) {  
        scrollTick-=0.01
      }else if (evt.detail.y < -0.95) {
        scrollTick+=0.01
      }

    if (evt.detail.x < -0.95) {
      scrollingHeight[0] = 0;
      // console.log("Previous Page")
      nextSection(-1); }
    if (evt.detail.x > 0.95) {
      scrollingHeight[0] = 0;
      // console.log("Next Page")
      nextSection(1); }
  }
  }})
//All JS Functions which are required to navigate through the story are created here
document.addEventListener("keydown", function (event) {
  if(!pageChanging){
    //Scroll through paragraphs
    //Go to previous paragraph
    if (event.key === "1") {
      scrollingHeight[0] = -5;
      // console.log("Previous Page")
      nextSection(-1);
      //Go to next paragraph
    } else if (event.key === "3") {
      scrollingHeight[0] = -5;
      // console.log("Next Page")
      nextSection(1);
    }
  
    //Increases the scrolling speed
    if (event.key === "e"){
      scrollTick+=0.01
    } else if (event.key === "q") {
      scrollTick-=0.01
    }

    //Reset the Story
    if (event.key === "r"){
      currentPage=0;
      currentSky = 0; 
      nextSection(1); //Initialize New State of story
    }
  }
});

//On Mousewheel scroll, manually scroll the text and stop auto-scroll
document.onmousewheel = function(event) {
  if(!pageChanging){
    let scrollDirection = receiveMouseWheelDir(event); //determine scroll direction
    scrollTick=scrollDirection*0.5; //Turn off autoscroll
    scroll();

    scrollTick=0;
    console.log(scrollingHeight[0] );
  }
};

//Determine the mouse wheel scrolling direction
function receiveMouseWheelDir(event)
{
    let delta = null,
        direction = false;
    if (!event){ // if the event is not provided, we get it from the window object
      event = window.event;
    }
    //Receives scrolling direction based on browser
    if (event.wheelDelta){ // will work in most cases
        delta = event.wheelDelta / 60;
    } else if (event.detail){ // fallback for Firefox
        delta = -event.detail / 2;
    }
    //If scroll data could be retrieved, then set delta variable
    if (delta !== null){
        direction = delta > 0 ? 1 : -1;
    }

    return direction;
}

//Scroll - Scrolls the text by incrementing the scrollingheight of all text objects, then updates the opacity of them all.
function scroll(scrollChange=0){ //direction, -1 = down, 1=up
  if (scrollChange!==0){
    scrollTick+=scrollChange
  }
  if(!pageChanging){
    scrollingHeight[0] = scrollingHeight[0]+scrollTick;
    //Remove existing animations
    objParas[0].removeAttribute("animation__pos");
    objParas[0].object3D.position.y = scrollingHeight[0];
  }
  setOpacity();
}
//Start on-going timer to set moving text & image opacity
setInterval(scroll, 10);

//WrapAround function to loop array variables,
//and can also change the variable which it is based on.
//Returns "True" or "False" in case additional functions depend on the wrap status
function wrapAround(current, min, max) {
  let wrapped = false;
  if (current > max) {
    current = min;
    wrapped = true;
  } else if (current < min) {
    current = max;
    wrapped = true;
  }
  return [wrapped, current];
}

//Function triggers for each new section in the story, to update object, images and text to the next section
function nextSection(pageChange) {
  pageChanging=true;
  scrollTick=0.01;
  //Delete Current page properties
  objParas[0].removeAttribute("animation__pos");
  objParas[0].setAttribute("value", "");
  objParas[0].setAttribute("opacity", 0);
  let notNewSection=true;
  while(notNewSection){
    currentPage = currentPage+pageChange;

    //Prevent the user from scrolling before the first page, or after the last page
    if(currentPage<1){
      currentPage=currentPage-pageChange;
    }else{
      changeSky(pageChange); //Update skybox to respective image
    }
    // currentPage = wrapAround(currentPage + pageChange,1,storyParagraphs.length - 1)[1];
    if (storyParagraphs[currentPage-1]==="New Section"){
      notNewSection=false;
    }else if (currentPage>storyParagraphs.length){
      pageChange=-1;
      (function(){window.location='indexVRGuide.html'})()
    }
  }

  //Update paragraph text value
  for(i in objParas){
    objParas[i].setAttribute("Opacity", 0);
  }
  //console.log(currentPage-1+": "+storyParagraphs[currentPage]);
  //Reset and activate the Position animation
  objParas[0].removeAttribute("animation__pos");
  // objParas[0].setAttribute(
  //   "animation__pos",
  //   "property: position; from:0 -10 -15;to: 0 10 -15; dur:10000; easing: linear; loop: false;"
  // );
  for (i in sectionImages) {
    let elmnt = document.getElementById(sectionImages[i]);
    elmnt.setAttribute("animation__opa","property: opacity; from:1;to: 0; dur:1000; easing: linear; loop: false;");
  }

  for (i in sectionObjects) {
    let elmnt = document.getElementById(sectionObjects[i]);
    elmnt.setAttribute("animation__scale","property: scale; from:0.02 0.02 0.02;to: 0 0 0; dur:1000; easing: linear; loop: false;");
  }
  sectionImages.length=0
  sectionObjects.length=0
  setTimeout(refreshMedia, 1000);
}

//Control the opacity of paragraphs as they change height
function setOpacity() {
  for(i in objParas){
      let textTarget = objParas[i];
      scrollingHeight[i] = textTarget.object3D.position.y;
      if (scrollingHeight[i] > -4.5 && scrollingHeight[i] < 19.5) {
        // Control opacity while scrolling
        if (scrollingHeight[i] >= 15) { //Gradient fade when too high
          textTarget.setAttribute("opacity", (20- scrollingHeight[i]) / 5);
        } else if (scrollingHeight[i] <= 0) { //Gradient fade when too low
          textTarget.setAttribute("opacity", (5+scrollingHeight[i]) / 5);
        } else { //Set max opacity when center of screen
          textTarget.setAttribute("opacity", 1);
        }
      } else{  //Set opacity to zero when outside borders
        textTarget.setAttribute("opacity", 0);
      } 
  }

  //Check if image has scrolled outside of borders
  if (scrollingHeight[0]<-5){
    nextSection(-1);
    scrollingHeight[0]=-5;
    objParas[0].object3D.position.y = scrollingHeight[0];
  }else if(scrollingHeight[scrollingHeight.length-1]>20){
    nextSection(1);
    scrollingHeight[0]=-5;
    console.log("Bottom Para is above threshold")
    objParas[0].object3D.position.y = scrollingHeight[0];
  }
  for(i in objParas){
    if(i>0){
      objParas[i].object3D.position.y = objParas[i-1].object3D.position.y-4;
    }
  }
}


//Initialize all text from the story JSON.
function importStory() {
  iniParagraphObjects(); //Initialize the html text objects
  //retrieveStoryAssets = retrieveStory(); //retrieve the story from the json

  // storyParagraphs.unshift("New Section");
  currentPage = 0;
  currentSky = 0; //Initialize New State of story
  nextSection(1); //Begin story
}
setTimeout(importStory, 5); //Required to begin the story

//Navigate to next/previous skybox image
function changeSky(skyChange) {
  currentSky = wrapAround(currentSky + skyChange, 1, skies.length - 1)[1];
  objSky.removeAttribute("animation__opa");
  objSky.setAttribute(
    "animation__opa",
    "property: opacity; from:1;to: 0; dur:1000; easing: linear; loop: false;"
  );
  setTimeout(setSkyFadeIn, 1000);
}

function setSkyFadeIn() {
  objSky.removeAttribute("animation__opa");
  objSky.setAttribute("src", skies[currentSky]);
  objSky.setAttribute(
    "animation__opa",
    "property: opacity; from:0;to: 1; dur:300; easing: linear; loop: false;"
  );
}

//Create all the images for the current section
function createImages() {
  //Clear previous sections images
  let currentImages=0;
  for (i in sectionImages) {
    //For each image in this section
    //Check how many pictures there are
    let imgOffset = 0;
    let img ="";
    //Create the new HTML Element for the picture
    let src = "";
    for (j in imgRepo) {
      //Find the image file for the current image
      if (imgRepo[j].includes(sectionImages[i])) {
        src = imgRepo[j];
      }
    }
    if(src.includes("mp4")){      
      img = document.createElement("a-video");
      img.setAttribute("id", "sectionVideo" + currentImages);
    }else{
      img = document.createElement("a-image");
      img.setAttribute("id", "sectionPicture" + currentImages);
    }
    
    img.setAttribute("src", src);
    img.setAttribute("Opacity", "0");
    img.setAttribute("scale", "1.6 1.6 1.6");
    img.setAttribute("look-at","#cameraObj");

    //set img offset
    let offset = -currentImages * 8 + 5;
    if (currentImages % 2 == 0) {
      imgOffset = -1;
    } else {
      imgOffset = 1;
    }

    /* FOR IMAGES MOVING WITH TEXT
    let pos = imgOffset*2+" "+offset+" -2";
    if(imageNums.length==1){
        pos="0 0 -2";
    }*/
    let pos = imgOffset * 19 + " " + offset + " -21";
    if (sectionImages.length == 1) {
      pos = "0 0 -21";
    }
    pos=imgPositions[currentImages]
    img.setAttribute("position", pos);

    sectionImages[currentImages] = img.getAttribute("id");
    //Create the image element
    let element = document.getElementById("imageParent");
    element.appendChild(img);
    img.removeAttribute("animation__opa");
    //ANIMATION ATTRIBUTE FOR BACKGROUND IMAGES TO FADE IN
    img.setAttribute(
      "animation__opa",
      "property: opacity; from:0;to: 1; dur:1000; easing: linear; loop: false;"
    );
    currentImages++;
  }
}

//Create all the images for the current section
function createAudio() {
  console.log("Create Audio:"+sectionAudio)
  let audio ="";
  //Create the new HTML Element for the picture
  let src = "";
  for (j in imgRepo) {
    //Find the image file for the current image
    if (imgRepo[j].includes(sectionAudio)) {
      src = imgRepo[j];
    }
  }
  audio = document.createElement("a-sound");
  audio.setAttribute("id", "sectionAudio");
  audio.setAttribute("src", src);
  audio.setAttribute("autoplay", "true");
  audio.setAttribute("on", "true");
  audio.setAttribute("loop", "true");
  //Create the image element
  let element = document.getElementById("imageParent");
  element.appendChild(audio);
}

function createObjects() {
  //Clear previous sections images
  //deleteMovingImage();
  let currentObjects = 0;
  for (i in sectionObjects) {
    //For each image in this section
    //Check how many pictures there are
    let objCount = currentObjects;

    //Create the new HTML Element for the picture
    let obj = document.createElement("a-entity");
    obj.setAttribute("id", "movingObj" + objCount);
    let src = "";
    let mtl = "";
    for (j in imgRepo) {
      //Find the image file for the current image
      if (imgRepo[j].includes(sectionObjects[i])) {
        src = imgRepo[j].slice(0, -3)+"obj";
        if (imgRepo[j].includes(".mtl")){
          mtl = imgRepo[j].slice(0, -3)+"mtl";
        }
      }
    }
    obj.setAttribute("obj-model", "obj: " + src+";mtl:"+mtl+";");
    obj.setAttribute("color", "#00FF00");
    obj.setAttribute("scale", "0 0 0");
    obj.setAttribute("position", "0 0 0");

    sectionObjects[objCount] = obj.getAttribute("id");

    //Create the object element
    let element = document.getElementById("objectParent");
    element.appendChild(obj);
    obj.removeAttribute("animation__sca");
    //ANIMATION ATTRIBUTE FOR OBJECTS TO SCALE INTO SCENE
    obj.setAttribute(
      "animation__sca",
      "property: scale; from:0 0 0;to: 0.02 0.02 0.02; dur:1000; easing: linear; loop: false;"
    );
    currentObjects++;
  }
}

function createText(currentPara,width){
  let txt = document.createElement("a-text");
  txt.setAttribute("id", "textPara"+objParas.length);
  txt.setAttribute("color", "#FFFFFF");
  txt.setAttribute("scale", width+" "+width+" 3");
  txt.setAttribute("value", currentPara);
  txt.setAttribute("align", "center");
  txt.setAttribute("opacity", "0");
  txt.setAttribute("position", "0 -5 -15");
  txt.setAttribute("width", width);
  objParas.push(txt);
  scrollingHeight[objParas.length-1]=-5;

  //Create the Text element
  let element = document.getElementById("textParent");
  element.appendChild(txt);  
}

//Delete all media from the document, and sets timers to create the next section's media
function refreshMedia() {
  const imageParent = document.getElementById("imageParent");
  const objectParent = document.getElementById("objectParent");
  const textParent = document.getElementById("textParent");
  while(imageParent.hasChildNodes()){
    //imageParent.firstChild.pause();
    let elID=imageParent.firstElementChild?.getAttribute("id");
    if (elID!==undefined){
      if((imageParent.firstElementChild.getAttribute("id")).includes("Video")){
        document.getElementById(elID).pause();
        document.querySelector("#"+elID).pause();
      }
      if((imageParent.firstElementChild.getAttribute("id")).includes("Audio")){
        document.getElementById(elID).setAttribute("on", "false");
      }
    }
    imageParent.removeChild(imageParent.firstChild );
  }
  while(objectParent.hasChildNodes()){objectParent.removeChild(objectParent.firstChild);}
  while(textParent.hasChildNodes()){textParent.removeChild(textParent.firstChild);objParas.shift();}
  sectionimages = [];
  sectionObjects = [];
  scrollingHeight=[];
  scrollingHeight[0]=-5;
  let tempImageNum = currentPage; //Temp integer at current page to navigate through all story components in this section
  let sectionFound = false; //Boolean to check when the section ends
  let currentText = ""; //Str var for all the text in this section

  //Run until the end of section
  while (!sectionFound) {
    if (storyParagraphs[tempImageNum].includes("(FONT:)")) {
      let fontSizeStr = storyParagraphs[tempImageNum].slice(7);
      switch(fontSizeStr){
        case "xxxsmall":
          fontSizeInt = 4;
          break;
        case "xxsmall":
          fontSizeInt = 4.1;
          break;
        case "xsmall":
          fontSizeInt = 4.2;
          break;
        case "small":
          fontSizeInt = 4.3;
          break;
        case "xxxlarge":
          fontSizeInt = 4.6;
          break;
      }
    }else if (storyParagraphs[tempImageNum].includes("New Section")) {
      //If next section found, end the search
      sectionFound = true;
    } else if (storyParagraphs[tempImageNum].includes("(IMAGE-") ||
      storyParagraphs[tempImageNum].includes("(VIDEO-")) {
      //If an image or video is found, then push them to the image array for loading
      sectionImages.push(storyParagraphs[tempImageNum].slice(11));
    } else if (storyParagraphs[tempImageNum].includes("(OBJECT-")) {
      //If an image or video is found, then push them to the image array for loading
      sectionObjects.push(storyParagraphs[tempImageNum].slice(11));
    } else if (storyParagraphs[tempImageNum].includes("AUDIO--")) {
      //If an image or video is found, then push them to the image array for loading
      sectionAudio = storyParagraphs[tempImageNum].slice(11);
    } else {
      //Otherwise add the current text to the section text var
      let lengthCheck=Math.floor(storyParagraphs[tempImageNum].length / 150);
      currentText = currentText + storyParagraphs[tempImageNum]+ "\n\n";
      if(lengthCheck>0){
        createText("",fontSizeInt);
        createText(storyParagraphs[tempImageNum],fontSizeInt);
        createText("",fontSizeInt);
      }else{
        createText(storyParagraphs[tempImageNum],fontSizeInt);
      }
    }

    //check up to the next story component
    tempImageNum = tempImageNum + 1;
    if (tempImageNum > storyParagraphs.length - 1) {
      sectionFound = true;
    } //If last story component, then mark end of section
  }

  //Set the text object value to the current section's text
  // objParas[0].setAttribute("value", currentText);
  // objParas[0].setAttribute("font", fontItalicBold);
  //Create all images for the current section
  createImages();
  createAudio();
  createObjects();
  
  pageChanging=false;
}

//define all paragraph objects
function iniParagraphObjects() {
  objParas[0]=document.getElementById("textPara0");
  objParas[0].object3D.position.y = -5;
  scrollingHeight[0]=-5;
  objSky = document.getElementById("sky");
}