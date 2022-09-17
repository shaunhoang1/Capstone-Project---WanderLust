(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    
let objParas = [];
let storyParagraphs=[];
let movingPictures=[];

let imgRepo=[];
let fullText= [];
let myImages = [];

//Define the Backgrounds
var currentSky = 0;
const skies = [];
{
    skies[1] = "#sky1";
    skies[2] = "#sky2";
    skies[3] = "#sky3";
}

//Define the page number and change for all text objects
var scrollingHeight = 0;
var currentPage = 0;
var currentPageAll = 0;
var tempPage = 0;    

//All JS Functions which are required to navigate through the story are created here
//Manually scroll through paragraphs with "i" or "k"
document.addEventListener("keydown", function (event) {
    //Scroll through paragraphs  
    //Scroll up        
    if (event.key === "i"){
        changePage(0);
        //add to scroll
        scrollingHeight= objParas[0].object3D.position.y+10+1;

        //If greater than or equal to maximum height, reset for next section
        var wrapCheck = wrapAround(scrollingHeight,0,20);
        if (wrapCheck[0]) {
            scrollingHeight = wrapCheck[1];
            console.log("Loading Next section");
            changePage(1);

            //Reset the Position 
            objParas[0].setAttribute("opacity", 1);
            objParas[0].setAttribute("position","0 -10 -20"); 
        }

        //Remove existing animations
        objParas[0].removeAttribute("animation__pos");

        objParas[0].object3D.position.y = -10+scrollingHeight;
        setOpacity();

    //Scroll Down
    } else if (event.key === "k") {
    scrollingHeight = objParas[0].object3D.position.y+10;

        //subtract from scroll
        scrollingHeight= scrollingHeight-0.2;
        //If less than or equal to min height, reset for previous section      
        var wrapCheck = wrapAround(scrollingHeight,0,20);
        if (wrapCheck[0]) {
            scrollingHeight = wrapCheck[1];
            console.log("Loading Previous section");
            changePage(-1);

            //Reset  the Position
            objParas[0].setAttribute("opacity", 1);
            objParas[0].setAttribute("position","0 10 -20");  
        }           

        //Remove existing animations
        objParas[0].removeAttribute("animation__pos");

        objParas[0].object3D.position.y = -10+scrollingHeight;
        setOpacity();
    }
    //Go to previous paragraph
    if (event.key === "q") {
        scrollingHeight = 0;
        changePage(-1);
    //Go to next paragraph
    } else if (event.key === "e") {
        scrollingHeight = 0;
        changePage(1);
    }

    if (event.key ==="p"){
        scrollingHeight = 0;
        changePageAll(1);
        console.log("4-page scrolling");
    }
    //Go to next background
    if (event.shiftKey) {
      createNewImage();
    }else if (event.key === "l") {
      deleteMovingImage();
    }
});

//WrapAround function to loop array variables,
//and can also change the variable which it is based on. 
//Returns "True" or "False" in case additional functions depend on the wrap status
function wrapAround(current,min,max){
    var wrapped = false;
    if (current > max) {
        current = min;
        wrapped = true;
    }else if (current < min) {
        current = max;
        wrapped = true;
    }
    return [wrapped,current];
}

//Function triggers for each new section in the story, to update objects and images
function newSection(pageChange){
    changeSky(pageChange);
    changePage(pageChange,0,storyParagraphs.length+1);
  
  let myImages = [];
  let tempImageNum = currentPage;
  let sectionFound=false;
  while(sectionFound==false){
      if(storyParagraphs[tempImageNum].includes("New Section")){
          sectionFound=true;
          console.log("section Found")
      }else if(storyParagraphs[tempImageNum].includes("IMAGE:")){
          myImages.push(storyParagraphs[tempImageNum].slice(6))
      }
      tempImageNum=tempImageNum+1;
  }
  createNewImage(myImages);
}
    
//Control the opacity of paragraphs as they change height
function setOpacity(){
    for(let i=0;i<1;i++){
        let textTarget = objParas[i];
        scrollingHeight = textTarget.object3D.position.y+10;
        if (scrollingHeight > 0 && scrollingHeight < 20){
            //Control opacity while scrolling
            if (scrollingHeight>=15){
                textTarget.setAttribute("opacity",(20-scrollingHeight)/5);
            }else if (scrollingHeight<=5){
                textTarget.setAttribute("opacity",scrollingHeight/5);
            }else{
                textTarget.setAttribute("opacity",1);
            }
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
            }
        }else{
            textTarget.setAttribute("opacity",0);
            for(j in movingPictures){
              let elID = "movingPicture"+j;
              let elmnt = document.getElementById(elID);
              elmnt.setAttribute("opacity",0);
            }
        }
    }
    
}

