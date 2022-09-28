//const { string } = require("joi");

let objParas = "";
let pageChanging = false;
let storyParagraphs = [];
let imgRepo = [];
let objSky = "";
let sectionImages = []; //Initiate the Array of images for the new section
let sectionObjects = []; //Initiate the Array of Objects for the new section
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
  "-2.4 1.5 0",
  "2.4 1.5 0",
  "-3.3 1.5 2",
  "3.3 1.5 2"
];


let fontBold="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Bold.fnt";
let fontItalic="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Italic.fnt";
let fontItalicBold="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Italic_Bold.fnt";
let fontLight="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Light.fnt";
let fontRegular="https://raw.githubusercontent.com/WayneBrysen/FontStore/main/FntFonts/Arial_Regular.fnt";

//Define the page number and change for all text objects
let scrollingHeight = 0;
let currentPage = 0;

//All JS Functions which are required to navigate through the story are created here
document.addEventListener("keydown", function (event) {
  if(!pageChanging){
    //Scroll through paragraphs
    //Go to previous paragraph
    if (event.key === "q") {
      scrollingHeight = 0;
      changePage(-1);
      //Go to next paragraph
    } else if (event.key === "e") {
      scrollingHeight = 0;
      changePage(1);
    }
  
    if (event.key === "i"){
      //add to scroll
      scrollingHeight= objParas.object3D.position.y+10+.5;
  
      //If greater than or equal to maximum height, reset for next section
      objParas.removeAttribute("animation__pos");
  
      objParas.object3D.position.y = -10+scrollingHeight;
      setOpacity();
      console.log(scrollingHeight)
    //Scroll Down
    } else if (event.key === "k") {
      scrollingHeight = objParas.object3D.position.y+10-.5;
  
      //Remove existing animations
      objParas.removeAttribute("animation__pos");
      console.log(scrollingHeight)
      objParas.object3D.position.y = -10+scrollingHeight;
      setOpacity();
    }

  }
});

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
  changeSky(pageChange); //Update skybox to respective image
  changePage(pageChange); //Navigate to the next page

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
  setTimeout(deleteSectionMedia, 1000);
}

//Control the opacity of paragraphs as they change height
function setOpacity() {
  let textTarget = objParas;
  scrollingHeight = textTarget.object3D.position.y + 10;
  if (scrollingHeight > 0 && scrollingHeight < 20) {
    //Control opacity while scrolling
    if (scrollingHeight >= 15) {
      textTarget.setAttribute("opacity", (20 - scrollingHeight) / 5);
    } else if (scrollingHeight <= 5) {
      textTarget.setAttribute("opacity", scrollingHeight / 5);
    } else {
      textTarget.setAttribute("opacity", 1);
    }
    /* COMMENTED OUT, MOVING PICUTRES NOW FADE IN ONCE PER SECTION
      for(j in movingPictures){

        let elID = "movingPicture"+j;
        let elmnt = document.getElementById(elID);
        if (scrollingHeight>=15){    
            elmnt.setAttribute("opacity",(20-scrollingHeight)/5);
          
        }else if (scrollingHeight<=5){
            elmnt.setAttribute("opacity",scrollingHeight/5);
          
        }else{
          elmnt.setAttribute("opacity",1);
        }
      }*/
  } else{
    textTarget.setAttribute("opacity", 0);
  } 
  
  if (scrollingHeight<0){
    scrollingHeight=20;
    objParas.object3D.position.y = -10+scrollingHeight;
    changePage(-1);
  }else if(scrollingHeight>20){
    scrollingHeight=0;
    objParas.object3D.position.y = -10+scrollingHeight;
    changePage(1);
    /*
      for(j in movingPictures){
        let elID = "movingPicture"+j;
        let elmnt = document.getElementById(elID);
        elmnt.setAttribute("opacity",0);
      }*/
  }
}

//Start on-going timer to set moving text & image opacity
setInterval(setOpacity, 100);

