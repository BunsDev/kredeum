
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals$1 = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class BeeError extends Error {
      constructor(message) {
        super(message);
      }

    }
    class BeeArgumentError extends BeeError {
      constructor(message, value) {
        super(message);
        this.value = value;
      }

    }
    class BeeRequestError extends BeeError {
      /**
       * @param message
       * @param requestOptions KyOptions that were used to assemble the request. THIS MIGHT NOT BE COMPLETE! If custom Ky instance was used that has set defaults then these defaults are not visible in this object!
       */
      constructor(message, requestOptions) {
        super(message);
        this.requestOptions = requestOptions;
      }

    }
    class BeeResponseError extends BeeError {
      /**
       * @param status HTTP status code number
       * @param response Response returned from the server
       * @param responseBody Response body as string which is returned from response.text() call
       * @param requestOptions KyOptions that were used to assemble the request. THIS MIGHT NOT BE COMPLETE! If custom Ky instance was used that has set defaults then these defaults are not visible in this object!
       * @param message
       */
      constructor(status, response, responseBody, requestOptions, message) {
        super(message);
        this.status = status;
        this.response = response;
        this.responseBody = responseBody;
        this.requestOptions = requestOptions;
      }

    }
    class BeeNotAJsonError extends BeeError {
      constructor() {
        super(`Received response is not valid JSON.`);
      }

    }

    /**
     * Read the filename from the content-disposition header
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
     *
     * @param header the content-disposition header value
     *
     * @returns the filename
     */

    function readContentDispositionFilename(header) {
      if (!header) {
        throw new BeeError('missing content-disposition header');
      } // Regex was found here
      // https://stackoverflow.com/questions/23054475/javascript-regex-for-extracting-filename-from-content-disposition-header


      const dispositionMatch = header.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);

      if (dispositionMatch && dispositionMatch.length > 0) {
        return dispositionMatch[1];
      }

      throw new BeeError('invalid content-disposition header');
    }

    function readTagUid(header) {
      if (!header) {
        return undefined;
      }

      return parseInt(header, 10);
    }

    function readFileHeaders(headers) {
      const name = readContentDispositionFilename(headers.get('content-disposition'));
      const tagUid = readTagUid(headers.get('swarm-tag-uid'));
      const contentType = headers.get('content-type') || undefined;
      return {
        name,
        tagUid,
        contentType
      };
    }
    function extractUploadHeaders(postageBatchId, options) {
      if (!postageBatchId) {
        throw new BeeError('Postage BatchID has to be specified!');
      }

      const headers = {
        'swarm-postage-batch-id': postageBatchId
      };
      if (options === null || options === void 0 ? void 0 : options.pin) headers['swarm-pin'] = String(options.pin);
      if (options === null || options === void 0 ? void 0 : options.encrypt) headers['swarm-encrypt'] = String(options.encrypt);
      if (options === null || options === void 0 ? void 0 : options.tag) headers['swarm-tag'] = String(options.tag);
      if (typeof (options === null || options === void 0 ? void 0 : options.deferred) === 'boolean') headers['swarm-deferred-upload'] = options.deferred.toString();
      return headers;
    }

    /*! MIT License © Sindre Sorhus */

    const globals = {};

    const getGlobal = property => {
    	/* istanbul ignore next */
    	if (typeof self !== 'undefined' && self && property in self) {
    		return self;
    	}

    	/* istanbul ignore next */
    	if (typeof window !== 'undefined' && window && property in window) {
    		return window;
    	}

    	if (typeof global !== 'undefined' && global && property in global) {
    		return global;
    	}

    	/* istanbul ignore next */
    	if (typeof globalThis !== 'undefined' && globalThis) {
    		return globalThis;
    	}
    };

    const globalProperties = [
    	'Headers',
    	'Request',
    	'Response',
    	'ReadableStream',
    	'fetch',
    	'AbortController',
    	'FormData'
    ];

    for (const property of globalProperties) {
    	Object.defineProperty(globals, property, {
    		get() {
    			const globalObject = getGlobal(property);
    			const value = globalObject && globalObject[property];
    			return typeof value === 'function' ? value.bind(globalObject) : value;
    		}
    	});
    }

    const isObject$1 = value => value !== null && typeof value === 'object';
    const supportsAbortController = typeof globals.AbortController === 'function';
    const supportsStreams = typeof globals.ReadableStream === 'function';
    const supportsFormData = typeof globals.FormData === 'function';

    const mergeHeaders = (source1, source2) => {
    	const result = new globals.Headers(source1 || {});
    	const isHeadersInstance = source2 instanceof globals.Headers;
    	const source = new globals.Headers(source2 || {});

    	for (const [key, value] of source) {
    		if ((isHeadersInstance && value === 'undefined') || value === undefined) {
    			result.delete(key);
    		} else {
    			result.set(key, value);
    		}
    	}

    	return result;
    };

    const deepMerge$1 = (...sources) => {
    	let returnValue = {};
    	let headers = {};

    	for (const source of sources) {
    		if (Array.isArray(source)) {
    			if (!(Array.isArray(returnValue))) {
    				returnValue = [];
    			}

    			returnValue = [...returnValue, ...source];
    		} else if (isObject$1(source)) {
    			for (let [key, value] of Object.entries(source)) {
    				if (isObject$1(value) && (key in returnValue)) {
    					value = deepMerge$1(returnValue[key], value);
    				}

    				returnValue = {...returnValue, [key]: value};
    			}

    			if (isObject$1(source.headers)) {
    				headers = mergeHeaders(headers, source.headers);
    			}
    		}

    		returnValue.headers = headers;
    	}

    	return returnValue;
    };

    const requestMethods = [
    	'get',
    	'post',
    	'put',
    	'patch',
    	'head',
    	'delete'
    ];

    const responseTypes = {
    	json: 'application/json',
    	text: 'text/*',
    	formData: 'multipart/form-data',
    	arrayBuffer: '*/*',
    	blob: '*/*'
    };

    const retryMethods = [
    	'get',
    	'put',
    	'head',
    	'delete',
    	'options',
    	'trace'
    ];

    const retryStatusCodes = [
    	408,
    	413,
    	429,
    	500,
    	502,
    	503,
    	504
    ];

    const retryAfterStatusCodes = [
    	413,
    	429,
    	503
    ];

    const stop = Symbol('stop');

    class HTTPError extends Error {
    	constructor(response) {
    		// Set the message to the status text, such as Unauthorized,
    		// with some fallbacks. This message should never be undefined.
    		super(
    			response.statusText ||
    			String(
    				(response.status === 0 || response.status) ?
    					response.status : 'Unknown response error'
    			)
    		);
    		this.name = 'HTTPError';
    		this.response = response;
    	}
    }

    class TimeoutError extends Error {
    	constructor(request) {
    		super('Request timed out');
    		this.name = 'TimeoutError';
    		this.request = request;
    	}
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // `Promise.race()` workaround (#91)
    const timeout = (request, abortController, options) =>
    	new Promise((resolve, reject) => {
    		const timeoutID = setTimeout(() => {
    			if (abortController) {
    				abortController.abort();
    			}

    			reject(new TimeoutError(request));
    		}, options.timeout);

    		/* eslint-disable promise/prefer-await-to-then */
    		options.fetch(request)
    			.then(resolve)
    			.catch(reject)
    			.then(() => {
    				clearTimeout(timeoutID);
    			});
    		/* eslint-enable promise/prefer-await-to-then */
    	});

    const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

    const defaultRetryOptions = {
    	limit: 2,
    	methods: retryMethods,
    	statusCodes: retryStatusCodes,
    	afterStatusCodes: retryAfterStatusCodes
    };

    const normalizeRetryOptions = (retry = {}) => {
    	if (typeof retry === 'number') {
    		return {
    			...defaultRetryOptions,
    			limit: retry
    		};
    	}

    	if (retry.methods && !Array.isArray(retry.methods)) {
    		throw new Error('retry.methods must be an array');
    	}

    	if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    		throw new Error('retry.statusCodes must be an array');
    	}

    	return {
    		...defaultRetryOptions,
    		...retry,
    		afterStatusCodes: retryAfterStatusCodes
    	};
    };

    // The maximum value of a 32bit int (see issue #117)
    const maxSafeTimeout = 2147483647;

    class Ky {
    	constructor(input, options = {}) {
    		this._retryCount = 0;
    		this._input = input;
    		this._options = {
    			// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
    			credentials: this._input.credentials || 'same-origin',
    			...options,
    			headers: mergeHeaders(this._input.headers, options.headers),
    			hooks: deepMerge$1({
    				beforeRequest: [],
    				beforeRetry: [],
    				afterResponse: []
    			}, options.hooks),
    			method: normalizeRequestMethod(options.method || this._input.method),
    			prefixUrl: String(options.prefixUrl || ''),
    			retry: normalizeRetryOptions(options.retry),
    			throwHttpErrors: options.throwHttpErrors !== false,
    			timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
    			fetch: options.fetch || globals.fetch
    		};

    		if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
    			throw new TypeError('`input` must be a string, URL, or Request');
    		}

    		if (this._options.prefixUrl && typeof this._input === 'string') {
    			if (this._input.startsWith('/')) {
    				throw new Error('`input` must not begin with a slash when using `prefixUrl`');
    			}

    			if (!this._options.prefixUrl.endsWith('/')) {
    				this._options.prefixUrl += '/';
    			}

    			this._input = this._options.prefixUrl + this._input;
    		}

    		if (supportsAbortController) {
    			this.abortController = new globals.AbortController();
    			if (this._options.signal) {
    				this._options.signal.addEventListener('abort', () => {
    					this.abortController.abort();
    				});
    			}

    			this._options.signal = this.abortController.signal;
    		}

    		this.request = new globals.Request(this._input, this._options);

    		if (this._options.searchParams) {
    			const searchParams = '?' + new URLSearchParams(this._options.searchParams).toString();
    			const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

    			// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
    			if (((supportsFormData && this._options.body instanceof globals.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
    				this.request.headers.delete('content-type');
    			}

    			this.request = new globals.Request(new globals.Request(url, this.request), this._options);
    		}

    		if (this._options.json !== undefined) {
    			this._options.body = JSON.stringify(this._options.json);
    			this.request.headers.set('content-type', 'application/json');
    			this.request = new globals.Request(this.request, {body: this._options.body});
    		}

    		const fn = async () => {
    			if (this._options.timeout > maxSafeTimeout) {
    				throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
    			}

    			await delay(1);
    			let response = await this._fetch();

    			for (const hook of this._options.hooks.afterResponse) {
    				// eslint-disable-next-line no-await-in-loop
    				const modifiedResponse = await hook(
    					this.request,
    					this._options,
    					this._decorateResponse(response.clone())
    				);

    				if (modifiedResponse instanceof globals.Response) {
    					response = modifiedResponse;
    				}
    			}

    			this._decorateResponse(response);

    			if (!response.ok && this._options.throwHttpErrors) {
    				throw new HTTPError(response);
    			}

    			// If `onDownloadProgress` is passed, it uses the stream API internally
    			/* istanbul ignore next */
    			if (this._options.onDownloadProgress) {
    				if (typeof this._options.onDownloadProgress !== 'function') {
    					throw new TypeError('The `onDownloadProgress` option must be a function');
    				}

    				if (!supportsStreams) {
    					throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
    				}

    				return this._stream(response.clone(), this._options.onDownloadProgress);
    			}

    			return response;
    		};

    		const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
    		const result = isRetriableMethod ? this._retry(fn) : fn();

    		for (const [type, mimeType] of Object.entries(responseTypes)) {
    			result[type] = async () => {
    				this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

    				const response = (await result).clone();

    				if (type === 'json') {
    					if (response.status === 204) {
    						return '';
    					}

    					if (options.parseJson) {
    						return options.parseJson(await response.text());
    					}
    				}

    				return response[type]();
    			};
    		}

    		return result;
    	}

    	_calculateRetryDelay(error) {
    		this._retryCount++;

    		if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
    			if (error instanceof HTTPError) {
    				if (!this._options.retry.statusCodes.includes(error.response.status)) {
    					return 0;
    				}

    				const retryAfter = error.response.headers.get('Retry-After');
    				if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
    					let after = Number(retryAfter);
    					if (Number.isNaN(after)) {
    						after = Date.parse(retryAfter) - Date.now();
    					} else {
    						after *= 1000;
    					}

    					if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
    						return 0;
    					}

    					return after;
    				}

    				if (error.response.status === 413) {
    					return 0;
    				}
    			}

    			const BACKOFF_FACTOR = 0.3;
    			return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
    		}

    		return 0;
    	}

    	_decorateResponse(response) {
    		if (this._options.parseJson) {
    			response.json = async () => {
    				return this._options.parseJson(await response.text());
    			};
    		}

    		return response;
    	}

    	async _retry(fn) {
    		try {
    			return await fn();
    		} catch (error) {
    			const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
    			if (ms !== 0 && this._retryCount > 0) {
    				await delay(ms);

    				for (const hook of this._options.hooks.beforeRetry) {
    					// eslint-disable-next-line no-await-in-loop
    					const hookResult = await hook({
    						request: this.request,
    						options: this._options,
    						error,
    						retryCount: this._retryCount
    					});

    					// If `stop` is returned from the hook, the retry process is stopped
    					if (hookResult === stop) {
    						return;
    					}
    				}

    				return this._retry(fn);
    			}

    			if (this._options.throwHttpErrors) {
    				throw error;
    			}
    		}
    	}

    	async _fetch() {
    		for (const hook of this._options.hooks.beforeRequest) {
    			// eslint-disable-next-line no-await-in-loop
    			const result = await hook(this.request, this._options);

    			if (result instanceof Request) {
    				this.request = result;
    				break;
    			}

    			if (result instanceof Response) {
    				return result;
    			}
    		}

    		if (this._options.timeout === false) {
    			return this._options.fetch(this.request.clone());
    		}

    		return timeout(this.request.clone(), this.abortController, this._options);
    	}

    	/* istanbul ignore next */
    	_stream(response, onDownloadProgress) {
    		const totalBytes = Number(response.headers.get('content-length')) || 0;
    		let transferredBytes = 0;

    		return new globals.Response(
    			new globals.ReadableStream({
    				start(controller) {
    					const reader = response.body.getReader();

    					if (onDownloadProgress) {
    						onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
    					}

    					async function read() {
    						const {done, value} = await reader.read();
    						if (done) {
    							controller.close();
    							return;
    						}

    						if (onDownloadProgress) {
    							transferredBytes += value.byteLength;
    							const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
    							onDownloadProgress({percent, transferredBytes, totalBytes}, value);
    						}

    						controller.enqueue(value);
    						read();
    					}

    					read();
    				}
    			})
    		);
    	}
    }

    const validateAndMerge = (...sources) => {
    	for (const source of sources) {
    		if ((!isObject$1(source) || Array.isArray(source)) && typeof source !== 'undefined') {
    			throw new TypeError('The `options` argument must be an object');
    		}
    	}

    	return deepMerge$1({}, ...sources);
    };

    const createInstance = defaults => {
    	const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

    	for (const method of requestMethods) {
    		ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
    	}

    	ky.HTTPError = HTTPError;
    	ky.TimeoutError = TimeoutError;
    	ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
    	ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
    	ky.stop = stop;

    	return ky;
    };

    var kyFactory = createInstance();

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': _nodeResolve_empty
    }, [_nodeResolve_empty]);

    var BeeModes;

    (function (BeeModes) {
      BeeModes["FULL"] = "full";
      BeeModes["LIGHT"] = "light";
      BeeModes["ULTRA_LIGHT"] = "ultra-light";
      BeeModes["DEV"] = "dev";
    })(BeeModes || (BeeModes = {}));

    const SPAN_SIZE$1 = 8;
    const SECTION_SIZE = 32;
    const BRANCHES = 128;
    const CHUNK_SIZE = SECTION_SIZE * BRANCHES;
    const ADDRESS_HEX_LENGTH = 64;
    const PSS_TARGET_HEX_LENGTH_MAX = 6;
    const PUBKEY_HEX_LENGTH = 66;
    const BATCH_ID_HEX_LENGTH = 64;
    const REFERENCE_HEX_LENGTH = 64;
    const ENCRYPTED_REFERENCE_HEX_LENGTH = 128;
    const TAGS_LIMIT_MIN = 1;
    const TAGS_LIMIT_MAX = 1000;
    /*********************************************************
     * Writers and Readers interfaces
     */

    const TOPIC_BYTES_LENGTH = 32;
    const TOPIC_HEX_LENGTH = 64;
    /*********************************************************
     * Ethereum compatible signing interfaces and definitions
     */

    const SIGNATURE_HEX_LENGTH = 130;
    const SIGNATURE_BYTES_LENGTH = 65;

    /**
     * Compatibility functions for working with File API objects
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    var __awaiter$j = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    function isFile(file) {
      // browser
      if (typeof File === 'function') {
        return file instanceof File;
      } // node.js


      const f = file;
      return typeof f === 'object' && typeof f.name === 'string' && (typeof f.stream === 'function' || typeof f.arrayBuffer === 'function');
    }
    /**
     * Compatibility helper for browsers where the `arrayBuffer function is
     * missing from `File` objects.
     *
     * @param file A File object
     */

    function fileArrayBuffer(file) {
      return __awaiter$j(this, void 0, void 0, function* () {
        if (file.arrayBuffer) {
          return file.arrayBuffer();
        } // workaround for Safari where arrayBuffer is not supported on Files


        return new Promise(resolve => {
          const fr = new FileReader();

          fr.onload = () => resolve(fr.result);

          fr.readAsArrayBuffer(file);
        });
      });
    }

    /**
     * Type guard for `Bytes<T>` type
     *
     * @param b       The byte array
     * @param length  The length of the byte array
     */

    function isBytes(b, length) {
      return b instanceof Uint8Array && b.length === length;
    }
    /**
     * Verifies if a byte array has a certain length
     *
     * @param b       The byte array
     * @param length  The specified length
     */

    function assertBytes(b, length) {
      if (!isBytes(b, length)) {
        throw new TypeError(`Parameter is not valid Bytes of length: ${length} !== ${b.length}`);
      }
    }
    /**
     * Type guard for FlexBytes<Min,Max> type
     *
     * @param b       The byte array
     * @param min     Minimum size of the array
     * @param max     Maximum size of the array
     */

    function isFlexBytes(b, min, max) {
      return b instanceof Uint8Array && b.length >= min && b.length <= max;
    }
    /**
     * Verifies if a byte array has a certain length between min and max
     *
     * @param b       The byte array
     * @param min     Minimum size of the array
     * @param max     Maximum size of the array
     */

    function assertFlexBytes(b, min, max) {
      if (!isFlexBytes(b, min, max)) {
        throw new TypeError(`Parameter is not valid FlexBytes of  min: ${min}, max: ${max}, length: ${b.length}`);
      }
    }
    /**
     * Return `length` bytes starting from `offset`
     *
     * @param data   The original data
     * @param offset The offset to start from
     * @param length The length of data to be returned
     */

    function bytesAtOffset(data, offset, length) {
      const offsetBytes = data.slice(offset, offset + length); // We are returning strongly typed Bytes so we have to verify that length is really what we claim

      assertBytes(offsetBytes, length);
      return offsetBytes;
    }
    /**
     * Return flex bytes starting from `offset`
     *
     * @param data   The original data
     * @param offset The offset to start from
     * @param _min   The minimum size of the data
     * @param _max   The maximum size of the data
     */

    function flexBytesAtOffset(data, offset, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _min, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _max) {
      return data.slice(offset);
    }
    /**
     * Returns true if two byte arrays are equal
     *
     * @param a Byte array to compare
     * @param b Byte array to compare
     */

    function bytesEqual(a, b) {
      return a.length === b.length && a.every((value, index) => value === b[index]);
    }
    /**
     * Returns a new byte array filled with zeroes with the specified length
     *
     * @param length The length of data to be returned
     */

    function makeBytes(length) {
      return new Uint8Array(length);
    }
    function wrapBytesWithHelpers(data) {
      return Object.assign(data, {
        text: () => new TextDecoder('utf-8').decode(data),
        json: () => JSON.parse(new TextDecoder('utf-8').decode(data)),
        hex: () => bytesToHex(data)
      });
    }

    /**
     * Creates unprefixed hex string from wide range of data.
     *
     * TODO: Make Length mandatory: https://github.com/ethersphere/bee-js/issues/208
     *
     * @param input
     * @param len of the resulting HexString WITHOUT prefix!
     */

    function makeHexString(input, len) {
      if (typeof input === 'number') {
        return intToHex(input, len);
      }

      if (input instanceof Uint8Array) {
        return bytesToHex(input, len);
      }

      if (typeof input === 'string') {
        if (isPrefixedHexString(input)) {
          const hex = input.slice(2);

          if (len && hex.length !== len) {
            throw new TypeError(`Length mismatch for valid hex string. Expecting length ${len}: ${hex}`);
          }

          return hex;
        } else {
          // We use assertHexString() as there might be more reasons why a string is not valid hex string
          // and usage of isHexString() would not give enough information to the user on what is going
          // wrong.
          assertHexString(input, len);
          return input;
        }
      }

      throw new TypeError('Not HexString compatible type!');
    }
    /**
     * Converts a hex string to Uint8Array
     *
     * @param hex string input without 0x prefix!
     */

    function hexToBytes(hex) {
      assertHexString(hex);
      const bytes = makeBytes(hex.length / 2);

      for (let i = 0; i < bytes.length; i++) {
        const hexByte = hex.substr(i * 2, 2);
        bytes[i] = parseInt(hexByte, 16);
      }

      return bytes;
    }
    /**
     * Converts array of number or Uint8Array to HexString without prefix.
     *
     * @param bytes   The input array
     * @param len     The length of the non prefixed HexString
     */

    function bytesToHex(bytes, len) {
      const hexByte = n => n.toString(16).padStart(2, '0');

      const hex = Array.from(bytes, hexByte).join(''); // TODO: Make Length mandatory: https://github.com/ethersphere/bee-js/issues/208

      if (len && hex.length !== len) {
        throw new TypeError(`Resulting HexString does not have expected length ${len}: ${hex}`);
      }

      return hex;
    }
    /**
     * Converts integer number to hex string.
     *
     * Optionally provides '0x' prefix or padding
     *
     * @param int         The positive integer to be converted
     * @param len     The length of the non prefixed HexString
     */

    function intToHex(int, len) {
      if (!Number.isInteger(int)) throw new TypeError('the value provided is not integer');
      if (int > Number.MAX_SAFE_INTEGER) throw new TypeError('the value provided exceeds safe integer');
      if (int < 0) throw new TypeError('the value provided is a negative integer');
      const hex = int.toString(16); // TODO: Make Length mandatory: https://github.com/ethersphere/bee-js/issues/208

      if (len && hex.length !== len) {
        throw new TypeError(`Resulting HexString does not have expected length ${len}: ${hex}`);
      }

      return hex;
    }
    /**
     * Type guard for HexStrings.
     * Requires no 0x prefix!
     *
     * TODO: Make Length mandatory: https://github.com/ethersphere/bee-js/issues/208
     *
     * @param s string input
     * @param len expected length of the HexString
     */

    function isHexString(s, len) {
      return typeof s === 'string' && /^[0-9a-f]+$/i.test(s) && (!len || s.length === len);
    }
    /**
     * Type guard for PrefixedHexStrings.
     * Does enforce presence of 0x prefix!
     *
     * @param s string input
     */

    function isPrefixedHexString(s) {
      return typeof s === 'string' && /^0x[0-9a-f]+$/i.test(s);
    }
    /**
     * Verifies if the provided input is a HexString.
     *
     * TODO: Make Length mandatory: https://github.com/ethersphere/bee-js/issues/208
     *
     * @param s string input
     * @param len expected length of the HexString
     * @param name optional name for the asserted value
     * @returns HexString or throws error
     */

    function assertHexString(s, len, name = 'value') {
      if (!isHexString(s, len)) {
        if (isPrefixedHexString(s)) {
          throw new TypeError(`${name} not valid non prefixed hex string (has 0x prefix): ${s}`);
        } // Don't display length error if no length specified in order not to confuse user


        const lengthMsg = len ? ` of length ${len}` : '';
        throw new TypeError(`${name} not valid hex string${lengthMsg}: ${s}`);
      }
    }

    function isUint8Array(obj) {
      return obj instanceof Uint8Array;
    }
    function isInteger(value) {
      return typeof value === 'string' && /^-?(0|[1-9][0-9]*)$/g.test(value) || typeof value === 'number' && value > Number.MIN_SAFE_INTEGER && value < Number.MAX_SAFE_INTEGER && Number.isInteger(value);
    }
    function isObject(value) {
      return value !== null && typeof value === 'object';
    }
    /**
     * Generally it is discouraged to use `object` type, but in this case I think
     * it is best to do so as it is possible to easily convert from `object`to other
     * types, which will be usually the case after asserting that the object is
     * strictly object. With for example Record<string, unknown> you have to first
     * cast it to `unknown` which I think bit defeat the purpose.
     *
     * @param value
     */
    // eslint-disable-next-line @typescript-eslint/ban-types

    function isStrictlyObject(value) {
      return isObject(value) && !Array.isArray(value);
    }
    /**
     * Asserts if object is Error
     *
     * @param e
     */

    function isError(e) {
      return e instanceof Error;
    } // eslint-disable-next-line @typescript-eslint/ban-types
    function assertInteger(value, name = 'value') {
      if (!isInteger(value)) throw new TypeError(`${name} is not integer`);
    }
    function assertNonNegativeInteger(value, name = 'Value') {
      assertInteger(value, name);
      if (Number(value) < 0) throw new BeeArgumentError(`${name} has to be bigger or equal to zero`, value);
    }
    function assertReference(value) {
      try {
        assertHexString(value, REFERENCE_HEX_LENGTH);
      } catch (e) {
        assertHexString(value, ENCRYPTED_REFERENCE_HEX_LENGTH);
      }
    }
    function assertAddress(value) {
      assertHexString(value, ADDRESS_HEX_LENGTH, 'Address');
    }
    function assertBatchId(value) {
      assertHexString(value, BATCH_ID_HEX_LENGTH, 'BatchId');
    }
    function assertRequestOptions(value, name = 'RequestOptions') {
      if (value === undefined) {
        return;
      }

      if (!isStrictlyObject(value)) {
        throw new TypeError(`${name} has to be an object!`);
      }

      const options = value;

      if (options.retry) {
        assertNonNegativeInteger(options.retry, `${name}.retry`);
      }

      if (options.timeout) {
        assertNonNegativeInteger(options.timeout, `${name}.timeout`);
      }

      if (options.fetch && typeof options.fetch !== 'function') {
        throw new TypeError(`${name}.fetch has to be a function or undefined!`);
      }
    }
    function assertUploadOptions(value, name = 'UploadOptions') {
      if (!isStrictlyObject(value)) {
        throw new TypeError(`${name} has to be an object!`);
      }

      assertRequestOptions(value, name);
      const options = value;

      if (options.pin && typeof options.pin !== 'boolean') {
        throw new TypeError(`options.pin property in ${name} has to be boolean or undefined!`);
      }

      if (options.encrypt && typeof options.encrypt !== 'boolean') {
        throw new TypeError(`options.encrypt property in ${name} has to be boolean or undefined!`);
      }

      if (options.tag) {
        if (typeof options.tag !== 'number') {
          throw new TypeError(`options.tag property in ${name} has to be number or undefined!`);
        }

        assertNonNegativeInteger(options.tag, 'options.tag');
      }
    }
    function assertFileUploadOptions(value) {
      assertUploadOptions(value, 'FileUploadOptions');
      const options = value;

      if (options.size) {
        if (typeof options.size !== 'number') {
          throw new TypeError('tag property in FileUploadOptions has to be number or undefined!');
        }

        assertNonNegativeInteger(options.size, 'options.size');
      }

      if (options.contentType && typeof options.contentType !== 'string') {
        throw new TypeError('contentType property in FileUploadOptions has to be string or undefined!');
      }
    }
    function assertCollectionUploadOptions(value) {
      assertUploadOptions(value, 'CollectionUploadOptions');
      const options = value;

      if (options.indexDocument && typeof options.indexDocument !== 'string') {
        throw new TypeError('indexDocument property in CollectionUploadOptions has to be string or undefined!');
      }

      if (options.errorDocument && typeof options.errorDocument !== 'string') {
        throw new TypeError('errorDocument property in CollectionUploadOptions has to be string or undefined!');
      }
    }
    function isTag(value) {
      if (!isStrictlyObject(value)) {
        return false;
      }

      const tag = value;
      const numberProperties = ['total', 'processed', 'synced', 'uid'];
      const correctNumberProperties = numberProperties.every(numberProperty => typeof tag[numberProperty] === 'number');

      if (!correctNumberProperties || !tag.startedAt || typeof tag.startedAt !== 'string') {
        return false;
      }

      return true;
    }
    function assertAddressPrefix(value) {
      assertHexString(value, undefined, 'AddressPrefix');

      if (value.length > PSS_TARGET_HEX_LENGTH_MAX) {
        throw new BeeArgumentError(`AddressPrefix must have length of ${PSS_TARGET_HEX_LENGTH_MAX} at most! Got string with ${value.length}`, value);
      }
    }
    function assertPssMessageHandler(value) {
      if (!isStrictlyObject(value)) {
        throw new TypeError('PssMessageHandler has to be object!');
      }

      const handler = value;

      if (typeof handler.onMessage !== 'function') {
        throw new TypeError('onMessage property of PssMessageHandler has to be function!');
      }

      if (typeof handler.onError !== 'function') {
        throw new TypeError('onError property of PssMessageHandler has to be function!');
      }
    }
    function assertPublicKey(value) {
      assertHexString(value, PUBKEY_HEX_LENGTH, 'PublicKey');
    }
    /**
     * Check whether the given parameter is valid data to upload
     * @param value
     * @throws TypeError if not valid
     */

    function assertData(value) {
      if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
        throw new TypeError('Data must be either string or Uint8Array!');
      }
    }
    /**
     * Check whether the given parameter is a correct file representation to file upload.
     * @param value
     * @throws TypeError if not valid
     */

    function assertFileData(value) {
      if (typeof value !== 'string' && !(value instanceof Uint8Array) && !isFile(value) && !isReadable(value)) {
        throw new TypeError('Data must be either string, Readable, Uint8Array or File!');
      }
    }
    /**
     * Checks whether optional options for AllTags query are valid
     * @param options
     */

    function assertAllTagsOptions(entry) {
      if (entry !== undefined && !isStrictlyObject(entry)) {
        throw new TypeError('options has to be an object or undefined!');
      }

      assertRequestOptions(entry, 'AllTagsOptions');
      const options = entry;

      if ((options === null || options === void 0 ? void 0 : options.limit) !== undefined) {
        if (typeof options.limit !== 'number') {
          throw new TypeError('AllTagsOptions.limit has to be a number or undefined!');
        }

        if (options.limit < TAGS_LIMIT_MIN) {
          throw new BeeArgumentError(`AllTagsOptions.limit has to be at least ${TAGS_LIMIT_MIN}`, options.limit);
        }

        if (options.limit > TAGS_LIMIT_MAX) {
          throw new BeeArgumentError(`AllTagsOptions.limit has to be at most ${TAGS_LIMIT_MAX}`, options.limit);
        }
      }

      if ((options === null || options === void 0 ? void 0 : options.offset) !== undefined) {
        assertNonNegativeInteger(options.offset, 'AllTagsOptions.offset');
      }
    }
    /**
     * Utility functions that return Tag UID
     * @param tagUid
     */

    function makeTagUid(tagUid) {
      if (tagUid === undefined || tagUid === null) {
        throw new TypeError('TagUid was expected but got undefined or null instead!');
      }

      if (isTag(tagUid)) {
        return tagUid.uid;
      } else if (typeof tagUid === 'number') {
        assertNonNegativeInteger(tagUid, 'UID');
        return tagUid;
      } else if (typeof tagUid === 'string') {
        const int = parseInt(tagUid);

        if (isNaN(int)) {
          throw new TypeError('Passed tagUid string is not valid integer!');
        }

        if (int < 0) {
          throw new TypeError(`TagUid was expected to be positive non-negative integer! Got ${int}`);
        }

        return int;
      }

      throw new TypeError('tagUid has to be either Tag or a number (UID)!');
    }

    /**
     * @license
     * web-streams-polyfill v4.0.0-beta.2
     * Copyright 2021 Mattias Buelens, Diwank Singh Tomer and other contributors.
     * This code is released under the MIT license.
     * SPDX-License-Identifier: MIT
     */
    const e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol:e=>`Symbol(${e})`;function t(){}function r$2(e){return "object"==typeof e&&null!==e||"function"==typeof e}const o=t;function n(e,t){try{Object.defineProperty(e,"name",{value:t,configurable:!0});}catch(e){}}const a=Promise,i=Promise.prototype.then,l=Promise.resolve.bind(a),s$1=Promise.reject.bind(a);function u(e){return new a(e)}function c(e){return l(e)}function d(e){return s$1(e)}function f$1(e,t,r){return i.call(e,t,r)}function b(e,t,r){f$1(f$1(e,t,r),void 0,o);}function h(e,t){b(e,t);}function _(e,t){b(e,void 0,t);}function p(e,t,r){return f$1(e,t,r)}function m(e){f$1(e,void 0,o);}let y=e=>{if("function"==typeof queueMicrotask)y=queueMicrotask;else {const e=c(void 0);y=t=>f$1(e,t);}return y(e)};function g(e,t,r){if("function"!=typeof e)throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,t,r)}function w(e,t,r){try{return c(g(e,t,r))}catch(e){return d(e)}}class S{constructor(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0;}get length(){return this._size}push(e){const t=this._back;let r=t;16383===t._elements.length&&(r={_elements:[],_next:void 0}),t._elements.push(e),r!==t&&(this._back=r,t._next=r),++this._size;}shift(){const e=this._front;let t=e;const r=this._cursor;let o=r+1;const n=e._elements,a=n[r];return 16384===o&&(t=e._next,o=0),--this._size,this._cursor=o,e!==t&&(this._front=t),n[r]=void 0,a}forEach(e){let t=this._cursor,r=this._front,o=r._elements;for(;!(t===o.length&&void 0===r._next||t===o.length&&(r=r._next,o=r._elements,t=0,0===o.length));)e(o[t]),++t;}peek(){const e=this._front,t=this._cursor;return e._elements[t]}}function v(e,t){e._ownerReadableStream=t,t._reader=e,"readable"===t._state?C(e):"closed"===t._state?function(e){C(e),W(e);}(e):E(e,t._storedError);}function R(e,t){return dr(e._ownerReadableStream,t)}function T(e){"readable"===e._ownerReadableStream._state?P(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):function(e,t){E(e,t);}(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),e._ownerReadableStream._reader=void 0,e._ownerReadableStream=void 0;}function q(e){return new TypeError("Cannot "+e+" a stream using a released reader")}function C(e){e._closedPromise=u(((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r;}));}function E(e,t){C(e),P(e,t);}function P(e,t){void 0!==e._closedPromise_reject&&(m(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0);}function W(e){void 0!==e._closedPromise_resolve&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0);}const k=e("[[AbortSteps]]"),O=e("[[ErrorSteps]]"),B=e("[[CancelSteps]]"),A=e("[[PullSteps]]"),j=Number.isFinite||function(e){return "number"==typeof e&&isFinite(e)},z=Math.trunc||function(e){return e<0?Math.ceil(e):Math.floor(e)};function L(e,t){if(void 0!==e&&("object"!=typeof(r=e)&&"function"!=typeof r))throw new TypeError(`${t} is not an object.`);var r;}function F(e,t){if("function"!=typeof e)throw new TypeError(`${t} is not a function.`)}function I(e,t){if(!function(e){return "object"==typeof e&&null!==e||"function"==typeof e}(e))throw new TypeError(`${t} is not an object.`)}function D(e,t,r){if(void 0===e)throw new TypeError(`Parameter ${t} is required in '${r}'.`)}function $(e,t,r){if(void 0===e)throw new TypeError(`${t} is required in '${r}'.`)}function M(e){return Number(e)}function Y(e){return 0===e?0:e}function Q(e,t){const r=Number.MAX_SAFE_INTEGER;let o=Number(e);if(o=Y(o),!j(o))throw new TypeError(`${t} is not a finite number`);if(o=function(e){return Y(z(e))}(o),o<0||o>r)throw new TypeError(`${t} is outside the accepted range of 0 to ${r}, inclusive`);return j(o)&&0!==o?o:0}function N(e){if(!r$2(e))return !1;if("function"!=typeof e.getReader)return !1;try{return "boolean"==typeof e.locked}catch(e){return !1}}function H(e){if(!r$2(e))return !1;if("function"!=typeof e.getWriter)return !1;try{return "boolean"==typeof e.locked}catch(e){return !1}}function x(e,t){if(!ur(e))throw new TypeError(`${t} is not a ReadableStream.`)}function V(e,t){e._reader._readRequests.push(t);}function U(e,t,r){const o=e._reader._readRequests.shift();r?o._closeSteps():o._chunkSteps(t);}function G(e){return e._reader._readRequests.length}function X(e){const t=e._reader;return void 0!==t&&!!J(t)}class ReadableStreamDefaultReader{constructor(e){if(D(e,1,"ReadableStreamDefaultReader"),x(e,"First parameter"),cr(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");v(this,e),this._readRequests=new S;}get closed(){return J(this)?this._closedPromise:d(K$1("closed"))}cancel(e){return J(this)?void 0===this._ownerReadableStream?d(q("cancel")):R(this,e):d(K$1("cancel"))}read(){if(!J(this))return d(K$1("read"));if(void 0===this._ownerReadableStream)return d(q("read from"));let e,t;const r=u(((r,o)=>{e=r,t=o;}));return function(e,t){const r=e._ownerReadableStream;r._disturbed=!0,"closed"===r._state?t._closeSteps():"errored"===r._state?t._errorSteps(r._storedError):r._readableStreamController[A](t);}(this,{_chunkSteps:t=>e({value:t,done:!1}),_closeSteps:()=>e({value:void 0,done:!0}),_errorSteps:e=>t(e)}),r}releaseLock(){if(!J(this))throw K$1("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");T(this);}}}function J(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_readRequests")&&e instanceof ReadableStreamDefaultReader)}function K$1(e){return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`)}Object.defineProperties(ReadableStreamDefaultReader.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),n(ReadableStreamDefaultReader.prototype.cancel,"cancel"),n(ReadableStreamDefaultReader.prototype.read,"read"),n(ReadableStreamDefaultReader.prototype.releaseLock,"releaseLock"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableStreamDefaultReader.prototype,e.toStringTag,{value:"ReadableStreamDefaultReader",configurable:!0});class Z{constructor(e,t){this._ongoingPromise=void 0,this._isFinished=!1,this._reader=e,this._preventCancel=t;}next(){const e=()=>this._nextSteps();return this._ongoingPromise=this._ongoingPromise?p(this._ongoingPromise,e,e):e(),this._ongoingPromise}return(e){const t=()=>this._returnSteps(e);return this._ongoingPromise?p(this._ongoingPromise,t,t):t()}_nextSteps(){if(this._isFinished)return Promise.resolve({value:void 0,done:!0});const e=this._reader;return void 0===e?d(q("iterate")):f$1(e.read(),(e=>{var t;return this._ongoingPromise=void 0,e.done&&(this._isFinished=!0,null===(t=this._reader)||void 0===t||t.releaseLock(),this._reader=void 0),e}),(e=>{var t;throw this._ongoingPromise=void 0,this._isFinished=!0,null===(t=this._reader)||void 0===t||t.releaseLock(),this._reader=void 0,e}))}_returnSteps(e){if(this._isFinished)return Promise.resolve({value:e,done:!0});this._isFinished=!0;const t=this._reader;if(void 0===t)return d(q("finish iterating"));if(this._reader=void 0,!this._preventCancel){const r=t.cancel(e);return t.releaseLock(),p(r,(()=>({value:e,done:!0})))}return t.releaseLock(),c({value:e,done:!0})}}const ee={next(){return te(this)?this._asyncIteratorImpl.next():d(re("next"))},return(e){return te(this)?this._asyncIteratorImpl.return(e):d(re("return"))}};function te(e){if(!r$2(e))return !1;if(!Object.prototype.hasOwnProperty.call(e,"_asyncIteratorImpl"))return !1;try{return e._asyncIteratorImpl instanceof Z}catch(e){return !1}}function re(e){return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`)}"symbol"==typeof e.asyncIterator&&Object.defineProperty(ee,e.asyncIterator,{value(){return this},writable:!0,configurable:!0});const oe=Number.isNaN||function(e){return e!=e};function ne(e,t,r,o,n){new Uint8Array(e).set(new Uint8Array(r,o,n),t);}function ae(e,t,r){if(e.slice)return e.slice(t,r);const o=r-t,n=new ArrayBuffer(o);return ne(n,0,e,t,o),n}function ie(e){const t=ae(e.buffer,e.byteOffset,e.byteOffset+e.byteLength);return new Uint8Array(t)}function le(e){const t=e._queue.shift();return e._queueTotalSize-=t.size,e._queueTotalSize<0&&(e._queueTotalSize=0),t.value}function se(e,t,r){if("number"!=typeof(o=r)||oe(o)||o<0||r===1/0)throw new RangeError("Size must be a finite, non-NaN, non-negative number.");var o;e._queue.push({value:t,size:r}),e._queueTotalSize+=r;}function ue(e){e._queue=new S,e._queueTotalSize=0;}class ReadableStreamBYOBRequest{constructor(){throw new TypeError("Illegal constructor")}get view(){if(!de(this))throw Pe("view");return this._view}respond(e){if(!de(this))throw Pe("respond");if(D(e,1,"respond"),e=Q(e,"First parameter"),void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");this._view.buffer,function(e,t){const r=e._pendingPullIntos.peek();if("closed"===e._controlledReadableByteStream._state){if(0!==t)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream")}else {if(0===t)throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");if(r.bytesFilled+t>r.byteLength)throw new RangeError("bytesWritten out of range")}r.buffer=r.buffer,ve(e,t);}(this._associatedReadableByteStreamController,e);}respondWithNewView(e){if(!de(this))throw Pe("respondWithNewView");if(D(e,1,"respondWithNewView"),!ArrayBuffer.isView(e))throw new TypeError("You can only respond with array buffer views");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");e.buffer,function(e,t){const r=e._pendingPullIntos.peek();if("closed"===e._controlledReadableByteStream._state){if(0!==t.byteLength)throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream")}else if(0===t.byteLength)throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");if(r.byteOffset+r.bytesFilled!==t.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(r.bufferByteLength!==t.buffer.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");if(r.bytesFilled+t.byteLength>r.byteLength)throw new RangeError("The region specified by view is larger than byobRequest");const o=t.byteLength;r.buffer=t.buffer,ve(e,o);}(this._associatedReadableByteStreamController,e);}}Object.defineProperties(ReadableStreamBYOBRequest.prototype,{respond:{enumerable:!0},respondWithNewView:{enumerable:!0},view:{enumerable:!0}}),n(ReadableStreamBYOBRequest.prototype.respond,"respond"),n(ReadableStreamBYOBRequest.prototype.respondWithNewView,"respondWithNewView"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableStreamBYOBRequest.prototype,e.toStringTag,{value:"ReadableStreamBYOBRequest",configurable:!0});class ReadableByteStreamController{constructor(){throw new TypeError("Illegal constructor")}get byobRequest(){if(!ce(this))throw We("byobRequest");return function(e){if(null===e._byobRequest&&e._pendingPullIntos.length>0){const t=e._pendingPullIntos.peek(),r=new Uint8Array(t.buffer,t.byteOffset+t.bytesFilled,t.byteLength-t.bytesFilled),o=Object.create(ReadableStreamBYOBRequest.prototype);!function(e,t,r){e._associatedReadableByteStreamController=t,e._view=r;}(o,e,r),e._byobRequest=o;}return e._byobRequest}(this)}get desiredSize(){if(!ce(this))throw We("desiredSize");return Ce(this)}close(){if(!ce(this))throw We("close");if(this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");const e=this._controlledReadableByteStream._state;if("readable"!==e)throw new TypeError(`The stream (in ${e} state) is not in the readable state and cannot be closed`);!function(e){const t=e._controlledReadableByteStream;if(e._closeRequested||"readable"!==t._state)return;if(e._queueTotalSize>0)return void(e._closeRequested=!0);if(e._pendingPullIntos.length>0){if(e._pendingPullIntos.peek().bytesFilled>0){const t=new TypeError("Insufficient bytes to fill elements in the given buffer");throw qe(e,t),t}}Te(e),fr(t);}(this);}enqueue(e){if(!ce(this))throw We("enqueue");if(D(e,1,"enqueue"),!ArrayBuffer.isView(e))throw new TypeError("chunk must be an array buffer view");if(0===e.byteLength)throw new TypeError("chunk must have non-zero byteLength");if(0===e.buffer.byteLength)throw new TypeError("chunk's buffer must have non-zero byteLength");if(this._closeRequested)throw new TypeError("stream is closed or draining");const t=this._controlledReadableByteStream._state;if("readable"!==t)throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be enqueued to`);!function(e,t){const r=e._controlledReadableByteStream;if(e._closeRequested||"readable"!==r._state)return;const o=t.buffer,n=t.byteOffset,a=t.byteLength,i=o;if(e._pendingPullIntos.length>0){const t=e._pendingPullIntos.peek();t.buffer,t.buffer=t.buffer;}if(we(e),X(r))if(0===G(r))pe(e,i,n,a);else {e._pendingPullIntos.length>0&&Re(e);U(r,new Uint8Array(i,n,a),!1);}else Be(r)?(pe(e,i,n,a),Se(e)):pe(e,i,n,a);fe(e);}(this,e);}error(e){if(!ce(this))throw We("error");qe(this,e);}[B](e){be(this),ue(this);const t=this._cancelAlgorithm(e);return Te(this),t}[A](e){const t=this._controlledReadableByteStream;if(this._queueTotalSize>0){const t=this._queue.shift();this._queueTotalSize-=t.byteLength,ge(this);const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);return void e._chunkSteps(r)}const r=this._autoAllocateChunkSize;if(void 0!==r){let t;try{t=new ArrayBuffer(r);}catch(t){return void e._errorSteps(t)}const o={buffer:t,bufferByteLength:r,byteOffset:0,byteLength:r,bytesFilled:0,elementSize:1,viewConstructor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(o);}V(t,e),fe(this);}}function ce(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableByteStream")&&e instanceof ReadableByteStreamController)}function de(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")&&e instanceof ReadableStreamBYOBRequest)}function fe(e){const t=function(e){const t=e._controlledReadableByteStream;if("readable"!==t._state)return !1;if(e._closeRequested)return !1;if(!e._started)return !1;if(X(t)&&G(t)>0)return !0;if(Be(t)&&Oe(t)>0)return !0;if(Ce(e)>0)return !0;return !1}(e);if(!t)return;if(e._pulling)return void(e._pullAgain=!0);e._pulling=!0;b(e._pullAlgorithm(),(()=>(e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,fe(e)),null)),(t=>(qe(e,t),null)));}function be(e){we(e),e._pendingPullIntos=new S;}function he(e,t){let r=!1;"closed"===e._state&&(r=!0);const o=_e(t);"default"===t.readerType?U(e,o,r):function(e,t,r){const o=e._reader._readIntoRequests.shift();r?o._closeSteps(t):o._chunkSteps(t);}(e,o,r);}function _e(e){const t=e.bytesFilled,r=e.elementSize;return new e.viewConstructor(e.buffer,e.byteOffset,t/r)}function pe(e,t,r,o){e._queue.push({buffer:t,byteOffset:r,byteLength:o}),e._queueTotalSize+=o;}function me(e,t){const r=t.elementSize,o=t.bytesFilled-t.bytesFilled%r,n=Math.min(e._queueTotalSize,t.byteLength-t.bytesFilled),a=t.bytesFilled+n,i=a-a%r;let l=n,s=!1;i>o&&(l=i-t.bytesFilled,s=!0);const u=e._queue;for(;l>0;){const r=u.peek(),o=Math.min(l,r.byteLength),n=t.byteOffset+t.bytesFilled;ne(t.buffer,n,r.buffer,r.byteOffset,o),r.byteLength===o?u.shift():(r.byteOffset+=o,r.byteLength-=o),e._queueTotalSize-=o,ye(e,o,t),l-=o;}return s}function ye(e,t,r){r.bytesFilled+=t;}function ge(e){0===e._queueTotalSize&&e._closeRequested?(Te(e),fr(e._controlledReadableByteStream)):fe(e);}function we(e){null!==e._byobRequest&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=null,e._byobRequest=null);}function Se(e){for(;e._pendingPullIntos.length>0;){if(0===e._queueTotalSize)return;const t=e._pendingPullIntos.peek();me(e,t)&&(Re(e),he(e._controlledReadableByteStream,t));}}function ve(e,t){const r=e._pendingPullIntos.peek();we(e);"closed"===e._controlledReadableByteStream._state?function(e,t){const r=e._controlledReadableByteStream;if(Be(r))for(;Oe(r)>0;)he(r,Re(e));}(e):function(e,t,r){if(ye(0,t,r),r.bytesFilled<r.elementSize)return;Re(e);const o=r.bytesFilled%r.elementSize;if(o>0){const t=r.byteOffset+r.bytesFilled,n=ae(r.buffer,t-o,t);pe(e,n,0,n.byteLength);}r.bytesFilled-=o,he(e._controlledReadableByteStream,r),Se(e);}(e,t,r),fe(e);}function Re(e){return e._pendingPullIntos.shift()}function Te(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0;}function qe(e,t){const r=e._controlledReadableByteStream;"readable"===r._state&&(be(e),ue(e),Te(e),br(r,t));}function Ce(e){const t=e._controlledReadableByteStream._state;return "errored"===t?null:"closed"===t?0:e._strategyHWM-e._queueTotalSize}function Ee(e,t,r){const o=Object.create(ReadableByteStreamController.prototype);let n,a,i;n=void 0!==t.start?()=>t.start(o):()=>{},a=void 0!==t.pull?()=>t.pull(o):()=>c(void 0),i=void 0!==t.cancel?e=>t.cancel(e):()=>c(void 0);const l=t.autoAllocateChunkSize;if(0===l)throw new TypeError("autoAllocateChunkSize must be greater than 0");!function(e,t,r,o,n,a,i){t._controlledReadableByteStream=e,t._pullAgain=!1,t._pulling=!1,t._byobRequest=null,t._queue=t._queueTotalSize=void 0,ue(t),t._closeRequested=!1,t._started=!1,t._strategyHWM=a,t._pullAlgorithm=o,t._cancelAlgorithm=n,t._autoAllocateChunkSize=i,t._pendingPullIntos=new S,e._readableStreamController=t,b(c(r()),(()=>(t._started=!0,fe(t),null)),(e=>(qe(t,e),null)));}(e,o,n,a,i,r,l);}function Pe(e){return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`)}function We(e){return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`)}function ke(e,t){e._reader._readIntoRequests.push(t);}function Oe(e){return e._reader._readIntoRequests.length}function Be(e){const t=e._reader;return void 0!==t&&!!Ae(t)}Object.defineProperties(ReadableByteStreamController.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},byobRequest:{enumerable:!0},desiredSize:{enumerable:!0}}),n(ReadableByteStreamController.prototype.close,"close"),n(ReadableByteStreamController.prototype.enqueue,"enqueue"),n(ReadableByteStreamController.prototype.error,"error"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableByteStreamController.prototype,e.toStringTag,{value:"ReadableByteStreamController",configurable:!0});class ReadableStreamBYOBReader{constructor(e){if(D(e,1,"ReadableStreamBYOBReader"),x(e,"First parameter"),cr(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");if(!ce(e._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");v(this,e),this._readIntoRequests=new S;}get closed(){return Ae(this)?this._closedPromise:d(je("closed"))}cancel(e){return Ae(this)?void 0===this._ownerReadableStream?d(q("cancel")):R(this,e):d(je("cancel"))}read(e){if(!Ae(this))return d(je("read"));if(!ArrayBuffer.isView(e))return d(new TypeError("view must be an array buffer view"));if(0===e.byteLength)return d(new TypeError("view must have non-zero byteLength"));if(0===e.buffer.byteLength)return d(new TypeError("view's buffer must have non-zero byteLength"));if(e.buffer,void 0===this._ownerReadableStream)return d(q("read from"));let t,r;const o=u(((e,o)=>{t=e,r=o;}));return function(e,t,r){const o=e._ownerReadableStream;o._disturbed=!0,"errored"===o._state?r._errorSteps(o._storedError):function(e,t,r){const o=e._controlledReadableByteStream;let n=1;t.constructor!==DataView&&(n=t.constructor.BYTES_PER_ELEMENT);const a=t.constructor,i=t.buffer,l={buffer:i,bufferByteLength:i.byteLength,byteOffset:t.byteOffset,byteLength:t.byteLength,bytesFilled:0,elementSize:n,viewConstructor:a,readerType:"byob"};if(e._pendingPullIntos.length>0)return e._pendingPullIntos.push(l),void ke(o,r);if("closed"!==o._state){if(e._queueTotalSize>0){if(me(e,l)){const t=_e(l);return ge(e),void r._chunkSteps(t)}if(e._closeRequested){const t=new TypeError("Insufficient bytes to fill elements in the given buffer");return qe(e,t),void r._errorSteps(t)}}e._pendingPullIntos.push(l),ke(o,r),fe(e);}else {const e=new a(l.buffer,l.byteOffset,0);r._closeSteps(e);}}(o._readableStreamController,t,r);}(this,e,{_chunkSteps:e=>t({value:e,done:!1}),_closeSteps:e=>t({value:e,done:!0}),_errorSteps:e=>r(e)}),o}releaseLock(){if(!Ae(this))throw je("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readIntoRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");T(this);}}}function Ae(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")&&e instanceof ReadableStreamBYOBReader)}function je(e){return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`)}function ze(e,t){const{highWaterMark:r}=e;if(void 0===r)return t;if(oe(r)||r<0)throw new RangeError("Invalid highWaterMark");return r}function Le(e){const{size:t}=e;return t||(()=>1)}function Fe(e,t){L(e,t);const r=null==e?void 0:e.highWaterMark,o=null==e?void 0:e.size;return {highWaterMark:void 0===r?void 0:M(r),size:void 0===o?void 0:Ie(o,`${t} has member 'size' that`)}}function Ie(e,t){return F(e,t),t=>M(e(t))}function De(e,t,r){return F(e,r),r=>w(e,t,[r])}function $e(e,t,r){return F(e,r),()=>w(e,t,[])}function Me(e,t,r){return F(e,r),r=>g(e,t,[r])}function Ye(e,t,r){return F(e,r),(r,o)=>w(e,t,[r,o])}Object.defineProperties(ReadableStreamBYOBReader.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),n(ReadableStreamBYOBReader.prototype.cancel,"cancel"),n(ReadableStreamBYOBReader.prototype.read,"read"),n(ReadableStreamBYOBReader.prototype.releaseLock,"releaseLock"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableStreamBYOBReader.prototype,e.toStringTag,{value:"ReadableStreamBYOBReader",configurable:!0});const Qe="function"==typeof AbortController;function Ne(e,t,r){return F(e,r),r=>w(e,t,[r])}function He(e,t,r){return F(e,r),r=>g(e,t,[r])}function xe(e,t,r){return F(e,r),(r,o)=>w(e,t,[r,o])}class TransformStream{constructor(e={},t={},r={}){void 0===e&&(e=null);const o=Fe(t,"Second parameter"),n=Fe(r,"Third parameter"),a=function(e,t){L(e,t);const r=null==e?void 0:e.flush,o=null==e?void 0:e.readableType,n=null==e?void 0:e.start,a=null==e?void 0:e.transform,i=null==e?void 0:e.writableType;return {flush:void 0===r?void 0:Ne(r,e,`${t} has member 'flush' that`),readableType:o,start:void 0===n?void 0:He(n,e,`${t} has member 'start' that`),transform:void 0===a?void 0:xe(a,e,`${t} has member 'transform' that`),writableType:i}}(e,"First parameter");if(void 0!==a.readableType)throw new RangeError("Invalid readableType specified");if(void 0!==a.writableType)throw new RangeError("Invalid writableType specified");const i=ze(n,0),l=Le(n),s=ze(o,1),f=Le(o);let b;!function(e,t,r,o,n,a){function i(){return t}function l(t){return function(e,t){const r=e._transformStreamController;if(e._backpressure){return p(e._backpressureChangePromise,(()=>{if("erroring"===(dt(e._writable)?e._writable._state:e._writableState))throw dt(e._writable)?e._writable._storedError:e._writableStoredError;return et(r,t)}))}return et(r,t)}(e,t)}function s(t){return function(e,t){return Ue(e,t),c(void 0)}(e,t)}function u(){return function(e){const t=e._transformStreamController,r=t._flushAlgorithm();return Ke(t),p(r,(()=>{if("errored"===e._readableState)throw e._readableStoredError;ot(e)&&nt(e);}),(t=>{throw Ue(e,t),e._readableStoredError}))}(e)}function d(){return function(e){return Xe(e,!1),e._backpressureChangePromise}(e)}function f(t){return Ge(e,t),c(void 0)}e._writableState="writable",e._writableStoredError=void 0,e._writableHasInFlightOperation=!1,e._writableStarted=!1,e._writable=function(e,t,r,o,n,a,i){return new WritableStream({start(r){e._writableController=r;try{const t=r.signal;void 0!==t&&t.addEventListener("abort",(()=>{"writable"===e._writableState&&(e._writableState="erroring",t.reason&&(e._writableStoredError=t.reason));}));}catch(e){}return t().then((()=>{e._writableStarted=!0,ct(e);}),(t=>{throw e._writableStarted=!0,lt(e,t),t}))},write:t=>(function(e){e._writableHasInFlightOperation=!0;}(e),r(t).then((()=>{!function(e){e._writableHasInFlightOperation=!1;}(e),ct(e);}),(t=>{throw function(e,t){e._writableHasInFlightOperation=!1,lt(e,t);}(e,t),t}))),close:()=>(function(e){e._writableHasInFlightOperation=!0;}(e),o().then((()=>{!function(e){e._writableHasInFlightOperation=!1;"erroring"===e._writableState&&(e._writableStoredError=void 0);e._writableState="closed";}(e);}),(t=>{throw function(e,t){e._writableHasInFlightOperation=!1,e._writableState,lt(e,t);}(e,t),t}))),abort:t=>(e._writableState="errored",e._writableStoredError=t,n(t))},{highWaterMark:a,size:i})}(e,i,l,u,s,r,o),e._readableState="readable",e._readableStoredError=void 0,e._readableCloseRequested=!1,e._readablePulling=!1,e._readable=function(e,t,r,o,n,a){return new ReadableStream({start:r=>(e._readableController=r,t().catch((t=>{at(e,t);}))),pull:()=>(e._readablePulling=!0,r().catch((t=>{at(e,t);}))),cancel:t=>(e._readableState="closed",o(t))},{highWaterMark:n,size:a})}(e,i,d,f,n,a),e._backpressure=void 0,e._backpressureChangePromise=void 0,e._backpressureChangePromise_resolve=void 0,Xe(e,!0),e._transformStreamController=void 0;}(this,u((e=>{b=e;})),s,f,i,l),function(e,t){const r=Object.create(TransformStreamDefaultController.prototype);let o,n;o=void 0!==t.transform?e=>t.transform(e,r):e=>{try{return Ze(r,e),c(void 0)}catch(e){return d(e)}};n=void 0!==t.flush?()=>t.flush(r):()=>c(void 0);!function(e,t,r,o){t._controlledTransformStream=e,e._transformStreamController=t,t._transformAlgorithm=r,t._flushAlgorithm=o;}(e,r,o,n);}(this,a),void 0!==a.start?b(a.start(this._transformStreamController)):b(void 0);}get readable(){if(!Ve(this))throw rt("readable");return this._readable}get writable(){if(!Ve(this))throw rt("writable");return this._writable}}function Ve(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_transformStreamController")&&e instanceof TransformStream)}function Ue(e,t){at(e,t),Ge(e,t);}function Ge(e,t){Ke(e._transformStreamController),function(e,t){e._writableController.error(t);"writable"===e._writableState&&st(e,t);}(e,t),e._backpressure&&Xe(e,!1);}function Xe(e,t){void 0!==e._backpressureChangePromise&&e._backpressureChangePromise_resolve(),e._backpressureChangePromise=u((t=>{e._backpressureChangePromise_resolve=t;})),e._backpressure=t;}Object.defineProperties(TransformStream.prototype,{readable:{enumerable:!0},writable:{enumerable:!0}}),"symbol"==typeof e.toStringTag&&Object.defineProperty(TransformStream.prototype,e.toStringTag,{value:"TransformStream",configurable:!0});class TransformStreamDefaultController{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!Je(this))throw tt("desiredSize");return it(this._controlledTransformStream)}enqueue(e){if(!Je(this))throw tt("enqueue");Ze(this,e);}error(e){if(!Je(this))throw tt("error");var t;t=e,Ue(this._controlledTransformStream,t);}terminate(){if(!Je(this))throw tt("terminate");!function(e){const t=e._controlledTransformStream;ot(t)&&nt(t);const r=new TypeError("TransformStream terminated");Ge(t,r);}(this);}}function Je(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_controlledTransformStream")&&e instanceof TransformStreamDefaultController)}function Ke(e){e._transformAlgorithm=void 0,e._flushAlgorithm=void 0;}function Ze(e,t){const r=e._controlledTransformStream;if(!ot(r))throw new TypeError("Readable side is not in a state that permits enqueue");try{!function(e,t){e._readablePulling=!1;try{e._readableController.enqueue(t);}catch(t){throw at(e,t),t}}(r,t);}catch(e){throw Ge(r,e),r._readableStoredError}const o=function(e){return !function(e){if(!ot(e))return !1;if(e._readablePulling)return !0;if(it(e)>0)return !0;return !1}(e)}(r);o!==r._backpressure&&Xe(r,!0);}function et(e,t){return p(e._transformAlgorithm(t),void 0,(t=>{throw Ue(e._controlledTransformStream,t),t}))}function tt(e){return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`)}function rt(e){return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`)}function ot(e){return !e._readableCloseRequested&&"readable"===e._readableState}function nt(e){e._readableState="closed",e._readableCloseRequested=!0,e._readableController.close();}function at(e,t){"readable"===e._readableState&&(e._readableState="errored",e._readableStoredError=t),e._readableController.error(t);}function it(e){return e._readableController.desiredSize}function lt(e,t){"writable"!==e._writableState?ut(e):st(e,t);}function st(e,t){e._writableState="erroring",e._writableStoredError=t,!function(e){return e._writableHasInFlightOperation}(e)&&e._writableStarted&&ut(e);}function ut(e){e._writableState="errored";}function ct(e){"erroring"===e._writableState&&ut(e);}Object.defineProperties(TransformStreamDefaultController.prototype,{enqueue:{enumerable:!0},error:{enumerable:!0},terminate:{enumerable:!0},desiredSize:{enumerable:!0}}),n(TransformStreamDefaultController.prototype.enqueue,"enqueue"),n(TransformStreamDefaultController.prototype.error,"error"),n(TransformStreamDefaultController.prototype.terminate,"terminate"),"symbol"==typeof e.toStringTag&&Object.defineProperty(TransformStreamDefaultController.prototype,e.toStringTag,{value:"TransformStreamDefaultController",configurable:!0});class WritableStream{constructor(e={},t={}){void 0===e?e=null:I(e,"First parameter");const r=Fe(t,"Second parameter"),o=function(e,t){L(e,t);const r=null==e?void 0:e.abort,o=null==e?void 0:e.close,n=null==e?void 0:e.start,a=null==e?void 0:e.type,i=null==e?void 0:e.write;return {abort:void 0===r?void 0:De(r,e,`${t} has member 'abort' that`),close:void 0===o?void 0:$e(o,e,`${t} has member 'close' that`),start:void 0===n?void 0:Me(n,e,`${t} has member 'start' that`),write:void 0===i?void 0:Ye(i,e,`${t} has member 'write' that`),type:a}}(e,"First parameter");var n;(n=this)._state="writable",n._storedError=void 0,n._writer=void 0,n._writableStreamController=void 0,n._writeRequests=new S,n._inFlightWriteRequest=void 0,n._closeRequest=void 0,n._inFlightCloseRequest=void 0,n._pendingAbortRequest=void 0,n._backpressure=!1;if(void 0!==o.type)throw new RangeError("Invalid type is specified");const a=Le(r);!function(e,t,r,o){const n=Object.create(WritableStreamDefaultController.prototype);let a,i,l,s;a=void 0!==t.start?()=>t.start(n):()=>{};i=void 0!==t.write?e=>t.write(e,n):()=>c(void 0);l=void 0!==t.close?()=>t.close():()=>c(void 0);s=void 0!==t.abort?e=>t.abort(e):()=>c(void 0);!function(e,t,r,o,n,a,i,l){t._controlledWritableStream=e,e._writableStreamController=t,t._queue=void 0,t._queueTotalSize=void 0,ue(t),t._abortReason=void 0,t._abortController=function(){if(Qe)return new AbortController}(),t._started=!1,t._strategySizeAlgorithm=l,t._strategyHWM=i,t._writeAlgorithm=o,t._closeAlgorithm=n,t._abortAlgorithm=a;const s=Wt(t);wt(e,s);const u=r();b(c(u),(()=>(t._started=!0,Et(t),null)),(r=>(t._started=!0,_t(e,r),null)));}(e,n,a,i,l,s,r,o);}(this,o,ze(r,1),a);}get locked(){if(!dt(this))throw Ot("locked");return ft(this)}abort(e){return dt(this)?ft(this)?d(new TypeError("Cannot abort a stream that already has a writer")):bt(this,e):d(Ot("abort"))}close(){return dt(this)?ft(this)?d(new TypeError("Cannot close a stream that already has a writer")):yt(this)?d(new TypeError("Cannot close an already-closing stream")):ht(this):d(Ot("close"))}getWriter(){if(!dt(this))throw Ot("getWriter");return new WritableStreamDefaultWriter(this)}}function dt(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")&&e instanceof WritableStream)}function ft(e){return void 0!==e._writer}function bt(e,t){var r;if("closed"===e._state||"errored"===e._state)return c(void 0);e._writableStreamController._abortReason=t,null===(r=e._writableStreamController._abortController)||void 0===r||r.abort(t);const o=e._state;if("closed"===o||"errored"===o)return c(void 0);if(void 0!==e._pendingAbortRequest)return e._pendingAbortRequest._promise;let n=!1;"erroring"===o&&(n=!0,t=void 0);const a=u(((r,o)=>{e._pendingAbortRequest={_promise:void 0,_resolve:r,_reject:o,_reason:t,_wasAlreadyErroring:n};}));return e._pendingAbortRequest._promise=a,n||pt(e,t),a}function ht(e){const t=e._state;if("closed"===t||"errored"===t)return d(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));const r=u(((t,r)=>{const o={_resolve:t,_reject:r};e._closeRequest=o;})),o=e._writer;var n;return void 0!==o&&e._backpressure&&"writable"===t&&Qt(o),se(n=e._writableStreamController,Rt,0),Et(n),r}function _t(e,t){"writable"!==e._state?mt(e):pt(e,t);}function pt(e,t){const r=e._writableStreamController;e._state="erroring",e._storedError=t;const o=e._writer;void 0!==o&&vt(o,t),!function(e){if(void 0===e._inFlightWriteRequest&&void 0===e._inFlightCloseRequest)return !1;return !0}(e)&&r._started&&mt(e);}function mt(e){e._state="errored",e._writableStreamController[O]();const t=e._storedError;if(e._writeRequests.forEach((e=>{e._reject(t);})),e._writeRequests=new S,void 0===e._pendingAbortRequest)return void gt(e);const r=e._pendingAbortRequest;if(e._pendingAbortRequest=void 0,r._wasAlreadyErroring)return r._reject(t),void gt(e);b(e._writableStreamController[k](r._reason),(()=>(r._resolve(),gt(e),null)),(t=>(r._reject(t),gt(e),null)));}function yt(e){return void 0!==e._closeRequest||void 0!==e._inFlightCloseRequest}function gt(e){void 0!==e._closeRequest&&(e._closeRequest._reject(e._storedError),e._closeRequest=void 0);const t=e._writer;void 0!==t&&Ft(t,e._storedError);}function wt(e,t){const r=e._writer;void 0!==r&&t!==e._backpressure&&(t?function(e){Dt(e);}(r):Qt(r)),e._backpressure=t;}Object.defineProperties(WritableStream.prototype,{abort:{enumerable:!0},close:{enumerable:!0},getWriter:{enumerable:!0},locked:{enumerable:!0}}),n(WritableStream.prototype.abort,"abort"),n(WritableStream.prototype.close,"close"),n(WritableStream.prototype.getWriter,"getWriter"),"symbol"==typeof e.toStringTag&&Object.defineProperty(WritableStream.prototype,e.toStringTag,{value:"WritableStream",configurable:!0});class WritableStreamDefaultWriter{constructor(e){if(D(e,1,"WritableStreamDefaultWriter"),function(e,t){if(!dt(e))throw new TypeError(`${t} is not a WritableStream.`)}(e,"First parameter"),ft(e))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=e,e._writer=this;const t=e._state;if("writable"===t)!yt(e)&&e._backpressure?Dt(this):Mt(this),zt(this);else if("erroring"===t)$t(this,e._storedError),zt(this);else if("closed"===t)Mt(this),zt(r=this),It(r);else {const t=e._storedError;$t(this,t),Lt(this,t);}var r;}get closed(){return St(this)?this._closedPromise:d(At("closed"))}get desiredSize(){if(!St(this))throw At("desiredSize");if(void 0===this._ownerWritableStream)throw jt("desiredSize");return function(e){const t=e._ownerWritableStream,r=t._state;if("errored"===r||"erroring"===r)return null;if("closed"===r)return 0;return Ct(t._writableStreamController)}(this)}get ready(){return St(this)?this._readyPromise:d(At("ready"))}abort(e){return St(this)?void 0===this._ownerWritableStream?d(jt("abort")):function(e,t){return bt(e._ownerWritableStream,t)}(this,e):d(At("abort"))}close(){if(!St(this))return d(At("close"));const e=this._ownerWritableStream;return void 0===e?d(jt("close")):yt(e)?d(new TypeError("Cannot close an already-closing stream")):ht(this._ownerWritableStream)}releaseLock(){if(!St(this))throw At("releaseLock");void 0!==this._ownerWritableStream&&function(e){const t=e._ownerWritableStream,r=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");vt(e,r),function(e,t){"pending"===e._closedPromiseState?Ft(e,t):function(e,t){Lt(e,t);}(e,t);}(e,r),t._writer=void 0,e._ownerWritableStream=void 0;}(this);}write(e){return St(this)?void 0===this._ownerWritableStream?d(jt("write to")):function(e,t){const r=e._ownerWritableStream,o=r._writableStreamController,n=function(e,t){try{return e._strategySizeAlgorithm(t)}catch(t){return Pt(e,t),1}}(o,t);if(r!==e._ownerWritableStream)return d(jt("write to"));const a=r._state;if("errored"===a)return d(r._storedError);if(yt(r)||"closed"===a)return d(new TypeError("The stream is closing or closed and cannot be written to"));if("erroring"===a)return d(r._storedError);const i=function(e){return u(((t,r)=>{const o={_resolve:t,_reject:r};e._writeRequests.push(o);}))}(r);return function(e,t,r){try{se(e,t,r);}catch(t){return void Pt(e,t)}const o=e._controlledWritableStream;if(!yt(o)&&"writable"===o._state){wt(o,Wt(e));}Et(e);}(o,t,n),i}(this,e):d(At("write"))}}function St(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")&&e instanceof WritableStreamDefaultWriter)}function vt(e,t){"pending"===e._readyPromiseState?Yt(e,t):function(e,t){$t(e,t);}(e,t);}Object.defineProperties(WritableStreamDefaultWriter.prototype,{abort:{enumerable:!0},close:{enumerable:!0},releaseLock:{enumerable:!0},write:{enumerable:!0},closed:{enumerable:!0},desiredSize:{enumerable:!0},ready:{enumerable:!0}}),n(WritableStreamDefaultWriter.prototype.abort,"abort"),n(WritableStreamDefaultWriter.prototype.close,"close"),n(WritableStreamDefaultWriter.prototype.releaseLock,"releaseLock"),n(WritableStreamDefaultWriter.prototype.write,"write"),"symbol"==typeof e.toStringTag&&Object.defineProperty(WritableStreamDefaultWriter.prototype,e.toStringTag,{value:"WritableStreamDefaultWriter",configurable:!0});const Rt={};class WritableStreamDefaultController{constructor(){throw new TypeError("Illegal constructor")}get abortReason(){if(!Tt(this))throw Bt("abortReason");return this._abortReason}get signal(){if(!Tt(this))throw Bt("signal");if(void 0===this._abortController)throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");return this._abortController.signal}error(e){if(!Tt(this))throw Bt("error");"writable"===this._controlledWritableStream._state&&kt(this,e);}[k](e){const t=this._abortAlgorithm(e);return qt(this),t}[O](){ue(this);}}function Tt(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_controlledWritableStream")&&e instanceof WritableStreamDefaultController)}function qt(e){e._writeAlgorithm=void 0,e._closeAlgorithm=void 0,e._abortAlgorithm=void 0,e._strategySizeAlgorithm=void 0;}function Ct(e){return e._strategyHWM-e._queueTotalSize}function Et(e){const t=e._controlledWritableStream;if(!e._started)return;if(void 0!==t._inFlightWriteRequest)return;if("erroring"===t._state)return void mt(t);if(0===e._queue.length)return;const r=e._queue.peek().value;r===Rt?function(e){const t=e._controlledWritableStream;((function(e){e._inFlightCloseRequest=e._closeRequest,e._closeRequest=void 0;}))(t),le(e);const r=e._closeAlgorithm();qt(e),b(r,(()=>(function(e){e._inFlightCloseRequest._resolve(void 0),e._inFlightCloseRequest=void 0,"erroring"===e._state&&(e._storedError=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)),e._state="closed";const t=e._writer;void 0!==t&&It(t);}(t),null)),(e=>(function(e,t){e._inFlightCloseRequest._reject(t),e._inFlightCloseRequest=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._reject(t),e._pendingAbortRequest=void 0),_t(e,t);}(t,e),null)));}(e):function(e,t){const r=e._controlledWritableStream;!function(e){e._inFlightWriteRequest=e._writeRequests.shift();}(r);b(e._writeAlgorithm(t),(()=>{!function(e){e._inFlightWriteRequest._resolve(void 0),e._inFlightWriteRequest=void 0;}(r);const t=r._state;if(le(e),!yt(r)&&"writable"===t){const t=Wt(e);wt(r,t);}return Et(e),null}),(t=>("writable"===r._state&&qt(e),function(e,t){e._inFlightWriteRequest._reject(t),e._inFlightWriteRequest=void 0,_t(e,t);}(r,t),null)));}(e,r);}function Pt(e,t){"writable"===e._controlledWritableStream._state&&kt(e,t);}function Wt(e){return Ct(e)<=0}function kt(e,t){const r=e._controlledWritableStream;qt(e),pt(r,t);}function Ot(e){return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`)}function Bt(e){return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`)}function At(e){return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`)}function jt(e){return new TypeError("Cannot "+e+" a stream using a released writer")}function zt(e){e._closedPromise=u(((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r,e._closedPromiseState="pending";}));}function Lt(e,t){zt(e),Ft(e,t);}function Ft(e,t){void 0!==e._closedPromise_reject&&(m(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="rejected");}function It(e){void 0!==e._closedPromise_resolve&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="resolved");}function Dt(e){e._readyPromise=u(((t,r)=>{e._readyPromise_resolve=t,e._readyPromise_reject=r;})),e._readyPromiseState="pending";}function $t(e,t){Dt(e),Yt(e,t);}function Mt(e){Dt(e),Qt(e);}function Yt(e,t){void 0!==e._readyPromise_reject&&(m(e._readyPromise),e._readyPromise_reject(t),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="rejected");}function Qt(e){void 0!==e._readyPromise_resolve&&(e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="fulfilled");}Object.defineProperties(WritableStreamDefaultController.prototype,{abortReason:{enumerable:!0},signal:{enumerable:!0},error:{enumerable:!0}}),"symbol"==typeof e.toStringTag&&Object.defineProperty(WritableStreamDefaultController.prototype,e.toStringTag,{value:"WritableStreamDefaultController",configurable:!0});const Nt="undefined"!=typeof DOMException?DOMException:void 0;const Ht=function(e){if("function"!=typeof e&&"object"!=typeof e)return !1;try{return new e,!0}catch(e){return !1}}(Nt)?Nt:function(){const e=function(e,t){this.message=e||"",this.name=t||"Error",Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor);};return e.prototype=Object.create(Error.prototype),Object.defineProperty(e.prototype,"constructor",{value:e,writable:!0,configurable:!0}),e}();function xt(e,t,r,o,n,a){const i=e.getReader(),l=t.getWriter();ur(e)&&(e._disturbed=!0);let s,_,g,w=!1,S=!1,v="readable",R="writable",T=!1,q=!1;const C=u((e=>{g=e;}));let E,P;return u(((W,k)=>{let O;function B(){if(w)return;const e=u(((e,t)=>{!function r(o){o?e():f$1(function(){if(w)return c(!0);return f$1(l.ready,(()=>{const e=f$1(i.read(),(e=>!!e.done||(P=l.write(e.value),m(P),!1)));return E=e,e}))}(),r,t);}(!1);}));m(e);}function A(){return v="closed",r?I():F((()=>(dt(t)&&(T=yt(t),R=t._state),T||"closed"===R?c(void 0):"errored"===R?d(_):(T=!0,l.close()))),!1,void 0,!0),null}function j(e){return S||(v="errored",s=e,o?I(!0,e):F((()=>l.abort(e)),!0,e)),null}function z(e){return S||(R="errored",_=e,n?I(!0,e):F((()=>i.cancel(e)),!0,e)),null}if(void 0!==a&&(O=()=>{const e=new Ht("Aborted","AbortError"),t=[];o||t.push((()=>"writable"===R?l.abort(e):c(void 0))),n||t.push((()=>"readable"===v?i.cancel(e):c(void 0))),F((()=>Promise.all(t.map((e=>e())))),!0,e);},a.aborted?O():a.addEventListener("abort",O)),ur(e)&&(v=e._state,s=e._storedError),dt(t)&&(R=t._state,_=t._storedError,T=yt(t)),ur(e)&&dt(t)&&(q=!0,g()),"errored"===v)j(s);else if("errored"===R)z(_);else if("closed"===v)A();else if(T||"closed"===R){const e=new TypeError("the destination writable stream closed before all data could be piped to it");n?I(!0,e):F((()=>i.cancel(e)),!0,e);}function L(){let e,t;return c(function r(){if(e!==E)return e=E,p(E,r,r);if(t!==P)return t=P,p(P,r,r);return}())}function F(e,t,r,o){function n(){return !o||void 0===E&&void 0===P?void 0!==P?h(function(){let e;return c(function t(){if(e!==P)return e=P,p(P,t,t)}())}(),a):a():h(L(),a),null}function a(){return e?b(e(),(()=>D(t,r)),(e=>D(!0,e))):D(t,r),null}w||(w=!0,q?n():h(C,n));}function I(e,t){F(void 0,e,t);}function D(e,t){return void 0!==E||void 0!==P?h(L(),(()=>$(e,t))):$(e,t),null}function $(e,t){return S=!0,l.releaseLock(),i.releaseLock(),void 0!==a&&a.removeEventListener("abort",O),e?k(t):W(void 0),null}w||(b(i.closed,A,j),b(l.closed,(function(){return R="closed",null}),z)),q?B():y((()=>{q=!0,g(),B();}));}))}function Vt(e,t){return function(e){try{return e.getReader({mode:"byob"}).releaseLock(),!0}catch(e){return !1}}(e)?function(e){let t,r,o,n,a,i=e.getReader(),l=!1,s=!1,d=!1,f=!1,h=!1,p=!1;const m=u((e=>{a=e;}));function y(e){_(e.closed,(t=>(e!==i||(o.error(t),n.error(t),h&&p||a(void 0)),null)));}function g(){l&&(i.releaseLock(),i=e.getReader(),y(i),l=!1),b(i.read(),(e=>{var t,r;if(d=!1,f=!1,e.done)return h||o.close(),p||n.close(),null===(t=o.byobRequest)||void 0===t||t.respond(0),null===(r=n.byobRequest)||void 0===r||r.respond(0),h&&p||a(void 0),null;const l=e.value,u=l;let c=l;if(!h&&!p)try{c=ie(l);}catch(e){return o.error(e),n.error(e),a(i.cancel(e)),null}return h||o.enqueue(u),p||n.enqueue(c),s=!1,d?S():f&&v(),null}),(()=>(s=!1,null)));}function w(t,r){l||(i.releaseLock(),i=e.getReader({mode:"byob"}),y(i),l=!0);const u=r?n:o,c=r?o:n;b(i.read(t),(e=>{var t;d=!1,f=!1;const o=r?p:h,n=r?h:p;if(e.done){o||u.close(),n||c.close();const r=e.value;return void 0!==r&&(o||u.byobRequest.respondWithNewView(r),n||null===(t=c.byobRequest)||void 0===t||t.respond(0)),o&&n||a(void 0),null}const l=e.value;if(n)o||u.byobRequest.respondWithNewView(l);else {let e;try{e=ie(l);}catch(e){return u.error(e),c.error(e),a(i.cancel(e)),null}o||u.byobRequest.respondWithNewView(l),c.enqueue(e);}return s=!1,d?S():f&&v(),null}),(()=>(s=!1,null)));}function S(){if(s)return d=!0,c(void 0);s=!0;const e=o.byobRequest;return null===e?g():w(e.view,!1),c(void 0)}function v(){if(s)return f=!0,c(void 0);s=!0;const e=n.byobRequest;return null===e?g():w(e.view,!0),c(void 0)}function R(e){if(h=!0,t=e,p){const e=[t,r],o=i.cancel(e);a(o);}return m}function T(e){if(p=!0,r=e,h){const e=[t,r],o=i.cancel(e);a(o);}return m}const q=new ReadableStream({type:"bytes",start(e){o=e;},pull:S,cancel:R}),C=new ReadableStream({type:"bytes",start(e){n=e;},pull:v,cancel:T});return y(i),[q,C]}(e):function(e,t){const r=e.getReader();let o,n,a,i,l,s=!1,d=!1,f=!1,h=!1;const p=u((e=>{l=e;}));function m(){return s?(d=!0,c(void 0)):(s=!0,b(r.read(),(e=>{if(d=!1,e.done)return f||a.close(),h||i.close(),f&&h||l(void 0),null;const t=e.value,r=t,o=t;return f||a.enqueue(r),h||i.enqueue(o),s=!1,d&&m(),null}),(()=>(s=!1,null))),c(void 0))}function y(e){if(f=!0,o=e,h){const e=[o,n],t=r.cancel(e);l(t);}return p}function g(e){if(h=!0,n=e,f){const e=[o,n],t=r.cancel(e);l(t);}return p}const w=new ReadableStream({start(e){a=e;},pull:m,cancel:y}),S=new ReadableStream({start(e){i=e;},pull:m,cancel:g});return _(r.closed,(e=>(a.error(e),i.error(e),f&&h||l(void 0),null))),[w,S]}(e)}class ReadableStreamDefaultController{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!Ut(this))throw tr("desiredSize");return Kt(this)}close(){if(!Ut(this))throw tr("close");if(!Zt(this))throw new TypeError("The stream is not in a state that permits close");!function(e){if(!Zt(e))return;const t=e._controlledReadableStream;e._closeRequested=!0,0===e._queue.length&&(Xt(e),fr(t));}(this);}enqueue(e){if(!Ut(this))throw tr("enqueue");if(!Zt(this))throw new TypeError("The stream is not in a state that permits enqueue");return function(e,t){if(!Zt(e))return;const r=e._controlledReadableStream;if(cr(r)&&G(r)>0)U(r,t,!1);else {let r;try{r=e._strategySizeAlgorithm(t);}catch(t){throw Jt(e,t),t}try{se(e,t,r);}catch(t){throw Jt(e,t),t}}Gt(e);}(this,e)}error(e){if(!Ut(this))throw tr("error");Jt(this,e);}[B](e){ue(this);const t=this._cancelAlgorithm(e);return Xt(this),t}[A](e){const t=this._controlledReadableStream;if(this._queue.length>0){const r=le(this);this._closeRequested&&0===this._queue.length?(Xt(this),fr(t)):Gt(this),e._chunkSteps(r);}else V(t,e),Gt(this);}}function Ut(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableStream")&&e instanceof ReadableStreamDefaultController)}function Gt(e){const t=function(e){const t=e._controlledReadableStream;if(!Zt(e))return !1;if(!e._started)return !1;if(cr(t)&&G(t)>0)return !0;if(Kt(e)>0)return !0;return !1}(e);if(!t)return;if(e._pulling)return void(e._pullAgain=!0);e._pulling=!0;b(e._pullAlgorithm(),(()=>(e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,Gt(e)),null)),(t=>(Jt(e,t),null)));}function Xt(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0,e._strategySizeAlgorithm=void 0;}function Jt(e,t){const r=e._controlledReadableStream;"readable"===r._state&&(ue(e),Xt(e),br(r,t));}function Kt(e){const t=e._controlledReadableStream._state;return "errored"===t?null:"closed"===t?0:e._strategyHWM-e._queueTotalSize}function Zt(e){return !e._closeRequested&&"readable"===e._controlledReadableStream._state}function er(e,t,r,o){const n=Object.create(ReadableStreamDefaultController.prototype);let a,i,l;a=void 0!==t.start?()=>t.start(n):()=>{},i=void 0!==t.pull?()=>t.pull(n):()=>c(void 0),l=void 0!==t.cancel?e=>t.cancel(e):()=>c(void 0),function(e,t,r,o,n,a,i){t._controlledReadableStream=e,t._queue=void 0,t._queueTotalSize=void 0,ue(t),t._started=!1,t._closeRequested=!1,t._pullAgain=!1,t._pulling=!1,t._strategySizeAlgorithm=i,t._strategyHWM=a,t._pullAlgorithm=o,t._cancelAlgorithm=n,e._readableStreamController=t,b(c(r()),(()=>(t._started=!0,Gt(t),null)),(e=>(Jt(t,e),null)));}(e,n,a,i,l,r,o);}function tr(e){return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`)}function rr(e,t,r){return F(e,r),r=>w(e,t,[r])}function or(e,t,r){return F(e,r),r=>w(e,t,[r])}function nr(e,t,r){return F(e,r),r=>g(e,t,[r])}function ar(e,t){if("bytes"!==(e=`${e}`))throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);return e}function ir(e,t){if("byob"!==(e=`${e}`))throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);return e}function lr(e,t){L(e,t);const r=null==e?void 0:e.preventAbort,o=null==e?void 0:e.preventCancel,n=null==e?void 0:e.preventClose,a=null==e?void 0:e.signal;return void 0!==a&&function(e,t){if(!function(e){if("object"!=typeof e||null===e)return !1;try{return "boolean"==typeof e.aborted}catch(e){return !1}}(e))throw new TypeError(`${t} is not an AbortSignal.`)}(a,`${t} has member 'signal' that`),{preventAbort:Boolean(r),preventCancel:Boolean(o),preventClose:Boolean(n),signal:a}}function sr(e,t){L(e,t);const r=null==e?void 0:e.readable;$(r,"readable","ReadableWritablePair"),function(e,t){if(!N(e))throw new TypeError(`${t} is not a ReadableStream.`)}(r,`${t} has member 'readable' that`);const o=null==e?void 0:e.writable;return $(o,"writable","ReadableWritablePair"),function(e,t){if(!H(e))throw new TypeError(`${t} is not a WritableStream.`)}(o,`${t} has member 'writable' that`),{readable:r,writable:o}}Object.defineProperties(ReadableStreamDefaultController.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},desiredSize:{enumerable:!0}}),n(ReadableStreamDefaultController.prototype.close,"close"),n(ReadableStreamDefaultController.prototype.enqueue,"enqueue"),n(ReadableStreamDefaultController.prototype.error,"error"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableStreamDefaultController.prototype,e.toStringTag,{value:"ReadableStreamDefaultController",configurable:!0});class ReadableStream{constructor(e={},t={}){void 0===e?e=null:I(e,"First parameter");const r=Fe(t,"Second parameter"),o=function(e,t){L(e,t);const r=e,o=null==r?void 0:r.autoAllocateChunkSize,n=null==r?void 0:r.cancel,a=null==r?void 0:r.pull,i=null==r?void 0:r.start,l=null==r?void 0:r.type;return {autoAllocateChunkSize:void 0===o?void 0:Q(o,`${t} has member 'autoAllocateChunkSize' that`),cancel:void 0===n?void 0:rr(n,r,`${t} has member 'cancel' that`),pull:void 0===a?void 0:or(a,r,`${t} has member 'pull' that`),start:void 0===i?void 0:nr(i,r,`${t} has member 'start' that`),type:void 0===l?void 0:ar(l,`${t} has member 'type' that`)}}(e,"First parameter");var n;if((n=this)._state="readable",n._reader=void 0,n._storedError=void 0,n._disturbed=!1,"bytes"===o.type){if(void 0!==r.size)throw new RangeError("The strategy for a byte stream cannot have a size function");Ee(this,o,ze(r,0));}else {const e=Le(r);er(this,o,ze(r,1),e);}}get locked(){if(!ur(this))throw hr("locked");return cr(this)}cancel(e){return ur(this)?cr(this)?d(new TypeError("Cannot cancel a stream that already has a reader")):dr(this,e):d(hr("cancel"))}getReader(e){if(!ur(this))throw hr("getReader");return void 0===function(e,t){L(e,t);const r=null==e?void 0:e.mode;return {mode:void 0===r?void 0:ir(r,`${t} has member 'mode' that`)}}(e,"First parameter").mode?new ReadableStreamDefaultReader(this):function(e){return new ReadableStreamBYOBReader(e)}(this)}pipeThrough(e,t={}){if(!N(this))throw hr("pipeThrough");D(e,1,"pipeThrough");const r=sr(e,"First parameter"),o=lr(t,"Second parameter");if(this.locked)throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(r.writable.locked)throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");return m(xt(this,r.writable,o.preventClose,o.preventAbort,o.preventCancel,o.signal)),r.readable}pipeTo(e,t={}){if(!N(this))return d(hr("pipeTo"));if(void 0===e)return d("Parameter 1 is required in 'pipeTo'.");if(!H(e))return d(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));let r;try{r=lr(t,"Second parameter");}catch(e){return d(e)}return this.locked?d(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):e.locked?d(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):xt(this,e,r.preventClose,r.preventAbort,r.preventCancel,r.signal)}tee(){if(!N(this))throw hr("tee");if(this.locked)throw new TypeError("Cannot tee a stream that already has a reader");return Vt(this)}values(e){if(!N(this))throw hr("values");return function(e,t){const r=e.getReader(),o=new Z(r,t),n=Object.create(ee);return n._asyncIteratorImpl=o,n}(this,function(e,t){L(e,t);const r=null==e?void 0:e.preventCancel;return {preventCancel:Boolean(r)}}(e,"First parameter").preventCancel)}}function ur(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")&&e instanceof ReadableStream)}function cr(e){return void 0!==e._reader}function dr(e,r){if(e._disturbed=!0,"closed"===e._state)return c(void 0);if("errored"===e._state)return d(e._storedError);fr(e);const o=e._reader;void 0!==o&&Ae(o)&&(o._readIntoRequests.forEach((e=>{e._closeSteps(void 0);})),o._readIntoRequests=new S);return p(e._readableStreamController[B](r),t)}function fr(e){e._state="closed";const t=e._reader;void 0!==t&&(W(t),J(t)&&(t._readRequests.forEach((e=>{e._closeSteps();})),t._readRequests=new S));}function br(e,t){e._state="errored",e._storedError=t;const r=e._reader;void 0!==r&&(P(r,t),J(r)?(r._readRequests.forEach((e=>{e._errorSteps(t);})),r._readRequests=new S):(r._readIntoRequests.forEach((e=>{e._errorSteps(t);})),r._readIntoRequests=new S));}function hr(e){return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`)}function _r(e,t){L(e,t);const r=null==e?void 0:e.highWaterMark;return $(r,"highWaterMark","QueuingStrategyInit"),{highWaterMark:M(r)}}Object.defineProperties(ReadableStream.prototype,{cancel:{enumerable:!0},getReader:{enumerable:!0},pipeThrough:{enumerable:!0},pipeTo:{enumerable:!0},tee:{enumerable:!0},values:{enumerable:!0},locked:{enumerable:!0}}),n(ReadableStream.prototype.cancel,"cancel"),n(ReadableStream.prototype.getReader,"getReader"),n(ReadableStream.prototype.pipeThrough,"pipeThrough"),n(ReadableStream.prototype.pipeTo,"pipeTo"),n(ReadableStream.prototype.tee,"tee"),n(ReadableStream.prototype.values,"values"),"symbol"==typeof e.toStringTag&&Object.defineProperty(ReadableStream.prototype,e.toStringTag,{value:"ReadableStream",configurable:!0}),"symbol"==typeof e.asyncIterator&&Object.defineProperty(ReadableStream.prototype,e.asyncIterator,{value:ReadableStream.prototype.values,writable:!0,configurable:!0});const pr=e=>e.byteLength;n(pr,"size");class ByteLengthQueuingStrategy{constructor(e){D(e,1,"ByteLengthQueuingStrategy"),e=_r(e,"First parameter"),this._byteLengthQueuingStrategyHighWaterMark=e.highWaterMark;}get highWaterMark(){if(!yr(this))throw mr("highWaterMark");return this._byteLengthQueuingStrategyHighWaterMark}get size(){if(!yr(this))throw mr("size");return pr}}function mr(e){return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`)}function yr(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_byteLengthQueuingStrategyHighWaterMark")&&e instanceof ByteLengthQueuingStrategy)}Object.defineProperties(ByteLengthQueuingStrategy.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),"symbol"==typeof e.toStringTag&&Object.defineProperty(ByteLengthQueuingStrategy.prototype,e.toStringTag,{value:"ByteLengthQueuingStrategy",configurable:!0});const gr=()=>1;n(gr,"size");class CountQueuingStrategy{constructor(e){D(e,1,"CountQueuingStrategy"),e=_r(e,"First parameter"),this._countQueuingStrategyHighWaterMark=e.highWaterMark;}get highWaterMark(){if(!Sr(this))throw wr("highWaterMark");return this._countQueuingStrategyHighWaterMark}get size(){if(!Sr(this))throw wr("size");return gr}}function wr(e){return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`)}function Sr(e){return !!r$2(e)&&(!!Object.prototype.hasOwnProperty.call(e,"_countQueuingStrategyHighWaterMark")&&e instanceof CountQueuingStrategy)}Object.defineProperties(CountQueuingStrategy.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),"symbol"==typeof e.toStringTag&&Object.defineProperty(CountQueuingStrategy.prototype,e.toStringTag,{value:"CountQueuingStrategy",configurable:!0});

    /**
     * Validates if passed object is either browser's ReadableStream
     * or Node's Readable.
     *
     * @param entry
     */

    function isReadable(entry) {
      return isReadableStream(entry) || isNodeReadable(entry);
    }
    function isReadableStream(entry) {
      if (!isStrictlyObject(entry)) {
        return false;
      }

      const browserReadable = entry;

      if (typeof browserReadable.getReader === 'function' && browserReadable.locked !== undefined && typeof browserReadable.cancel === 'function' && typeof browserReadable.pipeTo === 'function' && typeof browserReadable.pipeThrough === 'function') {
        return true;
      }

      return false;
    }
    function isNodeReadable(entry) {
      if (!isStrictlyObject(entry)) {
        return false;
      }

      const nodeReadable = entry;

      if (typeof nodeReadable.pipe === 'function' && nodeReadable.readable && typeof nodeReadable._read === 'function') {
        return true;
      }

      return false;
    }
    /**
     * Function that converts Node's Readable into WHATWG ReadableStream
     *
     * Taken over from https://github.com/gwicke/node-web-streams/blob/master/lib/conversions.js
     * Because it uses forked web-streams-polyfill that are outdated.
     *
     * @author https://github.com/gwicke
     * @licence Apache License 2.0 https://github.com/gwicke/node-web-streams/blob/master/LICENSE
     * @param nodeStream
     */

    function readableNodeToWeb(nodeStream) {
      return new ReadableStream({
        start(controller) {
          nodeStream.pause();
          nodeStream.on('data', chunk => {
            if (Buffer.isBuffer(chunk)) {
              controller.enqueue(new Uint8Array(chunk.buffer));
            } else {
              controller.enqueue(chunk);
            }

            nodeStream.pause();
          });
          nodeStream.on('end', () => controller.close());
          nodeStream.on('error', e => controller.error(e));
        },

        pull() {
          nodeStream.resume();
        },

        cancel() {
          nodeStream.pause();
        }

      });
    }
    function normalizeToReadableStream(stream) {
      if (isNodeReadable(stream)) {
        return readableNodeToWeb(stream);
      } else if (isReadableStream(stream)) {
        return stream;
      }

      throw new TypeError('Passed stream is not Node Readable nor ReadableStream!');
    }

    /**
     * Function that deep merges objects
     *
     * @copyright https://github.com/sindresorhus/ky/blob/b3c9e88fa49d50150dbb6e6b771b4af56cb40c98/source/utils/merge.ts
     * @licence MIT
     * @param sources
     */

    function deepMerge(...sources) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let returnValue = {};

      for (const source of sources) {
        if (Array.isArray(source)) {
          if (!Array.isArray(returnValue)) {
            returnValue = [];
          }

          returnValue = [...returnValue, ...source];
        } else if (isObject(source)) {
          // eslint-disable-next-line prefer-const
          for (let [key, value] of Object.entries(source)) {
            if (isObject(value) && key in returnValue) {
              value = deepMerge(returnValue[key], value);
            }

            returnValue = Object.assign(Object.assign({}, returnValue), {
              [key]: value
            });
          }
        }
      }

      return returnValue;
    }

    var __awaiter$i = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    var __rest = undefined && undefined.__rest || function (s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    };
    const DEFAULT_KY_CONFIG = {
      headers: {
        accept: 'application/json, text/plain, */*',
        'user-agent': `bee-js`
      }
    };

    function isHttpError(e) {
      return isObject(e) && typeof e.response !== 'undefined';
    }

    function isHttpRequestError(e) {
      return isObject(e) && typeof e.request !== 'undefined';
    }

    function headersToObject(header) {
      return [...header.entries()].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
      }, {});
    }

    function wrapRequest(request) {
      return {
        url: request.url,
        method: request.method.toUpperCase(),
        headers: headersToObject(request.headers)
      };
    }

    function wrapRequestClosure(cb) {
      return request => __awaiter$i(this, void 0, void 0, function* () {
        yield cb(wrapRequest(request));
      });
    }
    function wrapResponseClosure(cb) {
      return (request, options, response) => __awaiter$i(this, void 0, void 0, function* () {
        yield cb({
          headers: headersToObject(response.headers),
          status: response.status,
          statusText: response.statusText,
          request: wrapRequest(request)
        });
      });
    }
    /**
     * Filters out entries that has undefined value from headers object.
     * Modifies the original object!
     *
     * @param obj
     */
    // eslint-disable-next-line @typescript-eslint/ban-types

    function filterHeaders(obj) {
      if (obj === undefined) {
        return undefined;
      }
      const typedObj = obj;

      for (const key in typedObj) {
        if (typedObj[key] === undefined) {
          delete typedObj[key];
        }
      }

      if (Object.keys(typedObj).length === 0) {
        return undefined;
      }

      return typedObj;
    }
    /**
     * Main utility function to make HTTP requests.
     * @param ky
     * @param config
     */

    function http(ky, config) {
      return __awaiter$i(this, void 0, void 0, function* () {
        try {
          const {
            path,
            responseType
          } = config,
                kyConfig = __rest(config, ["path", "responseType"]);

          const response = yield ky(path, Object.assign(Object.assign({}, kyConfig), {
            searchParams: filterHeaders(kyConfig.searchParams)
          }));

          switch (responseType) {
            case 'stream':
              if (!response.body) {
                throw new BeeError('Response was expected to get data but did not get any!');
              }

              response.data = normalizeToReadableStream(response.body);
              break;

            case 'arraybuffer':
              response.data = yield response.arrayBuffer();
              break;

            case 'json':
              try {
                response.data = yield response.json();
              } catch (e) {
                throw new BeeNotAJsonError();
              }

              break;

            default:
              break;
            // If responseType is not set, then no data are expected
          }

          return response;
        } catch (e) {
          // Passthrough thrown errors
          if (e instanceof BeeNotAJsonError) {
            throw e;
          }

          if (isHttpError(e)) {
            let message; // We store the response body here as it can be read only once in Response's lifecycle so to make it exposed
            // to the user in the BeeResponseError, for further analysis.

            const body = yield e.response.text();

            try {
              // The response can be Bee's JSON with structure `{code, message}` lets try to parse it
              message = JSON.parse(body).message;
            } catch (e) {}

            if (message) {
              throw new BeeResponseError(e.response.status, e.response, body, config, `${e.response.statusText}: ${message}`);
            } else {
              throw new BeeResponseError(e.response.status, e.response, body, config, e.response.statusText);
            }
          } else if (isHttpRequestError(e)) {
            throw new BeeRequestError(e.message, config);
          } else {
            throw new BeeError(e.message);
          }
        }
      });
    }
    function makeDefaultKy(kyConfig) {
      return kyFactory.create(deepMerge(DEFAULT_KY_CONFIG, kyConfig));
    }

    var __awaiter$h = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    /**
     * Validates input and converts to Uint8Array
     *
     * @param data any string, ArrayBuffer or Uint8Array
     */

    function prepareData(data) {
      return __awaiter$h(this, void 0, void 0, function* () {
        if (typeof data === 'string') return new Blob([data], {
          type: 'text/plain'
        });

        if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
          return new Blob([data], {
            type: 'application/octet-stream'
          });
        }

        if (data instanceof Blob) {
          return data;
        } // Currently it is not possible to stream requests from browsers
        // there are already first experiments on this field (Chromium)
        // but till it is fully implemented across browsers-land we have to
        // buffer the data before sending the requests.


        if (isNodeReadable(data)) {
          return new Promise(resolve => {
            const buffers = [];
            data.on('data', d => {
              buffers.push(d);
            });
            data.on('end', () => {
              resolve(new Blob(buffers, {
                type: 'application/octet-stream'
              }));
            });
          });
        }

        if (isReadableStream(data)) {
          return new Promise(resolve => __awaiter$h(this, void 0, void 0, function* () {
            const reader = data.getReader();
            const buffers = [];
            let done, value;

            do {
              ({
                done,
                value
              } = yield reader.read());

              if (!done) {
                buffers.push(value);
              }
            } while (!done);

            resolve(new Blob(buffers, {
              type: 'application/octet-stream'
            }));
          }));
        }

        throw new TypeError('unknown data type');
      });
    }
    function prepareWebsocketData(data) {
      return __awaiter$h(this, void 0, void 0, function* () {
        if (typeof data === 'string') return new TextEncoder().encode(data);
        if (data instanceof ArrayBuffer) return new Uint8Array(data);
        if (data instanceof Blob) return new Uint8Array(yield new Response(data).arrayBuffer());
        throw new TypeError('unknown websocket data type');
      });
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*
     * tar-js
     * MIT (c) 2011 T. Jameson Little
     */

    var utils$1 = createCommonjsModule(function (module) {
    (function () {

    	var lookup = [
    			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    			'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    			'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    			'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    			'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    			'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    			'w', 'x', 'y', 'z', '0', '1', '2', '3',
    			'4', '5', '6', '7', '8', '9', '+', '/'
    		];
    	function clean(length) {
    		var i, buffer = new Uint8Array(length);
    		for (i = 0; i < length; i += 1) {
    			buffer[i] = 0;
    		}
    		return buffer;
    	}

    	function extend(orig, length, addLength, multipleOf) {
    		var newSize = length + addLength,
    			buffer = clean((parseInt(newSize / multipleOf) + 1) * multipleOf);

    		buffer.set(orig);

    		return buffer;
    	}

    	function pad(num, bytes, base) {
    		num = num.toString(base || 8);
    		return "000000000000".substr(num.length + 12 - bytes) + num;
    	}	
    	
    	function stringToUint8 (input, out, offset) {
    		var i, length;

    		out = out || clean(input.length);

    		offset = offset || 0;
    		for (i = 0, length = input.length; i < length; i += 1) {
    			out[offset] = input.charCodeAt(i);
    			offset += 1;
    		}

    		return out;
    	}

    	function uint8ToBase64(uint8) {
    		var i,
    			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
    			output = "",
    			temp, length;

    		function tripletToBase64 (num) {
    			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    		}
    		// go through the array every three bytes, we'll deal with trailing stuff later
    		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
    			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    			output += tripletToBase64(temp);
    		}

    		// this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
    		switch (output.length % 4) {
    			case 1:
    				output += '=';
    				break;
    			case 2:
    				output += '==';
    				break;
    		}

    		return output;
    	}

    	function base64ToUint8(input) {
    		var base64 = input.match(/^([^=]+)/)[1],
    			extraBytes = input.match(/(=*)$/)[1].length,
    			i = 0, length = base64.length, temp, offset = 0,
    			ret = clean(base64.length * .75 + extraBytes);

    		while (i < length) {
    			temp = 0;

    			temp |= lookup.indexOf(base64.charAt(i) || 'A') << 18;
    			i += 1;
    			temp |= lookup.indexOf(base64.charAt(i) || 'A') << 12;
    			i += 1;
    			temp |= lookup.indexOf(base64.charAt(i) || 'A') << 6;
    			i += 1;
    			temp |= lookup.indexOf(base64.charAt(i) || 'A');
    			i += 1;

    			ret[offset] = temp >> 16 & 0xFF;
    			offset += 1;
    			ret[offset] = temp >> 8 & 0xFF;
    			offset += 1;
    			ret[offset] = temp & 0xFF;
    			offset += 1;
    		}

    		return ret;
    	}

    	module.exports.clean = clean;
    	module.exports.pad = pad;
    	module.exports.extend = extend;
    	module.exports.stringToUint8 = stringToUint8;
    	module.exports.uint8ToBase64 = uint8ToBase64;
    	module.exports.base64ToUint8 = base64ToUint8;
    }());
    });

    /*
     * tar-js
     * MIT (c) 2011 T. Jameson Little
     */

    var header = createCommonjsModule(function (module) {
    (function () {
    	
    /*
    struct posix_header {             // byte offset
    	char name[100];               //   0
    	char mode[8];                 // 100
    	char uid[8];                  // 108
    	char gid[8];                  // 116
    	char size[12];                // 124
    	char mtime[12];               // 136
    	char chksum[8];               // 148
    	char typeflag;                // 156
    	char linkname[100];           // 157
    	char magic[6];                // 257
    	char version[2];              // 263
    	char uname[32];               // 265
    	char gname[32];               // 297
    	char devmajor[8];             // 329
    	char devminor[8];             // 337
    	char prefix[155];             // 345
                                      // 500
    };
    */

    	var utils = utils$1,
    		headerFormat;
    	
    	headerFormat = [
    		{
    			'field': 'fileName',
    			'length': 100
    		},
    		{
    			'field': 'fileMode',
    			'length': 8
    		},
    		{
    			'field': 'uid',
    			'length': 8
    		},
    		{
    			'field': 'gid',
    			'length': 8
    		},
    		{
    			'field': 'fileSize',
    			'length': 12
    		},
    		{
    			'field': 'mtime',
    			'length': 12
    		},
    		{
    			'field': 'checksum',
    			'length': 8
    		},
    		{
    			'field': 'type',
    			'length': 1
    		},
    		{
    			'field': 'linkName',
    			'length': 100
    		},
    		{
    			'field': 'ustar',
    			'length': 8
    		},
    		{
    			'field': 'owner',
    			'length': 32
    		},
    		{
    			'field': 'group',
    			'length': 32
    		},
    		{
    			'field': 'majorNumber',
    			'length': 8
    		},
    		{
    			'field': 'minorNumber',
    			'length': 8
    		},
    		{
    			'field': 'filenamePrefix',
    			'length': 155
    		},
    		{
    			'field': 'padding',
    			'length': 12
    		}
    	];

    	function formatHeader(data, cb) {
    		var buffer = utils.clean(512),
    			offset = 0;

    		headerFormat.forEach(function (value) {
    			var str = data[value.field] || "",
    				i, length;

    			for (i = 0, length = str.length; i < length; i += 1) {
    				buffer[offset] = str.charCodeAt(i);
    				offset += 1;
    			}

    			offset += value.length - i; // space it out with nulls
    		});

    		if (typeof cb === 'function') {
    			return cb(buffer, offset);
    		}
    		return buffer;
    	}
    	
    	module.exports.structure = headerFormat;
    	module.exports.format = formatHeader;
    }());
    });

    /*
     * tar-js
     * MIT (c) 2011 T. Jameson Little
     */

    var tar = createCommonjsModule(function (module) {
    (function () {

    	var header$1 = header,
    		utils = utils$1,
    		recordSize = 512,
    		blockSize;
    	
    	function Tar(recordsPerBlock) {
    		this.written = 0;
    		blockSize = (recordsPerBlock || 20) * recordSize;
    		this.out = utils.clean(blockSize);
    	}

    	Tar.prototype.append = function (filepath, input, opts, callback) {
    		var data,
    			checksum,
    			mode,
    			mtime,
    			uid,
    			gid,
    			headerArr;

    		if (typeof input === 'string') {
    			input = utils.stringToUint8(input);
    		} else if (input.constructor !== Uint8Array.prototype.constructor) {
    			throw 'Invalid input type. You gave me: ' + input.constructor.toString().match(/function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/)[1];
    		}

    		if (typeof opts === 'function') {
    			callback = opts;
    			opts = {};
    		}

    		opts = opts || {};

    		mode = opts.mode || parseInt('777', 8) & 0xfff;
    		mtime = opts.mtime || Math.floor(+new Date() / 1000);
    		uid = opts.uid || 0;
    		gid = opts.gid || 0;

    		data = {
    			fileName: filepath,
    			fileMode: utils.pad(mode, 7),
    			uid: utils.pad(uid, 7),
    			gid: utils.pad(gid, 7),
    			fileSize: utils.pad(input.length, 11),
    			mtime: utils.pad(mtime, 11),
    			checksum: '        ',
    			type: '0', // just a file
    			ustar: 'ustar  ',
    			owner: opts.owner || '',
    			group: opts.group || ''
    		};

    		// calculate the checksum
    		checksum = 0;
    		Object.keys(data).forEach(function (key) {
    			var i, value = data[key], length;

    			for (i = 0, length = value.length; i < length; i += 1) {
    				checksum += value.charCodeAt(i);
    			}
    		});

    		data.checksum = utils.pad(checksum, 6) + "\u0000 ";

    		headerArr = header$1.format(data);

    		this.out.set(headerArr, this.written);

    		this.written += headerArr.length;

    		// If there is not enough space in this.out, we need to expand it to
    		// fit the new input.
    		if (this.written + input.length > this.out.length) {
    			this.out = utils.extend(this.out, this.written, input.length, blockSize);
    		}

    		this.out.set(input, this.written);

    		// to the nearest multiple of recordSize
    		this.written += input.length + (recordSize - (input.length % recordSize || recordSize));

    		// make sure there's at least 2 empty records worth of extra space
    		if (this.out.length - this.written < recordSize * 2) {
    			this.out = utils.extend(this.out, this.written, recordSize * 2, blockSize);
    		}

    		if (typeof callback === 'function') {
    			callback(this.out);
    		}

    		return this.out;
    	};

    	Tar.prototype.clear = function () {
    		this.written = 0;
    		this.out = utils.clean(blockSize);
    	};

      Tar.utils = utils;

    	Tar.stringToUint8 = utils.stringToUint8;
    	Tar.uint8ToBase64 = utils.uint8ToBase64;
      Tar.base64ToUint8 = utils.base64ToUint8;
    	
    	module.exports = Tar;
    }());
    });

    // object that `tar.append` accepts as path

    function fixUnicodePath(path) {
      const codes = new TextEncoder().encode(path);
      return {
        length: codes.length,
        charCodeAt: index => codes[index]
      };
    }

    function makeTar(data) {
      const tar$1 = new tar();

      for (const entry of data) {
        const path = fixUnicodePath(entry.path);
        tar$1.append(path, entry.data);
      }

      return tar$1.out;
    }

    var __awaiter$g = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    function isCollection(data) {
      if (!Array.isArray(data)) {
        return false;
      }

      return data.every(entry => typeof entry === 'object' && entry.data && entry.path && isUint8Array(entry.data));
    }
    function assertCollection(data) {
      if (!isCollection(data)) {
        throw new BeeArgumentError('invalid collection', data);
      }
    }

    function makeFilePath(file) {
      if (file.webkitRelativePath && file.webkitRelativePath !== '') {
        return file.webkitRelativePath.replace(/.*?\//i, '');
      }

      if (file.name) {
        return file.name;
      }

      throw new TypeError('file is not valid File object');
    }

    function makeCollectionFromFileList(fileList) {
      return __awaiter$g(this, void 0, void 0, function* () {
        const collection = [];

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];

          if (file) {
            collection.push({
              path: makeFilePath(file),
              data: new Uint8Array(yield fileArrayBuffer(file))
            });
          }
        }

        return collection;
      });
    }

    var __awaiter$f = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const bzzEndpoint = 'bzz';

    function extractFileUploadHeaders(postageBatchId, options) {
      const headers = extractUploadHeaders(postageBatchId, options);
      if (options === null || options === void 0 ? void 0 : options.size) headers['content-length'] = String(options.size);
      if (options === null || options === void 0 ? void 0 : options.contentType) headers['content-type'] = options.contentType;
      return headers;
    }
    /**
     * Upload single file
     *
     * @param ky
     * @param data Files data
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param name Name that will be attached to the uploaded file. Wraps the data into manifest with set index document.
     * @param options
     */


    function uploadFile$1(ky, data, postageBatchId, name, options) {
      return __awaiter$f(this, void 0, void 0, function* () {
        if (isReadable(data) && !(options === null || options === void 0 ? void 0 : options.contentType)) {
          if (!options) options = {};
          options.contentType = 'application/octet-stream';
        }

        const response = yield http(ky, {
          method: 'post',
          path: bzzEndpoint,
          body: yield prepareData(data),
          headers: Object.assign({}, extractFileUploadHeaders(postageBatchId, options)),
          searchParams: {
            name
          },
          responseType: 'json'
        });
        return {
          reference: response.data.reference,
          tagUid: makeTagUid(response.headers.get('swarm-tag'))
        };
      });
    }
    /**
     * Download single file as a buffer
     *
     * @param ky Ky instance for given Bee class instance
     * @param hash Bee file or collection hash
     * @param path If hash is collection then this defines path to a single file in the collection
     */

    function downloadFile$1(ky, hash, path = '') {
      return __awaiter$f(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'GET',
          responseType: 'arraybuffer',
          path: `${bzzEndpoint}/${hash}/${path}`
        });
        const file = Object.assign(Object.assign({}, readFileHeaders(response.headers)), {
          data: wrapBytesWithHelpers(new Uint8Array(response.data))
        });
        return file;
      });
    }
    /**
     * Download single file as a readable stream
     *
     * @param ky Ky instance for given Bee class instance
     * @param hash Bee file or collection hash
     * @param path If hash is collection then this defines path to a single file in the collection
     */

    function downloadFileReadable(ky, hash, path = '') {
      return __awaiter$f(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'GET',
          responseType: 'stream',
          path: `${bzzEndpoint}/${hash}/${path}`
        });
        const file = Object.assign(Object.assign({}, readFileHeaders(response.headers)), {
          data: response.data
        });
        return file;
      });
    }

    function extractCollectionUploadHeaders(postageBatchId, options) {
      const headers = extractUploadHeaders(postageBatchId, options);
      if (options === null || options === void 0 ? void 0 : options.indexDocument) headers['swarm-index-document'] = options.indexDocument;
      if (options === null || options === void 0 ? void 0 : options.errorDocument) headers['swarm-error-document'] = options.errorDocument;
      return headers;
    }
    /**
     * Upload collection
     * @param ky Ky instance for given Bee class instance
     * @param collection Collection of Uint8Array buffers to upload
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param options
     */


    function uploadCollection(ky, collection, postageBatchId, options) {
      return __awaiter$f(this, void 0, void 0, function* () {
        assertCollection(collection);
        const tarData = makeTar(collection);
        const response = yield http(ky, {
          method: 'post',
          path: bzzEndpoint,
          body: tarData,
          responseType: 'json',
          headers: Object.assign({
            'content-type': 'application/x-tar',
            'swarm-collection': 'true'
          }, extractCollectionUploadHeaders(postageBatchId, options))
        });
        return {
          reference: response.data.reference,
          tagUid: makeTagUid(response.headers.get('swarm-tag'))
        };
      });
    }

    var __awaiter$e = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const stewardshipEndpoint = 'stewardship';
    /**
     * Reupload locally pinned data
     * @param ky Ky instance
     * @param reference
     * @param options
     * @throws BeeResponseError if not locally pinned or invalid data
     */

    function reupload(ky, reference) {
      return __awaiter$e(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'put',
          path: `${stewardshipEndpoint}/${reference}`
        });
      });
    }
    function isRetrievable(ky, reference) {
      return __awaiter$e(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'get',
          responseType: 'json',
          path: `${stewardshipEndpoint}/${reference}`
        });
        return response.data.isRetrievable;
      });
    }

    var __awaiter$d = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const endpoint$3 = 'tags';
    /**
     * Create new tag on the Bee node
     *
     * @param url Bee tag URL
     */

    function createTag(ky) {
      return __awaiter$d(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'post',
          path: endpoint$3,
          responseType: 'json'
        });
        return response.data;
      });
    }
    /**
     * Retrieve tag information from Bee node
     *
     * @param url Bee tag URL
     * @param uid UID of tag to be retrieved
     */

    function retrieveTag(ky, uid) {
      return __awaiter$d(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          path: `${endpoint$3}/${uid}`,
          responseType: 'json'
        });
        return response.data;
      });
    }
    /**
     * Get limited listing of all tags.
     *
     * @param url
     * @param offset
     * @param limit
     */

    function getAllTags(ky, offset, limit) {
      return __awaiter$d(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          path: `${endpoint$3}`,
          searchParams: {
            offset,
            limit
          },
          responseType: 'json'
        });
        return response.data.tags;
      });
    }
    /**
     * Removes tag from the Bee node.
     * @param url
     * @param uid
     */

    function deleteTag(ky, uid) {
      return __awaiter$d(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'delete',
          path: `${endpoint$3}/${uid}`
        });
      });
    }
    /**
     * Updates tag
     * @param url
     * @param uid
     * @param reference
     */

    function updateTag(ky, uid, reference) {
      return __awaiter$d(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'patch',
          path: `${endpoint$3}/${uid}`,
          json: {
            reference
          }
        });
      });
    }

    var __awaiter$c = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const PINNING_ENDPOINT = 'pins';
    /**
     * Pin data with given reference
     *
     * @param ky Ky instance for given Bee class instance
     * @param reference Bee data reference
     */

    function pin(ky, reference) {
      return __awaiter$c(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'post',
          responseType: 'json',
          path: `${PINNING_ENDPOINT}/${reference}`
        });
      });
    }
    /**
     * Unpin data with given reference
     *
     * @param ky Ky instance for given Bee class instance
     * @param reference Bee data reference
     */

    function unpin(ky, reference) {
      return __awaiter$c(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'delete',
          responseType: 'json',
          path: `${PINNING_ENDPOINT}/${reference}`
        });
      });
    }
    /**
     * Get pin status for specific address.
     *
     * @param ky Ky instance
     * @param reference
     * @throws Error if given address is not pinned
     */

    function getPin(ky, reference) {
      return __awaiter$c(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'get',
          responseType: 'json',
          path: `${PINNING_ENDPOINT}/${reference}`
        });
        return response.data;
      });
    }
    /**
     * Get list of all pins
     *
     * @param ky Ky instance
     */

    function getAllPins(ky) {
      return __awaiter$c(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'get',
          responseType: 'json',
          path: `${PINNING_ENDPOINT}`
        });
        const result = response.data.references;

        if (result === null) {
          return [];
        }

        return result;
      });
    }

    var __awaiter$b = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const endpoint$2 = 'bytes';
    /**
     * Upload data to a Bee node
     *
     * @param ky              Ky instance
     * @param data            Data to be uploaded
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param options         Additional options like tag, encryption, pinning
     */

    function upload$2(ky, data, postageBatchId, options) {
      return __awaiter$b(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          path: endpoint$2,
          method: 'post',
          responseType: 'json',
          body: yield prepareData(data),
          headers: Object.assign({
            'content-type': 'application/octet-stream'
          }, extractUploadHeaders(postageBatchId, options))
        });
        return {
          reference: response.data.reference,
          tagUid: makeTagUid(response.headers.get('swarm-tag'))
        };
      });
    }
    /**
     * Download data as a byte array
     *
     * @param ky
     * @param hash Bee content reference
     */

    function download$1(ky, hash) {
      return __awaiter$b(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          responseType: 'arraybuffer',
          path: `${endpoint$2}/${hash}`
        });
        return wrapBytesWithHelpers(new Uint8Array(response.data));
      });
    }
    /**
     * Download data as a readable stream
     *
     * @param ky
     * @param hash Bee content reference
     */

    function downloadReadable(ky, hash) {
      return __awaiter$b(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          responseType: 'stream',
          path: `${endpoint$2}/${hash}`
        });
        return response.data;
      });
    }

    var __awaiter$a = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const endpoint$1 = 'chunks';
    /**
     * Upload chunk to a Bee node
     *
     * The chunk data consists of 8 byte span and up to 4096 bytes of payload data.
     * The span stores the length of the payload in uint64 little endian encoding.
     * Upload expects the chuck data to be set accordingly.
     *
     * @param ky Ky instance
     * @param data    Chunk data to be uploaded
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param options Additional options like tag, encryption, pinning
     */

    function upload$1(ky, data, postageBatchId, options) {
      return __awaiter$a(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'post',
          path: `${endpoint$1}`,
          body: data,
          headers: Object.assign({
            'content-type': 'application/octet-stream'
          }, extractUploadHeaders(postageBatchId, options)),
          responseType: 'json'
        });
        return response.data.reference;
      });
    }
    /**
     * Download chunk data as a byte array
     *
     * @param ky Ky instance for given Bee class instance
     * @param hash Bee content reference
     *
     */

    function download(ky, hash) {
      return __awaiter$a(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          responseType: 'arraybuffer',
          path: `${endpoint$1}/${hash}`
        });
        return wrapBytesWithHelpers(new Uint8Array(response.data));
      });
    }

    // https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

    var ws = null;

    if (typeof WebSocket !== 'undefined') {
      ws = WebSocket;
    } else if (typeof MozWebSocket !== 'undefined') {
      ws = MozWebSocket;
    } else if (typeof commonjsGlobal !== 'undefined') {
      ws = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
    } else if (typeof window !== 'undefined') {
      ws = window.WebSocket || window.MozWebSocket;
    } else if (typeof self !== 'undefined') {
      ws = self.WebSocket || self.MozWebSocket;
    }

    var browser = ws;

    var __awaiter$9 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const endpoint = 'pss';
    /**
     * Send to recipient or target with Postal Service for Swarm
     *
     * @param ky Ky instance for given Bee class instance
     * @param topic Topic name
     * @param target Target message address prefix
     * @param data
     * @param postageBatchId Postage BatchId that will be assigned to sent message
     * @param recipient Recipient public key
     *
     */

    function send(ky, topic, target, data, postageBatchId, recipient) {
      return __awaiter$9(this, void 0, void 0, function* () {
        yield http(ky, {
          method: 'post',
          path: `${endpoint}/send/${topic}/${target}`,
          body: yield prepareData(data),
          responseType: 'json',
          searchParams: {
            recipient
          },
          headers: extractUploadHeaders(postageBatchId)
        });
      });
    }
    /**
     * Subscribe for messages on the given topic
     *
     * @param url Bee node URL
     * @param topic Topic name
     */

    function subscribe(url, topic) {
      const wsUrl = url.replace(/^http/i, 'ws');
      return new browser(`${wsUrl}/${endpoint}/subscribe/${topic}`);
    }

    var __awaiter$8 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    /**
     * Ping the base bee URL. If connection was not successful throw error
     *
     * @param ky Ky instance for given Bee class instance
     */

    function checkConnection(ky) {
      return __awaiter$8(this, void 0, void 0, function* () {
        yield http(ky, {
          path: ''
        });
      });
    }

    /**
     * [js-sha3]{@link https://github.com/emn178/js-sha3}
     *
     * @version 0.8.0
     * @author Chen, Yi-Cyuan [emn178@gmail.com]
     * @copyright Chen, Yi-Cyuan 2015-2018
     * @license MIT
     */

    var sha3 = createCommonjsModule(function (module) {
    /*jslint bitwise: true */
    (function () {

      var INPUT_ERROR = 'input is invalid type';
      var FINALIZE_ERROR = 'finalize already called';
      var WINDOW = typeof window === 'object';
      var root = WINDOW ? window : {};
      if (root.JS_SHA3_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === 'object';
      var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
      if (NODE_JS) {
        root = commonjsGlobal;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && 'object' === 'object' && module.exports;
      var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
      var HEX_CHARS = '0123456789abcdef'.split('');
      var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
      var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
      var KECCAK_PADDING = [1, 256, 65536, 16777216];
      var PADDING = [6, 1536, 393216, 100663296];
      var SHIFT = [0, 8, 16, 24];
      var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
        0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
        2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
        2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
        2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
      var BITS = [224, 256, 384, 512];
      var SHAKE_BITS = [128, 256];
      var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
      var CSHAKE_BYTEPAD = {
        '128': 168,
        '256': 136
      };

      if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function (obj) {
          return Object.prototype.toString.call(obj) === '[object Array]';
        };
      }

      if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function (obj) {
          return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }

      var createOutputMethod = function (bits, padding, outputType) {
        return function (message) {
          return new Keccak(bits, padding, bits).update(message)[outputType]();
        };
      };

      var createShakeOutputMethod = function (bits, padding, outputType) {
        return function (message, outputBits) {
          return new Keccak(bits, padding, outputBits).update(message)[outputType]();
        };
      };

      var createCshakeOutputMethod = function (bits, padding, outputType) {
        return function (message, outputBits, n, s) {
          return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
        };
      };

      var createKmacOutputMethod = function (bits, padding, outputType) {
        return function (key, message, outputBits, s) {
          return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
        };
      };

      var createOutputMethods = function (method, createMethod, bits, padding) {
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createMethod(bits, padding, type);
        }
        return method;
      };

      var createMethod = function (bits, padding) {
        var method = createOutputMethod(bits, padding, 'hex');
        method.create = function () {
          return new Keccak(bits, padding, bits);
        };
        method.update = function (message) {
          return method.create().update(message);
        };
        return createOutputMethods(method, createOutputMethod, bits, padding);
      };

      var createShakeMethod = function (bits, padding) {
        var method = createShakeOutputMethod(bits, padding, 'hex');
        method.create = function (outputBits) {
          return new Keccak(bits, padding, outputBits);
        };
        method.update = function (message, outputBits) {
          return method.create(outputBits).update(message);
        };
        return createOutputMethods(method, createShakeOutputMethod, bits, padding);
      };

      var createCshakeMethod = function (bits, padding) {
        var w = CSHAKE_BYTEPAD[bits];
        var method = createCshakeOutputMethod(bits, padding, 'hex');
        method.create = function (outputBits, n, s) {
          if (!n && !s) {
            return methods['shake' + bits].create(outputBits);
          } else {
            return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
          }
        };
        method.update = function (message, outputBits, n, s) {
          return method.create(outputBits, n, s).update(message);
        };
        return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
      };

      var createKmacMethod = function (bits, padding) {
        var w = CSHAKE_BYTEPAD[bits];
        var method = createKmacOutputMethod(bits, padding, 'hex');
        method.create = function (key, outputBits, s) {
          return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
        };
        method.update = function (key, message, outputBits, s) {
          return method.create(key, outputBits, s).update(message);
        };
        return createOutputMethods(method, createKmacOutputMethod, bits, padding);
      };

      var algorithms = [
        { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
        { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
        { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
        { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
        { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
      ];

      var methods = {}, methodNames = [];

      for (var i = 0; i < algorithms.length; ++i) {
        var algorithm = algorithms[i];
        var bits = algorithm.bits;
        for (var j = 0; j < bits.length; ++j) {
          var methodName = algorithm.name + '_' + bits[j];
          methodNames.push(methodName);
          methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
          if (algorithm.name !== 'sha3') {
            var newMethodName = algorithm.name + bits[j];
            methodNames.push(newMethodName);
            methods[newMethodName] = methods[methodName];
          }
        }
      }

      function Keccak(bits, padding, outputBits) {
        this.blocks = [];
        this.s = [];
        this.padding = padding;
        this.outputBits = outputBits;
        this.reset = true;
        this.finalized = false;
        this.block = 0;
        this.start = 0;
        this.blockCount = (1600 - (bits << 1)) >> 5;
        this.byteCount = this.blockCount << 2;
        this.outputBlocks = outputBits >> 5;
        this.extraBytes = (outputBits & 31) >> 3;

        for (var i = 0; i < 50; ++i) {
          this.s[i] = 0;
        }
      }

      Keccak.prototype.update = function (message) {
        if (this.finalized) {
          throw new Error(FINALIZE_ERROR);
        }
        var notString, type = typeof message;
        if (type !== 'string') {
          if (type === 'object') {
            if (message === null) {
              throw new Error(INPUT_ERROR);
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                throw new Error(INPUT_ERROR);
              }
            }
          } else {
            throw new Error(INPUT_ERROR);
          }
          notString = true;
        }
        var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
          blockCount = this.blockCount, index = 0, s = this.s, i, code;

        while (index < length) {
          if (this.reset) {
            this.reset = false;
            blocks[0] = this.block;
            for (i = 1; i < blockCount + 1; ++i) {
              blocks[i] = 0;
            }
          }
          if (notString) {
            for (i = this.start; index < length && i < byteCount; ++index) {
              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < byteCount; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                blocks[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 0x800) {
                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else if (code < 0xd800 || code >= 0xe000) {
                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          if (i >= byteCount) {
            this.start = i - byteCount;
            this.block = blocks[blockCount];
            for (i = 0; i < blockCount; ++i) {
              s[i] ^= blocks[i];
            }
            f(s);
            this.reset = true;
          } else {
            this.start = i;
          }
        }
        return this;
      };

      Keccak.prototype.encode = function (x, right) {
        var o = x & 255, n = 1;
        var bytes = [o];
        x = x >> 8;
        o = x & 255;
        while (o > 0) {
          bytes.unshift(o);
          x = x >> 8;
          o = x & 255;
          ++n;
        }
        if (right) {
          bytes.push(n);
        } else {
          bytes.unshift(n);
        }
        this.update(bytes);
        return bytes.length;
      };

      Keccak.prototype.encodeString = function (str) {
        var notString, type = typeof str;
        if (type !== 'string') {
          if (type === 'object') {
            if (str === null) {
              throw new Error(INPUT_ERROR);
            } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
              str = new Uint8Array(str);
            } else if (!Array.isArray(str)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
                throw new Error(INPUT_ERROR);
              }
            }
          } else {
            throw new Error(INPUT_ERROR);
          }
          notString = true;
        }
        var bytes = 0, length = str.length;
        if (notString) {
          bytes = length;
        } else {
          for (var i = 0; i < str.length; ++i) {
            var code = str.charCodeAt(i);
            if (code < 0x80) {
              bytes += 1;
            } else if (code < 0x800) {
              bytes += 2;
            } else if (code < 0xd800 || code >= 0xe000) {
              bytes += 3;
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
              bytes += 4;
            }
          }
        }
        bytes += this.encode(bytes * 8);
        this.update(str);
        return bytes;
      };

      Keccak.prototype.bytepad = function (strs, w) {
        var bytes = this.encode(w);
        for (var i = 0; i < strs.length; ++i) {
          bytes += this.encodeString(strs[i]);
        }
        var paddingBytes = w - bytes % w;
        var zeros = [];
        zeros.length = paddingBytes;
        this.update(zeros);
        return this;
      };

      Keccak.prototype.finalize = function () {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
        blocks[i >> 2] |= this.padding[i & 3];
        if (this.lastByteIndex === this.byteCount) {
          blocks[0] = blocks[blockCount];
          for (i = 1; i < blockCount + 1; ++i) {
            blocks[i] = 0;
          }
        }
        blocks[blockCount - 1] |= 0x80000000;
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
      };

      Keccak.prototype.toString = Keccak.prototype.hex = function () {
        this.finalize();

        var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
          extraBytes = this.extraBytes, i = 0, j = 0;
        var hex = '', block;
        while (j < outputBlocks) {
          for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            block = s[i];
            hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
              HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
              HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
              HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
          }
          if (j % blockCount === 0) {
            f(s);
            i = 0;
          }
        }
        if (extraBytes) {
          block = s[i];
          hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
          if (extraBytes > 1) {
            hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
          }
          if (extraBytes > 2) {
            hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
          }
        }
        return hex;
      };

      Keccak.prototype.arrayBuffer = function () {
        this.finalize();

        var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
          extraBytes = this.extraBytes, i = 0, j = 0;
        var bytes = this.outputBits >> 3;
        var buffer;
        if (extraBytes) {
          buffer = new ArrayBuffer((outputBlocks + 1) << 2);
        } else {
          buffer = new ArrayBuffer(bytes);
        }
        var array = new Uint32Array(buffer);
        while (j < outputBlocks) {
          for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            array[j] = s[i];
          }
          if (j % blockCount === 0) {
            f(s);
          }
        }
        if (extraBytes) {
          array[i] = s[i];
          buffer = buffer.slice(0, bytes);
        }
        return buffer;
      };

      Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

      Keccak.prototype.digest = Keccak.prototype.array = function () {
        this.finalize();

        var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
          extraBytes = this.extraBytes, i = 0, j = 0;
        var array = [], offset, block;
        while (j < outputBlocks) {
          for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
            offset = j << 2;
            block = s[i];
            array[offset] = block & 0xFF;
            array[offset + 1] = (block >> 8) & 0xFF;
            array[offset + 2] = (block >> 16) & 0xFF;
            array[offset + 3] = (block >> 24) & 0xFF;
          }
          if (j % blockCount === 0) {
            f(s);
          }
        }
        if (extraBytes) {
          offset = j << 2;
          block = s[i];
          array[offset] = block & 0xFF;
          if (extraBytes > 1) {
            array[offset + 1] = (block >> 8) & 0xFF;
          }
          if (extraBytes > 2) {
            array[offset + 2] = (block >> 16) & 0xFF;
          }
        }
        return array;
      };

      function Kmac(bits, padding, outputBits) {
        Keccak.call(this, bits, padding, outputBits);
      }

      Kmac.prototype = new Keccak();

      Kmac.prototype.finalize = function () {
        this.encode(this.outputBits, true);
        return Keccak.prototype.finalize.call(this);
      };

      var f = function (s) {
        var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
          b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
          b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
          b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
        for (n = 0; n < 48; n += 2) {
          c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
          c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
          c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
          c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
          c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
          c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
          c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
          c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
          c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
          c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

          h = c8 ^ ((c2 << 1) | (c3 >>> 31));
          l = c9 ^ ((c3 << 1) | (c2 >>> 31));
          s[0] ^= h;
          s[1] ^= l;
          s[10] ^= h;
          s[11] ^= l;
          s[20] ^= h;
          s[21] ^= l;
          s[30] ^= h;
          s[31] ^= l;
          s[40] ^= h;
          s[41] ^= l;
          h = c0 ^ ((c4 << 1) | (c5 >>> 31));
          l = c1 ^ ((c5 << 1) | (c4 >>> 31));
          s[2] ^= h;
          s[3] ^= l;
          s[12] ^= h;
          s[13] ^= l;
          s[22] ^= h;
          s[23] ^= l;
          s[32] ^= h;
          s[33] ^= l;
          s[42] ^= h;
          s[43] ^= l;
          h = c2 ^ ((c6 << 1) | (c7 >>> 31));
          l = c3 ^ ((c7 << 1) | (c6 >>> 31));
          s[4] ^= h;
          s[5] ^= l;
          s[14] ^= h;
          s[15] ^= l;
          s[24] ^= h;
          s[25] ^= l;
          s[34] ^= h;
          s[35] ^= l;
          s[44] ^= h;
          s[45] ^= l;
          h = c4 ^ ((c8 << 1) | (c9 >>> 31));
          l = c5 ^ ((c9 << 1) | (c8 >>> 31));
          s[6] ^= h;
          s[7] ^= l;
          s[16] ^= h;
          s[17] ^= l;
          s[26] ^= h;
          s[27] ^= l;
          s[36] ^= h;
          s[37] ^= l;
          s[46] ^= h;
          s[47] ^= l;
          h = c6 ^ ((c0 << 1) | (c1 >>> 31));
          l = c7 ^ ((c1 << 1) | (c0 >>> 31));
          s[8] ^= h;
          s[9] ^= l;
          s[18] ^= h;
          s[19] ^= l;
          s[28] ^= h;
          s[29] ^= l;
          s[38] ^= h;
          s[39] ^= l;
          s[48] ^= h;
          s[49] ^= l;

          b0 = s[0];
          b1 = s[1];
          b32 = (s[11] << 4) | (s[10] >>> 28);
          b33 = (s[10] << 4) | (s[11] >>> 28);
          b14 = (s[20] << 3) | (s[21] >>> 29);
          b15 = (s[21] << 3) | (s[20] >>> 29);
          b46 = (s[31] << 9) | (s[30] >>> 23);
          b47 = (s[30] << 9) | (s[31] >>> 23);
          b28 = (s[40] << 18) | (s[41] >>> 14);
          b29 = (s[41] << 18) | (s[40] >>> 14);
          b20 = (s[2] << 1) | (s[3] >>> 31);
          b21 = (s[3] << 1) | (s[2] >>> 31);
          b2 = (s[13] << 12) | (s[12] >>> 20);
          b3 = (s[12] << 12) | (s[13] >>> 20);
          b34 = (s[22] << 10) | (s[23] >>> 22);
          b35 = (s[23] << 10) | (s[22] >>> 22);
          b16 = (s[33] << 13) | (s[32] >>> 19);
          b17 = (s[32] << 13) | (s[33] >>> 19);
          b48 = (s[42] << 2) | (s[43] >>> 30);
          b49 = (s[43] << 2) | (s[42] >>> 30);
          b40 = (s[5] << 30) | (s[4] >>> 2);
          b41 = (s[4] << 30) | (s[5] >>> 2);
          b22 = (s[14] << 6) | (s[15] >>> 26);
          b23 = (s[15] << 6) | (s[14] >>> 26);
          b4 = (s[25] << 11) | (s[24] >>> 21);
          b5 = (s[24] << 11) | (s[25] >>> 21);
          b36 = (s[34] << 15) | (s[35] >>> 17);
          b37 = (s[35] << 15) | (s[34] >>> 17);
          b18 = (s[45] << 29) | (s[44] >>> 3);
          b19 = (s[44] << 29) | (s[45] >>> 3);
          b10 = (s[6] << 28) | (s[7] >>> 4);
          b11 = (s[7] << 28) | (s[6] >>> 4);
          b42 = (s[17] << 23) | (s[16] >>> 9);
          b43 = (s[16] << 23) | (s[17] >>> 9);
          b24 = (s[26] << 25) | (s[27] >>> 7);
          b25 = (s[27] << 25) | (s[26] >>> 7);
          b6 = (s[36] << 21) | (s[37] >>> 11);
          b7 = (s[37] << 21) | (s[36] >>> 11);
          b38 = (s[47] << 24) | (s[46] >>> 8);
          b39 = (s[46] << 24) | (s[47] >>> 8);
          b30 = (s[8] << 27) | (s[9] >>> 5);
          b31 = (s[9] << 27) | (s[8] >>> 5);
          b12 = (s[18] << 20) | (s[19] >>> 12);
          b13 = (s[19] << 20) | (s[18] >>> 12);
          b44 = (s[29] << 7) | (s[28] >>> 25);
          b45 = (s[28] << 7) | (s[29] >>> 25);
          b26 = (s[38] << 8) | (s[39] >>> 24);
          b27 = (s[39] << 8) | (s[38] >>> 24);
          b8 = (s[48] << 14) | (s[49] >>> 18);
          b9 = (s[49] << 14) | (s[48] >>> 18);

          s[0] = b0 ^ (~b2 & b4);
          s[1] = b1 ^ (~b3 & b5);
          s[10] = b10 ^ (~b12 & b14);
          s[11] = b11 ^ (~b13 & b15);
          s[20] = b20 ^ (~b22 & b24);
          s[21] = b21 ^ (~b23 & b25);
          s[30] = b30 ^ (~b32 & b34);
          s[31] = b31 ^ (~b33 & b35);
          s[40] = b40 ^ (~b42 & b44);
          s[41] = b41 ^ (~b43 & b45);
          s[2] = b2 ^ (~b4 & b6);
          s[3] = b3 ^ (~b5 & b7);
          s[12] = b12 ^ (~b14 & b16);
          s[13] = b13 ^ (~b15 & b17);
          s[22] = b22 ^ (~b24 & b26);
          s[23] = b23 ^ (~b25 & b27);
          s[32] = b32 ^ (~b34 & b36);
          s[33] = b33 ^ (~b35 & b37);
          s[42] = b42 ^ (~b44 & b46);
          s[43] = b43 ^ (~b45 & b47);
          s[4] = b4 ^ (~b6 & b8);
          s[5] = b5 ^ (~b7 & b9);
          s[14] = b14 ^ (~b16 & b18);
          s[15] = b15 ^ (~b17 & b19);
          s[24] = b24 ^ (~b26 & b28);
          s[25] = b25 ^ (~b27 & b29);
          s[34] = b34 ^ (~b36 & b38);
          s[35] = b35 ^ (~b37 & b39);
          s[44] = b44 ^ (~b46 & b48);
          s[45] = b45 ^ (~b47 & b49);
          s[6] = b6 ^ (~b8 & b0);
          s[7] = b7 ^ (~b9 & b1);
          s[16] = b16 ^ (~b18 & b10);
          s[17] = b17 ^ (~b19 & b11);
          s[26] = b26 ^ (~b28 & b20);
          s[27] = b27 ^ (~b29 & b21);
          s[36] = b36 ^ (~b38 & b30);
          s[37] = b37 ^ (~b39 & b31);
          s[46] = b46 ^ (~b48 & b40);
          s[47] = b47 ^ (~b49 & b41);
          s[8] = b8 ^ (~b0 & b2);
          s[9] = b9 ^ (~b1 & b3);
          s[18] = b18 ^ (~b10 & b12);
          s[19] = b19 ^ (~b11 & b13);
          s[28] = b28 ^ (~b20 & b22);
          s[29] = b29 ^ (~b21 & b23);
          s[38] = b38 ^ (~b30 & b32);
          s[39] = b39 ^ (~b31 & b33);
          s[48] = b48 ^ (~b40 & b42);
          s[49] = b49 ^ (~b41 & b43);

          s[0] ^= RC[n];
          s[1] ^= RC[n + 1];
        }
      };

      if (COMMON_JS) {
        module.exports = methods;
      } else {
        for (i = 0; i < methodNames.length; ++i) {
          root[methodNames[i]] = methods[methodNames[i]];
        }
      }
    })();
    });

    // For ESM compatibility
    const {
      keccak256: keccak256$1
    } = sha3;
    /**
     * Helper function for calculating the keccak256 hash with
     * correct types.
     *
     * @param messages Any number of messages (strings, byte arrays etc.)
     */

    function keccak256Hash(...messages) {
      const hasher = keccak256$1.create();
      messages.forEach(bytes => hasher.update(bytes));
      return Uint8Array.from(hasher.digest());
    }

    /**
     * Helper function for serialize byte arrays
     *
     * @param arrays Any number of byte array arguments
     */
    function serializeBytes(...arrays) {
      const length = arrays.reduce((prev, curr) => prev + curr.length, 0);
      const buffer = new Uint8Array(length);
      let offset = 0;
      arrays.forEach(arr => {
        buffer.set(arr, offset);
        offset += arr.length;
      });
      return buffer;
    }

    // For ESM compatibility
    const {
      keccak256
    } = sha3;
    const MAX_CHUNK_PAYLOAD_SIZE = 4096;
    const SEGMENT_SIZE = 32;
    const SEGMENT_PAIR_SIZE = 2 * SEGMENT_SIZE;
    const HASH_SIZE = 32;
    /**
     * Calculate a Binary Merkle Tree hash for a chunk
     *
     * The BMT chunk address is the hash of the 8 byte span and the root
     * hash of a binary Merkle tree (BMT) built on the 32-byte segments
     * of the underlying data.
     *
     * If the chunk content is less than 4k, the hash is calculated as
     * if the chunk was padded with all zeros up to 4096 bytes.
     *
     * @param chunkContent Chunk data including span and payload as well
     *
     * @returns the keccak256 hash in a byte array
     */

    function bmtHash(chunkContent) {
      const span = chunkContent.slice(0, 8);
      const payload = chunkContent.slice(8);
      const rootHash = bmtRootHash(payload);
      const chunkHashInput = new Uint8Array([...span, ...rootHash]);
      const chunkHash = keccak256Hash(chunkHashInput);
      return chunkHash;
    }

    function bmtRootHash(payload) {
      if (payload.length > MAX_CHUNK_PAYLOAD_SIZE) {
        throw new BeeArgumentError('invalid data length', payload);
      } // create an input buffer padded with zeros


      let input = new Uint8Array([...payload, ...new Uint8Array(MAX_CHUNK_PAYLOAD_SIZE - payload.length)]);

      while (input.length !== HASH_SIZE) {
        const output = new Uint8Array(input.length / 2); // in each round we hash the segment pairs together

        for (let offset = 0; offset < input.length; offset += SEGMENT_PAIR_SIZE) {
          const hashNumbers = keccak256.array(input.slice(offset, offset + SEGMENT_PAIR_SIZE));
          output.set(hashNumbers, offset / 2);
        }

        input = output;
      }

      return input;
    }

    var name = "elliptic";
    var version = "6.5.4";
    var description = "EC cryptography";
    var main = "lib/elliptic.js";
    var files = [
    	"lib"
    ];
    var scripts = {
    	lint: "eslint lib test",
    	"lint:fix": "npm run lint -- --fix",
    	unit: "istanbul test _mocha --reporter=spec test/index.js",
    	test: "npm run lint && npm run unit",
    	version: "grunt dist && git add dist/"
    };
    var repository = {
    	type: "git",
    	url: "git@github.com:indutny/elliptic"
    };
    var keywords = [
    	"EC",
    	"Elliptic",
    	"curve",
    	"Cryptography"
    ];
    var author = "Fedor Indutny <fedor@indutny.com>";
    var license = "MIT";
    var bugs = {
    	url: "https://github.com/indutny/elliptic/issues"
    };
    var homepage = "https://github.com/indutny/elliptic";
    var devDependencies = {
    	brfs: "^2.0.2",
    	coveralls: "^3.1.0",
    	eslint: "^7.6.0",
    	grunt: "^1.2.1",
    	"grunt-browserify": "^5.3.0",
    	"grunt-cli": "^1.3.2",
    	"grunt-contrib-connect": "^3.0.0",
    	"grunt-contrib-copy": "^1.0.0",
    	"grunt-contrib-uglify": "^5.0.0",
    	"grunt-mocha-istanbul": "^5.0.2",
    	"grunt-saucelabs": "^9.0.1",
    	istanbul: "^0.4.5",
    	mocha: "^8.0.1"
    };
    var dependencies = {
    	"bn.js": "^4.11.9",
    	brorand: "^1.1.0",
    	"hash.js": "^1.0.0",
    	"hmac-drbg": "^1.0.1",
    	inherits: "^2.0.4",
    	"minimalistic-assert": "^1.0.1",
    	"minimalistic-crypto-utils": "^1.0.1"
    };
    var require$$0$1 = {
    	name: name,
    	version: version,
    	description: description,
    	main: main,
    	files: files,
    	scripts: scripts,
    	repository: repository,
    	keywords: keywords,
    	author: author,
    	license: license,
    	bugs: bugs,
    	homepage: homepage,
    	devDependencies: devDependencies,
    	dependencies: dependencies
    };

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    var bn = createCommonjsModule(function (module) {
    (function (module, exports) {

      // Utils
      function assert (val, msg) {
        if (!val) throw new Error(msg || 'Assertion failed');
      }

      // Could use `inherits` module, but don't want to move from single file
      // architecture yet.
      function inherits (ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }

      // BN

      function BN (number, base, endian) {
        if (BN.isBN(number)) {
          return number;
        }

        this.negative = 0;
        this.words = null;
        this.length = 0;

        // Reduction context
        this.red = null;

        if (number !== null) {
          if (base === 'le' || base === 'be') {
            endian = base;
            base = 10;
          }

          this._init(number || 0, base || 10, endian || 'be');
        }
      }
      if (typeof module === 'object') {
        module.exports = BN;
      } else {
        exports.BN = BN;
      }

      BN.BN = BN;
      BN.wordSize = 26;

      var Buffer;
      try {
        if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
          Buffer = window.Buffer;
        } else {
          Buffer = require$$0.Buffer;
        }
      } catch (e) {
      }

      BN.isBN = function isBN (num) {
        if (num instanceof BN) {
          return true;
        }

        return num !== null && typeof num === 'object' &&
          num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
      };

      BN.max = function max (left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
      };

      BN.min = function min (left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
      };

      BN.prototype._init = function init (number, base, endian) {
        if (typeof number === 'number') {
          return this._initNumber(number, base, endian);
        }

        if (typeof number === 'object') {
          return this._initArray(number, base, endian);
        }

        if (base === 'hex') {
          base = 16;
        }
        assert(base === (base | 0) && base >= 2 && base <= 36);

        number = number.toString().replace(/\s+/g, '');
        var start = 0;
        if (number[0] === '-') {
          start++;
          this.negative = 1;
        }

        if (start < number.length) {
          if (base === 16) {
            this._parseHex(number, start, endian);
          } else {
            this._parseBase(number, base, start);
            if (endian === 'le') {
              this._initArray(this.toArray(), base, endian);
            }
          }
        }
      };

      BN.prototype._initNumber = function _initNumber (number, base, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 0x4000000) {
          this.words = [ number & 0x3ffffff ];
          this.length = 1;
        } else if (number < 0x10000000000000) {
          this.words = [
            number & 0x3ffffff,
            (number / 0x4000000) & 0x3ffffff
          ];
          this.length = 2;
        } else {
          assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
          this.words = [
            number & 0x3ffffff,
            (number / 0x4000000) & 0x3ffffff,
            1
          ];
          this.length = 3;
        }

        if (endian !== 'le') return;

        // Reverse the bytes
        this._initArray(this.toArray(), base, endian);
      };

      BN.prototype._initArray = function _initArray (number, base, endian) {
        // Perhaps a Uint8Array
        assert(typeof number.length === 'number');
        if (number.length <= 0) {
          this.words = [ 0 ];
          this.length = 1;
          return this;
        }

        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }

        var j, w;
        var off = 0;
        if (endian === 'be') {
          for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
            w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
            this.words[j] |= (w << off) & 0x3ffffff;
            this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        } else if (endian === 'le') {
          for (i = 0, j = 0; i < number.length; i += 3) {
            w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
            this.words[j] |= (w << off) & 0x3ffffff;
            this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        }
        return this.strip();
      };

      function parseHex4Bits (string, index) {
        var c = string.charCodeAt(index);
        // 'A' - 'F'
        if (c >= 65 && c <= 70) {
          return c - 55;
        // 'a' - 'f'
        } else if (c >= 97 && c <= 102) {
          return c - 87;
        // '0' - '9'
        } else {
          return (c - 48) & 0xf;
        }
      }

      function parseHexByte (string, lowerBound, index) {
        var r = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
          r |= parseHex4Bits(string, index - 1) << 4;
        }
        return r;
      }

      BN.prototype._parseHex = function _parseHex (number, start, endian) {
        // Create possibly bigger array to ensure that it fits the number
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }

        // 24-bits chunks
        var off = 0;
        var j = 0;

        var w;
        if (endian === 'be') {
          for (i = number.length - 1; i >= start; i -= 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 0x3ffffff;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start;
          for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 0x3ffffff;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        }

        this.strip();
      };

      function parseBase (str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);
        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;

          r *= mul;

          // 'a'
          if (c >= 49) {
            r += c - 49 + 0xa;

          // 'A'
          } else if (c >= 17) {
            r += c - 17 + 0xa;

          // '0' - '9'
          } else {
            r += c;
          }
        }
        return r;
      }

      BN.prototype._parseBase = function _parseBase (number, base, start) {
        // Initialize as zero
        this.words = [ 0 ];
        this.length = 1;

        // Find length of limb in base
        for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
          limbLen++;
        }
        limbLen--;
        limbPow = (limbPow / base) | 0;

        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;

        var word = 0;
        for (var i = start; i < end; i += limbLen) {
          word = parseBase(number, i, i + limbLen, base);

          this.imuln(limbPow);
          if (this.words[0] + word < 0x4000000) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }

        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i, number.length, base);

          for (i = 0; i < mod; i++) {
            pow *= base;
          }

          this.imuln(pow);
          if (this.words[0] + word < 0x4000000) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }

        this.strip();
      };

      BN.prototype.copy = function copy (dest) {
        dest.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          dest.words[i] = this.words[i];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };

      BN.prototype.clone = function clone () {
        var r = new BN(null);
        this.copy(r);
        return r;
      };

      BN.prototype._expand = function _expand (size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }
        return this;
      };

      // Remove leading `0` from `this`
      BN.prototype.strip = function strip () {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }
        return this._normSign();
      };

      BN.prototype._normSign = function _normSign () {
        // -0 = 0
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }
        return this;
      };

      BN.prototype.inspect = function inspect () {
        return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
      };

      /*

      var zeros = [];
      var groupSizes = [];
      var groupBases = [];

      var s = '';
      var i = -1;
      while (++i < BN.wordSize) {
        zeros[i] = s;
        s += '0';
      }
      groupSizes[0] = 0;
      groupSizes[1] = 0;
      groupBases[0] = 0;
      groupBases[1] = 0;
      var base = 2 - 1;
      while (++base < 36 + 1) {
        var groupSize = 0;
        var groupBase = 1;
        while (groupBase < (1 << BN.wordSize) / base) {
          groupBase *= base;
          groupSize += 1;
        }
        groupSizes[base] = groupSize;
        groupBases[base] = groupBase;
      }

      */

      var zeros = [
        '',
        '0',
        '00',
        '000',
        '0000',
        '00000',
        '000000',
        '0000000',
        '00000000',
        '000000000',
        '0000000000',
        '00000000000',
        '000000000000',
        '0000000000000',
        '00000000000000',
        '000000000000000',
        '0000000000000000',
        '00000000000000000',
        '000000000000000000',
        '0000000000000000000',
        '00000000000000000000',
        '000000000000000000000',
        '0000000000000000000000',
        '00000000000000000000000',
        '000000000000000000000000',
        '0000000000000000000000000'
      ];

      var groupSizes = [
        0, 0,
        25, 16, 12, 11, 10, 9, 8,
        8, 7, 7, 7, 7, 6, 6,
        6, 6, 6, 6, 6, 5, 5,
        5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5
      ];

      var groupBases = [
        0, 0,
        33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
        43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
        16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
        6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
        24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
      ];

      BN.prototype.toString = function toString (base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;

        var out;
        if (base === 16 || base === 'hex') {
          out = '';
          var off = 0;
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = this.words[i];
            var word = (((w << off) | carry) & 0xffffff).toString(16);
            carry = (w >>> (24 - off)) & 0xffffff;
            if (carry !== 0 || i !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }
            off += 2;
            if (off >= 26) {
              off -= 26;
              i--;
            }
          }
          if (carry !== 0) {
            out = carry.toString(16) + out;
          }
          while (out.length % padding !== 0) {
            out = '0' + out;
          }
          if (this.negative !== 0) {
            out = '-' + out;
          }
          return out;
        }

        if (base === (base | 0) && base >= 2 && base <= 36) {
          // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
          var groupSize = groupSizes[base];
          // var groupBase = Math.pow(base, groupSize);
          var groupBase = groupBases[base];
          out = '';
          var c = this.clone();
          c.negative = 0;
          while (!c.isZero()) {
            var r = c.modn(groupBase).toString(base);
            c = c.idivn(groupBase);

            if (!c.isZero()) {
              out = zeros[groupSize - r.length] + r + out;
            } else {
              out = r + out;
            }
          }
          if (this.isZero()) {
            out = '0' + out;
          }
          while (out.length % padding !== 0) {
            out = '0' + out;
          }
          if (this.negative !== 0) {
            out = '-' + out;
          }
          return out;
        }

        assert(false, 'Base should be between 2 and 36');
      };

      BN.prototype.toNumber = function toNumber () {
        var ret = this.words[0];
        if (this.length === 2) {
          ret += this.words[1] * 0x4000000;
        } else if (this.length === 3 && this.words[2] === 0x01) {
          // NOTE: at this stage it is known that the top bit is set
          ret += 0x10000000000000 + (this.words[1] * 0x4000000);
        } else if (this.length > 2) {
          assert(false, 'Number can only safely store up to 53 bits');
        }
        return (this.negative !== 0) ? -ret : ret;
      };

      BN.prototype.toJSON = function toJSON () {
        return this.toString(16);
      };

      BN.prototype.toBuffer = function toBuffer (endian, length) {
        assert(typeof Buffer !== 'undefined');
        return this.toArrayLike(Buffer, endian, length);
      };

      BN.prototype.toArray = function toArray (endian, length) {
        return this.toArrayLike(Array, endian, length);
      };

      BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, 'byte array longer than desired length');
        assert(reqLength > 0, 'Requested array length <= 0');

        this.strip();
        var littleEndian = endian === 'le';
        var res = new ArrayType(reqLength);

        var b, i;
        var q = this.clone();
        if (!littleEndian) {
          // Assume big-endian
          for (i = 0; i < reqLength - byteLength; i++) {
            res[i] = 0;
          }

          for (i = 0; !q.isZero(); i++) {
            b = q.andln(0xff);
            q.iushrn(8);

            res[reqLength - i - 1] = b;
          }
        } else {
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(0xff);
            q.iushrn(8);

            res[i] = b;
          }

          for (; i < reqLength; i++) {
            res[i] = 0;
          }
        }

        return res;
      };

      if (Math.clz32) {
        BN.prototype._countBits = function _countBits (w) {
          return 32 - Math.clz32(w);
        };
      } else {
        BN.prototype._countBits = function _countBits (w) {
          var t = w;
          var r = 0;
          if (t >= 0x1000) {
            r += 13;
            t >>>= 13;
          }
          if (t >= 0x40) {
            r += 7;
            t >>>= 7;
          }
          if (t >= 0x8) {
            r += 4;
            t >>>= 4;
          }
          if (t >= 0x02) {
            r += 2;
            t >>>= 2;
          }
          return r + t;
        };
      }

      BN.prototype._zeroBits = function _zeroBits (w) {
        // Short-cut
        if (w === 0) return 26;

        var t = w;
        var r = 0;
        if ((t & 0x1fff) === 0) {
          r += 13;
          t >>>= 13;
        }
        if ((t & 0x7f) === 0) {
          r += 7;
          t >>>= 7;
        }
        if ((t & 0xf) === 0) {
          r += 4;
          t >>>= 4;
        }
        if ((t & 0x3) === 0) {
          r += 2;
          t >>>= 2;
        }
        if ((t & 0x1) === 0) {
          r++;
        }
        return r;
      };

      // Return number of used bits in a BN
      BN.prototype.bitLength = function bitLength () {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
      };

      function toBitArray (num) {
        var w = new Array(num.bitLength());

        for (var bit = 0; bit < w.length; bit++) {
          var off = (bit / 26) | 0;
          var wbit = bit % 26;

          w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
        }

        return w;
      }

      // Number of trailing zero bits
      BN.prototype.zeroBits = function zeroBits () {
        if (this.isZero()) return 0;

        var r = 0;
        for (var i = 0; i < this.length; i++) {
          var b = this._zeroBits(this.words[i]);
          r += b;
          if (b !== 26) break;
        }
        return r;
      };

      BN.prototype.byteLength = function byteLength () {
        return Math.ceil(this.bitLength() / 8);
      };

      BN.prototype.toTwos = function toTwos (width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
      };

      BN.prototype.fromTwos = function fromTwos (width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
      };

      BN.prototype.isNeg = function isNeg () {
        return this.negative !== 0;
      };

      // Return negative clone of `this`
      BN.prototype.neg = function neg () {
        return this.clone().ineg();
      };

      BN.prototype.ineg = function ineg () {
        if (!this.isZero()) {
          this.negative ^= 1;
        }

        return this;
      };

      // Or `num` with `this` in-place
      BN.prototype.iuor = function iuor (num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }

        for (var i = 0; i < num.length; i++) {
          this.words[i] = this.words[i] | num.words[i];
        }

        return this.strip();
      };

      BN.prototype.ior = function ior (num) {
        assert((this.negative | num.negative) === 0);
        return this.iuor(num);
      };

      // Or `num` with `this`
      BN.prototype.or = function or (num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
      };

      BN.prototype.uor = function uor (num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
      };

      // And `num` with `this` in-place
      BN.prototype.iuand = function iuand (num) {
        // b = min-length(num, this)
        var b;
        if (this.length > num.length) {
          b = num;
        } else {
          b = this;
        }

        for (var i = 0; i < b.length; i++) {
          this.words[i] = this.words[i] & num.words[i];
        }

        this.length = b.length;

        return this.strip();
      };

      BN.prototype.iand = function iand (num) {
        assert((this.negative | num.negative) === 0);
        return this.iuand(num);
      };

      // And `num` with `this`
      BN.prototype.and = function and (num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
      };

      BN.prototype.uand = function uand (num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
      };

      // Xor `num` with `this` in-place
      BN.prototype.iuxor = function iuxor (num) {
        // a.length > b.length
        var a;
        var b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        for (var i = 0; i < b.length; i++) {
          this.words[i] = a.words[i] ^ b.words[i];
        }

        if (this !== a) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        this.length = a.length;

        return this.strip();
      };

      BN.prototype.ixor = function ixor (num) {
        assert((this.negative | num.negative) === 0);
        return this.iuxor(num);
      };

      // Xor `num` with `this`
      BN.prototype.xor = function xor (num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
      };

      BN.prototype.uxor = function uxor (num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      };

      // Not ``this`` with ``width`` bitwidth
      BN.prototype.inotn = function inotn (width) {
        assert(typeof width === 'number' && width >= 0);

        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;

        // Extend the buffer with leading zeroes
        this._expand(bytesNeeded);

        if (bitsLeft > 0) {
          bytesNeeded--;
        }

        // Handle complete words
        for (var i = 0; i < bytesNeeded; i++) {
          this.words[i] = ~this.words[i] & 0x3ffffff;
        }

        // Handle the residue
        if (bitsLeft > 0) {
          this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
        }

        // And remove leading zeroes
        return this.strip();
      };

      BN.prototype.notn = function notn (width) {
        return this.clone().inotn(width);
      };

      // Set `bit` of `this`
      BN.prototype.setn = function setn (bit, val) {
        assert(typeof bit === 'number' && bit >= 0);

        var off = (bit / 26) | 0;
        var wbit = bit % 26;

        this._expand(off + 1);

        if (val) {
          this.words[off] = this.words[off] | (1 << wbit);
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }

        return this.strip();
      };

      // Add `num` to `this` in-place
      BN.prototype.iadd = function iadd (num) {
        var r;

        // negative + positive
        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r = this.isub(num);
          this.negative ^= 1;
          return this._normSign();

        // positive + negative
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r = this.isub(num);
          num.negative = 1;
          return r._normSign();
        }

        // a.length > b.length
        var a, b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
          this.words[i] = r & 0x3ffffff;
          carry = r >>> 26;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          this.words[i] = r & 0x3ffffff;
          carry = r >>> 26;
        }

        this.length = a.length;
        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++;
        // Copy the rest of the words
        } else if (a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        return this;
      };

      // Add `num` to `this`
      BN.prototype.add = function add (num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }

        if (this.length > num.length) return this.clone().iadd(num);

        return num.clone().iadd(this);
      };

      // Subtract `num` from `this` in-place
      BN.prototype.isub = function isub (num) {
        // this - (-num) = this + num
        if (num.negative !== 0) {
          num.negative = 0;
          var r = this.iadd(num);
          num.negative = 1;
          return r._normSign();

        // -this - num = -(this + num)
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }

        // At this point both numbers are positive
        var cmp = this.cmp(num);

        // Optimization - zeroify
        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }

        // a > b
        var a, b;
        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }

        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 0x3ffffff;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 0x3ffffff;
        }

        // Copy rest of the words
        if (carry === 0 && i < a.length && a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }

        this.length = Math.max(this.length, i);

        if (a !== this) {
          this.negative = 1;
        }

        return this.strip();
      };

      // Subtract `num` from `this`
      BN.prototype.sub = function sub (num) {
        return this.clone().isub(num);
      };

      function smallMulTo (self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = (self.length + num.length) | 0;
        out.length = len;
        len = (len - 1) | 0;

        // Peel one iteration (compiler can't do it, because of code complexity)
        var a = self.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        var carry = (r / 0x4000000) | 0;
        out.words[0] = lo;

        for (var k = 1; k < len; k++) {
          // Sum all words with the same `i + j = k` and accumulate `ncarry`,
          // note that ncarry could be >= 0x3ffffff
          var ncarry = carry >>> 26;
          var rword = carry & 0x3ffffff;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = (k - j) | 0;
            a = self.words[i] | 0;
            b = num.words[j] | 0;
            r = a * b + rword;
            ncarry += (r / 0x4000000) | 0;
            rword = r & 0x3ffffff;
          }
          out.words[k] = rword | 0;
          carry = ncarry | 0;
        }
        if (carry !== 0) {
          out.words[k] = carry | 0;
        } else {
          out.length--;
        }

        return out.strip();
      }

      // TODO(indutny): it may be reasonable to omit it for users who don't need
      // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
      // multiplication (like elliptic secp256k1).
      var comb10MulTo = function comb10MulTo (self, num, out) {
        var a = self.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 0x1fff;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 0x1fff;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 0x1fff;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 0x1fff;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 0x1fff;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 0x1fff;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 0x1fff;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 0x1fff;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 0x1fff;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 0x1fff;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 0x1fff;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 0x1fff;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 0x1fff;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 0x1fff;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 0x1fff;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 0x1fff;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 0x1fff;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 0x1fff;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 0x1fff;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 0x1fff;
        var bh9 = b9 >>> 13;

        out.negative = self.negative ^ num.negative;
        out.length = 19;
        /* k = 0 */
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = (mid + Math.imul(ah0, bl0)) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
        w0 &= 0x3ffffff;
        /* k = 1 */
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = (mid + Math.imul(ah1, bl0)) | 0;
        hi = Math.imul(ah1, bh0);
        lo = (lo + Math.imul(al0, bl1)) | 0;
        mid = (mid + Math.imul(al0, bh1)) | 0;
        mid = (mid + Math.imul(ah0, bl1)) | 0;
        hi = (hi + Math.imul(ah0, bh1)) | 0;
        var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
        w1 &= 0x3ffffff;
        /* k = 2 */
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = (mid + Math.imul(ah2, bl0)) | 0;
        hi = Math.imul(ah2, bh0);
        lo = (lo + Math.imul(al1, bl1)) | 0;
        mid = (mid + Math.imul(al1, bh1)) | 0;
        mid = (mid + Math.imul(ah1, bl1)) | 0;
        hi = (hi + Math.imul(ah1, bh1)) | 0;
        lo = (lo + Math.imul(al0, bl2)) | 0;
        mid = (mid + Math.imul(al0, bh2)) | 0;
        mid = (mid + Math.imul(ah0, bl2)) | 0;
        hi = (hi + Math.imul(ah0, bh2)) | 0;
        var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
        w2 &= 0x3ffffff;
        /* k = 3 */
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = (mid + Math.imul(ah3, bl0)) | 0;
        hi = Math.imul(ah3, bh0);
        lo = (lo + Math.imul(al2, bl1)) | 0;
        mid = (mid + Math.imul(al2, bh1)) | 0;
        mid = (mid + Math.imul(ah2, bl1)) | 0;
        hi = (hi + Math.imul(ah2, bh1)) | 0;
        lo = (lo + Math.imul(al1, bl2)) | 0;
        mid = (mid + Math.imul(al1, bh2)) | 0;
        mid = (mid + Math.imul(ah1, bl2)) | 0;
        hi = (hi + Math.imul(ah1, bh2)) | 0;
        lo = (lo + Math.imul(al0, bl3)) | 0;
        mid = (mid + Math.imul(al0, bh3)) | 0;
        mid = (mid + Math.imul(ah0, bl3)) | 0;
        hi = (hi + Math.imul(ah0, bh3)) | 0;
        var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
        w3 &= 0x3ffffff;
        /* k = 4 */
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = (mid + Math.imul(ah4, bl0)) | 0;
        hi = Math.imul(ah4, bh0);
        lo = (lo + Math.imul(al3, bl1)) | 0;
        mid = (mid + Math.imul(al3, bh1)) | 0;
        mid = (mid + Math.imul(ah3, bl1)) | 0;
        hi = (hi + Math.imul(ah3, bh1)) | 0;
        lo = (lo + Math.imul(al2, bl2)) | 0;
        mid = (mid + Math.imul(al2, bh2)) | 0;
        mid = (mid + Math.imul(ah2, bl2)) | 0;
        hi = (hi + Math.imul(ah2, bh2)) | 0;
        lo = (lo + Math.imul(al1, bl3)) | 0;
        mid = (mid + Math.imul(al1, bh3)) | 0;
        mid = (mid + Math.imul(ah1, bl3)) | 0;
        hi = (hi + Math.imul(ah1, bh3)) | 0;
        lo = (lo + Math.imul(al0, bl4)) | 0;
        mid = (mid + Math.imul(al0, bh4)) | 0;
        mid = (mid + Math.imul(ah0, bl4)) | 0;
        hi = (hi + Math.imul(ah0, bh4)) | 0;
        var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
        w4 &= 0x3ffffff;
        /* k = 5 */
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = (mid + Math.imul(ah5, bl0)) | 0;
        hi = Math.imul(ah5, bh0);
        lo = (lo + Math.imul(al4, bl1)) | 0;
        mid = (mid + Math.imul(al4, bh1)) | 0;
        mid = (mid + Math.imul(ah4, bl1)) | 0;
        hi = (hi + Math.imul(ah4, bh1)) | 0;
        lo = (lo + Math.imul(al3, bl2)) | 0;
        mid = (mid + Math.imul(al3, bh2)) | 0;
        mid = (mid + Math.imul(ah3, bl2)) | 0;
        hi = (hi + Math.imul(ah3, bh2)) | 0;
        lo = (lo + Math.imul(al2, bl3)) | 0;
        mid = (mid + Math.imul(al2, bh3)) | 0;
        mid = (mid + Math.imul(ah2, bl3)) | 0;
        hi = (hi + Math.imul(ah2, bh3)) | 0;
        lo = (lo + Math.imul(al1, bl4)) | 0;
        mid = (mid + Math.imul(al1, bh4)) | 0;
        mid = (mid + Math.imul(ah1, bl4)) | 0;
        hi = (hi + Math.imul(ah1, bh4)) | 0;
        lo = (lo + Math.imul(al0, bl5)) | 0;
        mid = (mid + Math.imul(al0, bh5)) | 0;
        mid = (mid + Math.imul(ah0, bl5)) | 0;
        hi = (hi + Math.imul(ah0, bh5)) | 0;
        var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
        w5 &= 0x3ffffff;
        /* k = 6 */
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = (mid + Math.imul(ah6, bl0)) | 0;
        hi = Math.imul(ah6, bh0);
        lo = (lo + Math.imul(al5, bl1)) | 0;
        mid = (mid + Math.imul(al5, bh1)) | 0;
        mid = (mid + Math.imul(ah5, bl1)) | 0;
        hi = (hi + Math.imul(ah5, bh1)) | 0;
        lo = (lo + Math.imul(al4, bl2)) | 0;
        mid = (mid + Math.imul(al4, bh2)) | 0;
        mid = (mid + Math.imul(ah4, bl2)) | 0;
        hi = (hi + Math.imul(ah4, bh2)) | 0;
        lo = (lo + Math.imul(al3, bl3)) | 0;
        mid = (mid + Math.imul(al3, bh3)) | 0;
        mid = (mid + Math.imul(ah3, bl3)) | 0;
        hi = (hi + Math.imul(ah3, bh3)) | 0;
        lo = (lo + Math.imul(al2, bl4)) | 0;
        mid = (mid + Math.imul(al2, bh4)) | 0;
        mid = (mid + Math.imul(ah2, bl4)) | 0;
        hi = (hi + Math.imul(ah2, bh4)) | 0;
        lo = (lo + Math.imul(al1, bl5)) | 0;
        mid = (mid + Math.imul(al1, bh5)) | 0;
        mid = (mid + Math.imul(ah1, bl5)) | 0;
        hi = (hi + Math.imul(ah1, bh5)) | 0;
        lo = (lo + Math.imul(al0, bl6)) | 0;
        mid = (mid + Math.imul(al0, bh6)) | 0;
        mid = (mid + Math.imul(ah0, bl6)) | 0;
        hi = (hi + Math.imul(ah0, bh6)) | 0;
        var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
        w6 &= 0x3ffffff;
        /* k = 7 */
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = (mid + Math.imul(ah7, bl0)) | 0;
        hi = Math.imul(ah7, bh0);
        lo = (lo + Math.imul(al6, bl1)) | 0;
        mid = (mid + Math.imul(al6, bh1)) | 0;
        mid = (mid + Math.imul(ah6, bl1)) | 0;
        hi = (hi + Math.imul(ah6, bh1)) | 0;
        lo = (lo + Math.imul(al5, bl2)) | 0;
        mid = (mid + Math.imul(al5, bh2)) | 0;
        mid = (mid + Math.imul(ah5, bl2)) | 0;
        hi = (hi + Math.imul(ah5, bh2)) | 0;
        lo = (lo + Math.imul(al4, bl3)) | 0;
        mid = (mid + Math.imul(al4, bh3)) | 0;
        mid = (mid + Math.imul(ah4, bl3)) | 0;
        hi = (hi + Math.imul(ah4, bh3)) | 0;
        lo = (lo + Math.imul(al3, bl4)) | 0;
        mid = (mid + Math.imul(al3, bh4)) | 0;
        mid = (mid + Math.imul(ah3, bl4)) | 0;
        hi = (hi + Math.imul(ah3, bh4)) | 0;
        lo = (lo + Math.imul(al2, bl5)) | 0;
        mid = (mid + Math.imul(al2, bh5)) | 0;
        mid = (mid + Math.imul(ah2, bl5)) | 0;
        hi = (hi + Math.imul(ah2, bh5)) | 0;
        lo = (lo + Math.imul(al1, bl6)) | 0;
        mid = (mid + Math.imul(al1, bh6)) | 0;
        mid = (mid + Math.imul(ah1, bl6)) | 0;
        hi = (hi + Math.imul(ah1, bh6)) | 0;
        lo = (lo + Math.imul(al0, bl7)) | 0;
        mid = (mid + Math.imul(al0, bh7)) | 0;
        mid = (mid + Math.imul(ah0, bl7)) | 0;
        hi = (hi + Math.imul(ah0, bh7)) | 0;
        var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
        w7 &= 0x3ffffff;
        /* k = 8 */
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = (mid + Math.imul(ah8, bl0)) | 0;
        hi = Math.imul(ah8, bh0);
        lo = (lo + Math.imul(al7, bl1)) | 0;
        mid = (mid + Math.imul(al7, bh1)) | 0;
        mid = (mid + Math.imul(ah7, bl1)) | 0;
        hi = (hi + Math.imul(ah7, bh1)) | 0;
        lo = (lo + Math.imul(al6, bl2)) | 0;
        mid = (mid + Math.imul(al6, bh2)) | 0;
        mid = (mid + Math.imul(ah6, bl2)) | 0;
        hi = (hi + Math.imul(ah6, bh2)) | 0;
        lo = (lo + Math.imul(al5, bl3)) | 0;
        mid = (mid + Math.imul(al5, bh3)) | 0;
        mid = (mid + Math.imul(ah5, bl3)) | 0;
        hi = (hi + Math.imul(ah5, bh3)) | 0;
        lo = (lo + Math.imul(al4, bl4)) | 0;
        mid = (mid + Math.imul(al4, bh4)) | 0;
        mid = (mid + Math.imul(ah4, bl4)) | 0;
        hi = (hi + Math.imul(ah4, bh4)) | 0;
        lo = (lo + Math.imul(al3, bl5)) | 0;
        mid = (mid + Math.imul(al3, bh5)) | 0;
        mid = (mid + Math.imul(ah3, bl5)) | 0;
        hi = (hi + Math.imul(ah3, bh5)) | 0;
        lo = (lo + Math.imul(al2, bl6)) | 0;
        mid = (mid + Math.imul(al2, bh6)) | 0;
        mid = (mid + Math.imul(ah2, bl6)) | 0;
        hi = (hi + Math.imul(ah2, bh6)) | 0;
        lo = (lo + Math.imul(al1, bl7)) | 0;
        mid = (mid + Math.imul(al1, bh7)) | 0;
        mid = (mid + Math.imul(ah1, bl7)) | 0;
        hi = (hi + Math.imul(ah1, bh7)) | 0;
        lo = (lo + Math.imul(al0, bl8)) | 0;
        mid = (mid + Math.imul(al0, bh8)) | 0;
        mid = (mid + Math.imul(ah0, bl8)) | 0;
        hi = (hi + Math.imul(ah0, bh8)) | 0;
        var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
        w8 &= 0x3ffffff;
        /* k = 9 */
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = (mid + Math.imul(ah9, bl0)) | 0;
        hi = Math.imul(ah9, bh0);
        lo = (lo + Math.imul(al8, bl1)) | 0;
        mid = (mid + Math.imul(al8, bh1)) | 0;
        mid = (mid + Math.imul(ah8, bl1)) | 0;
        hi = (hi + Math.imul(ah8, bh1)) | 0;
        lo = (lo + Math.imul(al7, bl2)) | 0;
        mid = (mid + Math.imul(al7, bh2)) | 0;
        mid = (mid + Math.imul(ah7, bl2)) | 0;
        hi = (hi + Math.imul(ah7, bh2)) | 0;
        lo = (lo + Math.imul(al6, bl3)) | 0;
        mid = (mid + Math.imul(al6, bh3)) | 0;
        mid = (mid + Math.imul(ah6, bl3)) | 0;
        hi = (hi + Math.imul(ah6, bh3)) | 0;
        lo = (lo + Math.imul(al5, bl4)) | 0;
        mid = (mid + Math.imul(al5, bh4)) | 0;
        mid = (mid + Math.imul(ah5, bl4)) | 0;
        hi = (hi + Math.imul(ah5, bh4)) | 0;
        lo = (lo + Math.imul(al4, bl5)) | 0;
        mid = (mid + Math.imul(al4, bh5)) | 0;
        mid = (mid + Math.imul(ah4, bl5)) | 0;
        hi = (hi + Math.imul(ah4, bh5)) | 0;
        lo = (lo + Math.imul(al3, bl6)) | 0;
        mid = (mid + Math.imul(al3, bh6)) | 0;
        mid = (mid + Math.imul(ah3, bl6)) | 0;
        hi = (hi + Math.imul(ah3, bh6)) | 0;
        lo = (lo + Math.imul(al2, bl7)) | 0;
        mid = (mid + Math.imul(al2, bh7)) | 0;
        mid = (mid + Math.imul(ah2, bl7)) | 0;
        hi = (hi + Math.imul(ah2, bh7)) | 0;
        lo = (lo + Math.imul(al1, bl8)) | 0;
        mid = (mid + Math.imul(al1, bh8)) | 0;
        mid = (mid + Math.imul(ah1, bl8)) | 0;
        hi = (hi + Math.imul(ah1, bh8)) | 0;
        lo = (lo + Math.imul(al0, bl9)) | 0;
        mid = (mid + Math.imul(al0, bh9)) | 0;
        mid = (mid + Math.imul(ah0, bl9)) | 0;
        hi = (hi + Math.imul(ah0, bh9)) | 0;
        var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
        w9 &= 0x3ffffff;
        /* k = 10 */
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = (mid + Math.imul(ah9, bl1)) | 0;
        hi = Math.imul(ah9, bh1);
        lo = (lo + Math.imul(al8, bl2)) | 0;
        mid = (mid + Math.imul(al8, bh2)) | 0;
        mid = (mid + Math.imul(ah8, bl2)) | 0;
        hi = (hi + Math.imul(ah8, bh2)) | 0;
        lo = (lo + Math.imul(al7, bl3)) | 0;
        mid = (mid + Math.imul(al7, bh3)) | 0;
        mid = (mid + Math.imul(ah7, bl3)) | 0;
        hi = (hi + Math.imul(ah7, bh3)) | 0;
        lo = (lo + Math.imul(al6, bl4)) | 0;
        mid = (mid + Math.imul(al6, bh4)) | 0;
        mid = (mid + Math.imul(ah6, bl4)) | 0;
        hi = (hi + Math.imul(ah6, bh4)) | 0;
        lo = (lo + Math.imul(al5, bl5)) | 0;
        mid = (mid + Math.imul(al5, bh5)) | 0;
        mid = (mid + Math.imul(ah5, bl5)) | 0;
        hi = (hi + Math.imul(ah5, bh5)) | 0;
        lo = (lo + Math.imul(al4, bl6)) | 0;
        mid = (mid + Math.imul(al4, bh6)) | 0;
        mid = (mid + Math.imul(ah4, bl6)) | 0;
        hi = (hi + Math.imul(ah4, bh6)) | 0;
        lo = (lo + Math.imul(al3, bl7)) | 0;
        mid = (mid + Math.imul(al3, bh7)) | 0;
        mid = (mid + Math.imul(ah3, bl7)) | 0;
        hi = (hi + Math.imul(ah3, bh7)) | 0;
        lo = (lo + Math.imul(al2, bl8)) | 0;
        mid = (mid + Math.imul(al2, bh8)) | 0;
        mid = (mid + Math.imul(ah2, bl8)) | 0;
        hi = (hi + Math.imul(ah2, bh8)) | 0;
        lo = (lo + Math.imul(al1, bl9)) | 0;
        mid = (mid + Math.imul(al1, bh9)) | 0;
        mid = (mid + Math.imul(ah1, bl9)) | 0;
        hi = (hi + Math.imul(ah1, bh9)) | 0;
        var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
        w10 &= 0x3ffffff;
        /* k = 11 */
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = (mid + Math.imul(ah9, bl2)) | 0;
        hi = Math.imul(ah9, bh2);
        lo = (lo + Math.imul(al8, bl3)) | 0;
        mid = (mid + Math.imul(al8, bh3)) | 0;
        mid = (mid + Math.imul(ah8, bl3)) | 0;
        hi = (hi + Math.imul(ah8, bh3)) | 0;
        lo = (lo + Math.imul(al7, bl4)) | 0;
        mid = (mid + Math.imul(al7, bh4)) | 0;
        mid = (mid + Math.imul(ah7, bl4)) | 0;
        hi = (hi + Math.imul(ah7, bh4)) | 0;
        lo = (lo + Math.imul(al6, bl5)) | 0;
        mid = (mid + Math.imul(al6, bh5)) | 0;
        mid = (mid + Math.imul(ah6, bl5)) | 0;
        hi = (hi + Math.imul(ah6, bh5)) | 0;
        lo = (lo + Math.imul(al5, bl6)) | 0;
        mid = (mid + Math.imul(al5, bh6)) | 0;
        mid = (mid + Math.imul(ah5, bl6)) | 0;
        hi = (hi + Math.imul(ah5, bh6)) | 0;
        lo = (lo + Math.imul(al4, bl7)) | 0;
        mid = (mid + Math.imul(al4, bh7)) | 0;
        mid = (mid + Math.imul(ah4, bl7)) | 0;
        hi = (hi + Math.imul(ah4, bh7)) | 0;
        lo = (lo + Math.imul(al3, bl8)) | 0;
        mid = (mid + Math.imul(al3, bh8)) | 0;
        mid = (mid + Math.imul(ah3, bl8)) | 0;
        hi = (hi + Math.imul(ah3, bh8)) | 0;
        lo = (lo + Math.imul(al2, bl9)) | 0;
        mid = (mid + Math.imul(al2, bh9)) | 0;
        mid = (mid + Math.imul(ah2, bl9)) | 0;
        hi = (hi + Math.imul(ah2, bh9)) | 0;
        var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
        w11 &= 0x3ffffff;
        /* k = 12 */
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = (mid + Math.imul(ah9, bl3)) | 0;
        hi = Math.imul(ah9, bh3);
        lo = (lo + Math.imul(al8, bl4)) | 0;
        mid = (mid + Math.imul(al8, bh4)) | 0;
        mid = (mid + Math.imul(ah8, bl4)) | 0;
        hi = (hi + Math.imul(ah8, bh4)) | 0;
        lo = (lo + Math.imul(al7, bl5)) | 0;
        mid = (mid + Math.imul(al7, bh5)) | 0;
        mid = (mid + Math.imul(ah7, bl5)) | 0;
        hi = (hi + Math.imul(ah7, bh5)) | 0;
        lo = (lo + Math.imul(al6, bl6)) | 0;
        mid = (mid + Math.imul(al6, bh6)) | 0;
        mid = (mid + Math.imul(ah6, bl6)) | 0;
        hi = (hi + Math.imul(ah6, bh6)) | 0;
        lo = (lo + Math.imul(al5, bl7)) | 0;
        mid = (mid + Math.imul(al5, bh7)) | 0;
        mid = (mid + Math.imul(ah5, bl7)) | 0;
        hi = (hi + Math.imul(ah5, bh7)) | 0;
        lo = (lo + Math.imul(al4, bl8)) | 0;
        mid = (mid + Math.imul(al4, bh8)) | 0;
        mid = (mid + Math.imul(ah4, bl8)) | 0;
        hi = (hi + Math.imul(ah4, bh8)) | 0;
        lo = (lo + Math.imul(al3, bl9)) | 0;
        mid = (mid + Math.imul(al3, bh9)) | 0;
        mid = (mid + Math.imul(ah3, bl9)) | 0;
        hi = (hi + Math.imul(ah3, bh9)) | 0;
        var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
        w12 &= 0x3ffffff;
        /* k = 13 */
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = (mid + Math.imul(ah9, bl4)) | 0;
        hi = Math.imul(ah9, bh4);
        lo = (lo + Math.imul(al8, bl5)) | 0;
        mid = (mid + Math.imul(al8, bh5)) | 0;
        mid = (mid + Math.imul(ah8, bl5)) | 0;
        hi = (hi + Math.imul(ah8, bh5)) | 0;
        lo = (lo + Math.imul(al7, bl6)) | 0;
        mid = (mid + Math.imul(al7, bh6)) | 0;
        mid = (mid + Math.imul(ah7, bl6)) | 0;
        hi = (hi + Math.imul(ah7, bh6)) | 0;
        lo = (lo + Math.imul(al6, bl7)) | 0;
        mid = (mid + Math.imul(al6, bh7)) | 0;
        mid = (mid + Math.imul(ah6, bl7)) | 0;
        hi = (hi + Math.imul(ah6, bh7)) | 0;
        lo = (lo + Math.imul(al5, bl8)) | 0;
        mid = (mid + Math.imul(al5, bh8)) | 0;
        mid = (mid + Math.imul(ah5, bl8)) | 0;
        hi = (hi + Math.imul(ah5, bh8)) | 0;
        lo = (lo + Math.imul(al4, bl9)) | 0;
        mid = (mid + Math.imul(al4, bh9)) | 0;
        mid = (mid + Math.imul(ah4, bl9)) | 0;
        hi = (hi + Math.imul(ah4, bh9)) | 0;
        var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
        w13 &= 0x3ffffff;
        /* k = 14 */
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = (mid + Math.imul(ah9, bl5)) | 0;
        hi = Math.imul(ah9, bh5);
        lo = (lo + Math.imul(al8, bl6)) | 0;
        mid = (mid + Math.imul(al8, bh6)) | 0;
        mid = (mid + Math.imul(ah8, bl6)) | 0;
        hi = (hi + Math.imul(ah8, bh6)) | 0;
        lo = (lo + Math.imul(al7, bl7)) | 0;
        mid = (mid + Math.imul(al7, bh7)) | 0;
        mid = (mid + Math.imul(ah7, bl7)) | 0;
        hi = (hi + Math.imul(ah7, bh7)) | 0;
        lo = (lo + Math.imul(al6, bl8)) | 0;
        mid = (mid + Math.imul(al6, bh8)) | 0;
        mid = (mid + Math.imul(ah6, bl8)) | 0;
        hi = (hi + Math.imul(ah6, bh8)) | 0;
        lo = (lo + Math.imul(al5, bl9)) | 0;
        mid = (mid + Math.imul(al5, bh9)) | 0;
        mid = (mid + Math.imul(ah5, bl9)) | 0;
        hi = (hi + Math.imul(ah5, bh9)) | 0;
        var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
        w14 &= 0x3ffffff;
        /* k = 15 */
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = (mid + Math.imul(ah9, bl6)) | 0;
        hi = Math.imul(ah9, bh6);
        lo = (lo + Math.imul(al8, bl7)) | 0;
        mid = (mid + Math.imul(al8, bh7)) | 0;
        mid = (mid + Math.imul(ah8, bl7)) | 0;
        hi = (hi + Math.imul(ah8, bh7)) | 0;
        lo = (lo + Math.imul(al7, bl8)) | 0;
        mid = (mid + Math.imul(al7, bh8)) | 0;
        mid = (mid + Math.imul(ah7, bl8)) | 0;
        hi = (hi + Math.imul(ah7, bh8)) | 0;
        lo = (lo + Math.imul(al6, bl9)) | 0;
        mid = (mid + Math.imul(al6, bh9)) | 0;
        mid = (mid + Math.imul(ah6, bl9)) | 0;
        hi = (hi + Math.imul(ah6, bh9)) | 0;
        var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
        w15 &= 0x3ffffff;
        /* k = 16 */
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = (mid + Math.imul(ah9, bl7)) | 0;
        hi = Math.imul(ah9, bh7);
        lo = (lo + Math.imul(al8, bl8)) | 0;
        mid = (mid + Math.imul(al8, bh8)) | 0;
        mid = (mid + Math.imul(ah8, bl8)) | 0;
        hi = (hi + Math.imul(ah8, bh8)) | 0;
        lo = (lo + Math.imul(al7, bl9)) | 0;
        mid = (mid + Math.imul(al7, bh9)) | 0;
        mid = (mid + Math.imul(ah7, bl9)) | 0;
        hi = (hi + Math.imul(ah7, bh9)) | 0;
        var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
        w16 &= 0x3ffffff;
        /* k = 17 */
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = (mid + Math.imul(ah9, bl8)) | 0;
        hi = Math.imul(ah9, bh8);
        lo = (lo + Math.imul(al8, bl9)) | 0;
        mid = (mid + Math.imul(al8, bh9)) | 0;
        mid = (mid + Math.imul(ah8, bl9)) | 0;
        hi = (hi + Math.imul(ah8, bh9)) | 0;
        var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
        w17 &= 0x3ffffff;
        /* k = 18 */
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = (mid + Math.imul(ah9, bl9)) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
        c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
        w18 &= 0x3ffffff;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
          o[19] = c;
          out.length++;
        }
        return out;
      };

      // Polyfill comb
      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }

      function bigMulTo (self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;

        var carry = 0;
        var hncarry = 0;
        for (var k = 0; k < out.length - 1; k++) {
          // Sum all words with the same `i + j = k` and accumulate `ncarry`,
          // note that ncarry could be >= 0x3ffffff
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 0x3ffffff;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = k - j;
            var a = self.words[i] | 0;
            var b = num.words[j] | 0;
            var r = a * b;

            var lo = r & 0x3ffffff;
            ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
            lo = (lo + rword) | 0;
            rword = lo & 0x3ffffff;
            ncarry = (ncarry + (lo >>> 26)) | 0;

            hncarry += ncarry >>> 26;
            ncarry &= 0x3ffffff;
          }
          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        if (carry !== 0) {
          out.words[k] = carry;
        } else {
          out.length--;
        }

        return out.strip();
      }

      function jumboMulTo (self, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self, num, out);
      }

      BN.prototype.mulTo = function mulTo (num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len < 63) {
          res = smallMulTo(this, num, out);
        } else if (len < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }

        return res;
      };

      // Cooley-Tukey algorithm for FFT
      // slightly revisited to rely on looping instead of recursion

      function FFTM (x, y) {
        this.x = x;
        this.y = y;
      }

      FFTM.prototype.makeRBT = function makeRBT (N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;
        for (var i = 0; i < N; i++) {
          t[i] = this.revBin(i, l, N);
        }

        return t;
      };

      // Returns binary-reversed representation of `x`
      FFTM.prototype.revBin = function revBin (x, l, N) {
        if (x === 0 || x === N - 1) return x;

        var rb = 0;
        for (var i = 0; i < l; i++) {
          rb |= (x & 1) << (l - i - 1);
          x >>= 1;
        }

        return rb;
      };

      // Performs "tweedling" phase, therefore 'emulating'
      // behaviour of the recursive algorithm
      FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
        for (var i = 0; i < N; i++) {
          rtws[i] = rws[rbt[i]];
          itws[i] = iws[rbt[i]];
        }
      };

      FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);

        for (var s = 1; s < N; s <<= 1) {
          var l = s << 1;

          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);

          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;

            for (var j = 0; j < s; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];

              var ro = rtws[p + j + s];
              var io = itws[p + j + s];

              var rx = rtwdf_ * ro - itwdf_ * io;

              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;

              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;

              rtws[p + j + s] = re - ro;
              itws[p + j + s] = ie - io;

              /* jshint maxdepth : false */
              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;

                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };

      FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;
        for (N = N / 2 | 0; N; N = N >>> 1) {
          i++;
        }

        return 1 << i + 1 + odd;
      };

      FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
        if (N <= 1) return;

        for (var i = 0; i < N / 2; i++) {
          var t = rws[i];

          rws[i] = rws[N - i - 1];
          rws[N - i - 1] = t;

          t = iws[i];

          iws[i] = -iws[N - i - 1];
          iws[N - i - 1] = -t;
        }
      };

      FFTM.prototype.normalize13b = function normalize13b (ws, N) {
        var carry = 0;
        for (var i = 0; i < N / 2; i++) {
          var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
            Math.round(ws[2 * i] / N) +
            carry;

          ws[i] = w & 0x3ffffff;

          if (w < 0x4000000) {
            carry = 0;
          } else {
            carry = w / 0x4000000 | 0;
          }
        }

        return ws;
      };

      FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
        var carry = 0;
        for (var i = 0; i < len; i++) {
          carry = carry + (ws[i] | 0);

          rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
          rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
        }

        // Pad with zeroes
        for (i = 2 * len; i < N; ++i) {
          rws[i] = 0;
        }

        assert(carry === 0);
        assert((carry & ~0x1fff) === 0);
      };

      FFTM.prototype.stub = function stub (N) {
        var ph = new Array(N);
        for (var i = 0; i < N; i++) {
          ph[i] = 0;
        }

        return ph;
      };

      FFTM.prototype.mulp = function mulp (x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);

        var rbt = this.makeRBT(N);

        var _ = this.stub(N);

        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);

        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);

        var rmws = out.words;
        rmws.length = N;

        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);

        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);

        for (var i = 0; i < N; i++) {
          var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
          iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
          rwst[i] = rx;
        }

        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);

        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      };

      // Multiply `this` by `num`
      BN.prototype.mul = function mul (num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      };

      // Multiply employing FFT
      BN.prototype.mulf = function mulf (num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      };

      // In-place Multiplication
      BN.prototype.imul = function imul (num) {
        return this.clone().mulTo(num, this);
      };

      BN.prototype.imuln = function imuln (num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);

        // Carry
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = (this.words[i] | 0) * num;
          var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
          carry >>= 26;
          carry += (w / 0x4000000) | 0;
          // NOTE: lo is 27bit maximum
          carry += lo >>> 26;
          this.words[i] = lo & 0x3ffffff;
        }

        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }

        return this;
      };

      BN.prototype.muln = function muln (num) {
        return this.clone().imuln(num);
      };

      // `this` * `this`
      BN.prototype.sqr = function sqr () {
        return this.mul(this);
      };

      // `this` * `this` in-place
      BN.prototype.isqr = function isqr () {
        return this.imul(this.clone());
      };

      // Math.pow(`this`, `num`)
      BN.prototype.pow = function pow (num) {
        var w = toBitArray(num);
        if (w.length === 0) return new BN(1);

        // Skip leading zeroes
        var res = this;
        for (var i = 0; i < w.length; i++, res = res.sqr()) {
          if (w[i] !== 0) break;
        }

        if (++i < w.length) {
          for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
            if (w[i] === 0) continue;

            res = res.mul(q);
          }
        }

        return res;
      };

      // Shift-left in-place
      BN.prototype.iushln = function iushln (bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
        var i;

        if (r !== 0) {
          var carry = 0;

          for (i = 0; i < this.length; i++) {
            var newCarry = this.words[i] & carryMask;
            var c = ((this.words[i] | 0) - newCarry) << r;
            this.words[i] = c | carry;
            carry = newCarry >>> (26 - r);
          }

          if (carry) {
            this.words[i] = carry;
            this.length++;
          }
        }

        if (s !== 0) {
          for (i = this.length - 1; i >= 0; i--) {
            this.words[i + s] = this.words[i];
          }

          for (i = 0; i < s; i++) {
            this.words[i] = 0;
          }

          this.length += s;
        }

        return this.strip();
      };

      BN.prototype.ishln = function ishln (bits) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushln(bits);
      };

      // Shift-right in-place
      // NOTE: `hint` is a lowest bit before trailing zeroes
      // NOTE: if `extended` is present - it will be filled with destroyed bits
      BN.prototype.iushrn = function iushrn (bits, hint, extended) {
        assert(typeof bits === 'number' && bits >= 0);
        var h;
        if (hint) {
          h = (hint - (hint % 26)) / 26;
        } else {
          h = 0;
        }

        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        var maskedWords = extended;

        h -= s;
        h = Math.max(0, h);

        // Extended mode, copy masked part
        if (maskedWords) {
          for (var i = 0; i < s; i++) {
            maskedWords.words[i] = this.words[i];
          }
          maskedWords.length = s;
        }

        if (s === 0) ; else if (this.length > s) {
          this.length -= s;
          for (i = 0; i < this.length; i++) {
            this.words[i] = this.words[i + s];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }

        var carry = 0;
        for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
          var word = this.words[i] | 0;
          this.words[i] = (carry << (26 - r)) | (word >>> r);
          carry = word & mask;
        }

        // Push carried bits as a mask
        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }

        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }

        return this.strip();
      };

      BN.prototype.ishrn = function ishrn (bits, hint, extended) {
        // TODO(indutny): implement me
        assert(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      };

      // Shift-left
      BN.prototype.shln = function shln (bits) {
        return this.clone().ishln(bits);
      };

      BN.prototype.ushln = function ushln (bits) {
        return this.clone().iushln(bits);
      };

      // Shift-right
      BN.prototype.shrn = function shrn (bits) {
        return this.clone().ishrn(bits);
      };

      BN.prototype.ushrn = function ushrn (bits) {
        return this.clone().iushrn(bits);
      };

      // Test if n bit is set
      BN.prototype.testn = function testn (bit) {
        assert(typeof bit === 'number' && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;

        // Fast case: bit is much higher than all existing words
        if (this.length <= s) return false;

        // Check bit and return
        var w = this.words[s];

        return !!(w & q);
      };

      // Return only lowers bits of number (in-place)
      BN.prototype.imaskn = function imaskn (bits) {
        assert(typeof bits === 'number' && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;

        assert(this.negative === 0, 'imaskn works only with positive numbers');

        if (this.length <= s) {
          return this;
        }

        if (r !== 0) {
          s++;
        }
        this.length = Math.min(s, this.length);

        if (r !== 0) {
          var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
          this.words[this.length - 1] &= mask;
        }

        return this.strip();
      };

      // Return only lowers bits of number
      BN.prototype.maskn = function maskn (bits) {
        return this.clone().imaskn(bits);
      };

      // Add plain number `num` to `this`
      BN.prototype.iaddn = function iaddn (num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.isubn(-num);

        // Possible sign change
        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }

          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }

        // Add without checks
        return this._iaddn(num);
      };

      BN.prototype._iaddn = function _iaddn (num) {
        this.words[0] += num;

        // Carry
        for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
          this.words[i] -= 0x4000000;
          if (i === this.length - 1) {
            this.words[i + 1] = 1;
          } else {
            this.words[i + 1]++;
          }
        }
        this.length = Math.max(this.length, i + 1);

        return this;
      };

      // Subtract plain number `num` from `this`
      BN.prototype.isubn = function isubn (num) {
        assert(typeof num === 'number');
        assert(num < 0x4000000);
        if (num < 0) return this.iaddn(-num);

        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }

        this.words[0] -= num;

        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          // Carry
          for (var i = 0; i < this.length && this.words[i] < 0; i++) {
            this.words[i] += 0x4000000;
            this.words[i + 1] -= 1;
          }
        }

        return this.strip();
      };

      BN.prototype.addn = function addn (num) {
        return this.clone().iaddn(num);
      };

      BN.prototype.subn = function subn (num) {
        return this.clone().isubn(num);
      };

      BN.prototype.iabs = function iabs () {
        this.negative = 0;

        return this;
      };

      BN.prototype.abs = function abs () {
        return this.clone().iabs();
      };

      BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
        var len = num.length + shift;
        var i;

        this._expand(len);

        var w;
        var carry = 0;
        for (i = 0; i < num.length; i++) {
          w = (this.words[i + shift] | 0) + carry;
          var right = (num.words[i] | 0) * mul;
          w -= right & 0x3ffffff;
          carry = (w >> 26) - ((right / 0x4000000) | 0);
          this.words[i + shift] = w & 0x3ffffff;
        }
        for (; i < this.length - shift; i++) {
          w = (this.words[i + shift] | 0) + carry;
          carry = w >> 26;
          this.words[i + shift] = w & 0x3ffffff;
        }

        if (carry === 0) return this.strip();

        // Subtraction overflow
        assert(carry === -1);
        carry = 0;
        for (i = 0; i < this.length; i++) {
          w = -(this.words[i] | 0) + carry;
          carry = w >> 26;
          this.words[i] = w & 0x3ffffff;
        }
        this.negative = 1;

        return this.strip();
      };

      BN.prototype._wordDiv = function _wordDiv (num, mode) {
        var shift = this.length - num.length;

        var a = this.clone();
        var b = num;

        // Normalize
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = b.words[b.length - 1] | 0;
        }

        // Initialize quotient
        var m = a.length - b.length;
        var q;

        if (mode !== 'mod') {
          q = new BN(null);
          q.length = m + 1;
          q.words = new Array(q.length);
          for (var i = 0; i < q.length; i++) {
            q.words[i] = 0;
          }
        }

        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
          a = diff;
          if (q) {
            q.words[m] = 1;
          }
        }

        for (var j = m - 1; j >= 0; j--) {
          var qj = (a.words[b.length + j] | 0) * 0x4000000 +
            (a.words[b.length + j - 1] | 0);

          // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
          // (0x7ffffff)
          qj = Math.min((qj / bhi) | 0, 0x3ffffff);

          a._ishlnsubmul(b, qj, j);
          while (a.negative !== 0) {
            qj--;
            a.negative = 0;
            a._ishlnsubmul(b, 1, j);
            if (!a.isZero()) {
              a.negative ^= 1;
            }
          }
          if (q) {
            q.words[j] = qj;
          }
        }
        if (q) {
          q.strip();
        }
        a.strip();

        // Denormalize
        if (mode !== 'div' && shift !== 0) {
          a.iushrn(shift);
        }

        return {
          div: q || null,
          mod: a
        };
      };

      // NOTE: 1) `mode` can be set to `mod` to request mod only,
      //       to `div` to request div only, or be absent to
      //       request both div & mod
      //       2) `positive` is true if unsigned mod is requested
      BN.prototype.divmod = function divmod (num, mode, positive) {
        assert(!num.isZero());

        if (this.isZero()) {
          return {
            div: new BN(0),
            mod: new BN(0)
          };
        }

        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);

          if (mode !== 'mod') {
            div = res.div.neg();
          }

          if (mode !== 'div') {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }

          return {
            div: div,
            mod: mod
          };
        }

        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);

          if (mode !== 'mod') {
            div = res.div.neg();
          }

          return {
            div: div,
            mod: res.mod
          };
        }

        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);

          if (mode !== 'div') {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }

          return {
            div: res.div,
            mod: mod
          };
        }

        // Both numbers are positive at this point

        // Strip both numbers to approximate shift value
        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN(0),
            mod: this
          };
        }

        // Very short reduction
        if (num.length === 1) {
          if (mode === 'div') {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }

          if (mode === 'mod') {
            return {
              div: null,
              mod: new BN(this.modn(num.words[0]))
            };
          }

          return {
            div: this.divn(num.words[0]),
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return this._wordDiv(num, mode);
      };

      // Find `this` / `num`
      BN.prototype.div = function div (num) {
        return this.divmod(num, 'div', false).div;
      };

      // Find `this` % `num`
      BN.prototype.mod = function mod (num) {
        return this.divmod(num, 'mod', false).mod;
      };

      BN.prototype.umod = function umod (num) {
        return this.divmod(num, 'mod', true).mod;
      };

      // Find Round(`this` / `num`)
      BN.prototype.divRound = function divRound (num) {
        var dm = this.divmod(num);

        // Fast case - exact division
        if (dm.mod.isZero()) return dm.div;

        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);

        // Round down
        if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

        // Round up
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      };

      BN.prototype.modn = function modn (num) {
        assert(num <= 0x3ffffff);
        var p = (1 << 26) % num;

        var acc = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          acc = (p * acc + (this.words[i] | 0)) % num;
        }

        return acc;
      };

      // In-place division by number
      BN.prototype.idivn = function idivn (num) {
        assert(num <= 0x3ffffff);

        var carry = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var w = (this.words[i] | 0) + carry * 0x4000000;
          this.words[i] = (w / num) | 0;
          carry = w % num;
        }

        return this.strip();
      };

      BN.prototype.divn = function divn (num) {
        return this.clone().idivn(num);
      };

      BN.prototype.egcd = function egcd (p) {
        assert(p.negative === 0);
        assert(!p.isZero());

        var x = this;
        var y = p.clone();

        if (x.negative !== 0) {
          x = x.umod(p);
        } else {
          x = x.clone();
        }

        // A * x + B * y = x
        var A = new BN(1);
        var B = new BN(0);

        // C * x + D * y = y
        var C = new BN(0);
        var D = new BN(1);

        var g = 0;

        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }

        var yp = y.clone();
        var xp = x.clone();

        while (!x.isZero()) {
          for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
          if (i > 0) {
            x.iushrn(i);
            while (i-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }

              A.iushrn(1);
              B.iushrn(1);
            }
          }

          for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
          if (j > 0) {
            y.iushrn(j);
            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }

              C.iushrn(1);
              D.iushrn(1);
            }
          }

          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }

        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      };

      // This is reduced incarnation of the binary EEA
      // above, designated to invert members of the
      // _prime_ fields F(p) at a maximal speed
      BN.prototype._invmp = function _invmp (p) {
        assert(p.negative === 0);
        assert(!p.isZero());

        var a = this;
        var b = p.clone();

        if (a.negative !== 0) {
          a = a.umod(p);
        } else {
          a = a.clone();
        }

        var x1 = new BN(1);
        var x2 = new BN(0);

        var delta = b.clone();

        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
          if (i > 0) {
            a.iushrn(i);
            while (i-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }

              x1.iushrn(1);
            }
          }

          for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
          if (j > 0) {
            b.iushrn(j);
            while (j-- > 0) {
              if (x2.isOdd()) {
                x2.iadd(delta);
              }

              x2.iushrn(1);
            }
          }

          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }

        var res;
        if (a.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x2;
        }

        if (res.cmpn(0) < 0) {
          res.iadd(p);
        }

        return res;
      };

      BN.prototype.gcd = function gcd (num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();

        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;

        // Remove common factor of two
        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }

        do {
          while (a.isEven()) {
            a.iushrn(1);
          }
          while (b.isEven()) {
            b.iushrn(1);
          }

          var r = a.cmp(b);
          if (r < 0) {
            // Swap `a` and `b` to make `a` always bigger than `b`
            var t = a;
            a = b;
            b = t;
          } else if (r === 0 || b.cmpn(1) === 0) {
            break;
          }

          a.isub(b);
        } while (true);

        return b.iushln(shift);
      };

      // Invert number in the field F(num)
      BN.prototype.invm = function invm (num) {
        return this.egcd(num).a.umod(num);
      };

      BN.prototype.isEven = function isEven () {
        return (this.words[0] & 1) === 0;
      };

      BN.prototype.isOdd = function isOdd () {
        return (this.words[0] & 1) === 1;
      };

      // And first word and num
      BN.prototype.andln = function andln (num) {
        return this.words[0] & num;
      };

      // Increment at the bit position in-line
      BN.prototype.bincn = function bincn (bit) {
        assert(typeof bit === 'number');
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;

        // Fast case: bit is much higher than all existing words
        if (this.length <= s) {
          this._expand(s + 1);
          this.words[s] |= q;
          return this;
        }

        // Add bit and propagate, if needed
        var carry = q;
        for (var i = s; carry !== 0 && i < this.length; i++) {
          var w = this.words[i] | 0;
          w += carry;
          carry = w >>> 26;
          w &= 0x3ffffff;
          this.words[i] = w;
        }
        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };

      BN.prototype.isZero = function isZero () {
        return this.length === 1 && this.words[0] === 0;
      };

      BN.prototype.cmpn = function cmpn (num) {
        var negative = num < 0;

        if (this.negative !== 0 && !negative) return -1;
        if (this.negative === 0 && negative) return 1;

        this.strip();

        var res;
        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }

          assert(num <= 0x3ffffff, 'Number is too big');

          var w = this.words[0] | 0;
          res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0) return -res | 0;
        return res;
      };

      // Compare two numbers and return:
      // 1 - if `this` > `num`
      // 0 - if `this` == `num`
      // -1 - if `this` < `num`
      BN.prototype.cmp = function cmp (num) {
        if (this.negative !== 0 && num.negative === 0) return -1;
        if (this.negative === 0 && num.negative !== 0) return 1;

        var res = this.ucmp(num);
        if (this.negative !== 0) return -res | 0;
        return res;
      };

      // Unsigned comparison
      BN.prototype.ucmp = function ucmp (num) {
        // At this point both numbers have the same sign
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;

        var res = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var a = this.words[i] | 0;
          var b = num.words[i] | 0;

          if (a === b) continue;
          if (a < b) {
            res = -1;
          } else if (a > b) {
            res = 1;
          }
          break;
        }
        return res;
      };

      BN.prototype.gtn = function gtn (num) {
        return this.cmpn(num) === 1;
      };

      BN.prototype.gt = function gt (num) {
        return this.cmp(num) === 1;
      };

      BN.prototype.gten = function gten (num) {
        return this.cmpn(num) >= 0;
      };

      BN.prototype.gte = function gte (num) {
        return this.cmp(num) >= 0;
      };

      BN.prototype.ltn = function ltn (num) {
        return this.cmpn(num) === -1;
      };

      BN.prototype.lt = function lt (num) {
        return this.cmp(num) === -1;
      };

      BN.prototype.lten = function lten (num) {
        return this.cmpn(num) <= 0;
      };

      BN.prototype.lte = function lte (num) {
        return this.cmp(num) <= 0;
      };

      BN.prototype.eqn = function eqn (num) {
        return this.cmpn(num) === 0;
      };

      BN.prototype.eq = function eq (num) {
        return this.cmp(num) === 0;
      };

      //
      // A reduce context, could be using montgomery or something better, depending
      // on the `m` itself.
      //
      BN.red = function red (num) {
        return new Red(num);
      };

      BN.prototype.toRed = function toRed (ctx) {
        assert(!this.red, 'Already a number in reduction context');
        assert(this.negative === 0, 'red works only with positives');
        return ctx.convertTo(this)._forceRed(ctx);
      };

      BN.prototype.fromRed = function fromRed () {
        assert(this.red, 'fromRed works only with numbers in reduction context');
        return this.red.convertFrom(this);
      };

      BN.prototype._forceRed = function _forceRed (ctx) {
        this.red = ctx;
        return this;
      };

      BN.prototype.forceRed = function forceRed (ctx) {
        assert(!this.red, 'Already a number in reduction context');
        return this._forceRed(ctx);
      };

      BN.prototype.redAdd = function redAdd (num) {
        assert(this.red, 'redAdd works only with red numbers');
        return this.red.add(this, num);
      };

      BN.prototype.redIAdd = function redIAdd (num) {
        assert(this.red, 'redIAdd works only with red numbers');
        return this.red.iadd(this, num);
      };

      BN.prototype.redSub = function redSub (num) {
        assert(this.red, 'redSub works only with red numbers');
        return this.red.sub(this, num);
      };

      BN.prototype.redISub = function redISub (num) {
        assert(this.red, 'redISub works only with red numbers');
        return this.red.isub(this, num);
      };

      BN.prototype.redShl = function redShl (num) {
        assert(this.red, 'redShl works only with red numbers');
        return this.red.shl(this, num);
      };

      BN.prototype.redMul = function redMul (num) {
        assert(this.red, 'redMul works only with red numbers');
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      };

      BN.prototype.redIMul = function redIMul (num) {
        assert(this.red, 'redMul works only with red numbers');
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      };

      BN.prototype.redSqr = function redSqr () {
        assert(this.red, 'redSqr works only with red numbers');
        this.red._verify1(this);
        return this.red.sqr(this);
      };

      BN.prototype.redISqr = function redISqr () {
        assert(this.red, 'redISqr works only with red numbers');
        this.red._verify1(this);
        return this.red.isqr(this);
      };

      // Square root over p
      BN.prototype.redSqrt = function redSqrt () {
        assert(this.red, 'redSqrt works only with red numbers');
        this.red._verify1(this);
        return this.red.sqrt(this);
      };

      BN.prototype.redInvm = function redInvm () {
        assert(this.red, 'redInvm works only with red numbers');
        this.red._verify1(this);
        return this.red.invm(this);
      };

      // Return negative clone of `this` % `red modulo`
      BN.prototype.redNeg = function redNeg () {
        assert(this.red, 'redNeg works only with red numbers');
        this.red._verify1(this);
        return this.red.neg(this);
      };

      BN.prototype.redPow = function redPow (num) {
        assert(this.red && !num.red, 'redPow(normalNum)');
        this.red._verify1(this);
        return this.red.pow(this, num);
      };

      // Prime numbers with efficient reduction
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };

      // Pseudo-Mersenne prime
      function MPrime (name, p) {
        // P = 2 ^ N - K
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);

        this.tmp = this._tmp();
      }

      MPrime.prototype._tmp = function _tmp () {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };

      MPrime.prototype.ireduce = function ireduce (num) {
        // Assumes that `num` is less than `P^2`
        // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
        var r = num;
        var rlen;

        do {
          this.split(r, this.tmp);
          r = this.imulK(r);
          r = r.iadd(this.tmp);
          rlen = r.bitLength();
        } while (rlen > this.n);

        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (cmp === 0) {
          r.words[0] = 0;
          r.length = 1;
        } else if (cmp > 0) {
          r.isub(this.p);
        } else {
          if (r.strip !== undefined) {
            // r is BN v4 instance
            r.strip();
          } else {
            // r is BN v5 instance
            r._strip();
          }
        }

        return r;
      };

      MPrime.prototype.split = function split (input, out) {
        input.iushrn(this.n, 0, out);
      };

      MPrime.prototype.imulK = function imulK (num) {
        return num.imul(this.k);
      };

      function K256 () {
        MPrime.call(
          this,
          'k256',
          'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
      }
      inherits(K256, MPrime);

      K256.prototype.split = function split (input, output) {
        // 256 = 9 * 26 + 22
        var mask = 0x3fffff;

        var outLen = Math.min(input.length, 9);
        for (var i = 0; i < outLen; i++) {
          output.words[i] = input.words[i];
        }
        output.length = outLen;

        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }

        // Shift by 9 limbs
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;

        for (i = 10; i < input.length; i++) {
          var next = input.words[i] | 0;
          input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
          prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      };

      K256.prototype.imulK = function imulK (num) {
        // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;

        // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
        var lo = 0;
        for (var i = 0; i < num.length; i++) {
          var w = num.words[i] | 0;
          lo += w * 0x3d1;
          num.words[i] = lo & 0x3ffffff;
          lo = w * 0x40 + ((lo / 0x4000000) | 0);
        }

        // Fast length reduction
        if (num.words[num.length - 1] === 0) {
          num.length--;
          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }
        return num;
      };

      function P224 () {
        MPrime.call(
          this,
          'p224',
          'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
      }
      inherits(P224, MPrime);

      function P192 () {
        MPrime.call(
          this,
          'p192',
          'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
      }
      inherits(P192, MPrime);

      function P25519 () {
        // 2 ^ 255 - 19
        MPrime.call(
          this,
          '25519',
          '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
      }
      inherits(P25519, MPrime);

      P25519.prototype.imulK = function imulK (num) {
        // K = 0x13
        var carry = 0;
        for (var i = 0; i < num.length; i++) {
          var hi = (num.words[i] | 0) * 0x13 + carry;
          var lo = hi & 0x3ffffff;
          hi >>>= 26;

          num.words[i] = lo;
          carry = hi;
        }
        if (carry !== 0) {
          num.words[num.length++] = carry;
        }
        return num;
      };

      // Exported mostly for testing purposes, use plain name instead
      BN._prime = function prime (name) {
        // Cached version of prime
        if (primes[name]) return primes[name];

        var prime;
        if (name === 'k256') {
          prime = new K256();
        } else if (name === 'p224') {
          prime = new P224();
        } else if (name === 'p192') {
          prime = new P192();
        } else if (name === 'p25519') {
          prime = new P25519();
        } else {
          throw new Error('Unknown prime ' + name);
        }
        primes[name] = prime;

        return prime;
      };

      //
      // Base reduction engine
      //
      function Red (m) {
        if (typeof m === 'string') {
          var prime = BN._prime(m);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert(m.gtn(1), 'modulus must be greater than 1');
          this.m = m;
          this.prime = null;
        }
      }

      Red.prototype._verify1 = function _verify1 (a) {
        assert(a.negative === 0, 'red works only with positives');
        assert(a.red, 'red works only with red numbers');
      };

      Red.prototype._verify2 = function _verify2 (a, b) {
        assert((a.negative | b.negative) === 0, 'red works only with positives');
        assert(a.red && a.red === b.red,
          'red works only with red numbers');
      };

      Red.prototype.imod = function imod (a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };

      Red.prototype.neg = function neg (a) {
        if (a.isZero()) {
          return a.clone();
        }

        return this.m.sub(a)._forceRed(this);
      };

      Red.prototype.add = function add (a, b) {
        this._verify2(a, b);

        var res = a.add(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res._forceRed(this);
      };

      Red.prototype.iadd = function iadd (a, b) {
        this._verify2(a, b);

        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res;
      };

      Red.prototype.sub = function sub (a, b) {
        this._verify2(a, b);

        var res = a.sub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res._forceRed(this);
      };

      Red.prototype.isub = function isub (a, b) {
        this._verify2(a, b);

        var res = a.isub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res;
      };

      Red.prototype.shl = function shl (a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
      };

      Red.prototype.imul = function imul (a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
      };

      Red.prototype.mul = function mul (a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
      };

      Red.prototype.isqr = function isqr (a) {
        return this.imul(a, a.clone());
      };

      Red.prototype.sqr = function sqr (a) {
        return this.mul(a, a);
      };

      Red.prototype.sqrt = function sqrt (a) {
        if (a.isZero()) return a.clone();

        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);

        // Fast case
        if (mod3 === 3) {
          var pow = this.m.add(new BN(1)).iushrn(2);
          return this.pow(a, pow);
        }

        // Tonelli-Shanks algorithm (Totally unoptimized and slow)
        //
        // Find Q and S, that Q * 2 ^ S = (P - 1)
        var q = this.m.subn(1);
        var s = 0;
        while (!q.isZero() && q.andln(1) === 0) {
          s++;
          q.iushrn(1);
        }
        assert(!q.isZero());

        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();

        // Find quadratic non-residue
        // NOTE: Max is such because of generalized Riemann hypothesis.
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);

        while (this.pow(z, lpow).cmp(nOne) !== 0) {
          z.redIAdd(nOne);
        }

        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while (t.cmp(one) !== 0) {
          var tmp = t;
          for (var i = 0; tmp.cmp(one) !== 0; i++) {
            tmp = tmp.redSqr();
          }
          assert(i < m);
          var b = this.pow(c, new BN(1).iushln(m - i - 1));

          r = r.redMul(b);
          c = b.redSqr();
          t = t.redMul(c);
          m = i;
        }

        return r;
      };

      Red.prototype.invm = function invm (a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      };

      Red.prototype.pow = function pow (a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (num.cmpn(1) === 0) return a.clone();

        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;
        for (var i = 2; i < wnd.length; i++) {
          wnd[i] = this.mul(wnd[i - 1], a);
        }

        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) {
          start = 26;
        }

        for (i = num.length - 1; i >= 0; i--) {
          var word = num.words[i];
          for (var j = start - 1; j >= 0; j--) {
            var bit = (word >> j) & 1;
            if (res !== wnd[0]) {
              res = this.sqr(res);
            }

            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }

            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start = 26;
        }

        return res;
      };

      Red.prototype.convertTo = function convertTo (num) {
        var r = num.umod(this.m);

        return r === num ? r.clone() : r;
      };

      Red.prototype.convertFrom = function convertFrom (num) {
        var res = num.clone();
        res.red = null;
        return res;
      };

      //
      // Montgomery method engine
      //

      BN.mont = function mont (num) {
        return new Mont(num);
      };

      function Mont (m) {
        Red.call(this, m);

        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
          this.shift += 26 - (this.shift % 26);
        }

        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);

        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      inherits(Mont, Red);

      Mont.prototype.convertTo = function convertTo (num) {
        return this.imod(num.ushln(this.shift));
      };

      Mont.prototype.convertFrom = function convertFrom (num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
      };

      Mont.prototype.imul = function imul (a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }

        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;

        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }

        return res._forceRed(this);
      };

      Mont.prototype.mul = function mul (a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }

        return res._forceRed(this);
      };

      Mont.prototype.invm = function invm (a) {
        // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })(module, commonjsGlobal);
    });

    var minimalisticAssert = assert$9;

    function assert$9(val, msg) {
      if (!val)
        throw new Error(msg || 'Assertion failed');
    }

    assert$9.equal = function assertEqual(l, r, msg) {
      if (l != r)
        throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
    };

    var utils_1$1 = createCommonjsModule(function (module, exports) {

    var utils = exports;

    function toArray(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg !== 'string') {
        for (var i = 0; i < msg.length; i++)
          res[i] = msg[i] | 0;
        return res;
      }
      if (enc === 'hex') {
        msg = msg.replace(/[^a-z0-9]+/ig, '');
        if (msg.length % 2 !== 0)
          msg = '0' + msg;
        for (var i = 0; i < msg.length; i += 2)
          res.push(parseInt(msg[i] + msg[i + 1], 16));
      } else {
        for (var i = 0; i < msg.length; i++) {
          var c = msg.charCodeAt(i);
          var hi = c >> 8;
          var lo = c & 0xff;
          if (hi)
            res.push(hi, lo);
          else
            res.push(lo);
        }
      }
      return res;
    }
    utils.toArray = toArray;

    function zero2(word) {
      if (word.length === 1)
        return '0' + word;
      else
        return word;
    }
    utils.zero2 = zero2;

    function toHex(msg) {
      var res = '';
      for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
      return res;
    }
    utils.toHex = toHex;

    utils.encode = function encode(arr, enc) {
      if (enc === 'hex')
        return toHex(arr);
      else
        return arr;
    };
    });

    var utils_1 = createCommonjsModule(function (module, exports) {

    var utils = exports;




    utils.assert = minimalisticAssert;
    utils.toArray = utils_1$1.toArray;
    utils.zero2 = utils_1$1.zero2;
    utils.toHex = utils_1$1.toHex;
    utils.encode = utils_1$1.encode;

    // Represent num in a w-NAF form
    function getNAF(num, w, bits) {
      var naf = new Array(Math.max(num.bitLength(), bits) + 1);
      naf.fill(0);

      var ws = 1 << (w + 1);
      var k = num.clone();

      for (var i = 0; i < naf.length; i++) {
        var z;
        var mod = k.andln(ws - 1);
        if (k.isOdd()) {
          if (mod > (ws >> 1) - 1)
            z = (ws >> 1) - mod;
          else
            z = mod;
          k.isubn(z);
        } else {
          z = 0;
        }

        naf[i] = z;
        k.iushrn(1);
      }

      return naf;
    }
    utils.getNAF = getNAF;

    // Represent k1, k2 in a Joint Sparse Form
    function getJSF(k1, k2) {
      var jsf = [
        [],
        [],
      ];

      k1 = k1.clone();
      k2 = k2.clone();
      var d1 = 0;
      var d2 = 0;
      var m8;
      while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        // First phase
        var m14 = (k1.andln(3) + d1) & 3;
        var m24 = (k2.andln(3) + d2) & 3;
        if (m14 === 3)
          m14 = -1;
        if (m24 === 3)
          m24 = -1;
        var u1;
        if ((m14 & 1) === 0) {
          u1 = 0;
        } else {
          m8 = (k1.andln(7) + d1) & 7;
          if ((m8 === 3 || m8 === 5) && m24 === 2)
            u1 = -m14;
          else
            u1 = m14;
        }
        jsf[0].push(u1);

        var u2;
        if ((m24 & 1) === 0) {
          u2 = 0;
        } else {
          m8 = (k2.andln(7) + d2) & 7;
          if ((m8 === 3 || m8 === 5) && m14 === 2)
            u2 = -m24;
          else
            u2 = m24;
        }
        jsf[1].push(u2);

        // Second phase
        if (2 * d1 === u1 + 1)
          d1 = 1 - d1;
        if (2 * d2 === u2 + 1)
          d2 = 1 - d2;
        k1.iushrn(1);
        k2.iushrn(1);
      }

      return jsf;
    }
    utils.getJSF = getJSF;

    function cachedProperty(obj, name, computer) {
      var key = '_' + name;
      obj.prototype[name] = function cachedProperty() {
        return this[key] !== undefined ? this[key] :
          this[key] = computer.call(this);
      };
    }
    utils.cachedProperty = cachedProperty;

    function parseBytes(bytes) {
      return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
        bytes;
    }
    utils.parseBytes = parseBytes;

    function intFromLE(bytes) {
      return new bn(bytes, 'hex', 'le');
    }
    utils.intFromLE = intFromLE;
    });

    var r$1;

    var brorand = function rand(len) {
      if (!r$1)
        r$1 = new Rand(null);

      return r$1.generate(len);
    };

    function Rand(rand) {
      this.rand = rand;
    }
    var Rand_1 = Rand;

    Rand.prototype.generate = function generate(len) {
      return this._rand(len);
    };

    // Emulate crypto API using randy
    Rand.prototype._rand = function _rand(n) {
      if (this.rand.getBytes)
        return this.rand.getBytes(n);

      var res = new Uint8Array(n);
      for (var i = 0; i < res.length; i++)
        res[i] = this.rand.getByte();
      return res;
    };

    if (typeof self === 'object') {
      if (self.crypto && self.crypto.getRandomValues) {
        // Modern browsers
        Rand.prototype._rand = function _rand(n) {
          var arr = new Uint8Array(n);
          self.crypto.getRandomValues(arr);
          return arr;
        };
      } else if (self.msCrypto && self.msCrypto.getRandomValues) {
        // IE
        Rand.prototype._rand = function _rand(n) {
          var arr = new Uint8Array(n);
          self.msCrypto.getRandomValues(arr);
          return arr;
        };

      // Safari's WebWorkers do not have `crypto`
      } else if (typeof window === 'object') {
        // Old junk
        Rand.prototype._rand = function() {
          throw new Error('Not implemented yet');
        };
      }
    } else {
      // Node.js or Web worker with no crypto support
      try {
        var crypto = require$$0;
        if (typeof crypto.randomBytes !== 'function')
          throw new Error('Not supported');

        Rand.prototype._rand = function _rand(n) {
          return crypto.randomBytes(n);
        };
      } catch (e) {
      }
    }
    brorand.Rand = Rand_1;

    var getNAF = utils_1.getNAF;
    var getJSF = utils_1.getJSF;
    var assert$8 = utils_1.assert;

    function BaseCurve(type, conf) {
      this.type = type;
      this.p = new bn(conf.p, 16);

      // Use Montgomery, when there is no fast reduction for the prime
      this.red = conf.prime ? bn.red(conf.prime) : bn.mont(this.p);

      // Useful for many curves
      this.zero = new bn(0).toRed(this.red);
      this.one = new bn(1).toRed(this.red);
      this.two = new bn(2).toRed(this.red);

      // Curve configuration, optional
      this.n = conf.n && new bn(conf.n, 16);
      this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

      // Temporary arrays
      this._wnafT1 = new Array(4);
      this._wnafT2 = new Array(4);
      this._wnafT3 = new Array(4);
      this._wnafT4 = new Array(4);

      this._bitLength = this.n ? this.n.bitLength() : 0;

      // Generalized Greg Maxwell's trick
      var adjustCount = this.n && this.p.div(this.n);
      if (!adjustCount || adjustCount.cmpn(100) > 0) {
        this.redN = null;
      } else {
        this._maxwellTrick = true;
        this.redN = this.n.toRed(this.red);
      }
    }
    var base = BaseCurve;

    BaseCurve.prototype.point = function point() {
      throw new Error('Not implemented');
    };

    BaseCurve.prototype.validate = function validate() {
      throw new Error('Not implemented');
    };

    BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
      assert$8(p.precomputed);
      var doubles = p._getDoubles();

      var naf = getNAF(k, 1, this._bitLength);
      var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
      I /= 3;

      // Translate into more windowed form
      var repr = [];
      var j;
      var nafW;
      for (j = 0; j < naf.length; j += doubles.step) {
        nafW = 0;
        for (var l = j + doubles.step - 1; l >= j; l--)
          nafW = (nafW << 1) + naf[l];
        repr.push(nafW);
      }

      var a = this.jpoint(null, null, null);
      var b = this.jpoint(null, null, null);
      for (var i = I; i > 0; i--) {
        for (j = 0; j < repr.length; j++) {
          nafW = repr[j];
          if (nafW === i)
            b = b.mixedAdd(doubles.points[j]);
          else if (nafW === -i)
            b = b.mixedAdd(doubles.points[j].neg());
        }
        a = a.add(b);
      }
      return a.toP();
    };

    BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
      var w = 4;

      // Precompute window
      var nafPoints = p._getNAFPoints(w);
      w = nafPoints.wnd;
      var wnd = nafPoints.points;

      // Get NAF form
      var naf = getNAF(k, w, this._bitLength);

      // Add `this`*(N+1) for every w-NAF index
      var acc = this.jpoint(null, null, null);
      for (var i = naf.length - 1; i >= 0; i--) {
        // Count zeroes
        for (var l = 0; i >= 0 && naf[i] === 0; i--)
          l++;
        if (i >= 0)
          l++;
        acc = acc.dblp(l);

        if (i < 0)
          break;
        var z = naf[i];
        assert$8(z !== 0);
        if (p.type === 'affine') {
          // J +- P
          if (z > 0)
            acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
          else
            acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
        } else {
          // J +- J
          if (z > 0)
            acc = acc.add(wnd[(z - 1) >> 1]);
          else
            acc = acc.add(wnd[(-z - 1) >> 1].neg());
        }
      }
      return p.type === 'affine' ? acc.toP() : acc;
    };

    BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
      points,
      coeffs,
      len,
      jacobianResult) {
      var wndWidth = this._wnafT1;
      var wnd = this._wnafT2;
      var naf = this._wnafT3;

      // Fill all arrays
      var max = 0;
      var i;
      var j;
      var p;
      for (i = 0; i < len; i++) {
        p = points[i];
        var nafPoints = p._getNAFPoints(defW);
        wndWidth[i] = nafPoints.wnd;
        wnd[i] = nafPoints.points;
      }

      // Comb small window NAFs
      for (i = len - 1; i >= 1; i -= 2) {
        var a = i - 1;
        var b = i;
        if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
          naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
          naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
          max = Math.max(naf[a].length, max);
          max = Math.max(naf[b].length, max);
          continue;
        }

        var comb = [
          points[a], /* 1 */
          null, /* 3 */
          null, /* 5 */
          points[b], /* 7 */
        ];

        // Try to avoid Projective points, if possible
        if (points[a].y.cmp(points[b].y) === 0) {
          comb[1] = points[a].add(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].add(points[b].neg());
        } else {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        }

        var index = [
          -3, /* -1 -1 */
          -1, /* -1 0 */
          -5, /* -1 1 */
          -7, /* 0 -1 */
          0, /* 0 0 */
          7, /* 0 1 */
          5, /* 1 -1 */
          1, /* 1 0 */
          3,  /* 1 1 */
        ];

        var jsf = getJSF(coeffs[a], coeffs[b]);
        max = Math.max(jsf[0].length, max);
        naf[a] = new Array(max);
        naf[b] = new Array(max);
        for (j = 0; j < max; j++) {
          var ja = jsf[0][j] | 0;
          var jb = jsf[1][j] | 0;

          naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
          naf[b][j] = 0;
          wnd[a] = comb;
        }
      }

      var acc = this.jpoint(null, null, null);
      var tmp = this._wnafT4;
      for (i = max; i >= 0; i--) {
        var k = 0;

        while (i >= 0) {
          var zero = true;
          for (j = 0; j < len; j++) {
            tmp[j] = naf[j][i] | 0;
            if (tmp[j] !== 0)
              zero = false;
          }
          if (!zero)
            break;
          k++;
          i--;
        }
        if (i >= 0)
          k++;
        acc = acc.dblp(k);
        if (i < 0)
          break;

        for (j = 0; j < len; j++) {
          var z = tmp[j];
          if (z === 0)
            continue;
          else if (z > 0)
            p = wnd[j][(z - 1) >> 1];
          else if (z < 0)
            p = wnd[j][(-z - 1) >> 1].neg();

          if (p.type === 'affine')
            acc = acc.mixedAdd(p);
          else
            acc = acc.add(p);
        }
      }
      // Zeroify references
      for (i = 0; i < len; i++)
        wnd[i] = null;

      if (jacobianResult)
        return acc;
      else
        return acc.toP();
    };

    function BasePoint(curve, type) {
      this.curve = curve;
      this.type = type;
      this.precomputed = null;
    }
    BaseCurve.BasePoint = BasePoint;

    BasePoint.prototype.eq = function eq(/*other*/) {
      throw new Error('Not implemented');
    };

    BasePoint.prototype.validate = function validate() {
      return this.curve.validate(this);
    };

    BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      bytes = utils_1.toArray(bytes, enc);

      var len = this.p.byteLength();

      // uncompressed, hybrid-odd, hybrid-even
      if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
          bytes.length - 1 === 2 * len) {
        if (bytes[0] === 0x06)
          assert$8(bytes[bytes.length - 1] % 2 === 0);
        else if (bytes[0] === 0x07)
          assert$8(bytes[bytes.length - 1] % 2 === 1);

        var res =  this.point(bytes.slice(1, 1 + len),
          bytes.slice(1 + len, 1 + 2 * len));

        return res;
      } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
                  bytes.length - 1 === len) {
        return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
      }
      throw new Error('Unknown point format');
    };

    BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
      return this.encode(enc, true);
    };

    BasePoint.prototype._encode = function _encode(compact) {
      var len = this.curve.p.byteLength();
      var x = this.getX().toArray('be', len);

      if (compact)
        return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

      return [ 0x04 ].concat(x, this.getY().toArray('be', len));
    };

    BasePoint.prototype.encode = function encode(enc, compact) {
      return utils_1.encode(this._encode(compact), enc);
    };

    BasePoint.prototype.precompute = function precompute(power) {
      if (this.precomputed)
        return this;

      var precomputed = {
        doubles: null,
        naf: null,
        beta: null,
      };
      precomputed.naf = this._getNAFPoints(8);
      precomputed.doubles = this._getDoubles(4, power);
      precomputed.beta = this._getBeta();
      this.precomputed = precomputed;

      return this;
    };

    BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
      if (!this.precomputed)
        return false;

      var doubles = this.precomputed.doubles;
      if (!doubles)
        return false;

      return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
    };

    BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
      if (this.precomputed && this.precomputed.doubles)
        return this.precomputed.doubles;

      var doubles = [ this ];
      var acc = this;
      for (var i = 0; i < power; i += step) {
        for (var j = 0; j < step; j++)
          acc = acc.dbl();
        doubles.push(acc);
      }
      return {
        step: step,
        points: doubles,
      };
    };

    BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
      if (this.precomputed && this.precomputed.naf)
        return this.precomputed.naf;

      var res = [ this ];
      var max = (1 << wnd) - 1;
      var dbl = max === 1 ? null : this.dbl();
      for (var i = 1; i < max; i++)
        res[i] = res[i - 1].add(dbl);
      return {
        wnd: wnd,
        points: res,
      };
    };

    BasePoint.prototype._getBeta = function _getBeta() {
      return null;
    };

    BasePoint.prototype.dblp = function dblp(k) {
      var r = this;
      for (var i = 0; i < k; i++)
        r = r.dbl();
      return r;
    };

    var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
    });

    var assert$7 = utils_1.assert;

    function ShortCurve(conf) {
      base.call(this, 'short', conf);

      this.a = new bn(conf.a, 16).toRed(this.red);
      this.b = new bn(conf.b, 16).toRed(this.red);
      this.tinv = this.two.redInvm();

      this.zeroA = this.a.fromRed().cmpn(0) === 0;
      this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

      // If the curve is endomorphic, precalculate beta and lambda
      this.endo = this._getEndomorphism(conf);
      this._endoWnafT1 = new Array(4);
      this._endoWnafT2 = new Array(4);
    }
    inherits_browser(ShortCurve, base);
    var short = ShortCurve;

    ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
      // No efficient endomorphism
      if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
        return;

      // Compute beta and lambda, that lambda * P = (beta * Px; Py)
      var beta;
      var lambda;
      if (conf.beta) {
        beta = new bn(conf.beta, 16).toRed(this.red);
      } else {
        var betas = this._getEndoRoots(this.p);
        // Choose the smallest beta
        beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
        beta = beta.toRed(this.red);
      }
      if (conf.lambda) {
        lambda = new bn(conf.lambda, 16);
      } else {
        // Choose the lambda that is matching selected beta
        var lambdas = this._getEndoRoots(this.n);
        if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
          lambda = lambdas[0];
        } else {
          lambda = lambdas[1];
          assert$7(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
        }
      }

      // Get basis vectors, used for balanced length-two representation
      var basis;
      if (conf.basis) {
        basis = conf.basis.map(function(vec) {
          return {
            a: new bn(vec.a, 16),
            b: new bn(vec.b, 16),
          };
        });
      } else {
        basis = this._getEndoBasis(lambda);
      }

      return {
        beta: beta,
        lambda: lambda,
        basis: basis,
      };
    };

    ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
      // Find roots of for x^2 + x + 1 in F
      // Root = (-1 +- Sqrt(-3)) / 2
      //
      var red = num === this.p ? this.red : bn.mont(num);
      var tinv = new bn(2).toRed(red).redInvm();
      var ntinv = tinv.redNeg();

      var s = new bn(3).toRed(red).redNeg().redSqrt().redMul(tinv);

      var l1 = ntinv.redAdd(s).fromRed();
      var l2 = ntinv.redSub(s).fromRed();
      return [ l1, l2 ];
    };

    ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
      // aprxSqrt >= sqrt(this.n)
      var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

      // 3.74
      // Run EGCD, until r(L + 1) < aprxSqrt
      var u = lambda;
      var v = this.n.clone();
      var x1 = new bn(1);
      var y1 = new bn(0);
      var x2 = new bn(0);
      var y2 = new bn(1);

      // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
      var a0;
      var b0;
      // First vector
      var a1;
      var b1;
      // Second vector
      var a2;
      var b2;

      var prevR;
      var i = 0;
      var r;
      var x;
      while (u.cmpn(0) !== 0) {
        var q = v.div(u);
        r = v.sub(q.mul(u));
        x = x2.sub(q.mul(x1));
        var y = y2.sub(q.mul(y1));

        if (!a1 && r.cmp(aprxSqrt) < 0) {
          a0 = prevR.neg();
          b0 = x1;
          a1 = r.neg();
          b1 = x;
        } else if (a1 && ++i === 2) {
          break;
        }
        prevR = r;

        v = u;
        u = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
      }
      a2 = r.neg();
      b2 = x;

      var len1 = a1.sqr().add(b1.sqr());
      var len2 = a2.sqr().add(b2.sqr());
      if (len2.cmp(len1) >= 0) {
        a2 = a0;
        b2 = b0;
      }

      // Normalize signs
      if (a1.negative) {
        a1 = a1.neg();
        b1 = b1.neg();
      }
      if (a2.negative) {
        a2 = a2.neg();
        b2 = b2.neg();
      }

      return [
        { a: a1, b: b1 },
        { a: a2, b: b2 },
      ];
    };

    ShortCurve.prototype._endoSplit = function _endoSplit(k) {
      var basis = this.endo.basis;
      var v1 = basis[0];
      var v2 = basis[1];

      var c1 = v2.b.mul(k).divRound(this.n);
      var c2 = v1.b.neg().mul(k).divRound(this.n);

      var p1 = c1.mul(v1.a);
      var p2 = c2.mul(v2.a);
      var q1 = c1.mul(v1.b);
      var q2 = c2.mul(v2.b);

      // Calculate answer
      var k1 = k.sub(p1).sub(p2);
      var k2 = q1.add(q2).neg();
      return { k1: k1, k2: k2 };
    };

    ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new bn(x, 16);
      if (!x.red)
        x = x.toRed(this.red);

      var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
      var y = y2.redSqrt();
      if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
        throw new Error('invalid point');

      // XXX Is there any way to tell if the number is odd without converting it
      // to non-red form?
      var isOdd = y.fromRed().isOdd();
      if (odd && !isOdd || !odd && isOdd)
        y = y.redNeg();

      return this.point(x, y);
    };

    ShortCurve.prototype.validate = function validate(point) {
      if (point.inf)
        return true;

      var x = point.x;
      var y = point.y;

      var ax = this.a.redMul(x);
      var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
      return y.redSqr().redISub(rhs).cmpn(0) === 0;
    };

    ShortCurve.prototype._endoWnafMulAdd =
        function _endoWnafMulAdd(points, coeffs, jacobianResult) {
          var npoints = this._endoWnafT1;
          var ncoeffs = this._endoWnafT2;
          for (var i = 0; i < points.length; i++) {
            var split = this._endoSplit(coeffs[i]);
            var p = points[i];
            var beta = p._getBeta();

            if (split.k1.negative) {
              split.k1.ineg();
              p = p.neg(true);
            }
            if (split.k2.negative) {
              split.k2.ineg();
              beta = beta.neg(true);
            }

            npoints[i * 2] = p;
            npoints[i * 2 + 1] = beta;
            ncoeffs[i * 2] = split.k1;
            ncoeffs[i * 2 + 1] = split.k2;
          }
          var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

          // Clean-up references to points and coefficients
          for (var j = 0; j < i * 2; j++) {
            npoints[j] = null;
            ncoeffs[j] = null;
          }
          return res;
        };

    function Point$2(curve, x, y, isRed) {
      base.BasePoint.call(this, curve, 'affine');
      if (x === null && y === null) {
        this.x = null;
        this.y = null;
        this.inf = true;
      } else {
        this.x = new bn(x, 16);
        this.y = new bn(y, 16);
        // Force redgomery representation when loading from JSON
        if (isRed) {
          this.x.forceRed(this.curve.red);
          this.y.forceRed(this.curve.red);
        }
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.y.red)
          this.y = this.y.toRed(this.curve.red);
        this.inf = false;
      }
    }
    inherits_browser(Point$2, base.BasePoint);

    ShortCurve.prototype.point = function point(x, y, isRed) {
      return new Point$2(this, x, y, isRed);
    };

    ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
      return Point$2.fromJSON(this, obj, red);
    };

    Point$2.prototype._getBeta = function _getBeta() {
      if (!this.curve.endo)
        return;

      var pre = this.precomputed;
      if (pre && pre.beta)
        return pre.beta;

      var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
      if (pre) {
        var curve = this.curve;
        var endoMul = function(p) {
          return curve.point(p.x.redMul(curve.endo.beta), p.y);
        };
        pre.beta = beta;
        beta.precomputed = {
          beta: null,
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(endoMul),
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(endoMul),
          },
        };
      }
      return beta;
    };

    Point$2.prototype.toJSON = function toJSON() {
      if (!this.precomputed)
        return [ this.x, this.y ];

      return [ this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1),
        },
        naf: this.precomputed.naf && {
          wnd: this.precomputed.naf.wnd,
          points: this.precomputed.naf.points.slice(1),
        },
      } ];
    };

    Point$2.fromJSON = function fromJSON(curve, obj, red) {
      if (typeof obj === 'string')
        obj = JSON.parse(obj);
      var res = curve.point(obj[0], obj[1], red);
      if (!obj[2])
        return res;

      function obj2point(obj) {
        return curve.point(obj[0], obj[1], red);
      }

      var pre = obj[2];
      res.precomputed = {
        beta: null,
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: [ res ].concat(pre.doubles.points.map(obj2point)),
        },
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: [ res ].concat(pre.naf.points.map(obj2point)),
        },
      };
      return res;
    };

    Point$2.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return '<EC Point Infinity>';
      return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
          ' y: ' + this.y.fromRed().toString(16, 2) + '>';
    };

    Point$2.prototype.isInfinity = function isInfinity() {
      return this.inf;
    };

    Point$2.prototype.add = function add(p) {
      // O + P = P
      if (this.inf)
        return p;

      // P + O = P
      if (p.inf)
        return this;

      // P + P = 2P
      if (this.eq(p))
        return this.dbl();

      // P + (-P) = O
      if (this.neg().eq(p))
        return this.curve.point(null, null);

      // P + Q = O
      if (this.x.cmp(p.x) === 0)
        return this.curve.point(null, null);

      var c = this.y.redSub(p.y);
      if (c.cmpn(0) !== 0)
        c = c.redMul(this.x.redSub(p.x).redInvm());
      var nx = c.redSqr().redISub(this.x).redISub(p.x);
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };

    Point$2.prototype.dbl = function dbl() {
      if (this.inf)
        return this;

      // 2P = O
      var ys1 = this.y.redAdd(this.y);
      if (ys1.cmpn(0) === 0)
        return this.curve.point(null, null);

      var a = this.curve.a;

      var x2 = this.x.redSqr();
      var dyinv = ys1.redInvm();
      var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

      var nx = c.redSqr().redISub(this.x.redAdd(this.x));
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };

    Point$2.prototype.getX = function getX() {
      return this.x.fromRed();
    };

    Point$2.prototype.getY = function getY() {
      return this.y.fromRed();
    };

    Point$2.prototype.mul = function mul(k) {
      k = new bn(k, 16);
      if (this.isInfinity())
        return this;
      else if (this._hasDoubles(k))
        return this.curve._fixedNafMul(this, k);
      else if (this.curve.endo)
        return this.curve._endoWnafMulAdd([ this ], [ k ]);
      else
        return this.curve._wnafMul(this, k);
    };

    Point$2.prototype.mulAdd = function mulAdd(k1, p2, k2) {
      var points = [ this, p2 ];
      var coeffs = [ k1, k2 ];
      if (this.curve.endo)
        return this.curve._endoWnafMulAdd(points, coeffs);
      else
        return this.curve._wnafMulAdd(1, points, coeffs, 2);
    };

    Point$2.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
      var points = [ this, p2 ];
      var coeffs = [ k1, k2 ];
      if (this.curve.endo)
        return this.curve._endoWnafMulAdd(points, coeffs, true);
      else
        return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
    };

    Point$2.prototype.eq = function eq(p) {
      return this === p ||
             this.inf === p.inf &&
                 (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
    };

    Point$2.prototype.neg = function neg(_precompute) {
      if (this.inf)
        return this;

      var res = this.curve.point(this.x, this.y.redNeg());
      if (_precompute && this.precomputed) {
        var pre = this.precomputed;
        var negate = function(p) {
          return p.neg();
        };
        res.precomputed = {
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(negate),
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(negate),
          },
        };
      }
      return res;
    };

    Point$2.prototype.toJ = function toJ() {
      if (this.inf)
        return this.curve.jpoint(null, null, null);

      var res = this.curve.jpoint(this.x, this.y, this.curve.one);
      return res;
    };

    function JPoint(curve, x, y, z) {
      base.BasePoint.call(this, curve, 'jacobian');
      if (x === null && y === null && z === null) {
        this.x = this.curve.one;
        this.y = this.curve.one;
        this.z = new bn(0);
      } else {
        this.x = new bn(x, 16);
        this.y = new bn(y, 16);
        this.z = new bn(z, 16);
      }
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);

      this.zOne = this.z === this.curve.one;
    }
    inherits_browser(JPoint, base.BasePoint);

    ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
      return new JPoint(this, x, y, z);
    };

    JPoint.prototype.toP = function toP() {
      if (this.isInfinity())
        return this.curve.point(null, null);

      var zinv = this.z.redInvm();
      var zinv2 = zinv.redSqr();
      var ax = this.x.redMul(zinv2);
      var ay = this.y.redMul(zinv2).redMul(zinv);

      return this.curve.point(ax, ay);
    };

    JPoint.prototype.neg = function neg() {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    };

    JPoint.prototype.add = function add(p) {
      // O + P = P
      if (this.isInfinity())
        return p;

      // P + O = P
      if (p.isInfinity())
        return this;

      // 12M + 4S + 7A
      var pz2 = p.z.redSqr();
      var z2 = this.z.redSqr();
      var u1 = this.x.redMul(pz2);
      var u2 = p.x.redMul(z2);
      var s1 = this.y.redMul(pz2.redMul(p.z));
      var s2 = p.y.redMul(z2.redMul(this.z));

      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0)
          return this.curve.jpoint(null, null, null);
        else
          return this.dbl();
      }

      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);

      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(p.z).redMul(h);

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype.mixedAdd = function mixedAdd(p) {
      // O + P = P
      if (this.isInfinity())
        return p.toJ();

      // P + O = P
      if (p.isInfinity())
        return this;

      // 8M + 3S + 7A
      var z2 = this.z.redSqr();
      var u1 = this.x;
      var u2 = p.x.redMul(z2);
      var s1 = this.y;
      var s2 = p.y.redMul(z2).redMul(this.z);

      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0)
          return this.curve.jpoint(null, null, null);
        else
          return this.dbl();
      }

      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);

      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(h);

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype.dblp = function dblp(pow) {
      if (pow === 0)
        return this;
      if (this.isInfinity())
        return this;
      if (!pow)
        return this.dbl();

      var i;
      if (this.curve.zeroA || this.curve.threeA) {
        var r = this;
        for (i = 0; i < pow; i++)
          r = r.dbl();
        return r;
      }

      // 1M + 2S + 1A + N * (4S + 5M + 8A)
      // N = 1 => 6M + 6S + 9A
      var a = this.curve.a;
      var tinv = this.curve.tinv;

      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();

      // Reuse results
      var jyd = jy.redAdd(jy);
      for (i = 0; i < pow; i++) {
        var jx2 = jx.redSqr();
        var jyd2 = jyd.redSqr();
        var jyd4 = jyd2.redSqr();
        var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

        var t1 = jx.redMul(jyd2);
        var nx = c.redSqr().redISub(t1.redAdd(t1));
        var t2 = t1.redISub(nx);
        var dny = c.redMul(t2);
        dny = dny.redIAdd(dny).redISub(jyd4);
        var nz = jyd.redMul(jz);
        if (i + 1 < pow)
          jz4 = jz4.redMul(jyd4);

        jx = nx;
        jz = nz;
        jyd = dny;
      }

      return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
    };

    JPoint.prototype.dbl = function dbl() {
      if (this.isInfinity())
        return this;

      if (this.curve.zeroA)
        return this._zeroDbl();
      else if (this.curve.threeA)
        return this._threeDbl();
      else
        return this._dbl();
    };

    JPoint.prototype._zeroDbl = function _zeroDbl() {
      var nx;
      var ny;
      var nz;
      // Z = 1
      if (this.zOne) {
        // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
        //     #doubling-mdbl-2007-bl
        // 1M + 5S + 14A

        // XX = X1^2
        var xx = this.x.redSqr();
        // YY = Y1^2
        var yy = this.y.redSqr();
        // YYYY = YY^2
        var yyyy = yy.redSqr();
        // S = 2 * ((X1 + YY)^2 - XX - YYYY)
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        // M = 3 * XX + a; a = 0
        var m = xx.redAdd(xx).redIAdd(xx);
        // T = M ^ 2 - 2*S
        var t = m.redSqr().redISub(s).redISub(s);

        // 8 * YYYY
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);

        // X3 = T
        nx = t;
        // Y3 = M * (S - T) - 8 * YYYY
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        // Z3 = 2*Y1
        nz = this.y.redAdd(this.y);
      } else {
        // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
        //     #doubling-dbl-2009-l
        // 2M + 5S + 13A

        // A = X1^2
        var a = this.x.redSqr();
        // B = Y1^2
        var b = this.y.redSqr();
        // C = B^2
        var c = b.redSqr();
        // D = 2 * ((X1 + B)^2 - A - C)
        var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
        d = d.redIAdd(d);
        // E = 3 * A
        var e = a.redAdd(a).redIAdd(a);
        // F = E^2
        var f = e.redSqr();

        // 8 * C
        var c8 = c.redIAdd(c);
        c8 = c8.redIAdd(c8);
        c8 = c8.redIAdd(c8);

        // X3 = F - 2 * D
        nx = f.redISub(d).redISub(d);
        // Y3 = E * (D - X3) - 8 * C
        ny = e.redMul(d.redISub(nx)).redISub(c8);
        // Z3 = 2 * Y1 * Z1
        nz = this.y.redMul(this.z);
        nz = nz.redIAdd(nz);
      }

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype._threeDbl = function _threeDbl() {
      var nx;
      var ny;
      var nz;
      // Z = 1
      if (this.zOne) {
        // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
        //     #doubling-mdbl-2007-bl
        // 1M + 5S + 15A

        // XX = X1^2
        var xx = this.x.redSqr();
        // YY = Y1^2
        var yy = this.y.redSqr();
        // YYYY = YY^2
        var yyyy = yy.redSqr();
        // S = 2 * ((X1 + YY)^2 - XX - YYYY)
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        // M = 3 * XX + a
        var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
        // T = M^2 - 2 * S
        var t = m.redSqr().redISub(s).redISub(s);
        // X3 = T
        nx = t;
        // Y3 = M * (S - T) - 8 * YYYY
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        // Z3 = 2 * Y1
        nz = this.y.redAdd(this.y);
      } else {
        // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
        // 3M + 5S

        // delta = Z1^2
        var delta = this.z.redSqr();
        // gamma = Y1^2
        var gamma = this.y.redSqr();
        // beta = X1 * gamma
        var beta = this.x.redMul(gamma);
        // alpha = 3 * (X1 - delta) * (X1 + delta)
        var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
        alpha = alpha.redAdd(alpha).redIAdd(alpha);
        // X3 = alpha^2 - 8 * beta
        var beta4 = beta.redIAdd(beta);
        beta4 = beta4.redIAdd(beta4);
        var beta8 = beta4.redAdd(beta4);
        nx = alpha.redSqr().redISub(beta8);
        // Z3 = (Y1 + Z1)^2 - gamma - delta
        nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
        // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
        var ggamma8 = gamma.redSqr();
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
      }

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype._dbl = function _dbl() {
      var a = this.curve.a;

      // 4M + 6S + 10A
      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();

      var jx2 = jx.redSqr();
      var jy2 = jy.redSqr();

      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

      var jxd4 = jx.redAdd(jx);
      jxd4 = jxd4.redIAdd(jxd4);
      var t1 = jxd4.redMul(jy2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);

      var jyd8 = jy2.redSqr();
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      var ny = c.redMul(t2).redISub(jyd8);
      var nz = jy.redAdd(jy).redMul(jz);

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype.trpl = function trpl() {
      if (!this.curve.zeroA)
        return this.dbl().add(this);

      // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
      // 5M + 10S + ...

      // XX = X1^2
      var xx = this.x.redSqr();
      // YY = Y1^2
      var yy = this.y.redSqr();
      // ZZ = Z1^2
      var zz = this.z.redSqr();
      // YYYY = YY^2
      var yyyy = yy.redSqr();
      // M = 3 * XX + a * ZZ2; a = 0
      var m = xx.redAdd(xx).redIAdd(xx);
      // MM = M^2
      var mm = m.redSqr();
      // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
      var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      e = e.redIAdd(e);
      e = e.redAdd(e).redIAdd(e);
      e = e.redISub(mm);
      // EE = E^2
      var ee = e.redSqr();
      // T = 16*YYYY
      var t = yyyy.redIAdd(yyyy);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      // U = (M + E)^2 - MM - EE - T
      var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
      // X3 = 4 * (X1 * EE - 4 * YY * U)
      var yyu4 = yy.redMul(u);
      yyu4 = yyu4.redIAdd(yyu4);
      yyu4 = yyu4.redIAdd(yyu4);
      var nx = this.x.redMul(ee).redISub(yyu4);
      nx = nx.redIAdd(nx);
      nx = nx.redIAdd(nx);
      // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
      var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      // Z3 = (Z1 + E)^2 - ZZ - EE
      var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

      return this.curve.jpoint(nx, ny, nz);
    };

    JPoint.prototype.mul = function mul(k, kbase) {
      k = new bn(k, kbase);

      return this.curve._wnafMul(this, k);
    };

    JPoint.prototype.eq = function eq(p) {
      if (p.type === 'affine')
        return this.eq(p.toJ());

      if (this === p)
        return true;

      // x1 * z2^2 == x2 * z1^2
      var z2 = this.z.redSqr();
      var pz2 = p.z.redSqr();
      if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
        return false;

      // y1 * z2^3 == y2 * z1^3
      var z3 = z2.redMul(this.z);
      var pz3 = pz2.redMul(p.z);
      return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
    };

    JPoint.prototype.eqXToP = function eqXToP(x) {
      var zs = this.z.redSqr();
      var rx = x.toRed(this.curve.red).redMul(zs);
      if (this.x.cmp(rx) === 0)
        return true;

      var xc = x.clone();
      var t = this.curve.redN.redMul(zs);
      for (;;) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0)
          return false;

        rx.redIAdd(t);
        if (this.x.cmp(rx) === 0)
          return true;
      }
    };

    JPoint.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return '<EC JPoint Infinity>';
      return '<EC JPoint x: ' + this.x.toString(16, 2) +
          ' y: ' + this.y.toString(16, 2) +
          ' z: ' + this.z.toString(16, 2) + '>';
    };

    JPoint.prototype.isInfinity = function isInfinity() {
      // XXX This code assumes that zero is always zero in red
      return this.z.cmpn(0) === 0;
    };

    function MontCurve(conf) {
      base.call(this, 'mont', conf);

      this.a = new bn(conf.a, 16).toRed(this.red);
      this.b = new bn(conf.b, 16).toRed(this.red);
      this.i4 = new bn(4).toRed(this.red).redInvm();
      this.two = new bn(2).toRed(this.red);
      this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    inherits_browser(MontCurve, base);
    var mont = MontCurve;

    MontCurve.prototype.validate = function validate(point) {
      var x = point.normalize().x;
      var x2 = x.redSqr();
      var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
      var y = rhs.redSqrt();

      return y.redSqr().cmp(rhs) === 0;
    };

    function Point$1(curve, x, z) {
      base.BasePoint.call(this, curve, 'projective');
      if (x === null && z === null) {
        this.x = this.curve.one;
        this.z = this.curve.zero;
      } else {
        this.x = new bn(x, 16);
        this.z = new bn(z, 16);
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.z.red)
          this.z = this.z.toRed(this.curve.red);
      }
    }
    inherits_browser(Point$1, base.BasePoint);

    MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      return this.point(utils_1.toArray(bytes, enc), 1);
    };

    MontCurve.prototype.point = function point(x, z) {
      return new Point$1(this, x, z);
    };

    MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point$1.fromJSON(this, obj);
    };

    Point$1.prototype.precompute = function precompute() {
      // No-op
    };

    Point$1.prototype._encode = function _encode() {
      return this.getX().toArray('be', this.curve.p.byteLength());
    };

    Point$1.fromJSON = function fromJSON(curve, obj) {
      return new Point$1(curve, obj[0], obj[1] || curve.one);
    };

    Point$1.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return '<EC Point Infinity>';
      return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
          ' z: ' + this.z.fromRed().toString(16, 2) + '>';
    };

    Point$1.prototype.isInfinity = function isInfinity() {
      // XXX This code assumes that zero is always zero in red
      return this.z.cmpn(0) === 0;
    };

    Point$1.prototype.dbl = function dbl() {
      // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
      // 2M + 2S + 4A

      // A = X1 + Z1
      var a = this.x.redAdd(this.z);
      // AA = A^2
      var aa = a.redSqr();
      // B = X1 - Z1
      var b = this.x.redSub(this.z);
      // BB = B^2
      var bb = b.redSqr();
      // C = AA - BB
      var c = aa.redSub(bb);
      // X3 = AA * BB
      var nx = aa.redMul(bb);
      // Z3 = C * (BB + A24 * C)
      var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
      return this.curve.point(nx, nz);
    };

    Point$1.prototype.add = function add() {
      throw new Error('Not supported on Montgomery curve');
    };

    Point$1.prototype.diffAdd = function diffAdd(p, diff) {
      // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
      // 4M + 2S + 6A

      // A = X2 + Z2
      var a = this.x.redAdd(this.z);
      // B = X2 - Z2
      var b = this.x.redSub(this.z);
      // C = X3 + Z3
      var c = p.x.redAdd(p.z);
      // D = X3 - Z3
      var d = p.x.redSub(p.z);
      // DA = D * A
      var da = d.redMul(a);
      // CB = C * B
      var cb = c.redMul(b);
      // X5 = Z1 * (DA + CB)^2
      var nx = diff.z.redMul(da.redAdd(cb).redSqr());
      // Z5 = X1 * (DA - CB)^2
      var nz = diff.x.redMul(da.redISub(cb).redSqr());
      return this.curve.point(nx, nz);
    };

    Point$1.prototype.mul = function mul(k) {
      var t = k.clone();
      var a = this; // (N / 2) * Q + Q
      var b = this.curve.point(null, null); // (N / 2) * Q
      var c = this; // Q

      for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
        bits.push(t.andln(1));

      for (var i = bits.length - 1; i >= 0; i--) {
        if (bits[i] === 0) {
          // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
          a = a.diffAdd(b, c);
          // N * Q = 2 * ((N / 2) * Q + Q))
          b = b.dbl();
        } else {
          // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
          b = a.diffAdd(b, c);
          // N * Q + Q = 2 * ((N / 2) * Q + Q)
          a = a.dbl();
        }
      }
      return b;
    };

    Point$1.prototype.mulAdd = function mulAdd() {
      throw new Error('Not supported on Montgomery curve');
    };

    Point$1.prototype.jumlAdd = function jumlAdd() {
      throw new Error('Not supported on Montgomery curve');
    };

    Point$1.prototype.eq = function eq(other) {
      return this.getX().cmp(other.getX()) === 0;
    };

    Point$1.prototype.normalize = function normalize() {
      this.x = this.x.redMul(this.z.redInvm());
      this.z = this.curve.one;
      return this;
    };

    Point$1.prototype.getX = function getX() {
      // Normalize coordinates
      this.normalize();

      return this.x.fromRed();
    };

    var assert$6 = utils_1.assert;

    function EdwardsCurve(conf) {
      // NOTE: Important as we are creating point in Base.call()
      this.twisted = (conf.a | 0) !== 1;
      this.mOneA = this.twisted && (conf.a | 0) === -1;
      this.extended = this.mOneA;

      base.call(this, 'edwards', conf);

      this.a = new bn(conf.a, 16).umod(this.red.m);
      this.a = this.a.toRed(this.red);
      this.c = new bn(conf.c, 16).toRed(this.red);
      this.c2 = this.c.redSqr();
      this.d = new bn(conf.d, 16).toRed(this.red);
      this.dd = this.d.redAdd(this.d);

      assert$6(!this.twisted || this.c.fromRed().cmpn(1) === 0);
      this.oneC = (conf.c | 0) === 1;
    }
    inherits_browser(EdwardsCurve, base);
    var edwards = EdwardsCurve;

    EdwardsCurve.prototype._mulA = function _mulA(num) {
      if (this.mOneA)
        return num.redNeg();
      else
        return this.a.redMul(num);
    };

    EdwardsCurve.prototype._mulC = function _mulC(num) {
      if (this.oneC)
        return num;
      else
        return this.c.redMul(num);
    };

    // Just for compatibility with Short curve
    EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
      return this.point(x, y, z, t);
    };

    EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new bn(x, 16);
      if (!x.red)
        x = x.toRed(this.red);

      var x2 = x.redSqr();
      var rhs = this.c2.redSub(this.a.redMul(x2));
      var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

      var y2 = rhs.redMul(lhs.redInvm());
      var y = y2.redSqrt();
      if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
        throw new Error('invalid point');

      var isOdd = y.fromRed().isOdd();
      if (odd && !isOdd || !odd && isOdd)
        y = y.redNeg();

      return this.point(x, y);
    };

    EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
      y = new bn(y, 16);
      if (!y.red)
        y = y.toRed(this.red);

      // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)
      var y2 = y.redSqr();
      var lhs = y2.redSub(this.c2);
      var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
      var x2 = lhs.redMul(rhs.redInvm());

      if (x2.cmp(this.zero) === 0) {
        if (odd)
          throw new Error('invalid point');
        else
          return this.point(this.zero, y);
      }

      var x = x2.redSqrt();
      if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
        throw new Error('invalid point');

      if (x.fromRed().isOdd() !== odd)
        x = x.redNeg();

      return this.point(x, y);
    };

    EdwardsCurve.prototype.validate = function validate(point) {
      if (point.isInfinity())
        return true;

      // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
      point.normalize();

      var x2 = point.x.redSqr();
      var y2 = point.y.redSqr();
      var lhs = x2.redMul(this.a).redAdd(y2);
      var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

      return lhs.cmp(rhs) === 0;
    };

    function Point(curve, x, y, z, t) {
      base.BasePoint.call(this, curve, 'projective');
      if (x === null && y === null && z === null) {
        this.x = this.curve.zero;
        this.y = this.curve.one;
        this.z = this.curve.one;
        this.t = this.curve.zero;
        this.zOne = true;
      } else {
        this.x = new bn(x, 16);
        this.y = new bn(y, 16);
        this.z = z ? new bn(z, 16) : this.curve.one;
        this.t = t && new bn(t, 16);
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.y.red)
          this.y = this.y.toRed(this.curve.red);
        if (!this.z.red)
          this.z = this.z.toRed(this.curve.red);
        if (this.t && !this.t.red)
          this.t = this.t.toRed(this.curve.red);
        this.zOne = this.z === this.curve.one;

        // Use extended coordinates
        if (this.curve.extended && !this.t) {
          this.t = this.x.redMul(this.y);
          if (!this.zOne)
            this.t = this.t.redMul(this.z.redInvm());
        }
      }
    }
    inherits_browser(Point, base.BasePoint);

    EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point.fromJSON(this, obj);
    };

    EdwardsCurve.prototype.point = function point(x, y, z, t) {
      return new Point(this, x, y, z, t);
    };

    Point.fromJSON = function fromJSON(curve, obj) {
      return new Point(curve, obj[0], obj[1], obj[2]);
    };

    Point.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return '<EC Point Infinity>';
      return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
          ' y: ' + this.y.fromRed().toString(16, 2) +
          ' z: ' + this.z.fromRed().toString(16, 2) + '>';
    };

    Point.prototype.isInfinity = function isInfinity() {
      // XXX This code assumes that zero is always zero in red
      return this.x.cmpn(0) === 0 &&
        (this.y.cmp(this.z) === 0 ||
        (this.zOne && this.y.cmp(this.curve.c) === 0));
    };

    Point.prototype._extDbl = function _extDbl() {
      // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
      //     #doubling-dbl-2008-hwcd
      // 4M + 4S

      // A = X1^2
      var a = this.x.redSqr();
      // B = Y1^2
      var b = this.y.redSqr();
      // C = 2 * Z1^2
      var c = this.z.redSqr();
      c = c.redIAdd(c);
      // D = a * A
      var d = this.curve._mulA(a);
      // E = (X1 + Y1)^2 - A - B
      var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
      // G = D + B
      var g = d.redAdd(b);
      // F = G - C
      var f = g.redSub(c);
      // H = D - B
      var h = d.redSub(b);
      // X3 = E * F
      var nx = e.redMul(f);
      // Y3 = G * H
      var ny = g.redMul(h);
      // T3 = E * H
      var nt = e.redMul(h);
      // Z3 = F * G
      var nz = f.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };

    Point.prototype._projDbl = function _projDbl() {
      // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
      //     #doubling-dbl-2008-bbjlp
      //     #doubling-dbl-2007-bl
      // and others
      // Generally 3M + 4S or 2M + 4S

      // B = (X1 + Y1)^2
      var b = this.x.redAdd(this.y).redSqr();
      // C = X1^2
      var c = this.x.redSqr();
      // D = Y1^2
      var d = this.y.redSqr();

      var nx;
      var ny;
      var nz;
      var e;
      var h;
      var j;
      if (this.curve.twisted) {
        // E = a * C
        e = this.curve._mulA(c);
        // F = E + D
        var f = e.redAdd(d);
        if (this.zOne) {
          // X3 = (B - C - D) * (F - 2)
          nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
          // Y3 = F * (E - D)
          ny = f.redMul(e.redSub(d));
          // Z3 = F^2 - 2 * F
          nz = f.redSqr().redSub(f).redSub(f);
        } else {
          // H = Z1^2
          h = this.z.redSqr();
          // J = F - 2 * H
          j = f.redSub(h).redISub(h);
          // X3 = (B-C-D)*J
          nx = b.redSub(c).redISub(d).redMul(j);
          // Y3 = F * (E - D)
          ny = f.redMul(e.redSub(d));
          // Z3 = F * J
          nz = f.redMul(j);
        }
      } else {
        // E = C + D
        e = c.redAdd(d);
        // H = (c * Z1)^2
        h = this.curve._mulC(this.z).redSqr();
        // J = E - 2 * H
        j = e.redSub(h).redSub(h);
        // X3 = c * (B - E) * J
        nx = this.curve._mulC(b.redISub(e)).redMul(j);
        // Y3 = c * E * (C - D)
        ny = this.curve._mulC(e).redMul(c.redISub(d));
        // Z3 = E * J
        nz = e.redMul(j);
      }
      return this.curve.point(nx, ny, nz);
    };

    Point.prototype.dbl = function dbl() {
      if (this.isInfinity())
        return this;

      // Double in extended coordinates
      if (this.curve.extended)
        return this._extDbl();
      else
        return this._projDbl();
    };

    Point.prototype._extAdd = function _extAdd(p) {
      // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
      //     #addition-add-2008-hwcd-3
      // 8M

      // A = (Y1 - X1) * (Y2 - X2)
      var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
      // B = (Y1 + X1) * (Y2 + X2)
      var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
      // C = T1 * k * T2
      var c = this.t.redMul(this.curve.dd).redMul(p.t);
      // D = Z1 * 2 * Z2
      var d = this.z.redMul(p.z.redAdd(p.z));
      // E = B - A
      var e = b.redSub(a);
      // F = D - C
      var f = d.redSub(c);
      // G = D + C
      var g = d.redAdd(c);
      // H = B + A
      var h = b.redAdd(a);
      // X3 = E * F
      var nx = e.redMul(f);
      // Y3 = G * H
      var ny = g.redMul(h);
      // T3 = E * H
      var nt = e.redMul(h);
      // Z3 = F * G
      var nz = f.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };

    Point.prototype._projAdd = function _projAdd(p) {
      // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
      //     #addition-add-2008-bbjlp
      //     #addition-add-2007-bl
      // 10M + 1S

      // A = Z1 * Z2
      var a = this.z.redMul(p.z);
      // B = A^2
      var b = a.redSqr();
      // C = X1 * X2
      var c = this.x.redMul(p.x);
      // D = Y1 * Y2
      var d = this.y.redMul(p.y);
      // E = d * C * D
      var e = this.curve.d.redMul(c).redMul(d);
      // F = B - E
      var f = b.redSub(e);
      // G = B + E
      var g = b.redAdd(e);
      // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
      var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
      var nx = a.redMul(f).redMul(tmp);
      var ny;
      var nz;
      if (this.curve.twisted) {
        // Y3 = A * G * (D - a * C)
        ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
        // Z3 = F * G
        nz = f.redMul(g);
      } else {
        // Y3 = A * G * (D - C)
        ny = a.redMul(g).redMul(d.redSub(c));
        // Z3 = c * F * G
        nz = this.curve._mulC(f).redMul(g);
      }
      return this.curve.point(nx, ny, nz);
    };

    Point.prototype.add = function add(p) {
      if (this.isInfinity())
        return p;
      if (p.isInfinity())
        return this;

      if (this.curve.extended)
        return this._extAdd(p);
      else
        return this._projAdd(p);
    };

    Point.prototype.mul = function mul(k) {
      if (this._hasDoubles(k))
        return this.curve._fixedNafMul(this, k);
      else
        return this.curve._wnafMul(this, k);
    };

    Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
    };

    Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
    };

    Point.prototype.normalize = function normalize() {
      if (this.zOne)
        return this;

      // Normalize coordinates
      var zi = this.z.redInvm();
      this.x = this.x.redMul(zi);
      this.y = this.y.redMul(zi);
      if (this.t)
        this.t = this.t.redMul(zi);
      this.z = this.curve.one;
      this.zOne = true;
      return this;
    };

    Point.prototype.neg = function neg() {
      return this.curve.point(this.x.redNeg(),
        this.y,
        this.z,
        this.t && this.t.redNeg());
    };

    Point.prototype.getX = function getX() {
      this.normalize();
      return this.x.fromRed();
    };

    Point.prototype.getY = function getY() {
      this.normalize();
      return this.y.fromRed();
    };

    Point.prototype.eq = function eq(other) {
      return this === other ||
             this.getX().cmp(other.getX()) === 0 &&
             this.getY().cmp(other.getY()) === 0;
    };

    Point.prototype.eqXToP = function eqXToP(x) {
      var rx = x.toRed(this.curve.red).redMul(this.z);
      if (this.x.cmp(rx) === 0)
        return true;

      var xc = x.clone();
      var t = this.curve.redN.redMul(this.z);
      for (;;) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0)
          return false;

        rx.redIAdd(t);
        if (this.x.cmp(rx) === 0)
          return true;
      }
    };

    // Compatibility with BaseCurve
    Point.prototype.toP = Point.prototype.normalize;
    Point.prototype.mixedAdd = Point.prototype.add;

    var curve_1 = createCommonjsModule(function (module, exports) {

    var curve = exports;

    curve.base = base;
    curve.short = short;
    curve.mont = mont;
    curve.edwards = edwards;
    });

    var inherits_1 = inherits_browser;

    function isSurrogatePair(msg, i) {
      if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
        return false;
      }
      if (i < 0 || i + 1 >= msg.length) {
        return false;
      }
      return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
    }

    function toArray(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg === 'string') {
        if (!enc) {
          // Inspired by stringToUtf8ByteArray() in closure-library by Google
          // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
          // Apache License 2.0
          // https://github.com/google/closure-library/blob/master/LICENSE
          var p = 0;
          for (var i = 0; i < msg.length; i++) {
            var c = msg.charCodeAt(i);
            if (c < 128) {
              res[p++] = c;
            } else if (c < 2048) {
              res[p++] = (c >> 6) | 192;
              res[p++] = (c & 63) | 128;
            } else if (isSurrogatePair(msg, i)) {
              c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
              res[p++] = (c >> 18) | 240;
              res[p++] = ((c >> 12) & 63) | 128;
              res[p++] = ((c >> 6) & 63) | 128;
              res[p++] = (c & 63) | 128;
            } else {
              res[p++] = (c >> 12) | 224;
              res[p++] = ((c >> 6) & 63) | 128;
              res[p++] = (c & 63) | 128;
            }
          }
        } else if (enc === 'hex') {
          msg = msg.replace(/[^a-z0-9]+/ig, '');
          if (msg.length % 2 !== 0)
            msg = '0' + msg;
          for (i = 0; i < msg.length; i += 2)
            res.push(parseInt(msg[i] + msg[i + 1], 16));
        }
      } else {
        for (i = 0; i < msg.length; i++)
          res[i] = msg[i] | 0;
      }
      return res;
    }
    var toArray_1 = toArray;

    function toHex(msg) {
      var res = '';
      for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
      return res;
    }
    var toHex_1 = toHex;

    function htonl(w) {
      var res = (w >>> 24) |
                ((w >>> 8) & 0xff00) |
                ((w << 8) & 0xff0000) |
                ((w & 0xff) << 24);
      return res >>> 0;
    }
    var htonl_1 = htonl;

    function toHex32(msg, endian) {
      var res = '';
      for (var i = 0; i < msg.length; i++) {
        var w = msg[i];
        if (endian === 'little')
          w = htonl(w);
        res += zero8(w.toString(16));
      }
      return res;
    }
    var toHex32_1 = toHex32;

    function zero2(word) {
      if (word.length === 1)
        return '0' + word;
      else
        return word;
    }
    var zero2_1 = zero2;

    function zero8(word) {
      if (word.length === 7)
        return '0' + word;
      else if (word.length === 6)
        return '00' + word;
      else if (word.length === 5)
        return '000' + word;
      else if (word.length === 4)
        return '0000' + word;
      else if (word.length === 3)
        return '00000' + word;
      else if (word.length === 2)
        return '000000' + word;
      else if (word.length === 1)
        return '0000000' + word;
      else
        return word;
    }
    var zero8_1 = zero8;

    function join32(msg, start, end, endian) {
      var len = end - start;
      minimalisticAssert(len % 4 === 0);
      var res = new Array(len / 4);
      for (var i = 0, k = start; i < res.length; i++, k += 4) {
        var w;
        if (endian === 'big')
          w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
        else
          w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
        res[i] = w >>> 0;
      }
      return res;
    }
    var join32_1 = join32;

    function split32(msg, endian) {
      var res = new Array(msg.length * 4);
      for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
        var m = msg[i];
        if (endian === 'big') {
          res[k] = m >>> 24;
          res[k + 1] = (m >>> 16) & 0xff;
          res[k + 2] = (m >>> 8) & 0xff;
          res[k + 3] = m & 0xff;
        } else {
          res[k + 3] = m >>> 24;
          res[k + 2] = (m >>> 16) & 0xff;
          res[k + 1] = (m >>> 8) & 0xff;
          res[k] = m & 0xff;
        }
      }
      return res;
    }
    var split32_1 = split32;

    function rotr32$1(w, b) {
      return (w >>> b) | (w << (32 - b));
    }
    var rotr32_1 = rotr32$1;

    function rotl32$2(w, b) {
      return (w << b) | (w >>> (32 - b));
    }
    var rotl32_1 = rotl32$2;

    function sum32$3(a, b) {
      return (a + b) >>> 0;
    }
    var sum32_1 = sum32$3;

    function sum32_3$1(a, b, c) {
      return (a + b + c) >>> 0;
    }
    var sum32_3_1 = sum32_3$1;

    function sum32_4$2(a, b, c, d) {
      return (a + b + c + d) >>> 0;
    }
    var sum32_4_1 = sum32_4$2;

    function sum32_5$2(a, b, c, d, e) {
      return (a + b + c + d + e) >>> 0;
    }
    var sum32_5_1 = sum32_5$2;

    function sum64$1(buf, pos, ah, al) {
      var bh = buf[pos];
      var bl = buf[pos + 1];

      var lo = (al + bl) >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      buf[pos] = hi >>> 0;
      buf[pos + 1] = lo;
    }
    var sum64_1 = sum64$1;

    function sum64_hi$1(ah, al, bh, bl) {
      var lo = (al + bl) >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      return hi >>> 0;
    }
    var sum64_hi_1 = sum64_hi$1;

    function sum64_lo$1(ah, al, bh, bl) {
      var lo = al + bl;
      return lo >>> 0;
    }
    var sum64_lo_1 = sum64_lo$1;

    function sum64_4_hi$1(ah, al, bh, bl, ch, cl, dh, dl) {
      var carry = 0;
      var lo = al;
      lo = (lo + bl) >>> 0;
      carry += lo < al ? 1 : 0;
      lo = (lo + cl) >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = (lo + dl) >>> 0;
      carry += lo < dl ? 1 : 0;

      var hi = ah + bh + ch + dh + carry;
      return hi >>> 0;
    }
    var sum64_4_hi_1 = sum64_4_hi$1;

    function sum64_4_lo$1(ah, al, bh, bl, ch, cl, dh, dl) {
      var lo = al + bl + cl + dl;
      return lo >>> 0;
    }
    var sum64_4_lo_1 = sum64_4_lo$1;

    function sum64_5_hi$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var carry = 0;
      var lo = al;
      lo = (lo + bl) >>> 0;
      carry += lo < al ? 1 : 0;
      lo = (lo + cl) >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = (lo + dl) >>> 0;
      carry += lo < dl ? 1 : 0;
      lo = (lo + el) >>> 0;
      carry += lo < el ? 1 : 0;

      var hi = ah + bh + ch + dh + eh + carry;
      return hi >>> 0;
    }
    var sum64_5_hi_1 = sum64_5_hi$1;

    function sum64_5_lo$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var lo = al + bl + cl + dl + el;

      return lo >>> 0;
    }
    var sum64_5_lo_1 = sum64_5_lo$1;

    function rotr64_hi$1(ah, al, num) {
      var r = (al << (32 - num)) | (ah >>> num);
      return r >>> 0;
    }
    var rotr64_hi_1 = rotr64_hi$1;

    function rotr64_lo$1(ah, al, num) {
      var r = (ah << (32 - num)) | (al >>> num);
      return r >>> 0;
    }
    var rotr64_lo_1 = rotr64_lo$1;

    function shr64_hi$1(ah, al, num) {
      return ah >>> num;
    }
    var shr64_hi_1 = shr64_hi$1;

    function shr64_lo$1(ah, al, num) {
      var r = (ah << (32 - num)) | (al >>> num);
      return r >>> 0;
    }
    var shr64_lo_1 = shr64_lo$1;

    var utils = {
    	inherits: inherits_1,
    	toArray: toArray_1,
    	toHex: toHex_1,
    	htonl: htonl_1,
    	toHex32: toHex32_1,
    	zero2: zero2_1,
    	zero8: zero8_1,
    	join32: join32_1,
    	split32: split32_1,
    	rotr32: rotr32_1,
    	rotl32: rotl32_1,
    	sum32: sum32_1,
    	sum32_3: sum32_3_1,
    	sum32_4: sum32_4_1,
    	sum32_5: sum32_5_1,
    	sum64: sum64_1,
    	sum64_hi: sum64_hi_1,
    	sum64_lo: sum64_lo_1,
    	sum64_4_hi: sum64_4_hi_1,
    	sum64_4_lo: sum64_4_lo_1,
    	sum64_5_hi: sum64_5_hi_1,
    	sum64_5_lo: sum64_5_lo_1,
    	rotr64_hi: rotr64_hi_1,
    	rotr64_lo: rotr64_lo_1,
    	shr64_hi: shr64_hi_1,
    	shr64_lo: shr64_lo_1
    };

    function BlockHash$4() {
      this.pending = null;
      this.pendingTotal = 0;
      this.blockSize = this.constructor.blockSize;
      this.outSize = this.constructor.outSize;
      this.hmacStrength = this.constructor.hmacStrength;
      this.padLength = this.constructor.padLength / 8;
      this.endian = 'big';

      this._delta8 = this.blockSize / 8;
      this._delta32 = this.blockSize / 32;
    }
    var BlockHash_1 = BlockHash$4;

    BlockHash$4.prototype.update = function update(msg, enc) {
      // Convert message to array, pad it, and join into 32bit blocks
      msg = utils.toArray(msg, enc);
      if (!this.pending)
        this.pending = msg;
      else
        this.pending = this.pending.concat(msg);
      this.pendingTotal += msg.length;

      // Enough data, try updating
      if (this.pending.length >= this._delta8) {
        msg = this.pending;

        // Process pending data in blocks
        var r = msg.length % this._delta8;
        this.pending = msg.slice(msg.length - r, msg.length);
        if (this.pending.length === 0)
          this.pending = null;

        msg = utils.join32(msg, 0, msg.length - r, this.endian);
        for (var i = 0; i < msg.length; i += this._delta32)
          this._update(msg, i, i + this._delta32);
      }

      return this;
    };

    BlockHash$4.prototype.digest = function digest(enc) {
      this.update(this._pad());
      minimalisticAssert(this.pending === null);

      return this._digest(enc);
    };

    BlockHash$4.prototype._pad = function pad() {
      var len = this.pendingTotal;
      var bytes = this._delta8;
      var k = bytes - ((len + this.padLength) % bytes);
      var res = new Array(k + this.padLength);
      res[0] = 0x80;
      for (var i = 1; i < k; i++)
        res[i] = 0;

      // Append length
      len <<= 3;
      if (this.endian === 'big') {
        for (var t = 8; t < this.padLength; t++)
          res[i++] = 0;

        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = (len >>> 24) & 0xff;
        res[i++] = (len >>> 16) & 0xff;
        res[i++] = (len >>> 8) & 0xff;
        res[i++] = len & 0xff;
      } else {
        res[i++] = len & 0xff;
        res[i++] = (len >>> 8) & 0xff;
        res[i++] = (len >>> 16) & 0xff;
        res[i++] = (len >>> 24) & 0xff;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;

        for (t = 8; t < this.padLength; t++)
          res[i++] = 0;
      }

      return res;
    };

    var common$1 = {
    	BlockHash: BlockHash_1
    };

    var rotr32 = utils.rotr32;

    function ft_1$1(s, x, y, z) {
      if (s === 0)
        return ch32$1(x, y, z);
      if (s === 1 || s === 3)
        return p32(x, y, z);
      if (s === 2)
        return maj32$1(x, y, z);
    }
    var ft_1_1 = ft_1$1;

    function ch32$1(x, y, z) {
      return (x & y) ^ ((~x) & z);
    }
    var ch32_1 = ch32$1;

    function maj32$1(x, y, z) {
      return (x & y) ^ (x & z) ^ (y & z);
    }
    var maj32_1 = maj32$1;

    function p32(x, y, z) {
      return x ^ y ^ z;
    }
    var p32_1 = p32;

    function s0_256$1(x) {
      return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
    }
    var s0_256_1 = s0_256$1;

    function s1_256$1(x) {
      return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
    }
    var s1_256_1 = s1_256$1;

    function g0_256$1(x) {
      return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
    }
    var g0_256_1 = g0_256$1;

    function g1_256$1(x) {
      return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
    }
    var g1_256_1 = g1_256$1;

    var common = {
    	ft_1: ft_1_1,
    	ch32: ch32_1,
    	maj32: maj32_1,
    	p32: p32_1,
    	s0_256: s0_256_1,
    	s1_256: s1_256_1,
    	g0_256: g0_256_1,
    	g1_256: g1_256_1
    };

    var rotl32$1 = utils.rotl32;
    var sum32$2 = utils.sum32;
    var sum32_5$1 = utils.sum32_5;
    var ft_1 = common.ft_1;
    var BlockHash$3 = common$1.BlockHash;

    var sha1_K = [
      0x5A827999, 0x6ED9EBA1,
      0x8F1BBCDC, 0xCA62C1D6
    ];

    function SHA1() {
      if (!(this instanceof SHA1))
        return new SHA1();

      BlockHash$3.call(this);
      this.h = [
        0x67452301, 0xefcdab89, 0x98badcfe,
        0x10325476, 0xc3d2e1f0 ];
      this.W = new Array(80);
    }

    utils.inherits(SHA1, BlockHash$3);
    var _1 = SHA1;

    SHA1.blockSize = 512;
    SHA1.outSize = 160;
    SHA1.hmacStrength = 80;
    SHA1.padLength = 64;

    SHA1.prototype._update = function _update(msg, start) {
      var W = this.W;

      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];

      for(; i < W.length; i++)
        W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];

      for (i = 0; i < W.length; i++) {
        var s = ~~(i / 20);
        var t = sum32_5$1(rotl32$1(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
        e = d;
        d = c;
        c = rotl32$1(b, 30);
        b = a;
        a = t;
      }

      this.h[0] = sum32$2(this.h[0], a);
      this.h[1] = sum32$2(this.h[1], b);
      this.h[2] = sum32$2(this.h[2], c);
      this.h[3] = sum32$2(this.h[3], d);
      this.h[4] = sum32$2(this.h[4], e);
    };

    SHA1.prototype._digest = function digest(enc) {
      if (enc === 'hex')
        return utils.toHex32(this.h, 'big');
      else
        return utils.split32(this.h, 'big');
    };

    var sum32$1 = utils.sum32;
    var sum32_4$1 = utils.sum32_4;
    var sum32_5 = utils.sum32_5;
    var ch32 = common.ch32;
    var maj32 = common.maj32;
    var s0_256 = common.s0_256;
    var s1_256 = common.s1_256;
    var g0_256 = common.g0_256;
    var g1_256 = common.g1_256;

    var BlockHash$2 = common$1.BlockHash;

    var sha256_K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
      0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
      0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
      0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
      0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
      0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    function SHA256() {
      if (!(this instanceof SHA256))
        return new SHA256();

      BlockHash$2.call(this);
      this.h = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
      ];
      this.k = sha256_K;
      this.W = new Array(64);
    }
    utils.inherits(SHA256, BlockHash$2);
    var _256 = SHA256;

    SHA256.blockSize = 512;
    SHA256.outSize = 256;
    SHA256.hmacStrength = 192;
    SHA256.padLength = 64;

    SHA256.prototype._update = function _update(msg, start) {
      var W = this.W;

      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i++)
        W[i] = sum32_4$1(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      var f = this.h[5];
      var g = this.h[6];
      var h = this.h[7];

      minimalisticAssert(this.k.length === W.length);
      for (i = 0; i < W.length; i++) {
        var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
        var T2 = sum32$1(s0_256(a), maj32(a, b, c));
        h = g;
        g = f;
        f = e;
        e = sum32$1(d, T1);
        d = c;
        c = b;
        b = a;
        a = sum32$1(T1, T2);
      }

      this.h[0] = sum32$1(this.h[0], a);
      this.h[1] = sum32$1(this.h[1], b);
      this.h[2] = sum32$1(this.h[2], c);
      this.h[3] = sum32$1(this.h[3], d);
      this.h[4] = sum32$1(this.h[4], e);
      this.h[5] = sum32$1(this.h[5], f);
      this.h[6] = sum32$1(this.h[6], g);
      this.h[7] = sum32$1(this.h[7], h);
    };

    SHA256.prototype._digest = function digest(enc) {
      if (enc === 'hex')
        return utils.toHex32(this.h, 'big');
      else
        return utils.split32(this.h, 'big');
    };

    function SHA224() {
      if (!(this instanceof SHA224))
        return new SHA224();

      _256.call(this);
      this.h = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
    }
    utils.inherits(SHA224, _256);
    var _224 = SHA224;

    SHA224.blockSize = 512;
    SHA224.outSize = 224;
    SHA224.hmacStrength = 192;
    SHA224.padLength = 64;

    SHA224.prototype._digest = function digest(enc) {
      // Just truncate output
      if (enc === 'hex')
        return utils.toHex32(this.h.slice(0, 7), 'big');
      else
        return utils.split32(this.h.slice(0, 7), 'big');
    };

    var rotr64_hi = utils.rotr64_hi;
    var rotr64_lo = utils.rotr64_lo;
    var shr64_hi = utils.shr64_hi;
    var shr64_lo = utils.shr64_lo;
    var sum64 = utils.sum64;
    var sum64_hi = utils.sum64_hi;
    var sum64_lo = utils.sum64_lo;
    var sum64_4_hi = utils.sum64_4_hi;
    var sum64_4_lo = utils.sum64_4_lo;
    var sum64_5_hi = utils.sum64_5_hi;
    var sum64_5_lo = utils.sum64_5_lo;

    var BlockHash$1 = common$1.BlockHash;

    var sha512_K = [
      0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
      0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
      0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
      0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
      0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
      0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
      0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
      0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
      0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
      0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
      0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
      0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
      0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
      0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
      0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
      0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
      0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
      0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
      0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
      0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
      0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
      0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
      0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
      0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
      0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
      0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
      0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
      0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
      0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
      0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
      0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
      0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
      0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
      0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
      0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
      0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
      0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
      0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
      0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
      0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
    ];

    function SHA512() {
      if (!(this instanceof SHA512))
        return new SHA512();

      BlockHash$1.call(this);
      this.h = [
        0x6a09e667, 0xf3bcc908,
        0xbb67ae85, 0x84caa73b,
        0x3c6ef372, 0xfe94f82b,
        0xa54ff53a, 0x5f1d36f1,
        0x510e527f, 0xade682d1,
        0x9b05688c, 0x2b3e6c1f,
        0x1f83d9ab, 0xfb41bd6b,
        0x5be0cd19, 0x137e2179 ];
      this.k = sha512_K;
      this.W = new Array(160);
    }
    utils.inherits(SHA512, BlockHash$1);
    var _512 = SHA512;

    SHA512.blockSize = 1024;
    SHA512.outSize = 512;
    SHA512.hmacStrength = 192;
    SHA512.padLength = 128;

    SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
      var W = this.W;

      // 32 x 32bit words
      for (var i = 0; i < 32; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i += 2) {
        var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
        var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
        var c1_hi = W[i - 14];  // i - 7
        var c1_lo = W[i - 13];
        var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
        var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
        var c3_hi = W[i - 32];  // i - 16
        var c3_lo = W[i - 31];

        W[i] = sum64_4_hi(
          c0_hi, c0_lo,
          c1_hi, c1_lo,
          c2_hi, c2_lo,
          c3_hi, c3_lo);
        W[i + 1] = sum64_4_lo(
          c0_hi, c0_lo,
          c1_hi, c1_lo,
          c2_hi, c2_lo,
          c3_hi, c3_lo);
      }
    };

    SHA512.prototype._update = function _update(msg, start) {
      this._prepareBlock(msg, start);

      var W = this.W;

      var ah = this.h[0];
      var al = this.h[1];
      var bh = this.h[2];
      var bl = this.h[3];
      var ch = this.h[4];
      var cl = this.h[5];
      var dh = this.h[6];
      var dl = this.h[7];
      var eh = this.h[8];
      var el = this.h[9];
      var fh = this.h[10];
      var fl = this.h[11];
      var gh = this.h[12];
      var gl = this.h[13];
      var hh = this.h[14];
      var hl = this.h[15];

      minimalisticAssert(this.k.length === W.length);
      for (var i = 0; i < W.length; i += 2) {
        var c0_hi = hh;
        var c0_lo = hl;
        var c1_hi = s1_512_hi(eh, el);
        var c1_lo = s1_512_lo(eh, el);
        var c2_hi = ch64_hi(eh, el, fh, fl, gh);
        var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
        var c3_hi = this.k[i];
        var c3_lo = this.k[i + 1];
        var c4_hi = W[i];
        var c4_lo = W[i + 1];

        var T1_hi = sum64_5_hi(
          c0_hi, c0_lo,
          c1_hi, c1_lo,
          c2_hi, c2_lo,
          c3_hi, c3_lo,
          c4_hi, c4_lo);
        var T1_lo = sum64_5_lo(
          c0_hi, c0_lo,
          c1_hi, c1_lo,
          c2_hi, c2_lo,
          c3_hi, c3_lo,
          c4_hi, c4_lo);

        c0_hi = s0_512_hi(ah, al);
        c0_lo = s0_512_lo(ah, al);
        c1_hi = maj64_hi(ah, al, bh, bl, ch);
        c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

        var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
        var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

        hh = gh;
        hl = gl;

        gh = fh;
        gl = fl;

        fh = eh;
        fl = el;

        eh = sum64_hi(dh, dl, T1_hi, T1_lo);
        el = sum64_lo(dl, dl, T1_hi, T1_lo);

        dh = ch;
        dl = cl;

        ch = bh;
        cl = bl;

        bh = ah;
        bl = al;

        ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
        al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
      }

      sum64(this.h, 0, ah, al);
      sum64(this.h, 2, bh, bl);
      sum64(this.h, 4, ch, cl);
      sum64(this.h, 6, dh, dl);
      sum64(this.h, 8, eh, el);
      sum64(this.h, 10, fh, fl);
      sum64(this.h, 12, gh, gl);
      sum64(this.h, 14, hh, hl);
    };

    SHA512.prototype._digest = function digest(enc) {
      if (enc === 'hex')
        return utils.toHex32(this.h, 'big');
      else
        return utils.split32(this.h, 'big');
    };

    function ch64_hi(xh, xl, yh, yl, zh) {
      var r = (xh & yh) ^ ((~xh) & zh);
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function ch64_lo(xh, xl, yh, yl, zh, zl) {
      var r = (xl & yl) ^ ((~xl) & zl);
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function maj64_hi(xh, xl, yh, yl, zh) {
      var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function maj64_lo(xh, xl, yh, yl, zh, zl) {
      var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function s0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 28);
      var c1_hi = rotr64_hi(xl, xh, 2);  // 34
      var c2_hi = rotr64_hi(xl, xh, 7);  // 39

      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function s0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 28);
      var c1_lo = rotr64_lo(xl, xh, 2);  // 34
      var c2_lo = rotr64_lo(xl, xh, 7);  // 39

      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function s1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 14);
      var c1_hi = rotr64_hi(xh, xl, 18);
      var c2_hi = rotr64_hi(xl, xh, 9);  // 41

      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function s1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 14);
      var c1_lo = rotr64_lo(xh, xl, 18);
      var c2_lo = rotr64_lo(xl, xh, 9);  // 41

      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function g0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 1);
      var c1_hi = rotr64_hi(xh, xl, 8);
      var c2_hi = shr64_hi(xh, xl, 7);

      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function g0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 1);
      var c1_lo = rotr64_lo(xh, xl, 8);
      var c2_lo = shr64_lo(xh, xl, 7);

      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function g1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 19);
      var c1_hi = rotr64_hi(xl, xh, 29);  // 61
      var c2_hi = shr64_hi(xh, xl, 6);

      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function g1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 19);
      var c1_lo = rotr64_lo(xl, xh, 29);  // 61
      var c2_lo = shr64_lo(xh, xl, 6);

      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 0x100000000;
      return r;
    }

    function SHA384() {
      if (!(this instanceof SHA384))
        return new SHA384();

      _512.call(this);
      this.h = [
        0xcbbb9d5d, 0xc1059ed8,
        0x629a292a, 0x367cd507,
        0x9159015a, 0x3070dd17,
        0x152fecd8, 0xf70e5939,
        0x67332667, 0xffc00b31,
        0x8eb44a87, 0x68581511,
        0xdb0c2e0d, 0x64f98fa7,
        0x47b5481d, 0xbefa4fa4 ];
    }
    utils.inherits(SHA384, _512);
    var _384 = SHA384;

    SHA384.blockSize = 1024;
    SHA384.outSize = 384;
    SHA384.hmacStrength = 192;
    SHA384.padLength = 128;

    SHA384.prototype._digest = function digest(enc) {
      if (enc === 'hex')
        return utils.toHex32(this.h.slice(0, 12), 'big');
      else
        return utils.split32(this.h.slice(0, 12), 'big');
    };

    var sha1 = _1;
    var sha224 = _224;
    var sha256 = _256;
    var sha384 = _384;
    var sha512 = _512;

    var sha = {
    	sha1: sha1,
    	sha224: sha224,
    	sha256: sha256,
    	sha384: sha384,
    	sha512: sha512
    };

    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_3 = utils.sum32_3;
    var sum32_4 = utils.sum32_4;
    var BlockHash = common$1.BlockHash;

    function RIPEMD160() {
      if (!(this instanceof RIPEMD160))
        return new RIPEMD160();

      BlockHash.call(this);

      this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
      this.endian = 'little';
    }
    utils.inherits(RIPEMD160, BlockHash);
    var ripemd160 = RIPEMD160;

    RIPEMD160.blockSize = 512;
    RIPEMD160.outSize = 160;
    RIPEMD160.hmacStrength = 192;
    RIPEMD160.padLength = 64;

    RIPEMD160.prototype._update = function update(msg, start) {
      var A = this.h[0];
      var B = this.h[1];
      var C = this.h[2];
      var D = this.h[3];
      var E = this.h[4];
      var Ah = A;
      var Bh = B;
      var Ch = C;
      var Dh = D;
      var Eh = E;
      for (var j = 0; j < 80; j++) {
        var T = sum32(
          rotl32(
            sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
            s[j]),
          E);
        A = E;
        E = D;
        D = rotl32(C, 10);
        C = B;
        B = T;
        T = sum32(
          rotl32(
            sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
            sh[j]),
          Eh);
        Ah = Eh;
        Eh = Dh;
        Dh = rotl32(Ch, 10);
        Ch = Bh;
        Bh = T;
      }
      T = sum32_3(this.h[1], C, Dh);
      this.h[1] = sum32_3(this.h[2], D, Eh);
      this.h[2] = sum32_3(this.h[3], E, Ah);
      this.h[3] = sum32_3(this.h[4], A, Bh);
      this.h[4] = sum32_3(this.h[0], B, Ch);
      this.h[0] = T;
    };

    RIPEMD160.prototype._digest = function digest(enc) {
      if (enc === 'hex')
        return utils.toHex32(this.h, 'little');
      else
        return utils.split32(this.h, 'little');
    };

    function f(j, x, y, z) {
      if (j <= 15)
        return x ^ y ^ z;
      else if (j <= 31)
        return (x & y) | ((~x) & z);
      else if (j <= 47)
        return (x | (~y)) ^ z;
      else if (j <= 63)
        return (x & z) | (y & (~z));
      else
        return x ^ (y | (~z));
    }

    function K(j) {
      if (j <= 15)
        return 0x00000000;
      else if (j <= 31)
        return 0x5a827999;
      else if (j <= 47)
        return 0x6ed9eba1;
      else if (j <= 63)
        return 0x8f1bbcdc;
      else
        return 0xa953fd4e;
    }

    function Kh(j) {
      if (j <= 15)
        return 0x50a28be6;
      else if (j <= 31)
        return 0x5c4dd124;
      else if (j <= 47)
        return 0x6d703ef3;
      else if (j <= 63)
        return 0x7a6d76e9;
      else
        return 0x00000000;
    }

    var r = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
      3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
      1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
      4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
    ];

    var rh = [
      5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
      6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
      15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
      8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
      12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
    ];

    var s = [
      11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
      7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
      11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
      11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
      9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
    ];

    var sh = [
      8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
      9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
      9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
      15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
      8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
    ];

    var ripemd = {
    	ripemd160: ripemd160
    };

    function Hmac(hash, key, enc) {
      if (!(this instanceof Hmac))
        return new Hmac(hash, key, enc);
      this.Hash = hash;
      this.blockSize = hash.blockSize / 8;
      this.outSize = hash.outSize / 8;
      this.inner = null;
      this.outer = null;

      this._init(utils.toArray(key, enc));
    }
    var hmac = Hmac;

    Hmac.prototype._init = function init(key) {
      // Shorten key, if needed
      if (key.length > this.blockSize)
        key = new this.Hash().update(key).digest();
      minimalisticAssert(key.length <= this.blockSize);

      // Add padding to key
      for (var i = key.length; i < this.blockSize; i++)
        key.push(0);

      for (i = 0; i < key.length; i++)
        key[i] ^= 0x36;
      this.inner = new this.Hash().update(key);

      // 0x36 ^ 0x5c = 0x6a
      for (i = 0; i < key.length; i++)
        key[i] ^= 0x6a;
      this.outer = new this.Hash().update(key);
    };

    Hmac.prototype.update = function update(msg, enc) {
      this.inner.update(msg, enc);
      return this;
    };

    Hmac.prototype.digest = function digest(enc) {
      this.outer.update(this.inner.digest());
      return this.outer.digest(enc);
    };

    var hash_1 = createCommonjsModule(function (module, exports) {
    var hash = exports;

    hash.utils = utils;
    hash.common = common$1;
    hash.sha = sha;
    hash.ripemd = ripemd;
    hash.hmac = hmac;

    // Proxy hash functions to the main object
    hash.sha1 = hash.sha.sha1;
    hash.sha256 = hash.sha.sha256;
    hash.sha224 = hash.sha.sha224;
    hash.sha384 = hash.sha.sha384;
    hash.sha512 = hash.sha.sha512;
    hash.ripemd160 = hash.ripemd.ripemd160;
    });

    var secp256k1 = {
      doubles: {
        step: 4,
        points: [
          [
            'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
            'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821',
          ],
          [
            '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
            '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf',
          ],
          [
            '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
            'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695',
          ],
          [
            '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
            '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9',
          ],
          [
            '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
            '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36',
          ],
          [
            '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
            '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f',
          ],
          [
            'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
            '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999',
          ],
          [
            '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
            'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09',
          ],
          [
            'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
            '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d',
          ],
          [
            'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
            'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088',
          ],
          [
            'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
            '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d',
          ],
          [
            '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
            '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8',
          ],
          [
            '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
            '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a',
          ],
          [
            '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
            '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453',
          ],
          [
            '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
            '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160',
          ],
          [
            '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
            '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0',
          ],
          [
            '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
            '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6',
          ],
          [
            '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
            '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589',
          ],
          [
            '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
            'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17',
          ],
          [
            'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
            '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda',
          ],
          [
            'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
            '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd',
          ],
          [
            '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
            '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2',
          ],
          [
            '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
            '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6',
          ],
          [
            'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
            '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f',
          ],
          [
            '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
            'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01',
          ],
          [
            'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
            '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3',
          ],
          [
            'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
            'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f',
          ],
          [
            'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
            '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7',
          ],
          [
            'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
            'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78',
          ],
          [
            'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
            '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1',
          ],
          [
            '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
            'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150',
          ],
          [
            '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
            '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82',
          ],
          [
            'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
            '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc',
          ],
          [
            '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
            'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b',
          ],
          [
            'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
            '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51',
          ],
          [
            'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
            '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45',
          ],
          [
            'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
            'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120',
          ],
          [
            '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
            '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84',
          ],
          [
            '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
            '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d',
          ],
          [
            '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
            'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d',
          ],
          [
            '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
            '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8',
          ],
          [
            'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
            '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8',
          ],
          [
            '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
            '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac',
          ],
          [
            '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
            'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f',
          ],
          [
            '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
            '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962',
          ],
          [
            'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
            '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907',
          ],
          [
            '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
            'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec',
          ],
          [
            'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
            'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d',
          ],
          [
            'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
            '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414',
          ],
          [
            '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
            'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd',
          ],
          [
            '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
            'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0',
          ],
          [
            'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
            '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811',
          ],
          [
            'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
            '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1',
          ],
          [
            'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
            '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c',
          ],
          [
            '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
            'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73',
          ],
          [
            '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
            '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd',
          ],
          [
            'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
            'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405',
          ],
          [
            '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
            'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589',
          ],
          [
            '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
            '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e',
          ],
          [
            '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
            '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27',
          ],
          [
            'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
            'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1',
          ],
          [
            '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
            '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482',
          ],
          [
            '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
            '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945',
          ],
          [
            'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
            '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573',
          ],
          [
            'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
            'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82',
          ],
        ],
      },
      naf: {
        wnd: 7,
        points: [
          [
            'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
            '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672',
          ],
          [
            '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
            'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6',
          ],
          [
            '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
            '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da',
          ],
          [
            'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
            'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37',
          ],
          [
            '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
            'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b',
          ],
          [
            'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
            'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81',
          ],
          [
            'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
            '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58',
          ],
          [
            'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
            '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77',
          ],
          [
            '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
            '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a',
          ],
          [
            '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
            '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c',
          ],
          [
            '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
            '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67',
          ],
          [
            '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
            '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402',
          ],
          [
            'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
            'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55',
          ],
          [
            'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
            '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482',
          ],
          [
            '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
            'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82',
          ],
          [
            '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
            'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396',
          ],
          [
            '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
            '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49',
          ],
          [
            '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
            '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf',
          ],
          [
            '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
            '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a',
          ],
          [
            '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
            'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7',
          ],
          [
            'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
            'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933',
          ],
          [
            '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
            '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a',
          ],
          [
            '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
            '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6',
          ],
          [
            'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
            'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37',
          ],
          [
            '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
            '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e',
          ],
          [
            'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
            'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6',
          ],
          [
            'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
            'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476',
          ],
          [
            '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
            '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40',
          ],
          [
            '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
            '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61',
          ],
          [
            '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
            '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683',
          ],
          [
            'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
            '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5',
          ],
          [
            '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
            '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b',
          ],
          [
            'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
            '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417',
          ],
          [
            '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
            'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868',
          ],
          [
            '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
            'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a',
          ],
          [
            'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
            'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6',
          ],
          [
            '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
            '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996',
          ],
          [
            '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
            'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e',
          ],
          [
            'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
            'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d',
          ],
          [
            '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
            '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2',
          ],
          [
            '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
            'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e',
          ],
          [
            '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
            '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437',
          ],
          [
            '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
            'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311',
          ],
          [
            'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
            '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4',
          ],
          [
            '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
            '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575',
          ],
          [
            '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
            'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d',
          ],
          [
            '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
            'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d',
          ],
          [
            'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
            'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629',
          ],
          [
            'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
            'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06',
          ],
          [
            '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
            '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374',
          ],
          [
            '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
            '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee',
          ],
          [
            'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
            '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1',
          ],
          [
            'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
            'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b',
          ],
          [
            '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
            '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661',
          ],
          [
            '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
            '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6',
          ],
          [
            'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
            '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e',
          ],
          [
            '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
            '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d',
          ],
          [
            'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
            'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc',
          ],
          [
            '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
            'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4',
          ],
          [
            '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
            '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c',
          ],
          [
            'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
            '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b',
          ],
          [
            'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
            '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913',
          ],
          [
            '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
            '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154',
          ],
          [
            '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
            '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865',
          ],
          [
            '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
            'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc',
          ],
          [
            '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
            'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224',
          ],
          [
            '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
            '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e',
          ],
          [
            '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
            '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6',
          ],
          [
            '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
            '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511',
          ],
          [
            '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
            'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b',
          ],
          [
            'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
            'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2',
          ],
          [
            '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
            'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c',
          ],
          [
            'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
            '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3',
          ],
          [
            'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
            '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d',
          ],
          [
            'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
            '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700',
          ],
          [
            'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
            '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4',
          ],
          [
            '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
            'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196',
          ],
          [
            '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
            '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4',
          ],
          [
            '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
            'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257',
          ],
          [
            'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
            'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13',
          ],
          [
            'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
            '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096',
          ],
          [
            'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
            'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38',
          ],
          [
            'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
            '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f',
          ],
          [
            '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
            '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448',
          ],
          [
            'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
            '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a',
          ],
          [
            'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
            '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4',
          ],
          [
            '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
            '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437',
          ],
          [
            '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
            'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7',
          ],
          [
            'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
            '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d',
          ],
          [
            'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
            '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a',
          ],
          [
            'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
            '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54',
          ],
          [
            '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
            '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77',
          ],
          [
            'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
            'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517',
          ],
          [
            '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
            'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10',
          ],
          [
            'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
            'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125',
          ],
          [
            'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
            '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e',
          ],
          [
            '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
            'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1',
          ],
          [
            'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
            '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2',
          ],
          [
            'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
            '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423',
          ],
          [
            'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
            '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8',
          ],
          [
            '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
            'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758',
          ],
          [
            '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
            'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375',
          ],
          [
            'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
            '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d',
          ],
          [
            '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
            'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec',
          ],
          [
            '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
            '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0',
          ],
          [
            '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
            'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c',
          ],
          [
            'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
            'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4',
          ],
          [
            '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
            'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f',
          ],
          [
            '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
            '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649',
          ],
          [
            '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
            'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826',
          ],
          [
            '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
            '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5',
          ],
          [
            'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
            'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87',
          ],
          [
            '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
            '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b',
          ],
          [
            'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
            '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc',
          ],
          [
            '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
            '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c',
          ],
          [
            'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
            'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f',
          ],
          [
            'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
            '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a',
          ],
          [
            'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
            'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46',
          ],
          [
            '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
            'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f',
          ],
          [
            '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
            '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03',
          ],
          [
            '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
            'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08',
          ],
          [
            '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
            '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8',
          ],
          [
            '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
            '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373',
          ],
          [
            '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
            'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3',
          ],
          [
            '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
            '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8',
          ],
          [
            '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
            '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1',
          ],
          [
            '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
            '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9',
          ],
        ],
      },
    };

    var curves_1 = createCommonjsModule(function (module, exports) {

    var curves = exports;





    var assert = utils_1.assert;

    function PresetCurve(options) {
      if (options.type === 'short')
        this.curve = new curve_1.short(options);
      else if (options.type === 'edwards')
        this.curve = new curve_1.edwards(options);
      else
        this.curve = new curve_1.mont(options);
      this.g = this.curve.g;
      this.n = this.curve.n;
      this.hash = options.hash;

      assert(this.g.validate(), 'Invalid curve');
      assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
    }
    curves.PresetCurve = PresetCurve;

    function defineCurve(name, options) {
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        get: function() {
          var curve = new PresetCurve(options);
          Object.defineProperty(curves, name, {
            configurable: true,
            enumerable: true,
            value: curve,
          });
          return curve;
        },
      });
    }

    defineCurve('p192', {
      type: 'short',
      prime: 'p192',
      p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
      a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
      b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
      n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
      hash: hash_1.sha256,
      gRed: false,
      g: [
        '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
        '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811',
      ],
    });

    defineCurve('p224', {
      type: 'short',
      prime: 'p224',
      p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
      a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
      b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
      n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
      hash: hash_1.sha256,
      gRed: false,
      g: [
        'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
        'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34',
      ],
    });

    defineCurve('p256', {
      type: 'short',
      prime: null,
      p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
      a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
      b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
      n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
      hash: hash_1.sha256,
      gRed: false,
      g: [
        '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
        '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5',
      ],
    });

    defineCurve('p384', {
      type: 'short',
      prime: null,
      p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'fffffffe ffffffff 00000000 00000000 ffffffff',
      a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'fffffffe ffffffff 00000000 00000000 fffffffc',
      b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
         '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
      n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
         'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
      hash: hash_1.sha384,
      gRed: false,
      g: [
        'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
        '5502f25d bf55296c 3a545e38 72760ab7',
        '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
        '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f',
      ],
    });

    defineCurve('p521', {
      type: 'short',
      prime: null,
      p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'ffffffff ffffffff ffffffff ffffffff ffffffff',
      a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'ffffffff ffffffff ffffffff ffffffff fffffffc',
      b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
         '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
         '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
      n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
         'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
         'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
      hash: hash_1.sha512,
      gRed: false,
      g: [
        '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
        '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
        'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
        '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
        '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
        '3fad0761 353c7086 a272c240 88be9476 9fd16650',
      ],
    });

    defineCurve('curve25519', {
      type: 'mont',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '76d06',
      b: '1',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: hash_1.sha256,
      gRed: false,
      g: [
        '9',
      ],
    });

    defineCurve('ed25519', {
      type: 'edwards',
      prime: 'p25519',
      p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
      a: '-1',
      c: '1',
      // -121665 * (121666^(-1)) (mod P)
      d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
      n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
      hash: hash_1.sha256,
      gRed: false,
      g: [
        '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

        // 4/5
        '6666666666666666666666666666666666666666666666666666666666666658',
      ],
    });

    var pre;
    try {
      pre = secp256k1;
    } catch (e) {
      pre = undefined;
    }

    defineCurve('secp256k1', {
      type: 'short',
      prime: 'k256',
      p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
      a: '0',
      b: '7',
      n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
      h: '1',
      hash: hash_1.sha256,

      // Precomputed endomorphism
      beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
      lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
      basis: [
        {
          a: '3086d221a7d46bcde86c90e49284eb15',
          b: '-e4437ed6010e88286f547fa90abfe4c3',
        },
        {
          a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
          b: '3086d221a7d46bcde86c90e49284eb15',
        },
      ],

      gRed: false,
      g: [
        '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
        '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
        pre,
      ],
    });
    });

    function HmacDRBG(options) {
      if (!(this instanceof HmacDRBG))
        return new HmacDRBG(options);
      this.hash = options.hash;
      this.predResist = !!options.predResist;

      this.outLen = this.hash.outSize;
      this.minEntropy = options.minEntropy || this.hash.hmacStrength;

      this._reseed = null;
      this.reseedInterval = null;
      this.K = null;
      this.V = null;

      var entropy = utils_1$1.toArray(options.entropy, options.entropyEnc || 'hex');
      var nonce = utils_1$1.toArray(options.nonce, options.nonceEnc || 'hex');
      var pers = utils_1$1.toArray(options.pers, options.persEnc || 'hex');
      minimalisticAssert(entropy.length >= (this.minEntropy / 8),
             'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
      this._init(entropy, nonce, pers);
    }
    var hmacDrbg = HmacDRBG;

    HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
      var seed = entropy.concat(nonce).concat(pers);

      this.K = new Array(this.outLen / 8);
      this.V = new Array(this.outLen / 8);
      for (var i = 0; i < this.V.length; i++) {
        this.K[i] = 0x00;
        this.V[i] = 0x01;
      }

      this._update(seed);
      this._reseed = 1;
      this.reseedInterval = 0x1000000000000;  // 2^48
    };

    HmacDRBG.prototype._hmac = function hmac() {
      return new hash_1.hmac(this.hash, this.K);
    };

    HmacDRBG.prototype._update = function update(seed) {
      var kmac = this._hmac()
                     .update(this.V)
                     .update([ 0x00 ]);
      if (seed)
        kmac = kmac.update(seed);
      this.K = kmac.digest();
      this.V = this._hmac().update(this.V).digest();
      if (!seed)
        return;

      this.K = this._hmac()
                   .update(this.V)
                   .update([ 0x01 ])
                   .update(seed)
                   .digest();
      this.V = this._hmac().update(this.V).digest();
    };

    HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
      // Optional entropy enc
      if (typeof entropyEnc !== 'string') {
        addEnc = add;
        add = entropyEnc;
        entropyEnc = null;
      }

      entropy = utils_1$1.toArray(entropy, entropyEnc);
      add = utils_1$1.toArray(add, addEnc);

      minimalisticAssert(entropy.length >= (this.minEntropy / 8),
             'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

      this._update(entropy.concat(add || []));
      this._reseed = 1;
    };

    HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
      if (this._reseed > this.reseedInterval)
        throw new Error('Reseed is required');

      // Optional encoding
      if (typeof enc !== 'string') {
        addEnc = add;
        add = enc;
        enc = null;
      }

      // Optional additional data
      if (add) {
        add = utils_1$1.toArray(add, addEnc || 'hex');
        this._update(add);
      }

      var temp = [];
      while (temp.length < len) {
        this.V = this._hmac().update(this.V).digest();
        temp = temp.concat(this.V);
      }

      var res = temp.slice(0, len);
      this._update(add);
      this._reseed++;
      return utils_1$1.encode(res, enc);
    };

    var assert$5 = utils_1.assert;

    function KeyPair$1(ec, options) {
      this.ec = ec;
      this.priv = null;
      this.pub = null;

      // KeyPair(ec, { priv: ..., pub: ... })
      if (options.priv)
        this._importPrivate(options.priv, options.privEnc);
      if (options.pub)
        this._importPublic(options.pub, options.pubEnc);
    }
    var key$1 = KeyPair$1;

    KeyPair$1.fromPublic = function fromPublic(ec, pub, enc) {
      if (pub instanceof KeyPair$1)
        return pub;

      return new KeyPair$1(ec, {
        pub: pub,
        pubEnc: enc,
      });
    };

    KeyPair$1.fromPrivate = function fromPrivate(ec, priv, enc) {
      if (priv instanceof KeyPair$1)
        return priv;

      return new KeyPair$1(ec, {
        priv: priv,
        privEnc: enc,
      });
    };

    KeyPair$1.prototype.validate = function validate() {
      var pub = this.getPublic();

      if (pub.isInfinity())
        return { result: false, reason: 'Invalid public key' };
      if (!pub.validate())
        return { result: false, reason: 'Public key is not a point' };
      if (!pub.mul(this.ec.curve.n).isInfinity())
        return { result: false, reason: 'Public key * N != O' };

      return { result: true, reason: null };
    };

    KeyPair$1.prototype.getPublic = function getPublic(compact, enc) {
      // compact is optional argument
      if (typeof compact === 'string') {
        enc = compact;
        compact = null;
      }

      if (!this.pub)
        this.pub = this.ec.g.mul(this.priv);

      if (!enc)
        return this.pub;

      return this.pub.encode(enc, compact);
    };

    KeyPair$1.prototype.getPrivate = function getPrivate(enc) {
      if (enc === 'hex')
        return this.priv.toString(16, 2);
      else
        return this.priv;
    };

    KeyPair$1.prototype._importPrivate = function _importPrivate(key, enc) {
      this.priv = new bn(key, enc || 16);

      // Ensure that the priv won't be bigger than n, otherwise we may fail
      // in fixed multiplication method
      this.priv = this.priv.umod(this.ec.curve.n);
    };

    KeyPair$1.prototype._importPublic = function _importPublic(key, enc) {
      if (key.x || key.y) {
        // Montgomery points only have an `x` coordinate.
        // Weierstrass/Edwards points on the other hand have both `x` and
        // `y` coordinates.
        if (this.ec.curve.type === 'mont') {
          assert$5(key.x, 'Need x coordinate');
        } else if (this.ec.curve.type === 'short' ||
                   this.ec.curve.type === 'edwards') {
          assert$5(key.x && key.y, 'Need both x and y coordinate');
        }
        this.pub = this.ec.curve.point(key.x, key.y);
        return;
      }
      this.pub = this.ec.curve.decodePoint(key, enc);
    };

    // ECDH
    KeyPair$1.prototype.derive = function derive(pub) {
      if(!pub.validate()) {
        assert$5(pub.validate(), 'public point not validated');
      }
      return pub.mul(this.priv).getX();
    };

    // ECDSA
    KeyPair$1.prototype.sign = function sign(msg, enc, options) {
      return this.ec.sign(msg, this, enc, options);
    };

    KeyPair$1.prototype.verify = function verify(msg, signature) {
      return this.ec.verify(msg, signature, this);
    };

    KeyPair$1.prototype.inspect = function inspect() {
      return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
             ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
    };

    var assert$4 = utils_1.assert;

    function Signature$1(options, enc) {
      if (options instanceof Signature$1)
        return options;

      if (this._importDER(options, enc))
        return;

      assert$4(options.r && options.s, 'Signature without r or s');
      this.r = new bn(options.r, 16);
      this.s = new bn(options.s, 16);
      if (options.recoveryParam === undefined)
        this.recoveryParam = null;
      else
        this.recoveryParam = options.recoveryParam;
    }
    var signature$1 = Signature$1;

    function Position() {
      this.place = 0;
    }

    function getLength(buf, p) {
      var initial = buf[p.place++];
      if (!(initial & 0x80)) {
        return initial;
      }
      var octetLen = initial & 0xf;

      // Indefinite length or overflow
      if (octetLen === 0 || octetLen > 4) {
        return false;
      }

      var val = 0;
      for (var i = 0, off = p.place; i < octetLen; i++, off++) {
        val <<= 8;
        val |= buf[off];
        val >>>= 0;
      }

      // Leading zeroes
      if (val <= 0x7f) {
        return false;
      }

      p.place = off;
      return val;
    }

    function rmPadding(buf) {
      var i = 0;
      var len = buf.length - 1;
      while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
        i++;
      }
      if (i === 0) {
        return buf;
      }
      return buf.slice(i);
    }

    Signature$1.prototype._importDER = function _importDER(data, enc) {
      data = utils_1.toArray(data, enc);
      var p = new Position();
      if (data[p.place++] !== 0x30) {
        return false;
      }
      var len = getLength(data, p);
      if (len === false) {
        return false;
      }
      if ((len + p.place) !== data.length) {
        return false;
      }
      if (data[p.place++] !== 0x02) {
        return false;
      }
      var rlen = getLength(data, p);
      if (rlen === false) {
        return false;
      }
      var r = data.slice(p.place, rlen + p.place);
      p.place += rlen;
      if (data[p.place++] !== 0x02) {
        return false;
      }
      var slen = getLength(data, p);
      if (slen === false) {
        return false;
      }
      if (data.length !== slen + p.place) {
        return false;
      }
      var s = data.slice(p.place, slen + p.place);
      if (r[0] === 0) {
        if (r[1] & 0x80) {
          r = r.slice(1);
        } else {
          // Leading zeroes
          return false;
        }
      }
      if (s[0] === 0) {
        if (s[1] & 0x80) {
          s = s.slice(1);
        } else {
          // Leading zeroes
          return false;
        }
      }

      this.r = new bn(r);
      this.s = new bn(s);
      this.recoveryParam = null;

      return true;
    };

    function constructLength(arr, len) {
      if (len < 0x80) {
        arr.push(len);
        return;
      }
      var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
      arr.push(octets | 0x80);
      while (--octets) {
        arr.push((len >>> (octets << 3)) & 0xff);
      }
      arr.push(len);
    }

    Signature$1.prototype.toDER = function toDER(enc) {
      var r = this.r.toArray();
      var s = this.s.toArray();

      // Pad values
      if (r[0] & 0x80)
        r = [ 0 ].concat(r);
      // Pad values
      if (s[0] & 0x80)
        s = [ 0 ].concat(s);

      r = rmPadding(r);
      s = rmPadding(s);

      while (!s[0] && !(s[1] & 0x80)) {
        s = s.slice(1);
      }
      var arr = [ 0x02 ];
      constructLength(arr, r.length);
      arr = arr.concat(r);
      arr.push(0x02);
      constructLength(arr, s.length);
      var backHalf = arr.concat(s);
      var res = [ 0x30 ];
      constructLength(res, backHalf.length);
      res = res.concat(backHalf);
      return utils_1.encode(res, enc);
    };

    var assert$3 = utils_1.assert;




    function EC(options) {
      if (!(this instanceof EC))
        return new EC(options);

      // Shortcut `elliptic.ec(curve-name)`
      if (typeof options === 'string') {
        assert$3(Object.prototype.hasOwnProperty.call(curves_1, options),
          'Unknown curve ' + options);

        options = curves_1[options];
      }

      // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
      if (options instanceof curves_1.PresetCurve)
        options = { curve: options };

      this.curve = options.curve.curve;
      this.n = this.curve.n;
      this.nh = this.n.ushrn(1);
      this.g = this.curve.g;

      // Point on curve
      this.g = options.curve.g;
      this.g.precompute(options.curve.n.bitLength() + 1);

      // Hash for function for DRBG
      this.hash = options.hash || options.curve.hash;
    }
    var ec$1 = EC;

    EC.prototype.keyPair = function keyPair(options) {
      return new key$1(this, options);
    };

    EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
      return key$1.fromPrivate(this, priv, enc);
    };

    EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
      return key$1.fromPublic(this, pub, enc);
    };

    EC.prototype.genKeyPair = function genKeyPair(options) {
      if (!options)
        options = {};

      // Instantiate Hmac_DRBG
      var drbg = new hmacDrbg({
        hash: this.hash,
        pers: options.pers,
        persEnc: options.persEnc || 'utf8',
        entropy: options.entropy || brorand(this.hash.hmacStrength),
        entropyEnc: options.entropy && options.entropyEnc || 'utf8',
        nonce: this.n.toArray(),
      });

      var bytes = this.n.byteLength();
      var ns2 = this.n.sub(new bn(2));
      for (;;) {
        var priv = new bn(drbg.generate(bytes));
        if (priv.cmp(ns2) > 0)
          continue;

        priv.iaddn(1);
        return this.keyFromPrivate(priv);
      }
    };

    EC.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
      var delta = msg.byteLength() * 8 - this.n.bitLength();
      if (delta > 0)
        msg = msg.ushrn(delta);
      if (!truncOnly && msg.cmp(this.n) >= 0)
        return msg.sub(this.n);
      else
        return msg;
    };

    EC.prototype.sign = function sign(msg, key, enc, options) {
      if (typeof enc === 'object') {
        options = enc;
        enc = null;
      }
      if (!options)
        options = {};

      key = this.keyFromPrivate(key, enc);
      msg = this._truncateToN(new bn(msg, 16));

      // Zero-extend key to provide enough entropy
      var bytes = this.n.byteLength();
      var bkey = key.getPrivate().toArray('be', bytes);

      // Zero-extend nonce to have the same byte size as N
      var nonce = msg.toArray('be', bytes);

      // Instantiate Hmac_DRBG
      var drbg = new hmacDrbg({
        hash: this.hash,
        entropy: bkey,
        nonce: nonce,
        pers: options.pers,
        persEnc: options.persEnc || 'utf8',
      });

      // Number of bytes to generate
      var ns1 = this.n.sub(new bn(1));

      for (var iter = 0; ; iter++) {
        var k = options.k ?
          options.k(iter) :
          new bn(drbg.generate(this.n.byteLength()));
        k = this._truncateToN(k, true);
        if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
          continue;

        var kp = this.g.mul(k);
        if (kp.isInfinity())
          continue;

        var kpX = kp.getX();
        var r = kpX.umod(this.n);
        if (r.cmpn(0) === 0)
          continue;

        var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
        s = s.umod(this.n);
        if (s.cmpn(0) === 0)
          continue;

        var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                            (kpX.cmp(r) !== 0 ? 2 : 0);

        // Use complement of `s`, if it is > `n / 2`
        if (options.canonical && s.cmp(this.nh) > 0) {
          s = this.n.sub(s);
          recoveryParam ^= 1;
        }

        return new signature$1({ r: r, s: s, recoveryParam: recoveryParam });
      }
    };

    EC.prototype.verify = function verify(msg, signature, key, enc) {
      msg = this._truncateToN(new bn(msg, 16));
      key = this.keyFromPublic(key, enc);
      signature = new signature$1(signature, 'hex');

      // Perform primitive values validation
      var r = signature.r;
      var s = signature.s;
      if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
        return false;
      if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
        return false;

      // Validate signature
      var sinv = s.invm(this.n);
      var u1 = sinv.mul(msg).umod(this.n);
      var u2 = sinv.mul(r).umod(this.n);
      var p;

      if (!this.curve._maxwellTrick) {
        p = this.g.mulAdd(u1, key.getPublic(), u2);
        if (p.isInfinity())
          return false;

        return p.getX().umod(this.n).cmp(r) === 0;
      }

      // NOTE: Greg Maxwell's trick, inspired by:
      // https://git.io/vad3K

      p = this.g.jmulAdd(u1, key.getPublic(), u2);
      if (p.isInfinity())
        return false;

      // Compare `p.x` of Jacobian point with `r`,
      // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
      // inverse of `p.z^2`
      return p.eqXToP(r);
    };

    EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
      assert$3((3 & j) === j, 'The recovery param is more than two bits');
      signature = new signature$1(signature, enc);

      var n = this.n;
      var e = new bn(msg);
      var r = signature.r;
      var s = signature.s;

      // A set LSB signifies that the y-coordinate is odd
      var isYOdd = j & 1;
      var isSecondKey = j >> 1;
      if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
        throw new Error('Unable to find sencond key candinate');

      // 1.1. Let x = r + jn.
      if (isSecondKey)
        r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
      else
        r = this.curve.pointFromX(r, isYOdd);

      var rInv = signature.r.invm(n);
      var s1 = n.sub(e).mul(rInv).umod(n);
      var s2 = s.mul(rInv).umod(n);

      // 1.6.1 Compute Q = r^-1 (sR -  eG)
      //               Q = r^-1 (sR + -eG)
      return this.g.mulAdd(s1, r, s2);
    };

    EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
      signature = new signature$1(signature, enc);
      if (signature.recoveryParam !== null)
        return signature.recoveryParam;

      for (var i = 0; i < 4; i++) {
        var Qprime;
        try {
          Qprime = this.recoverPubKey(e, signature, i);
        } catch (e) {
          continue;
        }

        if (Qprime.eq(Q))
          return i;
      }
      throw new Error('Unable to find valid recovery factor');
    };

    var assert$2 = utils_1.assert;
    var parseBytes$2 = utils_1.parseBytes;
    var cachedProperty$1 = utils_1.cachedProperty;

    /**
    * @param {EDDSA} eddsa - instance
    * @param {Object} params - public/private key parameters
    *
    * @param {Array<Byte>} [params.secret] - secret seed bytes
    * @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
    * @param {Array<Byte>} [params.pub] - public key point encoded as bytes
    *
    */
    function KeyPair(eddsa, params) {
      this.eddsa = eddsa;
      this._secret = parseBytes$2(params.secret);
      if (eddsa.isPoint(params.pub))
        this._pub = params.pub;
      else
        this._pubBytes = parseBytes$2(params.pub);
    }

    KeyPair.fromPublic = function fromPublic(eddsa, pub) {
      if (pub instanceof KeyPair)
        return pub;
      return new KeyPair(eddsa, { pub: pub });
    };

    KeyPair.fromSecret = function fromSecret(eddsa, secret) {
      if (secret instanceof KeyPair)
        return secret;
      return new KeyPair(eddsa, { secret: secret });
    };

    KeyPair.prototype.secret = function secret() {
      return this._secret;
    };

    cachedProperty$1(KeyPair, 'pubBytes', function pubBytes() {
      return this.eddsa.encodePoint(this.pub());
    });

    cachedProperty$1(KeyPair, 'pub', function pub() {
      if (this._pubBytes)
        return this.eddsa.decodePoint(this._pubBytes);
      return this.eddsa.g.mul(this.priv());
    });

    cachedProperty$1(KeyPair, 'privBytes', function privBytes() {
      var eddsa = this.eddsa;
      var hash = this.hash();
      var lastIx = eddsa.encodingLength - 1;

      var a = hash.slice(0, eddsa.encodingLength);
      a[0] &= 248;
      a[lastIx] &= 127;
      a[lastIx] |= 64;

      return a;
    });

    cachedProperty$1(KeyPair, 'priv', function priv() {
      return this.eddsa.decodeInt(this.privBytes());
    });

    cachedProperty$1(KeyPair, 'hash', function hash() {
      return this.eddsa.hash().update(this.secret()).digest();
    });

    cachedProperty$1(KeyPair, 'messagePrefix', function messagePrefix() {
      return this.hash().slice(this.eddsa.encodingLength);
    });

    KeyPair.prototype.sign = function sign(message) {
      assert$2(this._secret, 'KeyPair can only verify');
      return this.eddsa.sign(message, this);
    };

    KeyPair.prototype.verify = function verify(message, sig) {
      return this.eddsa.verify(message, sig, this);
    };

    KeyPair.prototype.getSecret = function getSecret(enc) {
      assert$2(this._secret, 'KeyPair is public only');
      return utils_1.encode(this.secret(), enc);
    };

    KeyPair.prototype.getPublic = function getPublic(enc) {
      return utils_1.encode(this.pubBytes(), enc);
    };

    var key = KeyPair;

    var assert$1 = utils_1.assert;
    var cachedProperty = utils_1.cachedProperty;
    var parseBytes$1 = utils_1.parseBytes;

    /**
    * @param {EDDSA} eddsa - eddsa instance
    * @param {Array<Bytes>|Object} sig -
    * @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
    * @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
    * @param {Array<Bytes>} [sig.Rencoded] - R point encoded
    * @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
    */
    function Signature(eddsa, sig) {
      this.eddsa = eddsa;

      if (typeof sig !== 'object')
        sig = parseBytes$1(sig);

      if (Array.isArray(sig)) {
        sig = {
          R: sig.slice(0, eddsa.encodingLength),
          S: sig.slice(eddsa.encodingLength),
        };
      }

      assert$1(sig.R && sig.S, 'Signature without R or S');

      if (eddsa.isPoint(sig.R))
        this._R = sig.R;
      if (sig.S instanceof bn)
        this._S = sig.S;

      this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
      this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
    }

    cachedProperty(Signature, 'S', function S() {
      return this.eddsa.decodeInt(this.Sencoded());
    });

    cachedProperty(Signature, 'R', function R() {
      return this.eddsa.decodePoint(this.Rencoded());
    });

    cachedProperty(Signature, 'Rencoded', function Rencoded() {
      return this.eddsa.encodePoint(this.R());
    });

    cachedProperty(Signature, 'Sencoded', function Sencoded() {
      return this.eddsa.encodeInt(this.S());
    });

    Signature.prototype.toBytes = function toBytes() {
      return this.Rencoded().concat(this.Sencoded());
    };

    Signature.prototype.toHex = function toHex() {
      return utils_1.encode(this.toBytes(), 'hex').toUpperCase();
    };

    var signature = Signature;

    var assert = utils_1.assert;
    var parseBytes = utils_1.parseBytes;



    function EDDSA(curve) {
      assert(curve === 'ed25519', 'only tested with ed25519 so far');

      if (!(this instanceof EDDSA))
        return new EDDSA(curve);

      curve = curves_1[curve].curve;
      this.curve = curve;
      this.g = curve.g;
      this.g.precompute(curve.n.bitLength() + 1);

      this.pointClass = curve.point().constructor;
      this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
      this.hash = hash_1.sha512;
    }

    var eddsa = EDDSA;

    /**
    * @param {Array|String} message - message bytes
    * @param {Array|String|KeyPair} secret - secret bytes or a keypair
    * @returns {Signature} - signature
    */
    EDDSA.prototype.sign = function sign(message, secret) {
      message = parseBytes(message);
      var key = this.keyFromSecret(secret);
      var r = this.hashInt(key.messagePrefix(), message);
      var R = this.g.mul(r);
      var Rencoded = this.encodePoint(R);
      var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
        .mul(key.priv());
      var S = r.add(s_).umod(this.curve.n);
      return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
    };

    /**
    * @param {Array} message - message bytes
    * @param {Array|String|Signature} sig - sig bytes
    * @param {Array|String|Point|KeyPair} pub - public key
    * @returns {Boolean} - true if public key matches sig of message
    */
    EDDSA.prototype.verify = function verify(message, sig, pub) {
      message = parseBytes(message);
      sig = this.makeSignature(sig);
      var key = this.keyFromPublic(pub);
      var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
      var SG = this.g.mul(sig.S());
      var RplusAh = sig.R().add(key.pub().mul(h));
      return RplusAh.eq(SG);
    };

    EDDSA.prototype.hashInt = function hashInt() {
      var hash = this.hash();
      for (var i = 0; i < arguments.length; i++)
        hash.update(arguments[i]);
      return utils_1.intFromLE(hash.digest()).umod(this.curve.n);
    };

    EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
      return key.fromPublic(this, pub);
    };

    EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
      return key.fromSecret(this, secret);
    };

    EDDSA.prototype.makeSignature = function makeSignature(sig) {
      if (sig instanceof signature)
        return sig;
      return new signature(this, sig);
    };

    /**
    * * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
    *
    * EDDSA defines methods for encoding and decoding points and integers. These are
    * helper convenience methods, that pass along to utility functions implied
    * parameters.
    *
    */
    EDDSA.prototype.encodePoint = function encodePoint(point) {
      var enc = point.getY().toArray('le', this.encodingLength);
      enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
      return enc;
    };

    EDDSA.prototype.decodePoint = function decodePoint(bytes) {
      bytes = utils_1.parseBytes(bytes);

      var lastIx = bytes.length - 1;
      var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
      var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

      var y = utils_1.intFromLE(normed);
      return this.curve.pointFromY(y, xIsOdd);
    };

    EDDSA.prototype.encodeInt = function encodeInt(num) {
      return num.toArray('le', this.encodingLength);
    };

    EDDSA.prototype.decodeInt = function decodeInt(bytes) {
      return utils_1.intFromLE(bytes);
    };

    EDDSA.prototype.isPoint = function isPoint(val) {
      return val instanceof this.pointClass;
    };

    var elliptic_1 = createCommonjsModule(function (module, exports) {

    var elliptic = exports;

    elliptic.version = require$$0$1.version;
    elliptic.utils = utils_1;
    elliptic.rand = brorand;
    elliptic.curve = curve_1;
    elliptic.curves = curves_1;

    // Protocols
    elliptic.ec = ec$1;
    elliptic.eddsa = eddsa;
    });

    var __awaiter$7 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }; // For ESM compatibility
    const {
      ec
    } = elliptic_1;
    const UNCOMPRESSED_RECOVERY_ID = 27;

    function hashWithEthereumPrefix(data) {
      const ethereumSignedMessagePrefix = `\x19Ethereum Signed Message:\n${data.length}`;
      const prefixBytes = new TextEncoder().encode(ethereumSignedMessagePrefix);
      return keccak256Hash(prefixBytes, data);
    }
    /**
     * The default signer function that can be used for integrating with
     * other applications (e.g. wallets).
     *
     * @param data      The data to be signed
     * @param privateKey  The private key used for signing the data
     */


    function defaultSign(data, privateKey) {
      const curve = new ec('secp256k1');
      const keyPair = curve.keyFromPrivate(privateKey);
      const hashedDigest = hashWithEthereumPrefix(data);
      const sigRaw = curve.sign(hashedDigest, keyPair, {
        canonical: true,
        pers: undefined
      });

      if (sigRaw.recoveryParam === null) {
        throw new BeeError('signDigest recovery param was null');
      }

      const signature = new Uint8Array([...sigRaw.r.toArray('be', 32), ...sigRaw.s.toArray('be', 32), sigRaw.recoveryParam + UNCOMPRESSED_RECOVERY_ID]);
      return signature;
    }

    function publicKeyToAddress(pubKey) {
      const pubBytes = pubKey.encode('array', false);
      return keccak256Hash(pubBytes.slice(1)).slice(12);
    }
    /**
     * Recovers the ethereum address from a given signature.
     *
     * Can be used for verifying a piece of data when the public key is
     * known.
     *
     * @param signature The signature
     * @param digest    The digest of the data
     *
     * @returns the recovered address
     */


    function recoverAddress(signature, digest) {
      const curve = new ec('secp256k1');
      const sig = {
        r: signature.slice(0, 32),
        s: signature.slice(32, 64)
      };
      const recoveryParam = signature[64] - UNCOMPRESSED_RECOVERY_ID;
      const hash = hashWithEthereumPrefix(digest);
      const recPubKey = curve.recoverPubKey(hash, sig, recoveryParam);
      return publicKeyToAddress(recPubKey);
    }
    /**
     * Creates a singer object that can be used when the private key is known.
     *
     * @param privateKey The private key
     */

    function makePrivateKeySigner(privateKey) {
      const curve = new ec('secp256k1');
      const keyPair = curve.keyFromPrivate(privateKey);
      const address = publicKeyToAddress(keyPair.getPublic());
      return {
        sign: digest => defaultSign(digest, privateKey),
        address
      };
    }
    function assertSigner(signer) {
      if (!isStrictlyObject(signer)) {
        throw new TypeError('Signer must be an object!');
      }

      const typedSigner = signer;

      if (!isBytes(typedSigner.address, 20)) {
        throw new TypeError("Signer's address must be Uint8Array with 20 bytes!");
      }

      if (typeof typedSigner.sign !== 'function') {
        throw new TypeError('Signer sign property needs to be function!');
      }
    }
    function makeSigner(signer) {
      if (typeof signer === 'string') {
        const hexKey = makeHexString(signer, 64);
        const keyBytes = hexToBytes(hexKey); // HexString is verified for 64 length => 32 is guaranteed

        return makePrivateKeySigner(keyBytes);
      } else if (signer instanceof Uint8Array) {
        assertBytes(signer, 32);
        return makePrivateKeySigner(signer);
      }

      assertSigner(signer);
      return signer;
    }
    function sign(signer, data) {
      return __awaiter$7(this, void 0, void 0, function* () {
        const result = yield signer.sign(wrapBytesWithHelpers(data));

        if (typeof result === 'string') {
          const hexString = makeHexString(result, SIGNATURE_HEX_LENGTH);
          return hexToBytes(hexString);
        }

        if (result instanceof Uint8Array) {
          assertBytes(result, SIGNATURE_BYTES_LENGTH);
          return result;
        }

        throw new TypeError('Invalid output of sign function!');
      });
    }

    const SPAN_SIZE = 8; // we limit the maximum span size in 32 bits to avoid BigInt compatibility issues

    const MAX_SPAN_LENGTH = Math.pow(2, 32) - 1;
    /**
     * Create a span for storing the length of the chunk
     *
     * The length is encoded in 64-bit little endian.
     *
     * @param length The length of the span
     */

    function makeSpan(length) {
      if (length <= 0) {
        throw new BeeArgumentError('invalid length for span', length);
      }

      if (length > MAX_SPAN_LENGTH) {
        throw new BeeArgumentError('invalid length (> MAX_SPAN_LENGTH)', length);
      }

      const span = new Uint8Array(SPAN_SIZE);
      const dataView = new DataView(span.buffer);
      const littleEndian = true;
      const lengthLower32 = length & 0xffffffff;
      dataView.setUint32(0, lengthLower32, littleEndian);
      return span;
    }

    const MIN_PAYLOAD_SIZE = 1;
    const MAX_PAYLOAD_SIZE = 4096;
    const CAC_SPAN_OFFSET = 0;
    const CAC_PAYLOAD_OFFSET = CAC_SPAN_OFFSET + SPAN_SIZE;
    /**
     * Creates a content addressed chunk and verifies the payload size.
     *
     * @param payloadBytes the data to be stored in the chunk
     */

    function makeContentAddressedChunk(payloadBytes) {
      const span = makeSpan(payloadBytes.length);
      assertFlexBytes(payloadBytes, MIN_PAYLOAD_SIZE, MAX_PAYLOAD_SIZE);
      const data = serializeBytes(span, payloadBytes);
      return {
        data,
        span: () => span,
        payload: () => flexBytesAtOffset(data, CAC_PAYLOAD_OFFSET),
        address: () => bmtHash(data)
      };
    }
    /**
     * Type guard for valid content addressed chunk data
     *
     * @param data          The chunk data
     * @param chunkAddress  The address of the chunk
     */

    function isValidChunkData(data, chunkAddress) {
      if (!(data instanceof Uint8Array)) return false;
      const address = bmtHash(data);
      return bytesEqual(address, chunkAddress);
    }
    /**
     * Asserts if data are representing given address of its chunk.
     *
     * @param data          The chunk data
     * @param chunkAddress  The address of the chunk
     *
     * @returns a valid content addressed chunk or throws error
     */

    function assertValidChunkData(data, chunkAddress) {
      if (!isValidChunkData(data, chunkAddress)) {
        throw new BeeError('Address of content address chunk does not match given data!');
      }
    }

    var __awaiter$6 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const socEndpoint = 'soc';
    /**
     * Upload single owner chunk (SOC) to a Bee node
     *
     * @param ky Ky instance
     * @param owner           Owner's ethereum address in hex
     * @param identifier      Arbitrary identifier in hex
     * @param signature       Signature in hex
     * @param data            Content addressed chunk data to be uploaded
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param options         Additional options like tag, encryption, pinning
     */

    function upload(ky, owner, identifier, signature, data, postageBatchId, options) {
      return __awaiter$6(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'post',
          path: `${socEndpoint}/${owner}/${identifier}`,
          body: data,
          headers: Object.assign({
            'content-type': 'application/octet-stream'
          }, extractUploadHeaders(postageBatchId, options)),
          responseType: 'json',
          searchParams: {
            sig: signature
          }
        });
        return response.data.reference;
      });
    }

    var __awaiter$5 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const IDENTIFIER_SIZE = 32;
    const SIGNATURE_SIZE = 65;
    const SOC_IDENTIFIER_OFFSET = 0;
    const SOC_SIGNATURE_OFFSET = SOC_IDENTIFIER_OFFSET + IDENTIFIER_SIZE;
    const SOC_SPAN_OFFSET = SOC_SIGNATURE_OFFSET + SIGNATURE_SIZE;
    const SOC_PAYLOAD_OFFSET = SOC_SPAN_OFFSET + SPAN_SIZE;

    function recoverChunkOwner(data) {
      const cacData = data.slice(SOC_SPAN_OFFSET);
      const chunkAddress = bmtHash(cacData);
      const signature = bytesAtOffset(data, SOC_SIGNATURE_OFFSET, SIGNATURE_SIZE);
      const identifier = bytesAtOffset(data, SOC_IDENTIFIER_OFFSET, IDENTIFIER_SIZE);
      const digest = keccak256Hash(identifier, chunkAddress);
      const ownerAddress = recoverAddress(signature, digest);
      return ownerAddress;
    }
    /**
     * Verifies if the data is a valid single owner chunk
     *
     * @param data    The chunk data
     * @param address The address of the single owner chunk
     *
     * @returns a single owner chunk or throws error
     */


    function makeSingleOwnerChunkFromData(data, address) {
      const ownerAddress = recoverChunkOwner(data);
      const identifier = bytesAtOffset(data, SOC_IDENTIFIER_OFFSET, IDENTIFIER_SIZE);
      const socAddress = keccak256Hash(identifier, ownerAddress);

      if (!bytesEqual(address, socAddress)) {
        throw new BeeError('SOC Data does not match given address!');
      }

      const signature = () => bytesAtOffset(data, SOC_SIGNATURE_OFFSET, SIGNATURE_SIZE);

      const span = () => bytesAtOffset(data, SOC_SPAN_OFFSET, SPAN_SIZE);

      const payload = () => flexBytesAtOffset(data, SOC_PAYLOAD_OFFSET);

      return {
        data,
        identifier: () => identifier,
        signature,
        span,
        payload,
        address: () => socAddress,
        owner: () => ownerAddress
      };
    }
    function makeSOCAddress(identifier, address) {
      return keccak256Hash(identifier, address);
    }
    /**
     * Creates a single owner chunk object
     *
     * @param chunk       A chunk object used for the span and payload
     * @param identifier  The identifier of the chunk
     * @param signer      The singer interface for signing the chunk
     */

    function makeSingleOwnerChunk(chunk, identifier, signer) {
      return __awaiter$5(this, void 0, void 0, function* () {
        const chunkAddress = chunk.address();
        assertValidChunkData(chunk.data, chunkAddress);
        const digest = keccak256Hash(identifier, chunkAddress);
        const signature = yield sign(signer, digest);
        const data = serializeBytes(identifier, signature, chunk.span(), chunk.payload());
        const address = makeSOCAddress(identifier, signer.address);
        return {
          data,
          identifier: () => identifier,
          signature: () => signature,
          span: () => chunk.span(),
          payload: () => chunk.payload(),
          address: () => address,
          owner: () => signer.address
        };
      });
    }
    /**
     * Helper function to upload a chunk.
     *
     * It uses the Chunk API and calculates the address before uploading.
     *
     * @param ky              Ky instance
     * @param chunk           A chunk object
     * @param postageBatchId  Postage BatchId that will be assigned to uploaded data
     * @param options         Upload options
     */

    function uploadSingleOwnerChunk(ky, chunk, postageBatchId, options) {
      return __awaiter$5(this, void 0, void 0, function* () {
        const owner = bytesToHex(chunk.owner());
        const identifier = bytesToHex(chunk.identifier());
        const signature = bytesToHex(chunk.signature());
        const data = serializeBytes(chunk.span(), chunk.payload());
        return upload(ky, owner, identifier, signature, data, postageBatchId, options);
      });
    }
    /**
     * Helper function to create and upload SOC.
     *
     * @param ky              Ky instance
     * @param signer          The singer interface for signing the chunk
     * @param postageBatchId
     * @param identifier      The identifier of the chunk
     * @param data            The chunk data
     * @param options
     */

    function uploadSingleOwnerChunkData(ky, signer, postageBatchId, identifier, data, options) {
      return __awaiter$5(this, void 0, void 0, function* () {
        assertAddress(postageBatchId);
        const cac = makeContentAddressedChunk(data);
        const soc = yield makeSingleOwnerChunk(cac, identifier, signer);
        return uploadSingleOwnerChunk(ky, soc, postageBatchId, options);
      });
    }
    /**
     * Helper function to download SOC.
     *
     * @param url           The url of the Bee service
     * @param ownerAddress  The singer interface for signing the chunk
     * @param identifier    The identifier of the chunk
     */

    function downloadSingleOwnerChunk(ky, ownerAddress, identifier) {
      return __awaiter$5(this, void 0, void 0, function* () {
        const address = makeSOCAddress(identifier, ownerAddress);
        const data = yield download(ky, bytesToHex(address));
        return makeSingleOwnerChunkFromData(data, address);
      });
    }

    var __awaiter$4 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const feedEndpoint = 'feeds';
    /**
     * Create an initial feed root manifest
     *
     * @param ky Ky instance
     * @param owner           Owner's ethereum address in hex
     * @param topic           Topic in hex
     * @param postageBatchId  Postage BatchId to be used to create the Feed Manifest
     * @param options         Additional options, like type (default: 'sequence')
     */

    function createFeedManifest(ky, owner, topic, postageBatchId, options) {
      return __awaiter$4(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          method: 'post',
          responseType: 'json',
          path: `${feedEndpoint}/${owner}/${topic}`,
          searchParams: filterHeaders(options),
          headers: extractUploadHeaders(postageBatchId)
        });
        return response.data.reference;
      });
    }

    function readFeedUpdateHeaders(headers) {
      const feedIndex = headers.get('swarm-feed-index');
      const feedIndexNext = headers.get('swarm-feed-index-next');

      if (!feedIndex) {
        throw new BeeError('Response did not contain expected swarm-feed-index!');
      }

      if (!feedIndexNext) {
        throw new BeeError('Response did not contain expected swarm-feed-index-next!');
      }

      return {
        feedIndex,
        feedIndexNext
      };
    }
    /**
     * Find and retrieve feed update
     *
     * The feed consists of updates. This endpoint looks up an
     * update that matches the provided parameters and returns
     * the reference it contains along with its index and the
     * index of the subsequent update.
     *
     * @param ky Ky instance
     * @param owner       Owner's ethereum address in hex
     * @param topic       Topic in hex
     * @param options     Additional options, like index, at, type
     */


    function fetchFeedUpdate(ky, owner, topic, options) {
      return __awaiter$4(this, void 0, void 0, function* () {
        const response = yield http(ky, {
          responseType: 'json',
          path: `${feedEndpoint}/${owner}/${topic}`,
          searchParams: filterHeaders(options)
        });
        return Object.assign(Object.assign({}, response.data), readFeedUpdateHeaders(response.headers));
      });
    }

    function writeUint64BigEndian(value, bytes = makeBytes(8)) {
      const dataView = new DataView(bytes.buffer);
      const valueLower32 = value & 0xffffffff;
      dataView.setUint32(0, 0);
      dataView.setUint32(4, valueLower32);
      return bytes;
    }

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }; // For ESM compatibility
    const ETH_ADDR_BYTES_LENGTH = 20;
    const ETH_ADDR_HEX_LENGTH = 40;
    function makeEthAddress(address) {
      if (typeof address === 'string') {
        const hexAddr = makeHexString(address, ETH_ADDR_HEX_LENGTH);
        const ownerBytes = hexToBytes(hexAddr);
        assertBytes(ownerBytes, ETH_ADDR_BYTES_LENGTH);
        return ownerBytes;
      } else if (address instanceof Uint8Array) {
        assertBytes(address, ETH_ADDR_BYTES_LENGTH);
        return address;
      }

      throw new TypeError('Invalid EthAddress');
    }
    function makeHexEthAddress(address) {
      try {
        return makeHexString(address, ETH_ADDR_HEX_LENGTH);
      } catch (e) {
        if (e instanceof TypeError) {
          e.message = `Invalid HexEthAddress: ${e.message}`;
        }

        throw e;
      }
    }

    var __awaiter$3 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    const REFERENCE_PAYLOAD_MIN_SIZE = 32;
    const REFERENCE_PAYLOAD_MAX_SIZE = 64;
    const INDEX_HEX_LENGTH = 16;
    function isEpoch(epoch) {
      return typeof epoch === 'object' && epoch !== null && 'time' in epoch && 'level' in epoch;
    }

    function hashFeedIdentifier(topic, index) {
      return keccak256Hash(hexToBytes(topic), index);
    }

    function makeSequentialFeedIdentifier(topic, index) {
      const indexBytes = writeUint64BigEndian(index);
      return hashFeedIdentifier(topic, indexBytes);
    }
    function makeFeedIndexBytes(s) {
      const hex = makeHexString(s, INDEX_HEX_LENGTH);
      return hexToBytes(hex);
    }
    function makeFeedIdentifier(topic, index) {
      if (typeof index === 'number') {
        return makeSequentialFeedIdentifier(topic, index);
      } else if (typeof index === 'string') {
        const indexBytes = makeFeedIndexBytes(index);
        return hashFeedIdentifier(topic, indexBytes);
      } else if (isEpoch(index)) {
        throw new TypeError('epoch is not yet implemented');
      }

      return hashFeedIdentifier(topic, index);
    }
    function uploadFeedUpdate(ky, signer, topic, index, reference, postageBatchId, options) {
      var _a;

      return __awaiter$3(this, void 0, void 0, function* () {
        const identifier = makeFeedIdentifier(topic, index);
        const at = (_a = options === null || options === void 0 ? void 0 : options.at) !== null && _a !== void 0 ? _a : Date.now() / 1000.0;
        const timestamp = writeUint64BigEndian(at);
        const payloadBytes = serializeBytes(timestamp, reference);
        return uploadSingleOwnerChunkData(ky, signer, postageBatchId, identifier, payloadBytes, options);
      });
    }
    function findNextIndex(ky, owner, topic, options) {
      return __awaiter$3(this, void 0, void 0, function* () {
        try {
          const feedUpdate = yield fetchFeedUpdate(ky, owner, topic, options);
          return makeHexString(feedUpdate.feedIndexNext, INDEX_HEX_LENGTH);
        } catch (e) {
          if (e instanceof BeeResponseError && e.status === 404) {
            return bytesToHex(makeBytes(8));
          }

          throw e;
        }
      });
    }
    function updateFeed(ky, signer, topic, reference, postageBatchId, options) {
      return __awaiter$3(this, void 0, void 0, function* () {
        const ownerHex = makeHexEthAddress(signer.address);
        const nextIndex = yield findNextIndex(ky, ownerHex, topic, options);
        return uploadFeedUpdate(ky, signer, topic, nextIndex, reference, postageBatchId, options);
      });
    }

    function verifyChunkReferenceAtOffset(offset, data) {
      try {
        return bytesAtOffset(data, offset, REFERENCE_PAYLOAD_MAX_SIZE);
      } catch (e) {
        return bytesAtOffset(data, offset, REFERENCE_PAYLOAD_MIN_SIZE);
      }
    }

    function verifyChunkReference(data) {
      return verifyChunkReferenceAtOffset(0, data);
    }
    function makeFeedReader(ky, type, topic, owner) {
      const download = options => __awaiter$3(this, void 0, void 0, function* () {
        return fetchFeedUpdate(ky, owner, topic, Object.assign(Object.assign({}, options), {
          type
        }));
      });

      return {
        type,
        owner,
        topic,
        download
      };
    }

    function makeChunkReference(reference) {
      if (typeof reference === 'string') {
        try {
          // Non-encrypted chunk hex string reference
          const hexReference = makeHexString(reference, REFERENCE_HEX_LENGTH);
          return hexToBytes(hexReference);
        } catch (e) {
          if (!(e instanceof TypeError)) {
            throw e;
          } // Encrypted chunk hex string reference


          const hexReference = makeHexString(reference, ENCRYPTED_REFERENCE_HEX_LENGTH);
          return hexToBytes(hexReference);
        }
      } else if (reference instanceof Uint8Array) {
        return verifyChunkReference(reference);
      }

      throw new TypeError('invalid chunk reference');
    }

    function makeFeedWriter(ky, type, topic, signer) {
      const upload = (postageBatchId, reference, options) => __awaiter$3(this, void 0, void 0, function* () {
        assertAddress(postageBatchId);
        const canonicalReference = makeChunkReference(reference);
        return updateFeed(ky, signer, topic, canonicalReference, postageBatchId, Object.assign(Object.assign({}, options), {
          type
        }));
      });

      return Object.assign(Object.assign({}, makeFeedReader(ky, type, topic, makeHexEthAddress(signer.address))), {
        upload
      });
    }

    const feedTypes = ['sequence', 'epoch'];
    const DEFAULT_FEED_TYPE = 'sequence';
    function isFeedType(type) {
      return typeof type === 'string' && feedTypes.includes(type);
    }
    function assertFeedType(type) {
      if (!isFeedType(type)) {
        throw new TypeError('invalid feed type');
      }
    }

    function makeTopic(topic) {
      if (typeof topic === 'string') {
        return makeHexString(topic, TOPIC_HEX_LENGTH);
      } else if (topic instanceof Uint8Array) {
        assertBytes(topic, TOPIC_BYTES_LENGTH);
        return bytesToHex(topic, TOPIC_HEX_LENGTH);
      }

      throw new TypeError('invalid topic');
    }
    function makeTopicFromString(s) {
      if (typeof s !== 'string') {
        throw new TypeError('topic has to be string!');
      }

      return bytesToHex(keccak256Hash(s), TOPIC_HEX_LENGTH);
    }

    function isNodeJsError(e) {
      return isObject(e) && typeof e.code === 'string';
    }
    /**
     * Validates that passed string is valid URL of Bee.
     * We support only HTTP and HTTPS protocols.
     *
     * @param url
     */


    function isValidBeeUrl(url) {
      try {
        if (typeof url !== 'string') {
          return false;
        }

        const urlObject = new URL(url); // There can be wide range of protocols passed.

        return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
      } catch (e) {
        // URL constructor throws TypeError if not valid URL
        // TODO: Drop the `.code` hack for NodeJS environment: https://github.com/ethersphere/bee-js/issues/204
        if (e instanceof TypeError || isNodeJsError(e) && e.code === 'ERR_INVALID_URL') {
          return false;
        }

        throw e;
      }
    }
    /**
     * Validates that passed string is valid URL of Bee, if not it throws BeeArgumentError.
     * We support only HTTP and HTTPS protocols.
     * @param url
     * @throws BeeArgumentError if non valid URL
     */

    function assertBeeUrl(url) {
      if (!isValidBeeUrl(url)) {
        throw new BeeArgumentError('URL is not valid!', url);
      }
    }
    /**
     * Removes trailing slash out of the given string.
     * @param url
     */

    function stripLastSlash(url) {
      if (url.endsWith('/')) {
        return url.slice(0, -1);
      }

      return url;
    }

    var __awaiter$2 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    function serializeJson(data) {
      try {
        const jsonString = JSON.stringify(data);
        return new TextEncoder().encode(jsonString);
      } catch (e) {
        if (isError(e)) {
          e.message = `JsonFeed: ${e.message}`;
        }

        throw e;
      }
    }

    function getJsonData(bee, reader) {
      return __awaiter$2(this, void 0, void 0, function* () {
        const feedUpdate = yield reader.download();
        const retrievedData = yield bee.downloadData(feedUpdate.reference);
        return retrievedData.json();
      });
    }
    function setJsonData(bee, writer, postageBatchId, data, options) {
      return __awaiter$2(this, void 0, void 0, function* () {
        const serializedData = serializeJson(data);
        const {
          reference
        } = yield bee.uploadData(postageBatchId, serializedData, options);
        return writer.upload(postageBatchId, reference);
      });
    }

    var __awaiter$1 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    /**
     * Creates array in the format of Collection with data loaded from directory on filesystem.
     * The function loads all the data into memory!
     *
     * @param dir path to the directory
     */


    function makeCollectionFromFS(dir) {
      return __awaiter$1(this, void 0, void 0, function* () {
        throw new Error('Creating Collection from File System is not supported in browsers!');
      });
    }

    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    /**
     * The main component that abstracts operations available on the main Bee API.
     *
     * Not all methods are always available as it depends in what mode is Bee node launched in.
     * For example gateway mode and light node mode has only limited set of endpoints enabled.
     */

    class Bee {
      /**
       * @param url URL on which is the main API of Bee node exposed
       * @param options
       */
      constructor(url, options) {
        var _a;

        assertBeeUrl(url); // Remove last slash if present, as our endpoint strings starts with `/...`
        // which could lead to double slash in URL to which Bee responds with
        // unnecessary redirects.

        this.url = stripLastSlash(url);

        if (options === null || options === void 0 ? void 0 : options.signer) {
          this.signer = makeSigner(options.signer);
        }

        const kyOptions = {
          prefixUrl: this.url,
          timeout: (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : false,
          retry: options === null || options === void 0 ? void 0 : options.retry,
          fetch: options === null || options === void 0 ? void 0 : options.fetch,
          hooks: {
            beforeRequest: [],
            afterResponse: []
          }
        };

        if (options === null || options === void 0 ? void 0 : options.defaultHeaders) {
          kyOptions.headers = options.defaultHeaders;
        }

        if (options === null || options === void 0 ? void 0 : options.onRequest) {
          kyOptions.hooks.beforeRequest.push(wrapRequestClosure(options.onRequest));
        }

        if (options === null || options === void 0 ? void 0 : options.onResponse) {
          kyOptions.hooks.afterResponse.push(wrapResponseClosure(options.onResponse));
        }

        this.ky = makeDefaultKy(kyOptions);
      }
      /**
       * Upload data to a Bee node
       *
       * @param postageBatchId Postage BatchId to be used to upload the data with
       * @param data    Data to be uploaded
       * @param options Additional options like tag, encryption, pinning, content-type and request options
       *
       * @returns reference is a content hash of the data
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `POST /bytes`](https://docs.ethswarm.org/api/#tag/Bytes/paths/~1bytes/post)
       */


      uploadData(postageBatchId, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);
          assertData(data);
          if (options) assertUploadOptions(options);
          return upload$2(this.getKy(options), data, postageBatchId, options);
        });
      }
      /**
       * Download data as a byte array
       *
       * @param reference Bee data reference
       * @param options Options that affects the request behavior
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `GET /bytes`](https://docs.ethswarm.org/api/#tag/Bytes/paths/~1bytes~1{reference}/get)
       */


      downloadData(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return download$1(this.getKy(options), reference);
        });
      }
      /**
       * Download data as a Readable stream
       *
       * @param reference Bee data reference
       * @param options Options that affects the request behavior
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `GET /bytes`](https://docs.ethswarm.org/api/#tag/Bytes/paths/~1bytes~1{reference}/get)
       */


      downloadReadableData(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return downloadReadable(this.getKy(options), reference);
        });
      }
      /**
       * Upload chunk to a Bee node
       *
       * @param postageBatchId Postage BatchId to be used to upload the chunk with
       * @param data    Raw chunk to be uploaded
       * @param options Additional options like tag, encryption, pinning, content-type and request options
       *
       * @returns reference is a content hash of the data
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `POST /chunks`](https://docs.ethswarm.org/api/#tag/Chunk/paths/~1chunks/post)
       */


      uploadChunk(postageBatchId, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);

          if (!(data instanceof Uint8Array)) {
            throw new TypeError('Data has to be Uint8Array instance!');
          }

          if (data.length < SPAN_SIZE$1) {
            throw new BeeArgumentError(`Chunk has to have size of at least ${SPAN_SIZE$1}.`, data);
          }

          if (data.length > CHUNK_SIZE + SPAN_SIZE$1) {
            throw new BeeArgumentError(`Chunk has to have size of at most ${CHUNK_SIZE}.`, data);
          }

          if (options) assertUploadOptions(options);
          return upload$1(this.getKy(options), data, postageBatchId, options);
        });
      }
      /**
       * Download chunk as a byte array
       *
       * @param reference Bee chunk reference
       * @param options Options that affects the request behavior
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `GET /chunks`](https://docs.ethswarm.org/api/#tag/Chunk/paths/~1chunks~1{reference}/get)
       */


      downloadChunk(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return download(this.getKy(options), reference);
        });
      }
      /**
       * Upload single file to a Bee node.
       *
       * **To make sure that you won't loose critical data it is highly recommended to also
       * locally pin the data with `options.pin = true`**
       *
       * @param postageBatchId Postage BatchId to be used to upload the data with
       * @param data    Data or file to be uploaded
       * @param name    Optional name of the uploaded file
       * @param options Additional options like tag, encryption, pinning, content-type and request options
       *
       * @see [Bee docs - Keep your data alive / Postage stamps](https://docs.ethswarm.org/docs/access-the-swarm/keep-your-data-alive)
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `POST /bzz`](https://docs.ethswarm.org/api/#tag/File/paths/~1bzz/post)
       * @returns reference is a content hash of the file
       */


      uploadFile(postageBatchId, data, name, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);
          assertFileData(data);
          if (options) assertFileUploadOptions(options);

          if (name && typeof name !== 'string') {
            throw new TypeError('name has to be string or undefined!');
          }

          if (isFile(data)) {
            const fileData = yield fileArrayBuffer(data);
            const fileName = name !== null && name !== void 0 ? name : data.name;
            const contentType = data.type;
            const fileOptions = Object.assign({
              contentType
            }, options);
            return uploadFile$1(this.getKy(options), fileData, postageBatchId, fileName, fileOptions);
          } else if (isReadable(data) && (options === null || options === void 0 ? void 0 : options.tag) && !options.size) {
            // TODO: Needed until https://github.com/ethersphere/bee/issues/2317 is resolved
            const result = yield uploadFile$1(this.getKy(options), data, postageBatchId, name, options);
            yield this.updateTag(options.tag, result.reference);
            return result;
          } else {
            return uploadFile$1(this.getKy(options), data, postageBatchId, name, options);
          }
        });
      }
      /**
       * Download single file.
       *
       * @param reference Bee file reference
       * @param path If reference points to manifest, then this parameter defines path to the file
       * @param options Options that affects the request behavior
       *
       * @see Data
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `GET /bzz`](https://docs.ethswarm.org/api/#tag/Collection/paths/~1bzz~1{reference}~1{path}/get)
       */


      downloadFile(reference, path = '', options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return downloadFile$1(this.getKy(options), reference, path);
        });
      }
      /**
       * Download single file as a readable stream
       *
       * @param reference Hash reference to file
       * @param path If reference points to manifest / collections, then this parameter defines path to the file
       * @param options Options that affects the request behavior
       *
       * @see [Bee docs - Upload and download](https://docs.ethswarm.org/docs/access-the-swarm/upload-and-download)
       * @see [Bee API reference - `GET /bzz`](https://docs.ethswarm.org/api/#tag/Collection/paths/~1bzz~1{reference}~1{path}/get)
       */


      downloadReadableFile(reference, path = '', options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return downloadFileReadable(this.getKy(options), reference, path);
        });
      }
      /**
       * Upload collection of files to a Bee node
       *
       * Uses the FileList API from the browser.
       *
       * The returned `UploadResult.tag` might be undefined if called in CORS-enabled environment.
       * This will be fixed upon next Bee release. https://github.com/ethersphere/bee-js/issues/406
       *
       * @param postageBatchId Postage BatchId to be used to upload the data with
       * @param fileList list of files to be uploaded
       * @param options Additional options like tag, encryption, pinning and request options
       *
       * @see [Bee docs - Keep your data alive / Postage stamps](https://docs.ethswarm.org/docs/access-the-swarm/keep-your-data-alive)
       * @see [Bee docs - Upload directory](https://docs.ethswarm.org/docs/access-the-swarm/upload-a-directory/)
       * @see [Bee API reference - `POST /bzz`](https://docs.ethswarm.org/api/#tag/Collection/paths/~1bzz/post)
       */


      uploadFiles(postageBatchId, fileList, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);
          if (options) assertCollectionUploadOptions(options);
          const data = yield makeCollectionFromFileList(fileList);
          return uploadCollection(this.getKy(options), data, postageBatchId, options);
        });
      }
      /**
       * Upload Collection that you can assembly yourself.
       *
       * The returned `UploadResult.tag` might be undefined if called in CORS-enabled environment.
       * This will be fixed upon next Bee release. https://github.com/ethersphere/bee-js/issues/406
       *
       * @param postageBatchId
       * @param collection
       * @param options Collections and request options
       */


      uploadCollection(postageBatchId, collection, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);
          assertCollection(collection);
          if (options) assertCollectionUploadOptions(options);
          return uploadCollection(this.ky, collection, postageBatchId, options);
        });
      }
      /**
       * Upload collection of files.
       *
       * Available only in Node.js as it uses the `fs` module.
       *
       * The returned `UploadResult.tag` might be undefined if called in CORS-enabled environment.
       * This will be fixed upon next Bee release. https://github.com/ethersphere/bee-js/issues/406
       *
       * @param postageBatchId Postage BatchId to be used to upload the data with
       * @param dir the path of the files to be uploaded
       * @param options Additional options like tag, encryption, pinning and request options
       *
       * @see [Bee docs - Keep your data alive / Postage stamps](https://docs.ethswarm.org/docs/access-the-swarm/keep-your-data-alive)
       * @see [Bee docs - Upload directory](https://docs.ethswarm.org/docs/access-the-swarm/upload-a-directory/)
       * @see [Bee API reference - `POST /bzz`](https://docs.ethswarm.org/api/#tag/Collection/paths/~1bzz/post)
       */


      uploadFilesFromDirectory(postageBatchId, dir, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertBatchId(postageBatchId);
          if (options) assertCollectionUploadOptions(options);
          const data = yield makeCollectionFromFS();
          return uploadCollection(this.getKy(options), data, postageBatchId, options);
        });
      }
      /**
       * Create a new Tag which is meant for tracking progres of syncing data across network.
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param options Options that affects the request behavior
       * @see [Bee docs - Syncing / Tags](https://docs.ethswarm.org/docs/access-the-swarm/syncing)
       * @see [Bee API reference - `POST /tags`](https://docs.ethswarm.org/api/#tag/Tag/paths/~1tags/post)
       */


      createTag(options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          return createTag(this.getKy(options));
        });
      }
      /**
       * Fetches all tags.
       *
       * The listing is limited by options.limit. So you have to iterate using options.offset to get all tags.
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param options Options that affects the request behavior
       * @throws TypeError if limit or offset are not numbers or undefined
       * @throws BeeArgumentError if limit or offset have invalid options
       *
       * @see [Bee docs - Syncing / Tags](https://docs.ethswarm.org/docs/access-the-swarm/syncing)
       * @see [Bee API reference - `GET /tags`](https://docs.ethswarm.org/api/#tag/Tag/paths/~1tags/get)
       */


      getAllTags(options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertAllTagsOptions(options);
          return getAllTags(this.getKy(options), options === null || options === void 0 ? void 0 : options.offset, options === null || options === void 0 ? void 0 : options.limit);
        });
      }
      /**
       * Retrieve tag information from Bee node
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param tagUid UID or tag object to be retrieved
       * @param options Options that affects the request behavior
       * @throws TypeError if tagUid is in not correct format
       *
       * @see [Bee docs - Syncing / Tags](https://docs.ethswarm.org/docs/access-the-swarm/syncing)
       * @see [Bee API reference - `GET /tags/{uid}`](https://docs.ethswarm.org/api/#tag/Tag/paths/~1tags~1{uid}/get)
       *
       */


      retrieveTag(tagUid, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          tagUid = makeTagUid(tagUid);
          return retrieveTag(this.getKy(options), tagUid);
        });
      }
      /**
       * Delete Tag
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param tagUid UID or tag object to be retrieved
       * @param options Options that affects the request behavior
       * @throws TypeError if tagUid is in not correct format
       * @throws BeeResponse error if something went wrong on the Bee node side while deleting the tag.
       *
       * @see [Bee docs - Syncing / Tags](https://docs.ethswarm.org/docs/access-the-swarm/syncing)
       * @see [Bee API reference - `DELETE /tags/{uid}`](https://docs.ethswarm.org/api/#tag/Tag/paths/~1tags~1{uid}/delete)
       */


      deleteTag(tagUid, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          tagUid = makeTagUid(tagUid);
          return deleteTag(this.getKy(options), tagUid);
        });
      }
      /**
       * Update tag's total chunks count.
       *
       * This is important if you are uploading individual chunks with a tag. Then upon finishing the final root chunk,
       * you can use this method to update the total chunks count for the tag.
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param tagUid UID or tag object to be retrieved
       * @param reference The root reference that contains all the chunks to be counted
       * @param options Options that affects the request behavior
       * @throws TypeError if tagUid is in not correct format
       * @throws BeeResponse error if something went wrong on the Bee node side while deleting the tag.
       *
       * @see [Bee docs - Syncing / Tags](https://docs.ethswarm.org/docs/access-the-swarm/syncing)
       * @see [Bee API reference - `PATCH /tags/{uid}`](https://docs.ethswarm.org/api/#tag/Tag/paths/~1tags~1{uid}/patch)
       */


      updateTag(tagUid, reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertReference(reference);
          assertRequestOptions(options);
          tagUid = makeTagUid(tagUid);
          return updateTag(this.getKy(options), tagUid, reference);
        });
      }
      /**
       * Pin local data with given reference
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param reference Data reference
       * @param options Options that affects the request behavior
       * @throws TypeError if reference is in not correct format
       *
       * @see [Bee docs - Pinning](https://docs.ethswarm.org/docs/access-the-swarm/pinning)
       */


      pin(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return pin(this.getKy(options), reference);
        });
      }
      /**
       * Unpin local data with given reference
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param reference Data reference
       * @param options Options that affects the request behavior
       * @throws TypeError if reference is in not correct format
       *
       * @see [Bee docs - Pinning](https://docs.ethswarm.org/docs/access-the-swarm/pinning)
       */


      unpin(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return unpin(this.getKy(options), reference);
        });
      }
      /**
       * Get list of all locally pinned references
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param options Options that affects the request behavior
       * @see [Bee docs - Pinning](https://docs.ethswarm.org/docs/access-the-swarm/pinning)
       */


      getAllPins(options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          return getAllPins(this.getKy(options));
        });
      }
      /**
       * Get pinning status of chunk with given reference
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * @param reference Bee data reference
       * @param options Options that affects the request behavior
       * @throws TypeError if reference is in not correct format
       *
       * @see [Bee docs - Pinning](https://docs.ethswarm.org/docs/access-the-swarm/pinning)
       */


      getPin(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return getPin(this.getKy(options), reference);
        });
      }
      /**
       * Instructs the Bee node to reupload a locally pinned data into the network.
       *
       * @param reference
       * @param options Options that affects the request behavior
       * @throws BeeArgumentError if the reference is not locally pinned
       * @throws TypeError if reference is in not correct format
       *
       * @see [Bee API reference - `PUT /stewardship`](https://docs.ethswarm.org/api/#tag/Stewardship/paths/~1stewardship~1{reference}/put)
       */


      reuploadPinnedData(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          yield reupload(this.getKy(options), reference);
        });
      }
      /**
       * Checks if content specified by reference is retrievable from the network.
       *
       * @param reference The checked content
       * @param options Options that affects the request behavior
       *
       * @see [Bee API reference - `GET /stewardship`](https://docs.ethswarm.org/api/#tag/Stewardship/paths/~1stewardship~1{reference}/get)
       */


      isReferenceRetrievable(reference, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertReference(reference);
          return isRetrievable(this.getKy(options), reference);
        });
      }
      /**
       * Send data to recipient or target with Postal Service for Swarm.
       *
       * Because sending a PSS message is slow and CPU intensive,
       * it is not supposed to be used for general messaging but
       * most likely for setting up an encrypted communication
       * channel by sending an one-off message.
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * **Warning! If the recipient Bee node is a light node, then he will never receive the message!**
       * This is because light nodes does not fully participate in the data exchange in Swarm network and hence the message won't arrive to them.
       *
       * @param postageBatchId Postage BatchId that will be assigned to sent message
       * @param topic Topic name
       * @param target Target message address prefix. Has a limit on length. Recommend to use `Utils.Pss.makeMaxTarget()` to get the most specific target that Bee node will accept.
       * @param data Message to be sent
       * @param recipient Recipient public key
       * @param options Options that affects the request behavior
       * @throws TypeError if `data`, `batchId`, `target` or `recipient` are in invalid format
       *
       * @see [Bee docs - PSS](https://docs.ethswarm.org/docs/dapps-on-swarm/pss)
       * @see [Bee API reference - `POST /pss`](https://docs.ethswarm.org/api/#tag/Postal-Service-for-Swarm/paths/~1pss~1send~1{topic}~1{targets}/post)
       */


      pssSend(postageBatchId, topic, target, data, recipient, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertData(data);
          assertBatchId(postageBatchId);
          assertAddressPrefix(target);

          if (typeof topic !== 'string') {
            throw new TypeError('topic has to be an string!');
          }

          if (recipient) {
            assertPublicKey(recipient);
            return send(this.getKy(options), topic, target, data, postageBatchId, recipient);
          } else {
            return send(this.getKy(options), topic, target, data, postageBatchId);
          }
        });
      }
      /**
       * Subscribe to messages for given topic with Postal Service for Swarm
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * **Warning! If connected Bee node is a light node, then he will never receive any message!**
       * This is because light nodes does not fully participate in the data exchange in Swarm network and hence the message won't arrive to them.
       *
       * @param topic Topic name
       * @param handler Message handler interface
       *
       * @returns Subscription to a given topic
       *
       * @see [Bee docs - PSS](https://docs.ethswarm.org/docs/dapps-on-swarm/pss)
       * @see [Bee API reference - `GET /pss`](https://docs.ethswarm.org/api/#tag/Postal-Service-for-Swarm/paths/~1pss~1subscribe~1{topic}/get)
       */


      pssSubscribe(topic, handler) {
        assertPssMessageHandler(handler);

        if (typeof topic !== 'string') {
          throw new TypeError('topic has to be an string!');
        }

        const ws = subscribe(this.url, topic);
        let cancelled = false;

        const cancel = () => {
          if (cancelled === false) {
            cancelled = true; // although the WebSocket API offers a `close` function, it seems that
            // with the library that we are using (isomorphic-ws) it doesn't close
            // the websocket properly, whereas `terminate` does

            if (ws.terminate) ws.terminate();else ws.close(); // standard Websocket in browser does not have terminate function
          }
        };

        const subscription = {
          topic,
          cancel
        };

        ws.onmessage = ev => __awaiter(this, void 0, void 0, function* () {
          const data = yield prepareWebsocketData(ev.data); // ignore empty messages

          if (data.length > 0) {
            handler.onMessage(wrapBytesWithHelpers(data), subscription);
          }
        });

        ws.onerror = ev => {
          // ignore errors after subscription was cancelled
          if (!cancelled) {
            handler.onError(new BeeError(ev.message), subscription);
          }
        };

        return subscription;
      }
      /**
       * Receive message with Postal Service for Swarm
       *
       * Because sending a PSS message is slow and CPU intensive,
       * it is not supposed to be used for general messaging but
       * most likely for setting up an encrypted communication
       * channel by sending an one-off message.
       *
       * This is a helper function to wait for exactly one message to
       * arrive and then cancel the subscription. Additionally a
       * timeout can be provided for the message to arrive or else
       * an error will be thrown.
       *
       * **Warning! Not allowed when node is in Gateway mode!**
       *
       * **Warning! If connected Bee node is a light node, then he will never receive any message!**
       * This is because light nodes does not fully participate in the data exchange in Swarm network and hence the message won't arrive to them.
       *
       * @param topic Topic name
       * @param timeoutMsec Timeout in milliseconds
       *
       * @returns Message in byte array
       *
       * @see [Bee docs - PSS](https://docs.ethswarm.org/docs/dapps-on-swarm/pss)
       * @see [Bee API reference - `GET /pss`](https://docs.ethswarm.org/api/#tag/Postal-Service-for-Swarm/paths/~1pss~1subscribe~1{topic}/get)
       */


      pssReceive(topic, timeoutMsec = 0) {
        return __awaiter(this, void 0, void 0, function* () {
          if (typeof topic !== 'string') {
            throw new TypeError('topic has to be an string!');
          }

          if (typeof timeoutMsec !== 'number') {
            throw new TypeError('timeoutMsc parameter has to be a number!');
          }

          return new Promise((resolve, reject) => {
            let timeout;
            const subscription = this.pssSubscribe(topic, {
              onError: error => {
                clearTimeout(timeout);
                subscription.cancel();
                reject(error.message);
              },
              onMessage: message => {
                clearTimeout(timeout);
                subscription.cancel();
                resolve(message);
              }
            });

            if (timeoutMsec > 0) {
              // we need to cast the type because Typescript is getting confused with Node.js'
              // alternative type definitions
              timeout = setTimeout(() => {
                subscription.cancel();
                reject(new BeeError('pssReceive timeout'));
              }, timeoutMsec);
            }
          });
        });
      }
      /**
       * Create feed manifest chunk and return the reference to it.
       *
       * Feed manifest chunk allows for a feed to be able to be resolved through `/bzz` endpoint.
       *
       * @param postageBatchId  Postage BatchId to be used to create the Feed Manifest
       * @param type            The type of the feed, can be 'epoch' or 'sequence'
       * @param topic           Topic in hex or bytes
       * @param owner           Owner's ethereum address in hex or bytes
       * @param options Options that affects the request behavior
       *
       * @see [Bee docs - Feeds](https://docs.ethswarm.org/docs/dapps-on-swarm/feeds)
       * @see [Bee API reference - `POST /feeds`](https://docs.ethswarm.org/api/#tag/Feed/paths/~1feeds~1{owner}~1{topic}/post)
       */


      createFeedManifest(postageBatchId, type, topic, owner, options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options);
          assertFeedType(type);
          assertBatchId(postageBatchId);
          const canonicalTopic = makeTopic(topic);
          const canonicalOwner = makeHexEthAddress(owner);
          return createFeedManifest(this.getKy(options), canonicalOwner, canonicalTopic, postageBatchId, {
            type
          });
        });
      }
      /**
       * Make a new feed reader for downloading feed updates.
       *
       * @param type    The type of the feed, can be 'epoch' or 'sequence'
       * @param topic   Topic in hex or bytes
       * @param owner   Owner's ethereum address in hex or bytes
       * @param options Options that affects the request behavior
       *
       * @see [Bee docs - Feeds](https://docs.ethswarm.org/docs/dapps-on-swarm/feeds)
       */


      makeFeedReader(type, topic, owner, options) {
        assertRequestOptions(options);
        assertFeedType(type);
        const canonicalTopic = makeTopic(topic);
        const canonicalOwner = makeHexEthAddress(owner);
        return makeFeedReader(this.getKy(options), type, canonicalTopic, canonicalOwner);
      }
      /**
       * Make a new feed writer for updating feeds
       *
       * @param type    The type of the feed, can be 'epoch' or 'sequence'
       * @param topic   Topic in hex or bytes
       * @param signer  The signer's private key or a Signer instance that can sign data
       * @param options Options that affects the request behavior
       *
       * @see [Bee docs - Feeds](https://docs.ethswarm.org/docs/dapps-on-swarm/feeds)
       */


      makeFeedWriter(type, topic, signer, options) {
        assertRequestOptions(options);
        assertFeedType(type);
        const canonicalTopic = makeTopic(topic);
        const canonicalSigner = this.resolveSigner(signer);
        return makeFeedWriter(this.getKy(options), type, canonicalTopic, canonicalSigner);
      }
      /**
       * High-level function that allows you to easily set JSON data to feed.
       * JSON-like data types are supported.
       *
       * The default Signer of Bee instance is used if `options.signer` is not specified.
       * If none of those two is set error is thrown.
       *
       * @param postageBatchId Postage BatchId to be used to upload the data with
       * @param topic Human readable string, that is internally hashed so there are no constrains there.
       * @param data JSON compatible data
       * @param options
       * @param options.signer Custom instance of Signer or string with private key.
       * @param options.type Type of Feed
       *
       * @throws BeeError if `options.signer` is not specified nor the default Signer on Bee's instance is specified.
       *
       * @see [Bee docs - Feeds](https://docs.ethswarm.org/docs/dapps-on-swarm/feeds)
       */


      setJsonFeed(postageBatchId, topic, data, options) {
        var _a;

        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options, 'JsonFeedOptions');
          assertBatchId(postageBatchId);
          const hashedTopic = this.makeFeedTopic(topic);
          const feedType = (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : DEFAULT_FEED_TYPE;
          const writer = this.makeFeedWriter(feedType, hashedTopic, options === null || options === void 0 ? void 0 : options.signer, options);
          return setJsonData(this, writer, postageBatchId, data, options);
        });
      }
      /**
       * High-level function that allows you to easily get data from feed.
       * Returned data are parsed using JSON.parse().
       *
       * This method also supports specification of `signer` object passed to constructor. The order of evaluation is:
       *  - `options.address`
       *  - `options.signer`
       *  - `this.signer`
       *
       * At least one of these has to be specified!
       *
       * @param topic Human readable string, that is internally hashed so there are no constrains there.
       * @param options
       * @param options.signer Custom instance of Signer or string with private key. This option is exclusive with `address` option.
       * @param options.address Ethereum address of owner of the feed that signed it. This option is exclusive with `signer` option.
       * @param options.type Type of Feed
       *
       * @see [Bee docs - Feeds](https://docs.ethswarm.org/docs/dapps-on-swarm/feeds)
       */


      getJsonFeed(topic, options) {
        var _a;

        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options, 'JsonFeedOptions');
          const hashedTopic = this.makeFeedTopic(topic);
          const feedType = (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : DEFAULT_FEED_TYPE;

          if ((options === null || options === void 0 ? void 0 : options.signer) && (options === null || options === void 0 ? void 0 : options.address)) {
            throw new BeeError('Both options "signer" and "address" can not be specified at one time!');
          }

          let address;

          if (options === null || options === void 0 ? void 0 : options.address) {
            address = makeEthAddress(options === null || options === void 0 ? void 0 : options.address);
          } else {
            try {
              address = this.resolveSigner(options === null || options === void 0 ? void 0 : options.signer).address;
            } catch (e) {
              if (e instanceof BeeError) {
                throw new BeeError('Either address, signer or default signer has to be specified!');
              } else {
                throw e;
              }
            }
          }

          const reader = this.makeFeedReader(feedType, hashedTopic, address, options);
          return getJsonData(this, reader);
        });
      }
      /**
       * Make a new feed topic from a string
       *
       * Because the topic has to be 32 bytes long this function
       * hashes the input string to create a topic string of arbitrary length.
       *
       * @param topic The input string
       */


      makeFeedTopic(topic) {
        return makeTopicFromString(topic);
      }
      /**
       * Returns an object for reading single owner chunks
       *
       * @param ownerAddress The ethereum address of the owner
       * @param options Options that affects the request behavior
       * @see [Bee docs - Chunk Types](https://docs.ethswarm.org/docs/dapps-on-swarm/chunk-types#single-owner-chunks)
       */


      makeSOCReader(ownerAddress, options) {
        assertRequestOptions(options);
        const canonicalOwner = makeEthAddress(ownerAddress);
        return {
          owner: makeHexEthAddress(canonicalOwner),
          download: downloadSingleOwnerChunk.bind(null, this.getKy(options), canonicalOwner)
        };
      }
      /**
       * Returns an object for reading and writing single owner chunks
       *
       * @param signer The signer's private key or a Signer instance that can sign data
       * @param options Options that affects the request behavior
       * @see [Bee docs - Chunk Types](https://docs.ethswarm.org/docs/dapps-on-swarm/chunk-types#single-owner-chunks)
       */


      makeSOCWriter(signer, options) {
        assertRequestOptions(options);
        const canonicalSigner = this.resolveSigner(signer);
        return Object.assign(Object.assign({}, this.makeSOCReader(canonicalSigner.address, options)), {
          upload: uploadSingleOwnerChunkData.bind(null, this.getKy(options), canonicalSigner)
        });
      }
      /**
       * Ping the Bee node to see if there is a live Bee node on the given URL.
       *
       * @param options Options that affects the request behavior
       * @throws If connection was not successful throw error
       */


      checkConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options, 'PostageBatchOptions');
          return checkConnection(this.getKy(options));
        });
      }
      /**
       * Ping the Bee node to see if there is a live Bee node on the given URL.
       *
       * @param options Options that affects the request behavior
       * @returns true if successful, false on error
       */


      isConnected(options) {
        return __awaiter(this, void 0, void 0, function* () {
          assertRequestOptions(options, 'PostageBatchOptions');

          try {
            yield checkConnection(this.getKy(options));
          } catch (e) {
            return false;
          }

          return true;
        });
      }
      /**
       * @param signer
       * @private
       * @throws BeeError if either no Signer was passed or no default Signer was specified for the instance
       */


      resolveSigner(signer) {
        if (signer) {
          return makeSigner(signer);
        }

        if (this.signer) {
          return this.signer;
        }

        throw new BeeError('You have to pass Signer as property to either the method call or constructor! Non found.');
      }

      getKy(options) {
        if (!options) {
          return this.ky;
        }

        return this.ky.extend(options);
      }

    }

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    const debug = (
      typeof process === 'object' &&
      process.env &&
      process.env.NODE_DEBUG &&
      /\bsemver\b/i.test(process.env.NODE_DEBUG)
    ) ? (...args) => console.error('SEMVER', ...args)
      : () => {};

    var debug_1 = debug;

    // Note: this is the semver.org version of the spec that it implements
    // Not necessarily the package version of this code.
    const SEMVER_SPEC_VERSION = '2.0.0';

    const MAX_LENGTH = 256;
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
    /* istanbul ignore next */ 9007199254740991;

    // Max safe segment length for coercion.
    const MAX_SAFE_COMPONENT_LENGTH = 16;

    var constants = {
      SEMVER_SPEC_VERSION,
      MAX_LENGTH,
      MAX_SAFE_INTEGER,
      MAX_SAFE_COMPONENT_LENGTH,
    };

    createCommonjsModule(function (module, exports) {
    const { MAX_SAFE_COMPONENT_LENGTH } = constants;

    exports = module.exports = {};

    // The actual regexps go on exports.re
    const re = exports.re = [];
    const src = exports.src = [];
    const t = exports.t = {};
    let R = 0;

    const createToken = (name, value, isGlobal) => {
      const index = R++;
      debug_1(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    };

    // The following Regular Expressions can be used for tokenizing,
    // validating, and parsing SemVer version strings.

    // ## Numeric Identifier
    // A single `0`, or a non-zero digit followed by zero or more digits.

    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

    // ## Non-numeric Identifier
    // Zero or more digits, followed by a letter or hyphen, and then zero or
    // more letters, digits, or hyphens.

    createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

    // ## Main Version
    // Three dot-separated numeric identifiers.

    createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                       `(${src[t.NUMERICIDENTIFIER]})\\.` +
                       `(${src[t.NUMERICIDENTIFIER]})`);

    createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                            `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                            `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

    // ## Pre-release Version Identifier
    // A numeric identifier, or a non-numeric identifier.

    createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`);

    createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`);

    // ## Pre-release Version
    // Hyphen, followed by one or more dot-separated pre-release version
    // identifiers.

    createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

    createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

    // ## Build Metadata Identifier
    // Any combination of digits, letters, or hyphens.

    createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

    // ## Build Metadata
    // Plus sign, followed by one or more period-separated build metadata
    // identifiers.

    createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

    // ## Full Version String
    // A main version, followed optionally by a pre-release version and
    // build metadata.

    // Note that the only major, minor, patch, and pre-release sections of
    // the version string are capturing groups.  The build metadata is not a
    // capturing group, because it should not ever be used in version
    // comparison.

    createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`);

    createToken('FULL', `^${src[t.FULLPLAIN]}$`);

    // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
    // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
    // common in the npm registry.
    createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`);

    createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

    createToken('GTLT', '((?:<|>)?=?)');

    // Something like "2.*" or "1.2.x".
    // Note that "x.x" is a valid xRange identifer, meaning "any version"
    // Only the first item is strictly required.
    createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

    createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                       `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                       `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                       `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                       `)?)?`);

    createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                            `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                            `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                            `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                            `)?)?`);

    createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

    // Coercion.
    // Extract anything that could conceivably be a part of a valid semver
    createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
                  `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
                  `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
                  `(?:$|[^\\d])`);
    createToken('COERCERTL', src[t.COERCE], true);

    // Tilde ranges.
    // Meaning is "reasonably at or greater than"
    createToken('LONETILDE', '(?:~>?)');

    createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = '$1~';

    createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

    // Caret ranges.
    // Meaning is "at least and backwards compatible with"
    createToken('LONECARET', '(?:\\^)');

    createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = '$1^';

    createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

    // A simple gt/lt/eq thing, or just "" to indicate "any version"
    createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

    // An expression to strip any whitespace between the gtlt and the thing
    // it modifies, so that `> 1.2.3` ==> `>1.2.3`
    createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = '$1$2$3';

    // Something like `1.2.3 - 1.2.4`
    // Note that these all use the loose form, because they'll be
    // checked against either the strict or loose comparator form
    // later.
    createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                       `\\s+-\\s+` +
                       `(${src[t.XRANGEPLAIN]})` +
                       `\\s*$`);

    createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                            `\\s+-\\s+` +
                            `(${src[t.XRANGEPLAINLOOSE]})` +
                            `\\s*$`);

    // Star ranges basically just allow anything at all.
    createToken('STAR', '(<|>)?=?\\s*\\*');
    // >=0.0.0 is like a star
    createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
    createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
    });

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    const bee = new Bee("http://localhost:1633");
    const batchId = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";
    const uploadFile = async (file, fileName, contentType, fileSize) => {
        const tag = await bee.createTag();
        const updatedTag = await bee.retrieveTag(tag);
        console.log("🚀 ~ file: beejs.ts ~ line 10 ~ uploadFile ~ updatedTag", updatedTag);
        // console.log("🚀 ~ file: beejs.ts ~ line 8 ~ uploadFile ~ file", file);
        const result = await bee.uploadFile(batchId, file, fileName, {
            pin: true,
            size: fileSize,
            contentType: contentType,
            tag: tag.uid,
        });
        const updatedTag2 = await bee.retrieveTag(tag);
        console.log("🚀 ~ file: beejs.ts ~ line 19 ~ uploadFile ~ updatedTag2", updatedTag2);
        return result.reference;
    };
    const downloadFile = async (fileReference) => await bee.downloadFile(fileReference);

    /* src/App.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals$1;
    const file = "src/App.svelte";

    // (76:6) {#if imagePath}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*imagePath*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-t19x4a");
    			add_location(img, file, 76, 8, 2915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imagePath*/ 16 && !src_url_equal(img.src, img_src_value = /*imagePath*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(76:6) {#if imagePath}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if image}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svelte-t19x4a");
    			add_location(div, file, 94, 6, 3280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[13](div);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(94:4) {#if image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let section0;
    	let div;
    	let t4;
    	let input0;
    	let br0;
    	let t5;
    	let input1;
    	let t6;
    	let br1;
    	let t7;
    	let button;
    	let t9;
    	let section1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*imagePath*/ ctx[4] && create_if_block_1(ctx);
    	let if_block1 = /*image*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text("Hello ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text("!");
    			t3 = space();
    			section0 = element("section");
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t4 = space();
    			input0 = element("input");
    			br0 = element("br");
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			br1 = element("br");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Upload";
    			t9 = space();
    			section1 = element("section");
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "svelte-t19x4a");
    			add_location(h1, file, 71, 4, 2828);
    			add_location(header, file, 70, 2, 2815);
    			attr_dev(div, "class", "svelte-t19x4a");
    			add_location(div, file, 74, 4, 2879);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "File name");
    			attr_dev(input0, "id", "fileName");
    			add_location(input0, file, 80, 4, 2974);
    			add_location(br0, file, 85, 6, 3083);
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "id", "file");
    			attr_dev(input1, "name", "file");
    			add_location(input1, file, 87, 4, 3095);
    			add_location(br1, file, 88, 4, 3175);
    			add_location(button, file, 90, 4, 3187);
    			attr_dev(section0, "class", "svelte-t19x4a");
    			add_location(section0, file, 73, 2, 2865);
    			attr_dev(section1, "class", "svelte-t19x4a");
    			add_location(section1, file, 92, 2, 3248);
    			attr_dev(main, "class", "svelte-t19x4a");
    			add_location(main, file, 69, 0, 2806);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			append_dev(main, section0);
    			append_dev(section0, div);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(section0, t4);
    			append_dev(section0, input0);
    			set_input_value(input0, /*fileName*/ ctx[5]);
    			append_dev(section0, br0);
    			append_dev(section0, t5);
    			append_dev(section0, input1);
    			append_dev(section0, t6);
    			append_dev(section0, br1);
    			append_dev(section0, t7);
    			append_dev(section0, button);
    			append_dev(main, t9);
    			append_dev(main, section1);
    			if (if_block1) if_block1.m(section1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[12]),
    					listen_dev(input1, "change", /*fileload*/ ctx[6], false, false, false),
    					listen_dev(button, "click", /*fileupload*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);

    			if (/*imagePath*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*fileName*/ 32 && input0.value !== /*fileName*/ ctx[5]) {
    				set_input_value(input0, /*fileName*/ ctx[5]);
    			}

    			if (/*image*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(section1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;

    	let uploadedFileReference = // "74e785efff856afe89911cae8cbc51125d30c00e1a06396fbfb235d0b3d84433";
    	// "36899577edc82833b0b90a5fc9f58607e466a76a0ce86746ce8d2f71f5b484a7";
    	// "0e6e400b44e75bfcf8053df1788b56023abe03063f321c64ce9d39f0228673fb";
    	// "c89f75b1de77d004ebd31a9b5bdf142462a6bfd8a5c10ade73513d03b9bb77c8";
    	"d3c1e2faf179138a3ccabec3d162d4a6e436106b08bda282fb4acb57a3454277";

    	// "3ad6588e0d1bdf183f65ca1cbd0b3e587e778162b05d4632a4cbdcd1285b55cf";
    	// "64a85b2b6f8b03a56ccb2027bd06b3c7b06fe7ebb6057e23913fb7361b85e920";
    	// "64a85b2b6f8b03a56ccb2027bd06b3c7b06fe7ebb6057e23913fb7361b85e920";
    	// "bbf7b592eb7e54c52d35666456abfcbb8d50a71d1107258f38b1d0678027d551";
    	// "515cdb766f1c135eaacbf3a5f974412eae41445ae38e99e4733fa288b6360c34";
    	// "dcb36325019f86ffaffb35ce681f58f01fee1086bcabecc6968c6b00231a7bb4";
    	let swarmData;

    	let files;
    	let imagePath;
    	let fileName;
    	let fileSize;
    	let contentType;
    	let imageContainer;
    	let image = new Image(300, 200);
    	let uploadedRef;

    	onMount(async () => {
    		$$invalidate(9, swarmData = await downloadFile(uploadedFileReference));
    	});

    	const resetDownloadedFile = async uploadedFileReference => {
    		$$invalidate(9, swarmData = await downloadFile(uploadedFileReference));
    		$$invalidate(1, files = undefined);
    		$$invalidate(4, imagePath = "");
    		$$invalidate(5, fileName = undefined);
    		contentType = undefined;
    		fileSize = undefined;
    	};

    	//////////////////////////////////////////////
    	const fileload = () => {
    		if (files) {
    			let reader = new FileReader();
    			reader.readAsDataURL(files[0]);

    			reader.onload = e => {
    				$$invalidate(4, imagePath = e.target.result.toString());
    				contentType = files[0].type;
    				fileSize = files[0].size;
    				console.log("🚀 ~ file: App.svelte ~ line 77 ~ fileload ~ files[0]", files[0]);
    			};
    		}
    	};

    	const fileupload = async () => {
    		if (files && contentType && fileSize) {
    			$$invalidate(10, uploadedRef = await uploadFile(files[0], fileName || files[0].name, contentType, fileSize));
    			$$invalidate(8, uploadedFileReference = uploadedRef);
    		}

    		console.log("🚀 ~ file: App.svelte ~ line 85 ~ fileupload ~ contentType", contentType);
    	};

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fileName = this.value;
    		$$invalidate(5, fileName);
    	}

    	function input1_change_handler() {
    		files = this.files;
    		$$invalidate(1, files);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imageContainer = $$value;
    			$$invalidate(2, imageContainer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		uploadFile,
    		downloadFile,
    		name,
    		uploadedFileReference,
    		swarmData,
    		files,
    		imagePath,
    		fileName,
    		fileSize,
    		contentType,
    		imageContainer,
    		image,
    		uploadedRef,
    		resetDownloadedFile,
    		fileload,
    		fileupload
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('uploadedFileReference' in $$props) $$invalidate(8, uploadedFileReference = $$props.uploadedFileReference);
    		if ('swarmData' in $$props) $$invalidate(9, swarmData = $$props.swarmData);
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    		if ('imagePath' in $$props) $$invalidate(4, imagePath = $$props.imagePath);
    		if ('fileName' in $$props) $$invalidate(5, fileName = $$props.fileName);
    		if ('fileSize' in $$props) fileSize = $$props.fileSize;
    		if ('contentType' in $$props) contentType = $$props.contentType;
    		if ('imageContainer' in $$props) $$invalidate(2, imageContainer = $$props.imageContainer);
    		if ('image' in $$props) $$invalidate(3, image = $$props.image);
    		if ('uploadedRef' in $$props) $$invalidate(10, uploadedRef = $$props.uploadedRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*uploadedFileReference*/ 256) {
    			resetDownloadedFile(uploadedFileReference);
    		}

    		if ($$self.$$.dirty & /*swarmData*/ 512) {
    			if (swarmData) console.log("🚀 ~ file: App.svelte ~ line 21 ~ onMount ~ swarmData", swarmData);
    		}

    		if ($$self.$$.dirty & /*swarmData, imageContainer, image*/ 524) {
    			if (swarmData === null || swarmData === void 0
    			? void 0
    			: swarmData.data.buffer) {
    				$$invalidate(3, image.src = URL.createObjectURL(new Blob([swarmData.data.buffer], { type: swarmData.contentType })), image);
    				imageContainer.appendChild(image);
    				console.log("🚀 ~ file: App.svelte ~ line 33 ~ image", image);
    			}
    		}

    		if ($$self.$$.dirty & /*files*/ 2) {
    			if (files) console.log("files[0].type", files[0].type);
    		}

    		if ($$self.$$.dirty & /*uploadedRef*/ 1024) {
    			console.log("uploadedRef :", uploadedRef);
    		}
    	};

    	return [
    		name,
    		files,
    		imageContainer,
    		image,
    		imagePath,
    		fileName,
    		fileload,
    		fileupload,
    		uploadedFileReference,
    		swarmData,
    		uploadedRef,
    		input0_input_handler,
    		input1_change_handler,
    		div_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: "SwarmPress",
        },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