//Start on-going timer to set moving text & image opacity
setInterval(setOpacity,100);

//Initialize all text from the story JSON.
function importAllText(){
  iniParagraphObjects();
  retrieveStoryAssets = retrieveStoryText();
  fullText = retrieveStoryAssets[0];
  myImages = retrieveStoryAssets[1];
  for(i in fullText){
    storyParagraphs[i-1] = fullText[i-1];
    //console.log(storyParagraphs[i-1]);
  }
  imgRepo = retrieveStoryAssets[2];
  /*for(i in imgRepo){
    console.log(imgRepo[i]);
  }*/
    
  storyParagraphs.unshift("New Section");
  currentPage=0;currentSky = 0;
  changePage(1);
}
setTimeout(importAllText,10);

//Navigate to next/previous skybox image
function changeSky(skyChange) {
    currentSky = wrapAround(currentSky + skyChange,1,skies.length-1)[1];
    var sky = document.getElementById("sky");
    sky.setAttribute("src", skies[currentSky]);
}
    
function createNewImage(imageNums){
    
    deleteMovingImage();
  for(i in imageNums){
     //Check how many pictures there are
      let imgCount=movingPictures.length;
      let imgOffset = 0
      let img = document.createElement("a-image");
      img.setAttribute("id","movingPicture"+imgCount);
      img.setAttribute("src", imgRepo[imageNums[i]]);
      img.setAttribute("Opacity", "0");
      img.setAttribute("scale", "3 3 3");
      //set img offset
      let offset = -imgCount*2+1;
      if(imgCount % 2 == 0){
          imgOffset = -1
      }else{
          imgOffset = 1
      }
      let pos = imgOffset*2+" "+offset+" -2";
      if(imageNums.length==1){
          pos="0 0 -2";
      }
      img.setAttribute("position", pos);

      movingPictures[imgCount]=imgCount;

      let element = document.getElementById("textPara");
      element.appendChild(img); 
  }
  
}

function deleteMovingImage(){
  for(i in movingPictures){
    let elID = "movingPicture"+i;
    let elmnt = document.getElementById(elID);
    elmnt.remove();
  }
  movingPictures=[];
}


//Define the page number and change

function changePage(pageChange) {
    clearPageAll();
    currentPage = wrapAround(currentPage+pageChange,1, storyParagraphs.length - 1)[1];
    if(storyParagraphs[currentPage]==="New Section"){
        newSection(pageChange);
    }else{
        //Update paragraph text value
        
      if(!storyParagraphs[currentPage].includes("IMAGE:")){
        objParas[0].setAttribute("value", storyParagraphs[currentPage]);
      }else{
          objParas[0].setAttribute("value", "");
      }
        objParas[0].setAttribute("Opacity", 0);
        //console.log(currentPage-1+": "+storyParagraphs[currentPage]);
        //Reset and activate the Position animation
        objParas[0].removeAttribute("animation__pos");
        objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur:10000; easing: linear; loop: false;");
    }
}

//Repetitive code for all four text objects, changes for each object (text value, positions)
function changePageAll(pageChange) {
    //reset all paragraphs
    clearPageAll();

    currentPage=wrapAround(currentPage+1,1, storyParagraphs.length - 1)[1];
    tempPage=currentPage;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE FIRST PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //set next page variable text object
    objParas[0].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE SECOND PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 2 
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];
    objParas[1].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[1].setAttribute("animation__pos","property: position; from:20 -10 0;to: 20 10 -0; dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE THIRD PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 3
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];          
    objParas[2].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[2].setAttribute("animation__pos","property: position; from:-0 -10 20;to: -0 10 20; dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE FOURTH PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 4
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];
    objParas[3].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[3].setAttribute("animation__pos","property: position; from:-20 -10 -0;to: -20 10 -0; dur: 10000; easing: linear; loop: false;");
}

//clearing all pages for a clean change to next sections
function clearPageAll(){
    for (let i = 0; i < 4; i++) {
        objParas[i].removeAttribute("animation__pos");
        objParas[i].setAttribute("value", "");
        objParas[i].setAttribute("opacity",1);
    }
}
  
