try {
    if (typeof MatterWrap !== 'undefined') {
        // either use by name from plugin registry (Browser global)
        Matter.use('matter-wrap');
    } else {
        // or require and use the plugin directly (Node.js, Webpack etc.)
        Matter.use(require('matter-wrap'));
    }
} catch (e) {
    // could not require the plugin or install needed
}


const   Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

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
    showAngleIndicator: true,
  }
});
//x,y,width,height
const boxA = Bodies.rectangle(400, 200, 80, 80);
const ballA = Bodies.circle(380, 100, 40, 10);
const ballB = Bodies.circle(460, 10, 40, 10);


var stack = Composites.stack(0, 0, 30, 30, 1, 1, function(x, y) {
    return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
});



//const ground = Bodies.rectangle(window.innerWidth/2,window.innerHeight/1.1, window.innerWidth, window.innerHeight/10, { isStatic: true });
const wall_bottom = Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth,10,{isStatic: true});
const wall_top = Bodies.rectangle(window.innerWidth/2,0,window.innerWidth,10,{isStatic: true});
const wall_left = Bodies.rectangle(0,window.innerHeight/2,10,window.innerHeight,{isStatic: true});
const wall_right = Bodies.rectangle(window.innerWidth,window.innerHeight/2,10,window.innerHeight,{isStatic: true});

Composite.add(world, 
   [boxA,stack,
    ballA,ballB,
    wall_bottom,wall_top,wall_left,wall_right,
]);

var mouse = Mouse.create(iRender.canvas),
    mouseConstraint = MouseConstraint.create(iEngine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
        }
    }
});

var allBodies = Composite.allBodies(world);



Composite.add(world, mouseConstraint);
iRender.mouse = mouse

Render.run(iRender);
Runner.run(iRunner, iEngine);
