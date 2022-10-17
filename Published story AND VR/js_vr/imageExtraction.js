//Import required functions for script
//const { response } = require('express');
//const { array, string } = require('joi');

let fs = require("fs");
let files = fs.readdirSync("./assets");
console.log(files)
let myImages = [];

function retrieveDirectoryImages(files,path) {
  for (i in files) {
    if (!files[i].includes(".")) {
      console.log(files[i])
      let folder=path+files[i]+"/";
      let subfolder = fs.readdirSync("./assets/" + path+files[i]);
      retrieveDirectoryImages(subfolder,folder);
    }else{
      let imgFound = false;
      if (files[i].search(".mp4") !== -1 && !imgFound) {
        myImages.push(path +files[i]);
        imgFound = true;
      }
      //Search for Audio before prioritising other file types
      if (files[i].search(".mp3") !== -1 && !imgFound) {
        myImages.push(path +files[i]);
        imgFound = true;
      }
      if (files[i].search(".obj") !== -1 && !imgFound) {
        myImages.push(path + files[i]);
      }
      if (files[i].search(".mtl") !== -1 && !imgFound) {
        myImages.push(path + files[i]);
      }
      if (files[i].search(".jpeg") !== -1 && !imgFound) {
        myImages.push(path + files[i]);
        imgFound = true;
      }
      if (files[i].search(".png") !== -1 && !imgFound) {
        myImages.push(path + files[i]);
        imgFound = true;
      }
      
    }
  }
  
  return myImages;
}

myImages = retrieveDirectoryImages(files,"");
let imgDir = [];
for (i in myImages) {
  
  if (myImages[i].includes(".")) {
    imgDir[i] = '"/assets/' + myImages[i] + '"';
    if(imgDir[i].includes("//")){
      imgDir[i].replace("//","/");
    }
    //console.log(imgDir[i])
  }
}

// Data which will write in a file.
let data = "\nimgRepo = [" + imgDir.join(",") + "]";
console.log(data)
// Write data in 'Output.txt' .
fs.appendFile("./js_vr/storyFunctions.js", data, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});
