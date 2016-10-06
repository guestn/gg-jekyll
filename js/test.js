

/// THREEJS

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var points, uniforms;
var colors, positions, sizes, geometry1, targetList =[],plane, blimp;
//var sphereEnd = []
var biplanes = []
var clock = new THREE.Clock;

var raycaster, intersects = [];
var mouse, INTERSECTED;
var texture

(function(){
  load();
  //init();
})()

function load() {

  var texLoader = new THREE.TextureLoader();
//texLoader.load('assets/images/gg_guestandguest-txt_logo.png', function(tex){
  texLoader.load('assets/images/ground1024.jpg', function(tex){
    tex.offset.x = 0
    tex.repeat.set(1,1);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    texture = tex;
    //texture.offset.x =0;
    tex.needsUpdate = true;
    texture.needsUpdate = true;
    init(tex);
  });

}

function init(tex) {



  var testPage = document.getElementById('test')
  var threeElement = document.createElement('div');
  container = testPage.appendChild( threeElement );

//----------------------------------------//
// CAMERA                                 //
//----------------------------------------//
  camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.z = -100;
  camera.position.y = 300;
  camera.position.x = 30;
  camera.lookAt(0,0,0);

//----------------------------------------//
//  SCENE                                 //
//----------------------------------------//

  scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2( 0xaaaaaa, 0.0001 );

//----------------------------------------//
//  LIGHTS                                //
//----------------------------------------//
  var ambient = new THREE.AmbientLight( 0xaaaaaa );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, -30, 100 );
  scene.add( directionalLight );

  var light2	= new THREE.DirectionalLight( 0xFAEDFF, 1 );
  light2.shadow.camera.left = -200; // or whatever value works for the scale of your scene
  light2.shadow.camera.right = 200;
  light2.shadow.camera.top = 200;
  light2.shadow.camera.bottom = -200;
  light2.shadow.camera.near = 1;
  light2.shadow.camera.far = 1500;
  light2.shadow.camera.fov = 130;
  light2.shadow.camera.position.x = 0;
  light2.shadow.mapSize.width = 2048;
  light2.shadow.mapSize.height = 2048;
  light2.castShadow = true;
  light2.shadow.darkness = 0.5;
  light2.position.set(50,100,0);
  light2.scale.set(100,100,100);
  light2.target.position.set( 0, 0, 0 );

  //light2.shadow.camera.position.set( 0, 100, -40 );
  scene.add(light2.target);

  scene.add(light2);
  var helper = new THREE.CameraHelper( light2.shadow.camera );
  //scene.add( helper );

//----------------------------------------//
//  RENDERER                              //
//----------------------------------------//

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xffffff, 0 );
  container.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;

// TEMPORARY //
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // TEMPORARY //

  window.addEventListener( 'resize', onWindowResize, false );

