<!-- Load A-Frame -->
<script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>

<!-- Function to Load Scene -->
<script>
    function createScene(){
        var scene = document.createElement("a-scene");
        scene.setAttribute("id","VRScene");

        var box = document.createElement("a-box");
        var skyBox=document.createElement("a-sky");
        skyBox.setAttribute('src',"screenshots/woods-by-the-river.jpg");

        var element = document.getElementById("new");
        element.appendChild(scene);

        scene.appendChild(box);
        scene.appendChild(skyBox);

        var rotatingBox = document.createElement("a-box");
        rotatingBox.setAttribute('position',"-1 6 -2");
        rotatingBox.setAttribute('animation__POSITIONX',"property: position; from:-4 8 -10;to: 4 8 -10; dur: 2000; easing: linear; loop: true; dir:alternate" );
        rotatingBox.setAttribute('animation__OPACITY','property: opacity; from:0;to: 1; dur: 1000; easing: linear; loop: true; dir:alternate');
        rotatingBox.setAttribute('color','#00FF00');
        scene.appendChild(rotatingBox);

        var camObj = document.createElement("a-camera");
        camObj.setAttribute('position','0 1.6 2');
        scene.appendChild(camObj);
    }
</script>


<!-- Load JS Events -->
<script>
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.key === "q") {
            document.getElementById("VRScene").style.zIndex = "-1";
        }
    });

    AFRAME.registerComponent('button-interaction-handler', {
        init: function () {
            var skyEl = this.el.sceneEl.querySelector('#background');
            var cubeEl = this.el.sceneEl.querySelector('#left-cube');

            this.el.addEventListener('mouseenter', function () {
                skyEl.setAttribute('src', '#pano-brush');  
                cubeEl.setAttribute('scale', '3 3 3');  
                document.querySelector('[camera]').setAttribute('wasd-controls-enabled','"false"');
            });

            this.el.addEventListener('mouseleave', function () {
                skyEl.setAttribute('src', '#pano-town');
                cubeEl.setAttribute('scale', '1 1 1');
                document.querySelector('[camera]').setAttribute('wasd-controls-enabled','"true"');
            });
        }  
    });

    AFRAME.registerComponent('button-click-handler', {
        init: function () {
            var skyEl = this.el.sceneEl.querySelector('#thing');

            this.el.addEventListener('click', function () {
                skyEl.setAttribute('scale', '5 5 5');  
            });
        }   
    });

    function ChangeDepth(){
        document.getElementById("VRScene").style.zIndex="auto";
    }
</script>