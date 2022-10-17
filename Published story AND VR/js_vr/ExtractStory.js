function retrieveStory(){
  //Declare array variable for all extracted text
  let inLine=false;
  let groupParagraph = false;
  let paragraphText = "";
  function newSection(json){
    combinedText[combinedText.length]="\"New Section\"";
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
        combinedText[combinedText.length]="\"(FONT:)"+json.attrs.fontSize+"\"";
      }
      extractStory(json.attrs, canvas);
    } 
    if (json?.subTitle!==undefined) {
      extractStory(json.subTitle, canvas);
    } 
    if (json?.content!==undefined) {
      if(json?.type==="paragraph" || json?.type==="subsubtitle"){
        console.log("Paragraph found");
        groupParagraph=true;
        json.content.map(extractStory).join("");
        combinedText[combinedText.length]="\""+paragraphText+"\"";
        paragraphText="";
        groupParagraph=false;
      }else{
        json.content.map(extractStory).join("");
      }
    } 
    if (json?.image!==undefined) {
      if(inLine){
        combinedText[combinedText.length]="\"(IMAGE-IN:)"+json.image.id+"\"";
      }else{
        combinedText[combinedText.length]="\"(IMAGE-BG:)"+json.image.id+"\"";
      }
    } 
    if (json?.audio!==undefined) {
      combinedText[combinedText.length]="\"(AUDIO---:)"+json.audio.id+"\"";
    } 
    if (json?.video!==undefined) {
      combinedText[combinedText.length]="\"(VIDEO---:)"+json.video.id+"\"";
    } 
    if (json?.object!==undefined) {
      combinedText[combinedText.length]="\"(OBJECT--:)"+json.object.id+"\"";
    } 
    if (json?.embed!==undefined) { //Extract video embed
      let embededObj=json.embed;
      //Cannot add embedded videos due to A-Frame legality restrictions
      //combinedText[combinedText.length]="\"(EMBED:)"+embededObj.originalUrl+"\"";
    } 
    if (json.type === "text") {
      let currentText = json.text;
      if (groupParagraph){paragraphText=paragraphText+currentText}else{
        combinedText[combinedText.length]="\""+currentText+"\"";
      }
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
  combinedText[combinedText.length]="\"The End.\"";
  combinedText[combinedText.length]="\"\"";
  combinedText[combinedText.length]="\"Did you enjoy the story?\"";
  combinedText[combinedText.length]="\"Press R to start from the beginning.\"";
               
  
  return combinedText
}
               

//myText = retrieveStoryText('./shorthand-wanderlust-project-Innsmouth/story.json');
let myText = []
myText = retrieveStory();


const fs = require('fs')

// Data which will write in a file.
let data = "\nstoryParagraphs = ["+myText.join(",")+"];\n";

// Write data in 'Output.txt' .
fs.appendFile('./js_vr/storyFunctions.js', data, (err) => {
	
	// In case of a error throw err.
	if (err) throw err;
})

for(i in myText){
  console.log(myText[i])
}
//console.log("Text: "+myText[0].length+myText[0]);
//console.log(myText[1]);
//console.log(myText[2]);

