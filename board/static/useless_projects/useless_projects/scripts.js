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


    let mouse = Mouse.create(iRender.canvas);
    let mouseConstraint = Matter.MouseConstraint.create(iEngine, {
        element: document.body,
        constraint: {
            render: {
                visible: false
            },
            stiffness: 0.8
        }
    }); Matter.World.add(world, mouseConstraint);

    function create_walls() {
        //const wall_bottom = Bodies.rectangle(window.innerWidth/2,window.innerHeight,window.innerWidth,10,{isStatic: true,density:10});
        const wall_top = Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth * 2, 10, { isStatic: true, density: 10, restitution: 0 });
        //const wall_left = Bodies.rectangle(-10, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, restitution: 0,density: 10 });
        //const wall_right = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true,restitution: 0, density: 10 });

        Composite.add(world, [wall_top,]);
    }

    create_walls();

    var ratio = (1253376 / (window.screen.availWidth * window.screen.availHeight));

    if (ratio < 1) {
        ratio = 1;
    }
    console.log(ratio)


    function create_balloons(x, y, num, obj2 = null) {
        let rect_list = [];

        var balloon = Bodies.circle(x + Common.random(-50, 50), y + Common.random(-50, 50), (Math.sqrt(ratio)) * 30,
            {
                //density:0.001,
                restitution: 0,
                friction: 0.1,
                render: {
                    //fillStyle:"#ff0000",
                    strokeStyle: 'gray',
                    lineWidth: 2
                }
            });

        Composite.add(world, balloon);
        if (ratio > 1) {
            var size_w = 3;
            var size_h = 3;
        } else {
            var size_w = 1;
            var size_h = 2;
        }

        for (let i = 0; i < num; i++) {
            var rect = Bodies.rectangle(x, y + (i * size_h), size_w, size_h,
                {
                    //density:0.001,
                    restitution: 0,
                    friction: 0.1,
                    render: {
                        fillStyle: "#00000099",
                        //strokeStyle:'gray',
                        //lineWidth:2
                    }
                });

            Composite.add(world, rect);
            rect_list.push(rect);
        }

        for (var i = 0; i <= rect_list.length; i++) {
            if (i == 0) {
                var link = Constraint.create({
                    bodyA: balloon,
                    bodyB: rect_list[i],
                    stiffness: 0.7,
                    length: 20,
                    render: { visible: false }

                });
            }
            else if (i != rect_list.length) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    bodyB: rect_list[i],
                    stiffness: 1,
                    render: { visible: false }
                });
            }

            if (i == rect_list.length && obj2 != null) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    bodyB: obj2,
                    stiffness: 0.7,
                    length: 20,
                    render: { visible: false }
                });

            }

            Composite.add(world, link);
        }

        return balloon;
    }

    function rope_link_to_obj(x, y, num, obj1, obj2) {
        let rect_list = [];

        for (let i = 0; i < num; i++) {
            var rect = Bodies.rectangle(x, y + (i * 2), 1, 2,
                {
                    restitution: 0,
                    friction: 0.1,
                    render: {
                        fillStyle: "#ffffff66",
                        strokeStyle: 'gray',
                        lineWidth: 2
                    }
                });

            Composite.add(world, rect);
            rect_list.push(rect);
        }

        for (var i = 0; i <= rect_list.length; i++) {
            if (i == 0) {
                var link = Constraint.create({
                    bodyA: obj1,
                    bodyB: rect_list[i],
                    stiffness: 1,
                    length: 20,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46088'
                    }

                });
            }
            else if (i != rect_list.length) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    bodyB: rect_list[i],
                    stiffness: 1,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46'
                    }
                });
            }

            if (i == rect_list.length) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    bodyB: obj2,
                    stiffness: 1,
                    length: 20,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46'
                    }
                });

            }

            Composite.add(world, link);
        }
    };

    function rope_link_to_ground(x, y, num, obj1, point1) {
        let rect_list = [];
        let link_list = [];

        for (let i = 0; i < num; i++) {
            var rect = Bodies.rectangle(x, y + (i * 2), 1, 2,
                {
                    restitution: 0,
                    friction: 0.1,
                    render: {
                        fillStyle: "#ffffff66",
                        strokeStyle: 'gray',
                        lineWidth: 2
                    }
                });

            Composite.add(world, rect);
            rect_list.push(rect);
        }

        for (var i = 0; i <= rect_list.length; i++) {
            if (i == 0) {
                var link = Constraint.create({
                    bodyA: obj1,
                    bodyB: rect_list[i],
                    stiffness: 1,
                    length: 20,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46088'
                    }

                });
            }
            else if (i != rect_list.length) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    bodyB: rect_list[i],
                    stiffness: 1,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46'
                    }
                });
            }

            if (i == rect_list.length) {
                var link = Constraint.create({
                    bodyA: rect_list[i - 1],
                    pointB: point1,
                    stiffness: 1,
                    length: 20,
                    render: {
                        lineWidth: 1,
                        //type: 'line',
                        anchors: false,
                        strokeStyle: '#393E46'
                    }
                });

            }

            Composite.add(world, link);
            link_list.push(link);
        }
        return (link_list.concat(rect_list));
    };

    if (ratio > 1) {
        var sign_w = window.innerWidth * 0.7;
        var sign_h = window.innerHeight * 0.05;
    } else {
        var sign_w = window.innerWidth * 0.3;
        var sign_h = window.innerHeight * 0.1;

    }
    var sign1 = {
        w: sign_w,
        h: sign_h,
        body: Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight * 0.8,
            sign_w,
            sign_h,
            {
                restitution: 0,
                //isStatic: true,
                inertia: Infinity,
                density: 0.001,
                friction: 0.1,
                render: {
                    fillStyle: "#B9D7EA",
                    strokeStyle: 'gray',
                    lineWidth: 2,
                    opacity: 0.8,
                }
            }
        ),
        elem: document.querySelector("#sign1"),
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

    if (ratio > 1) {
        var link_w1 = window.innerWidth * 0.15;
        var link_h1 = window.innerHeight * 0.03;

        var link_w2 = window.innerWidth * 0.15;
        var link_h2 = window.innerHeight * 0.03;
    } else {
        var link_w1 = window.innerWidth * 0.13;
        var link_h1 = window.innerHeight * 0.05;

        var link_w2 = window.innerWidth * 0.05;
        var link_h2 = window.innerHeight * 0.05;

    }

    var link_button1 = {
        w: link_w1,
        h: link_h1,
        body: Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight * 0.83,
            link_w2,
            link_h2,
            {
                restitution: 0,
                friction: 1,

                url: 'useless_projects/howmuchmoneyleft',
                render: {
                    fillStyle: "#EBB55F",
                    strokeStyle: '#050321',
                    lineWidth: 5,
                    opacity: 0.8,
                }
            }
        ),
        elem: document.querySelector("#link_button1"),
        render() {
            const { x, y } = this.body.position;
            const angle = this.body.angle;

            this.elem.style.top = `${y - this.h / 2}px`;
            this.elem.style.left = `${x - this.w / 2}px`;

            this.elem.style.transform = `rotate(${angle}rad)`;

            this.elem.style.width = `${this.w}px`;
            this.elem.style.height = `${this.h}px`;
        },
    };/*
    link_button1.body.collisionFilter = {
        'group': -1,
        'category': 2,
        'mask': 0,
      };*/

    Composite.add(world, [sign1.body, link_button1.body]);

    if (ratio > 1) {
        var length = 200;
    } else {
        var length = 100;
    }
    Composite.add(world, Constraint.create({
        bodyA: sign1.body,
        bodyB: link_button1.body,
        stiffness: 0.7,
        length: length,
        render: {
            lineWidth: 1,
            //type: 'line',
            anchors: false,
            strokeStyle: '#393E46'
        }
    }
    ));

    if (ratio > 1) {
        var scissors_w1 = window.innerWidth * 0.15;
        var scissors_h1 = window.innerHeight * 0.03;

        var scissors_w2 = window.innerWidth * 0.15;
        var scissors_h2 = window.innerHeight * 0.03;
    } else {
        var scissors_w1 = window.innerWidth * 0.13;
        var scissors_h1 = window.innerHeight * 0.05;

        var scissors_w2 = window.innerWidth * 0.05;
        var scissors_h2 = window.innerHeight * 0.05;

    }

    var scissors_button = {
        w: scissors_w1,
        h: scissors_h1,
        body: Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight * 0.05,
            scissors_w2,
            scissors_h2,
            {
                restitution: 0,
                friction: 1,
                isStatic: true,
                url: 'cut',
                render: {
                    fillStyle: "#EBB55F",
                    strokeStyle: '#050321',
                    lineWidth: 5,
                    opacity: 0.8,
                }
            }
        ),
        elem: document.querySelector("#scissors_button"),
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
    scissors_button.body.collisionFilter = {
        'group': -1,
        'category': 2,
        'mask': 0,
    };

    Composite.add(world, scissors_button.body)

    if (ratio > 1) {
        document.getElementById("link_p").style.fontSize = "70px";
        document.getElementById("sign_p").style.fontSize = "100px";
        document.getElementById("cut_p").style.fontSize = "80px";
    }

    (function rerender() {
        scissors_button.render()
        sign1.render();
        link_button1.render();
        Matter.Engine.update(iEngine);
        requestAnimationFrame(rerender);
    })();


    if (ratio > 1) {
        var length_rope = 50;
    } else {
        var length_rope = 30;
    }
    var balloon_list = [];
    for (let i = 0; i < 20; i++) {
        var tmp = create_balloons(window.innerWidth / 2, window.innerHeight * 0.7, length_rope, sign1.body);
        balloon_list.push(tmp);
    }

    if (ratio > 1) {
        var num = 5;
    } else {
        var num = 3;
    }

    rope_list = rope_link_to_ground(window.innerWidth / 2, window.innerHeight, num, sign1.body, { x: window.innerWidth / 2, y: window.innerHeight });

    if (ratio > 1) {
        var force = 0.00012;
    } else {
        var force = 0.00010;
    }

    Events.on(iEngine, 'beforeUpdate', function () {
        //? total force should be 0.00002 i guess?
        //! size changes mass so this ratio not stable
        //? i can handle it with density i guess
        //* nevermind arranged after several trials

        //sign1.body.force.y += sign1.body.mass * 0.0002;

        for (let i = 0; i < balloon_list.length; i++) {
            balloon_list[i].force.y -= balloon_list[i].mass * force;
        }

    });

    Events.on(mouseConstraint, 'mousedown', function (event) {

        var mc = event.source;
        var bodies = world.bodies;

        if (!mc.bodyB) {
            for (i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (Matter.Bounds.contains(body.bounds, mc.mouse.position)) {
                    if (body.url == "cut") {
                        for (let i = 0; i < rope_list.length; i++) {
                            Composite.remove(iEngine.world, rope_list[i]);
                        }

                    }
                    else if (body.url != undefined) {
                        window.open(body.url, '_self');
                        check_if_clicked = false;

                    }

                    break;
                }
            }
        }
    });


    Render.run(iRender);
    Runner.run(iRunner, iEngine);

} catch (e) { console.log(e) }//global try catch to see the errors