//----------------------------------------//
//  MATERIALS                             //
//----------------------------------------//

  var material = new THREE.MeshPhongMaterial({
    shading: THREE.FlatShading,
    shininess: 20,
    specular: new THREE.Color(0xffffff),
    color: new THREE.Color(0xffffff),
    map: new THREE.TextureLoader().load('assets/images/gg_logo_grey.png', function(text){
      text.offset.set(-0.1,-1.8);
      text.repeat.set(1.5,3.5);
      texture = tex;
    }),
    //lightMap: tex,
    lightMapIntensity: 0.9,
    //depthWrite: false,
    transparent: false,
    //anisotropy:100
  })

  var lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
  });
  var lineMaterial2 = new THREE.LineBasicMaterial({
      color: 0xbbbbbb,
      linewidth: 1
  });

  var discMaterial = new THREE.MeshPhongMaterial( {
    color: 0xaaaaaa,
    shininess: 1,
    map: tex
    //emissive:  0xffffff,
  });

  var biplaneMaterial = new THREE.MeshPhongMaterial( {
    color: 0xff5555,
    shininess: 50,
    map: tex
    //emissive:  0xffffff,
  });

  var pointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
  })

  var shaderMaterial = new THREE.ShaderMaterial( {
    uniforms: {
      color:   { value: new THREE.Color( 0x000000 ) },
      //texture: { value: new THREE.TextureLoader().load( "//threejs.org/examples/textures/sprites/disc.png" ) }
      //texture: { value: new THREE.TextureLoader().load( "./assets/images/dot.png" ) }
      u_texture: { type: 't', value: tex }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    alphaTest: 0.9,
    //transparent: true,
    //blending:  THREE.NormalBlending,
    depthTest:  false,

  } );

//----------------------------------------//
//  GROUND                                //
//----------------------------------------//

  var planeGeometry = new THREE.PlaneBufferGeometry( 1,1, 1);

  var numVertices = 4;
  var texCoordBuffer = new Float32Array(2 * numVertices)
  var sizes = new Float32Array(numVertices * 3)
  var positions = new Float32Array(numVertices * 3);


  for (var i=0;i < sizes.length;i++) {
    sizes[i] = 1;
    positions[i] = planeGeometry.attributes.position.array[i]
  }



  //planeGeometry.addAttribute('a_texCoord', new THREE.BufferAttribute(texCoordBuffer, 2));
  planeGeometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
  planeGeometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ));

  //console.log(planeGeometry)

  plane = new THREE.Mesh( planeGeometry, discMaterial);
  plane.rotation.x = -Math.PI/2
  plane.position.set(0,-490,0);
  plane.receiveShadow = true;
  plane.scale.set(3000,3000,3000);
  console.log(shaderMaterial);
  scene.add( plane );

//----------------------------------------//
//  BLIMP                                 //
//----------------------------------------//

  var scale = 0.4;
  var offsetY = -10;//-40;
  var positions, colors, sizes;

  var particlesGeo = new THREE.Geometry()

  var loader = new THREE.OBJLoader();
  loader.load( './assets/blimp.obj', function ( object ) {

    object.traverse( function ( child ) {

      if ( child instanceof THREE.Mesh ) {

        child.material = material
        child.material.side = THREE.Frontside;
        //child.material.color.setHex( 0xffffff )
        child.castShadow = true;

        console.log(child.geometry);
        console.log(child.geometry.attributes.position.count)

        positions = new Float32Array(child.geometry.attributes.position.count * 3)
        colors = new Float32Array(child.geometry.attributes.position.count * 3);
        sizes = new Float32Array(child.geometry.attributes.position.count * 1);

        for (var i = 0, i3 = 0; i < child.geometry.attributes.position.count * 3; i++, i3+=3)  {

            var x = child.geometry.attributes.position.array[i]
            var y = child.geometry.attributes.position.array[i+1]
            var z = child.geometry.attributes.position.array[i+2]
            var start = new THREE.Vector3( x*scale, y*scale+offsetY, z*scale )

            positions[i3+0] = x;
            positions[i3+1] = y;
            positions[i3+2] = z;

            sizes[i] = 2;

            start.toArray(positions, i);


        }

      }
      blimp = object;

    });

    var color = new THREE.Color();
    color.setHSL( 0.1, 1.0, 0.5 )
    for (var j=0; j < colors.length; j++) {
      color.toArray( colors, j);
    }

    geometry1 = new THREE.BufferGeometry();
    geometry1.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ));
    geometry1.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry1.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ));

    blimp.position.y = offsetY;
    blimp.rotation.y = -Math.PI * 3/4
    blimp.scale.set(scale,scale,scale)
    blimp.castShadow = true;
    blimp.receiveShadow = true;
    scene.add( blimp );

    var loader = new THREE.OBJLoader();
    loader.load( './assets/biplane-simple.obj', function ( object ) {

      object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

          child.material = biplaneMaterial
          child.material.side = THREE.Frontside;
          //child.material.color.setHex( 0xffffff )
          child.castShadow = true;
          console.log(child)
          var biplaneCount = 6
          for ( var i = 0; i < biplaneCount; i ++ ) {
            var biplane = new THREE.Mesh(child.geometry,biplaneMaterial)
            //console.log(biplane)
            biplane.position.set((i-biplaneCount/5)*60, offsetY-50, 100)
            biplane.rotation.y = Math.PI * 3/4
            biplane.scale.set(10,10,10);
            biplane.castShadow = true;
            biplanes.push( biplane );
            scene.add(biplane)

            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(new THREE.Vector3(-10,0,-10));
            lineGeometry.vertices.push(new THREE.Vector3(-120,0,-120));
            var line = new THREE.Line(lineGeometry, lineMaterial2);
            line.position.set((i-biplaneCount/5)*60, offsetY-45, 100)
            scene.add(line);

            var plane = new THREE.Mesh( new THREE.BoxGeometry(1,1,0.01),material);
            plane.material.side = THREE.DoubleSide;
            plane.rotation.set(0,Math.PI*3/4,0);//(0,-Math.PI/4,-Math.PI/4)
            plane.position.set((i-biplaneCount/5)*60-130, offsetY-50, -30);
            plane.scale.set(50,50,100);
            plane.receiveShadow = true;
            plane.castShadow = true;
            scene.add( plane );

          }



        }




      })





      // biplane.position.set(-250, offsetY,100)
      // biplane.rotation.y = Math.PI * 3/4
      // biplane.scale.set(10,10,10)
      // scene.add(plane)

      animate();

    });


    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();



  });

}




