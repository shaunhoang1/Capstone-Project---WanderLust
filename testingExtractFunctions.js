const { response } = require('express');
const { array, string } = require('joi');


//const storyData = require('./testData.json');
const storyData = require('./shorthand-wanderlust-project-Innsmouth/story.json');
const combinedText =[];

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
    console.log("Detected Sections");
    console.log(json.id);
    return json.sections.map(extractText).join("");
  } else if (json?.layers!==undefined) {
    console.log(json.id);
    console.log("Detected layers");
    console.log(json.id);
    switch(typeof(json.layers)===Array){
      case true:
        return json.layers.map(extractText).join("");

      case false:
        return extractText(json.layers);
    }
    
  } else if (json?.text!==undefined) {
    console.log("Detected TEXT");
    return extractText(json.text);
  } else if (json?.items!==undefined) {
    console.log("Detected items");
    console.log(json.id);
    return json.items.map(extractText).join("");
  } else if (json?.content!==undefined) {
    console.log("Detected Content");
    console.log(json.id);
    return json.content.map(extractText).join("");
  } else if (json?.["1SuARv"]!==undefined) {
    console.log("Detected [1SuARv]");
    console.log(json["1SuARv"]);
    return extractText(json["1SuARv"]);
  } else if (json?.title!==undefined) {
    console.log("Detected title");
    return extractText(json.title);
  } else if (json?.storyTitle!==undefined) {
    console.log("Detected storyTitle");
    return extractText(json.storyTitle);
  } else if (json?.byline!==undefined) {
    console.log("Detected byline");
    return extractText(json.byline);
  } else if (json?.caption!==undefined) {
    console.log("Detected caption");
    return extractText(json.caption);
  } else if (json?.xBTbQN!==undefined) {
    console.log("Detected xBTbQN");
    return extractText(json.xBTbQN);
  } else if (json?.landscape!==undefined) {
    console.log("Detected landscape");
    return extractText(json.landscape);
  } else {
    return "";
  }
}




console.log(extractText(storyData));

console.log("Found text elements:" + combinedText.length);
for(i in combinedText)
{
    console.log("item "+i+": "+combinedText[i]);
}
