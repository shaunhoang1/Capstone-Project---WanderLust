const { response } = require('express');
const { array, string } = require('joi');

const storyData = require('./testData.json');
const combinedText =[];

function extractText(json)
{
  if (!json) {
    return "";
  } else if (Array.isArray(json)) {
    return json.map(extractText).join("");
  } else if (json.type === "text") {
    a = json.text;
    combinedText[combinedText.length]=a;
    return json.text;
  } else if (json.type === "object") {
    return json.sections.map(extractText).join("");
  } else if (json?.sections!==undefined) {
    console.log("Detected Sections");
    return json.sections.map(extractText).join("");
  } else if (json?.layers!==undefined) {
    console.log("Detected layers");
    return json.layers.map(extractText).join("");
  } else if (json?.items!==undefined) {
    console.log("Detected items");
    return json.items.map(extractText).join("");
  } else if (json?.content!==undefined) {
    console.log("Detected Content");
    return json.content.map(extractText).join("");
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
  } else if (json?.landscape!==undefined) {
    console.log("Detected landscape");
    return extractText(json.landscape);
  } else if (json?.text!==undefined) {
    console.log("Detected TEXT");
    if(typeof(json.text)===string)
    {
        
    }else if(json.text?.type==="doc"){
        return extractText(json.text);
    }
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

//storyData = require('./testData.json');