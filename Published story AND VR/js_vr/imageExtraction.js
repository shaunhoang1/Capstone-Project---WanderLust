//Import required functions for script
//const { response } = require('express');
//const { array, string } = require('joi');


function retrieveDirectoryImages(){
  var fs = require('fs');
  var files = fs.readdirSync('./assets');
  let myImages = [];
  for(i in files){
      if(!files[i].includes('.')){
          var fileImages = fs.readdirSync('./assets/'+files[i]);
          for(let x in [0,1]){
            for(let j in fileImages){
              if (fileImages[j].search('.webp')!==-1 || fileImages[j].search('.gif')!==-1){
                fileImages.splice(j,1);
              }
            }
          }
          myImages.push(files[i]+"/"+fileImages[1]);
  }}
  for(i in myImages){
      //console.log(myImages[i]);
  }
  return myImages;
}      

myImages = retrieveDirectoryImages();
let imgDir=[]
for(i in myImages){
  if(myImages[i].includes(".")){
    imgDir[i] = "\"/assets/"+myImages[i]+"\"";
  }
}

const fs = require('fs')

// Data which will write in a file.
let data = "\nimgRepo = ["+imgDir.join(",")+"]";
// Write data in 'Output.txt' .
fs.appendFile('./js_vr/storyFunctions.js', data, (err) => {
	
	// In case of a error throw err.
	if (err) throw err;
})




