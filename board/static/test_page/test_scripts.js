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

    function create_apartment_page_sign(sign_tag, link_tag, link, sign_x, sign_y, link_x, link_y) {

        if (ratio > 1) {
            var sign_w = window.innerWidth * 0.5;
            var sign_h = window.innerHeight * 0.07;

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
            var sign_w = window.innerWidth * 0.1;
            var sign_h = window.innerHeight * 0.3;

            var link_w1 = window.innerWidth * 0.13;
            var link_h1 = window.innerHeight * 0.05;

            var link_w2 = window.innerWidth * 0.05;
            var link_h2 = window.innerHeight * 0.05;

            var length = 100;

        }
        
        
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
                    //isStatic: true,
                    inertia: Infinity,
                    density: 0.001,
                    friction: 0,
                    restitution: 0,
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


        return [sign, link_button];
    }

    apartment = create_apartment_page_sign(
        sign_tag = "apartment_sign",
        link_tag = "apartment_link",
        link = "apartmanim",
        
        sign_x = (window.innerWidth / 2),
        sign_y = (window.innerHeight * 0.8),
        link_x = (window.innerWidth / 2),
        link_y = (window.innerHeight * 0.83)

    );

    (function rerender() {

        apartment[0].render();
        apartment[1].render();
        
        Matter.Engine.update(iEngine);
        requestAnimationFrame(rerender);
    })();

    

    Events.on(iEngine, 'beforeUpdate', function () {
        apartment[0].body.force.y += 12 * 0.0002;
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
