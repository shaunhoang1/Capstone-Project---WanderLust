
let objParas = [];
objParas[0]="";
//pageChanging variable, to block all inputs while transitioning between sections
let pageChanging = false;
//Array holding all paragraphs
let storyParagraphs = [];
//Array containing the file path for all media
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
//Array containing the positions of multiple images, to place them around the reader
const imgPositions = [
  "-2.4 1.5 -2",
  "2.4 1.5 -2",
  "-3.3 1.5 1",
  "3.3 1.5 1"
];

//Set rich text formatting variables ######### NOT ACTIVE
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

//the vr controller inputs to scroll and skip
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
      console.log("Previous Page")
      nextSection(-1); }
    if (evt.detail.x > 0.95) {
      scrollingHeight[0] = 0;
      console.log("Next Page")
      nextSection(1); }
  }
}})

//Keyboard event listeners to scroll and skip through the story
document.addEventListener("keydown", function (event) {
  if(!pageChanging){
    //Scroll through paragraphs
    //Go to previous paragraph
    if (event.key === "q") {
      scrollingHeight[0] = -5;
      console.log("Previous Page")
      nextSection(-1);
      //Go to next paragraph
    } else if (event.key === "e") {
      scrollingHeight[0] = -5;
      console.log("Next Page")
      nextSection(1);
    }
  
    //Increases the scrolling speed
    if (event.key === "i"){
      scrollTick+=0.01
    } else if (event.key === "k") {
      scrollTick-=0.01
    }
  }
});

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
  //
  pageChanging=true;
  scrollTick=0.01;
  //Delete Current page properties
  for(i in objParas){
    objParas[i].setAttribute("Opacity", 0);
    objParas[i].setAttribute("value", "");
  }
  //Prepare for finding new section loop
  let notNewSection=true;
  while(notNewSection){
    currentPage = currentPage+pageChange;

    //Prevent the user from scrolling before the first page, or after the last page
    if(currentPage<1 || currentPage>storyParagraphs.length-1){
      currentPage=currentPage-pageChange;
    }else{
      changeSky(pageChange); //Update skybox to respective image
    }

    //Stop loop when new section found
    if (storyParagraphs[currentPage-1]==="New Section"){
      notNewSection=false;
    }
  }

  //Fade out all images and objects
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
  //Set the timeout to refresh media, in time with everything fading out/ disappearing
  setTimeout(refreshMedia, 1000);
}

//Control the opacity of paragraphs as they change height
function setOpacity() {
  for(i in objParas){
      let textTarget = objParas[i];
      //Set the scrollingHeight variable for easy reference
      scrollingHeight[i] = textTarget.object3D.position.y;
      //If scrolling height within visible bounds, then set opacity gradient
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

  //Check if scrolled outside of borders 
  //then go to respective page and reset the height variables
  if (scrollingHeight[0]<-5){ //if scrolled down - previous
    nextSection(-1);
    scrollingHeight[0]=-5;
    objParas[0].object3D.position.y = scrollingHeight[0];
  }else if(scrollingHeight[scrollingHeight.length-1]>20){ //if scrolled up - next
    nextSection(1);
    scrollingHeight[0]=-5;
    objParas[0].object3D.position.y = scrollingHeight[0];
  }
  for(i in objParas){
    if(i>0){
      objParas[i].object3D.position.y = objParas[i-1].object3D.position.y-4;
    }
  }
}

//Initialize all text from the story JSON, as extracted from ExtractSTory
function importStory() {
  iniParagraphObjects(); //Initialize the html text objects
  //retrieveStoryAssets = retrieveStory(); //retrieve the story from the json

  // Add final objects to story paragraph
  storyParagraphs[-1]="The End!";
  storyParagraphs[-1]="New Section";
  currentPage = 0;
  currentSky = 0; //Initialize New State of story
  nextSection(1); //Begin story
}
setTimeout(importStory, 5); //Required to begin the story

//Navigate to next/previous skybox image
function changeSky(skyChange) {
  currentSky = wrapAround(currentSky + skyChange, 1, skies.length - 1)[1];
  objSky.removeAttribute("animation__opa");
  //Fade the sky out
  objSky.setAttribute(
    "animation__opa",
    "property: opacity; from:1;to: 0; dur:1000; easing: linear; loop: false;"
  );
  //Set the timer to fade the next sky back in
  setTimeout(setSkyFadeIn, 1000);
}
//After faded out, change skybox then fade in
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
    //Create respective video or image elements
    if(src.includes("mp4")){      
      img = document.createElement("a-video");
      img.setAttribute("id", "sectionVideo" + currentImages);
    }else{
      img = document.createElement("a-image");
      img.setAttribute("id", "sectionPicture" + currentImages);
    }
    //assign properties to the media
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
    let pos = imgOffset * 19 + " " + offset + " -21";
    if (sectionImages.length == 1) {
      pos = "0 0 -21";
    }
    pos=imgPositions[currentImages]
    img.setAttribute("position", pos);

    //add the new image to the array of images
    sectionImages[currentImages] = img.getAttribute("id");
    //Create the image element and attach to parent
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
  //Create audio element and assign attributes
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

//Create any objects found in the story.json
function createObjects() {
  let currentObjects = 0;
  //For each object path extracted for the section
  for (i in sectionObjects) {
    let objCount = currentObjects;

    //Create the new HTML Element for the object
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
    //Assign all attributes
    obj.setAttribute("obj-model", "obj: " + src+";mtl:"+mtl+";");
    obj.setAttribute("color", "#00FF00");
    obj.setAttribute("scale", "0 0 0");
    obj.setAttribute("position", "0 0 0");

    //Add the object ID to the object array
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

//For each paragraph in a section, create a text object
function createText(currentPara,width){
  //Create new text element and assign attributes
  let txt = document.createElement("a-text");
  txt.setAttribute("id", "textPara"+objParas.length);
  txt.setAttribute("color", "#FFFFFF");
  txt.setAttribute("scale", width+" "+width+" 3");
  txt.setAttribute("value", currentPara);
  txt.setAttribute("align", "center");
  txt.setAttribute("opacity", "0");
  txt.setAttribute("position", "0 -5 -15");
  txt.setAttribute("width", width);
  //Add the new text object the objParas array
  objParas.push(txt);
  scrollingHeight[objParas.length-1]=-5;

  //Create the Text element
  let element = document.getElementById("textParent");
  element.appendChild(txt);  
}

//Delete all media from the document
function refreshMedia() {
  //find the parent objects
  const imageParent = document.getElementById("imageParent");
  const objectParent = document.getElementById("objectParent");
  const textParent = document.getElementById("textParent");
  //Remove all children objects from media, objects and text parents
  while(imageParent.hasChildNodes()){
    //imageParent.firstChild.pause();
    let elID=imageParent.firstElementChild?.getAttribute("id")
    console.log(elID)
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
  //clear the object arrays
  sectionimages = [];
  sectionObjects = [];
  scrollingHeight=[];
  scrollingHeight[0]=-5;
  let tempImageNum = currentPage; //Temp integer at current page to navigate through all story components in this section
  let sectionFound = false; //Boolean to check when the section ends
  let currentText = ""; //Str var for all the text in this section

  //Run until the end of section, to add all of the next section's images, objects, text and font to respective arrays
  while (!sectionFound) {
    if (storyParagraphs[tempImageNum].includes("(FONT:)")) { //if font found, then set font
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
      let lengthCheck=Math.floor(storyParagraphs[tempImageNum].length / 150)
      console.log("LengthCheck: "+lengthCheck)
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

  //Create all media for the current section
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