//Initialize all text from the story JSON.
function importStory() {
  iniParagraphObjects(); //Initialize the html text objects
  //retrieveStoryAssets = retrieveStory(); //retrieve the story from the json

  storyParagraphs.unshift("New Section");
  currentPage = 0;
  currentSky = 0; //Initialize New State of story
  changePage(1); //Begin story
}
setTimeout(importStory, 10); //Required to begin the story

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

    //Create the new HTML Element for the picture
    let img = document.createElement("a-video");
    img.setAttribute("id", "movingPicture" + currentImages);
    let src = "";
    for (j in imgRepo) {
      //Find the image file for the current image
      if (imgRepo[j].includes(sectionImages[i])) {
        src = imgRepo[j];
      }
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
    //let element = document.getElementById("textPara");
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

function createObjects(objNums) {
  //Clear previous sections images
  //deleteMovingImage();
  let currentObjects = 0;
  for (i in objNums) {
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
      if (imgRepo[j].includes(objNums[i])) {
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

    //Create the image element
    //let element = document.getElementById("textPara");
    let element = document.getElementById("objectParent");
    element.appendChild(obj);
    obj.removeAttribute("animation__sca");
    //ANIMATION ATTRIBUTE FOR BACKGROUND IMAGES TO FADE IN
    obj.setAttribute(
      "animation__sca",
      "property: scale; from:0 0 0;to: 0.02 0.02 0.02; dur:1000; easing: linear; loop: false;"
    );
    currentObjects++;
  }
}

//Delete all pictures
function deleteSectionMedia() {
  pageChanging=false;
  const imageParent = document.getElementById("imageParent");
  const objectParent = document.getElementById("objectParent");
  while(imageParent.hasChildNodes()){imageParent.removeChild(imageParent.firstChild);}
  while(objectParent.hasChildNodes()){objectParent.removeChild(objectParent.firstChild);}

  sectionimages = [];
  sectionObjects = [];

  let tempImageNum = currentPage; //Temp integer at current page to navigate through all story components in this section
  let sectionFound = false; //Boolean to check when the section ends
  let currentText = ""; //Str var for all the text in this section

  //Run until the end of section
  while (!sectionFound) {
    if (storyParagraphs[tempImageNum].includes("New Section")) {
      //If next section found, end the search
      sectionFound = true;
    } else if (
      storyParagraphs[tempImageNum].includes("(IMAGE-") ||
      storyParagraphs[tempImageNum].includes("(VIDEO-")
    ) {
      //If an image or video is found, then push them to the image array for loading
      sectionImages.push(storyParagraphs[tempImageNum].slice(11));
    } else if (storyParagraphs[tempImageNum].includes("(OBJECT-")) {
      //If an image or video is found, then push them to the image array for loading
      sectionObjects.push(storyParagraphs[tempImageNum].slice(11));
    } else {
      //Otherwise add the current text to the section text var
      currentText = currentText + storyParagraphs[tempImageNum] + "\n\n";
    }

    //check up to the next story component
    tempImageNum = tempImageNum + 1;
    if (tempImageNum > storyParagraphs.length - 1) {
      sectionFound = true;
    } //If last story component, then mark end of section
  }

  //Set the text object value to the current section's text
  objParas.setAttribute("value", currentText);
  objParas.setAttribute("font", fontItalicBold);
  //Create all images for the current section
  createImages(sectionImages);
  createObjects(sectionObjects);
}

//Define the page number and change
function changePage(pageChange) {
  //Delete Current page properties
  objParas.removeAttribute("animation__pos");
  objParas.setAttribute("value", "");
  objParas.setAttribute("opacity", 0);

  currentPage = wrapAround(
    currentPage + pageChange,
    1,
    storyParagraphs.length - 1
  )[1];
  if (storyParagraphs[currentPage] === "New Section") {
    nextSection(pageChange);
  } else if (storyParagraphs[currentPage - 1] !== "New Section") {
    changePage(pageChange);
  } else {
    //Update paragraph text value
    objParas.setAttribute("Opacity", 0);
    //console.log(currentPage-1+": "+storyParagraphs[currentPage]);
    //Reset and activate the Position animation
    objParas.removeAttribute("animation__pos");
    objParas.setAttribute(
      "animation__pos",
      "property: position; from:0 -10 -15;to: 0 10 -15; dur:10000; easing: linear; loop: false;"
    );
    if (!storyParagraphs[currentPage].includes("IMAGE:")) {
      //Commented out, trialing setting Block paragraph value
      //objParas.setAttribute("value", storyParagraphs[currentPage]);
    } else {
      objParas.setAttribute("value", "");
      if (storyParagraphs[currentPage - 1].includes("IMAGE:")) {
        changePage(1);
      }
    }
  }
}

//define all paragraph objects
function iniParagraphObjects() {
  objParas = document.getElementById("textPara");
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
