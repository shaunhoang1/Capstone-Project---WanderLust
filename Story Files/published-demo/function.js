
        <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
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