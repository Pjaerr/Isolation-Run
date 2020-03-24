
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    const file = "src\\VideoSelection.svelte";

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
    			add_location(button, file, 41, 2, 802);
    			attr_dev(a, "href", "https://www.youtube.com/channel/UCAcsAE1tpLuP3y7UhxUoWpQ");
    			add_location(a, file, 52, 4, 1026);
    			add_location(b, file, 50, 2, 989);
    			attr_dev(input0, "type", "radio");
    			input0.__value = "DHq0pLFavyc";
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input0);
    			add_location(input0, file, 59, 6, 1178);
    			attr_dev(label0, "class", "svelte-19ek1k7");
    			add_location(label0, file, 58, 4, 1163);
    			attr_dev(input1, "type", "radio");
    			input1.__value = "1aqM14CYb4Y";
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input1);
    			add_location(input1, file, 64, 6, 1315);
    			attr_dev(label1, "class", "svelte-19ek1k7");
    			add_location(label1, file, 63, 4, 1300);
    			attr_dev(input2, "type", "radio");
    			input2.__value = "PLnELXJ-tLs";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input2);
    			add_location(input2, file, 69, 6, 1451);
    			attr_dev(label2, "class", "svelte-19ek1k7");
    			add_location(label2, file, 68, 4, 1436);
    			attr_dev(input3, "type", "radio");
    			input3.__value = "jW7SxamQS9M";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input3);
    			add_location(input3, file, 74, 6, 1585);
    			attr_dev(label3, "class", "svelte-19ek1k7");
    			add_location(label3, file, 73, 4, 1570);
    			attr_dev(input4, "type", "radio");
    			input4.__value = "8mQ454kcPJY";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[6][0].push(input4);
    			add_location(input4, file, 79, 6, 1714);
    			attr_dev(label4, "class", "svelte-19ek1k7");
    			add_location(label4, file, 78, 4, 1699);
    			attr_dev(div, "class", "video-list svelte-19ek1k7");
    			add_location(div, file, 57, 2, 1133);
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
    			add_location(button, file, 24, 2, 374);
    			add_location(b, file, 35, 6, 681);
    			attr_dev(input, "type", "text");
    			add_location(input, file, 37, 6, 717);
    			add_location(label, file, 33, 4, 616);
    			attr_dev(div, "class", "user-defined-video");
    			add_location(div, file, 32, 2, 578);
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

    function create_fragment(ctx) {
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
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
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
    		init(this, options, instance, create_fragment, safe_not_equal, { selectedVideo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoSelection",
    			options,
    			id: create_fragment.name
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
    const file$1 = "src\\Video.svelte";

    function create_fragment$1(ctx) {
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
    			script1.textContent = "window.onYouTubeIframeAPIReady = () => {\r\n      window.YOUTUBE_PLAYER = new YT.Player(\"youtube_player_iframe\", {\r\n        events: {\r\n          onReady: () => {\r\n            window.YOUTUBE_PLAYER_ISREADY = true;\r\n\r\n            setTimeout(() => window.YOUTUBE_PLAYER.pauseVideo(), 1000);\r\n          }\r\n        }\r\n      });\r\n    };";
    			t1 = space();
    			iframe = element("iframe");
    			if (script0.src !== (script0_src_value = "https://www.youtube.com/iframe_api")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 15, 2, 345);
    			add_location(script1, file$1, 18, 2, 413);
    			attr_dev(iframe, "title", "youtube video");
    			attr_dev(iframe, "id", "youtube_player_iframe");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "100%");
    			if (iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" + /*youtubeVideoID*/ ctx[0] + "?enablejsapi=1&origin=https://" + location.host + "&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=0&mute=1")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "autoplay; encrypted-media; fullscreen;");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$1, 33, 0, 788);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { youtubeVideoID: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$1.name
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
    const file$2 = "src\\Computer.svelte";

    // (121:0) {:else}
    function create_else_block_1(ctx) {
    	let h1;
    	let t1;
    	let updating_selectedVideo;
    	let t2;
    	let button;
    	let current;
    	let dispose;

    	function videoselection_selectedVideo_binding(value) {
    		/*videoselection_selectedVideo_binding*/ ctx[10].call(null, value);
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
    			add_location(h1, file$2, 121, 2, 2685);
    			attr_dev(button, "class", "svelte-1wg9sjd");
    			add_location(button, file$2, 123, 2, 2786);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(videoselection, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[11], false, false, false);
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
    		source: "(121:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (114:0) {#if hasChosenVideo}
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
    		source: "(114:0) {#if hasChosenVideo}",
    		ctx
    	});

    	return block;
    }

    // (117:2) {:else}
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
    			add_location(h10, file$2, 117, 4, 2560);
    			attr_dev(h11, "class", "code svelte-1wg9sjd");
    			add_location(h11, file$2, 118, 4, 2625);
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
    		source: "(117:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (115:2) {#if phoneHasConnected}
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
    		source: "(115:2) {#if phoneHasConnected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasChosenVideo*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
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
    	component_subscribe($$self, isPaused, $$value => $$invalidate(7, $isPaused = $$value));
    	let id = v4();
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
    				id,
    				connectionCode,
    				messageType: "connection"
    			}));
    		};

    		socket.onerror = e => {
    			console.error(e);
    		};

    		socket.onmessage = e => {
    			const data = JSON.parse(e.data);

    			if (data.messageType === "connection") {
    				if (data.connectionCode === connectionCode) {
    					$$invalidate(2, phoneHasConnected = true);
    					phoneWebSocketID = data.id;

    					socket.send(JSON.stringify({
    						id,
    						connectionCode,
    						messageType: "connection"
    					}));
    				}
    			} else if (data.messageType === "connectionclosed" && data.id === phoneWebSocketID) {
    				$$invalidate(2, phoneHasConnected = false);
    				phoneWebSocketID = "";
    				socket.send(JSON.stringify({ id, messageType: "connectionclosed" }));
    				socket.close();
    				location.reload();
    			} else if (data.messageType === "playvideo" && data.id === phoneWebSocketID) {
    				isPaused.set(false);
    				console.log($isPaused);
    			} else if (data.messageType === "pausevideo" && data.id === phoneWebSocketID) {
    				isPaused.set(true);
    				console.log($isPaused);
    			}
    		};

    		window.onbeforeunload = () => {
    			socket.send(JSON.stringify({ id, messageType: "connectionclosed" }));
    			socket.close();
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
    		id,
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
    		if ("id" in $$props) id = $$props.id;
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
    		id,
    		socketIsOpen,
    		videoselection_selectedVideo_binding,
    		click_handler
    	];
    }

    class Computer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Computer",
    			options,
    			id: create_fragment$2.name
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
    const file$3 = "src\\Phone.svelte";

    // (140:0) {:else}
    function create_else_block$2(ctx) {
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Keep your phone screen unlocked! 🏃‍♀️";
    			t1 = space();
    			img = element("img");
    			attr_dev(h1, "class", "svelte-imh9mg");
    			add_location(h1, file$3, 140, 2, 3065);
    			if (img.src !== (img_src_value = /*gif*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Gif of somebody running");
    			add_location(img, file$3, 141, 2, 3116);
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
    		source: "(140:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (127:0) {#if !socketIsOpen || !desktopHasConnected}
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
    			add_location(h1, file$3, 127, 2, 2769);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "connectionCode");
    			attr_dev(input, "autocapitalize", "off");
    			input.autofocus = true;
    			attr_dev(input, "class", "svelte-imh9mg");
    			add_location(input, file$3, 131, 2, 2869);
    			attr_dev(button, "class", "svelte-imh9mg");
    			add_location(button, file$3, 138, 2, 3002);
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
    				listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
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
    		source: "(127:0) {#if !socketIsOpen || !desktopHasConnected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*socketIsOpen*/ ctx[2] || !/*desktopHasConnected*/ ctx[1]) return create_if_block$2;
    		return create_else_block$2;
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];
    	let id = v4();
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
    				id,
    				connectionCode,
    				messageType: "connection"
    			}));
    		};

    		socket.onmessage = e => {
    			const data = JSON.parse(e.data);

    			if (data.messageType === "connection" && data.connectionCode === connectionCode) {
    				$$invalidate(1, desktopHasConnected = true);
    				desktopWebSocketID = data.id;
    			} else if (data.messageType === "connectionclosed" && data.id === desktopWebSocketID) {
    				desktopWebSocketID = "";
    				$$invalidate(1, desktopHasConnected = false);
    				socket.send(JSON.stringify({ id, messageType: "connectionclosed" }));
    				socket.close();
    				window.removeEventListener("devicemotion", handleDeviceMotion);
    				location.reload();
    			}
    		};

    		window.onbeforeunload = () => {
    			socket.send(JSON.stringify({ id, messageType: "connectionclosed" }));
    			window.removeEventListener("devicemotion", handleDeviceMotion);
    			socket.close();
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
    			socket.send(JSON.stringify({ id, messageType: "playvideo" }));
    		} else if (!isRunning && wasRunningPreviously) {
    			socket.send(JSON.stringify({ id, messageType: "pausevideo" }));
    		}

    		wasRunningPreviously = isRunning;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Phone> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Phone", $$slots, []);

    	function input_input_handler() {
    		connectionCode = this.value;
    		$$invalidate(0, connectionCode);
    	}

    	$$self.$capture_state = () => ({
    		uuidv4: v4,
    		gifs,
    		gif,
    		id,
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
    		if ("id" in $$props) id = $$props.id;
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
    		id,
    		handleDeviceMotion,
    		input_input_handler
    	];
    }

    class Phone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Phone",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.20.1 */
    const file$4 = "src\\App.svelte";

    // (42:2) {:else}
    function create_else_block$3(ctx) {
    	let h1;
    	let t0;
    	let em;
    	let t2;
    	let t3;
    	let h2;
    	let t5;
    	let button0;
    	let svg0;
    	let path0;
    	let t6;
    	let t7;
    	let button1;
    	let svg1;
    	let path1;
    	let t8;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Welcome to Qua\n      ");
    			em = element("em");
    			em.textContent = "run";
    			t2 = text("\n      tine. You'll need a phone and a computer to get started!");
    			t3 = space();
    			h2 = element("h2");
    			h2.textContent = "Which device is this?";
    			t5 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t6 = text("\n      Computer");
    			t7 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t8 = text("\n      Phone");
    			attr_dev(em, "class", "svelte-hauglb");
    			add_location(em, file$4, 44, 6, 665);
    			add_location(h1, file$4, 42, 4, 633);
    			add_location(h2, file$4, 48, 4, 756);
    			attr_dev(path0, "fill", "#333");
    			attr_dev(path0, "d", "M21,14H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0\n          3,18H10L8,21V22H16V21L14,18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z");
    			add_location(path0, file$4, 52, 8, 909);
    			set_style(svg0, "width", "24px");
    			set_style(svg0, "height", "24px");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "class", "svelte-hauglb");
    			add_location(svg0, file$4, 51, 6, 844);
    			attr_dev(button0, "class", "svelte-hauglb");
    			add_location(button0, file$4, 50, 4, 792);
    			attr_dev(path1, "fill", "#333");
    			attr_dev(path1, "d", "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0\n          0,0 19,21V3C19,1.89 18.1,1 17,1Z");
    			add_location(path1, file$4, 62, 8, 1247);
    			set_style(svg1, "width", "24px");
    			set_style(svg1, "height", "24px");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "class", "svelte-hauglb");
    			add_location(svg1, file$4, 61, 6, 1182);
    			attr_dev(button1, "class", "svelte-hauglb");
    			add_location(button1, file$4, 60, 4, 1133);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, em);
    			append_dev(h1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button0, anchor);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(button0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(button1, t8);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    			];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(42:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:29) 
    function create_if_block_1$1(ctx) {
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(40:29) ",
    		ctx
    	});

    	return block;
    }

    // (38:2) {#if mode === 'COMPUTER'}
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
    		source: "(38:2) {#if mode === 'COMPUTER'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$1, create_else_block$3];
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
    			attr_dev(main, "class", "svelte-hauglb");
    			add_location(main, file$4, 36, 0, 523);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let mode;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	const click_handler = () => $$invalidate(0, mode = "COMPUTER");
    	const click_handler_1 = () => $$invalidate(0, mode = "PHONE");
    	$$self.$capture_state = () => ({ Computer, Phone, mode });

    	$$self.$inject_state = $$props => {
    		if ("mode" in $$props) $$invalidate(0, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mode, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
