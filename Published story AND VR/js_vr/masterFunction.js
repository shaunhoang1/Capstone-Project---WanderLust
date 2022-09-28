//copyfile.js
const fs = require('fs');
// destination will be created or overwritten by default.
fs.copyFile('./js_vr/scriptTemplate.js', './js_vr/storyFunctions.js', (err) => {
  if (err) throw err;
  console.log('Story script created.');
});
fs.copyFile('./js_vr/index_vr.html', './index_vr.html', (err) => {
  if (err) throw err;
  console.log('Story HTML created.');
});
require('./imageExtraction.js')
require('./ExtractStory.js')

console.log('VR Story Published');