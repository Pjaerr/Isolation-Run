
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function noop() {}

  var identity = function identity(x) {
    return x;
  };

  function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: {
        file: file,
        line: line,
        column: column,
        char: char
      }
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
    return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
  }

  function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
      throw new Error("'".concat(name, "' is not a store with a 'subscribe' method"));
    }
  }

  function subscribe(store) {
    if (store == null) {
      return noop;
    }

    for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      callbacks[_key - 1] = arguments[_key];
    }

    var unsub = store.subscribe.apply(store, callbacks);
    return unsub.unsubscribe ? function () {
      return unsub.unsubscribe();
    } : unsub;
  }

  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }

  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
  }

  var is_client = typeof window !== 'undefined';
  var now = is_client ? function () {
    return window.performance.now();
  } : function () {
    return Date.now();
  };
  var raf = is_client ? function (cb) {
    return requestAnimationFrame(cb);
  } : noop; // used internally for testing

  var tasks = new Set();

  function run_tasks(now) {
    tasks.forEach(function (task) {
      if (!task.c(now)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0) raf(run_tasks);
  }
  /**
   * Creates a new task that runs on each raf frame
   * until it returns a falsy value or is aborted
   */


  function loop(callback) {
    var task;
    if (tasks.size === 0) raf(run_tasks);
    return {
      promise: new Promise(function (fulfill) {
        tasks.add(task = {
          c: callback,
          f: fulfill
        });
      }),
      abort: function abort() {
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
    return function () {
      return node.removeEventListener(event, handler, options);
    };
  }

  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
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

  function select_option(select, value) {
    for (var i = 0; i < select.options.length; i += 1) {
      var option = select.options[i];

      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
  }

  function select_value(select) {
    var selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
  }

  function custom_event(type, detail) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
  }

  var active_docs = new Set();
  var active = 0; // https://github.com/darkskyapp/string-hash/blob/master/index.js

  function hash(str) {
    var hash = 5381;
    var i = str.length;

    while (i--) {
      hash = (hash << 5) - hash ^ str.charCodeAt(i);
    }

    return hash >>> 0;
  }

  function create_rule(node, a, b, duration, delay, ease, fn) {
    var uid = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
    var step = 16.666 / duration;
    var keyframes = '{\n';

    for (var p = 0; p <= 1; p += step) {
      var t = a + (b - a) * ease(p);
      keyframes += p * 100 + "%{".concat(fn(t, 1 - t), "}\n");
    }

    var rule = keyframes + "100% {".concat(fn(b, 1 - b), "}\n}");
    var name = "__svelte_".concat(hash(rule), "_").concat(uid);
    var doc = node.ownerDocument;
    active_docs.add(doc);
    var stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    var current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});

    if (!current_rules[name]) {
      current_rules[name] = true;
      stylesheet.insertRule("@keyframes ".concat(name, " ").concat(rule), stylesheet.cssRules.length);
    }

    var animation = node.style.animation || '';
    node.style.animation = "".concat(animation ? "".concat(animation, ", ") : "").concat(name, " ").concat(duration, "ms linear ").concat(delay, "ms 1 both");
    active += 1;
    return name;
  }

  function delete_rule(node, name) {
    var previous = (node.style.animation || '').split(', ');
    var next = previous.filter(name ? function (anim) {
      return anim.indexOf(name) < 0;
    } // remove specific animation
    : function (anim) {
      return anim.indexOf('__svelte') === -1;
    } // remove all Svelte animations
    );
    var deleted = previous.length - next.length;

    if (deleted) {
      node.style.animation = next.join(', ');
      active -= deleted;
      if (!active) clear_rules();
    }
  }

  function clear_rules() {
    raf(function () {
      if (active) return;
      active_docs.forEach(function (doc) {
        var stylesheet = doc.__svelte_stylesheet;
        var i = stylesheet.cssRules.length;

        while (i--) {
          stylesheet.deleteRule(i);
        }

        doc.__svelte_rules = {};
      });
      active_docs.clear();
    });
  }

  var current_component;

  function set_current_component(component) {
    current_component = component;
  }

  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;

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

  var flushing = false;
  var seen_callbacks = new Set();

  function flush() {
    if (flushing) return;
    flushing = true;

    do {
      // first, call beforeUpdate functions
      // and update components
      for (var i = 0; i < dirty_components.length; i += 1) {
        var component = dirty_components[i];
        set_current_component(component);
        update(component.$$);
      }

      dirty_components.length = 0;

      while (binding_callbacks.length) {
        binding_callbacks.pop()();
      } // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...


      for (var _i = 0; _i < render_callbacks.length; _i += 1) {
        var callback = render_callbacks[_i];

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
      var dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }

  var promise;

  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(function () {
        promise = null;
      });
    }

    return promise;
  }

  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event("".concat(direction ? 'intro' : 'outro').concat(kind)));
  }

  var outroing = new Set();
  var outros;

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
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(function () {
        outroing.delete(block);

        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }

  var null_transition = {
    duration: 0
  };

  function create_bidirectional_transition(node, fn, params, intro) {
    var config = fn(node, params);
    var t = intro ? 0 : 1;
    var running_program = null;
    var pending_program = null;
    var animation_name = null;

    function clear_animation() {
      if (animation_name) delete_rule(node, animation_name);
    }

    function init(program, duration) {
      var d = program.b - t;
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d: d,
        duration: duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }

    function go(b) {
      var _ref3 = config || null_transition,
          _ref3$delay = _ref3.delay,
          delay = _ref3$delay === void 0 ? 0 : _ref3$delay,
          _ref3$duration = _ref3.duration,
          duration = _ref3$duration === void 0 ? 300 : _ref3$duration,
          _ref3$easing = _ref3.easing,
          easing = _ref3$easing === void 0 ? identity : _ref3$easing,
          _ref3$tick = _ref3.tick,
          tick = _ref3$tick === void 0 ? noop : _ref3$tick,
          css = _ref3.css;

      var program = {
        start: now() + delay,
        b: b
      };

      if (!b) {
        // @ts-ignore todo: improve typings
        program.group = outros;
        outros.r += 1;
      }

      if (running_program) {
        pending_program = program;
      } else {
        // if this is an intro, and there's a delay, we need to do
        // an initial tick and/or apply CSS animation immediately
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }

        if (b) tick(0, 1);
        running_program = init(program, duration);
        add_render_callback(function () {
          return dispatch(node, b, 'start');
        });
        loop(function (now) {
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
                } else {
                  // outro — needs to be coordinated
                  if (! --running_program.group.r) run_all(running_program.group.c);
                }
              }

              running_program = null;
            } else if (now >= running_program.start) {
              var p = now - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }

          return !!(running_program || pending_program);
        });
      }
    }

    return {
      run: function run(b) {
        if (is_function(config)) {
          wait().then(function () {
            // @ts-ignore
            config = config();
            go(b);
          });
        } else {
          go(b);
        }
      },
      end: function end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }

  var globals = typeof window !== 'undefined' ? window : global;

  function bind(component, name, callback) {
    var index = component.$$.props[name];

    if (index !== undefined) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }

  function create_component(block) {
    block && block.c();
  }

  function mount_component(component, target, anchor) {
    var _component$$$ = component.$$,
        fragment = _component$$$.fragment,
        on_mount = _component$$$.on_mount,
        on_destroy = _component$$$.on_destroy,
        after_update = _component$$$.after_update;
    fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

    add_render_callback(function () {
      var new_on_destroy = on_mount.map(run).filter(is_function);

      if (on_destroy) {
        on_destroy.push.apply(on_destroy, _toConsumableArray(new_on_destroy));
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy);
      }

      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }

  function destroy_component(component, detaching) {
    var $$ = component.$$;

    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
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

    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }

  function init(component, options, instance, create_fragment, not_equal, props) {
    var dirty = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [-1];
    var parent_component = current_component;
    set_current_component(component);
    var prop_values = options.props || {};
    var $$ = component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props: props,
      update: noop,
      not_equal: not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(parent_component ? parent_component.$$.context : []),
      // everything else
      callbacks: blank_object(),
      dirty: dirty
    };
    var ready = false;
    $$.ctx = instance ? instance(component, prop_values, function (i, ret) {
      var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if ($$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }

      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update); // `false` as a special case of no DOM component

    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

    if (options.target) {
      if (options.hydrate) {
        var nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }

      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }

    set_current_component(parent_component);
  }

  var SvelteComponent = /*#__PURE__*/function () {
    function SvelteComponent() {
      _classCallCheck(this, SvelteComponent);
    }

    _createClass(SvelteComponent, [{
      key: "$destroy",
      value: function $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
    }, {
      key: "$on",
      value: function $on(type, callback) {
        var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return function () {
          var index = callbacks.indexOf(callback);
          if (index !== -1) callbacks.splice(index, 1);
        };
      }
    }, {
      key: "$set",
      value: function $set() {// overridden by instance, if it has props
      }
    }]);

    return SvelteComponent;
  }();

  function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({
      version: '3.20.1'
    }, detail)));
  }

  function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", {
      target: target,
      node: node
    });
    append(target, node);
  }

  function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", {
      target: target,
      node: node,
      anchor: anchor
    });
    insert(target, node, anchor);
  }

  function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", {
      node: node
    });
    detach(node);
  }

  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    var modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default) modifiers.push('preventDefault');
    if (has_stop_propagation) modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", {
      node: node,
      event: event,
      handler: handler,
      modifiers: modifiers
    });
    var dispose = listen(node, event, handler, options);
    return function () {
      dispatch_dev("SvelteDOMRemoveEventListener", {
        node: node,
        event: event,
        handler: handler,
        modifiers: modifiers
      });
      dispose();
    };
  }

  function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null) dispatch_dev("SvelteDOMRemoveAttribute", {
      node: node,
      attribute: attribute
    });else dispatch_dev("SvelteDOMSetAttribute", {
      node: node,
      attribute: attribute,
      value: value
    });
  }

  function validate_slots(name, slot, keys) {
    for (var _i2 = 0, _Object$keys = Object.keys(slot); _i2 < _Object$keys.length; _i2++) {
      var slot_key = _Object$keys[_i2];

      if (!~keys.indexOf(slot_key)) {
        console.warn("<".concat(name, "> received an unexpected slot \"").concat(slot_key, "\"."));
      }
    }
  }

  var SvelteComponentDev = /*#__PURE__*/function (_SvelteComponent) {
    _inherits(SvelteComponentDev, _SvelteComponent);

    var _super2 = _createSuper(SvelteComponentDev);

    function SvelteComponentDev(options) {
      _classCallCheck(this, SvelteComponentDev);

      if (!options || !options.target && !options.$$inline) {
        throw new Error("'target' is a required option");
      }

      return _super2.call(this);
    }

    _createClass(SvelteComponentDev, [{
      key: "$destroy",
      value: function $destroy() {
        _get(_getPrototypeOf(SvelteComponentDev.prototype), "$destroy", this).call(this);

        this.$destroy = function () {
          console.warn("Component was already destroyed"); // eslint-disable-line no-console
        };
      }
    }, {
      key: "$capture_state",
      value: function $capture_state() {}
    }, {
      key: "$inject_state",
      value: function $inject_state() {}
    }]);

    return SvelteComponentDev;
  }(SvelteComponent);

  function cubicOut(t) {
    var f = t - 1.0;
    return f * f * f + 1.0;
  }

  function quintInOut(t) {
    if ((t *= 2) < 1) return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2) * t * t * t * t + 2);
  }

  function slide(node, _ref4) {
    var _ref4$delay = _ref4.delay,
        delay = _ref4$delay === void 0 ? 0 : _ref4$delay,
        _ref4$duration = _ref4.duration,
        duration = _ref4$duration === void 0 ? 400 : _ref4$duration,
        _ref4$easing = _ref4.easing,
        easing = _ref4$easing === void 0 ? cubicOut : _ref4$easing;
    var style = getComputedStyle(node);
    var opacity = +style.opacity;
    var height = parseFloat(style.height);
    var padding_top = parseFloat(style.paddingTop);
    var padding_bottom = parseFloat(style.paddingBottom);
    var margin_top = parseFloat(style.marginTop);
    var margin_bottom = parseFloat(style.marginBottom);
    var border_top_width = parseFloat(style.borderTopWidth);
    var border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
      delay: delay,
      duration: duration,
      easing: easing,
      css: function css(t) {
        return "overflow: hidden;" + "opacity: ".concat(Math.min(t * 20, 1) * opacity, ";") + "height: ".concat(t * height, "px;") + "padding-top: ".concat(t * padding_top, "px;") + "padding-bottom: ".concat(t * padding_bottom, "px;") + "margin-top: ".concat(t * margin_top, "px;") + "margin-bottom: ".concat(t * margin_bottom, "px;") + "border-top-width: ".concat(t * border_top_width, "px;") + "border-bottom-width: ".concat(t * border_bottom_width, "px;");
      }
    };
  }

  function _createSuper$1(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$1()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var file = "src\\InfoModal.svelte";

  function create_fragment(ctx) {
    var div0;
    var t0;
    var section1;
    var div10;
    var header;
    var div1;
    var button;
    var svg;
    var path;
    var t1;
    var div2;
    var h1;
    var t3;
    var section0;
    var div3;
    var t5;
    var div9;
    var div4;
    var h20;
    var t7;
    var b0;
    var t9;
    var t10;
    var div5;
    var h21;
    var t12;
    var t13;
    var div6;
    var h22;
    var t15;
    var b1;
    var t17;
    var t18;
    var div7;
    var t20;
    var div8;
    var t21;
    var br0;
    var t22;
    var br1;
    var t23;
    var a;
    var section1_transition;
    var current;
    var dispose;
    var block = {
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
        div3.textContent = "Isolation Run is a fun little website that lets you watch a video on\r\n        your computer but only when your phone detects that you are running.\r\n        Hopefully a fun way to keep fit whilst locked indoors!";
        t5 = space();
        div9 = element("div");
        div4 = element("div");
        h20 = element("h2");
        h20.textContent = "Step 1:";
        t7 = text("\r\n          On your computer (or whatever screen you want to watch the video on),\r\n          open this website and click on the\r\n          ");
        b0 = element("b");
        b0.textContent = "Computer";
        t9 = text("\r\n          button.");
        t10 = space();
        div5 = element("div");
        h21 = element("h2");
        h21.textContent = "Step 2:";
        t12 = text("\r\n          You can then select from a list of predefined videos of walks through\r\n          scenery, cities etc or you can select your own video by pasting in the\r\n          youtube video ID.");
        t13 = space();
        div6 = element("div");
        h22 = element("h2");
        h22.textContent = "Step 3:";
        t15 = text("\r\n          Once you've done that, you should be presented with a code. Now you\r\n          must open this website on your phone and click\r\n          ");
        b1 = element("b");
        b1.textContent = "Phone";
        t17 = text("\r\n          and then enter in the code you see on your computer.");
        t18 = space();
        div7 = element("div");
        div7.textContent = "You can now start running with your phone in your hand and the video\r\n          will play! Remember to keep your phone screen unlocked for this to\r\n          work.";
        t20 = space();
        div8 = element("div");
        t21 = text("This site was made using Svelte and Nodejs. It uses WebSockets to\r\n          connect your computer to your phone and sends a message over the\r\n          network when your phone's accelerometer detects that you're running.\r\n          ");
        br0 = element("br");
        t22 = space();
        br1 = element("br");
        t23 = text("\r\n          The source code can be found\r\n          ");
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
        attr_dev(div3, "class", "body-intro svelte-gm7mmk");
        add_location(div3, file, 135, 6, 2405);
        add_location(h20, file, 143, 10, 2748);
        add_location(b0, file, 146, 10, 2903);
        attr_dev(div4, "class", "body-steps-step");
        add_location(div4, file, 142, 8, 2707);
        add_location(h21, file, 150, 10, 3004);
        attr_dev(div5, "class", "body-steps-step");
        add_location(div5, file, 149, 8, 2963);
        add_location(h22, file, 156, 10, 3279);
        add_location(b1, file, 159, 10, 3444);
        attr_dev(div6, "class", "body-steps-step");
        add_location(div6, file, 155, 8, 3238);
        attr_dev(div7, "class", "body-outro svelte-gm7mmk");
        add_location(div7, file, 163, 8, 3548);
        add_location(br0, file, 173, 10, 4043);
        add_location(br1, file, 174, 10, 4061);
        attr_dev(a, "href", "https://github.com/Pjaerr/Isolation-Run");
        add_location(a, file, 176, 10, 4119);
        attr_dev(div8, "class", "body-tech svelte-gm7mmk");
        add_location(div8, file, 169, 8, 3775);
        attr_dev(div9, "class", "body-steps svelte-gm7mmk");
        add_location(div9, file, 141, 6, 2673);
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
        append_dev(section0, t5);
        append_dev(section0, div9);
        append_dev(div9, div4);
        append_dev(div4, h20);
        append_dev(div4, t7);
        append_dev(div4, b0);
        append_dev(div4, t9);
        append_dev(div9, t10);
        append_dev(div9, div5);
        append_dev(div5, h21);
        append_dev(div5, t12);
        append_dev(div9, t13);
        append_dev(div9, div6);
        append_dev(div6, h22);
        append_dev(div6, t15);
        append_dev(div6, b1);
        append_dev(div6, t17);
        append_dev(div9, t18);
        append_dev(div9, div7);
        append_dev(div9, t20);
        append_dev(div9, div8);
        append_dev(div8, t21);
        append_dev(div8, br0);
        append_dev(div8, t22);
        append_dev(div8, br1);
        append_dev(div8, t23);
        append_dev(div8, a);
        current = true;
        if (remount) dispose();
        dispose = listen_dev(button, "click", function () {
          if (is_function(
          /*onClose*/
          ctx[0]))
            /*onClose*/
            ctx[0].apply(this, arguments);
        }, false, false, false);
      },
      p: function update(new_ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        ctx = new_ctx;
      },
      i: function intro(local) {
        if (current) return;
        add_render_callback(function () {
          if (!section1_transition) section1_transition = create_bidirectional_transition(section1, slide, {
            duration: 200,
            easing: quintInOut
          }, true);
          section1_transition.run(1);
        });
        current = true;
      },
      o: function outro(local) {
        if (!section1_transition) section1_transition = create_bidirectional_transition(section1, slide, {
          duration: 200,
          easing: quintInOut
        }, false);
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
      block: block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance($$self, $$props, $$invalidate) {
    var onClose = $$props.onClose;
    var writable_props = ["onClose"];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn("<InfoModal> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("InfoModal", $$slots, []);

    $$self.$set = function ($$props) {
      if ("onClose" in $$props) $$invalidate(0, onClose = $$props.onClose);
    };

    $$self.$capture_state = function () {
      return {
        slide: slide,
        quintInOut: quintInOut,
        onClose: onClose
      };
    };

    $$self.$inject_state = function ($$props) {
      if ("onClose" in $$props) $$invalidate(0, onClose = $$props.onClose);
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [onClose];
  }

  var InfoModal = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(InfoModal, _SvelteComponentDev);

    var _super = _createSuper$1(InfoModal);

    function InfoModal(options) {
      var _this;

      _classCallCheck(this, InfoModal);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
        onClose: 0
      });
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "InfoModal",
        options: options,
        id: create_fragment.name
      });
      var ctx = _this.$$.ctx;
      var props = options.props || {};

      if (
      /*onClose*/
      ctx[0] === undefined && !("onClose" in props)) {
        console.warn("<InfoModal> was created without expected prop 'onClose'");
      }

      return _this;
    }

    _createClass(InfoModal, [{
      key: "onClose",
      get: function get() {
        throw new Error("<InfoModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      },
      set: function set(value) {
        throw new Error("<InfoModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      }
    }]);

    return InfoModal;
  }(SvelteComponentDev);

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

  var subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */


  function writable(value) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    var stop;
    var subscribers = [];

    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;

        if (stop) {
          // store is ready
          var run_queue = !subscriber_queue.length;

          for (var i = 0; i < subscribers.length; i += 1) {
            var s = subscribers[i];
            s[1]();
            subscriber_queue.push(s, value);
          }

          if (run_queue) {
            for (var _i = 0; _i < subscriber_queue.length; _i += 2) {
              subscriber_queue[_i][0](subscriber_queue[_i + 1]);
            }

            subscriber_queue.length = 0;
          }
        }
      }
    }

    function update(fn) {
      set(fn(value));
    }

    function subscribe(run) {
      var invalidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var subscriber = [run, invalidate];
      subscribers.push(subscriber);

      if (subscribers.length === 1) {
        stop = start(set) || noop;
      }

      run(value);
      return function () {
        var index = subscribers.indexOf(subscriber);

        if (index !== -1) {
          subscribers.splice(index, 1);
        }

        if (subscribers.length === 0) {
          stop();
          stop = null;
        }
      };
    }

    return {
      set: set,
      update: update,
      subscribe: subscribe
    };
  }

  var isPaused = writable(true);

  function _createSuper$2(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$2()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var file$1 = "src\\VideoSelection.svelte"; // (61:4) {:else}

  function create_else_block(ctx) {
    var p;
    var t0;
    var a;
    var t2;
    var t3;
    var label;
    var t4;
    var select;
    var option0;
    var option0_value_value;
    var option1;
    var option1_value_value;
    var option2;
    var option2_value_value;
    var option3;
    var option3_value_value;
    var option4;
    var option4_value_value;
    var option5;
    var option5_value_value;
    var dispose;
    var block = {
      c: function create() {
        p = element("p");
        t0 = text("All Predefined Videos are taken from the\r\n        ");
        a = element("a");
        a.textContent = "Treadmill TV";
        t2 = text("\r\n        channel");
        t3 = space();
        label = element("label");
        t4 = text("Choose Scene:\r\n        ");
        select = element("select");
        option0 = element("option");
        option0.textContent = "London\r\n          ";
        option1 = element("option");
        option1.textContent = "High Banks Metro Park, Ohio\r\n          ";
        option2 = element("option");
        option2.textContent = "Lisbon, Ohio\r\n          ";
        option3 = element("option");
        option3.textContent = "Torquay, Australia\r\n          ";
        option4 = element("option");
        option4.textContent = "Paris";
        option5 = element("option");
        option5.textContent = "Hawaii";
        attr_dev(a, "href", "https://www.youtube.com/channel/UCq5O2ZfzRQChMdahnpKpGVg");
        add_location(a, file$1, 63, 8, 1418);
        add_location(p, file$1, 61, 6, 1355);
        option0.__value = option0_value_value = {
          id: "lij9G5z1xZE",
          startTime: "240"
        };
        option0.value = option0.__value;
        add_location(option0, file$1, 71, 10, 1647);
        option1.__value = option1_value_value = {
          id: "ngAbdEQA9nQ",
          startTime: "157"
        };
        option1.value = option1.__value;
        add_location(option1, file$1, 74, 10, 1756);
        option2.__value = option2_value_value = {
          id: "wBpzSRasvtk",
          startTime: "47"
        };
        option2.value = option2.__value;
        add_location(option2, file$1, 77, 10, 1886);
        option3.__value = option3_value_value = {
          id: "iKwzffVt16M",
          startTime: "57"
        };
        option3.value = option3.__value;
        add_location(option3, file$1, 80, 10, 2000);
        option4.__value = option4_value_value = {
          id: "qYD68Zvw8UE",
          startTime: "60"
        };
        option4.value = option4.__value;
        add_location(option4, file$1, 83, 10, 2120);
        option5.__value = option5_value_value = {
          id: "x_buQ7zYqHE",
          startTime: "120"
        };
        option5.value = option5.__value;
        add_location(option5, file$1, 84, 10, 2201);
        if (
        /*selectedVideo*/
        ctx[0] === void 0) add_render_callback(function () {
          return (
            /*select_change_handler*/
            ctx[7].call(select)
          );
        });
        add_location(select, file$1, 70, 8, 1600);
        add_location(label, file$1, 68, 6, 1560);
      },
      m: function mount(target, anchor, remount) {
        insert_dev(target, p, anchor);
        append_dev(p, t0);
        append_dev(p, a);
        append_dev(p, t2);
        insert_dev(target, t3, anchor);
        insert_dev(target, label, anchor);
        append_dev(label, t4);
        append_dev(label, select);
        append_dev(select, option0);
        append_dev(select, option1);
        append_dev(select, option2);
        append_dev(select, option3);
        append_dev(select, option4);
        append_dev(select, option5);
        select_option(select,
        /*selectedVideo*/
        ctx[0]);
        if (remount) dispose();
        dispose = listen_dev(select, "change",
        /*select_change_handler*/
        ctx[7]);
      },
      p: function update(ctx, dirty) {
        if (dirty &
        /*selectedVideo*/
        1) {
          select_option(select,
          /*selectedVideo*/
          ctx[0]);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(p);
        if (detaching) detach_dev(t3);
        if (detaching) detach_dev(label);
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block: block,
      id: create_else_block.name,
      type: "else",
      source: "(61:4) {:else}",
      ctx: ctx
    });
    return block;
  } // (54:4) {#if isUserDefinedOption}


  function create_if_block(ctx) {
    var label;
    var t0;
    var b;
    var t2;
    var input;
    var dispose;
    var block = {
      c: function create() {
        label = element("label");
        t0 = text("Video ID (eg: youtube.com/watch?v=\r\n        ");
        b = element("b");
        b.textContent = "Hndf5JRwUL0";
        t2 = text("\r\n        ) :\r\n        ");
        input = element("input");
        add_location(b, file$1, 56, 8, 1225);
        attr_dev(input, "type", "text");
        add_location(input, file$1, 58, 8, 1266);
        add_location(label, file$1, 54, 6, 1164);
      },
      m: function mount(target, anchor, remount) {
        insert_dev(target, label, anchor);
        append_dev(label, t0);
        append_dev(label, b);
        append_dev(label, t2);
        append_dev(label, input);
        set_input_value(input,
        /*userDefinedOption*/
        ctx[2]);
        if (remount) dispose();
        dispose = listen_dev(input, "input",
        /*input_input_handler*/
        ctx[6]);
      },
      p: function update(ctx, dirty) {
        if (dirty &
        /*userDefinedOption*/
        4 && input.value !==
        /*userDefinedOption*/
        ctx[2]) {
          set_input_value(input,
          /*userDefinedOption*/
          ctx[2]);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(label);
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block: block,
      id: create_if_block.name,
      type: "if",
      source: "(54:4) {#if isUserDefinedOption}",
      ctx: ctx
    });
    return block;
  }

  function create_fragment$1(ctx) {
    var section;
    var div0;
    var label0;
    var input0;
    var input0_value_value;
    var t0;
    var t1;
    var label1;
    var input1;
    var input1_value_value;
    var t2;
    var t3;
    var div1;
    var dispose;

    function select_block_type(ctx, dirty) {
      if (
      /*isUserDefinedOption*/
      ctx[1]) return create_if_block;
      return create_else_block;
    }

    var current_block_type = select_block_type(ctx);
    var if_block = current_block_type(ctx);
    var block = {
      c: function create() {
        section = element("section");
        div0 = element("div");
        label0 = element("label");
        input0 = element("input");
        t0 = text("\r\n      Choose a predefined video");
        t1 = space();
        label1 = element("label");
        input1 = element("input");
        t2 = text("\r\n      Choose your own video");
        t3 = space();
        div1 = element("div");
        if_block.c();
        attr_dev(input0, "type", "radio");
        input0.__value = input0_value_value = false;
        input0.value = input0.__value;
        /*$$binding_groups*/

        ctx[4][0].push(input0);
        add_location(input0, file$1, 43, 6, 835);
        attr_dev(label0, "class", "svelte-1mescb9");
        add_location(label0, file$1, 42, 4, 820);
        attr_dev(input1, "type", "radio");
        input1.__value = input1_value_value = true;
        input1.value = input1.__value;
        /*$$binding_groups*/

        ctx[4][0].push(input1);
        add_location(input1, file$1, 47, 6, 972);
        attr_dev(label1, "class", "svelte-1mescb9");
        add_location(label1, file$1, 46, 4, 957);
        attr_dev(div0, "class", "mode-input svelte-1mescb9");
        add_location(div0, file$1, 41, 2, 790);
        attr_dev(div1, "class", "option-input svelte-1mescb9");
        add_location(div1, file$1, 52, 2, 1099);
        attr_dev(section, "class", "video-selection svelte-1mescb9");
        add_location(section, file$1, 40, 0, 753);
      },
      l: function claim(nodes) {
        throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
      },
      m: function mount(target, anchor, remount) {
        insert_dev(target, section, anchor);
        append_dev(section, div0);
        append_dev(div0, label0);
        append_dev(label0, input0);
        input0.checked = input0.__value ===
        /*isUserDefinedOption*/
        ctx[1];
        append_dev(label0, t0);
        append_dev(div0, t1);
        append_dev(div0, label1);
        append_dev(label1, input1);
        input1.checked = input1.__value ===
        /*isUserDefinedOption*/
        ctx[1];
        append_dev(label1, t2);
        append_dev(section, t3);
        append_dev(section, div1);
        if_block.m(div1, null);
        if (remount) run_all(dispose);
        dispose = [listen_dev(input0, "change",
        /*input0_change_handler*/
        ctx[3]), listen_dev(input1, "change",
        /*input1_change_handler*/
        ctx[5])];
      },
      p: function update(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (dirty &
        /*isUserDefinedOption*/
        2) {
          input0.checked = input0.__value ===
          /*isUserDefinedOption*/
          ctx[1];
        }

        if (dirty &
        /*isUserDefinedOption*/
        2) {
          input1.checked = input1.__value ===
          /*isUserDefinedOption*/
          ctx[1];
        }

        if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx);

          if (if_block) {
            if_block.c();
            if_block.m(div1, null);
          }
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(section);
        /*$$binding_groups*/

        ctx[4][0].splice(
        /*$$binding_groups*/
        ctx[4][0].indexOf(input0), 1);
        /*$$binding_groups*/

        ctx[4][0].splice(
        /*$$binding_groups*/
        ctx[4][0].indexOf(input1), 1);
        if_block.d();
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block: block,
      id: create_fragment$1.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance$1($$self, $$props, $$invalidate) {
    var _$$props$selectedVide = $$props.selectedVideo,
        selectedVideo = _$$props$selectedVide === void 0 ? {
      id: "lij9G5z1xZE",
      startTime: "240"
    } : _$$props$selectedVide;
    var isUserDefinedOption = false;
    var userDefinedOption = "";
    var writable_props = ["selectedVideo"];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn("<VideoSelection> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("VideoSelection", $$slots, []);
    var $$binding_groups = [[]];

    function input0_change_handler() {
      isUserDefinedOption = this.__value;
      $$invalidate(1, isUserDefinedOption);
    }

    function input1_change_handler() {
      isUserDefinedOption = this.__value;
      $$invalidate(1, isUserDefinedOption);
    }

    function input_input_handler() {
      userDefinedOption = this.value;
      $$invalidate(2, userDefinedOption);
    }

    function select_change_handler() {
      selectedVideo = select_value(this);
      ($$invalidate(0, selectedVideo), $$invalidate(1, isUserDefinedOption)), $$invalidate(2, userDefinedOption);
    }

    $$self.$set = function ($$props) {
      if ("selectedVideo" in $$props) $$invalidate(0, selectedVideo = $$props.selectedVideo);
    };

    $$self.$capture_state = function () {
      return {
        selectedVideo: selectedVideo,
        isUserDefinedOption: isUserDefinedOption,
        userDefinedOption: userDefinedOption
      };
    };

    $$self.$inject_state = function ($$props) {
      if ("selectedVideo" in $$props) $$invalidate(0, selectedVideo = $$props.selectedVideo);
      if ("isUserDefinedOption" in $$props) $$invalidate(1, isUserDefinedOption = $$props.isUserDefinedOption);
      if ("userDefinedOption" in $$props) $$invalidate(2, userDefinedOption = $$props.userDefinedOption);
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = function () {
      if ($$self.$$.dirty &
      /*isUserDefinedOption, userDefinedOption*/
      6) {
         {
          if (isUserDefinedOption) {
            $$invalidate(0, selectedVideo = {
              id: userDefinedOption,
              startTime: "0"
            });
          } else {
            $$invalidate(0, selectedVideo = {
              id: "lij9G5z1xZE",
              startTime: "240"
            });
          }
        }
      }
    };

    return [selectedVideo, isUserDefinedOption, userDefinedOption, input0_change_handler, $$binding_groups, input1_change_handler, input_input_handler, select_change_handler];
  }

  var VideoSelection = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(VideoSelection, _SvelteComponentDev);

    var _super = _createSuper$2(VideoSelection);

    function VideoSelection(options) {
      var _this;

      _classCallCheck(this, VideoSelection);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
        selectedVideo: 0
      });
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "VideoSelection",
        options: options,
        id: create_fragment$1.name
      });
      return _this;
    }

    _createClass(VideoSelection, [{
      key: "selectedVideo",
      get: function get() {
        throw new Error("<VideoSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      },
      set: function set(value) {
        throw new Error("<VideoSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      }
    }]);

    return VideoSelection;
  }(SvelteComponentDev);

  function _createSuper$3(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$3()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var console_1 = globals.console;
  var file$2 = "src\\Video.svelte";

  function create_fragment$2(ctx) {
    var script0;
    var script0_src_value;
    var script1;
    var t1;
    var iframe;
    var iframe_src_value;
    var block = {
      c: function create() {
        script0 = element("script");
        script1 = element("script");
        script1.textContent = "window.onYouTubeIframeAPIReady = function() {\r\n      window.YOUTUBE_PLAYER = new YT.Player(\"youtube_player_iframe\", {\r\n        events: {\r\n          onReady: function() {\r\n            window.YOUTUBE_PLAYER_ISREADY = true;\r\n\r\n            setTimeout(function() {\r\n              window.YOUTUBE_PLAYER.pauseVideo();\r\n            }, 1000);\r\n          }\r\n        }\r\n      });\r\n    };";
        t1 = space();
        iframe = element("iframe");
        if (script0.src !== (script0_src_value = "https://www.youtube.com/iframe_api")) attr_dev(script0, "src", script0_src_value);
        add_location(script0, file$2, 24, 2, 519);
        add_location(script1, file$2, 27, 2, 587);
        attr_dev(iframe, "title", "youtube video");
        attr_dev(iframe, "id", "youtube_player_iframe");
        attr_dev(iframe, "width", "100%");
        attr_dev(iframe, "height", "100%");
        if (iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" +
        /*youtubeVideoID*/
        ctx[0] + "?start=" +
        /*startTime*/
        ctx[1] + "&enablejsapi=1&origin=https://" + location.host + "&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=1")) attr_dev(iframe, "src", iframe_src_value);
        attr_dev(iframe, "frameborder", "0");
        attr_dev(iframe, "allow", "autoplay; encrypted-media;");
        attr_dev(iframe, "class", "svelte-1cs7gxr");
        add_location(iframe, file$2, 44, 0, 1010);
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
      p: function update(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (dirty &
        /*youtubeVideoID, startTime*/
        3 && iframe.src !== (iframe_src_value = "https://www.youtube.com/embed/" +
        /*youtubeVideoID*/
        ctx[0] + "?start=" +
        /*startTime*/
        ctx[1] + "&enablejsapi=1&origin=https://" + location.host + "&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=1")) {
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
      block: block,
      id: create_fragment$2.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
    var $isPaused;
    validate_store(isPaused, "isPaused");
    component_subscribe($$self, isPaused, function ($$value) {
      return $$invalidate(2, $isPaused = $$value);
    });
    var youtubeVideoID = $$props.youtubeVideoID;
    var _$$props$startTime = $$props.startTime,
        startTime = _$$props$startTime === void 0 ? "0" : _$$props$startTime;
    var writable_props = ["youtubeVideoID", "startTime"];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn("<Video> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("Video", $$slots, []);

    $$self.$set = function ($$props) {
      if ("youtubeVideoID" in $$props) $$invalidate(0, youtubeVideoID = $$props.youtubeVideoID);
      if ("startTime" in $$props) $$invalidate(1, startTime = $$props.startTime);
    };

    $$self.$capture_state = function () {
      return {
        isPaused: isPaused,
        youtubeVideoID: youtubeVideoID,
        startTime: startTime,
        $isPaused: $isPaused
      };
    };

    $$self.$inject_state = function ($$props) {
      if ("youtubeVideoID" in $$props) $$invalidate(0, youtubeVideoID = $$props.youtubeVideoID);
      if ("startTime" in $$props) $$invalidate(1, startTime = $$props.startTime);
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = function () {
      if ($$self.$$.dirty &
      /*$isPaused*/
      4) {
         if ($isPaused === true) {
          console.log("Pausing Video");
          if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.pauseVideo();
        }
      }

      if ($$self.$$.dirty &
      /*$isPaused*/
      4) {
         if ($isPaused === false) {
          console.log("Playing Video");
          if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.playVideo();
        }
      }
    };

    return [youtubeVideoID, startTime];
  }

  var Video = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(Video, _SvelteComponentDev);

    var _super = _createSuper$3(Video);

    function Video(options) {
      var _this;

      _classCallCheck(this, Video);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, {
        youtubeVideoID: 0,
        startTime: 1
      });
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "Video",
        options: options,
        id: create_fragment$2.name
      });
      var ctx = _this.$$.ctx;
      var props = options.props || {};

      if (
      /*youtubeVideoID*/
      ctx[0] === undefined && !("youtubeVideoID" in props)) {
        console_1.warn("<Video> was created without expected prop 'youtubeVideoID'");
      }

      return _this;
    }

    _createClass(Video, [{
      key: "youtubeVideoID",
      get: function get() {
        throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      },
      set: function set(value) {
        throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      }
    }, {
      key: "startTime",
      get: function get() {
        throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      },
      set: function set(value) {
        throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
      }
    }]);

    return Video;
  }(SvelteComponentDev);

  function _createSuper$4(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$4()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var file$3 = "src\\Computer.svelte"; // (94:0) {#if !phoneHasConnected}

  function create_if_block_2(ctx) {
    var a;
    var block = {
      c: function create() {
        a = element("a");
        a.textContent = "Go back";
        attr_dev(a, "class", "back-button svelte-binvma");
        attr_dev(a, "href", "/");
        add_location(a, file$3, 94, 2, 2010);
      },
      m: function mount(target, anchor) {
        insert_dev(target, a, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(a);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block: block,
      id: create_if_block_2.name,
      type: "if",
      source: "(94:0) {#if !phoneHasConnected}",
      ctx: ctx
    });
    return block;
  } // (107:0) {:else}


  function create_else_block_1(ctx) {
    var h1;
    var t1;
    var updating_selectedVideo;
    var t2;
    var button;
    var current;
    var dispose;

    function videoselection_selectedVideo_binding(value) {
      /*videoselection_selectedVideo_binding*/
      ctx[8].call(null, value);
    }

    var videoselection_props = {};

    if (
    /*selectedVideo*/
    ctx[1] !== void 0) {
      videoselection_props.selectedVideo =
      /*selectedVideo*/
      ctx[1];
    }

    var videoselection = new VideoSelection({
      props: videoselection_props,
      $$inline: true
    });
    binding_callbacks.push(function () {
      return bind(videoselection, "selectedVideo", videoselection_selectedVideo_binding);
    });
    var block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "Choose your video:";
        t1 = space();
        create_component(videoselection.$$.fragment);
        t2 = space();
        button = element("button");
        button.textContent = "Go!";
        attr_dev(h1, "class", "svelte-binvma");
        add_location(h1, file$3, 107, 2, 2352);
        attr_dev(button, "class", "svelte-binvma");
        add_location(button, file$3, 109, 2, 2424);
      },
      m: function mount(target, anchor, remount) {
        insert_dev(target, h1, anchor);
        insert_dev(target, t1, anchor);
        mount_component(videoselection, target, anchor);
        insert_dev(target, t2, anchor);
        insert_dev(target, button, anchor);
        current = true;
        if (remount) dispose();
        dispose = listen_dev(button, "click",
        /*click_handler*/
        ctx[9], false, false, false);
      },
      p: function update(ctx, dirty) {
        var videoselection_changes = {};

        if (!updating_selectedVideo && dirty &
        /*selectedVideo*/
        2) {
          updating_selectedVideo = true;
          videoselection_changes.selectedVideo =
          /*selectedVideo*/
          ctx[1];
          add_flush_callback(function () {
            return updating_selectedVideo = false;
          });
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
      block: block,
      id: create_else_block_1.name,
      type: "else",
      source: "(107:0) {:else}",
      ctx: ctx
    });
    return block;
  } // (98:0) {#if hasChosenVideo}


  function create_if_block$1(ctx) {
    var current_block_type_index;
    var if_block;
    var if_block_anchor;
    var current;
    var if_block_creators = [create_if_block_1, create_else_block$1];
    var if_blocks = [];

    function select_block_type_1(ctx, dirty) {
      if (
      /*phoneHasConnected*/
      ctx[2]) return 0;
      return 1;
    }

    current_block_type_index = select_block_type_1(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    var block = {
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
        var previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, function () {
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
      block: block,
      id: create_if_block$1.name,
      type: "if",
      source: "(98:0) {#if hasChosenVideo}",
      ctx: ctx
    });
    return block;
  } // (103:2) {:else}


  function create_else_block$1(ctx) {
    var h10;
    var t1;
    var h11;
    var block = {
      c: function create() {
        h10 = element("h1");
        h10.textContent = "Enter the following code on your phone to connect:";
        t1 = space();
        h11 = element("h1");
        h11.textContent = "".concat(
        /*connectionCode*/
        ctx[3]);
        attr_dev(h10, "class", "svelte-binvma");
        add_location(h10, file$3, 103, 4, 2227);
        attr_dev(h11, "class", "code svelte-binvma");
        add_location(h11, file$3, 104, 4, 2292);
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
      block: block,
      id: create_else_block$1.name,
      type: "else",
      source: "(103:2) {:else}",
      ctx: ctx
    });
    return block;
  } // (99:2) {#if phoneHasConnected}


  function create_if_block_1(ctx) {
    var current;
    var video = new Video({
      props: {
        youtubeVideoID:
        /*selectedVideo*/
        ctx[1].id,
        startTime:
        /*selectedVideo*/
        ctx[1].startTime
      },
      $$inline: true
    });
    var block = {
      c: function create() {
        create_component(video.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(video, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        var video_changes = {};
        if (dirty &
        /*selectedVideo*/
        2) video_changes.youtubeVideoID =
        /*selectedVideo*/
        ctx[1].id;
        if (dirty &
        /*selectedVideo*/
        2) video_changes.startTime =
        /*selectedVideo*/
        ctx[1].startTime;
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
      block: block,
      id: create_if_block_1.name,
      type: "if",
      source: "(99:2) {#if phoneHasConnected}",
      ctx: ctx
    });
    return block;
  }

  function create_fragment$3(ctx) {
    var t;
    var current_block_type_index;
    var if_block1;
    var if_block1_anchor;
    var current;
    var if_block0 = !
    /*phoneHasConnected*/
    ctx[2] && create_if_block_2(ctx);
    var if_block_creators = [create_if_block$1, create_else_block_1];
    var if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (
      /*hasChosenVideo*/
      ctx[0]) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    var block = {
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
      p: function update(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (!
        /*phoneHasConnected*/
        ctx[2]) {
          if (!if_block0) {
            if_block0 = create_if_block_2(ctx);
            if_block0.c();
            if_block0.m(t.parentNode, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        var previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, function () {
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
      block: block,
      id: create_fragment$3.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance$3($$self, $$props, $$invalidate) {
    var hasChosenVideo = false;
    var selectedVideo;
    var connectionCode = v4().substring(0, 8);
    var phoneWebSocketID = "";
    var phoneHasConnected = false;
    var socket;
    var socketIsOpen = false;

    function openConnection() {
      socket = new WebSocket("wss://" + location.host);

      socket.onopen = function (e) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            connectionCode: connectionCode,
            messageType: "connection"
          }));
        }
      };

      socket.onclose = function (e) {
        location.reload();
      };

      socket.onmessage = function (e) {
        var data = JSON.parse(e.data);

        if (data.messageType === "connection") {
          $$invalidate(2, phoneHasConnected = true);
          phoneWebSocketID = data.id;

          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              connectionCode: connectionCode,
              messageType: "connection"
            }));
          }
        } else if (data.messageType === "playvideo") {
          isPaused.set(false);
        } else if (data.messageType === "pausevideo") {
          isPaused.set(true);
        }
      };

      window.onbeforeunload = function () {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            partnerID: phoneWebSocketID,
            messageType: "connectionclosed"
          }));
        }
      };
    }

    var writable_props = [];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn("<Computer> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("Computer", $$slots, []);

    function videoselection_selectedVideo_binding(value) {
      selectedVideo = value;
      $$invalidate(1, selectedVideo);
    }

    var click_handler = function click_handler() {
      $$invalidate(0, hasChosenVideo = true);
      openConnection();
    };

    $$self.$capture_state = function () {
      return {
        uuidv4: v4,
        isPaused: isPaused,
        VideoSelection: VideoSelection,
        Video: Video,
        hasChosenVideo: hasChosenVideo,
        selectedVideo: selectedVideo,
        connectionCode: connectionCode,
        phoneWebSocketID: phoneWebSocketID,
        phoneHasConnected: phoneHasConnected,
        socket: socket,
        socketIsOpen: socketIsOpen,
        openConnection: openConnection
      };
    };

    $$self.$inject_state = function ($$props) {
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

    return [hasChosenVideo, selectedVideo, phoneHasConnected, connectionCode, openConnection, phoneWebSocketID, socket, socketIsOpen, videoselection_selectedVideo_binding, click_handler];
  }

  var Computer = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(Computer, _SvelteComponentDev);

    var _super = _createSuper$4(Computer);

    function Computer(options) {
      var _this;

      _classCallCheck(this, Computer);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "Computer",
        options: options,
        id: create_fragment$3.name
      });
      return _this;
    }

    return Computer;
  }(SvelteComponentDev);

  /**
   *
   * @param {(deviceHasMoved: boolean) => void} onDeviceMove
   * @param {number} timeout
   * @param {number} threshold
   */
  function accelerometer(onDeviceMove) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
    var previousTime = new Date();
    var previousAcceleration = {
      x: null,
      y: null,
      z: null
    };

    var handleDeviceMotion = function handleDeviceMotion(e) {
      var currentAcceleration = e.accelerationIncludingGravity;
      var currentTime;
      var timeDifference;
      var delta = {
        x: 0,
        y: 0,
        z: 0
      }; //If this is the first time the device has moved, store acceleration values and wait for the next movement before doing calculations.

      if (previousAcceleration.x === null && previousAcceleration.y === null && previousAcceleration.z === null) {
        previousAcceleration = currentAcceleration;
        return;
      } //Get the time since we last moved


      currentTime = new Date();
      timeDifference = currentTime.getTime() - previousTime.getTime();

      if (timeDifference > timeout) {
        //Store the change in acceleration
        delta.x = Math.abs(previousAcceleration.x - currentAcceleration.x);
        delta.y = Math.abs(previousAcceleration.y - currentAcceleration.y);
        delta.z = Math.abs(previousAcceleration.z - currentAcceleration.z); //We have registered a device movement as the change in
        //acceleration on any one of the axis is greater than
        //the given threshold

        if (delta.x > threshold && delta.y > threshold || delta.x > threshold && delta.z > threshold || delta.y > threshold && delta.z > threshold) {
          onDeviceMove(true);
        } else {
          onDeviceMove(false);
        }

        previousAcceleration = currentAcceleration;
        previousTime = new Date();
      }
    }; //Does this browser support the devicemotion event


    if ("ondevicemotion" in window) {
      window.addEventListener("devicemotion", handleDeviceMotion, false);
    }
  }

  function disableShakeToUndo(node) {
    node.onkeypress = function (e) {
      e.preventDefault();
      var nationUnicode = e.which;
      var utf8 = encodeURIComponent(String.fromCharCode(parseInt(nationUnicode, 10))); //This isn't an emoji

      if (utf8.search("%EF") !== 0) {
        node.value = node.value + String.fromCharCode(nationUnicode);
        node.dispatchEvent(new CustomEvent("inputChanged", {
          detail: node.value
        }));
      }
    };

    node.onkeydown = function (e) {
      if (e.keyCode == 8) {
        e.preventDefault();
        var value = node.value;
        node.value = value.slice(0, value.length - 1);
        node.dispatchEvent(new CustomEvent("inputChanged", {
          detail: node.value
        }));
      }
    };
  }

  var gifs = ["https://media.giphy.com/media/13mLwGra9bNEKQ/giphy.gif", "https://media.giphy.com/media/3o6gDPEhWHyWWMaATK/giphy.gif", "https://media.giphy.com/media/lRnUWhmllPI9a/giphy.gif", "https://media.giphy.com/media/fnR1k3CZLQt3y/giphy.gif", "https://media.giphy.com/media/r1ISdfVnrhOhi/giphy.gif", "https://media.giphy.com/media/2bUpP71bbVnZ3x7lgQ/giphy.gif", "https://media.giphy.com/media/EaMTsoYxfPpuw/giphy.gif", "https://media.giphy.com/media/1iTH1WIUjM0VATSw/giphy.gif", "https://media.giphy.com/media/sRKg9r2YWeCTG5JTTo/giphy.gif", "https://media.giphy.com/media/pVtulZdJsUuCQ/giphy.gif"];

  function _createSuper$5(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$5()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var console_1$1 = globals.console;
  var file$4 = "src\\Phone.svelte"; // (141:0) {#if !desktopHasConnected}

  function create_if_block_1$1(ctx) {
    var a;
    var block = {
      c: function create() {
        a = element("a");
        a.textContent = "Go back";
        attr_dev(a, "class", "back-button svelte-leyv7d");
        attr_dev(a, "href", "/");
        add_location(a, file$4, 141, 2, 3034);
      },
      m: function mount(target, anchor) {
        insert_dev(target, a, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(a);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block: block,
      id: create_if_block_1$1.name,
      type: "if",
      source: "(141:0) {#if !desktopHasConnected}",
      ctx: ctx
    });
    return block;
  } // (164:0) {:else}


  function create_else_block$2(ctx) {
    var h1;
    var t1;
    var img;
    var img_src_value;
    var block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "Keep your phone screen unlocked and start running! 🏃‍♀️";
        t1 = space();
        img = element("img");
        attr_dev(h1, "class", "svelte-leyv7d");
        add_location(h1, file$4, 164, 2, 3604);
        if (img.src !== (img_src_value =
        /*gif*/
        ctx[3])) attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "Gif of somebody running");
        add_location(img, file$4, 165, 2, 3673);
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
      block: block,
      id: create_else_block$2.name,
      type: "else",
      source: "(164:0) {:else}",
      ctx: ctx
    });
    return block;
  } // (145:0) {#if !socketIsOpen || !desktopHasConnected}


  function create_if_block$2(ctx) {
    var h1;
    var t1;
    var input;
    var disableShakeToUndo_action;
    var t2;
    var button;
    var dispose;
    var block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "Visit this website on your desktop to find the code you need to enter here:";
        t1 = space();
        input = element("input");
        t2 = space();
        button = element("button");
        button.textContent = "Connect";
        attr_dev(h1, "class", "svelte-leyv7d");
        add_location(h1, file$4, 145, 2, 3135);
        attr_dev(input, "type", "text");
        attr_dev(input, "name", "connectionCode");
        attr_dev(input, "autocapitalize", "off");
        attr_dev(input, "autocomplete", "off");
        input.autofocus = true;
        attr_dev(input, "class", "svelte-leyv7d");
        add_location(input, file$4, 150, 2, 3276);
        attr_dev(button, "class", "svelte-leyv7d");
        add_location(button, file$4, 162, 2, 3541);
      },
      m: function mount(target, anchor, remount) {
        insert_dev(target, h1, anchor);
        insert_dev(target, t1, anchor);
        insert_dev(target, input, anchor);
        set_input_value(input,
        /*connectionCode*/
        ctx[0]);
        insert_dev(target, t2, anchor);
        insert_dev(target, button, anchor);
        input.focus();
        if (remount) run_all(dispose);
        dispose = [listen_dev(input, "input",
        /*input_input_handler*/
        ctx[12]), action_destroyer(disableShakeToUndo_action = disableShakeToUndo.call(null, input)), listen_dev(input, "inputChanged",
        /*inputChanged_handler*/
        ctx[13], false, false, false), listen_dev(button, "click",
        /*openConnection*/
        ctx[4], false, false, false)];
      },
      p: function update(ctx, dirty) {
        if (dirty &
        /*connectionCode*/
        1 && input.value !==
        /*connectionCode*/
        ctx[0]) {
          set_input_value(input,
          /*connectionCode*/
          ctx[0]);
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
      block: block,
      id: create_if_block$2.name,
      type: "if",
      source: "(145:0) {#if !socketIsOpen || !desktopHasConnected}",
      ctx: ctx
    });
    return block;
  }

  function create_fragment$4(ctx) {
    var t;
    var if_block1_anchor;
    var if_block0 = !
    /*desktopHasConnected*/
    ctx[1] && create_if_block_1$1(ctx);

    function select_block_type(ctx, dirty) {
      if (!
      /*socketIsOpen*/
      ctx[2] || !
      /*desktopHasConnected*/
      ctx[1]) return create_if_block$2;
      return create_else_block$2;
    }

    var current_block_type = select_block_type(ctx);
    var if_block1 = current_block_type(ctx);
    var block = {
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
      p: function update(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (!
        /*desktopHasConnected*/
        ctx[1]) {
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
      block: block,
      id: create_fragment$4.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance$4($$self, $$props, $$invalidate) {
    var gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];
    var connectionCode = "";
    var desktopHasConnected = false;
    var desktopWebSocketID = "";
    var socketIsOpen = false;
    var inputField;
    var socket;

    function openWebSocket() {
      socket = new WebSocket("wss://" + location.host);

      socket.onopen = function (e) {
        $$invalidate(2, socketIsOpen = true);

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            connectionCode: connectionCode,
            messageType: "connection"
          }));
        }
      };

      socket.onclose = function (e) {
        location.reload();
      };

      socket.onmessage = function (e) {
        var data = JSON.parse(e.data);

        if (data.messageType === "connection") {
          $$invalidate(1, desktopHasConnected = true);
          desktopWebSocketID = data.id;
        }
      };

      window.onbeforeunload = function () {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "connectionclosed"
          }));
        }
      };
    }

    function openConnection() {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(function (permissionState) {
          if (permissionState === "granted") {
            openWebSocket();
          }
        }).catch(console.error);
      } else {
        // handle regular non iOS 13+ devices
        openWebSocket();
      }
    }

    var playVideo = function playVideo() {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          partnerID: desktopWebSocketID,
          messageType: "playvideo"
        }));
      }
    };

    var pauseVideo = function pauseVideo() {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          partnerID: desktopWebSocketID,
          messageType: "pausevideo"
        }));
      }
    };

    var deviceWasMoving = true;
    var writable_props = [];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn("<Phone> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("Phone", $$slots, []);

    function input_input_handler() {
      connectionCode = this.value;
      $$invalidate(0, connectionCode);
    }

    var inputChanged_handler = function inputChanged_handler(_ref3) {
      var detail = _ref3.detail;
      $$invalidate(0, connectionCode = detail);
    };

    $$self.$capture_state = function () {
      return {
        accelerometer: accelerometer,
        disableShakeToUndo: disableShakeToUndo,
        gifs: gifs,
        gif: gif,
        connectionCode: connectionCode,
        desktopHasConnected: desktopHasConnected,
        desktopWebSocketID: desktopWebSocketID,
        socketIsOpen: socketIsOpen,
        inputField: inputField,
        socket: socket,
        openWebSocket: openWebSocket,
        openConnection: openConnection,
        playVideo: playVideo,
        pauseVideo: pauseVideo,
        deviceWasMoving: deviceWasMoving
      };
    };

    $$self.$inject_state = function ($$props) {
      if ("connectionCode" in $$props) $$invalidate(0, connectionCode = $$props.connectionCode);
      if ("desktopHasConnected" in $$props) $$invalidate(1, desktopHasConnected = $$props.desktopHasConnected);
      if ("desktopWebSocketID" in $$props) desktopWebSocketID = $$props.desktopWebSocketID;
      if ("socketIsOpen" in $$props) $$invalidate(2, socketIsOpen = $$props.socketIsOpen);
      if ("inputField" in $$props) inputField = $$props.inputField;
      if ("socket" in $$props) socket = $$props.socket;
      if ("deviceWasMoving" in $$props) $$invalidate(7, deviceWasMoving = $$props.deviceWasMoving);
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = function () {
      if ($$self.$$.dirty &
      /*socketIsOpen, desktopHasConnected, deviceWasMoving*/
      134) {
         if (socketIsOpen && desktopHasConnected) {
          window.addEventListener("keydown", function (e) {
            e.stopPropagation();
            e.preventDefault();
          });
          accelerometer(function (deviceHasMoved) {
            if (deviceHasMoved && !deviceWasMoving) {
              playVideo();
            } else if (!deviceHasMoved && deviceWasMoving) {
              pauseVideo();
            }

            $$invalidate(7, deviceWasMoving = deviceHasMoved);
          }, 1.5, 500);
        }
      }
    };

    return [connectionCode, desktopHasConnected, socketIsOpen, gif, openConnection, desktopWebSocketID, socket, deviceWasMoving, inputField, openWebSocket, playVideo, pauseVideo, input_input_handler, inputChanged_handler];
  }

  var Phone = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(Phone, _SvelteComponentDev);

    var _super = _createSuper$5(Phone);

    function Phone(options) {
      var _this;

      _classCallCheck(this, Phone);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "Phone",
        options: options,
        id: create_fragment$4.name
      });
      return _this;
    }

    return Phone;
  }(SvelteComponentDev);

  function _createSuper$6(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct$6()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
  var file$5 = "src\\App.svelte"; // (53:2) {:else}

  function create_else_block$3(ctx) {
    var h1;
    var t0;
    var em;
    var t2;
    var t3;
    var button0;
    var t5;
    var t6;
    var h2;
    var t8;
    var button1;
    var svg0;
    var path0;
    var t9;
    var t10;
    var button2;
    var svg1;
    var path1;
    var t11;
    var current;
    var dispose;
    var if_block =
    /*howToIsActive*/
    ctx[1] && create_if_block_2$1(ctx);
    var block = {
      c: function create() {
        h1 = element("h1");
        t0 = text("Welcome to\n      ");
        em = element("em");
        em.textContent = "Isolation Run";
        t2 = text("\n      You'll need a phone and a computer to get started!");
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
        add_location(em, file$5, 55, 6, 841);
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
        dispose = [listen_dev(button0, "click",
        /*click_handler*/
        ctx[2], false, false, false), listen_dev(button1, "click",
        /*click_handler_1*/
        ctx[4], false, false, false), listen_dev(button2, "click",
        /*click_handler_2*/
        ctx[5], false, false, false)];
      },
      p: function update(ctx, dirty) {
        if (
        /*howToIsActive*/
        ctx[1]) {
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
          transition_out(if_block, 1, 1, function () {
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
      block: block,
      id: create_else_block$3.name,
      type: "else",
      source: "(53:2) {:else}",
      ctx: ctx
    });
    return block;
  } // (51:29) 


  function create_if_block_1$2(ctx) {
    var current;
    var phone = new Phone({
      $$inline: true
    });
    var block = {
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
      block: block,
      id: create_if_block_1$2.name,
      type: "if",
      source: "(51:29) ",
      ctx: ctx
    });
    return block;
  } // (49:2) {#if mode === 'COMPUTER'}


  function create_if_block$3(ctx) {
    var current;
    var computer = new Computer({
      $$inline: true
    });
    var block = {
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
      block: block,
      id: create_if_block$3.name,
      type: "if",
      source: "(49:2) {#if mode === 'COMPUTER'}",
      ctx: ctx
    });
    return block;
  } // (64:4) {#if howToIsActive}


  function create_if_block_2$1(ctx) {
    var current;
    var infomodal = new InfoModal({
      props: {
        onClose:
        /*func*/
        ctx[3]
      },
      $$inline: true
    });
    var block = {
      c: function create() {
        create_component(infomodal.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(infomodal, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        var infomodal_changes = {};
        if (dirty &
        /*howToIsActive*/
        2) infomodal_changes.onClose =
        /*func*/
        ctx[3];
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
      block: block,
      id: create_if_block_2$1.name,
      type: "if",
      source: "(64:4) {#if howToIsActive}",
      ctx: ctx
    });
    return block;
  }

  function create_fragment$5(ctx) {
    var main;
    var current_block_type_index;
    var if_block;
    var current;
    var if_block_creators = [create_if_block$3, create_if_block_1$2, create_else_block$3];
    var if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (
      /*mode*/
      ctx[0] === "COMPUTER") return 0;
      if (
      /*mode*/
      ctx[0] === "PHONE") return 1;
      return 2;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    var block = {
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
      p: function update(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        var previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, function () {
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
      block: block,
      id: create_fragment$5.name,
      type: "component",
      source: "",
      ctx: ctx
    });
    return block;
  }

  function instance$5($$self, $$props, $$invalidate) {
    var mode;
    var howToIsActive = false;
    var writable_props = [];
    Object.keys($$props).forEach(function (key) {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn("<App> was created with unknown prop '".concat(key, "'"));
    });
    var _$$props$$$slots = $$props.$$slots,
        $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
        $$scope = $$props.$$scope;
    validate_slots("App", $$slots, []);

    var click_handler = function click_handler() {
      return $$invalidate(1, howToIsActive = true);
    };

    var func = function func() {
      return $$invalidate(1, howToIsActive = false);
    };

    var click_handler_1 = function click_handler_1() {
      return $$invalidate(0, mode = "COMPUTER");
    };

    var click_handler_2 = function click_handler_2() {
      return $$invalidate(0, mode = "PHONE");
    };

    $$self.$capture_state = function () {
      return {
        InfoModal: InfoModal,
        Computer: Computer,
        Phone: Phone,
        mode: mode,
        howToIsActive: howToIsActive
      };
    };

    $$self.$inject_state = function ($$props) {
      if ("mode" in $$props) $$invalidate(0, mode = $$props.mode);
      if ("howToIsActive" in $$props) $$invalidate(1, howToIsActive = $$props.howToIsActive);
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [mode, howToIsActive, click_handler, func, click_handler_1, click_handler_2];
  }

  var App = /*#__PURE__*/function (_SvelteComponentDev) {
    _inherits(App, _SvelteComponentDev);

    var _super = _createSuper$6(App);

    function App(options) {
      var _this;

      _classCallCheck(this, App);

      _this = _super.call(this, options);
      init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: _assertThisInitialized(_this),
        tagName: "App",
        options: options,
        id: create_fragment$5.name
      });
      return _this;
    }

    return App;
  }(SvelteComponentDev);

  if (location.protocol === "http:") {
    location.replace("https://" + location.host);
  }

  var app = new App({
    target: document.body
  });

  return app;

}());
//# sourceMappingURL=bundle.js.map
