
const story = require('./../story.json')
const allParas = []


//Functions
function getPages(inputJSON = {x: 5,y: 6}){
    strJSON = JSON.stringify(inputJSON);
    console.log(strJSON)
    
    const seperator = '"type":"doc","';

    let pageArray = strJSON.split(seperator);
    console.log(pageArray)
    let pageCounter = 0;
    pageArray.forEach(page => {
        console.log(`Page ${pageCounter} has paragraphs:`)
        
        getParagraphs(page);
        pageCounter++;
    });
    
}

function getParagraphs(inputStr="demo string"){
    const re = /(.*)(?=","t)/;
    const seperator = '"text":"';
    
    let pageArray = inputStr.split(seperator);
    pageArray.forEach(element => {
        if (re.exec(element) != null){
            console.log(re.exec(element).toString())
        }
        
    });
    allParas.push(pageArray)
}

getPages(story)
console.log(allParas.length)