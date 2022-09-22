//Import required functions for script
//const { response } = require('express');
//const { array, string } = require('joi');
function retrieveDirectoryImages() {
  let fs = require("fs");
  let files = fs.readdirSync("./assets");
  let myImages = [];
  for (i in files) {
    if (!files[i].includes(".")) {
      let fileImages = fs.readdirSync("./assets/" + files[i]);
      let imgFound = false;
      //Searches for more important file types first, and then others
      for (let j in fileImages) {
        if (fileImages[j].search(".mp4") !== -1 && !imgFound) {
          myImages.push(files[i] + "/" + fileImages[j]);
          imgFound = true;
        }
      }
      for (let j in fileImages) {
        if (fileImages[j].search(".obj") !== -1 && !imgFound) {
          myImages.push(files[i] + "/" + fileImages[j]);
          console.log(files[i] + "/" + fileImages[j]);
        }
        if (fileImages[j].search(".mtl") !== -1 && !imgFound) {
          myImages.push(files[i] + "/" + fileImages[j]);
          console.log(files[i] + "/" + fileImages[j]);
        }
        if (fileImages[j].search(".jpeg") !== -1 && !imgFound) {
          myImages.push(files[i] + "/" + fileImages[j]);
          imgFound = true;
        }
        if (fileImages[j].search(".png") !== -1 && !imgFound) {
          myImages.push(files[i] + "/" + fileImages[j]);
          imgFound = true;
        }
      }
    }
  }
  console.log(myImages)
  return myImages;
}

myImages = retrieveDirectoryImages();
let imgDir = [];
for (i in myImages) {
  if (myImages[i].includes(".")) {
    imgDir[i] = '"/assets/' + myImages[i] + '"';
    //console.log(imgDir[i])
  }
}

const fs = require("fs");

// Data which will write in a file.
let data = "\nimgRepo = [" + imgDir.join(",") + "]";
// Write data in 'Output.txt' .
fs.appendFile("./js_vr/storyFunctions.js", data, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});
