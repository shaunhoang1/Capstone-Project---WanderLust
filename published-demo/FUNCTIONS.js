const { response } = require('express');

data={
    "status": "SUCCESS",
    "status_message": "blah blah blah",
    "pri_tag": [
    {
        "tag_id": 1,
        "name": "Tag1"
    },
    {
        "tag_id": 2,
        "name": "Tag2"
    },
    {
        "tag_id": 3,
        "name": "Tag3"
    },
    {
        "tag_id": 4,
        "name": "Tag4"
    }
    ]
};


storyData = require('./testData.json');

console.log("parsing now");
let sections = storyData.sections;

for(var i in sections)
{
    let layers = sections[i].layers; 
    if (i==0){
        let items = layers[i].items; //Items[0] = title, Items[1] = Byline
        //retrieve story title
        storyTitle = items[0]["storyTitle"]["content"][0]["content"][0]["text"];
        console.log("Title: "+ storyTitle);
        storyTitle = items[0]["leadIn"]["content"][0]["content"][0]["text"];
        console.log("Lead In: "+ storyTitle);
        byLine = items[1]["byline"]["content"][0]["content"][0]["text"];
        console.log("ByLine: "+ byLine);
    }else{
        currentText= layers[0].items[0]["title"]["content"][0]["content"][0]["text"];
        console.log("Text: "+ currentText);
    }
    
    
    
}