//----------------------------------------//
//  EVENT LISTENERS                       //
//----------------------------------------//


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {
  //event.preventDefault();

  mouseX = ( event.clientX - windowHalfX ) * 0.1;
  mouseY = ( event.clientY - windowHalfY ) * 0.1;
}

function onDocumentMouseDown() {
  toggleGallery(true)
  document.removeEventListener( 'mousedown', onDocumentMouseDown, false );

}

//----------------------------------------//
//  ANIMATE/RENDER                        //
//----------------------------------------//
function animate() {

  requestAnimationFrame( animate );
  render();
}


function render() {
  var timer = 0.001 * Date.now();

  var elapsed = clock.getElapsedTime();
  //console.log(elapsed)
  //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  //scamera.position.y += ( - mouseY - (camera.position.y-100) )*1.8;
  //camera.position.z += ( - mouseY - camera.position.y -100) * 0.01;
  camera.position.x = - mouseX +100;
  camera.position.y = - mouseY +100;
  camera.position.z = -200;

  //console.log(mouseY);
  texture.needsUpdate = true;

  texture.offset.x += 0.0005;// * elapsed
  texture.offset.y -= 0.0005;
  //console.log(texture.offset.x);
  blimp.position.x -= 0.2 * Math.cos(elapsed)
  blimp.position.z -= 0.15 * Math.cos(elapsed/2)


  camera.lookAt( scene.position );

  raycaster.setFromCamera( mouse, camera );

  intersects = raycaster.intersectObjects( targetList );
  if ( intersects.length > 0 ) {
    INTERSECTED = intersects[ 0 ].object.index;
    //console.log(INTERSECTED)
    if (INTERSECTED != null) {
      document.body.style.cursor = 'pointer'

      intersects[ 0 ].object.scale.set(1.1,1.1,1.1);
      document.addEventListener( 'mousedown', onDocumentMouseDown, false );


    }
  } else {
    targetList.forEach(function(mesh){
      mesh.scale.set(1,1,1)
    })
    INTERSECTED = null;
  }



  renderer.render( scene, camera );

}



//----------------------------------------//
//  UTILITY                               //
//----------------------------------------//


function randomPoint() {
  return new THREE.Vector3( THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ) );
}



// debounce scroll etc
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
