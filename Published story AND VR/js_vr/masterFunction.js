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
fs.copyFile('./js_vr/indexVRGuide.html', './indexVRGuide.html', (err) => {
  if (err) throw err;
  console.log('Guide HTML created.');
});

let data=`<script>
  let btn = document.createElement("button");
      btn.setAttribute("id", "vrButton");
    
    btn.setAttribute("class", "ml-auto float-xs-right");
    btn.setAttribute("style", "width:auto;margin-right: 10%;font-size: 3vmin;margin-bottom: auto;margin-top: auto;");
    btn.setAttribute("onclick", "(function(){window.location='indexVRGuide.html'})()");
    btn.setAttribute("look-at","#cameraObj");
    btn.textContent='Enter VR';

  let parent = document.getElementsByClassName("Header Layout Theme-Header");
  parent[0].appendChild(btn);
</script>`;
// Write data in 'Output.txt' .
fs.appendFile('./index.html', data, (err) => {
	
	// In case of a error throw err.
	if (err) throw err;
})


require('./ExtractMedia.js')
require('./ExtractStory.js')

console.log('VR Story Published');