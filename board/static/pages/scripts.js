try {
  try {
    if (typeof MatterWrap !== 'undefined') { Matter.use('matter-wrap'); }
    else { Matter.use(require('matter-wrap')); }
  } catch (e) { }

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    Svg = Matter.Svg,
    World = Matter.World,
    Events = Matter.Events;
  //Composites = Matter.Composites,
  //Vector= Matter.Vector,
  //Vertices = Matter.Vertices, 
  //MouseConstraint = Matter.MouseConstraint,

  const iEngine = Engine.create({ gravity: { y: 0.8 } }),
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

  var ratio = (1253376 / (window.screen.availWidth * window.screen.availHeight));

  if (ratio < 1) {
    ratio = 1;
  }
  console.log(ratio)

  var circle_array = [];
  function create_circles(x, y, color, apply_force) {

    if (color == "gray") {
      /*let gray = Common.random(0,255);
      var curr_color = `rgb(${gray},${gray},${gray})`*/
      colors = ["#D6E6F2", "#B9D7EA", "#769FCD"]; // Switched to the blue tones
      var curr_color = Common.choose(colors);
    } else {

      var curr_color = `rgb(${Common.random(0, 255)},${Common.random(0, 255)},${Common.random(0, 255)})`;
    }

    //ratio = 1;
    var radius = (Math.sqrt(ratio)) * Common.random(5, 30);

    //console.log(ratio,radius);
    //console.log(window.innerWidth , window.screen.availWidth);

    var circles = Bodies.circle(x + Common.random(-5, 5), y + Common.random(-5, 5), radius,
      {
        density: 0.0001,
        restitution: 0.25,
        friction: 0.1,
        //url: '#',
        render: {
          fillStyle: curr_color,
          strokeStyle: 'white',
          lineWidth: 2
        }
      });

    if (apply_force == 1) {
      Body.applyForce(circles, { x: circles.position.x, y: circles.position.y }, { x: Common.random(-0.03, 0.03), y: Common.random(-0.03, 0.03) })
    }

    Composite.add(world, circles);
    circle_array.push(circles);
    //setTimeout(function(){Composite.remove(world,circles);},1000);
  };

  function del_obj(el) {
    for (let i = 0; i < circle_array.length; i++) {
      Composite.remove(iEngine.world, circle_array[i]);
    }
  }

  var j = 0;
  function color_obj(el) {
    setTimeout(() => {
      circle_array[j].render.fillStyle = `rgb(${Common.random(0, 255)},${Common.random(0, 255)},${Common.random(0, 255)})`;
      j++;
      if (j < circle_array.length) { color_obj() }
      else { j = 0; }
    }, 10);
  }

  let mode = 2;
  function gravity_obj(el) {
    switch (mode) {
      case 1:
        iEngine.gravity.y = 0.8;
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

  var i = 1;
  function party_obj(el) {
    setTimeout(() => {
      create_circles(Common.random(0, window.innerWidth), Common.random(0, window.innerHeight), "_", 1);
      i++;
      if (i < 200) { party_obj() }
      else { i = 1; }
    }, 10);
  }

  function refresh_page(el) {
    window.location.reload()
  }

  function create_walls() {
    const wall_bottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true, density: 10 });
    const wall_top = Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth, 10, { isStatic: true, density: 10 });
    const wall_left = Bodies.rectangle(-10, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, density: 10 });
    const wall_right = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, density: 10 });
    Composite.add(world, [wall_bottom, wall_top, wall_left, wall_right]);
  }

  function create_env_interaction_buttons() {

    var button_ratio;
    if (window.innerWidth > window.innerHeight) {
      button_ratio = ratio;
    } else {
      button_ratio = ratio / 2;
    }

    var button_del_obj = Bodies.circle(window.innerWidth * 0.95, 350 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "del_obj",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/trash-svgrepo-com.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_color_obj = Bodies.circle(window.innerWidth * 0.95, 150 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "color_obj",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/color-palette-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_gravity_obj = Bodies.circle(window.innerWidth * 0.95, 250 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "gravity_obj",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/gravity-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_refresh_page = Bodies.circle(window.innerWidth * 0.95, 450 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "refresh_page",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/refresh-cw-alt-4-svgrepo-com.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio,
        }
      }
    });

    var button_party_obj = Bodies.circle(window.innerWidth * 0.95, 50 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "party_obj",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/party-horn-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio,
        }
      }
    });

    link0 = Constraint.create({
      pointA: { x: window.innerWidth * 0.90, y: 0 },
      bodyB: button_party_obj,
      stiffness: 0.1,
      length: 50 * button_ratio,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link1 = Constraint.create({
      bodyA: button_party_obj,
      bodyB: button_color_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link2 = Constraint.create({
      bodyA: button_color_obj,
      bodyB: button_gravity_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link3 = Constraint.create({
      bodyA: button_gravity_obj,
      bodyB: button_del_obj,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link4 = Constraint.create({
      bodyA: button_del_obj,
      bodyB: button_refresh_page,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    World.add(world, [link0, link1, link2, link3, link4]);
    World.add(world, [button_color_obj, button_del_obj, button_gravity_obj, button_party_obj, button_refresh_page])
  }

  function SVG_to_object() {
    var vertexSets = [],
      color = Common.choose(['#222831']);

    $('#svg').find('path').each(function (i, path) {
      //console.log(i);
      var v = Bodies.fromVertices(1, 1, Svg.pathToVertices(path, 15), {
        url: "ika",
        restitution: 0.1,
        //density:1,
        //frictionAir:0.01,
        render: {
          fillStyle: color,
          strokeStyle: color
        }
      }, true);
      console.log(v)

      //Body.setMass(v,1);
      if (i == 2) {
        Body.set(v, "position", { x: window.innerWidth / 2 + ((i) * 150), y: window.innerHeight / 2 });
      } else {
        Body.set(v, "position", { x: window.innerWidth / 2 + ((i) * 80), y: window.innerHeight / 2 });

      }


      var svg_ratio = ratio;
      if (window.innerWidth > window.innerHeight) {
        svg_ratio = ratio * 2
      }

      Body.scale(v, svg_ratio, svg_ratio);

      vertexSets.push(v);
    });

    World.add(world, vertexSets);
  }

  const title_box = {
    w: 140,
    h: 80,
    body: Matter.Bodies.rectangle(window.innerWidth - (window.innerWidth * 0.5), window.innerHeight - (window.innerHeight * 0.5), 5, 5, { isStatic: true }),//
    elem: document.querySelector("#box"),
    render() {
      const { x, y } = this.body.position;
      this.elem.style.top = `${y - this.h / 2}px`;
      this.elem.style.left = `${x - this.w / 2}px`;
      this.elem.style.transform = `rotate(${this.body.angle}rad)`;
    },
  };
  //World.add(world,box.body); //Don't need to see the box beacuse i just want to show the text 

  var link_button = {
    w: window.innerWidth * 0.2,
    h: window.innerHeight * 0.07,
    body: Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight * 0.1,
      window.innerWidth * 0.2,
      window.innerHeight * 0.07,
      {
        restitution: 1,
        //isStatic: true,
        friction: 0.1,
        url:'useless_projects',
        render: {
          fillStyle: "#EBB55F",
          strokeStyle: '#050321',
          lineWidth: 5,
          opacity: 0.8,
        }
      }
    ),
    elem: document.querySelector("#link_button"),
    render() {
      const { x, y } = this.body.position;
      const angle = this.body.angle;

      this.elem.style.top = `${y - this.h / 2}px`;
      this.elem.style.left = `${x - this.w / 2}px`;

      this.elem.style.transform = `rotate(${angle}rad)`;

      this.elem.style.width = `${this.w}px`;
      this.elem.style.height = `${this.h}px`;
    },
  };

  Composite.add(world, link_button.body);

  Composite.add(world, Constraint.create({
    bodyA: link_button.body,
    pointB: { x: window.innerWidth / 2, y: 0 },
    stiffness: 0.7,
    length: 100,
    render: {
      lineWidth: 1,
      type: 'line',
      anchors: false,
      strokeStyle: '#393E46'
    }
  }
  ));

  (function rerender() {
    link_button.render();
    title_box.render();
    Matter.Engine.update(iEngine);
    requestAnimationFrame(rerender);
  })();

  function create_social_buttons() {
    var button_ratio;
    if (window.innerWidth > window.innerHeight) {
      button_ratio = ratio;
    } else {
      button_ratio = ratio / 2;
    }

    var button_github = Bodies.circle(50, 50 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "https://github.com/ikaganacar1",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/github-svgrepo-com.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_instagram = Bodies.circle(50, 150 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "https://www.instagram.com/ikaganacar/",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/instagram-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_x = Bodies.circle(50, 250 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "https://x.com/ikaganacar",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/twitter-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_linkedin = Bodies.circle(50, 350 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "https://www.linkedin.com/in/ismail-kağan-acar-24481b24b/",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/linkedin-svgrepo-com-1.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    var button_mail = Bodies.circle(50, 450 * button_ratio, 30 * button_ratio, {
      isStatic: false,
      url: "mailto:acarismailkagan@gmail.com",
      restitution: 0.25,
      friction: 0.1,
      render: {
        lineWidth: 2,
        sprite: {
          texture: "https://media.publit.io/file/mail-alt-3-svgrepo-com.png",
          xScale: 0.2083 * button_ratio,
          yScale: 0.2083 * button_ratio
        }
      }
    });

    link0 = Constraint.create({
      pointA: { x: window.innerWidth * 0.1, y: 0 },
      bodyB: button_github,
      stiffness: 0.1,
      length: 50 * button_ratio,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link1 = Constraint.create({
      bodyA: button_github,
      bodyB: button_instagram,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link2 = Constraint.create({
      bodyA: button_instagram,
      bodyB: button_x,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link3 = Constraint.create({
      bodyA: button_x,
      bodyB: button_linkedin,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    link4 = Constraint.create({
      bodyA: button_linkedin,
      bodyB: button_mail,
      stiffness: 0.1,
      render: {
        lineWidth: 1,
        type: 'line',
        anchors: false,
        strokeStyle: '#393E46'
      }
    });

    World.add(world, [link0, link1, link2, link3, link4]);
    World.add(world, [button_github, button_instagram, button_x, button_linkedin, button_mail,]);

  }//end of create social button function

  //detect mouse
  let mouse = Mouse.create(iRender.canvas);
  let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
    element: document.body,
    constraint: {
      render: {
        visible: false
      },
      stiffness: 0.2
    }
  }); Matter.World.add(world, mouseConstraint);
  iRender.mouse = mouse;
  
  //event detections
  let check_if_clicked = false;
  Events.on(mouseConstraint, 'mousedown', function (event) {

    Body.set(title_box.body, "position", { x: -1000 });
    check_if_clicked = true;
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
            check_if_clicked = false;
          }

          else if (bodyUrl == "color_obj") {
            color_obj();
            check_if_clicked = false;
          }

          else if (bodyUrl == "gravity_obj") {
            gravity_obj();
            check_if_clicked = false;
          }

          else if (bodyUrl == "party_obj") {
            party_obj();
            check_if_clicked = false;
          }

          else if (bodyUrl == "refresh_page") {
            refresh_page();
            check_if_clicked = false;
          }

          else if (bodyUrl == "ika") {
            check_if_clicked = false;
          }

          else if (bodyUrl != undefined) {
            window.open(bodyUrl, '_self');
            check_if_clicked = false;
            console.log("Hyperlink was opened");
          }

          break;
        }
      }
    }
  });

  Events.on(mouseConstraint, 'mouseup', function (event) {
    check_if_clicked = false;
  });

  //if it is suitable create circles when clicked
  Events.on(iEngine, 'afterUpdate', function (event) {
    if (!mouse.position.x) return;

    if (check_if_clicked) {
      create_circles(mouse.position.x, mouse.position.y, "gray", 0);
    }
  });

  SVG_to_object();
  create_walls();
  create_env_interaction_buttons();
  create_social_buttons();

  Render.run(iRender);
  Runner.run(iRunner, iEngine);
}
catch (e) { console.log(e) }//global try catch to see the errors
