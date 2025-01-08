try {
  try {
    if (typeof MatterWrap !== 'undefined') {
      Matter.use('matter-wrap')
    } else {
      Matter.use(require('matter-wrap'))
    }
  } catch (e) {}

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
    Events = Matter.Events
  //Composites = Matter.Composites,
  //Vector= Matter.Vector,
  //Vertices = Matter.Vertices,
  //MouseConstraint = Matter.MouseConstraint,

  const iEngine = Engine.create({ gravity: { y: 0 } }),
    world = iEngine.world

  const iRunner = Runner.create()

  const iRender = Render.create({
    element: document.body,
    engine: iEngine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: 'transparent',
      wireframeBackground: 'transparent'
      //showAngleIndicator: true,
    }
  })

  let mouse = Mouse.create(iRender.canvas)
  let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
    element: document.body,
    constraint: {
      render: {
        visible: false
      },
      stiffness: 0.8
    }
  })
  Matter.World.add(world, mouseConstraint)

  function create_walls () {
    const wall_bottom = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight,
      window.innerWidth,
      10,
      { isStatic: true, density: 10 }
    )
    const wall_top = Bodies.rectangle(
      window.innerWidth / 2,
      -10,
      window.innerWidth * 2,
      10,
      { isStatic: true, density: 10, restitution: 0 }
    )
    //const wall_left = Bodies.rectangle(-10, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, restitution: 0,density: 10 });
    //const wall_right = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true,restitution: 0, density: 10 });

    Composite.add(world, [wall_top, wall_bottom])
  }

  create_walls()

  var ratio = 1253376 / (window.screen.availWidth * window.screen.availHeight)

  if (ratio < 1) {
    ratio = 1
  }
  console.log(ratio)

  function create_balloons (x, y, num, slide_x, slide_y, obj2 = null) {
    let rect_list = []

    var balloon = Bodies.circle(
      x + Common.random(-50, 50),
      y + Common.random(-50, 50),
      Math.sqrt(ratio) * 30,
      {
        //density:0.001,
        restitution: 0.1,
        friction: 0.1,
        render: {
          //fillStyle:"#ff0000",
          strokeStyle: 'gray',
          lineWidth: 2
        }
      }
    )

    Composite.add(world, balloon)
    if (ratio > 1) {
      var size_w = 3
      var size_h = 3
    } else {
      var size_w = 1
      var size_h = 2
    }

    for (let i = 0; i < num; i++) {
      var rect = Bodies.rectangle(x, y + i * size_h, size_w, size_h, {
        //density:0.001,
        restitution: 0,
        friction: 0.1,
        render: {
          fillStyle: '#00000099'
          //strokeStyle:'gray',
          //lineWidth:2
        }
      })
      rect.collisionFilter = {
        group: -1,
        category: 1,
        mask: 0
      }

      Composite.add(world, rect)
      rect_list.push(rect)
    }

    for (var i = 0; i <= rect_list.length; i++) {
      if (i == 0) {
        var link = Constraint.create({
          bodyA: balloon,
          bodyB: rect_list[i],
          stiffness: 0.7,
          length: 20,
          render: { visible: false }
        })
      } else if (i != rect_list.length) {
        var link = Constraint.create({
          bodyA: rect_list[i - 1],
          bodyB: rect_list[i],
          stiffness: 1,
          render: { visible: false }
        })
      }

      if (i == rect_list.length && obj2 != null) {
        var link = Constraint.create({
          bodyA: rect_list[i - 1],
          bodyB: obj2,
          pointB: { x: slide_x, y: slide_y },
          stiffness: 0.7,
          length: 20,
          render: { visible: false }
        })
      }

      Composite.add(world, link)
    }

    return balloon
  }

  function createRagdoll (x, y) {
    // aliases
    const { Bodies, Body, Composite, Constraint } = Matter

    const defaultCollisionGroup = -1

    /*********************
     * Define Body Parts *
     *********************/
    const headOptions = {
      restitution: 0,
      friction: 1,
      frictionAir: 0.05,

      render: {
        fillStyle: '#3C3D37'
      }
    }
    const chestOptions = {
      restitution: 0,

      friction: 1,
      frictionAir: 0.05,
      collisionFilter: {
        group: defaultCollisionGroup - 1
      },
      chamfer: {
        radius: 20
      },
      label: 'chest',
      render: {
        fillStyle: '#181C14'
      }
    }
    const armOptions = {
      restitution: 0,

      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: defaultCollisionGroup
      },
      chamfer: {
        radius: 10
      },
      render: {
        fillStyle: '#3C3D37'
      }
    }
    const legOptions = {
      restitution: 0,

      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: defaultCollisionGroup - 1
      },
      chamfer: {
        radius: 10
      },
      render: {
        fillStyle: '#3C3D37'
      }
    }

    const lowerLegOptions = {
      friction: 1,
      frictionAir: 0.03,
      collisionFilter: {
        group: defaultCollisionGroup - 1
      },
      chamfer: {
        radius: 2
      },
      render: {
        fillStyle: '#181C14'
      }
    }

    const head = Bodies.circle(x, y - 70, 30, headOptions)
    chest = Bodies.rectangle(x, y, 60, 80, chestOptions)
    chest.size = 40 // To determine overlap of goal
    const rightUpperArm = Bodies.rectangle(
      x + 40,
      y - 20,
      20,
      40,
      Object.assign({}, armOptions)
    )
    const rightLowerArm = Bodies.rectangle(
      x + 40,
      y + 20,
      20,
      60,
      Object.assign({}, armOptions)
    )
    const leftUpperArm = Bodies.rectangle(
      x - 40,
      y - 20,
      20,
      40,
      Object.assign({}, armOptions)
    )
    const leftLowerArm = Bodies.rectangle(
      x - 40,
      y + 20,
      20,
      60,
      Object.assign({}, armOptions)
    )
    const leftUpperLeg = Bodies.rectangle(
      x - 20,
      y + 60,
      20,
      40,
      Object.assign({}, legOptions)
    )
    const rightUpperLeg = Bodies.rectangle(
      x + 20,
      y + 60,
      20,
      40,
      Object.assign({}, legOptions)
    )
    const leftLowerLeg = Bodies.rectangle(
      x - 20,
      y + 100,
      20,
      60,
      Object.assign({}, lowerLegOptions)
    )
    const rightLowerLeg = Bodies.rectangle(
      x + 20,
      y + 100,
      20,
      60,
      Object.assign({}, lowerLegOptions)
    )

    const legTorso = Body.create({
      parts: [chest, leftUpperLeg, rightUpperLeg],
      collisionFilter: {
        group: defaultCollisionGroup - 1
      }
    })

    /*****************************
     * Define Constraints/Joints *
     *****************************/
    const chestToRightUpperArm = Constraint.create({
      bodyA: legTorso,
      pointA: {
        x: 25,
        y: -40
      },
      pointB: {
        x: -5,
        y: -10
      },
      bodyB: rightUpperArm,
      stiffness: 0.2,
      render: {
        visible: false
      }
    })
    const chestToLeftUpperArm = Constraint.create({
      bodyA: legTorso,
      pointA: {
        x: -25,
        y: -40
      },
      pointB: {
        x: 5,
        y: -10
      },
      bodyB: leftUpperArm,
      stiffness: 0.2,
      render: {
        visible: false
      }
    })

    const upperToLowerRightArm = Constraint.create({
      bodyA: rightUpperArm,
      bodyB: rightLowerArm,
      pointA: {
        x: 0,
        y: 15
      },
      pointB: {
        x: 0,
        y: -20
      },
      stiffness: 0.2,
      render: {
        visible: false
      }
    })

    const upperToLowerLeftArm = Constraint.create({
      bodyA: leftUpperArm,
      bodyB: leftLowerArm,
      pointA: {
        x: 0,
        y: 15
      },
      pointB: {
        x: 0,
        y: -20
      },
      stiffness: 0.2,
      render: {
        visible: false
      }
    })

    const upperToLowerLeftLeg = Constraint.create({
      bodyA: legTorso,
      bodyB: leftLowerLeg,
      pointA: {
        x: -20,
        y: 60
      },
      pointB: {
        x: 0,
        y: -25
      },
      stiffness: 0.2,
      render: {
        visible: false
      }
    })

    const upperToLowerRightLeg = Constraint.create({
      bodyA: legTorso,
      bodyB: rightLowerLeg,
      pointA: {
        x: 20,
        y: 60
      },
      pointB: {
        x: 0,
        y: -25
      },
      stiffness: 0.2,
      render: {
        visible: false
      }
    })

    const headContraint = Constraint.create({
      bodyA: head,
      pointA: {
        x: 0,
        y: 20
      },
      pointB: {
        x: 0,
        y: -50
      },
      bodyB: legTorso,
      stiffness: 0.3,
      render: {
        visible: false
      }
    })

    window.addEventListener('keydown', event => {
      const FORCE_VALUE = 0.05
      switch (event.keyCode) {
        case 81: //q
          Matter.Body.applyForce(leftLowerArm, leftLowerArm.position, {
            x: -FORCE_VALUE,
            y: -FORCE_VALUE
          })
          break
        case 87: //w
          Matter.Body.applyForce(leftLowerLeg, leftLowerLeg.position, {
            x: -FORCE_VALUE,
            y: FORCE_VALUE
          })
          break
        case 79: //o
          Matter.Body.applyForce(rightLowerArm, rightLowerArm.position, {
            x: FORCE_VALUE,
            y: -FORCE_VALUE
          })
          break
        case 80: //p
          Matter.Body.applyForce(rightLowerLeg, rightLowerLeg.position, {
            x: FORCE_VALUE,
            y: FORCE_VALUE
          })
          break
      }
    })

    const person = Composite.create({
      bodies: [
        legTorso,
        head,
        leftLowerArm,
        leftUpperArm,
        rightLowerArm,
        rightUpperArm,
        leftLowerLeg,
        rightLowerLeg
      ],
      constraints: [
        upperToLowerLeftArm,
        upperToLowerRightArm,
        chestToLeftUpperArm,
        chestToRightUpperArm,
        headContraint,
        upperToLowerLeftLeg,
        upperToLowerRightLeg
      ]
    })
    return person
  }

  var bottom = Bodies.rectangle(800, 800, 200, 20, {
    restitution: 0,
    //isStatic: true,
    inertia: Infinity,
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.1,
    render: {
      fillStyle: '#603F26',
      strokeStyle: 'gray',
      lineWidth: 2,
      opacity: 0.8
    }
  })

  var left = Bodies.rectangle(700, 700, 20, 200, {
    restitution: 0,
    //isStatic: true,
    inertia: Infinity,
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.1,
    render: {
      fillStyle: '#603F26',
      strokeStyle: 'gray',
      lineWidth: 2,
      opacity: 0.8
    }
  })

  var right = Bodies.rectangle(900, 700, 20, 200, {
    restitution: 0,
    //isStatic: true,
    inertia: Infinity,
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.1,
    render: {
      fillStyle: '#603F26',
      strokeStyle: 'gray',
      lineWidth: 2,
      opacity: 0.8
    }
  })

  balloon_cart = Body.create({
    parts: [bottom, left, right],
    frictionAir: 0.1
  })
  Body.setPosition(balloon_cart, {
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.9
  })

  var ragdoll = createRagdoll(bottom.position.x, bottom.position.y - 150)
  Composite.add(world, [balloon_cart, ragdoll])

  if (ratio > 1) {
    var pull_down_w1 = window.innerWidth * 0.3
    var pull_down_h1 = window.innerHeight * 0.03

    var pull_down_w2 = window.innerWidth * 0.3
    var pull_down_h2 = window.innerHeight * 0.03
  } else {
    var pull_down_w1 = window.innerWidth * 0.18
    var pull_down_h1 = window.innerHeight * 0.05

    var pull_down_w2 = window.innerWidth * 0.18
    var pull_down_h2 = window.innerHeight * 0.05
  }

  var pull_down_button = {
    w: pull_down_w1,
    h: pull_down_h1,
    body: Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight * 0.05,
      pull_down_w2,
      pull_down_h2,
      {
        restitution: 0,
        isStatic: true,
        url: 'cut',
        render: {
          fillStyle: '#EBB55F',
          strokeStyle: '#050321',
          lineWidth: 5,
          opacity: 0.8
        }
      }
    ),
    elem: document.querySelector('#pull_down_button'),
    render () {
      const { x, y } = this.body.position
      const angle = this.body.angle

      this.elem.style.top = `${y - this.h / 2}px`
      this.elem.style.left = `${x - this.w / 2}px`

      this.elem.style.transform = `rotate(${angle}rad)`

      this.elem.style.width = `${this.w}px`
      this.elem.style.height = `${this.h}px`
    }
  }
  pull_down_button.body.collisionFilter = {
    group: -1,
    category: 2,
    mask: 0
  }

  Composite.add(world, pull_down_button.body)

  if (ratio > 1) {
    document.getElementById('cut_p').style.fontSize = '80px'
  }

  ;(function rerender () {
    pull_down_button.render()
    Matter.Engine.update(iEngine)
    requestAnimationFrame(rerender)
  })()

  if (ratio > 1) {
    var length_rope = 80
  } else {
    var length_rope = 50
  }
  var balloon_list = []
  for (let i = 0; i < 10; i++) {
    var tmp1 = create_balloons(
      window.innerWidth / 2,
      window.innerHeight * 0.6,
      length_rope,
      -100,
      -100,
      balloon_cart
    )
    var tmp2 = create_balloons(
      window.innerWidth / 2,
      window.innerHeight * 0.6,
      length_rope,
      100,
      -100,
      balloon_cart
    )
    balloon_list.push(tmp1)
    balloon_list.push(tmp2)
  }

  if (ratio > 1) {
    var force_up = 0.0002
  } else {
    var force_up = 0.0001
  }
  var gravity = false
  Events.on(iEngine, 'beforeUpdate', function () {
    //? total force should be 0.00002 i guess?
    //! size changes mass so this ratio not stable
    //? i can handle it with density i guess
    //* nevermind arranged after several trials

    if (gravity) {
      balloon_cart.force.y += 12 * 0.002
      ragdoll.bodies[6].force.y += 1.2 * 0.001
      ragdoll.bodies[7].force.y += 1.2 * 0.001
    }

    balloon_cart.force.y += 12 * 0.0001
    ragdoll.bodies[6].force.y += 1.2 * 0.0005
    ragdoll.bodies[7].force.y += 1.2 * 0.0005

    for (let i = 0; i < balloon_list.length; i++) {
      balloon_list[i].force.y -= 2.8 * force_up
    }
  })

  console.log(
    `balloon:${balloon_list[0].mass}\nballoon_cart:${balloon_cart.mass}\nleg1:${ragdoll.bodies[6].mass}\nleg2:${ragdoll.bodies[7].mass}`
  )

  Events.on(mouseConstraint, 'mousedown', function (event) {
    var mc = event.source
    var bodies = world.bodies

    if (!mc.bodyB) {
      for (i = 0; i < bodies.length; i++) {
        var body = bodies[i]
        if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {
          if (body.url == 'cut') {
            if (gravity) {
              gravity = false
            } else {
              gravity = true
            }
          } else if (body.url != undefined) {
            window.open(body.url, '_self')
            check_if_clicked = false
          }
          break
        }
      }
    }
  })

  Render.run(iRender)
  Runner.run(iRunner, iEngine)
} catch (e) {
  console.log(e)
} //global try catch to see the errors
