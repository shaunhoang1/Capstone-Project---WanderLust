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
    } else if (json?.video!==undefined) {
      combinedText[combinedText.length]="VIDEO:"+json.video.id;
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
    } else if (json?.text!==undefined) {
      return extractText(json.text);
    } else if (json?.layers!==undefined) {
      for(i in json.layers){  //Extra filter finds layerOrder to extract specific layerID's
        let layerObj = json.layers[i];
        console.log(layerObj.id)
        if (layerObj?.layerOrder!==undefined) {
          let extractedLayers = []
          for(let j in layerObj.layerOrder){
            let layerJSON = layerObj.layers[layerObj.layerOrder[j]];
            extractedLayers[extractedLayers.length]=extractText(layerJSON);
          }
          //return extractedLayers.join("");
          return json.layers.map(extractText).join("");
        }
      }
      return extractText(json.layers);  //Runs on single layer object if no layerOrder
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
      console.log("image found")
      myIMG[myIMG.length]=combinedText[i];
    }else if(combinedText[i].includes("VIDEO")){
      console.log("VIDEO found")
      myIMG[myIMG.length]=combinedText[i];
    }
  }
               
  const imgArray=["/assets/5HECXqtPRY/ticketoffice-1080x1920.jpeg","/assets/bcoIi7gXby/town-846x1349.jpeg","/assets/D3h9QGqI9v/town-1080x1920.jpeg","/assets/iMitwH0EXu/bus-1080x1920.jpeg","/assets/JqXBwRBR7R/store-863x1368.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-thumbnail.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-thumbnail.jpeg","/assets/NETXgllPkN/railwaystation-852x1406.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sfv2bWQrhq/dream_tradingcard-857x1376.jpeg",,"/assets/uhD9A6h3Vo/staring-1080x1920.jpeg","/assets/X0OgcjeEUe/busdring-1080x1920.jpeg","/assets/yp0f2XkDCi/poster-1590x894.jpeg"]
  return [combinedText, myIMG, imgArray];
}

               

//myText = retrieveStoryText('./shorthand-wanderlust-project-Innsmouth/story.json');
let myText = []
myText = retrieveStoryText();
console.log("Text: "+myText[0].length+myText[0]);
console.log(myText[1]);
console.log(myText[2]);

