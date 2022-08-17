const { response } = require('express');

storyData = require('./testData.json');

console.log("parsing now");
let sections = storyData.sections;

for(var i in sections)
{
    let layers = sections[i].layers; 
    if (i==0){
        if (layers?.content!=="")
        {

        }
        console.log("Section: " + i);
        let items = layers[i].items; //Items[0] = title, Items[1] = Byline
        //retrieve story title
        storyTitle = items[0]["storyTitle"]["content"][0]["content"][0]["text"];
        console.log("Title: "+ storyTitle);
        storyTitle = items[0]["leadIn"]["content"][0]["content"][0]["text"];
        console.log("Lead In: "+ storyTitle);
        byLine = items[1]["byline"]["content"][0]["content"][0]["text"];
        console.log("ByLine: "+ byLine);
    }else{
        //Filter through standard paragraphs
        for(var j in layers)
        {
            console.log("Section: " + i);
            console.log("Layer: "+j+", ID: "+layers[j].id);
            console.log(typeof(layers[j].items))
            if(typeof(layers[j].items)!='undefined'){
                layerItems = layers[j].items;
                if(layerItems[0]["title"]!=undefined)
                {
                    currentText= layerItems[0]["title"]["content"][0]["content"][0]["text"];
                    console.log("Text: "+ currentText);
                }
                
            }else if(typeof(layers[j].layers)!='undefined'){

            }
            
        }

        //Filter through Scrollytelling paragraphs
        

        //Filter through 
    }
    
    
    
}
