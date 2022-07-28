//All JS Functions which are required to navigate through the story are created here

//WrapAround function to loop array variables, and can also change the variable which it is based on. Returns "True" or "False" in case additional functions depend on the wrap status
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
//Toggle Background
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
    objParas[0].setAttribute("animation__pos","property: position; from:0 -10 -20;to: 0 10 -20;                             dur:10000; easing: linear; loop: false;");
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
    objParas[0].setAttribute("value", storyParagraphs[0]);
}


//Define Story paragraphs dynamically from the author's pre-existing story paragraphs
//Currently just defines story paragraphs from input 
const storyParagraphs = [];
{
    
    storyParagraphs.push(allParas)
    /*
    storyParagraphs[0] = 
        "THIS IS THE FIRST PARAGRAPH, NO ONE WILL SEE THIS";
    storyParagraphs[1] =
        "1 Fable: Long ago in the Blue Mountains, three Aboriginal sisters; Meenhi, Wimlah and Gunnedoo lived with their father, a Witch doctor named Tyawan. In the same forest lived a gigantic creature that was feared by all – he was the Bunyip. Tyawan who knew where he lived would leave his daughters on the cliff behind a rocky wall where they would be safe while he would collect food.";
    storyParagraphs[2] =
        "2 One day, waving goodbye to his daughters he descended the cliff steps. On the top of the cliff, a big lizard suddenly appeared and frightened Meenhi. She picked up a stone and threw it at the lizard. The stone rolled away over the cliff and crashed into the valley below. Suddenly, the rocks behind the three sisters split open, leaving the sisters on a thin ledge. There was a deep rumble from below and the angry Bunyip emerged from his sleep. He looked up to see who had rudely awakened him and there perched on the thin ledge he saw the sisters cowering in fear. Furiously he lurched towards them.";
    storyParagraphs[3] =
        "3 In the valley, Tyawan heard the cry and looked up to see that the Bunyip had almost reached his daughters. Frantically the Witch Doctor pointed his magic bone at the girls and turned them into stone. They would be safe there until the Bunyip was gone and then Tyawan would return them to their former selves.";
    storyParagraphs[4] =
        "4 The Bunyip was even more angry when he saw what had happened and he turned on Tyawan and began to chase him. Running away, Tyawan found himself trapped against a rock which he could neither climb nor go around. He quickly changed into a Lyrebird and disappeared into a small cave. Everyone was safe but Tyawan had dropped his magic bone. The Bunyip returned angrily to his hole. Tyawan crept out of the cave and searched for the bone, and is still seeking it while the Three Sisters stand silently waiting, hoping he will find the bone and turn them back to their former selves. \n \n You can see the Three Sisters today from Echo Point and in the valley you can hear Tyawan, the Lyrebird, calling them as he searches for his lost magic bone.";
    storyParagraphs[5] =
        "5 Moral: The forests are beautiful, but you must always be careful to know what creatures live there.";*/

}

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