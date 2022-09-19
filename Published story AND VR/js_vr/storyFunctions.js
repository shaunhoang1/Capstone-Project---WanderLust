//const { string } = require("joi");

let objParas = "";
let storyParagraphs=[];
let movingPictures=[];
let movingObjects=[];
let imgRepo=[];
let objSky = "";
let elementDelete = [];
let sectionImages = []; //Initiate the Array of images for the new section
  let sectionObjects = []; //Initiate the Array of Objects for the new section
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

//All JS Functions which are required to navigate through the story are created here
//Manually scroll through paragraphs with "i" or "k"
document.addEventListener("keydown", function (event) {
    //Scroll through paragraphs  
    //Scroll up        
    if (event.key === "i"){
      changePage(0);
      //add to scroll
      scrollingHeight= objParas.object3D.position.y+10+1;

      //If greater than or equal to maximum height, reset for next section
      var wrapCheck = wrapAround(scrollingHeight,0,20);
      if (wrapCheck[0]) {
          scrollingHeight = wrapCheck[1];
          console.log("Loading Next section");
          changePage(1);

          //Reset the Position 
          objParas.setAttribute("opacity", 1);
          objParas.setAttribute("position","0 -10 -20"); 
      }

      //Remove existing animations
      objParas.removeAttribute("animation__pos");

      objParas.object3D.position.y = -10+scrollingHeight;
      setOpacity();

    //Scroll Down
    } else if (event.key === "k") {
      scrollingHeight = objParas.object3D.position.y+10;
      //subtract from scroll
      scrollingHeight= scrollingHeight-0.2;
      //If less than or equal to min height, reset for previous section      
      var wrapCheck = wrapAround(scrollingHeight,0,20);
      if (wrapCheck[0]) {
        scrollingHeight = wrapCheck[1];
        console.log("Loading Previous section");
        changePage(-1);

        //Reset  the Position
        objParas.setAttribute("opacity", 1);
        objParas.setAttribute("position","0 10 -20");  
      }           

      //Remove existing animations
      objParas.removeAttribute("animation__pos");

      objParas.object3D.position.y = -10+scrollingHeight;
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
  for(i in movingPictures){
    let elID = "movingPicture"+i;
    let elmnt = document.getElementById(elID);
    elmnt.setAttribute("animation__opa","property: opacity; from:1;to: 0; dur:100; easing: linear; loop: false;");
    elementDelete.push(elID)
  }
  for(i in movingObjects){
    let elID = "movingObj"+i;
    let elmnt = document.getElementById(elID);
    elmnt.setAttribute("animation__scale","property: scale; from:0.06 0.06 0.06;to: 0 0 0; dur:100; easing: linear; loop: false;");
    elementDelete.push(elID)
  }
  setTimeout(deleteSectionMedia,100);
  
}
    
//Control the opacity of paragraphs as they change height
function setOpacity(){
  let textTarget = objParas;
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

//Start on-going timer to set moving text & image opacity
setInterval(setOpacity,100);

//Initialize all text from the story JSON.
function importStory(){
  iniParagraphObjects(); //Initialize the html text objects
  //retrieveStoryAssets = retrieveStory(); //retrieve the story from the json
 
  storyParagraphs.unshift("New Section");
  currentPage=0;currentSky = 0; //Initialize New State of story
  changePage(1); //Begin story
}
setTimeout(importStory,10); //Required to begin the story

//Navigate to next/previous skybox image
function changeSky(skyChange) {
  currentSky = wrapAround(currentSky + skyChange,1,skies.length-1)[1];
  objSky.removeAttribute("animation__opa");
  objSky.setAttribute("animation__opa","property: opacity; from:1;to: 0; dur:200; easing: linear; loop: false;");
  setTimeout(setSkyFadeIn,200);
}
function setSkyFadeIn(){
  objSky.removeAttribute("animation__opa");
  objSky.setAttribute("src", skies[currentSky]);
  objSky.setAttribute("animation__opa","property: opacity; from:0;to: 1; dur:300; easing: linear; loop: false;");

}
    
//Create all the images for the current section
function createImages(imageNums){
    //Clear previous sections images

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
    img.setAttribute("animation__opa","property: opacity; from:0;to: 1; dur:100; easing: linear; loop: false;");
  }
}

function createObjects(objNums){
  //Clear previous sections images
  //deleteMovingImage();
  for(i in objNums){ //For each image in this section
    //Check how many pictures there are
    let objCount=movingObjects.length;
    
    //Create the new HTML Element for the picture
    let obj = document.createElement("a-entity");
    obj.setAttribute("id","movingObj"+objCount);
    let src ="";
    for(j in imgRepo){ //Find the image file for the current image
      if(imgRepo[j].includes(objNums[i])){
        src=imgRepo[j]
      }
    }
    obj.setAttribute("obj-model", "obj: "+src);
    obj.setAttribute("color", "#00FF00");
    obj.setAttribute("scale", "0 0 0");
    obj.setAttribute("position", "-3.1 0 2");

    movingObjects[objCount]=objCount;
    
    //Create the image element
    //let element = document.getElementById("textPara");
    let element = document.getElementById("objectParent");
    element.appendChild(obj); 
    obj.removeAttribute("animation__sca");
      //ANIMATION ATTRIBUTE FOR BACKGROUND IMAGES TO FADE IN
    obj.setAttribute("animation__sca","property: scale; from:0 0 0;to: 0.06 0.06 0.06; dur:100; easing: linear; loop: false;");
  }
}

//Delete all pictures
function deleteSectionMedia(){
  for(i in elementDelete){
    
    console.log(elementDelete[i])
    let elmnt = document.getElementById(elementDelete[i]);
    elmnt.remove();
  }
  elementDelete=[];
  movingPictures=[];
  movingObjects=[];
  sectionimages=[];
  sectionObjects=[];
  
  let tempImageNum = currentPage; //Temp integer at current page to navigate through all story components in this section
  let sectionFound=false; //Boolean to check when the section ends
  let currentText=""; //Str var for all the text in this section
    
  //Run until the end of section
  while(!sectionFound){
    if(storyParagraphs[tempImageNum].includes("New Section")){
        //If next section found, end the search
        sectionFound=true;
    }else if(storyParagraphs[tempImageNum].includes("(IMAGE-") || storyParagraphs[tempImageNum].includes("(VIDEO-")){
      //If an image or video is found, then push them to the image array for loading
      sectionImages.push(storyParagraphs[tempImageNum].slice(11))
    }else if(storyParagraphs[tempImageNum].includes("(OBJECT-")){
      //If an image or video is found, then push them to the image array for loading
      sectionObjects.push(storyParagraphs[tempImageNum].slice(11))
    }else{  
        //Otherwise add the current text to the section text var
      currentText=currentText+storyParagraphs[tempImageNum]+"\n\n";
    }
      
      //check up to the next story component
    tempImageNum=tempImageNum+1;
    if(tempImageNum>storyParagraphs.length-1){sectionFound=true;} //If last story component, then mark end of section
  }
    
  //Set the text object value to the current section's text
  objParas.setAttribute("value", currentText);
  //Create all images for the current section
  createImages(sectionImages);
  createObjects(sectionObjects);
}


//Define the page number and change
function changePage(pageChange) {
    //Delete Current page properties
    objParas.removeAttribute("animation__pos");
    objParas.setAttribute("value", "");
    objParas.setAttribute("opacity",0);

    currentPage = wrapAround(currentPage+pageChange,1, storyParagraphs.length - 1)[1];
    if(storyParagraphs[currentPage]==="New Section"){
      nextSection(pageChange);
    }else if(storyParagraphs[currentPage-1]!=="New Section"){
      changePage(pageChange);
    }else{
      //Update paragraph text value
      objParas.setAttribute("Opacity", 0);
      //console.log(currentPage-1+": "+storyParagraphs[currentPage]);
      //Reset and activate the Position animation
      objParas.removeAttribute("animation__pos");
      objParas.setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20; dur:10000; easing: linear; loop: false;");
      if(!storyParagraphs[currentPage].includes("IMAGE:")){
        //Commented out, trialing setting Block paragraph value
        //objParas.setAttribute("value", storyParagraphs[currentPage]);
      }else{
          objParas.setAttribute("value", "");
          if(storyParagraphs[currentPage-1].includes("IMAGE:")){
            changePage(1);
          }
      }
        
    }
}

//define all paragraph objects
function iniParagraphObjects(){
    objParas=document.getElementById("textPara");
    objSky = document.getElementById("sky");
}
/*
//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
function retrieveStory(){
  //Declare array variable for all extracted text
  let inLine=false;
  function newSection(json){
    combinedText[combinedText.length]="New Section";
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
        combinedText[combinedText.length]="(FONT:)"+json.attrs.fontSize;
      }
      extractStory(json.attrs, canvas);
    } 
    if (json?.subTitle!==undefined) {
      extractStory(json.subTitle, canvas);
    } 
    if (json?.content!==undefined) {
      json.content.map(extractStory).join("");
    } 
    if (json?.image!==undefined) {
      if(inLine){
        combinedText[combinedText.length]="(IMAGE-IN:)"+json.image.id;
      }else{
        combinedText[combinedText.length]="(IMAGE-BG:)"+json.image.id;
      }
    } 
    if (json?.video!==undefined) {
      combinedText[combinedText.length]="(VIDEO---:)"+json.video.id;
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
  combinedText[combinedText.length]="FinalPara";
               
  const imgArray=["/assets/5HECXqtPRY/ticketoffice-1080x1920.jpeg","/assets/bcoIi7gXby/town-846x1349.jpeg","/assets/D3h9QGqI9v/town-1080x1920.jpeg","/assets/iMitwH0EXu/bus-1080x1920.jpeg","/assets/JqXBwRBR7R/store-863x1368.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-thumbnail.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-thumbnail.jpeg","/assets/NETXgllPkN/railwaystation-852x1406.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sfv2bWQrhq/dream_tradingcard-857x1376.jpeg",,"/assets/uhD9A6h3Vo/staring-1080x1920.jpeg","/assets/X0OgcjeEUe/busdring-1080x1920.jpeg","/assets/yp0f2XkDCi/poster-1590x894.jpeg"]
  return [combinedText, imgArray];
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
               


imgRepo = ["/assets/5HECXqtPRY/ticketoffice-1065x1893.jpeg","/assets/bcoIi7gXby/town-750x1196.jpeg","/assets/D3h9QGqI9v/town-1062x1888.jpeg","/assets/iMitwH0EXu/bus-1067x1897.jpeg","/assets/JqXBwRBR7R/store-750x1189.jpeg","/assets/KehrQ0yKcs/uvcewi30dwtkdrukfi4b-512x512.jpeg","/assets/MObpieZw3w/wzkp1rhpuznb2ozzmat6-1-sxv3v-512x512.jpeg","/assets/NETXgllPkN/railwaystation-750x1238.jpeg","/assets/PYj71zvsAD/cthulhu.mp4","/assets/sfv2bWQrhq/dream_tradingcard-750x1204.jpeg","/assets/testObject/testObj.obj","/assets/testObject2/TrainStation_pp1_3.mtl","/assets/testObject2/TrainStation_pp1_3.obj","/assets/uhD9A6h3Vo/staring-1064x1892.jpeg","/assets/X0OgcjeEUe/busdring-1060x1884.jpeg","/assets/yp0f2XkDCi/poster-1210x681.jpeg"]
storyParagraphs = ["New Section","(FONT:)xxxlarge","Lost in Innsmouth","(FONT:)xxsmall","Shorthand-WanderLust Project:","By WanderLust","(OBJECT--:)testObject","(IMAGE-BG:)D3h9QGqI9v","Photo by ","Scott Webb"," on ","Unsplash","New Section","(VIDEO---:)PYj71zvsAD","(OBJECT--:)testObject2","New Section","I'm afraid I wouldn't care about any uninteresting urban tales if I hadn't seen them with my own eyes, nor would I recognise this town that I couldn't find on a map. ","The year was 1846, and the weather appeared colder than usual.","I had recently graduated from university and was on my way to the railway station to purchase a train ticket to my hometown to see my grandfather and grandma, whom I hadn't seen in a long time.","However, I was interrupted by an extraordinarily pricey railway ticket.","I remained in front of the ticket office for a long time, staring at the train timetable and hesitating, until the conductor, realising that I had no money, led me to another cheaper and more practicable option: take the bus across the street to Innsmouth.","Then, board the bus from Innsmouth to my final destination."," Innsmouth is now merely a backwards community that relies on fishing for a living due to a lack of information and access to railways. ","According to folklore, the locals there worship evil gods and will occasionally summon demons from hell to devour passing visitors.","It is not advisable to spend the night there. My concerns about the odd town I was about to see were eased by the conductor's explanation.","(OBJECT--:)testObject","(OBJECT--:)testObject","(IMAGE-BG:)NETXgllPkN","(IMAGE-BG:)5HECXqtPRY","(IMAGE-BG:)iMitwH0EXu","New Section","(OBJECT--:)testObject","(FONT:)xxsmall","(FONT:)xxxsmall","I took the bus to town, and nothing unusual happened with the exception of the driver's weird expression. The bus arrived in Innsmouth, a town covered in thick haze, just after I had endured the bumps for hours.","(FONT:)small","(IMAGE-BG:)X0OgcjeEUe","New Section","(FONT:)xxsmall","(FONT:)xxxsmall","A bizarre but solemn ancient building drew my attention, but whether it was the aura or the curiously dressed people at the door, it was clear that it was the gathering place of the wicked gods. The dark mood made me afraid to explore anymore, and the bus eventually brought me to the comparatively rich side of town.","(FONT:)small","(IMAGE-BG:)uhD9A6h3Vo","New Section","The bus soon came to a halt, and I dashed off to attempt to alleviate the discomfort of the journey, but the stink in the air didn't help much. Dilapidated wooden dwellings, a row of houses crammed together without regard for norms, even the town centre is sparsely populated.","(OBJECT--:)testObject","With a few hours before the bus left again, I dropped by the local grocery store out of boredom and curiosity, hoping to learn anything valuable. As soon as I stepped in, I was drawn to a golden shimmering ring placed on the store's counter, which seemed out of place in comparison to the rest of the store.","I first asked the shopkeeper for information about the town, but he gave me a very impatient look as if to warn me not to ask any further questions about the topic until I bought the ring, and at the same time he looked at me maliciously.","That ring piqued my interest in an unusual way. It was a gold-bordered ring with a green stone inlay in it. The pattern carved on the stone was bizarre, like a half-human, half-fish monster. I dimly remembered seeing a similar design before. I was unsure about purchasing this ring.","The owner of the shop told me the story of this town with a half-smile. A hundred years ago, this town lived on the port trade. At that time, it was still a vibrant town. However, the good times did not last long. The town was quickly dragged down by the ensuing war. Many people lost their livelihood jobs. It's all ruined.","However, this scene didn't last long when an ship sailed toward the town. The captain told everyone in the town that he knew a true god, and as long as everyone was willing to follow him, Innsmouth would prosper. From then on, the town seemed to come alive, with schools of fish flocking to the town and smoke from the factory chimneys. However, every night the residents of the town mysteriously disappear.","Finally, on a stormy night, the bizarre events are revealed by the half-man, half-fish creatures that keep emerging from the shoreline. It turned out that the captain and his followers were constantly sacrificing residents to those monsters in exchange for various resources. Since then, there have been many mixed species of humans and fish in the town.","Such people don't show obvious features at first, but around the age of 20 they start to lose their hair and gradually become half human and half fish. I hear a chill in my heart here. I subconsciously looked at my watch, it was time to get on the departing bus.","(IMAGE-IN:)bcoIi7gXby","(IMAGE-IN:)JqXBwRBR7R","New Section","(FONT:)xxxsmall","I subconsciously looked at my watch, it was time to get on the departing bus.","(FONT:)xxxsmall","(FONT:)small","(IMAGE-BG:)MObpieZw3w","New Section","(IMAGE-IN:)sfv2bWQrhq","(IMAGE-IN:)KehrQ0yKcs","The driver told me that the car was broken and I'm afraid I won't be able to go anywhere tonight. In desperation, I had to rent a hotel to spend the night in this town."," I lay in bed staring at the ring in a daze and soon fell into a dream. It was a strange dream. In the dream, I actually swam unimpeded in the deep sea. There was a green stone statue on the seabed. The shape was very similar to the pattern on the ring.","Suddenly, I was awakened by the sound of thunder and rain outside the window. I looked out the window, and a scene I will never forget happened, just as the shopkeeper described, countless half-human, half-fish creatures crawled out of the water and headed towards the town.","New Section"," I rushed out of the hotel and ran without looking back, and finally fell on the muddy ground and passed out. In the morning I woke up in the pub in the town, I quickly boarded the bus to my hometown, and everything was calm as if everything that happened last night was a dream.","(EMBED:)https://www.youtube.com/watch?v=JyXEwn6QNhc"," Arriving at my grandparents' house, the strange face in my grandmother's portrait brought back memories of all the weird things I've been through lately. Everything seemed to portend something, Innsmouth, the cult, the god, the strange pattern on the ring and the face of the grandmother. With my hair falling out because I stayed up all night thinking, there was only one thought in my mind, I had to go back to that town no matter what.","(EMBED:)https://www.youtube.com/watch?v=Rxh_SVtyZqo","FinalPara"];