//define all paragraph objects
function iniParagraphObjects(){
    objParas[0]=document.getElementById("textPara");
    objParas[1]=document.getElementById("textPara2");
    objParas[2]=document.getElementById("textPara3");
    objParas[3]=document.getElementById("textPara4");
}
document.getElementById("textPara").addEventListener("loadstart", iniParagraphObjects); 
  

//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
function retrieveStoryText(){
  //Declare array variable for all extracted text

  function newSection(json)
  {
    combinedText[combinedText.length]="New Section";
    return extractText(json);
  }

  function extractText(json)
  {
    if (!json) {
      return "";
    } else if (json?.subTitle!==undefined) {
      return extractText(json.subTitle);
    } else if (json?.content!==undefined) {
      return json.content.map(extractText).join("");
    } else if (json?.image!==undefined) {
      combinedText[combinedText.length]="IMAGE:"+json.image.id;
    } else if (json?.embed!==undefined) { //Extract video embed
      let embededObj=json.embed;
      combinedText[combinedText.length]="EMBED:"+embededObj.originalUrl;
    } else if (Array.isArray(json)) {
      return json.map(extractText).join("");
    } else if (json.type === "text") {
      let a = json.text;
      combinedText[combinedText.length]=a;
      return json.text;
    } else if (json?.sections!==undefined) {
      return json.sections.map(newSection).join("");
    } else if (json?.layers!==undefined) {
      for(i in json.layers){  //Extra filter finds layerOrder to extract specific layerID's
        let layerObj = json.layers[i];
        if (layerObj?.layerOrder!==undefined) {
          let extractedLayers = []
          for(j in layerObj.layerOrder){
            let layerJSON = layerObj.layers[layerObj.layerOrder[j]];
            extractedLayers[extractedLayers.length]=extractText(layerJSON);
          }
          //return extractedLayers.join("");
          return json.layers.map(extractText).join("");
        }
      }
      return extractText(json.layers);  //Runs on single layer object if no layerOrder
    } else if (json?.text!==undefined) {
      return extractText(json.text);
    } else if (json?.items!==undefined) {
      return json.items.map(extractText).join("");
    } else if (json?.item!==undefined) {
      return extractText(json.item);
    } else if (json?.title!==undefined) {
      return extractText(json.title);
    } else if (json?.leadIn!==undefined) {
      return extractText(json.leadIn);
    } else if (json?.storyTitle!==undefined) {
      return extractText(json.storyTitle);
    } else if (json?.byline!==undefined) {
      return extractText(json.byline);
    } else if (json?.caption!==undefined) {
      return extractText(json.caption);
    } else if (json?.landscape!==undefined) {
      return extractText(json.landscape);
    } else if (json?.attrs!==undefined) { 
      return extractText(json.attrs);
    }else {
      return "";
    }
  }



  //retrieveStoryText('../story.json')
  //Require the desired json file from the story
  const storyData = require('../story.json');

  //Run function to extract the data
  const combinedText =[];
  extractText(storyData)
  combinedText[combinedText.length]="FinalPara";
  const myIMG = [];
  for(i in combinedText){
    if(combinedText[i].includes("IMAGE")){
      combinedText[i]="IMAGE:"+myIMG.length
      myIMG[myIMG.length]=myIMG.length;
    }
  }
               
  const imgArray=["/assets/5HECXqtPRY/ticketoffice-1080x1920.jpeg","/assets/bcoIi7gXby/town-846x1349.jpeg","/assets/D3h9QGqI9v/town-1080x1920.jpeg","/assets/iMitwH0EXu/bus-1080x1920.jpeg","/assets/JqXBwRBR7R/store-863x1368.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-thumbnail.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-thumbnail.jpeg","/assets/NETXgllPkN/railwaystation-852x1406.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sfv2bWQrhq/dream_tradingcard-857x1376.jpeg",,"/assets/uhD9A6h3Vo/staring-1080x1920.jpeg","/assets/X0OgcjeEUe/busdring-1080x1920.jpeg","/assets/yp0f2XkDCi/poster-1590x894.jpeg"]
  return [combinedText, myIMG, imgArray];
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
               
               
               
},{"../story.json":2}],2:[function(require,module,exports){
module.exports={
    
    
}
//end of JSON@
},{}]},{},[1]);
