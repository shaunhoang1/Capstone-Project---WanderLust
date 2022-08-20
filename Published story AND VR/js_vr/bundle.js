(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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

//Control the opacity of paragraphs as they change height
function setOpacity(){
    for(let i=0;i<4;i++){
        textTarget = objParas[i];
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
        }
    }
}

//Navigate to next/previous skybox image
function changeSky(skyChange) {
    currentSky = wrapAround(currentSky + skyChange,1,skies.length-1)[1];
    var sky = document.getElementById("sky");
    sky.setAttribute("src", skies[currentSky]);
}



//Define theBackgrounds
var currentSky = 0;
const skies = [];
{
    skies[1] = "#sky1";
    skies[2] = "#sky2";
    skies[3] = "#sky3";
}

//Navigate Backgrounds 
var currentSky = 0;
document.addEventListener("keydown", function (event) {
    //Go to next background
    if (event.shiftKey) {
        changeSky(1);
    }
});

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
var currentPage = 0;
function changePage(pageChange) {
    clearPageAll();
    currentPage = wrapAround(currentPage+pageChange,1, storyParagraphs.length - 1)[1];

    //Update paragraph text value
    objParas[0].setAttribute("value", storyParagraphs[currentPage]);

    //Reset and activate the Position animation
    objParas[0].removeAttribute("animation__pos");
    objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur:30000; easing: linear; loop: false;");
}

//Manually scroll through paragraphs with "i" or "k"
var scrollingHeight = 0;
document.addEventListener("keydown", function (event) {
    //Scroll through paragraphs  
    //Scroll up        
    if (event.key === "i"){
        changePage(0);
        //add to scroll
        scrollingHeight= objParas[0].object3D.position.y+10+0.2;

        //If greater than or equal to maximum height, reset for next section
        var wrapCheck = wrapAround(scrollingHeight,0,20);
        if (wrapCheck[0]) {
            scrollingHeight = wrapCheck[1];
            console.log("Loading Next section");
            changePage(1);

            //Reset the Position 
            objParas[0].setAttribute("opacity", 0);
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
            objParas[0].setAttribute("opacity", 0);
            objParas[0].setAttribute("position","0 10 -20");  
        }           

        //Remove existing animations
        objParas[0].removeAttribute("animation__pos");

        objParas[0].object3D.position.y = -10+scrollingHeight;
        setOpacity();
    }
});

//Define the page number and change for all text objects
var currentPageAll = 0;
var tempPage = 0;
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
    objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20;                             dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE SECOND PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 2 
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];
    objParas[1].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[1].setAttribute("animation__pos","property: position; from:20 -10 0;to: 20 10 -0;                              dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE THIRD PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 3
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];          
    objParas[2].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[2].setAttribute("animation__pos","property: position; from:-0 -10 20;to: -0 10 20;                             dur: 10000; easing: linear; loop: false;");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE FOURTH PARAGRAH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //Set next temporary page variable for PARAGRAPH 4
    tempPage = wrapAround(tempPage+1,1, storyParagraphs.length - 1)[1];
    objParas[3].setAttribute("value", storyParagraphs[tempPage]);
    //Reset and activate the Position animation
    objParas[3].setAttribute("animation__pos","property: position; from:-20 -10 -0;to: -20 10 -0;                           dur: 10000; easing: linear; loop: false;");
}

//clearing all pages for a clean change to next sections
function clearPageAll(){
    for (let i = 0; i < 4; i++) {
        objParas[i].removeAttribute("animation__pos");
        objParas[i].setAttribute("opacity",0);
        objParas[i].setAttribute("value", "");
    }
}

//define all paragraph objects
var objParas = [];
function iniParagraphObjects(){
    console.log("GETTING ELEMENTS")
    objParas[0]=document.getElementById("textPara");
    objParas[1]=document.getElementById("textPara2");
    objParas[2]=document.getElementById("textPara3");
    objParas[3]=document.getElementById("textPara4");
    
    //set initial paragraph value
    //objParas[0].setAttribute("value", storyParagraphs[0]);
    
    
    console.log("Retrieving Test ELEMENTS");
    //extractText()
    //let myText = retrieveStoryText('../story.json')
    //extracting.retrieveStoryText();
}


