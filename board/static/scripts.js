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

const   iEngine = Engine.create(),
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


function create_circles(x,y){
    var circles = Bodies.circle(x,y,Common.random(1,5),{restitution: 0.6,friction: 0.1});
    Composite.add(world,circles);
    setTimeout(function(){Composite.remove(world,circles);},1000);
};

//const ground = Bodies.rectangle(window.innerWidth/2,window.innerHeight/1.1, window.innerWidth, window.innerHeight/10, { isStatic: true });
const wall_bottom = Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth,10,{isStatic: true});
const wall_top = Bodies.rectangle(window.innerWidth/2,0,window.innerWidth,10,{isStatic: true});
const wall_left = Bodies.rectangle(0,window.innerHeight/2,10,window.innerHeight,{isStatic: true});
const wall_right = Bodies.rectangle(window.innerWidth,window.innerHeight/2,10,window.innerHeight,{isStatic: true});

Composite.add(world, 
   [wall_bottom,wall_top,wall_left,wall_right]);

var mouse = Mouse.create(iRender.canvas);

  Events.on(iEngine, 'afterUpdate', function () {
    if (!mouse.position.x) return;
    
    create_circles(mouse.position.x,mouse.position.y);
    //console.log(mouse.position.x);
  });

Render.run(iRender);
Runner.run(iRunner, iEngine);}
catch(e){console.log(e)}
