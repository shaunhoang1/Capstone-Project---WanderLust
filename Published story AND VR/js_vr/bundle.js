(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    
let objParas = [];
let storyParagraphs=[];
let movingPictures=[];

let imgRepo=[];
let fullText= [];
let myImages = [];

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

//Define the page number and change for all text objects
let scrollingHeight = 0;
let currentPage = 0;
let currentPageAll = 0;
let tempPage = 0;    

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
    /*
    if (event.key ==="p"){
        scrollingHeight = 0;
        changePageAll(1);
        console.log("4-page scrolling");
    }*/
    if (event.key === "l") {
      deleteMovingImage();
    }
});

//WrapAround function to loop array variables,
//and can also change the variable which it is based on. 
//Returns "True" or "False" in case additional functions depend on the wrap status
function wrapAround(current,min,max){
  let wrapped = false;
  if (current > max) {
      current = min;
      wrapped = true;
  }else if (current < min) {
      current = max;
      wrapped = true;
  }
  return [wrapped,current];
}

//Function triggers for each new section in the story, to update object, images and text to the next section
function nextSection(pageChange){
  changeSky(pageChange); //Update skybox to respective image
  changePage(pageChange); //Navigate to the next page
  
  let myImages = []; //Initiate the Array of images for the new section
  let tempImageNum = currentPage; //Temp integer at current page to navigate through all story components in this section
  let sectionFound=false; //Boolean to check when the section ends
  let currentText=""; //Str var for all the text in this section
    
  //Run until the end of section
  while(!sectionFound){
    if(storyParagraphs[tempImageNum].includes("New Section")){
        //If next section found, end the search
        sectionFound=true;
    }else if(storyParagraphs[tempImageNum].includes("IMAGE:") || storyParagraphs[tempImageNum].includes("VIDEO:")){
        //If an image or video is found, then push them to the image array for loading
        myImages.push(storyParagraphs[tempImageNum].slice(8))
    }else{
        //Otherwise add the current text to the section text var
      currentText=currentText+storyParagraphs[tempImageNum]+"\n\n";
    }
      
      //check up to the next story component
    tempImageNum=tempImageNum+1;
    if(tempImageNum>storyParagraphs.length-1){sectionFound=true;} //If last story component, then mark end of section
  }
    
    //Set the text object value to the current section's text
  objParas[0].setAttribute("value", currentText);
    
    //Create all images for the current section
  createImages(myImages);
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
        }else{
            textTarget.setAttribute("opacity",0);
            /*
            for(j in movingPictures){
              let elID = "movingPicture"+j;
              let elmnt = document.getElementById(elID);
              elmnt.setAttribute("opacity",0);
            }*/
        }
    }
}

//Start on-going timer to set moving text & image opacity
setInterval(setOpacity,100);

    
//Initialize all text from the story JSON.
function importStory(){
  iniParagraphObjects(); //Initialize the html text objects
  retrieveStoryAssets = retrieveStory(); //retrieve the story from the json
  myImages = retrieveStoryAssets[1]; //Assign the image elements from the story
  for(i in retrieveStoryAssets[0]){ //Extract the text elements from the story into the HTML
    storyParagraphs[i-1] = retrieveStoryAssets[0][i-1];
  }
  imgRepo = retrieveStoryAssets[2]; //Assign the Image Directory values
    
  storyParagraphs.unshift("New Section");
  currentPage=0;currentSky = 0; //Initialize New State of story
  changePage(1); //Begin story
}
setTimeout(importStory,10); //Required to begin the story

//Navigate to next/previous skybox image
function changeSky(skyChange) {
    currentSky = wrapAround(currentSky + skyChange,1,skies.length-1)[1];
    var sky = document.getElementById("sky");
    sky.setAttribute("src", skies[currentSky]);
}
    
//Create all the images for the current section
function createImages(imageNums){
    //Clear previous sections images
  deleteMovingImage();
  for(i in imageNums){ //For each image in this section
    //Check how many pictures there are
    let imgCount=movingPictures.length;
    let imgOffset = 0
    
    //Create the new HTML Element for the picture
    let img = document.createElement("a-image");
    img.setAttribute("id","movingPicture"+imgCount);
    let src ="";
    for(j in imgRepo){ //Find the image file for the current image
      if(imgRepo[j].includes(imageNums[i])){
        src=imgRepo[j]
      }
    }
    img.setAttribute("src", src);
    img.setAttribute("Opacity", "0");
    img.setAttribute("scale", "15 15 15");

    //set img offset
    let offset = -imgCount*8+5;
    if(imgCount % 2 == 0){
        imgOffset = -1
    }else{
        imgOffset = 1
    }
    /* FOR IMAGES MOVING WITH TEXT
    let pos = imgOffset*2+" "+offset+" -2";
    if(imageNums.length==1){
        pos="0 0 -2";
    }*/
    let pos = imgOffset*19+" "+offset+" -21";
    if(imageNums.length==1){
        pos="0 0 -21";
    }
    img.setAttribute("position", pos);

    movingPictures[imgCount]=imgCount;
    
      //Create the image element
    //let element = document.getElementById("textPara");
    let element = document.getElementById("VRScene");
    element.appendChild(img); 
    img.removeAttribute("animation__opa");
      //ANIMATION ATTRIBUTE FOR BACKGROUND IMAGES TO FADE IN
    img.setAttribute("animation__opa","property: opacity; from:0;to: 1; dur:1000; easing: linear; loop: false;");
  }
}

