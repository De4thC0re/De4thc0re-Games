if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.getElementById("mobileWarning").classList.remove("hidden");
} else {

const canvas = document.getElementById("gameCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

let floorGeometry = new THREE.PlaneGeometry(200,200);
let floorMaterial = new THREE.MeshBasicMaterial({color:0x000000});
let floor = new THREE.Mesh(floorGeometry,floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

let wallGeometry = new THREE.BoxGeometry(10,20,2);
let wallMaterial = new THREE.MeshBasicMaterial({color:0x444444});
let wall = new THREE.Mesh(wallGeometry,wallMaterial);
wall.position.set(0,10,-50);
scene.add(wall);

// Broń HUD
let weaponTexture = new THREE.TextureLoader().load('textures/weapon.png');
let weaponMaterial = new THREE.SpriteMaterial({map: weaponTexture, transparent: true});
let weapon = new THREE.Sprite(weaponMaterial);
weapon.scale.set(1.5,0.5,1);
weapon.position.set(0,-1,-2);
camera.add(weapon);
scene.add(camera);

// Sterowanie
let keys = {};
let ammo = 30;
const maxAmmo = 30;
let kills = 0;
document.getElementById("ammo").innerText = `Ammo: ${ammo}/${maxAmmo}`;
document.getElementById("kills").innerText = `Zabójstwa: ${kills}`;

document.addEventListener("keydown",(e)=>{
  keys[e.key.toLowerCase()] = true;
  if(e.key.toLowerCase()==="r") { ammo = maxAmmo; updateHUD(); }
});
document.addEventListener("keyup",(e)=>{ keys[e.key.toLowerCase()] = false; });

let mouse = {left:false,right:false};
document.addEventListener("mousedown",(e)=>{
  if(e.button===0) mouse.left=true;
  if(e.button===2) mouse.right=true;
});
document.addEventListener("mouseup",(e)=>{
  if(e.button===0) mouse.left=false;
  if(e.button===2) mouse.right=false;
});

function updateHUD() {
  document.getElementById("ammo").innerText = `Ammo: ${ammo}/${maxAmmo}`;
  document.getElementById("kills").innerText = `Zabójstwa: ${kills}`;
}

// Prosty bot
let bots = [];
for(let i=0;i<3;i++){
  let botGeo = new THREE.BoxGeometry(1,2,1);
  let botMat = new THREE.MeshBasicMaterial({color:0xff0000});
  let bot = new THREE.Mesh(botGeo,botMat);
  bot.position.set(Math.random()*50-25,1,Math.random()*50-25);
  scene.add(bot);
  bots.push(bot);
}

// Kamera startowa
camera.position.set(0,2,10);

// Animacja
function animate(){
  requestAnimationFrame(animate);

  if(keys["w"]) camera.position.z -=0.5;
  if(keys["s"]) camera.position.z +=0.5;
  if(keys["a"]) camera.position.x -=0.5;
  if(keys["d"]) camera.position.x +=0.5;

  // Boty proste AI
  bots.forEach(bot=>{
    if(Math.random()<0.01){
      bot.position.x += Math.random()*2-1;
      bot.position.z += Math.random()*2-1;
    }
  });

  renderer.render(scene,camera);
}
animate();
}