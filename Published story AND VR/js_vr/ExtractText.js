function retrieveStoryText(){
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
      toExtract[toExtract.length]= extractText(json.attrs);
    } 
    if (json?.subTitle!==undefined) {
      toExtract[toExtract.length]=extractText(json.subTitle);
    } 
    if (json?.content!==undefined) {
      toExtract[toExtract.length]= json.content.map(extractText).join("");
    } 
    if (json?.image!==undefined) {
      combinedText[combinedText.length]="(IMAGE:)"+json.image.id;
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
      toExtract[toExtract.length]= json.sections.map(newSection).join("");
    } 
    if (json?.text!==undefined) {
      toExtract[toExtract.length]= extractText(json.text);
    } 
    if (json?.items!==undefined) {
      toExtract[toExtract.length]=json.items.map(extractText).join("");
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
      toExtract[toExtract.length]= extractText(json.layers);  //Runs on single layer object if no layerOrder
    } 
    if (json?.item!==undefined) {
      toExtract[toExtract.length]= extractText(json.item);
    } 
    if (json?.title!==undefined) {
      toExtract[toExtract.length]=extractText(json.title);
    } 
    if (json?.leadIn!==undefined) {
      toExtract[toExtract.length]=extractText(json.leadIn);
    } 
    if (json?.storyTitle!==undefined) {
      toExtract[toExtract.length]= extractText(json.storyTitle);
    } 
    if (json?.byline!==undefined) {
      toExtract[toExtract.length]= extractText(json.byline);
    } 
    if (json?.caption!==undefined) {
      toExtract[toExtract.length]= extractText(json.caption);
    } 
    if (json?.landscape!==undefined) {
      toExtract[toExtract.length]= extractText(json.landscape);
    } 
    
    if (Array.isArray(json)) {
      toExtract[toExtract.length]= json.map(extractText).join("");
    }else {
      toExtract[toExtract.length]= "";
    }
  }

  /*
  function extractText(json){
    let toExtract = [];
    if (!json) {
      return "";
    }  
    if (json?.attrs!==undefined) { 
      let attributes = json.attrs;
      if (attributes?.fontSize!==undefined){
        //console.log("Attribute found")
      }
      extractText(json.attrs);
    } 
    if (json?.subTitle!==undefined) {
      extractText(json.subTitle);
    } 
    if (json?.content!==undefined) {
      if(json.type=="doc"){
        paraCounter=paraCounter+1;
        combinedText[combinedText.length]=[];
      }
      json.content.map(extractText).join("");
    } 
    if (json?.image!==undefined) {
      combinedText[paraCounter][combinedText[paraCounter].length]="IMAGE:"+json.image.id;
    } 
    if (json?.video!==undefined) {
      combinedText[paraCounter][combinedText[paraCounter].length]="VIDEO:"+json.video.id;
    } 
    if (json?.embed!==undefined) { //Extract video embed
      let embededObj=json.embed;
      combinedText[paraCounter][combinedText[paraCounter].length]="EMBED:"+embededObj.originalUrl;
    } 
    if (json.type === "text") {
      let a = json.text;
      //console.log("Text Found")
      combinedText[paraCounter][combinedText[paraCounter].length]=a;
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
  }*/

  //retrieveStoryText('../story.json')
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

               

//myText = retrieveStoryText('./shorthand-wanderlust-project-Innsmouth/story.json');
let myText = []
myText = retrieveStoryText();
for(i in myText[0]){
  console.log(myText[0][i])
}
//console.log("Text: "+myText[0].length+myText[0]);
console.log(myText[1]);
console.log(myText[2]);