//Delete all pictures
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
      nextSection(pageChange);
    }else if(storyParagraphs[currentPage-1]!=="New Section"){
      changePage(pageChange);
    }else{
      //Update paragraph text value
      objParas[0].setAttribute("Opacity", 0);
      //console.log(currentPage-1+": "+storyParagraphs[currentPage]);
      //Reset and activate the Position animation
      objParas[0].removeAttribute("animation__pos");
      objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur:10000; easing: linear; loop: false;");
      if(!storyParagraphs[currentPage].includes("IMAGE:")){
        //Commented out, trialing setting Block paragraph value
        //objParas[0].setAttribute("value", storyParagraphs[currentPage]);
      }else{
          objParas[0].setAttribute("value", "");
          if(storyParagraphs[currentPage-1].includes("IMAGE:")){
            changePage(1);
          }
      }
        
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

//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
function retrieveStory(){
  //Declare array variable for all extracted text

  function newSection(json){
    combinedText[combinedText.length]="New Section";
    return extractText(json);
  }
  function extractText(json){
    let toExtract = [];
    if (!json) {
      return "";
    } 
    if (json?.attrs!==undefined) { 
      if(json.attrs?.fontSize!==undefined){
        combinedText[combinedText.length]="(FONT:)"+json.attrs.fontSize;
      }
      extractText(json.attrs);
    } 
    if (json?.subTitle!==undefined) {
      extractText(json.subTitle);
    } 
    if (json?.content!==undefined) {
      json.content.map(extractText).join("");
    } 
    if (json?.image!==undefined) {
      combinedText[combinedText.length]="(IMAGE:)"+json.image.id;
    } 
    if (json?.object!==undefined) {
      combinedText[combinedText.length]="(object:)"+json.object.id;
    } 
    if (json?.video!==undefined) {
      combinedText[combinedText.length]="(VIDEO:)"+json.video.id;
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
      extractText(json.text);
    } 
    if (json?.items!==undefined) {
      json.items.map(extractText).join("");
    } 
    if (json?.layers!==undefined) {
      for(let i in json.layers){  //Extra filter finds layerOrder to extract specific layerID's
        let extractedLayers = []
        let layerObj = json.layers[i];
        if (layerObj?.layerOrder!==undefined) {
          for(let j in layerObj.layerOrder){
            let layerJSON = layerObj.layers[layerObj.layerOrder[j]];
            extractedLayers[extractedLayers.length]=extractText(layerJSON);
          }
        }
      }
      extractText(json.layers);  //Runs on single layer object if no layerOrder
    } 
    if (json?.item!==undefined) {
      extractText(json.item);
    } 
    if (json?.title!==undefined) {
      extractText(json.title);
    } 
    if (json?.leadIn!==undefined) {
      extractText(json.leadIn);
    } 
    if (json?.storyTitle!==undefined) {
      extractText(json.storyTitle);
    } 
    if (json?.byline!==undefined) {
      extractText(json.byline);
    } 
    if (json?.caption!==undefined) {
      extractText(json.caption);
    } 
    if (json?.landscape!==undefined) {
      extractText(json.landscape);
    } 
    
    if (Array.isArray(json)) {
      json.map(extractText).join("");
    }else {
      toExtract[toExtract.length]= "";
    }
  }
  //retrieveStory('../story.json')
  //Require the desired json file from the story
  const storyData = require('../story.json');

  //Run function to extract the data
  const combinedText =[];
  extractText(storyData)
  combinedText[combinedText.length]="FinalPara";
  const myIMG = [];
  for(i in combinedText){
    if(combinedText[i].includes("(IMAGE:)") || combinedText[i].includes("(VIDEO:)")){
      //console.log("image found")
      myIMG[myIMG.length]=combinedText[i];
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
  "id": "po9k9ofYug",
  "v1Id": null,
  "organisation": "429MisUGlc",
  "team": "5YeSdMmG3H",
  "site": null,
  "theme": {
    "id": "VpF3WU0FC3",
    "name": "Shorthand Demo Theme",
    "key": "0-demo",
    "path": "/theme.min.css",
    "description": "Basic theme with a combination of light and dark sections.",
    "logo": "/assets/thumb.png",
    "pageLogos": [
      {
        "alt": "Shorthand",
        "href": "https://shorthand.com/",
        "target": "_blank",
        "bigFile": "/assets/logo.png",
        "nofollow": false,
        "smallFile": "/assets/logo.png"
      }
    ],
    "snippets": [
      {
        "args": [
          "<div class=\"upsell preview\">\n  <div class=\"upsell-container\">\n    <div class=\"shorthand-logo\"></div>\n    <h2>This is only a preview. <em>Start publishing!</em></h2>\n    <a href=\"https://shorthand.com/enquiry\" class=\"btn btn-primary\" target=\"_blank\">Enquire now</a>\n  </div>\n</div>\n\n<div class=\"section-upsell upsell\">\n  <div class=\"upsell-container\">\n    <div class=\"shorthand-logo\"></div>\n    <h2>\n      This is only a preview. <br />\n      <em>Start publishing!</em>\n    </h2>\n    <p>\n      <strong>Subscribe now to begin publishing your Shorthand stories.</strong> All plans offer flexible hosting options,\n      best-practice training &amp; online support.\n    </p>\n    <a href=\"https://shorthand.com/enquiry\" class=\"btn btn-primary\" target=\"_blank\">Enquire now</a>\n\n    <div class=\"brands-container\">\n      <h5>As used by</h5>\n      <ul class=\"brands flex\">\n        <li class=\"brand bbc\">BBC</li>\n        <li class=\"brand bi\">Dow Jones</li>\n        <li class=\"brand adweek\">ADWEEK</li>\n        <li class=\"brand skynews\">Sky News</li>\n        <li class=\"brand honda\">Honda</li>\n        <li class=\"brand stc\">Save The Children</li>\n        <li class=\"brand who\">World Health Organisation</li>\n        <li class=\"brand uh\">University of Houston</li>\n        <li class=\"brand relx\">RELX</li>\n      </ul>\n    </div>\n  </div>\n</div>\n"
        ],
        "file": "./snippets/demo-strap.html",
        "_file": "themes/0-demo/snippets/demo-strap.html",
        "method": "append",
        "selector": ".Theme-Story"
      }
    ],
    "headIncludes": {
      "body": {
        "class": "theme-base"
      },
      "link": [
        {
          "rel": "stylesheet",
          "href": "https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i|PT+Serif:400,400i,700,700i",
          "type": "text/css"
        },
        {
          "rel": "icon",
          "href": "./assets/favicon.png",
          "type": "image/png"
        }
      ],
      "script": [
        {
          "innerHTML": "try{Typekit.load();}catch(e){}"
        },
        {
          "src": "//use.typekit.net/wqj3yog.js"
        }
      ]
    },
    "sectionVariantDefaults": {
      "Text": "Light",
      "Media": "Light",
      "Reveal": "Dark",
      "TwoColumnScrollmation": "Light",
      "BackgroundScrollmation": "Dark"
    },
    "userStyleOptions": [
      {
        "kind": "color",
        "color": "#19af90",
        "label": "Teal",
        "className": "Theme-ForegroundColor-0"
      },
      {
        "kind": "backgroundColor",
        "color": "#19af90",
        "label": "Teal",
        "className": "Theme-BackgroundColor-0"
      },
      {
        "kind": "color",
        "color": "#00a7cf",
        "label": "Blue",
        "className": "Theme-ForegroundColor-1"
      },
      {
        "kind": "backgroundColor",
        "color": "#00a7cf",
        "label": "Blue",
        "className": "Theme-BackgroundColor-1"
      },
      {
        "kind": "color",
        "color": "#f2744d",
        "label": "Orange",
        "className": "Theme-ForegroundColor-2"
      },
      {
        "kind": "backgroundColor",
        "color": "#f2744d",
        "label": "Orange",
        "className": "Theme-BackgroundColor-2"
      },
      {
        "kind": "color",
        "color": "#ccb87e",
        "label": "Gold",
        "className": "Theme-ForegroundColor-3"
      },
      {
        "kind": "backgroundColor",
        "color": "#ccb87e",
        "label": "Gold",
        "className": "Theme-BackgroundColor-3"
      },
      {
        "kind": "color",
        "color": "#aaa",
        "label": "Light Gray",
        "className": "Theme-ForegroundColor-4"
      },
      {
        "kind": "backgroundColor",
        "color": "#aaa",
        "label": "Light Gray",
        "className": "Theme-BackgroundColor-4"
      },
      {
        "kind": "color",
        "color": "#777",
        "label": "Mid Gray",
        "className": "Theme-ForegroundColor-5"
      },
      {
        "kind": "backgroundColor",
        "color": "#777",
        "label": "Mid Gray",
        "className": "Theme-BackgroundColor-5"
      },
      {
        "kind": "color",
        "color": "#424242",
        "label": "Dark Gray",
        "className": "Theme-ForegroundColor-6"
      },
      {
        "kind": "backgroundColor",
        "color": "#424242",
        "label": "Dark Gray",
        "className": "Theme-BackgroundColor-6"
      },
      {
        "kind": "color",
        "color": "#ec3f3f",
        "label": "Red",
        "className": "Theme-ForegroundColor-7"
      },
      {
        "kind": "backgroundColor",
        "color": "#ec3f3f",
        "label": "Red",
        "className": "Theme-BackgroundColor-7"
      },
      {
        "kind": "color",
        "color": "#8ac064",
        "label": "Green",
        "className": "Theme-ForegroundColor-8"
      },
      {
        "kind": "backgroundColor",
        "color": "#8ac064",
        "label": "Green",
        "className": "Theme-BackgroundColor-8"
      },
      {
        "kind": "color",
        "color": "#FFF",
        "label": "White",
        "className": "Theme-ForegroundColor-9"
      },
      {
        "kind": "backgroundColor",
        "color": "#FFF",
        "label": "White",
        "className": "Theme-BackgroundColor-9"
      },
      {
        "kind": "color",
        "color": "#000",
        "label": "Black",
        "className": "Theme-ForegroundColor-10"
      },
      {
        "kind": "backgroundColor",
        "color": "#000",
        "label": "Black",
        "className": "Theme-BackgroundColor-10"
      },
      {
        "kind": "color",
        "color": "#93d6c7",
        "label": "Teal (Light)",
        "className": "Theme-ForegroundColor-11"
      },
      {
        "kind": "backgroundColor",
        "color": "#93d6c7",
        "label": "Teal (Light)",
        "className": "Theme-BackgroundColor-11"
      },
      {
        "kind": "color",
        "color": "#8cd3e6",
        "label": "Blue (Light)",
        "className": "Theme-ForegroundColor-12"
      },
      {
        "kind": "backgroundColor",
        "color": "#8cd3e6",
        "label": "Blue (Light)",
        "className": "Theme-BackgroundColor-12"
      },
      {
        "kind": "color",
        "color": "#f7b9a9",
        "label": "Orange (Light)",
        "className": "Theme-ForegroundColor-13"
      },
      {
        "kind": "backgroundColor",
        "color": "#f7b9a9",
        "label": "Orange (Light)",
        "className": "Theme-BackgroundColor-13"
      },
      {
        "kind": "color",
        "color": "#e5dbc0",
        "label": "Gold (Light)",
        "className": "Theme-ForegroundColor-14"
      },
      {
        "kind": "backgroundColor",
        "color": "#e5dbc0",
        "label": "Gold (Light)",
        "className": "Theme-BackgroundColor-14"
      },
      {
        "kind": "color",
        "color": "#f4a0a1",
        "label": "Red (Light)",
        "className": "Theme-ForegroundColor-15"
      },
      {
        "kind": "backgroundColor",
        "color": "#f4a0a1",
        "label": "Red (Light)",
        "className": "Theme-BackgroundColor-15"
      },
      {
        "kind": "color",
        "color": "#c5dfb4",
        "label": "Green (Light)",
        "className": "Theme-ForegroundColor-16"
      },
      {
        "kind": "backgroundColor",
        "color": "#c5dfb4",
        "label": "Green (Light)",
        "className": "Theme-BackgroundColor-16"
      },
      {
        "kind": "backgroundColor",
        "color": "transparent",
        "label": "Transparent",
        "className": "Theme-BackgroundColor-17"
      }
    ],
    "version": "a1cee4401feafee8c6e61e1378378485",
    "isEnabled": true,
    "isPublic": true,
    "createdBy": null,
    "updatedBy": null,
    "deletedBy": null,
    "createdAt": "2017-06-15T03:36:21.796Z",
    "updatedAt": "2022-09-02T18:27:38.355Z",
    "currentVersion": 10455,
    "assetBase": "./assets",
    "fullPath": "/efs_data/themes/0-demo/theme.min.css"
  },
  "preview": "jDjpy9xHPBd3R5Us",
  "collaborators": [
    {
      "role": {
        "isOwner": true,
        "isEditor": true,
        "isViewer": true
      },
      "user": "Ru4S9oEnSI"
    },
    {
      "role": {
        "isOwner": false,
        "isEditor": true,
        "isViewer": true
      },
      "user": "V5Jtfmlx5W"
    },
    {
      "role": {
        "isOwner": false,
        "isEditor": true,
        "isViewer": true
      },
      "user": "sx7NK5sd4F"
    },
    {
      "role": {
        "isOwner": false,
        "isEditor": true,
        "isViewer": true
      },
      "user": "XO39LbFiiQ"
    },
    {
      "role": {
        "isOwner": false,
        "isEditor": true,
        "isViewer": true
      },
      "user": "tkx8W7cFIU"
    }
  ],
  "state": {
    "lockedAt": "1649945119",
    "lockedBy": "Ru4S9oEnSI"
  },
  "type": "story",
  "cover": "D3h9QGqI9v",
  "coverBackgroundClass": "Dark",
  "title": "Shorthand-WanderLust Project:",
  "description": "Lost in Innsmouth",
  "slug": "untitled",
  "sections": [
    {
      "id": "vn1JaMSuzM",
      "template": "jyR1iQaL2T",
      "className": "Title",
      "isNavigable": false,
      "settings": {
        "theme": "Dark",
        "height": 100,
        "layout": "Full",
        "isFixed": true,
        "overlay": 85,
        "textFade": "none",
        "className": null,
        "textDepth": 1,
        "textShift": "none",
        "overlayStyle": "Top",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "colorClassName": "Theme-ForegroundColor-9",
        "mediaTransition": "none",
        "backgroundColorClassName": "Theme-BackgroundColor-10",
        "textZoom": "none",
        "textBlur": "none",
        "backgroundFade": "none",
        "backgroundBlur": "none",
        "backgroundGrayscale": "none",
        "layoutLandscapeMedia": "left",
        "layoutPortraitMedia": "top"
      },
      "layers": [
        {
          "id": "0xKBBL",
          "kind": "text-blocks",
          "items": [
            {
              "id": "xBl1F7",
              "kind": "header",
              "leadIn": {
                "id": "DAoohXrLz1",
                "type": "doc",
                "content": [
                  {
                    "type": "leadin",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxxlarge"
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "Lost in Innsmouth",
                        "marks": [
                          {
                            "type": "strong",
                            "attrs": {}
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "storyTitle": {
                "id": "oN9ZUDtG6K",
                "type": "doc",
                "content": [
                  {
                    "type": "storytitle",
                    "attrs": {
                      "align": "left",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxsmall"
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "Shorthand-WanderLust Project:"
                      }
                    ]
                  }
                ]
              }
            },
            {
              "id": "pCAw4H",
              "kind": "byline",
              "byline": {
                "id": "fv45ADRiLL",
                "type": "doc",
                "content": [
                  {
                    "type": "byline",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": ""
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "By WanderLust"
                      }
                    ]
                  }
                ]
              },
              "position": {
                "x": "center",
                "y": "bottom"
              }
            }
          ]
        },
        {
          "id": "g5TvHY",
          "kind": "background-viewport",
          "items": [
            {
              "id": "cwwURg",
              "kind": "image",
              "landscape": {
                "image": {
                  "id": "D3h9QGqI9v",
                  "meta": {
                    "heading": "Background image (will be cropped to screen)",
                    "subHeading": "Recommended: JPEG @ 2560 x 1440px"
                  },
                  "isUserDefined": true
                },
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "attrs": {
                        "align": "",
                        "className": "",
                        "fontFamily": ""
                      },
                      "content": [
                        {
                          "text": "Photo by ",
                          "type": "text"
                        },
                        {
                          "text": "Scott Webb",
                          "type": "text",
                          "marks": [
                            {
                              "type": "link",
                              "attrs": {
                                "href": "https://unsplash.com/@scottwebb?utm_source=shorthand_production&utm_medium=referral",
                                "blank": true,
                                "nofollow": false,
                                "noreferrer": false
                              }
                            }
                          ]
                        },
                        {
                          "text": " on ",
                          "type": "text"
                        },
                        {
                          "text": "Unsplash",
                          "type": "text",
                          "marks": [
                            {
                              "type": "link",
                              "attrs": {
                                "href": "https://unsplash.com/photos/4lyOcRmx29g",
                                "blank": true,
                                "nofollow": false,
                                "noreferrer": false
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                "altText": "white and black VR Box headset on green grass field",
                "transition": {
                  "name": "none",
                  "start": 0,
                  "delay": 0.1
                },
                "focal": {
                  "x": 50,
                  "y": 50
                }
              },
              "portrait": {
                "image": {
                  "id": "qt75W6oC9E",
                  "meta": {
                    "heading": "Background image (will be cropped to screen)",
                    "subHeading": "Recommended: JPEG @ 1080 x 1920px "
                  },
                  "isUserDefined": false
                },
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "attrs": {
                        "align": "",
                        "className": "",
                        "fontFamily": ""
                      },
                      "content": [
                        {
                          "text": "Photo by ",
                          "type": "text"
                        },
                        {
                          "text": "Scott Webb",
                          "type": "text",
                          "marks": [
                            {
                              "type": "link",
                              "attrs": {
                                "href": "https://unsplash.com/@scottwebb?utm_source=shorthand_production&utm_medium=referral",
                                "blank": true,
                                "nofollow": false,
                                "noreferrer": false
                              }
                            }
                          ]
                        },
                        {
                          "text": " on ",
                          "type": "text"
                        },
                        {
                          "text": "Unsplash",
                          "type": "text",
                          "marks": [
                            {
                              "type": "link",
                              "attrs": {
                                "href": "https://unsplash.com/photos/4lyOcRmx29g",
                                "blank": true,
                                "nofollow": false,
                                "noreferrer": false
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                "altText": "white and black VR Box headset on green grass field",
                "transition": {
                  "name": "none",
                  "start": 0,
                  "delay": 0.1
                }
              }
            }
          ],
          "overlay": 30
        }
      ]
    },
    {
      "id": "a6IIoWUSWI",
      "template": "mXhhJXlEKQ",
      "className": "Media",
      "isNavigable": false,
      "settings": {
        "className": null,
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Light",
        "visibility": "All devices"
      },
      "layers": [
        {
          "id": "PIojJY",
          "kind": "responsive-media",
          "items": [
            {
              "id": "N4eQNg",
              "kind": "video",
              "portrait": {
                "video": {
                  "id": "oMTc06c0ID",
                  "loop": false,
                  "meta": {
                    "heading": "MP4 video (will scale to screen width)",
                    "subHeading": "Recommended: 900 x 507px, 100mb MAX"
                  },
                  "muted": false,
                  "autoPlay": false,
                  "controls": true,
                  "isUserDefined": false
                },
                "poster": {
                  "id": "FojDGJECug",
                  "meta": {
                    "heading": "Shown before video loads",
                    "subHeading": "JPEG to match dimensions of video"
                  },
                  "isUserDefined": false
                },
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "name": "none",
                  "start": 0,
                  "delay": 0.1
                }
              },
              "landscape": {
                "video": {
                  "id": "PYj71zvsAD",
                  "loop": false,
                  "meta": {
                    "heading": "MP4 video (will scale to screen width)",
                    "subHeading": "Recommended: 1920x1080px, 100mb MAX"
                  },
                  "muted": false,
                  "autoPlay": false,
                  "controls": true,
                  "isUserDefined": true
                },
                "poster": {
                  "id": "yp0f2XkDCi",
                  "meta": {
                    "heading": "Shown before video loads",
                    "subHeading": "JPEG to match dimensions of video"
                  },
                  "isUserDefined": true
                },
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "name": "none",
                  "start": 0,
                  "delay": 0.1
                }
              }
            }
          ],
          "overlay": 50
        }
      ]
    },
    {
      "id": "rSSAQ5arxP",
      "template": "Ilg8E8vx5C",
      "className": "BackgroundScrollmation",
      "isNavigable": false,
      "settings": {
        "overlay": 60,
        "className": null,
        "bodyTextFade": "none",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "mediaTransition": "slow",
        "theme": "Dark",
        "visibility": "All devices"
      },
      "layers": [
        {
          "id": "hRhdug",
          "kind": "columns",
          "layers": {
            "1SuARv": {
              "id": "1SuARv",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "gzrsPAXbqE",
                    "type": "doc",
                    "content": [
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "I'm afraid I wouldn't care about any uninteresting urban tales if I hadn't seen them with my own eyes, nor would I recognise this town that I couldn't find on a map. "
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "The year was 1846, and the weather appeared colder than usual."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "I had recently graduated from university and was on my way to the railway station to purchase a train ticket to my hometown to see my grandfather and grandma, whom I hadn't seen in a long time."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "However, I was interrupted by an extraordinarily pricey railway ticket."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "I remained in front of the ticket office for a long time, staring at the train timetable and hesitating, until the conductor, realising that I had no money, led me to another cheaper and more practicable option: take the bus across the street to Innsmouth."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "Then, board the bus from Innsmouth to my final destination."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": " Innsmouth is now merely a backwards community that relies on fishing for a living due to a lack of information and access to railways. "
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "According to folklore, the locals there worship evil gods and will occasionally summon demons from hell to devour passing visitors."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "It is not advisable to spend the night there. My concerns about the odd town I was about to see were eased by the conductor's explanation."
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "alignment": "left"
            }
          },
          "layerOrder": [
            "1SuARv"
          ]
        },
        {
          "id": "uJo5YX",
          "kind": "background-canvas",
          "items": [
            {
              "id": "D6u46M",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "5yfAtb7GU6",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "NETXgllPkN",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0
                },
                "focal": {
                  "x": 18,
                  "y": 62
                }
              }
            },
            {
              "id": "PpjToo",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "6s7YT5s2p4",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0.33
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "5HECXqtPRY",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0.33
                },
                "focal": {
                  "x": 6,
                  "y": 50
                }
              }
            },
            {
              "id": "rGLhHG",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "9XPnH69KbC",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0.66
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "iMitwH0EXu",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "transition": {
                  "start": 0.66
                },
                "focal": {
                  "x": 1,
                  "y": 62
                }
              }
            }
          ],
          "overlay": 50
        }
      ]
    },
    {
      "id": "mTf9WR7FbX",
      "template": "74v5b8TFme",
      "className": "TextOverMedia",
      "isNavigable": false,
      "settings": {
        "height": 100,
        "layout": "Full",
        "isFixed": true,
        "overlay": 30,
        "className": null,
        "textShift": "none",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark",
        "textFade": "none",
        "layoutLandscapeMedia": "left",
        "layoutPortraitMedia": "top"
      },
      "layers": [
        {
          "id": "YTaiah",
          "kind": "text-blocks",
          "items": [
            {
              "kind": "card-body",
              "text": {
                "id": "JD0gfdUgjY",
                "type": "doc",
                "content": [
                  {
                    "type": "subsubtitle",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxxsmall"
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "I took the bus to town, and nothing unusual happened with the exception of the driver's weird expression. The bus arrived in Innsmouth, a town covered in thick haze, just after I had endured the bumps for hours."
                      }
                    ]
                  }
                ]
              },
              "title": {
                "id": "3qKtCO6YgJ",
                "type": "doc",
                "content": [
                  {
                    "type": "title",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "small"
                    }
                  }
                ]
              },
              "position": {
                "x": "center",
                "y": "bottom"
              },
              "subTitle": {
                "id": "zBR7YRxE1M",
                "type": "doc",
                "content": [
                  {
                    "type": "subtitle",
                    "attrs": {
                      "align": "",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxsmall"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "tF0nco",
          "kind": "background-viewport",
          "items": [
            {
              "id": "BRxYxu",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "0PiHnHQXIs",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "X0OgcjeEUe",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "focal": {
                  "x": 50,
                  "y": 62
                }
              }
            }
          ],
          "overlay": 30
        }
      ]
    },
    {
      "id": "VtxccjkHeX",
      "template": "74v5b8TFme",
      "className": "TextOverMedia",
      "isNavigable": false,
      "settings": {
        "height": 100,
        "layout": "Full",
        "isFixed": false,
        "overlay": 30,
        "className": null,
        "textShift": "none",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark",
        "textFade": "none",
        "layoutLandscapeMedia": "left",
        "layoutPortraitMedia": "top",
        "overlayStyle": "Full"
      },
      "layers": [
        {
          "id": "qD5KOKmUkC",
          "kind": "text-blocks",
          "items": [
            {
              "kind": "card-body",
              "text": {
                "id": "kppFFyOGFU",
                "type": "doc",
                "content": [
                  {
                    "type": "subsubtitle",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxxsmall"
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "A bizarre but solemn ancient building drew my attention, but whether it was the aura or the curiously dressed people at the door, it was clear that it was the gathering place of the wicked gods. The dark mood made me afraid to explore anymore, and the bus eventually brought me to the comparatively rich side of town."
                      }
                    ]
                  }
                ]
              },
              "title": {
                "id": "4Y2I88awgP",
                "type": "doc",
                "content": [
                  {
                    "type": "title",
                    "attrs": {
                      "align": "center",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "small"
                    }
                  }
                ]
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "subTitle": {
                "id": "S1RMrBIyf6",
                "type": "doc",
                "content": [
                  {
                    "type": "subtitle",
                    "attrs": {
                      "align": "",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxsmall"
                    }
                  }
                ]
              },
              "id": "KiHHZtX7h9"
            }
          ]
        },
        {
          "id": "oR29fHfYwT",
          "kind": "background-viewport",
          "items": [
            {
              "id": "hhAhkYwyfg",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "0PiHnHQXIs",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "uhD9A6h3Vo",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                },
                "focal": {
                  "x": 50,
                  "y": 37
                }
              }
            }
          ],
          "overlay": 30
        }
      ]
    },
    {
      "id": "PbAaWogE6R",
      "template": "PprV0nvfFe",
      "className": "TwoColumnScrollmation",
      "isNavigable": false,
      "settings": {
        "className": null,
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark"
      },
      "layers": [
        {
          "id": "iCCa8p",
          "kind": "columns",
          "layers": {
            "xBTbQN": {
              "id": "xBTbQN",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "uyaBJvwpsX",
                    "type": "doc",
                    "content": [
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "The bus soon came to a halt, and I dashed off to attempt to alleviate the discomfort of the journey, but the stink in the air didn't help much. Dilapidated wooden dwellings, a row of houses crammed together without regard for norms, even the town centre is sparsely populated."
                          },
                          {
                            "type": "hard_break"
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "With a few hours before the bus left again, I dropped by the local grocery store out of boredom and curiosity, hoping to learn anything valuable. As soon as I stepped in, I was drawn to a golden shimmering ring placed on the store's counter, which seemed out of place in comparison to the rest of the store."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "hard_break"
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "I first asked the shopkeeper for information about the town, but he gave me a very impatient look as if to warn me not to ask any further questions about the topic until I bought the ring, and at the same time he looked at me maliciously."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "That ring piqued my interest in an unusual way. It was a gold-bordered ring with a green stone inlay in it. The pattern carved on the stone was bizarre, like a half-human, half-fish monster. I dimly remembered seeing a similar design before. I was unsure about purchasing this ring."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "The owner of the shop told me the story of this town with a half-smile. A hundred years ago, this town lived on the port trade. At that time, it was still a vibrant town. However, the good times did not last long. The town was quickly dragged down by the ensuing war. Many people lost their livelihood jobs. It's all ruined."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        }
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "However, this scene didn't last long when an ship sailed toward the town. The captain told everyone in the town that he knew a true god, and as long as everyone was willing to follow him, Innsmouth would prosper. From then on, the town seemed to come alive, with schools of fish flocking to the town and smoke from the factory chimneys. However, every night the residents of the town mysteriously disappear."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "Finally, on a stormy night, the bizarre events are revealed by the half-man, half-fish creatures that keep emerging from the shoreline. It turned out that the captain and his followers were constantly sacrificing residents to those monsters in exchange for various resources. Since then, there have been many mixed species of humans and fish in the town."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "Such people don't show obvious features at first, but around the age of 20 they start to lose their hair and gradually become half human and half fish. I hear a chill in my heart here. I subconsciously looked at my watch, it was time to get on the departing bus."
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "alignment": "left"
            },
            "PiHjEi": {
              "id": "PiHjEi",
              "kind": "card-canvas",
              "items": [
                {
                  "id": "TzYWFj",
                  "kind": "image",
                  "link": {
                    "href": "",
                    "blank": false,
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "portrait": {
                    "image": {
                      "id": "8NIJCjSHQD",
                      "isUserDefined": false
                    },
                    "transition": {
                      "start": 0
                    }
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  },
                  "landscape": {
                    "image": {
                      "id": "bcoIi7gXby",
                      "isUserDefined": true
                    },
                    "altText": "",
                    "caption": {
                      "type": "doc",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": []
                        }
                      ]
                    },
                    "transition": {
                      "start": 0
                    }
                  }
                },
                {
                  "id": "W3IPMv",
                  "kind": "image",
                  "link": {
                    "href": "",
                    "blank": false,
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "portrait": {
                    "image": {
                      "id": "6vnfqXKYpj",
                      "isUserDefined": false
                    },
                    "transition": {
                      "start": 0.25
                    }
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  },
                  "landscape": {
                    "image": {
                      "id": "JqXBwRBR7R",
                      "isUserDefined": true
                    },
                    "altText": "",
                    "caption": {
                      "type": "doc",
                      "content": [
                        {
                          "type": "paragraph",
                          "content": []
                        }
                      ]
                    },
                    "transition": {
                      "start": 0.25
                    }
                  }
                }
              ],
              "responsiveHide": "sm-down",
              "alignment": "left"
            }
          },
          "layerOrder": [
            "xBTbQN",
            "PiHjEi"
          ]
        },
        {
          "id": "s2Yhew",
          "kind": "background-canvas",
          "items": [],
          "overlay": 50
        }
      ]
    },
    {
      "id": "dTT5SWlvIx",
      "template": "74v5b8TFme",
      "className": "TextOverMedia",
      "isNavigable": false,
      "settings": {
        "height": 100,
        "layout": "Half",
        "isFixed": true,
        "overlay": 30,
        "className": null,
        "textShift": "none",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark",
        "textFade": "none",
        "visibility": "All devices",
        "layoutLandscapeMedia": "left",
        "layoutPortraitMedia": "top"
      },
      "layers": [
        {
          "id": "YTaiah",
          "kind": "text-blocks",
          "items": [
            {
              "kind": "card-body",
              "text": {
                "id": "vY8PnPpuRK",
                "type": "doc",
                "content": [
                  {
                    "type": "subsubtitle",
                    "attrs": {
                      "align": "",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxxsmall"
                    }
                  }
                ]
              },
              "title": {
                "id": "kgxljxloy7",
                "type": "doc",
                "content": [
                  {
                    "type": "title",
                    "attrs": {
                      "align": "right",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "small"
                    }
                  }
                ]
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "subTitle": {
                "id": "irOQ5dDfBM",
                "type": "doc",
                "content": [
                  {
                    "type": "subtitle",
                    "attrs": {
                      "align": "left",
                      "className": "",
                      "fontFamily": "",
                      "fontSize": "xxxsmall"
                    },
                    "content": [
                      {
                        "type": "text",
                        "text": "I subconsciously looked at my watch, it was time to get on the departing bus."
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          "id": "tF0nco",
          "kind": "background-viewport",
          "items": [
            {
              "id": "BRxYxu",
              "kind": "image",
              "link": {
                "href": "",
                "blank": false,
                "nofollow": false,
                "noreferrer": true
              },
              "portrait": {
                "image": {
                  "id": "0PiHnHQXIs",
                  "isUserDefined": false
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                }
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "MObpieZw3w",
                  "isUserDefined": true
                },
                "altText": "",
                "caption": {
                  "type": "doc",
                  "content": [
                    {
                      "type": "paragraph",
                      "content": []
                    }
                  ]
                }
              }
            }
          ],
          "overlay": 30
        }
      ]
    },
    {
      "id": "aBXIjm7UrP",
      "template": "PprV0nvfFe",
      "className": "TwoColumnScrollmation",
      "isNavigable": false,
      "settings": {
        "className": null,
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark"
      },
      "layers": [
        {
          "id": "iCCa8p",
          "kind": "columns",
          "layers": {
            "xBTbQN": {
              "id": "xBTbQN",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "xxA1YpwGpD",
                    "type": "doc",
                    "content": [
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "The driver told me that the car was broken and I'm afraid I won't be able to go anywhere tonight. In desperation, I had to rent a hotel to spend the night in this town."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        }
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        }
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": " I lay in bed staring at the ring in a daze and soon fell into a dream. It was a strange dream. In the dream, I actually swam unimpeded in the deep sea. There was a green stone statue on the seabed. The shape was very similar to the pattern on the ring."
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        }
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        }
                      },
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": "Suddenly, I was awakened by the sound of thunder and rain outside the window. I looked out the window, and a scene I will never forget happened, just as the shopkeeper described, countless half-human, half-fish creatures crawled out of the water and headed towards the town."
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "alignment": "left"
            },
            "PiHjEi": {
              "id": "PiHjEi",
              "kind": "card-canvas",
              "items": [
                {
                  "id": "J0rXso",
                  "kind": "image",
                  "landscape": {
                    "image": {
                      "id": "sfv2bWQrhq",
                      "isUserDefined": true
                    },
                    "transition": {
                      "name": "none",
                      "start": 0.05
                    }
                  },
                  "portrait": {
                    "image": {
                      "id": null,
                      "isUserDefined": false
                    },
                    "transition": {
                      "name": "none",
                      "start": 0.05
                    }
                  },
                  "link": {
                    "blank": false,
                    "href": "",
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  }
                },
                {
                  "id": "2xqU7z",
                  "kind": "image",
                  "landscape": {
                    "image": {
                      "id": "KehrQ0yKcs",
                      "isUserDefined": true
                    },
                    "transition": {
                      "name": "fade",
                      "start": 0.5
                    }
                  },
                  "portrait": {
                    "image": {
                      "id": null,
                      "isUserDefined": false
                    },
                    "transition": {
                      "name": "fade",
                      "start": 0.5
                    }
                  },
                  "link": {
                    "blank": false,
                    "href": "",
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  }
                }
              ],
              "responsiveHide": "sm-down",
              "alignment": "left"
            }
          },
          "layerOrder": [
            "PiHjEi",
            "xBTbQN"
          ]
        },
        {
          "id": "s2Yhew",
          "kind": "background-canvas",
          "items": [],
          "overlay": 50
        }
      ]
    },
    {
      "id": "5QXuuoBS0P",
      "template": "x3t6PvdwHF",
      "className": "Text",
      "isNavigable": false,
      "settings": {
        "className": null,
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "theme": "Dark"
      },
      "layers": [
        {
          "id": "G1Gqzd",
          "kind": "columns",
          "layers": {
            "JYB8rA": {
              "id": "JYB8rA",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "HnAvVGLi5L",
                    "type": "doc",
                    "content": [
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": " I rushed out of the hotel and ran without looking back, and finally fell on the muddy ground and passed out. In the morning I woke up in the pub in the town, I quickly boarded the bus to my hometown, and everything was calm as if everything that happened last night was a dream."
                          }
                        ]
                      },
                      {
                        "type": "media",
                        "attrs": {
                          "className": "",
                          "align": "",
                          "item": {
                            "kind": "embed",
                            "landscape": {
                              "caption": {
                                "type": "doc",
                                "content": [
                                  {
                                    "type": "paragraph",
                                    "content": []
                                  }
                                ]
                              },
                              "transition": {
                                "name": "none",
                                "start": 0,
                                "delay": 0.1
                              },
                              "embed": {
                                "originalUrl": "https://www.youtube.com/watch?v=JyXEwn6QNhc",
                                "iframelyContentId": "n/a",
                                "text": "Today we're back with some more cosmic horror examining the cthulhu mythos and the work of HP Lovecraft, this time taking a look at the creatures known as the Deep Ones. \n#Lovecraft #CthulhuMythos #MythologyExplained\nIf you have enjoyed this video, please leave a like as it helps a lot.\n►SUBSCRIBE FOR MORE VIDEOS! ►►► https://goo.gl/j5qJPy \n\nFOR MORE VIDEOS CHECK OUT MY PLAYLISTS!\n►COMPLETE PLAYLIST!  ►► ►https://goo.gl/PNtLZT\n►GREEK MYTHOLOGY PLAYLIST! ►►►https://goo.gl/mkT3Qk\n►NORSE MYTHOLOGY PLAYLIST! ►►►https://goo.gl/cj4MUs\n\nFor those wanting to support the channel - https://www.patreon.com/MythologyExplained\n\nIntro by http://taloscreative.co.uk\nIntro Music by http://www.grahamplowman.com\n\nIf any of your artwork has been used in a video of mine please don't hesitate to contact me and the appropriate credit can be given.\n\nMusic by Graham Plowman - The Hound\nhttps://www.youtube.com/watch?v=3wFA0bAnGSU\nhttp://www.grahamplowman.com",
                                "title": "The Deep Ones - (Exploring the Cthulhu Mythos)",
                                "html": "<div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe allow=\"autoplay *; accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *;\" scrolling=\"no\" allowfullscreen=\"\" style=\"top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;\" data-img=\"\" data-iframely-url=\"https://iframely.shorthand.com/uBT6aKX?playerjs=1\"></iframe></div></div>",
                                "ampHtml": "<amp-iframe src=\"https://iframely.shorthand.com/uBT6aKX?amp=1&playerjs=1\" width=\"400\" height=\"225\" frameborder=\"0\" allowfullscreen layout=\"responsive\" sandbox=\"allow-scripts allow-same-origin allow-popups allow-forms\"><amp-img layout=\"fill\" src=\"https://iframely.shorthand.com/api/thumbnail?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DJyXEwn6QNhc&key=4c0a0c5255344f2050a6c4f0a0e0ba98\" placeholder></amp-img></amp-iframe>",
                                "isUserDefined": true,
                                "provider": "youtube"
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              ],
              "alignment": "center"
            },
            "Ix52cH1qSu": {
              "id": "Ix52cH1qSu",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "cjrn3b94BQ",
                    "type": "doc",
                    "content": [
                      {
                        "type": "paragraph",
                        "attrs": {
                          "align": "",
                          "className": "",
                          "fontFamily": ""
                        },
                        "content": [
                          {
                            "type": "text",
                            "text": " Arriving at my grandparents' house, the strange face in my grandmother's portrait brought back memories of all the weird things I've been through lately. Everything seemed to portend something, Innsmouth, the cult, the god, the strange pattern on the ring and the face of the grandmother. With my hair falling out because I stayed up all night thinking, there was only one thought in my mind, I had to go back to that town no matter what."
                          }
                        ]
                      },
                      {
                        "type": "media",
                        "attrs": {
                          "className": "",
                          "align": "",
                          "item": {
                            "kind": "embed",
                            "landscape": {
                              "caption": {
                                "type": "doc",
                                "content": [
                                  {
                                    "type": "paragraph",
                                    "content": []
                                  }
                                ]
                              },
                              "transition": {
                                "name": "none",
                                "start": 0,
                                "delay": 0.1
                              },
                              "embed": {
                                "originalUrl": "https://www.youtube.com/watch?v=Rxh_SVtyZqo",
                                "iframelyContentId": "n/a",
                                "text": "https://www.hplovecraft.com/writings/texts/fiction/soi.aspx\n\n\nChapter 1: 0:00:00\nChapter 2: 0:28:04\nChapter 3: 1:08:03\nChapter 4: 1:50:17\nChapter 5: 2:47:08\n\nSupport the Patreon to see Exploring videos early and vote on new ones!: http://bit.ly/1U9QkPh\nJoin the Discord!: https://discord.gg/eBHHHe5\nSupport the Series with official Merch!: https://t.co/aH0HApXp7v\nFollow me on Twitter for updates!: https://twitter.com/TES_Mangg\nListen on Podcasts: https://anchor.fm/theexploringseries\nExploring SCP Foundation Playlist: https://bit.ly/2whu8NA\nExploring Dungeons and Dragons Playlist: https://bit.ly/348IZZu\nExploring Warhammer 40k Playlist: https://bit.ly/2DoFZgu\nExploring Celtic Mythology Playlist: https://bit.ly/2rTuHLm\nExploring Norse Mythology Playlist: http://bit.ly/2EAHTda\nExploring Elder Scrolls Playlist: http://bit.ly/2fgqQoY\nExploring Star Wars Playlist: http://bit.ly/2lNtlN0\nExploring Middle-Earth Playlist: http://bit.ly/2cGNcty\nExploring the Cthulhu Mythos Playlist: http://bit.ly/25OI9jY\nExploring History Playlist: https://bit.ly/2w7XMqM\nThe Story of FFXIV Playlist: https://bit.ly/2XgU1Lk\nMy Gaming Channel: https://www.youtube.com/user/ManggsLPs\n\nArtists Include:\nDenis Loebner: https://www.artstation.com/denisthemenace\nWyrdTree Art: https://www.artstation.com/mcrassusart\nsilberius: https://www.deviantart.com/silberius\nKonstantin Vohwinkel: https://www.artstation.com/kingstantin\nRostyslav Zagornov: https://www.artstation.com/attemme\nRichard Wright: https://www.artstation.com/richardwright\n\nMusic: https://www.youtube.com/watch?v=017yCQMfbzE\n             https://www.youtube.com/watch?v=ppiGTLqfaWc",
                                "title": "The Shadow Over Innsmouth by H.P. Lovecraft (Audiobook)",
                                "html": "<div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe allow=\"autoplay *; accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *;\" scrolling=\"no\" allowfullscreen=\"\" style=\"top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;\" data-img=\"\" data-iframely-url=\"https://iframely.shorthand.com/NkXkFLw?playerjs=1\"></iframe></div></div>",
                                "ampHtml": "<amp-iframe src=\"https://iframely.shorthand.com/NkXkFLw?amp=1&playerjs=1\" width=\"400\" height=\"225\" frameborder=\"0\" allowfullscreen layout=\"responsive\" sandbox=\"allow-scripts allow-same-origin allow-popups allow-forms\"><amp-img layout=\"fill\" src=\"https://iframely.shorthand.com/api/thumbnail?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DRxh_SVtyZqo&key=4c0a0c5255344f2050a6c4f0a0e0ba98\" placeholder></amp-img></amp-iframe>",
                                "isUserDefined": true,
                                "provider": "youtube"
                              }
                            }
                          }
                        }
                      }
                    ]
                  },
                  "id": "btDg36Bidq"
                }
              ],
              "alignment": "center"
            }
          },
          "layerOrder": [
            "JYB8rA",
            "Ix52cH1qSu"
          ]
        },
        {
          "id": "s2Yhew",
          "kind": "background-canvas",
          "items": [],
          "overlay": 50
        }
      ]
    }
  ],
  "sectionCount": 9,
  "logos": [],
  "showThemeLogos": true,
  "authors": null,
  "tags": [],
  "keywords": null,
  "status": "published",
  "contentVersion": 1607,
  "publishUrl": null,
  "publishAt": null,
  "previewUsername": null,
  "publishUsername": null,
  "socialFacebookCover": null,
  "socialTwitterCover": null,
  "socialShowMobile": false,
  "socialShowFacebook": false,
  "socialShowTwitter": false,
  "socialShowLinkedIn": false,
  "socialFacebookAppId": "",
  "socialFacebookTitle": "",
  "socialFacebookDescription": "",
  "socialTwitterText": "",
  "socialTwitterHandle": "",
  "socialTwitterShortUrl": "",
  "lastPreviewAt": "2022-03-31T23:48:14.501Z",
  "lastPublishedAt": "2022-08-28T05:48:33.482Z",
  "lastPublishedUrl": null,
  "lastPublishedVersion": 1281,
  "lastPublishedBy": "Ru4S9oEnSI",
  "createdBy": "Ru4S9oEnSI",
  "updatedBy": "tkx8W7cFIU",
  "deletedBy": null,
  "createdAt": "2022-03-31T23:48:14.502Z",
  "updatedAt": "2022-09-01T17:46:46.300Z",
  "deletedAt": null,
  "currentVersion": 1607,
  "settings": {
    "ampEnabled": true
  },
  "header": {
    "visibility": true,
    "logos": [],
    "showThemeLogos": true
  },
  "social": {
    "showMobile": false,
    "showFacebook": false,
    "showTwitter": false,
    "showLinkedIn": false,
    "facebookAppId": "",
    "facebookTitle": "",
    "facebookDescription": "",
    "twitterText": "",
    "twitterHandle": "",
    "twitterShortUrl": ""
  },
  "generatedAt": "2022-09-03T13:39:54.876Z",
  "collections": [],
  "publishSettings": [],
  "isTestStory": false,
  "coverUrls": {
    "facebook": false,
    "twitter": false,
    "page": false
  }
}
//end of JSON@
},{}]},{},[1]);
