try {
try {
    if (typeof MatterWrap !== 'undefined') {Matter.use('matter-wrap');} 
    else {Matter.use(require('matter-wrap'));}
} catch (e) {}

const   Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Vector= Matter.Vector,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Svg = Matter.Svg,
        World = Matter.World,
        Vertices = Matter.Vertices,
        Events = Matter.Events; 

const   iEngine = Engine.create({gravity: {y:0}}),
        world = iEngine.world;

const   iRunner = Runner.create();

const   iRender = Render.create({
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
function create_circles(x,y,color,apply_force){

  if (color =="gray") {
    let gray = Common.random(0,255);
    var curr_color = `rgb(${gray},${gray},${gray})`
  
  }else{

    var curr_color = `rgb(${Common.random(0,255)},${Common.random(0,255)},${Common.random(0,255)})`;
  }

  var circles = Bodies.circle(x+Common.random(-5,5),y+Common.random(-5,5),Common.random(5,30),
    {
      restitution: 0.8,
      friction: 0.1,
      //url: '#',
      render:{
        fillStyle:curr_color,
        strokeStyle:'white',
        lineWidth:2
      }});
  
  if(apply_force == 1){
    Body.applyForce(circles, {x: circles.position.x, y: circles.position.y}, {x: Common.random(-0.05,0.05), y: Common.random(-0.05,0.05)})
  }
      
    

    Composite.add(world,circles);
    circle_array.push(circles);
    //setTimeout(function(){Composite.remove(world,circles);},1000);
};

//function of delete button 
function del_obj(el) {
    for (let i = 0; i < circle_array.length; i++) {
        Composite.remove(iEngine.world,circle_array[i]);
    }
}

//function of color palette button
function color_obj(el) {
    for (let i = 0; i < circle_array.length; i++) {
      circle_array[i].render.fillStyle=`rgb(${Common.random(0,255)},${Common.random(0,255)},${Common.random(0,255)})`;
    } 
}

//function of gravity button
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

//function of party button
var i = 1;
function party_obj(el) { 
    setTimeout(() => {
        create_circles(Common.random(0,window.innerWidth),Common.random(0,window.innerHeight),"_",1);
        i++;
        if(i<200){party_obj()}
        else{i = 1;}
    }, 10);
} 

//create walls
const wall_bottom = Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth,10,{isStatic: true});
const wall_top = Bodies.rectangle(window.innerWidth/2,0,window.innerWidth,10,{isStatic: true});
const wall_left = Bodies.rectangle(0,window.innerHeight/2,10,window.innerHeight,{isStatic: true});
const wall_right = Bodies.rectangle(window.innerWidth,window.innerHeight/2,10,window.innerHeight,{isStatic: true});

//detect mouse
let mouse = Mouse.create(iRender.canvas);
let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
    element: document.body,
    constraint: {
        render: {
            visible: false
        },
        stiffness: 0.8
    }
});

Matter.World.add(world, mouseConstraint);
Composite.add(world, [wall_bottom,wall_top,wall_left,wall_right]);

//buttons
var button_del_obj = Bodies.circle(window.innerWidth/2,window.innerHeight/2,30,{
  isStatic: false,
  url: "del_obj",
  restitution: 0.8,
  friction: 0.1,
  render:{
    lineWidth:2,
    sprite:{
      texture:"https://media.publit.io/file/trash-svgrepo-com-2.png",
      xScale:0.2083,
      yScale:0.2083
    }   
  }
});World.add(world, [button_del_obj,])

var button_color_obj = Bodies.circle(window.innerWidth/2,window.innerHeight/2,30,{
  isStatic: false,
  url: "color_obj",
  restitution: 0.8,
  friction: 0.1,
  render:{
    lineWidth:2,
    sprite:{
      texture:"https://media.publit.io/file/color-palette-svgrepo-com.png",
      xScale:0.2083,
      yScale:0.2083
    }   
  }
});World.add(world, [button_color_obj,])

var button_gravity_obj = Bodies.circle(window.innerWidth/2,window.innerHeight/2,30,{
  isStatic: false,
  url: "gravity_obj",
  restitution: 0.8,
  friction: 0.1,
  render:{
    lineWidth:2,
    sprite:{
      texture:"https://media.publit.io/file/gravity-svgrepo-com.png",
      xScale:0.2083,
      yScale:0.2083
    }   
  }
});World.add(world, [button_gravity_obj,])

var button_party_obj = Bodies.circle(window.innerWidth/2,window.innerHeight/2,30,{
  isStatic: false,
  url: "party_obj",
  restitution: 0.8,
  friction: 0.1,
  render:{
    lineWidth:2,
    sprite:{
      texture:"https://media.publit.io/file/party-horn-svgrepo-com.png",
      xScale:0.2083,
      yScale:0.2083
    }   
  }
});World.add(world, [button_party_obj,])


let check_if_clicked = false;
Events.on(mouseConstraint,'mousedown',function(event){
  check_if_clicked=true;
  var mc = event.source;
  var bodies = world.bodies;

  if (!mc.bodyB) {
    for (i = 0; i < bodies.length; i++) { 
      var body = bodies[i];
      if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {
        var bodyUrl = body.url;
        console.log("Body.Url >> " + bodyUrl);
        
        if (bodyUrl == "del_obj") {
          del_obj();
          check_if_clicked=false;
        }

        else if (bodyUrl == "color_obj") {
          color_obj();
          check_if_clicked=false;
        }

        else if (bodyUrl == "gravity_obj") {
          gravity_obj();
          check_if_clicked=false;
        }

        else if (bodyUrl == "party_obj") {
          party_obj();
          check_if_clicked=false;
        }

        else if (bodyUrl != undefined) {
          window.open(bodyUrl, '_blank');
          console.log("Hyperlink was opened");
        }
        
        break;
      }
    }
  }
});

Events.on(mouseConstraint,'mouseup',  function(event){
  check_if_clicked=false;
});

//if it is suitable create circles when clicked
Events.on(iEngine, 'afterUpdate', function (event) {
    if (!mouse.position.x) return;
  
    if (check_if_clicked) {
      create_circles(mouse.position.x,mouse.position.y,"gray",0);
    }
});

Render.run(iRender);
Runner.run(iRunner, iEngine);}
catch(e){console.log(e)}//global try catch to see the errors