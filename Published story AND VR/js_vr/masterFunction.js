
//copyfile.js
const fs = require('fs');

// destination will be created or overwritten by default.
fs.copyFile('./js_vr/scriptTemplate.js', './js_vr/storyFunctions.js', (err) => {
  if (err) throw err;
  console.log('File was copied to destination');
});
require('./imageExtraction.js')
require('./ExtractStory.js')
//require('./Output.js');
