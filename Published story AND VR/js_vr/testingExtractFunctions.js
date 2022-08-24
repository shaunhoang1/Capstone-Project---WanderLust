//Import required functions for script
//const { response } = require('express');
//const { array, string } = require('joi');

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
      return json.sections.map(extractText).join("");
    } else if (json?.layers!==undefined) {
      switch(typeof(json.layers)===Array){
        case true:
          return json.layers.map(extractText).join("");

        case false:
          return extractText(json.layers);
      }
    } else if (json?.text!==undefined) {
      return extractText(json.text);
    } else if (json?.items!==undefined) {
      return json.items.map(extractText).join("");
    } else if (json?.content!==undefined) {
      return json.content.map(extractText).join("");
    } else if (json?.["1SuARv"]!==undefined) { 
      return extractText(json["1SuARv"]);
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
    } else if (json?.xBTbQN!==undefined) {  
      return extractText(json.xBTbQN);
    } else if (json?.landscape!==undefined) {
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
  console.log(typeof(myArray));
  console.log(typeof(combinedText));
  extractText(storyData)
  for(i in combinedText){
    console.log("Found text elements:" + combinedText[i]);
  }
  
  for(i in combinedText){
    //storyParagraphs[i] = combinedText[i];
  }
               
  return combinedText;
}
               

//myText = retrieveStoryText('./shorthand-wanderlust-project-Innsmouth/story.json');
myText = retrieveStoryText('../story.json');
for(i in myText)
{
    console.log("item "+i+": "+myText[i]);

}
