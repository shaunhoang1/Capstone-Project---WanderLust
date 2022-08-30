(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    
let objParas = [];
let storyParagraphs=[];
let movingPictures=[];

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
}
    
//Control the opacity of paragraphs as they change height
function setOpacity(){
    for(let i=0;i<1;i++){
        let textTarget = objParas[i];
        scrollingHeight = textTarget.object3D.position.y+10;
        if (scrollingHeight !== 0 && scrollingHeight !== 20){
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
                if(scrollingHeight>17){
                  elmnt.setAttribute("opacity",0);
                }else{
                  elmnt.setAttribute("opacity",(20-scrollingHeight)/5);
                }
              }else if (scrollingHeight<=5){
                if(scrollingHeight<2){
                  elmnt.setAttribute("opacity",0);
                }else{
                  elmnt.setAttribute("opacity",scrollingHeight/5);
                }
              }else{
                textTarget.setAttribute("opacity",1);
              }
            }
        }
    }
    
}

//Start on-going timer to set moving text & image opacity
function opacityTimer(){
  console.log("AAA");
  setOpacity();
}
setInterval(opacityTimer,100);

//Initialize all text from the story JSON.
function importAllText(){
  iniParagraphObjects();
  let fullText = retrieveStoryText();
  for(i in fullText){
    storyParagraphs[i-1] = fullText[i-1];
  }
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


//Navigating Backgrounds
document.addEventListener("keydown", function (event) {
    //Go to next background
    if (event.shiftKey) {
       
      createNewImage();
    }else if (event.key === "l") {
       
      deleteMovingImage();
    }


});

function createNewImage(){
  //Check how many pictures there are
  let imgCount=movingPictures.length;
  
  let img = document.createElement("a-image");
  img.setAttribute("id","movingPicture"+imgCount);
  img.setAttribute("src", "#imgPortrait2");
  //set img offset
  let offset = -imgCount*1+1;
  let pos = "0 "+offset.toString()+" -2";
  console.log(pos)
  img.setAttribute("position", pos);

  movingPictures[imgCount]=imgCount;

  let element = document.getElementById("textPara");
  element.appendChild(img);
}

function deleteMovingImage(){
  console.log(movingPictures.length);
  for(i in movingPictures){
    let elID = "movingPicture"+i;
    let elmnt = document.getElementById(elID);
    elmnt.remove();
  }
  movingPictures=[];
}

//Navigate between paragraphs
document.addEventListener("keydown", function (event) {
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
});

//Define the page number and change

function changePage(pageChange) {
    clearPageAll();
    currentPage = wrapAround(currentPage+pageChange,1, storyParagraphs.length - 1)[1];
    if(storyParagraphs[currentPage]==="New Section"){
        newSection(pageChange);
    }else{
        //Update paragraph text value
        objParas[0].setAttribute("value", storyParagraphs[currentPage]);
        console.log(currentPage-1+": "+storyParagraphs[currentPage]);
        //Reset and activate the Position animation
        objParas[0].removeAttribute("animation__pos");
        objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur:5000; easing: linear; loop: false;");
        movingImage1 = document.getElementById("movingImage1");
        movingImage1.removeAttribute("animation__pos");
        movingImage1.setAttribute("animation__pos","property: position; from:9 -6 -10;to: 9 6 -10; dur:5000; easing: linear; loop: false;");
        movingImage2 = document.getElementById("movingImage2");
        movingImage2.removeAttribute("animation__pos");
        movingImage2.setAttribute("animation__pos","property: position; from:-9 -6 -10;to: -9 6 -10; dur:5000; easing: linear; loop: false;");
    }
}

    
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
});


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
        objParas[i].setAttribute("opacity",1);
        objParas[i].setAttribute("value", "");
    }
}

document.getElementById("textPara").addEventListener("loadstart", iniParagraphObjects);   

//define all paragraph objects


function iniParagraphObjects(){
    objParas[0]=document.getElementById("textPara");
    objParas[1]=document.getElementById("textPara2");
    objParas[2]=document.getElementById("textPara3");
    objParas[3]=document.getElementById("textPara4");
}

setInterval(setOpacity,100);
      

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
          return extractedLayers.join("");
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
  return combinedText;
}
              
               
},{"../story.json":2}],2:[function(require,module,exports){
module.exports={
}
//end of JSON@
},{}]},{},[1]);
