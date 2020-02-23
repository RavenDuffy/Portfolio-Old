const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,
  window.innerWidth / window.innerHeight,
  0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
const maxCamDistance = 200;
scene.add(cube);
scene.add(camera);
camera.position.z = maxCamDistance;
camera.name = "main";
console.log(camera)
const originalCam = camera.clone();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
let mouseOverList = [];

const particleCount = 2000,
  particles = new THREE.Geometry(),
  pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 2,
    map: new THREE.TextureLoader().load(
      "../res/images/particle.png"
    ),
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaTest: 0.5
  });
for (let p = 0; p < particleCount; p++) {
  let pX = Math.random() * 500 - 250,
    pY = Math.random() * 500 - 250,
    pZ = Math.random() * 500 - 250,
    particle = new THREE.Vector3(pX, pY, pZ);
  particles.vertices.push(particle);
}
const particleSystem = new THREE.Points(
  particles, pMaterial
);
particleSystem.sortParticles = true;
scene.add(particleSystem);

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onresize = resize;

const update = () => {
  raycaster.setFromCamera(mouse, camera);
  rotateItems();
  isSquareHovered();
}

const rotateItems = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  particleSystem.rotation.y += 0.001;
  particleSystem.rotation.y -= 0.0005;
  particleSystem.rotation.z -= 0.001;
}

const mousemove = (event) => {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener("mousemove", mousemove, false);

const mouseclick = (event) => {
  console.log(4)
  mouseOverList = raycaster.intersectObjects(scene.children)
  if (mouseOverList.length) {
    if (mouseOverList[0].object == cube) {
      console.log(mouseOverList[0].object)
      console.log(scene.children);
      camera = originalCam;
      // scene.children = scene.children.filter((item) => {
      //   //console.log(item == originalCam, item, originalCam)
      //   return !(item.type == "PerspectiveCamera" && item.name == "main");
      // });
      // console.log(scene.children);
      // scene.add(camera);
      // scene.add(mouseOverList[0].object)
      // console.log(camera)
    }
    else {
      // console.log(camera);
      // camera.children = [];
      // camera.add(mouseOverList[0].object)
    }
  }
  console.log(camera, scene);
}
window.addEventListener("mousedown", mouseclick, false);

const isSquareHovered = () => {
  mouseOverList = raycaster.intersectObjects(scene.children)
  if (mouseOverList.length) {
    zoomObject(mouseOverList[0]);
    return;
  } zoomOut();
}

const zoomObject = (object) => {
  // if (camera.position.z > 5) camera.position.z -= 1;
  // console.log(object)

  const vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  vector.unproject(camera);
  vector.sub(camera.position);
  camera.position.addVectors(camera.position, vector.setLength(1));

  // const objectZ = object.point.z;
  // const cameraToFarEdge = ( objectZ < 0 ) ? -objectZ + camera.position.z : camera.position.z - objectZ;
  // camera.far = cameraToFarEdge * 3;
  // camera.updateProjectionMatrix();
}

const zoomOut = () => {
  if (camera.position.z < maxCamDistance) camera.position.z += 1;
}

const animate = () => {
  requestAnimationFrame(animate);

  update();

  renderer.render(scene, camera);
}
animate();
