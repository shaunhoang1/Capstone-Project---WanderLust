

let numNext=0;
let numBack=0;
let templateHTML="<!DOCTYPE html>\n<html>\n<head>\n<title>Link Test</title>\n<!-- Load A-Frame and additional components -->\n<script src=\"https://aframe.io/releases/1.3.0/aframe.min.js\"></script>\n<script src=\"https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js\"></script>\n<script>\ndocument.addEventListener(\"keydown\", function (event) {\nif (event.key === \"e\"){\nwindow.location = document.getElementById(\"next\").getAttribute(\"href\")\n}\nif (event.key === \"q\"){\nwindow.location = document.getElementById(\"back\").getAttribute(\"href\")\n}\n})\n</script>\n</head>\n\n  <body>\n<!-- HTML Elements to create a page before scene   embedded style=\"height:100px;width:100px;\" z-index=-10000 -->\n<a-scene>\n\n<a-assets>\n"
let myArray=[]
let strSkyboxes="";
let groupedParas=[];

function createPages(){
    for(i in groupedParas){
        let tempImg= `<img id=\"world${i}\" src=\"../assets/S1${i%3}.png\">\n`
        strSkyboxes=strSkyboxes+tempImg;
        myArray[i]=i;
    }
    strSkyboxes=strSkyboxes+"</a-assets>";
    let num = 0;
    for(i in groupedParas){
        numNext=parseInt(myArray[i])+parseInt("1");
        numBack=myArray[i]-1;
        if (numBack<1){
            numBack=groupedParas.length-1;
        }
        if (numNext>=groupedParas.length){
            numNext=1;
        }
        
        let strElText=`<a-text value="${groupedParas[i]}" position="-1 0 -15"></a-text>`
        let strElSky=`<a-sky src="#world${i}"></a-sky>`;
        let strElNext=`<a-link id=\"next\" href=\"index${numNext}.html\" title=\"Next Page\" image=\"#world${numNext}\" position=\"10 0 -10\" scale=\"3 3 3\"></a-link>`;
        let strElBack=`<a-link id=\"back\" href=\"index${numBack}.html\" title=\"Previous Page\" image=\"#world${numBack}\" position=\"-10 0 -10\" scale=\"3 3 3\"></a-link>`;
        ///console.log(strElSky);
        ///console.log(strElNext);
        //console.log(strElBack);


        const fs = require('fs');

        // Data which will write in a file.
        let data = templateHTML+strSkyboxes+"\n"+strElText+"\n"+strElSky+"\n"+strElNext+"\n"+strElBack+"\n</a-scene>\n</body>\n</html>";
        
        // Write data in 'Output.txt' .w
        fs.writeFile('./pages/index'+myArray[i]+'.html', data, (err) => {
            
            // In case of a error throw err.
            if (err) throw err;
        })
    }
}
groupedParas = ["","(FONT:)xxxlarge\nLost in Innsmouth\n(FONT:)xxsmall\nShorthand-WanderLust Project:\nBy WanderLust\nPhoto by \nScott Webb\n on \nUnsplash\n","","I'm afraid I wouldn't care about any uninteresting urban tales if I hadn't seen them with my own eyes, nor would I recognise this town that I couldn't find on a map. \nThe year was 1846, and the weather appeared colder than usual.\nI had recently graduated from university and was on my way to the railway station to purchase a train ticket to my hometown to see my grandfather and grandma, whom I hadn't seen in a long time.\nHowever, I was interrupted by an extraordinarily pricey railway ticket.\nI remained in front of the ticket office for a long time, staring at the train timetable and hesitating, until the conductor, realising that I had no money, led me to another cheaper and more practicable option: take the bus across the street to Innsmouth.\nThen, board the bus from Innsmouth to my final destination.\n Innsmouth is now merely a backwards community that relies on fishing for a living due to a lack of information and access to railways. \nAccording to folklore, the locals there worship evil gods and will occasionally summon demons from hell to devour passing visitors.\nIt is not advisable to spend the night there. My concerns about the odd town I was about to see were eased by the conductor's explanation.\n","(FONT:)xxsmall\n(FONT:)xxxsmall\nI took the bus to town, and nothing unusual happened with the exception of the driver's weird expression. The bus arrived in Innsmouth, a town covered in thick haze, just after I had endured the bumps for hours.\n(FONT:)small\n","(FONT:)xxsmall\n(FONT:)xxxsmall\nA bizarre but solemn ancient building drew my attention, but whether it was the aura or the curiously dressed people at the door, it was clear that it was the gathering place of the wicked gods. The dark mood made me afraid to explore anymore, and the bus eventually brought me to the comparatively rich side of town.\n(FONT:)small\n","The bus soon came to a halt, and I dashed off to attempt to alleviate the discomfort of the journey, but the stink in the air didn't help much. Dilapidated wooden dwellings, a row of houses crammed together without regard for norms, even the town centre is sparsely populated.\nWith a few hours before the bus left again, I dropped by the local grocery store out of boredom and curiosity, hoping to learn anything valuable. As soon as I stepped in, I was drawn to a golden shimmering ring placed on the store's counter, which seemed out of place in comparison to the rest of the store.\nI first asked the shopkeeper for information about the town, but he gave me a very impatient look as if to warn me not to ask any further questions about the topic until I bought the ring, and at the same time he looked at me maliciously.\nThat ring piqued my interest in an unusual way. It was a gold-bordered ring with a green stone inlay in it. The pattern carved on the stone was bizarre, like a half-human, half-fish monster. I dimly remembered seeing a similar design before. I was unsure about purchasing this ring.\nThe owner of the shop told me the story of this town with a half-smile. A hundred years ago, this town lived on the port trade. At that time, it was still a vibrant town. However, the good times did not last long. The town was quickly dragged down by the ensuing war. Many people lost their livelihood jobs. It's all ruined.\nHowever, this scene didn't last long when an ship sailed toward the town. The captain told everyone in the town that he knew a true god, and as long as everyone was willing to follow him, Innsmouth would prosper. From then on, the town seemed to come alive, with schools of fish flocking to the town and smoke from the factory chimneys. However, every night the residents of the town mysteriously disappear.\nFinally, on a stormy night, the bizarre events are revealed by the half-man, half-fish creatures that keep emerging from the shoreline. It turned out that the captain and his followers were constantly sacrificing residents to those monsters in exchange for various resources. Since then, there have been many mixed species of humans and fish in the town.\nSuch people don't show obvious features at first, but around the age of 20 they start to lose their hair and gradually become half human and half fish. I hear a chill in my heart here. I subconsciously looked at my watch, it was time to get on the departing bus.\n","(FONT:)xxxsmall\nI subconsciously looked at my watch, it was time to get on the departing bus.\n(FONT:)xxxsmall\n(FONT:)small\n","The driver told me that the car was broken and I'm afraid I won't be able to go anywhere tonight. In desperation, I had to rent a hotel to spend the night in this town.\n I lay in bed staring at the ring in a daze and soon fell into a dream. It was a strange dream. In the dream, I actually swam unimpeded in the deep sea. There was a green stone statue on the seabed. The shape was very similar to the pattern on the ring.\nSuddenly, I was awakened by the sound of thunder and rain outside the window. I looked out the window, and a scene I will never forget happened, just as the shopkeeper described, countless half-human, half-fish creatures crawled out of the water and headed towards the town.\n"," I rushed out of the hotel and ran without looking back, and finally fell on the muddy ground and passed out. In the morning I woke up in the pub in the town, I quickly boarded the bus to my hometown, and everything was calm as if everything that happened last night was a dream.\n(EMBED:)https://www.youtube.com/watch?v=JyXEwn6QNhc\n Arriving at my grandparents' house, the strange face in my grandmother's portrait brought back memories of all the weird things I've been through lately. Everything seemed to portend something, Innsmouth, the cult, the god, the strange pattern on the ring and the face of the grandmother. With my hair falling out because I stayed up all night thinking, there was only one thought in my mind, I had to go back to that town no matter what.\n(EMBED:)https://www.youtube.com/watch?v=Rxh_SVtyZqo\n"];
createPages();