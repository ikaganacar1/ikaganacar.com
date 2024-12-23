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

    function create_page_sign(sign_tag, link_tag, link, sign_x, sign_y, link_x, link_y, isLinked = true,sign_ratio=1) {


        if (ratio > 1) {
            var sign_w = window.innerWidth * 0.7;
            var sign_h = window.innerHeight * 0.05;

            var link_w1 = window.innerWidth * 0.15;
            var link_h1 = window.innerHeight * 0.03;

            var link_w2 = window.innerWidth * 0.15;
            var link_h2 = window.innerHeight * 0.03;

            var length = 200;
            if (sign_ratio == 1){
            document.getElementById(`${link_tag}_p`).style.fontSize = "70px";
            document.getElementById(`${sign_tag}_p`).style.fontSize = "95px";
        }

        } else {
            var sign_w = window.innerWidth * 0.3;
            var sign_h = window.innerHeight * 0.1;

            var link_w1 = window.innerWidth * 0.13;
            var link_h1 = window.innerHeight * 0.05;

            var link_w2 = window.innerWidth * 0.05;
            var link_h2 = window.innerHeight * 0.05;

            var length = 100;

        }
        
        sign_w = sign_w*sign_ratio;
        sign_h = sign_h *sign_ratio;
        link_w1 = link_w1 *(sign_ratio+0.4);
        link_h1 =link_h1*(sign_ratio+0.4);
        link_w2 =link_w2 *(sign_ratio+0.4);
        link_h2 =link_h2 *(sign_ratio+0.4);
        
        var signElem = document.querySelector(`#${sign_tag}`);
        var linkElem = document.querySelector(`#${link_tag}`);

        if (!signElem) {
            console.error(`Element with ID ${sign_tag} not found in the DOM.`);
            return;
        }

        if (!linkElem) {
            console.error(`Element with ID ${link_tag} not found in the DOM.`);
            return;
        }

        var sign = {
            w: sign_w,
            h: sign_h,
            body: Bodies.rectangle(
                sign_x,
                sign_y,
                sign_w,
                sign_h,
                {
                    restitution: 0,
                    //isStatic: true,
                    inertia: Infinity,
                    density: 0.001,
                    friction: 0.2,
                    restitution: 1,
                    render: {
                        fillStyle: "#B9D7EA",
                        strokeStyle: 'gray',
                        lineWidth: 2,
                        opacity: 0.8,
                    }
                }
            ),
            elem: document.querySelector(`#${sign_tag}`),
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


        var link_button = {
            w: link_w1,
            h: link_h1,
            body: Bodies.rectangle(
                link_x,
                link_y,
                link_w2,
                link_h2,
                {
                    restitution: 1,
                    friction: 1,

                    url: link,
                    render: {
                        fillStyle: "#EBB55F",
                        strokeStyle: '#050321',
                        lineWidth: 5,
                        opacity: 0.8,
                    }
                }
            ),
            elem: document.querySelector(`#${link_tag}`),
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

        Composite.add(world, [sign.body, link_button.body]);
        if (isLinked) {
            Composite.add(world, Constraint.create({
                bodyA: sign.body,
                bodyB: link_button.body,
                stiffness: 0.7,
                length: length,
                render: {
                    lineWidth: 1,
                    //type: 'line',
                    anchors: false,
                    strokeStyle: '#393E46'
                }
            }));
        }

        return [sign, link_button];
    }

    money = create_page_sign(//how much money left sign
        sign_tag = "howmuchmoneyleft_sign",
        link_tag = "howmuchmoneyleft_link",
        link = "useless_projects/howmuchmoneyleft",

        sign_x = (window.innerWidth / 2),
        sign_y = (window.innerHeight * 0.8),
        link_x = (window.innerWidth / 2),
        link_y = (window.innerHeight * 0.83)

    );

    balloon = create_page_sign(//balloon sign
        sign_tag = "balloon_sign",
        link_tag = "balloon_link",
        link = "useless_projects/balloons",

        sign_x = (window.innerWidth / 2),
        sign_y = (window.innerHeight * 0.3),
        link_x = (window.innerWidth / 2),
        link_y = (window.innerHeight * 0.33)

    );

    ika = create_page_sign(//ika
        sign_tag = "ika_sign",
        link_tag = "ika_link",
        link = "useless_projects/ika",

        sign_x = (window.innerWidth / 2),
        sign_y = (window.innerHeight * 0.5),
        link_x = (window.innerWidth / 2 +50),
        link_y = (window.innerHeight * 0.53),
        isLinked = false

    );

    donation = create_page_sign(
        sign_tag = "donation_sign",
        link_tag = "donation_link",
        link = "donation",
        
        sign_x = (window.innerWidth -100 ),
        sign_y = (window.innerHeight * 0.5),
        link_x = (window.innerWidth  -50),
        link_y = (window.innerHeight * 0.47),
        isLinked = true,
        sign_ratio= 0.4

    );

    (function rerender() {

        money[0].render();
        money[1].render();

        balloon[0].render();
        balloon[1].render();
        
        ika[0].render();
        ika[1].render();

        donation[0].render();
        donation[1].render();

        Matter.Engine.update(iEngine);
        requestAnimationFrame(rerender);
    })();

    

    function create_balloons(x, y, num, obj2 = null) {
        let rect_list = [];

        var balloon = Bodies.circle(x + Common.random(-50, 50), y + Common.random(-50, 50), (Math.sqrt(ratio)) * 30,
            {
                //density:0.001,
                restitution: 0,
                friction: 0.1,
                render: {
                    fillStyle: "#6256CA",
                    strokeStyle: '#86D293',
                    lineWidth: 5
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

            rect.collisionFilter = {
                'group': -1,
                'category': 2,
                'mask': 0,
            };

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
    };

    if (ratio > 1) {
        var length_rope = 50;
        var force = 0.00006;
    } else {
        var length_rope = 30;
        var force = 0.00004;
    };

    balloon_list = [];
    for (let _ = 0; _ < 2; _++) {
        balloon_list.push(create_balloons(window.innerWidth / 2, window.innerHeight * 0.1, length_rope, balloon[0].body));

    }

    function createRagdoll(x, y) {
        // aliases
        const { Bodies, Body, Composite, Constraint } = Matter;

        const defaultCollisionGroup = -1;

        /*********************
         * Define Body Parts *
         *********************/
        const headOptions = {
            friction: 1,
            frictionAir: 0.05,
            render: {
                fillStyle: "#3C3D37",
            },
        };
        const chestOptions = {
            friction: 1,
            frictionAir: 0.05,
            collisionFilter: {
                group: defaultCollisionGroup - 1,
            },
            chamfer: {
                radius: 20,
            },
            label: "chest",
            render: {
                fillStyle: "#181C14",
            },
        };
        const armOptions = {
            friction: 1,
            frictionAir: 0.03,
            collisionFilter: {
                group: defaultCollisionGroup,
            },
            chamfer: {
                radius: 10,
            },
            render: {
                fillStyle: "#3C3D37",
            },
        };
        const legOptions = {
            friction: 1,
            frictionAir: 0.03,
            collisionFilter: {
                group: defaultCollisionGroup - 1,
            },
            chamfer: {
                radius: 10,
            },
            render: {
                fillStyle: "#3C3D37",
            },
        };

        const lowerLegOptions = {
            friction: 1,
            frictionAir: 0.03,
            collisionFilter: {
                group: defaultCollisionGroup - 1,
            },
            chamfer: {
                radius: 2,
            },
            render: {
                fillStyle: "#181C14",
            },
        };

        const head = Bodies.circle(x, y - 70, 30, headOptions);
        chest = Bodies.rectangle(x, y, 60, 80, chestOptions);
        chest.size = 40; // To determine overlap of goal
        const rightUpperArm = Bodies.rectangle(x + 40, y - 20, 20, 40, Object.assign({}, armOptions));
        const rightLowerArm = Bodies.rectangle(x + 40, y + 20, 20, 60, Object.assign({}, armOptions));
        const leftUpperArm = Bodies.rectangle(x - 40, y - 20, 20, 40, Object.assign({}, armOptions));
        const leftLowerArm = Bodies.rectangle(x - 40, y + 20, 20, 60, Object.assign({}, armOptions));
        const leftUpperLeg = Bodies.rectangle(x - 20, y + 60, 20, 40, Object.assign({}, legOptions));
        const rightUpperLeg = Bodies.rectangle(x + 20, y + 60, 20, 40, Object.assign({}, legOptions));
        const leftLowerLeg = Bodies.rectangle(x - 20, y + 100, 20, 60, Object.assign({}, lowerLegOptions));
        const rightLowerLeg = Bodies.rectangle(x + 20, y + 100, 20, 60, Object.assign({}, lowerLegOptions));

        const legTorso = Body.create({
            parts: [chest, leftUpperLeg, rightUpperLeg],
            collisionFilter: {
                group: defaultCollisionGroup - 1,
            },
        });

        /*****************************
         * Define Constraints/Joints *
         *****************************/
        const chestToRightUpperArm = Constraint.create({
            bodyA: legTorso,
            pointA: {
                x: 25,
                y: -40,
            },
            pointB: {
                x: -5,
                y: -10,
            },
            bodyB: rightUpperArm,
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });
        const chestToLeftUpperArm = Constraint.create({
            bodyA: legTorso,
            pointA: {
                x: -25,
                y: -40,
            },
            pointB: {
                x: 5,
                y: -10,
            },
            bodyB: leftUpperArm,
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });

        const upperToLowerRightArm = Constraint.create({
            bodyA: rightUpperArm,
            bodyB: rightLowerArm,
            pointA: {
                x: 0,
                y: 15,
            },
            pointB: {
                x: 0,
                y: -20,
            },
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });

        const upperToLowerLeftArm = Constraint.create({
            bodyA: leftUpperArm,
            bodyB: leftLowerArm,
            pointA: {
                x: 0,
                y: 15,
            },
            pointB: {
                x: 0,
                y: -20,
            },
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });

        const upperToLowerLeftLeg = Constraint.create({
            bodyA: legTorso,
            bodyB: leftLowerLeg,
            pointA: {
                x: -20,
                y: 60,
            },
            pointB: {
                x: 0,
                y: -25,
            },
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });

        const upperToLowerRightLeg = Constraint.create({
            bodyA: legTorso,
            bodyB: rightLowerLeg,
            pointA: {
                x: 20,
                y: 60,
            },
            pointB: {
                x: 0,
                y: -25,
            },
            stiffness: 0.2,
            render: {
                visible: false,
            },
        });

        const headContraint = Constraint.create({
            bodyA: head,
            pointA: {
                x: 0,
                y: 20,
            },
            pointB: {
                x: 0,
                y: -50,
            },
            bodyB: legTorso,
            stiffness: 0.3,
            render: {
                visible: false,
            },
        });

        window.addEventListener("keydown", event => {
            const FORCE_VALUE = 0.05;
            switch (event.keyCode) {
                case 81: //q
                    Matter.Body.applyForce(leftLowerArm, leftLowerArm.position, {
                        x: -FORCE_VALUE,
                        y: -FORCE_VALUE,
                    });
                    break;
                case 87: //w
                    Matter.Body.applyForce(leftLowerLeg, leftLowerLeg.position, {
                        x: -FORCE_VALUE,
                        y: FORCE_VALUE,
                    });
                    break;
                case 79: //o
                    Matter.Body.applyForce(rightLowerArm, rightLowerArm.position, {
                        x: FORCE_VALUE,
                        y: -FORCE_VALUE,
                    });
                    break;
                case 80: //p
                    Matter.Body.applyForce(rightLowerLeg, rightLowerLeg.position, {
                        x: FORCE_VALUE,
                        y: FORCE_VALUE,
                    });
                    break;
            }
        });

        const person = Composite.create({
            bodies: [legTorso, head, leftLowerArm, leftUpperArm, rightLowerArm, rightUpperArm, leftLowerLeg, rightLowerLeg],
            constraints: [
                upperToLowerLeftArm,
                upperToLowerRightArm,
                chestToLeftUpperArm,
                chestToRightUpperArm,
                headContraint,
                upperToLowerLeftLeg,
                upperToLowerRightLeg,
            ],
        });
        return person;
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

            rect.collisionFilter = {
                'group': -1,
                'category': 2,
                'mask': 0,
            };

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

    ragdoll = createRagdoll(window.innerWidth / 2, window.innerHeight * 0.62);
    Composite.add(world, ragdoll);

    rope_link_to_obj(window.innerWidth / 2, window.innerHeight * 0.5 + 5, 5, ragdoll.bodies[1], ika[0].body);
    rope_link_to_obj(window.innerWidth / 2, window.innerHeight * 0.5 + 5, 1, ragdoll.bodies[4], ika[1].body);
    

    Events.on(iEngine, 'beforeUpdate', function () {
        Body.setSpeed(donation[0].body, 3);
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
