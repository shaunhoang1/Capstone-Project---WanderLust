//Import required functions for script
//const { response } = require('express');
//const { array, string } = require('joi');

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
  for(i in combinedText){
    //console.log("Found text elements:" + combinedText[i]);
  }

  return combinedText;
}
               

//myText = retrieveStoryText('./shorthand-wanderlust-project-Innsmouth/story.json');
myText = retrieveStoryText('../story.json');
for(i in myText)
{
    console.log("item "+i+": "+myText[i]);

}