//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
function retrieveStoryText(){
  //Declare array variable for all extracted text

  function extractText(json)
  {
    if (!json) {
      return "";
    } else if (Array.isArray(json)) {
      return json.map(extractText).join("");
    } else if (json.type === "text") {
      let a = json.text;
      combinedText[combinedText.length]=a;
      return json.text;
    } else if (json.type === "object") {
      return json.sections.map(extractText).join("");
    } else if (json?.sections!==undefined) {
    // console.log("Detected Sections");
      //console.log(json.id);
      return json.sections.map(extractText).join("");
    } else if (json?.layers!==undefined) {
      //console.log(json.id);
      //console.log("Detected layers");
      switch(typeof(json.layers)===Array){
        case true:
          return json.layers.map(extractText).join("");

        case false:
          return extractText(json.layers);
      }
    } else if (json?.text!==undefined) {
      //console.log("Detected TEXT");
      return extractText(json.text);
    } else if (json?.items!==undefined) {
      //console.log("Detected items");
      //console.log(json.id);
      return json.items.map(extractText).join("");
    } else if (json?.content!==undefined) {
      //console.log("Detected Content");
      //console.log(json.id);
      return json.content.map(extractText).join("");
    } else if (json?.["1SuARv"]!==undefined) {    //JSON ITEM WITH ODD TITLE - HOW ADAPTIVE WILL THIS BE?
      //console.log("Detected [1SuARv]");
      return extractText(json["1SuARv"]);
    } else if (json?.title!==undefined) {
      //console.log("Detected title");
      return extractText(json.title);
    } else if (json?.storyTitle!==undefined) {
      //console.log("Detected storyTitle");
      return extractText(json.storyTitle);
    } else if (json?.byline!==undefined) {
      //console.log("Detected byline");
      return extractText(json.byline);
    } else if (json?.caption!==undefined) {
      //console.log("Detected caption");
      return extractText(json.caption);
    } else if (json?.xBTbQN!==undefined) {    //JSON ITEM WITH ODD TITLE - HOW ADAPTIVE WILL THIS BE?
      //console.log("Detected xBTbQN");
      return extractText(json.xBTbQN);
    } else if (json?.landscape!==undefined) {
      //console.log("Detected landscape");
      return extractText(json.landscape);
    } else {
      return "";
    }
  }



  //retrieveStoryText('../story.json')
  //Require the desired json file from the story
  const storyData = require('../story.json');

  //Run function to extract the data
  const combinedText =[];
  extractText(storyData)
  
               
  return combinedText;
}

