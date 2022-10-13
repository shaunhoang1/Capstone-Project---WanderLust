
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
      console.log("Previous Page")
      nextSection(-1); }
    if (evt.detail.x > 0.95) {
      scrollingHeight[0] = 0;
      console.log("Next Page")
      nextSection(1); }
  }
  }})
//All JS Functions which are required to navigate through the story are created here
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
  
    if (event.key === "i"){
      scrollTick+=0.01
    } else if (event.key === "k") {
      scrollTick-=0.01
    }
  }
});

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
    if(currentPage<1 || currentPage>storyParagraphs.length-1){
      currentPage=currentPage-pageChange;
    }else{
      changeSky(pageChange); //Update skybox to respective image
    }
    // currentPage = wrapAround(currentPage + pageChange,1,storyParagraphs.length - 1)[1];
    if (storyParagraphs[currentPage-1]==="New Section"){
      notNewSection=false;
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
  // console.log("Top Paragraph:"+objParas[0].object3D.position.y+",  "+scrollingHeight[0])
  // console.log("Bottom Paragraph:"+objParas[objParas.length-1].object3D.position.y+",  "+scrollingHeight[scrollingHeight.length-1])
}


//Initialize all text from the story JSON.
function importStory() {
  iniParagraphObjects(); //Initialize the html text objects
  //retrieveStoryAssets = retrieveStory(); //retrieve the story from the json

  // storyParagraphs.unshift("New Section");
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
  let img ="";
  //Create the new HTML Element for the picture
  let src = "";
  for (j in imgRepo) {
    //Find the image file for the current image
    if (imgRepo[j].includes(sectionAudio)) {
      src = imgRepo[j];
    }
  }
  img = document.createElement("a-sound");
  img.setAttribute("id", "sectionAudio");
  img.setAttribute("src", src);
  img.setAttribute("autoplay", "true");
  img.setAttribute("on", "true");
  img.setAttribute("loop", "true");
  //Create the image element
  let element = document.getElementById("imageParent");
  element.appendChild(img);
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

//Delete all pictures
function refreshMedia() {
  const imageParent = document.getElementById("imageParent");
  const objectParent = document.getElementById("objectParent");
  const textParent = document.getElementById("textParent");
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
/*
//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
function retrieveStory(){
  //Declare array variable for all extracted text
  let inLine=false;
  function newSection(json){
    combinedText[combinedText.length]="New Section";
    inLine=false;
    return extractStory(json,inLine);
  }

  function extractStory(json,canvas){
    let toExtract = [];
    if (!json) {
      return "";
    } 
    if (json?.kind!==undefined){
      if(json.kind==="card-canvas"){
        inLine=true;
      }
      
    }
    if (json?.attrs!==undefined) { 
      if(json.attrs?.fontSize!==undefined){
        combinedText[combinedText.length]="(FONT:)"+json.attrs.fontSize;
      }
      extractStory(json.attrs, canvas);
    } 
    if (json?.subTitle!==undefined) {
      extractStory(json.subTitle, canvas);
    } 
    if (json?.content!==undefined) {
      json.content.map(extractStory).join("");
    } 
    if (json?.image!==undefined) {
      if(inLine){
        combinedText[combinedText.length]="(IMAGE-IN:)"+json.image.id;
      }else{
        combinedText[combinedText.length]="(IMAGE-BG:)"+json.image.id;
      }
    } 
    if (json?.video!==undefined) {
      combinedText[combinedText.length]="(VIDEO---:)"+json.video.id;
    } 
    if (json?.embed!==undefined) { //Extract video embed
      let embededObj=json.embed;
      combinedText[combinedText.length]="(EMBED:)"+embededObj.originalUrl;
    } 
    if (json.type === "text") {
      let a = json.text;
      combinedText[combinedText.length]=a;
    } 
    if (json?.sections!==undefined) {
      json.sections.map(newSection).join("");
    } 
    if (json?.text!==undefined) {
      extractStory(json.text, canvas);
    } 
    if (json?.items!==undefined) {
      json.items.map(extractStory,canvas).join("");
    } 
    if (json?.layers!==undefined) {
      for(let i in json.layers){  //Extra filter finds layerOrder to extract specific layerID's
        let extractedLayers = []
        let layerObj = json.layers[i];
        if (layerObj?.layerOrder!==undefined) {
          for(let j in layerObj.layerOrder){
            let layerJSON = layerObj.layers[layerObj.layerOrder[j]];
            extractedLayers[extractedLayers.length]=extractStory(layerJSON, canvas);
          }
        }
      }
      extractStory(json.layers, canvas);  //Runs on single layer object if no layerOrder
    } 
    if (json?.item!==undefined) {
      extractStory(json.item, canvas);
    } 
    if (json?.title!==undefined) {
      extractStory(json.title, canvas);
    } 
    if (json?.leadIn!==undefined) {
      extractStory(json.leadIn, canvas);
    } 
    if (json?.storyTitle!==undefined) {
      extractStory(json.storyTitle, canvas);
    } 
    if (json?.byline!==undefined) {
      extractStory(json.byline, canvas);
    } 
    if (json?.caption!==undefined) {
      extractStory(json.caption, canvas);
    } 
    if (json?.landscape!==undefined) {
      extractStory(json.landscape, canvas);
    } 
    
    if (Array.isArray(json)) {
      json.map(extractStory).join("");
    }else {
      toExtract[toExtract.length]= "";
    }
  }
  //retrieveStoryText('../story.json')
  //Require the desired json file from the story
  const storyData = require('../story.json');

  //Run function to extract the data
  const combinedText =[];
  extractStory(storyData,inLine)
  combinedText[combinedText.length]="FinalPara";
               
  const imgArray=["/assets/5HECXqtPRY/ticketoffice-1080x1920.jpeg","/assets/bcoIi7gXby/town-846x1349.jpeg","/assets/D3h9QGqI9v/town-1080x1920.jpeg","/assets/iMitwH0EXu/bus-1080x1920.jpeg","/assets/JqXBwRBR7R/store-863x1368.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-thumbnail.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-thumbnail.jpeg","/assets/NETXgllPkN/railwaystation-852x1406.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sfv2bWQrhq/dream_tradingcard-857x1376.jpeg",,"/assets/uhD9A6h3Vo/staring-1080x1920.jpeg","/assets/X0OgcjeEUe/busdring-1080x1920.jpeg","/assets/yp0f2XkDCi/poster-1590x894.jpeg"]
  return [combinedText, imgArray];
}


               

//Demo StoryParagraphs for examples
/*
const storyParagraphs = [];
{
    storyParagraphs[0] = 
        "THIS IS THE FIRST PARAGRAPH, NO ONE WILL SEE THIS";
    storyParagraphs[1] =
        "Lost in Innsmouth";
    storyParagraphs[2] =
        "In the winter of 1846, it seemed to be colder than usual. Ronald Lambert, a young man who had just graduated from college, was preparing to buy a train ticket to return to his grandmother's hometown. However, there were no direct tickets available. He could only follow the conductor's advice and take the bus to a small town called Innsmouth, and then from there to his destination";
    storyParagraphs[3] =
        "Except that the bus driver looked very strange, there was nothing special. Ronald soon arrived at Innsmouth, a small town covered by thick fog, and the stench in the air was hard to ignore. The most iconic building in the town, an ancient house quickly attracted Ronald's attention. However, the strange atmosphere also made Ronald dare not stop his steps.";
    storyParagraphs[4] =
        "'The car is broken, I think you'll have to spend the night here,' the driver said after trying to start the bus's engine several times. It seemed Ronald had no choice.";
    storyParagraphs[5] =
        "Ronald fell into a deep sleep with the sea breeze and the stench, lying on the bed in the hotel room. He had a very strange dream, a dream about the deep sea.";
    storyParagraphs[6] =
        "In the dream, he swims freely in the deep sea. At the bottom of the sea, he saw a stone statue that seemed to be a Murloc. Although it exuded a strange light, it was very fascinating to Ronald.";
    storyParagraphs[7] =
        "Suddenly, a flash of lightning flashed through the air, and the deafening sound accompanied by the heavy rain woke Ronald from his dream instantly. He looked out the window curiously. A strange and shocking scene happened. Countless half-human, half-fish creatures crawled out of the sea to head to the town.";
}*/

//Unused Click function
/*
AFRAME.registerComponent("button-click-handler", {
    init: function () {
        var skyEl = this.el.sceneEl.querySelector("#thing");

        this.el.addEventListener("click", function () {
            skyEl.setAttribute("scale", "5 5 5");
        });
    },
});*/

imgRepo = ["/assets/5HECXqtPRY/ticketoffice-1065x1893.jpeg","/assets/audioBus/Busp4.mp3","/assets/audioStation/TrainStationpp1_3.mp3","/assets/audioThunder/Thunder_Rainpp16_17.mp3","/assets/audioTown/town and cthulhupp16.mp3","/assets/bcoIi7gXby/town-750x1196.jpeg","/assets/D3h9QGqI9v/town-1062x1888.jpeg","/assets/deepOcean/Deep_Oceanp16.mtl","/assets/deepOcean/Deep_Oceanp16.obj","/assets/iMitwH0EXu/bus-1067x1897.jpeg","/assets/JqXBwRBR7R/store-750x1189.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-512x512.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-512x512.jpeg","/assets/mountainRoad/MountainRoad_p4.mtl","/assets/mountainRoad/MountainRoad_p4.obj","/assets/NETXgllPkN/railwaystation-750x1238.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sceneMountain/MountainRoad_p4.mtl","/assets/sceneMountain/MountainRoad_p4.obj","/assets/sceneOcean/Deep_Oceanp16.mtl","/assets/sceneOcean/Deep_Oceanp16.obj","/assets/sceneTown/Town_pp6_14.mtl","/assets/sceneTown/Town_pp6_14.obj","/assets/sceneTrain/TrainStation_pp1_3.mtl","/assets/sceneTrain/TrainStation_pp1_3.obj","/assets/sfv2bWQrhq/dream_tradingcard-750x1204.jpeg","/assets/testObject/testObj.obj","/assets/townScene/Town_pp6_14.mtl","/assets/townScene/Town_pp6_14.obj","/assets/uhD9A6h3Vo/staring-1064x1892.jpeg","/assets/X0OgcjeEUe/busdring-1060x1884.jpeg","/assets/yp0f2XkDCi/poster-1210x681.jpeg"]
storyParagraphs = ["New Section","(AUDIO---:)audioStation","(FONT:)xxsmall","Shorthand-WanderLust Project:","(FONT:)xxxlarge","Lost in Innsmouth","By WanderLust","(IMAGE-BG:)D3h9QGqI9v","Photo by Scott Webb on Unsplash","New Section","(VIDEO---:)PYj71zvsAD","","New Section","(OBJECT--:)sceneTrain","I'm afraid I wouldn't care about any uninteresting urban tales if I hadn't seen them with my own eyes, nor would I recognise this town that I couldn't find on a map. ","The year was 1846, and the weather appeared colder than usual.","I had recently graduated from university and was on my way to the railway station to purchase a train ticket to my hometown to see my grandfather and grandma, whom I hadn't seen in a long time.","However, I was interrupted by an extraordinarily pricey railway ticket.","I remained in front of the ticket office for a long time, staring at the train timetable and hesitating, until the conductor, realising that I had no money, led me to another cheaper and more practicable option: take the bus across the street to Innsmouth.","Then, board the bus from Innsmouth to my final destination."," Innsmouth is now merely a backwards community that relies on fishing for a living due to a lack of information and access to railways. ","According to folklore, the locals there worship evil gods and will occasionally summon demons from hell to devour passing visitors.","It is not advisable to spend the night there. My concerns about the odd town I was about to see were eased by the conductor's explanation.","(IMAGE-BG:)NETXgllPkN","","(IMAGE-BG:)5HECXqtPRY","","(IMAGE-BG:)iMitwH0EXu","","New Section","(AUDIO---:)audioBus","(OBJECT--:)sceneMountain","(FONT:)small","(FONT:)xxsmall","(FONT:)xxxsmall","I took the bus to town, and nothing unusual happened with the exception of the driver's weird expression. The bus arrived in Innsmouth, a town covered in thick haze, just after I had endured the bumps for hours.","(IMAGE-BG:)X0OgcjeEUe","","New Section","(FONT:)small","(FONT:)xxsmall","(FONT:)xxxsmall","A bizarre but solemn ancient building drew my attention, but whether it was the aura or the curiously dressed people at the door, it was clear that it was the gathering place of the wicked gods. The dark mood made me afraid to explore anymore, and the bus eventually brought me to the comparatively rich side of town.","(IMAGE-BG:)uhD9A6h3Vo","","New Section","(OBJECT--:)sceneTown","The bus soon came to a halt, and I dashed off to attempt to alleviate the discomfort of the journey, but the stink in the air didn't help much. Dilapidated wooden dwellings, a row of houses crammed together without regard for norms, even the town centre is sparsely populated.","With a few hours before the bus left again, I dropped by the local grocery store out of boredom and curiosity, hoping to learn anything valuable. As soon as I stepped in, I was drawn to a golden shimmering ring placed on the store's counter, which seemed out of place in comparison to the rest of the store.","","I first asked the shopkeeper for information about the town, but he gave me a very impatient look as if to warn me not to ask any further questions about the topic until I bought the ring, and at the same time he looked at me maliciously.","That ring piqued my interest in an unusual way. It was a gold-bordered ring with a green stone inlay in it. The pattern carved on the stone was bizarre, like a half-human, half-fish monster. I dimly remembered seeing a similar design before. I was unsure about purchasing this ring.","The owner of the shop told me the story of this town with a half-smile. A hundred years ago, this town lived on the port trade. At that time, it was still a vibrant town. However, the good times did not last long. The town was quickly dragged down by the ensuing war. Many people lost their livelihood jobs. It's all ruined.","However, this scene didn't last long when an ship sailed toward the town. The captain told everyone in the town that he knew a true god, and as long as everyone was willing to follow him, Innsmouth would prosper. From then on, the town seemed to come alive, with schools of fish flocking to the town and smoke from the factory chimneys. However, every night the residents of the town mysteriously disappear.","Finally, on a stormy night, the bizarre events are revealed by the half-man, half-fish creatures that keep emerging from the shoreline. It turned out that the captain and his followers were constantly sacrificing residents to those monsters in exchange for various resources. Since then, there have been many mixed species of humans and fish in the town.","Such people don't show obvious features at first, but around the age of 20 they start to lose their hair and gradually become half human and half fish. I hear a chill in my heart here.","(IMAGE-IN:)bcoIi7gXby","","(IMAGE-IN:)JqXBwRBR7R","","New Section","(AUDIO---:)audioBeach","(FONT:)small","(FONT:)xxxsmall","I subconsciously looked at my watch, it was time to get on the departing bus.","(FONT:)xxxsmall","(IMAGE-BG:)MObpieZw3w","","New Section","(AUDIO---:)audioNight","(IMAGE-IN:)sfv2bWQrhq","(IMAGE-IN:)KehrQ0yKcs","The driver told me that the car was broken and I'm afraid I won't be able to go anywhere tonight. In desperation, I had to rent a hotel to spend the night in this town."," I lay in bed staring at the ring in a daze and soon fell into a dream. It was a strange dream. In the dream, I actually swam unimpeded in the deep sea. There was a green stone statue on the seabed. The shape was very similar to the pattern on the ring.","Suddenly, I was awakened by the sound of thunder and rain outside the window. I looked out the window, and a scene I will never forget happened, just as the shopkeeper described, countless half-human, half-fish creatures crawled out of the water and headed towards the town.","New Section","(AUDIO---:)audioThunder","(OBJECT--:)sceneOcean"," I rushed out of the hotel and ran without looking back, and finally fell on the muddy ground and passed out. In the morning I woke up in the pub in the town, I quickly boarded the bus to my hometown, and everything was calm as if everything that happened last night was a dream.",""," Arriving at my grandparents' house, the strange face in my grandmother's portrait brought back memories of all the weird things I've been through lately. Everything seemed to portend something, Innsmouth, the cult, the god, the strange pattern on the ring and the face of the grandmother. With my hair falling out because I stayed up all night thinking, there was only one thought in my mind, I had to go back to that town no matter what.","","The End."];
