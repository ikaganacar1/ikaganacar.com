try {

    try {
        if (typeof MatterWrap !== 'undefined') { Matter.use('matter-wrap'); }
        else { Matter.use(require('matter-wrap')); }
    } catch (e) { }

    const   Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Common = Matter.Common,
            Constraint = Matter.Constraint,
            Mouse = Matter.Mouse,
            Events = Matter.Events;


    const iEngine = Engine.create({ gravity: { y: 0 } }),
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
    Render.run(iRender);
    Runner.run(iRunner, iEngine);

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

    function create_walls() {
        const wall_bottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 10, window.innerWidth, 10, { isStatic: true, density: 10 });
        const wall_top = Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth * 2, 10, { isStatic: true, density: 10, restitution: 0 });
        const wall_left = Bodies.rectangle(-10, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, restitution: 0, density: 10 });
        const wall_right = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, restitution: 0, density: 10 });

        Composite.add(world, [wall_top, wall_bottom, wall_left, wall_right]);
    }

    create_walls();

    var ratio = (1253376 / (window.screen.availWidth * window.screen.availHeight));

    if (ratio < 1) {
        ratio = 1;
    }
    console.log(ratio)

   

    Events.on(mouseConstraint, 'mousedown', function (event) {

        var mc = event.source;
        var bodies = world.bodies;

        if (!mc.bodyB) {
            for (i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {

                    if (body.url != undefined) {
                        window.open(body.url, '_self');
                        check_if_clicked = false;

                    }

                    break;
                }
            }
        }
    });




} catch (e) { console.log(e) }//global try catch to see the errors on browser console