const storyParagraphs=[];
fullText = retrieveStoryText();
for(i in fullText){
  storyParagraphs[i] = fullText[i];
  console.log(storyParagraphs[i]);
}

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
/*
Document.$console.log("Retrieving elements")

function extractText(){
    //Export story text from the JSON file
    console.log("Trying to retrieve story");
    myText = retrieveStoryText('../story.json')
    //console.log(myParagraphs);

    for(i in myText){
        storyParagraphs[i] = myText[i];
    }
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
    "version": "8fd085fcfeefd034aa8f9be36c9fa918",
    "isEnabled": true,
    "isPublic": true,
    "createdBy": null,
    "updatedBy": null,
    "deletedBy": null,
    "createdAt": "2017-06-15T03:36:21.796Z",
    "updatedAt": "2022-08-19T15:29:20.978Z",
    "currentVersion": 10390,
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
                            "text": "Various software programs are used to colour the drawings and simulate camera movement and effects."
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
                            "text": "The final animated piece is output to one of several delivery media, including traditional 35 mm film and newer media such as digital video. The \"look\" of traditional cel animation is still preserved, and the character animators' work has remained essentially the same over the past 70 years. Some animation producers have used the term \"tradigital\" to describe cel animation which makes extensive use of computer technology. Examples of traditionally animated feature films include Pinocchio (United States, 1940), Animal Farm (United Kingdom, 1954), and Akira (Japan, 1988). Traditional animated films which were produced with the aid of computer technology include The Lion King (US, 1994) Sen to Chihiro no Kamikakushi (Spirited Away) (Japan, 2001), and Les Triplettes de Belleville (France, 2003)."
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
                            "text": "In computer displays, filmmaking, television production, and other kinetic displays, scrolling is sliding text, images or video across a monitor or display, vertically or horizontally. \"Scrolling\", as such, does not change the layout of the text or pictures, but moves (pans or tilts) the user's view across what is apparently a larger image that is not wholly seen. A common television and movie special effect is to scroll credits, while leaving the background stationary. Scrolling may take place completely without user intervention (as in film credits) or, on an interactive device, be triggered by touchscreen or computer mouse motion or a keypress and continue without further intervention until a further user action, or be entirely controlled by input devices. Scrolling may take place in discrete increments (perhaps one or a few lines of text at a time), or continuously (smooth scrolling). Frame rate is the speed at which an entire image is redisplayed. It is related to scrolling in that changes to text and image position can only happen as often as the image can be redisplayed. When frame rate is a limiting factor, one smooth scrolling technique is to blur images during movement that would otherwise appear to \"jump\". The term scrolling is also used for a type of misbehavior in an online chat room whereby one person forces the screens of others in a chat to scroll by inserting much noise or special control characters."
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
                            "text": "Words from http://en.wikipedia.org/wiki/Animation and http://en.wikipedia.org/wiki/Scrolling."
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
                },
                {
                  "id": "YS1oac",
                  "kind": "image",
                  "link": {
                    "href": "",
                    "blank": false,
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "portrait": {
                    "image": {
                      "id": "yQ6btvrDnK",
                      "isUserDefined": false
                    },
                    "transition": {
                      "start": 0.5
                    }
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  },
                  "landscape": {
                    "image": {
                      "id": "MHpGn40WGF",
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
                      "start": 0.5
                    }
                  }
                },
                {
                  "id": "seo9aK",
                  "kind": "image",
                  "link": {
                    "href": "",
                    "blank": false,
                    "nofollow": false,
                    "noreferrer": true
                  },
                  "portrait": {
                    "image": {
                      "id": "9CEiLBVQCF",
                      "isUserDefined": false
                    },
                    "transition": {
                      "start": 0.75
                    }
                  },
                  "position": {
                    "x": "center",
                    "y": "center"
                  },
                  "landscape": {
                    "image": {
                      "id": "raIDUjaBQq",
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
                      "start": 0.75
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
      "id": "F3xIUerY1h",
      "template": "Sa33zbyRTr",
      "className": "Scrollpoints",
      "isNavigable": false,
      "settings": {
        "theme": "Dark",
        "overlay": 85,
        "className": null,
        "background": "",
        "visibilities": [
          "All devices",
          "Mobile only",
          "Desktop only"
        ],
        "backgroundOpacity": 10
      },
      "layers": [
        {
          "id": "QDLcmhWjSJ",
          "kind": "scrollpoints-text",
          "layers": {
            "qSHphYA8ua": {
              "id": "qSHphYA8ua",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "aIKiPLV9s4",
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
                            "text": "This is a Scrollpoints section."
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
                            "text": "It contains a single image that can have multiple 'points', highlighted via box or marker, with accompanying text."
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
                            "text": "The section moves to each point as you scroll, allowing you to bring attention to various details in the image."
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "column": 0,
              "isEmpty": false,
              "highlights": [
                {
                  "id": "5XtQIUqRvm",
                  "x": 60,
                  "y": 50,
                  "dotX": 68,
                  "dotY": 63,
                  "color": "Theme-ForegroundColor-0",
                  "width": 18,
                  "hasDot": false,
                  "height": 26,
                  "dotColor": "Theme-ForegroundColor-0",
                  "isHidden": false
                }
              ],
              "alignment": "left"
            },
            "X5cbNhOtNL": {
              "id": "X5cbNhOtNL",
              "kind": "text",
              "items": [
                {
                  "id": "UlLn5vwaUK",
                  "kind": "text-body",
                  "text": {
                    "id": "Ee2VjHOFED",
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
                            "text": "Elephant"
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "column": 1,
              "isEmpty": false,
              "highlights": [
                {
                  "id": "Q5d0VOq8At",
                  "x": 9.8,
                  "y": 35.2,
                  "dotX": 22.049999999999997,
                  "dotY": 47.150000000000006,
                  "color": "Theme-ForegroundColor-0",
                  "width": 24.499999999999996,
                  "hasDot": false,
                  "height": 23.9,
                  "dotColor": "Theme-ForegroundColor-0",
                  "isHidden": false
                },
                {
                  "id": "FnsUBx3uZv",
                  "x": 26.8,
                  "y": 30.8,
                  "width": 16.8,
                  "height": 4.099999999999998,
                  "isHidden": false,
                  "hasDot": false,
                  "dotX": 35.2,
                  "dotY": 32.85,
                  "color": "Theme-ForegroundColor-0",
                  "dotColor": "Theme-ForegroundColor-0"
                },
                {
                  "id": "qZgyT7zweH",
                  "x": 54.3,
                  "y": 19.9,
                  "width": 23.299999999999997,
                  "height": 30.9,
                  "isHidden": false,
                  "hasDot": false,
                  "dotX": 65.94999999999999,
                  "dotY": 35.349999999999994,
                  "color": "Theme-ForegroundColor-0",
                  "dotColor": "Theme-ForegroundColor-0"
                },
                {
                  "id": "ur6valf3dm",
                  "x": 25.3,
                  "y": 35.1,
                  "width": 22.400000000000002,
                  "height": 28.5,
                  "isHidden": false,
                  "hasDot": false,
                  "dotX": 36.5,
                  "dotY": 49.35,
                  "color": "Theme-ForegroundColor-0",
                  "dotColor": "Theme-ForegroundColor-0"
                }
              ],
              "alignment": "center"
            },
            "5ZEQLQEZmY": {
              "id": "5ZEQLQEZmY",
              "kind": "text",
              "items": [
                {
                  "kind": "text-body",
                  "text": {
                    "id": "afPzcljRHl",
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
                            "text": "A point with no defined highlight will show the entire uncropped image, like this."
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
                            "text": "To edit the section, simply upload an image and add, remove, or modify the existing highlights and text."
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "column": 1,
              "isEmpty": false,
              "highlights": [],
              "alignment": "center"
            }
          },
          "layerOrder": [
            "qSHphYA8ua",
            "X5cbNhOtNL",
            "5ZEQLQEZmY"
          ]
        },
        {
          "id": "hAoZo9F1Jf",
          "kind": "background-viewport",
          "items": [
            {
              "id": "3Yn9V1KyoL",
              "kind": "image",
              "link": {},
              "portrait": {
                "image": {
                  "id": "lGV1OG18Fc",
                  "isUserDefined": false
                },
                "altText": ""
              },
              "position": {
                "x": "center",
                "y": "center"
              },
              "landscape": {
                "image": {
                  "id": "lGV1OG18Fc",
                  "isUserDefined": false
                },
                "altText": ""
              }
            }
          ],
          "overlay": 0
        }
      ]
    }
  ],
  "sectionCount": 6,
  "logos": [],
  "showThemeLogos": true,
  "authors": null,
  "tags": [],
  "keywords": null,
  "status": "published",
  "contentVersion": 1144,
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
  "lastPublishedAt": "2022-08-17T11:16:00.443Z",
  "lastPublishedUrl": null,
  "lastPublishedVersion": 1136,
  "lastPublishedBy": "Ru4S9oEnSI",
  "createdBy": "Ru4S9oEnSI",
  "updatedBy": "tkx8W7cFIU",
  "deletedBy": null,
  "createdAt": "2022-03-31T23:48:14.502Z",
  "updatedAt": "2022-08-17T12:16:00.473Z",
  "deletedAt": null,
  "currentVersion": 1144,
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
  "generatedAt": "2022-08-20T02:45:27.541Z",
  "collections": [],
  "publishSettings": [],
  "isTestStory": false,
  "coverUrls": {
    "facebook": false,
    "twitter": false,
    "page": false
  }
}
},{}]},{},[1]);
