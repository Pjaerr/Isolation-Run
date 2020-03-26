
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintInOut(t) {
        if ((t *= 2) < 1)
            return 0.5 * t * t * t * t * t;
        return 0.5 * ((t -= 2) * t * t * t * t + 2);
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\InfoModal.svelte generated by Svelte v3.20.1 */
    const file = "src\\InfoModal.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let t0;
    	let section1;
    	let div10;
    	let header;
    	let div1;
    	let button;
    	let svg;
    	let path;
    	let t1;
    	let div2;
    	let h1;
    	let t3;
    	let section0;
    	let div3;
    	let t4;
    	let em;
    	let t6;
    	let t7;
    	let div9;
    	let div4;
    	let h20;
    	let t9;
    	let b0;
    	let t11;
    	let t12;
    	let div5;
    	let h21;
    	let t14;
    	let t15;
    	let div6;
    	let h22;
    	let t17;
    	let b1;
    	let t19;
    	let t20;
    	let div7;
    	let t22;
    	let div8;
    	let t23;
    	let br0;
    	let t24;
    	let br1;
    	let t25;
    	let a;
    	let section1_transition;
    	let current;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			section1 = element("section");
    			div10 = element("div");
    			header = element("header");
    			div1 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "How does this work?";
    			t3 = space();
    			section0 = element("section");
    			div3 = element("div");
    			t4 = text("Qua\r\n        ");
    			em = element("em");
    			em.textContent = "run";
    			t6 = text("\r\n        tine is a fun little website that lets you watch a video on your\r\n        computer but only when your phone detects that you are running.\r\n        Hopefully a fun way to keep fit whilst locked indoors!");
    			t7 = space();
    			div9 = element("div");
    			div4 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Step 1:";
    			t9 = text("\r\n          On your computer (or whatever screen you want to watch the video on),\r\n          open this website and click on the\r\n          ");
    			b0 = element("b");
    			b0.textContent = "Computer";
    			t11 = text("\r\n          button.");
    			t12 = space();
    			div5 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Step 2:";
    			t14 = text("\r\n          You can then select from a list of predefined videos of walks through\r\n          scenery, cities etc or you can select your own video by pasting in the\r\n          youtube video ID.");
    			t15 = space();
    			div6 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Step 3:";
    			t17 = text("\r\n          Once you've done that, you should be presented with a code. Now you\r\n          must open this website on your phone and click\r\n          ");
    			b1 = element("b");
    			b1.textContent = "Phone";
    			t19 = text("\r\n          and then enter in the code you see on your computer.");
    			t20 = space();
    			div7 = element("div");
    			div7.textContent = "You can now start running with your phone in your hand and the video\r\n          will play! Remember to keep your phone screen unlocked for this to\r\n          work.";
    			t22 = space();
    			div8 = element("div");
    			t23 = text("This site was made using Svelte and Nodejs. It uses WebSockets to\r\n          connect your computer to your phone and sends a message over the\r\n          network when your phone's accelerometer detects that you're running.\r\n          ");
    			br0 = element("br");
    			t24 = space();
    			br1 = element("br");
    			t25 = text("\r\n          The source code can be found\r\n          ");
    			a = element("a");
    			a.textContent = "here";
    			attr_dev(div0, "class", "modal-overlay svelte-gm7mmk");
    			add_location(div0, file, 115, 0, 1760);
    			attr_dev(path, "fill", "#333");
    			attr_dev(path, "d", "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z");
    			add_location(path, file, 124, 12, 2092);
    			set_style(svg, "width", "24px");
    			set_style(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file, 123, 10, 2022);
    			attr_dev(button, "class", "svelte-gm7mmk");
    			add_location(button, file, 122, 8, 1983);
    			attr_dev(div1, "class", "header-back-button svelte-gm7mmk");
    			add_location(div1, file, 121, 6, 1941);
    			attr_dev(h1, "class", "svelte-gm7mmk");
    			add_location(h1, file, 131, 8, 2312);
    			attr_dev(div2, "class", "header-title svelte-gm7mmk");
    			add_location(div2, file, 130, 6, 2276);
    			attr_dev(header, "class", "header svelte-gm7mmk");
    			add_location(header, file, 120, 4, 1910);
    			attr_dev(em, "class", "svelte-gm7mmk");
    			add_location(em, file, 137, 8, 2452);
    			attr_dev(div3, "class", "body-intro svelte-gm7mmk");
    			add_location(div3, file, 135, 6, 2405);
    			add_location(h20, file, 145, 10, 2774);
    			add_location(b0, file, 148, 10, 2929);
    			attr_dev(div4, "class", "body-steps-step");
    			add_location(div4, file, 144, 8, 2733);
    			add_location(h21, file, 152, 10, 3030);
    			attr_dev(div5, "class", "body-steps-step");
    			add_location(div5, file, 151, 8, 2989);
    			add_location(h22, file, 158, 10, 3305);
    			add_location(b1, file, 161, 10, 3470);
    			attr_dev(div6, "class", "body-steps-step");
    			add_location(div6, file, 157, 8, 3264);
    			attr_dev(div7, "class", "body-outro svelte-gm7mmk");
    			add_location(div7, file, 165, 8, 3574);
    			add_location(br0, file, 175, 10, 4069);
    			add_location(br1, file, 176, 10, 4087);
    			attr_dev(a, "href", "https://github.com/Pjaerr/QuaRUNtine");
    			add_location(a, file, 178, 10, 4145);
    			attr_dev(div8, "class", "body-tech svelte-gm7mmk");
    			add_location(div8, file, 171, 8, 3801);
    			attr_dev(div9, "class", "body-steps svelte-gm7mmk");
    			add_location(div9, file, 143, 6, 2699);
    			attr_dev(section0, "class", "body svelte-gm7mmk");
    			add_location(section0, file, 134, 4, 2375);
    			attr_dev(div10, "class", "modal svelte-gm7mmk");
    			add_location(div10, file, 119, 2, 1885);
    			attr_dev(section1, "class", "container svelte-gm7mmk");
    			add_location(section1, file, 116, 0, 1791);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div10);
    			append_dev(div10, header);
    			append_dev(header, div1);
    			append_dev(div1, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(header, t1);
    			append_dev(header, div2);
    			append_dev(div2, h1);
    			append_dev(div10, t3);
    			append_dev(div10, section0);
    			append_dev(section0, div3);
    			append_dev(div3, t4);
    			append_dev(div3, em);
    			append_dev(div3, t6);
    			append_dev(section0, t7);
    			append_dev(section0, div9);
    			append_dev(div9, div4);
    			append_dev(div4, h20);
    			append_dev(div4, t9);
    			append_dev(div4, b0);
    			append_dev(div4, t11);
    			append_dev(div9, t12);
    			append_dev(div9, div5);
    			append_dev(div5, h21);
    			append_dev(div5, t14);
    			append_dev(div9, t15);
    			append_dev(div9, div6);
    			append_dev(div6, h22);
    			append_dev(div6, t17);
    			append_dev(div6, b1);
    			append_dev(div6, t19);
    			append_dev(div9, t20);
    			append_dev(div9, div7);
    			append_dev(div9, t22);
    			append_dev(div9, div8);
    			append_dev(div8, t23);
    			append_dev(div8, br0);
    			append_dev(div8, t24);
    			append_dev(div8, br1);
    			append_dev(div8, t25);
    			append_dev(div8, a);
    			current = true;
    			if (remount) dispose();

    			dispose = listen_dev(
    				button,
    				"click",
    				function () {
    					if (is_function(/*onClose*/ ctx[0])) /*onClose*/ ctx[0].apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!section1_transition) section1_transition = create_bidirectional_transition(section1, slide, { duration: 200, easing: quintInOut }, true);
    				section1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!section1_transition) section1_transition = create_bidirectional_transition(section1, slide, { duration: 200, easing: quintInOut }, false);
    			section1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section1);
    			if (detaching && section1_transition) section1_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { onClose } = $$props;
    	const writable_props = ["onClose"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InfoModal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("InfoModal", $$slots, []);

    	$$self.$set = $$props => {
    		if ("onClose" in $$props) $$invalidate(0, onClose = $$props.onClose);
    	};

    	$$self.$capture_state = () => ({ slide, quintInOut, onClose });

    	$$self.$inject_state = $$props => {
    		if ("onClose" in $$props) $$invalidate(0, onClose = $$props.onClose);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClose];
    }

    class InfoModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { onClose: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoModal",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClose*/ ctx[0] === undefined && !("onClose" in props)) {
    			console.warn("<InfoModal> was created without expected prop 'onClose'");
    		}
    	}

    	get onClose() {
    		throw new Error("<InfoModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<InfoModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
    var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    function rng() {
      if (!getRandomValues) {
        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
      }

      return getRandomValues(rnds8);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

      return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
    }

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof options == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }

      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid(rnds);
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const isPaused = writable(true);

    /* src\VideoSelection.svelte generated by Svelte v3.20.1 */

    const file$1 = "src\\VideoSelection.svelte";

    // (41:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t1;
    	let b;
    	let t2;
    	let a;
    	let t4;
    	let div;
    	let label0;
    	let input0;
    	let t5;
    	let t6;
    	let label1;
    	let input1;
    	let t7;
    	let t8;
    	let label2;
    	let input2;
    	let t9;
    	let t10;
    	let label3;
    	let input3;
    	let t11;
    	let t12;
    	let label4;
    	let input4;
    	let t13;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Click here to choose your own video";
    			t1 = space();
    			b = element("b");
    			t2 = text("All videos courtesy of\r\n    ");
    			a = element("a");
    			a.textContent = "Rambalac";
    			t4 = space();
    			div = element("div");
    			label0 = element("label");
    			input0 = element("input");
    			t5 = text("\r\n      Tokyo Okutama Mountains");
    			t6 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t7 = text("\r\n      Midtown Roppongi Hills");
    			t8 = space();
    			label2 = element("label");
    			input2 = element("input");
    			t9 = text("\r\n      Yokosuka Countryside");
    			t10 = space();
    			label3 = element("label");
    			input3 = element("input");
    			t11 = text("\r\n      Hirosaki Winter");
    			t12 = space();
    			label4 = element("label");
    			input4 = element("input");
    			t13 = text("\r\n      Beppu");
    			attr_dev(button, "class", "option-switcher svelte-19ek1k7");
    			add_location(button, file$1, 41, 2, 802);
    			attr_dev(a, "href", "https://www.youtube.com/channel/UCAcsAE1tpLuP3y7UhxUoWpQ");
    			add_location(a, file$1, 52, 4, 1026);
    			add_location(b, file$1, 50, 2, 989);
    			attr_dev(input0, "type", "radio");
    			input0.__value = "DHq0pLFavyc";
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input0);
    			add_location(input0, file$1, 59, 6, 1178);
    			attr_dev(label0, "class", "svelte-19ek1k7");
    			add_location(label0, file$1, 58, 4, 1163);
    			attr_dev(input1, "type", "radio");
    			input1.__value = "1aqM14CYb4Y";
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input1);
    			add_location(input1, file$1, 64, 6, 1315);
    			attr_dev(label1, "class", "svelte-19ek1k7");
    			add_location(label1, file$1, 63, 4, 1300);
    			attr_dev(input2, "type", "radio");
    			input2.__value = "PLnELXJ-tLs";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input2);
    			add_location(input2, file$1, 69, 6, 1451);
    			attr_dev(label2, "class", "svelte-19ek1k7");
    			add_location(label2, file$1, 68, 4, 1436);
    			attr_dev(input3, "type", "radio");
    			input3.__value = "jW7SxamQS9M";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input3);
    			add_location(input3, file$1, 74, 6, 1585);
    			attr_dev(label3, "class", "svelte-19ek1k7");
    			add_location(label3, file$1, 73, 4, 1570);
    			attr_dev(input4, "type", "radio");
    			input4.__value = "8mQ454kcPJY";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input4);
    			add_location(input4, file$1, 79, 6, 1714);
    			attr_dev(label4, "class", "svelte-19ek1k7");
    			add_location(label4, file$1, 78, 4, 1699);
    			attr_dev(div, "class", "video-list svelte-19ek1k7");
    			add_location(div, file$1, 57, 2, 1133);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, b, anchor);
    			append_dev(b, t2);
    			append_dev(b, a);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*selectedVideo*/ ctx[0];
    			append_dev(label0, t5);
    			append_dev(div, t6);
    			append_dev(div, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*selectedVideo*/ ctx[0];
    			append_dev(label1, t7);
    			append_dev(div, t8);
    			append_dev(div, label2);
    			append_dev(label2, input2);
    			input2.checked = input2.__value === /*selectedVideo*/ ctx[0];
    			append_dev(label2, t9);
    			append_dev(div, t10);
    			append_dev(div, label3);
    			append_dev(label3, input3);
    			input3.checked = input3.__value === /*selectedVideo*/ ctx[0];
    			append_dev(label3, t11);
    			append_dev(div, t12);
    			append_dev(div, label4);
    			append_dev(label4, input4);
    			input4.checked = input4.__value === /*selectedVideo*/ ctx[0];
    			append_dev(label4, t13);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false),
    				listen_dev(input0, "change", /*input0_change_handler*/ ctx[5]),
    				listen_dev(input1, "change", /*input1_change_handler*/ ctx[7]),
    				listen_dev(input2, "change", /*input2_change_handler*/ ctx[8]),
    				listen_dev(input3, "change", /*input3_change_handler*/ ctx[9]),
    				listen_dev(input4, "change", /*input4_change_handler*/ ctx[10])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedVideo*/ 1) {
    				input0.checked = input0.__value === /*selectedVideo*/ ctx[0];
    			}

    			if (dirty & /*selectedVideo*/ 1) {
    				input1.checked = input1.__value === /*selectedVideo*/ ctx[0];
    			}

    			if (dirty & /*selectedVideo*/ 1) {
    				input2.checked = input2.__value === /*selectedVideo*/ ctx[0];
    			}

    			if (dirty & /*selectedVideo*/ 1) {
    				input3.checked = input3.__value === /*selectedVideo*/ ctx[0];
    			}

    			if (dirty & /*selectedVideo*/ 1) {
    				input4.checked = input4.__value === /*selectedVideo*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input4), 1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(41:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#if userDefinedVideo}
    function create_if_block(ctx) {
    	let button;
    	let t1;
    	let div;
    	let label;
    	let t2;
    	let b;
    	let t4;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Click here to choose from a list of videos";
    			t1 = space();
    			div = element("div");
    			label = element("label");
    			t2 = text("YouTube Video ID (eg: youtube.com/watch?v=\r\n      ");
    			b = element("b");
    			b.textContent = "Hndf5JRwUL0";
    			t4 = text("\r\n      ):\r\n      ");
    			input = element("input");
    			attr_dev(button, "class", "option-switcher svelte-19ek1k7");
    			add_location(button, file$1, 24, 2, 374);
    			add_location(b, file$1, 35, 6, 681);
    			attr_dev(input, "type", "text");
    			add_location(input, file$1, 37, 6, 717);
    			add_location(label, file$1, 33, 4, 616);
    			attr_dev(div, "class", "user-defined-video");
    			add_location(div, file$1, 32, 2, 578);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t2);
    			append_dev(label, b);
    			append_dev(label, t4);
    			append_dev(label, input);
    			set_input_value(input, /*selectedVideo*/ ctx[0]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[3])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedVideo*/ 1 && input.value !== /*selectedVideo*/ ctx[0]) {
    				set_input_value(input, /*selectedVideo*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:0) {#if userDefinedVideo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*userDefinedVideo*/ ctx[1]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { selectedVideo = "DHq0pLFavyc" } = $$props;
    	let userDefinedVideo = false;
    	const writable_props = ["selectedVideo"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VideoSelection> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("VideoSelection", $$slots, []);
    	const $$binding_groups = [[]];

    	const click_handler = () => {
    		$$invalidate(1, userDefinedVideo = false);
    		$$invalidate(0, selectedVideo = "DHq0pLFavyc");
    	};

    	function input_input_handler() {
    		selectedVideo = this.value;
    		$$invalidate(0, selectedVideo);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(1, userDefinedVideo = true);
    		$$invalidate(0, selectedVideo = "");
    	};

    	function input0_change_handler() {
    		selectedVideo = this.__value;
    		$$invalidate(0, selectedVideo);
    	}

    	function input1_change_handler() {
    		selectedVideo = this.__value;
    		$$invalidate(0, selectedVideo);
    	}

    	function input2_change_handler() {
    		selectedVideo = this.__value;
    		$$invalidate(0, selectedVideo);
    	}

    	function input3_change_handler() {
    		selectedVideo = this.__value;
    		$$invalidate(0, selectedVideo);
    	}

    	function input4_change_handler() {
    		selectedVideo = this.__value;
    		$$invalidate(0, selectedVideo);
    	}

    	$$self.$set = $$props => {
    		if ("selectedVideo" in $$props) $$invalidate(0, selectedVideo = $$props.selectedVideo);
    	};

    	$$self.$capture_state = () => ({ selectedVideo, userDefinedVideo });

    	$$self.$inject_state = $$props => {
    		if ("selectedVideo" in $$props) $$invalidate(0, selectedVideo = $$props.selectedVideo);
    		if ("userDefinedVideo" in $$props) $$invalidate(1, userDefinedVideo = $$props.userDefinedVideo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedVideo,
    		userDefinedVideo,
    		click_handler,
    		input_input_handler,
    		click_handler_1,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		input4_change_handler
    	];
    }

    class VideoSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { selectedVideo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoSelection",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get selectedVideo() {
    		throw new Error("<VideoSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedVideo(value) {
    		throw new Error("<VideoSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Video.svelte generated by Svelte v3.20.1 */
    const file$2 = "src\\Video.svelte";

    function create_fragment$2(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let t1;
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script1.textContent = "window.onYouTubeIframeAPIReady = function() {\r\n      window.YOUTUBE_PLAYER = new YT.Player(\"youtube_player_iframe\", {\r\n        events: {\r\n          onReady: function() {\r\n            window.YOUTUBE_PLAYER_ISREADY = true;\r\n\r\n            setTimeout(function() {\r\n              window.YOUTUBE_PLAYER.pauseVideo();\r\n            }, 1000);\r\n          }\r\n        }\r\n      });\r\n    };";
    			t1 = space();
    			iframe = element("iframe");
    			if (script0.src !== (script0_src_value = "https://www.youtube.com/iframe_api")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 15, 2, 345);
    			add_location(script1, file$2, 18, 2, 413);
    			attr_dev(iframe, "title", "youtube video");
    			attr_dev(iframe, "id", "youtube_player_iframe");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "100%");
    			if (iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" + /*youtubeVideoID*/ ctx[0] + "?enablejsapi=1&origin=https://" + location.host + "&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=0&mute=1")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "autoplay; encrypted-media; fullscreen;");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$2, 35, 0, 836);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*youtubeVideoID*/ 1 && iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" + /*youtubeVideoID*/ ctx[0] + "?enablejsapi=1&origin=https://" + location.host + "&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=0&mute=1")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $isPaused;
    	validate_store(isPaused, "isPaused");
    	component_subscribe($$self, isPaused, $$value => $$invalidate(1, $isPaused = $$value));
    	let { youtubeVideoID } = $$props;
    	const writable_props = ["youtubeVideoID"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Video", $$slots, []);

    	$$self.$set = $$props => {
    		if ("youtubeVideoID" in $$props) $$invalidate(0, youtubeVideoID = $$props.youtubeVideoID);
    	};

    	$$self.$capture_state = () => ({ isPaused, youtubeVideoID, $isPaused });

    	$$self.$inject_state = $$props => {
    		if ("youtubeVideoID" in $$props) $$invalidate(0, youtubeVideoID = $$props.youtubeVideoID);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$isPaused*/ 2) {
    			 if ($isPaused === true) {
    				if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.pauseVideo();
    			}
    		}

    		if ($$self.$$.dirty & /*$isPaused*/ 2) {
    			 if ($isPaused === false) {
    				if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.playVideo();
    			}
    		}
    	};

    	return [youtubeVideoID];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { youtubeVideoID: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*youtubeVideoID*/ ctx[0] === undefined && !("youtubeVideoID" in props)) {
    			console.warn("<Video> was created without expected prop 'youtubeVideoID'");
    		}
    	}

    	get youtubeVideoID() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set youtubeVideoID(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Computer.svelte generated by Svelte v3.20.1 */

    const { console: console_1 } = globals;
    const file$3 = "src\\Computer.svelte";

    // (88:0) {#if !phoneHasConnected}
    function create_if_block_2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Go back";
    			attr_dev(a, "href", "/");
    			add_location(a, file$3, 88, 2, 1849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(88:0) {#if !phoneHasConnected}",
    		ctx
    	});

    	return block;
    }

    // (99:0) {:else}
    function create_else_block_1(ctx) {
    	let h1;
    	let t1;
    	let updating_selectedVideo;
    	let t2;
    	let button;
    	let current;
    	let dispose;

    	function videoselection_selectedVideo_binding(value) {
    		/*videoselection_selectedVideo_binding*/ ctx[9].call(null, value);
    	}

    	let videoselection_props = {};

    	if (/*selectedVideo*/ ctx[1] !== void 0) {
    		videoselection_props.selectedVideo = /*selectedVideo*/ ctx[1];
    	}

    	const videoselection = new VideoSelection({
    			props: videoselection_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(videoselection, "selectedVideo", videoselection_selectedVideo_binding));

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Choose predefined video/scene, or use your own:";
    			t1 = space();
    			create_component(videoselection.$$.fragment);
    			t2 = space();
    			button = element("button");
    			button.textContent = "Choose Video";
    			attr_dev(h1, "class", "svelte-1wg9sjd");
    			add_location(h1, file$3, 99, 2, 2118);
    			attr_dev(button, "class", "svelte-1wg9sjd");
    			add_location(button, file$3, 101, 2, 2219);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(videoselection, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			const videoselection_changes = {};

    			if (!updating_selectedVideo && dirty & /*selectedVideo*/ 2) {
    				updating_selectedVideo = true;
    				videoselection_changes.selectedVideo = /*selectedVideo*/ ctx[1];
    				add_flush_callback(() => updating_selectedVideo = false);
    			}

    			videoselection.$set(videoselection_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videoselection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videoselection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(videoselection, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(99:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (92:0) {#if hasChosenVideo}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*phoneHasConnected*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(92:0) {#if hasChosenVideo}",
    		ctx
    	});

    	return block;
    }

    // (95:2) {:else}
    function create_else_block$1(ctx) {
    	let h10;
    	let t1;
    	let h11;

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Enter the following code on your phone to connect:";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = `${/*connectionCode*/ ctx[3]}`;
    			attr_dev(h10, "class", "svelte-1wg9sjd");
    			add_location(h10, file$3, 95, 4, 1993);
    			attr_dev(h11, "class", "code svelte-1wg9sjd");
    			add_location(h11, file$3, 96, 4, 2058);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(95:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:2) {#if phoneHasConnected}
    function create_if_block_1(ctx) {
    	let current;

    	const video = new Video({
    			props: { youtubeVideoID: /*selectedVideo*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(video.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(video, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const video_changes = {};
    			if (dirty & /*selectedVideo*/ 2) video_changes.youtubeVideoID = /*selectedVideo*/ ctx[1];
    			video.$set(video_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(video, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(93:2) {#if phoneHasConnected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = !/*phoneHasConnected*/ ctx[2] && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasChosenVideo*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*phoneHasConnected*/ ctx[2]) {
    				if (!if_block0) {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $isPaused;
    	validate_store(isPaused, "isPaused");
    	component_subscribe($$self, isPaused, $$value => $$invalidate(7, $isPaused = $$value));
    	let hasChosenVideo = false;
    	let selectedVideo;
    	const connectionCode = v4().substring(0, 8);
    	let phoneWebSocketID = "";
    	let phoneHasConnected = false;
    	let socket;
    	let socketIsOpen = false;

    	function openConnection() {
    		socket = new WebSocket("wss://" + location.host);

    		socket.onopen = e => {
    			socket.send(JSON.stringify({
    				connectionCode,
    				messageType: "connection"
    			}));
    		};

    		socket.onclose = e => {
    			location.reload();
    		};

    		socket.onmessage = e => {
    			const data = JSON.parse(e.data);
    			console.log("Received a message");

    			if (data.messageType === "connection") {
    				$$invalidate(2, phoneHasConnected = true);
    				phoneWebSocketID = data.id;

    				socket.send(JSON.stringify({
    					connectionCode,
    					messageType: "connection"
    				}));
    			} else if (data.messageType === "playvideo") {
    				isPaused.set(false);
    				console.log($isPaused);
    			} else if (data.messageType === "pausevideo") {
    				isPaused.set(true);
    				console.log($isPaused);
    			}
    		};

    		window.onbeforeunload = () => {
    			socket.send(JSON.stringify({
    				partnerID: phoneWebSocketID,
    				messageType: "connectionclosed"
    			}));
    		};
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Computer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Computer", $$slots, []);

    	function videoselection_selectedVideo_binding(value) {
    		selectedVideo = value;
    		$$invalidate(1, selectedVideo);
    	}

    	const click_handler = () => {
    		$$invalidate(0, hasChosenVideo = true);
    		openConnection();
    	};

    	$$self.$capture_state = () => ({
    		uuidv4: v4,
    		isPaused,
    		VideoSelection,
    		Video,
    		hasChosenVideo,
    		selectedVideo,
    		connectionCode,
    		phoneWebSocketID,
    		phoneHasConnected,
    		socket,
    		socketIsOpen,
    		openConnection,
    		$isPaused
    	});

    	$$self.$inject_state = $$props => {
    		if ("hasChosenVideo" in $$props) $$invalidate(0, hasChosenVideo = $$props.hasChosenVideo);
    		if ("selectedVideo" in $$props) $$invalidate(1, selectedVideo = $$props.selectedVideo);
    		if ("phoneWebSocketID" in $$props) phoneWebSocketID = $$props.phoneWebSocketID;
    		if ("phoneHasConnected" in $$props) $$invalidate(2, phoneHasConnected = $$props.phoneHasConnected);
    		if ("socket" in $$props) socket = $$props.socket;
    		if ("socketIsOpen" in $$props) socketIsOpen = $$props.socketIsOpen;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hasChosenVideo,
    		selectedVideo,
    		phoneHasConnected,
    		connectionCode,
    		openConnection,
    		phoneWebSocketID,
    		socket,
    		$isPaused,
    		socketIsOpen,
    		videoselection_selectedVideo_binding,
    		click_handler
    	];
    }

    class Computer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Computer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var gifs = [
      "https://media.giphy.com/media/13mLwGra9bNEKQ/giphy.gif",
      "https://media.giphy.com/media/3o6gDPEhWHyWWMaATK/giphy.gif",
      "https://media.giphy.com/media/lRnUWhmllPI9a/giphy.gif",
      "https://media.giphy.com/media/fnR1k3CZLQt3y/giphy.gif",
      "https://media.giphy.com/media/r1ISdfVnrhOhi/giphy.gif",
      "https://media.giphy.com/media/2bUpP71bbVnZ3x7lgQ/giphy.gif",
      "https://media.giphy.com/media/EaMTsoYxfPpuw/giphy.gif",
      "https://media.giphy.com/media/1iTH1WIUjM0VATSw/giphy.gif",
      "https://media.giphy.com/media/sRKg9r2YWeCTG5JTTo/giphy.gif",
      "https://media.giphy.com/media/pVtulZdJsUuCQ/giphy.gif"
    ];

    /* src\Phone.svelte generated by Svelte v3.20.1 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\Phone.svelte";

    // (108:0) {#if !desktopHasConnected}
    function create_if_block_1$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Go back";
    			attr_dev(a, "href", "/");
    			add_location(a, file$4, 108, 2, 2309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(108:0) {#if !desktopHasConnected}",
    		ctx
    	});

    	return block;
    }

    // (126:0) {:else}
    function create_else_block$2(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Keep your phone screen unlocked and start running! 🏃‍♀️";
    			t1 = space();
    			img = element("img");
    			attr_dev(h1, "class", "svelte-imh9mg");
    			add_location(h1, file$4, 126, 2, 2727);
    			if (img.src !== (img_src_value = /*gif*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Gif of somebody running");
    			add_location(img, file$4, 127, 2, 2796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(126:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (112:0) {#if !socketIsOpen || !desktopHasConnected}
    function create_if_block$2(ctx) {
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Visit this website on your desktop to find the code you need to enter here:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Connect";
    			attr_dev(h1, "class", "svelte-imh9mg");
    			add_location(h1, file$4, 112, 2, 2390);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "connectionCode");
    			attr_dev(input, "autocapitalize", "off");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-imh9mg");
    			add_location(input, file$4, 117, 2, 2531);
    			attr_dev(button, "class", "svelte-imh9mg");
    			add_location(button, file$4, 124, 2, 2664);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*connectionCode*/ ctx[0]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			input.focus();
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    				listen_dev(button, "click", /*openConnection*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*connectionCode*/ 1 && input.value !== /*connectionCode*/ ctx[0]) {
    				set_input_value(input, /*connectionCode*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(112:0) {#if !socketIsOpen || !desktopHasConnected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = !/*desktopHasConnected*/ ctx[1] && create_if_block_1$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (!/*socketIsOpen*/ ctx[2] || !/*desktopHasConnected*/ ctx[1]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*desktopHasConnected*/ ctx[1]) {
    				if (!if_block0) {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];
    	let connectionCode = "";
    	let desktopHasConnected = false;
    	let desktopWebSocketID = "";
    	let socketIsOpen = false;
    	let socket;

    	function openConnection() {
    		socket = new WebSocket("wss://" + location.host);

    		socket.onopen = e => {
    			$$invalidate(2, socketIsOpen = true);

    			socket.send(JSON.stringify({
    				connectionCode,
    				messageType: "connection"
    			}));
    		};

    		socket.onclose = e => {
    			location.reload();
    		};

    		socket.onmessage = e => {
    			const data = JSON.parse(e.data);
    			console.log("Received a message");

    			if (data.messageType === "connection") {
    				$$invalidate(1, desktopHasConnected = true);
    				desktopWebSocketID = data.id;
    			}
    		};

    		window.onbeforeunload = () => {
    			socket.send(JSON.stringify({
    				partnerID: desktopWebSocketID,
    				messageType: "connectionclosed"
    			}));

    			window.removeEventListener("devicemotion", handleDeviceMotion);
    		};
    	}

    	let wasRunningPreviously = false;
    	let isRunning = false;

    	function handleDeviceMotion(e) {
    		const acceleration = e.acceleration;
    		let res = acceleration.x + acceleration.y + acceleration.z;

    		if (res > 5 || res < -5) {
    			isRunning = true;
    		} else {
    			isRunning = false;
    		}

    		if (isRunning && !wasRunningPreviously) {
    			socket.send(JSON.stringify({
    				partnerID: desktopWebSocketID,
    				messageType: "playvideo"
    			}));
    		} else if (!isRunning && wasRunningPreviously) {
    			socket.send(JSON.stringify({
    				partnerID: desktopWebSocketID,
    				messageType: "pausevideo"
    			}));
    		}

    		wasRunningPreviously = isRunning;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Phone> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Phone", $$slots, []);

    	function input_input_handler() {
    		connectionCode = this.value;
    		$$invalidate(0, connectionCode);
    	}

    	$$self.$capture_state = () => ({
    		gifs,
    		gif,
    		connectionCode,
    		desktopHasConnected,
    		desktopWebSocketID,
    		socketIsOpen,
    		socket,
    		openConnection,
    		wasRunningPreviously,
    		isRunning,
    		handleDeviceMotion
    	});

    	$$self.$inject_state = $$props => {
    		if ("connectionCode" in $$props) $$invalidate(0, connectionCode = $$props.connectionCode);
    		if ("desktopHasConnected" in $$props) $$invalidate(1, desktopHasConnected = $$props.desktopHasConnected);
    		if ("desktopWebSocketID" in $$props) desktopWebSocketID = $$props.desktopWebSocketID;
    		if ("socketIsOpen" in $$props) $$invalidate(2, socketIsOpen = $$props.socketIsOpen);
    		if ("socket" in $$props) socket = $$props.socket;
    		if ("wasRunningPreviously" in $$props) wasRunningPreviously = $$props.wasRunningPreviously;
    		if ("isRunning" in $$props) isRunning = $$props.isRunning;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*socketIsOpen, desktopHasConnected*/ 6) {
    			 if (socketIsOpen && desktopHasConnected) {
    				window.addEventListener("devicemotion", handleDeviceMotion);
    			}
    		}
    	};

    	return [
    		connectionCode,
    		desktopHasConnected,
    		socketIsOpen,
    		gif,
    		openConnection,
    		desktopWebSocketID,
    		socket,
    		wasRunningPreviously,
    		isRunning,
    		handleDeviceMotion,
    		input_input_handler
    	];
    }

    class Phone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Phone",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.20.1 */
    const file$5 = "src\\App.svelte";

    // (53:2) {:else}
    function create_else_block$3(ctx) {
    	let h1;
    	let t0;
    	let em;
    	let t2;
    	let t3;
    	let button0;
    	let t5;
    	let t6;
    	let h2;
    	let t8;
    	let button1;
    	let svg0;
    	let path0;
    	let t9;
    	let t10;
    	let button2;
    	let svg1;
    	let path1;
    	let t11;
    	let current;
    	let dispose;
    	let if_block = /*howToIsActive*/ ctx[1] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Welcome to Qua\n      ");
    			em = element("em");
    			em.textContent = "run";
    			t2 = text("\n      tine. You'll need a phone and a computer to get started!");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "How does this work?";
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			h2 = element("h2");
    			h2.textContent = "Which device is this?";
    			t8 = space();
    			button1 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t9 = text("\n      Computer");
    			t10 = space();
    			button2 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t11 = text("\n      Phone");
    			attr_dev(em, "class", "svelte-1dhazdi");
    			add_location(em, file$5, 55, 6, 845);
    			add_location(h1, file$5, 53, 4, 813);
    			attr_dev(button0, "class", "how-to-button svelte-1dhazdi");
    			add_location(button0, file$5, 59, 4, 936);
    			add_location(h2, file$5, 67, 4, 1147);
    			attr_dev(path0, "fill", "#333");
    			attr_dev(path0, "d", "M21,14H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0\n          3,18H10L8,21V22H16V21L14,18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z");
    			add_location(path0, file$5, 71, 8, 1300);
    			set_style(svg0, "width", "24px");
    			set_style(svg0, "height", "24px");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "class", "svelte-1dhazdi");
    			add_location(svg0, file$5, 70, 6, 1235);
    			attr_dev(button1, "class", "svelte-1dhazdi");
    			add_location(button1, file$5, 69, 4, 1183);
    			attr_dev(path1, "fill", "#333");
    			attr_dev(path1, "d", "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0\n          0,0 19,21V3C19,1.89 18.1,1 17,1Z");
    			add_location(path1, file$5, 81, 8, 1638);
    			set_style(svg1, "width", "24px");
    			set_style(svg1, "height", "24px");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "class", "svelte-1dhazdi");
    			add_location(svg1, file$5, 80, 6, 1573);
    			attr_dev(button2, "class", "svelte-1dhazdi");
    			add_location(button2, file$5, 79, 4, 1524);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, em);
    			append_dev(h1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, svg0);
    			append_dev(svg0, path0);
    			append_dev(button1, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button2, anchor);
    			append_dev(button2, svg1);
    			append_dev(svg1, path1);
    			append_dev(button2, t11);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    				listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (/*howToIsActive*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t6.parentNode, t6);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button2);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(53:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:29) 
    function create_if_block_1$2(ctx) {
    	let current;
    	const phone = new Phone({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(phone.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(phone, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(phone.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(phone.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(phone, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(51:29) ",
    		ctx
    	});

    	return block;
    }

    // (49:2) {#if mode === 'COMPUTER'}
    function create_if_block$3(ctx) {
    	let current;
    	const computer = new Computer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(computer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(computer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(computer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(computer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(computer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:2) {#if mode === 'COMPUTER'}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#if howToIsActive}
    function create_if_block_2$1(ctx) {
    	let current;

    	const infomodal = new InfoModal({
    			props: { onClose: /*func*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(infomodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infomodal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const infomodal_changes = {};
    			if (dirty & /*howToIsActive*/ 2) infomodal_changes.onClose = /*func*/ ctx[3];
    			infomodal.$set(infomodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infomodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infomodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infomodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(64:4) {#if howToIsActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[0] === "COMPUTER") return 0;
    		if (/*mode*/ ctx[0] === "PHONE") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1dhazdi");
    			add_location(main, file$5, 47, 0, 703);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let mode;
    	let howToIsActive = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	const click_handler = () => $$invalidate(1, howToIsActive = true);
    	const func = () => $$invalidate(1, howToIsActive = false);
    	const click_handler_1 = () => $$invalidate(0, mode = "COMPUTER");
    	const click_handler_2 = () => $$invalidate(0, mode = "PHONE");

    	$$self.$capture_state = () => ({
    		InfoModal,
    		Computer,
    		Phone,
    		mode,
    		howToIsActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("mode" in $$props) $$invalidate(0, mode = $$props.mode);
    		if ("howToIsActive" in $$props) $$invalidate(1, howToIsActive = $$props.howToIsActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mode, howToIsActive, click_handler, func, click_handler_1, click_handler_2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    //Redirect here as if http is forced it doesn't really pose a security risk and doing in node causing issues.
    if (location.protocol === "http:") {
      location.replace("https://" + location.host);
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
