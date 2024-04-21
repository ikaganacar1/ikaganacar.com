try {

try {
    if (typeof MatterWrap !== 'undefined') {
        Matter.use('matter-wrap');
    } else {
        Matter.use(require('matter-wrap'));
    }
} catch (e) {}


const   Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;
        Events = Matter.Events; 

const   iEngine = Engine.create({gravity: {y:0}}),
        world = iEngine.world;

const iRunner = Runner.create();

const iRender = Render.create({
  element: document.body,
  engine: iEngine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent',
    wireframeBackground: 'transparent',
    //showAngleIndicator: true,
  }
});

var circle_array = [];
function create_circles(x,y){
  let gray = Common.random(0,255)
    var circles = Bodies.circle(x+Common.random(-5,5),y+Common.random(-5,5),Common.random(5,30),
      {
        restitution: 0.8,
        friction: 0.1,
        render:{
          fillStyle:`rgb(${gray},${gray},${gray})`,
          strokeStyle:'white',
          lineWidth:2
        }
      
      });

    Composite.add(world,circles);
    circle_array.push(circles);
    //setTimeout(function(){Composite.remove(world,circles);},1000);
};

//const ground = Bodies.rectangle(window.innerWidth/2,window.innerHeight/1.1, window.innerWidth, window.innerHeight/10, { isStatic: true });
const wall_bottom = Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth,10,{isStatic: true});
const wall_top = Bodies.rectangle(window.innerWidth/2,0,window.innerWidth,10,{isStatic: true});
const wall_left = Bodies.rectangle(0,window.innerHeight/2,10,window.innerHeight,{isStatic: true});
const wall_right = Bodies.rectangle(window.innerWidth,window.innerHeight/2,10,window.innerHeight,{isStatic: true});

Composite.add(world, 
   [wall_bottom,wall_top,wall_left,wall_right]);
   
var mouse = Mouse.create(iRender.canvas);
var mouseConstraint = Matter.MouseConstraint.create(iEngine, {
  element: document.body,
  constraint: {
      render: {
          visible: false
      },
      stiffness: 0.8
  }
});

Matter.World.add(world, mouseConstraint);


let check_if_on_box = true;
let check_if_clicked = false;

function onmouseenter_f(el) {
    /*console.log("over")*/
    check_if_on_box = false;
};

function onmouseleave_f(el) {
    /*console.log("out")*/
    check_if_on_box = true;
};



Events.on(mouseConstraint,'mousedown',function(event){
  check_if_clicked=true
});

Events.on(mouseConstraint,'mouseup',function(event){
  check_if_clicked=false
});

Events.on(iEngine, 'afterUpdate', function (event) {
  if(check==1){
  if (!mouse.position.x) return;
  if(check_if_on_box){
    if (check_if_clicked) {
      create_circles(mouse.position.x,mouse.position.y);
    }
    }}
  
});

function del_obj(el) {
  console.log("obj. deleted")

  for (let i = 0; i < circle_array.length; i++) {
    
   Composite.remove(iEngine.world,circle_array[i]);
  }
  
}

function color_obj(el) {
  console.log("obj. deleted")

  for (let i = 0; i < circle_array.length; i++) {
    circle_array[i].render.fillStyle=`rgb(${Common.random(0,255)},${Common.random(0,255)},${Common.random(0,255)})`;
    
  }
  
}
let mode = 1;
function gravity_obj(el) {

  switch (mode) {
    case 1:
      iEngine.gravity.y = 1;
      mode = 2;
      break;

    case 2:
      iEngine.gravity.y = 0;
      mode = 1;
      break;

    default:
      break;
  }
  console.log(mode);
}

let check = 1;
function close_obj(el) {
  switch (check) {
    case 1:
      check = 0;
      break;
    case 0:
      check = 1;
      break;

    default:
      break;
  }
  
}

Render.run(iRender);
Runner.run(iRunner, iEngine);}
catch(e){console.log(e)}
