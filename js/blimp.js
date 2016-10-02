
			var blimpContainer;

			var cameraBlimp, sceneBlimp, rendererBlimp;

			var animation = null;

			var now;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var root;
			(function(){
				init();

			})()


			function init() {

				//create threejs element
				blimpContainer = document.createElement( 'div' );
				blimpContainer.id = 'blimpContainer';

				document.body.appendChild( blimpContainer );

				cameraBlimp = new THREE.PerspectiveCamera( 45, 400 / window.innerHeight, 1, 2000 );
				cameraBlimp.position.z = 100;
				cameraBlimp.lookAt(0,0,0);


				// scene

				sceneBlimp = new THREE.Scene();

				// lights
				var ambient = new THREE.AmbientLight( 0x666666 );
				sceneBlimp.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffcccc,0.5 );
				directionalLight.position.set( 50, 200, 100 );
				sceneBlimp.add( directionalLight );

				var directionalLight2 = new THREE.DirectionalLight( 0xffeedd,0.3 );
				directionalLight2.position.set( -100, -100, 100 );
				sceneBlimp.add( directionalLight2 );

				// rendererBlimp

				rendererBlimp = new THREE.WebGLRenderer({ alpha: true });
				rendererBlimp.setPixelRatio( window.devicePixelRatio );
				//rendererBlimp.setSize( window.innerWidth, window.innerHeight );
				rendererBlimp.setSize( 400, window.innerHeight );

				rendererBlimp.setClearColor( 0xffffff, 0 );
				blimpContainer.appendChild( rendererBlimp.domElement );

				//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );
				//blimpContainer.addEventListener('click', floatAway, false);

				// materials //

				var lineMaterial = new THREE.LineBasicMaterial({
					linewidth: 2,
					color: 0xaaaaaa
				})

				// model

				root = new THREE.Group();
				var scale = 0.1;
				root.position.y = offsetY;
				sceneBlimp.add( root );


				var offsetY = 0;

				var objLoader = new THREE.OBJLoader();

				var texLoader = new THREE.TextureLoader();
				//texLoader.load('assets/images/gg_guestandguest-txt_logo.png', function(tex){
				texLoader.load('assets/images/gg_logo_grey.png', function(tex){
					tex.offset.set(-0.1,-1.8);
					tex.repeat.set(1.5,3.5);

					var material = new THREE.MeshPhongMaterial({
						shading: THREE.FlatShading,
						shininess: 20,
						specular: new THREE.Color(0xffffff),
						color: new THREE.Color(0xffffff),
						map: tex,
						//lightMap: tex,
						lightMapIntensity: 0.9,
						depthWrite: false,
						transparent: true,
						//anisotropy:100
					})


					objLoader.load( './assets/blimp.obj', function ( blimp ) {

						blimp.traverse( function ( child ) {

							if ( child instanceof THREE.Mesh ) {

								child.material = material
								child.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 30, 0, 0 ) );

								root.add(child);

								material.needsUpdate = true;

							}

						});

						// tether
						var start = new THREE.Vector3(30,40,0)
            var end = new THREE.Vector3(0,-500,0)

						var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(start);
            lineGeometry.vertices.push(end);
            var line = new THREE.Line(lineGeometry, lineMaterial);
            root.add(line)

						root.position.y = offsetY;
						root.scale.set(scale,scale,scale)
						root.rotation.y = Math.PI/2


					},function(){
						console.log('loaded')
						animateBlimp();

					});

				});

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				//cameraBlimp.aspect = window.innerWidth / window.innerHeight;
				cameraBlimp.aspect = 400 / window.innerHeight;

				cameraBlimp.updateProjectionMatrix();
				//rendererBlimp.setSize( window.innerWidth, window.innerHeight );
				rendererBlimp.setSize( 400, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {
				mouseX = ( event.clientX - windowHalfX ) / 4;
				mouseY = ( event.clientY - windowHalfY ) / 4;
			}

			function floatAway() {
				animation = 'floatAway'
				now = new Date(Date.now())* 0.001
				document.querySelector('header').classList.add('activated');
			}

			function animateBlimp() {
				requestAnimationFrame( animateBlimp );
				renderBlimp();
			}

			function renderBlimp() {

				var timer = 0.001 * Date.now();
				cameraBlimp.position.x += ( mouseX - cameraBlimp.position.x ) * .1;
				//camera.position.y += ( - mouseY - camera.position.y ) * .1;
				cameraBlimp.lookAt( sceneBlimp.position );

				//console.log(timer);
				root.position.x = 5 * Math.cos( timer*0.75);
				root.rotation.y = Math.PI / 1.9 + 0.1 * Math.cos( timer);

				rendererBlimp.render( sceneBlimp, cameraBlimp );

				if (animation=='floatAway') {

					console.log('now: '+now)
					root.position.y = (timer-now)*10;
					if(root.position.y > 100) {
						root.position.y = 101;
					}
				}

			}
