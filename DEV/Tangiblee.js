! function () {
    try {
        window.TrackJS = window.trackJs = function (e, t, i) {
            "use awesome";
            var n = function (e, t) {
                this.config = e, this.onError = t, e.enabled && this.watch()
            };
            n.prototype = {
                watch: function () {
                    u.forEach(["EventTarget", "Node", "XMLHttpRequest"], function (t) {
                        u.has(e, t + ".prototype.addEventListener") && u.hasOwn(e[t].prototype, "addEventListener") && this.wrapEventTarget(e[t].prototype)
                    }, this), this.wrapTimer("setTimeout"), this.wrapTimer("setInterval")
                },
                wrap: function (e) {
                    function t() {
                        try {
                            return e.apply(this, arguments)
                        } catch (t) {
                            throw i.onError("catch", t, {
                                bindTime: a,
                                bindStack: o
                            }), u.wrapError(t)
                        }
                    }
                    var i = this;
                    try {
                        if (!u.isFunction(e) || u.hasOwn(e, "__trackjs__")) return e;
                        if (u.hasOwn(e, "__trackjs_state__")) return e.__trackjs_state__
                    } catch (n) {
                        return e
                    }
                    var a, o;
                    if (i.config.bindStack) try {
                        throw Error()
                    } catch (n) {
                        o = n.stack, a = u.isoNow()
                    }
                    for (var r in e) u.hasOwn(e, r) && (t[r] = e[r]);
                    return t.prototype = e.prototype, t.__trackjs__ = !0, e.__trackjs_state__ = t
                },
                wrapEventTarget: function (e) {
                    var t = this;
                    u.has(e, "addEventListener.call") && u.has(e, "removeEventListener.call") && (u.patch(e, "addEventListener", function (e) {
                        return function (i, n, a, o) {
                            try {
                                u.has(n, "handleEvent") && (n.handleEvent = t.wrap(n.handleEvent))
                            } catch (r) {}
                            return e.call(this, i, t.wrap(n), a, o)
                        }
                    }), u.patch(e, "removeEventListener", function (e) {
                        return function (t, i, n, a) {
                            try {
                                i = i && (i.__trackjs_state__ || i)
                            } catch (o) {}
                            return e.call(this, t, i, n, a)
                        }
                    }))
                },
                wrapTimer: function (t) {
                    var i = this;
                    u.patch(e, t, function (e) {
                        return function (t, n) {
                            var a = Array.prototype.slice.call(arguments),
                                o = a[0];
                            return u.isFunction(o) && (a[0] = i.wrap(o)), u.has(e, "apply") ? e.apply(this, a) : e(a[0], a[1])
                        }
                    })
                }
            };
            var a = function (e) {
                this.initCurrent(e)
            };
            a.prototype = {
                current: {},
                initOnly: {
                    application: !0,
                    cookie: !0,
                    enabled: !0,
                    token: !0,
                    callback: {
                        enabled: !0
                    },
                    console: {
                        enabled: !0
                    },
                    navigation: {
                        enabled: !0
                    },
                    network: {
                        enabled: !0,
                        fetch: !0
                    },
                    visitor: {
                        enabled: !0
                    },
                    window: {
                        enabled: !0,
                        promise: !0
                    }
                },
                defaults: {
                    application: "",
                    cookie: !1,
                    dedupe: !0,
                    dependencies: !0,
                    enabled: !0,
                    errorURL: "https://capture.trackjs.com/capture",
                    errorNoSSLURL: "http://capture.trackjs.com/capture",
                    faultURL: "https://usage.trackjs.com/fault.gif",
                    onError: function () {
                        return !0
                    },
                    serialize: function (e) {
                        function t(e) {
                            var t = "<" + e.tagName.toLowerCase();
                            e = e.attributes || [];
                            for (var i = 0; i < e.length; i++) t += " " + e[i].name + '="' + e[i].value + '"';
                            return t + ">"
                        }
                        if ("" === e) return "Empty String";
                        if (e === i) return "undefined";
                        if (u.isString(e) || u.isNumber(e) || u.isBoolean(e) || u.isFunction(e)) return "" + e;
                        if (u.isElement(e)) return t(e);
                        if ("symbol" == typeof e) return Symbol.prototype.toString.call(e);
                        var n;
                        try {
                            n = JSON.stringify(e, function (e, n) {
                                return n === i ? "undefined" : u.isNumber(n) && isNaN(n) ? "NaN" : u.isError(n) ? {
                                    name: n.name,
                                    message: n.message,
                                    stack: n.stack
                                } : u.isElement(n) ? t(n) : n
                            })
                        } catch (a) {
                            n = "";
                            for (var o in e) e.hasOwnProperty(o) && (n += ',"' + o + '":"' + e[o] + '"');
                            n = n ? "{" + n.replace(",", "") + "}" : "Unserializable Object"
                        }
                        return n.replace(/"undefined"/g, "undefined").replace(/"NaN"/g, "NaN")
                    },
                    sessionId: "",
                    token: "",
                    userId: "",
                    version: "",
                    callback: {
                        enabled: !0,
                        bindStack: !1
                    },
                    console: {
                        enabled: !0,
                        display: !0,
                        error: !0,
                        warn: !1,
                        watch: ["log", "debug", "info", "warn", "error"]
                    },
                    navigation: {
                        enabled: !0
                    },
                    network: {
                        enabled: !0,
                        error: !0,
                        fetch: !0
                    },
                    visitor: {
                        enabled: !0
                    },
                    usageURL: "https://usage.trackjs.com/usage.gif",
                    window: {
                        enabled: !0,
                        promise: !0
                    }
                },
                initCurrent: function (e) {
                    return this.validate(e, this.defaults, "config", {}) ? (this.current = u.defaultsDeep({}, e, this.defaults), !0) : (this.current = u.defaultsDeep({}, this.defaults), console.log("init current config", this.current), !1)
                },
                setCurrent: function (e) {
                    return !!this.validate(e, this.defaults, "config", this.initOnly) && (this.current = u.defaultsDeep({}, e, this.current), !0)
                },
                validate: function (e, t, i, n) {
                    var a = !0;
                    i = i || "", n = n || {};
                    for (var o in e)
                        if (e.hasOwnProperty(o))
                            if (t.hasOwnProperty(o)) {
                                var r = typeof t[o];
                                r !== typeof e[o] ? (console.warn(i + "." + o + ": property must be type " + r + "."), a = !1) : "[object Array]" !== Object.prototype.toString.call(e[o]) || this.validateArray(e[o], t[o], i + "." + o) ? "[object Object]" === Object.prototype.toString.call(e[o]) ? a = this.validate(e[o], t[o], i + "." + o, n[o]) : n.hasOwnProperty(o) && (console.warn(i + "." + o + ": property cannot be set after load."), a = !1) : a = !1
                            } else console.warn(i + "." + o + ": property not supported."), a = !1;
                    return a
                },
                validateArray: function (e, t, i) {
                    var n = !0;
                    i = i || "";
                    for (var a = 0; a < e.length; a++) u.contains(t, e[a]) || (console.warn(i + "[" + a + "]: invalid value: " + e[a] + "."), n = !1);
                    return n
                }
            };
            var o = function (e, t, i, n, a, o, r) {
                this.util = e, this.log = t, this.onError = i, this.onFault = n, this.serialize = a, r.enabled && (o.console = this.wrapConsoleObject(o.console, r))
            };
            o.prototype = {
                wrapConsoleObject: function (e, t) {
                    e = e || {};
                    var i, n = e.log || function () {},
                        a = this;
                    for (i = 0; i < t.watch.length; i++)(function (i) {
                        var o = e[i] || n;
                        e[i] = function () {
                            try {
                                var e = Array.prototype.slice.call(arguments);
                                if (a.log.add("c", {
                                        timestamp: a.util.isoNow(),
                                        severity: i,
                                        message: a.serialize(1 === e.length ? e[0] : e)
                                    }), t[i])
                                    if (u.isError(e[0]) && 1 === e.length) a.onError("console", e[0]);
                                    else try {
                                        throw Error(a.serialize(1 === e.length ? e[0] : e))
                                    } catch (n) {
                                        a.onError("console", n)
                                    }
                                t.display && (a.util.hasFunction(o, "apply") ? o.apply(this, e) : o(e[0]))
                            } catch (n) {
                                a.onFault(n)
                            }
                        }
                    })(t.watch[i]);
                    return e
                },
                report: function () {
                    return this.log.all("c")
                }
            };
            var r = function (e, t, i, n, a) {
                this.config = e, this.util = t, this.log = i, this.window = n, this.document = a, this.correlationId = this.token = null, this.initialize()
            };
            r.prototype = {
                initialize: function () {
                    this.token = this.getCustomerToken(), this.correlationId = this.getCorrelationId()
                },
                getCustomerToken: function () {
                    if (this.config.current.token) return this.config.current.token;
                    var e = this.document.getElementsByTagName("script");
                    return e[e.length - 1].getAttribute("data-token")
                },
                getCorrelationId: function () {
                    var e;
                    if (!this.config.current.cookie) return this.util.uuid();
                    try {
                        e = this.document.cookie.replace(/(?:(?:^|.*;\s*)TrackJS\s*\=\s*([^;]*).*$)|^.*$/, "$1"), e || (e = this.util.uuid(), this.document.cookie = "TrackJS=" + e + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/")
                    } catch (t) {
                        e = this.util.uuid()
                    }
                    return e
                },
                report: function () {
                    return {
                        application: this.config.current.application,
                        correlationId: this.correlationId,
                        sessionId: this.config.current.sessionId,
                        token: this.token,
                        userId: this.config.current.userId,
                        version: this.config.current.version
                    }
                }
            };
            var l = function (e) {
                this.config = e, this.loadedOn = (new Date).getTime(), this.originalUrl = u.getLocation(), this.referrer = t.referrer
            };
            l.prototype = {
                discoverDependencies: function () {
                    var t = {
                        TrackJS: "3.7.2"
                    };
                    e.jQuery && e.jQuery.fn && e.jQuery.fn.jquery && (t.jQuery = e.jQuery.fn.jquery), e.jQuery && e.jQuery.ui && e.jQuery.ui.version && (t.jQueryUI = e.jQuery.ui.version), e.angular && e.angular.version && e.angular.version.full && (t.angular = e.angular.version.full);
                    for (var i in e)
                        if ("_trackJs" !== i && "_trackJS" !== i && "_trackjs" !== i && "webkitStorageInfo" !== i && "webkitIndexedDB" !== i && "top" !== i && "parent" !== i && "frameElement" !== i) try {
                            if (e[i]) {
                                var n = e[i].version || e[i].Version || e[i].VERSION;
                                "string" == typeof n && (t[i] = n)
                            }
                        } catch (a) {}
                    return t.TrackJS && t.trackJs && delete t.trackJs, t
                },
                report: function () {
                    return {
                        age: (new Date).getTime() - this.loadedOn,
                        dependencies: this.config.current.dependencies ? this.discoverDependencies() : {
                            trackJs: "3.7.2"
                        },
                        originalUrl: this.originalUrl,
                        referrer: this.referrer,
                        userAgent: e.navigator.userAgent,
                        viewportHeight: e.document.documentElement.clientHeight,
                        viewportWidth: e.document.documentElement.clientWidth
                    }
                }
            };
            var s = function (e) {
                this.util = e, this.appender = [], this.maxLength = 30
            };
            s.prototype = {
                all: function (e) {
                    var t, i, n = [];
                    for (i = 0; i < this.appender.length; i++)(t = this.appender[i]) && t.category === e && n.push(t.value);
                    return n
                },
                clear: function () {
                    this.appender.length = 0
                },
                truncate: function () {
                    this.appender.length > this.maxLength && (this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0)))
                },
                add: function (e, t) {
                    var i = this.util.uuid();
                    return this.appender.push({
                        key: i,
                        category: e,
                        value: t
                    }), this.truncate(), i
                },
                get: function (e, t) {
                    var i, n;
                    for (n = 0; n < this.appender.length; n++)
                        if (i = this.appender[n], i.category === e && i.key === t) return i.value;
                    return !1
                }
            };
            var d = function (e) {
                    var t = {};
                    return {
                        addMetadata: function (e, i) {
                            t[e] = i
                        },
                        removeMetadata: function (e) {
                            delete t[e]
                        },
                        report: function () {
                            var i, n = [];
                            for (i in t) t.hasOwnProperty(i) && n.push({
                                key: i,
                                value: e(t[i])
                            });
                            return n
                        },
                        store: t
                    }
                },
                c = function (e, t) {
                    this.log = e, this.options = t, t.enabled && this.watch()
                };
            c.prototype = {
                isCompatible: function (t) {
                    return t = t || e, !u.has(t, "chrome.app.runtime") && u.has(t, "addEventListener") && u.has(t, "history.pushState")
                },
                record: function (e, t, i) {
                    this.log.add("h", {
                        type: e,
                        from: u.truncate(t, 250),
                        to: u.truncate(i, 250),
                        on: u.isoNow()
                    })
                },
                report: function () {
                    return this.log.all("h")
                },
                watch: function () {
                    if (this.isCompatible()) {
                        var t = this,
                            i = u.getLocationURL().relative;
                        e.addEventListener("popstate", function () {
                            var e = u.getLocationURL().relative;
                            t.record("popState", i, e), i = e
                        }, !0), u.forEach(["pushState", "replaceState"], function (e) {
                            u.patch(history, e, function (n) {
                                return function () {
                                    i = u.getLocationURL().relative;
                                    var a = n.apply(this, arguments),
                                        o = u.getLocationURL().relative;
                                    return t.record(e, i, o), i = o, a
                                }
                            })
                        })
                    }
                }
            };
            var g = function (e, t, i, n, a, o) {
                this.util = e, this.log = t, this.onError = i, this.onFault = n, this.window = a, this.options = o, o.enabled && this.initialize(a)
            };
            g.prototype = {
                initialize: function (e) {
                    e.XMLHttpRequest && this.util.hasFunction(e.XMLHttpRequest.prototype.open, "apply") && this.watchNetworkObject(e.XMLHttpRequest), e.XDomainRequest && this.util.hasFunction(e.XDomainRequest.prototype.open, "apply") && this.watchNetworkObject(e.XDomainRequest), this.options.fetch && u.isWrappableFunction(e.fetch) && this.watchFetch()
                },
                watchFetch: function () {
                    var t = this.log,
                        i = this.options,
                        n = this.onError;
                    u.patch(e, "fetch", function (a) {
                        return function (o, r) {
                            var l;
                            try {
                                throw Error()
                            } catch (s) {
                                l = s.stack
                            }
                            var d = o instanceof Request ? o.url : o,
                                c = o instanceof Request ? o.method : (r || {}).method || "GET",
                                g = a.apply(e, arguments);
                            return g.__trackjs_state__ = t.add("n", {
                                type: "fetch",
                                startedOn: u.isoNow(),
                                method: c,
                                url: u.truncate(d, 2e3)
                            }), g.then(function (e) {
                                var a = t.get("n", g.__trackjs_state__);
                                if (a) {
                                    u.defaults(a, {
                                        completedOn: u.isoNow(),
                                        statusCode: e.status,
                                        statusText: e.statusText
                                    });
                                    var o = e.headers.get("trackjs-correlation-id");
                                    o && (a.requestCorrelationId = o), i.error && 400 <= e.status && (a = Error(a.statusCode + " " + a.statusText + ": " + a.method + " " + a.url), a.stack = l, n("ajax", a))
                                }
                                return e
                            })["catch"](function (e) {
                                e = e || {};
                                var a = t.get("n", g.__trackjs_state__);
                                throw a && (u.defaults(a, {
                                    completedOn: u.isoNow(),
                                    statusCode: 0,
                                    statusText: e.toString()
                                }), i.error && (e.message = e.message + ": " + a.method + " " + a.url, e.stack = e.stack || l, n("ajax", e))), e
                            })
                        }
                    })
                },
                watchNetworkObject: function (e) {
                    var t = this,
                        i = e.prototype.open,
                        n = e.prototype.send;
                    return e.prototype.open = function (e, t) {
                        var n = (t || "").toString();
                        return 0 > n.indexOf("localhost:0") && (this._trackJs = {
                            method: e,
                            url: n
                        }), i.apply(this, arguments)
                    }, e.prototype.send = function () {
                        try {
                            if (!this._trackJs) return n.apply(this, arguments);
                            this._trackJs.logId = t.log.add("n", {
                                type: "xhr",
                                startedOn: t.util.isoNow(),
                                method: this._trackJs.method,
                                url: u.truncate(this._trackJs.url, 2e3)
                            }), t.listenForNetworkComplete(this)
                        } catch (e) {
                            t.onFault(e)
                        }
                        return n.apply(this, arguments)
                    }, e
                },
                listenForNetworkComplete: function (e) {
                    var t = this;
                    t.window.ProgressEvent && e.addEventListener && e.addEventListener("readystatechange", function () {
                        4 === e.readyState && t.finalizeNetworkEvent(e)
                    }, !0), e.addEventListener ? e.addEventListener("load", function () {
                        t.finalizeNetworkEvent(e), t.checkNetworkFault(e)
                    }, !0) : setTimeout(function () {
                        try {
                            var i = e.onload;
                            e.onload = function () {
                                t.finalizeNetworkEvent(e), t.checkNetworkFault(e), "function" == typeof i && t.util.hasFunction(i, "apply") && i.apply(e, arguments)
                            };
                            var n = e.onerror;
                            e.onerror = function () {
                                t.finalizeNetworkEvent(e), t.checkNetworkFault(e), "function" == typeof oldOnError && n.apply(e, arguments)
                            }
                        } catch (a) {
                            t.onFault(a)
                        }
                    }, 0)
                },
                finalizeNetworkEvent: function (e) {
                    if (e._trackJs) {
                        var t = this.log.get("n", e._trackJs.logId);
                        t && (t.completedOn = this.util.isoNow(), e.getAllResponseHeaders && e.getResponseHeader && 0 <= (e.getAllResponseHeaders() || "").toLowerCase().indexOf("trackjs-correlation-id") && (t.requestCorrelationId = e.getResponseHeader("trackjs-correlation-id")), t.statusCode = 1223 == e.status ? 204 : e.status, t.statusText = 1223 == e.status ? "No Content" : e.statusText)
                    }
                },
                checkNetworkFault: function (e) {
                    if (this.options.error && 400 <= e.status && 1223 != e.status) {
                        var t = e._trackJs || {};
                        this.onError("ajax", e.status + " " + e.statusText + ": " + t.method + " " + t.url)
                    }
                },
                report: function () {
                    return this.log.all("n")
                }
            };
            var p = function (t, i) {
                this.util = t, this.config = i, this.disabled = !1, this.throttleStats = {
                    attemptCount: 0,
                    throttledCount: 0,
                    lastAttempt: (new Date).getTime()
                }, e.JSON && e.JSON.stringify || (this.disabled = !0)
            };
            p.prototype = {
                errorEndpoint: function (t) {
                    var i = this.config.current.errorURL;
                    return this.util.testCrossdomainXhr() || -1 !== e.location.protocol.indexOf("https") || (i = this.config.current.errorNoSSLURL), i + "?token=" + t + "&v=3.7.2"
                },
                usageEndpoint: function (e) {
                    return this.appendObjectAsQuery(e, this.config.current.usageURL)
                },
                trackerFaultEndpoint: function (e) {
                    return this.appendObjectAsQuery(e, this.config.current.faultURL)
                },
                appendObjectAsQuery: function (e, t) {
                    t += "?";
                    for (var i in e) e.hasOwnProperty(i) && (t += encodeURIComponent(i) + "=" + encodeURIComponent(e[i]) + "&");
                    return t
                },
                getCORSRequest: function (t, i) {
                    var n;
                    return this.util.testCrossdomainXhr() ? (n = new e.XMLHttpRequest, n.open(t, i), n.setRequestHeader("Content-Type", "text/plain")) : "undefined" != typeof e.XDomainRequest ? (n = new e.XDomainRequest, n.open(t, i)) : n = null, n
                },
                sendTrackerFault: function (e) {
                    this.throttle(e) || (t.createElement("img").src = this.trackerFaultEndpoint(e))
                },
                sendUsage: function (e) {
                    t.createElement("img").src = this.usageEndpoint(e)
                },
                sendError: function (t, n) {
                    var a = this;
                    if (!this.disabled && !this.throttle(t)) try {
                        var o = this.getCORSRequest("POST", this.errorEndpoint(n));
                        o.onreadystatechange = function () {
                            4 !== o.readyState || u.contains([200, 202], o.status) || (a.disabled = !0)
                        }, o._trackJs = i, o.send(e.JSON.stringify(t))
                    } catch (r) {
                        throw this.disabled = !0, r
                    }
                },
                throttle: function (e) {
                    var t = (new Date).getTime();
                    if (this.throttleStats.attemptCount++, this.throttleStats.lastAttempt + 1e3 >= t) {
                        if (this.throttleStats.lastAttempt = t, 10 < this.throttleStats.attemptCount) return this.throttleStats.throttledCount++, !0
                    } else e.throttled = this.throttleStats.throttledCount, this.throttleStats.attemptCount = 0, this.throttleStats.lastAttempt = t, this.throttleStats.throttledCount = 0;
                    return !1
                }
            };
            var u = function () {
                    function n(e, t, o, r) {
                        return o = o || !1, r = r || 0, u.forEach(t, function (t) {
                            u.forEach(u.keys(t), function (l) {
                                null === t[l] || t[l] === i ? e[l] = t[l] : o && 10 > r && "[object Object]" === a(t[l]) ? (e[l] = e[l] || {}, n(e[l], [t[l]], o, r + 1)) : e.hasOwnProperty(l) || (e[l] = t[l])
                            })
                        }), e
                    }

                    function a(e) {
                        return Object.prototype.toString.call(e)
                    }
                    return {
                        addEventListenerSafe: function (e, t, i, n) {
                            e.addEventListener ? e.addEventListener(t, i, n) : e.attachEvent && e.attachEvent("on" + t, i)
                        },
                        afterDocumentLoad: function (e) {
                            var i = !1;
                            "complete" === t.readyState ? u.defer(e) : (u.addEventListenerSafe(t, "readystatechange", function () {
                                "complete" !== t.readyState || i || (u.defer(e), i = !0)
                            }), setTimeout(function () {
                                i || (u.defer(e), i = !0)
                            }, 1e4))
                        },
                        bind: function (e, t) {
                            return function () {
                                return e.apply(t, Array.prototype.slice.call(arguments))
                            }
                        },
                        contains: function (e, t) {
                            return 0 <= e.indexOf(t)
                        },
                        defaults: function (e) {
                            return n(e, Array.prototype.slice.call(arguments, 1), !1)
                        },
                        defaultsDeep: function (e) {
                            return n(e, Array.prototype.slice.call(arguments, 1), !0)
                        },
                        defer: function (e, t) {
                            setTimeout(function () {
                                e.apply(t)
                            })
                        },
                        forEach: function (e, t, i) {
                            if (u.isArray(e)) {
                                if (e.forEach) return e.forEach(t, i);
                                for (var n = 0; n < e.length;) t.call(i, e[n], n, e), n++
                            }
                        },
                        getLocation: function () {
                            return e.location.toString().replace(/ /g, "%20")
                        },
                        getLocationURL: function () {
                            return u.parseURL(u.getLocation())
                        },
                        has: function (e, t) {
                            try {
                                for (var i = t.split("."), n = e, a = 0; a < i.length; a++) {
                                    if (!n[i[a]]) return !1;
                                    n = n[i[a]]
                                }
                                return !0
                            } catch (o) {
                                return !1
                            }
                        },
                        hasFunction: function (e, t) {
                            try {
                                return !!e[t]
                            } catch (i) {
                                return !1
                            }
                        },
                        hasOwn: function (e, t) {
                            return Object.prototype.hasOwnProperty.call(e, t)
                        },
                        isArray: function (e) {
                            return "[object Array]" === a(e)
                        },
                        isBoolean: function (e) {
                            return "boolean" == typeof e || u.isObject(e) && "[object Boolean]" === a(e)
                        },
                        isBrowserIE: function (t) {
                            t = t || e.navigator.userAgent;
                            var i = t.match(/Trident\/([\d.]+)/);
                            return i && "7.0" === i[1] ? 11 : !!(t = t.match(/MSIE ([\d.]+)/)) && parseInt(t[1], 10)
                        },
                        isBrowserSupported: function () {
                            var e = this.isBrowserIE();
                            return !e || 8 <= e
                        },
                        isError: function (e) {
                            if (!u.isObject(e)) return !1;
                            var t = a(e);
                            return "[object Error]" === t || "[object DOMException]" === t || u.isString(e.name) && u.isString(e.message)
                        },
                        isElement: function (e) {
                            return u.isObject(e) && 1 === e.nodeType
                        },
                        isFunction: function (e) {
                            return !(!e || "function" != typeof e)
                        },
                        isNumber: function (e) {
                            return "number" == typeof e || u.isObject(e) && "[object Number]" === a(e)
                        },
                        isObject: function (e) {
                            return !(!e || "object" != typeof e)
                        },
                        isString: function (e) {
                            return "string" == typeof e || !u.isArray(e) && u.isObject(e) && "[object String]" === a(e)
                        },
                        isWrappableFunction: function (e) {
                            return this.isFunction(e) && this.hasFunction(e, "apply")
                        },
                        isoNow: function () {
                            var e = new Date;
                            return e.toISOString ? e.toISOString() : e.getUTCFullYear() + "-" + this.pad(e.getUTCMonth() + 1) + "-" + this.pad(e.getUTCDate()) + "T" + this.pad(e.getUTCHours()) + ":" + this.pad(e.getUTCMinutes()) + ":" + this.pad(e.getUTCSeconds()) + "." + String((e.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5) + "Z"
                        },
                        keys: function (e) {
                            if (!u.isObject(e)) return [];
                            var t, i = [];
                            for (t in e) e.hasOwnProperty(t) && i.push(t);
                            return i
                        },
                        noop: function () {},
                        pad: function (e) {
                            return e = String(e), 1 === e.length && (e = "0" + e), e
                        },
                        parseURL: function (e) {
                            var t = e.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
                            return t ? (t = {
                                protocol: t[2],
                                host: t[4],
                                path: t[5],
                                query: t[6],
                                hash: t[8]
                            }, t.origin = (t.protocol || "") + "://" + (t.host || ""), t.relative = (t.path || "") + (t.query || "") + (t.hash || ""), t.href = e, t) : {}
                        },
                        patch: function (e, t, i) {
                            e[t] = i(e[t] || u.noop)
                        },
                        testCrossdomainXhr: function () {
                            return "withCredentials" in new XMLHttpRequest
                        },
                        truncate: function (e, t) {
                            if (e = "" + e, e.length <= t) return e;
                            var i = e.length - t;
                            return e.substr(0, t) + "...{" + i + "}"
                        },
                        tryGet: function (e, t) {
                            try {
                                return e[t]
                            } catch (i) {}
                        },
                        uuid: function () {
                            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                                var t = 16 * Math.random() | 0;
                                return ("x" == e ? t : 3 & t | 8).toString(16)
                            })
                        },
                        wrapError: function (e) {
                            var t = e || Object.prototype.toString.call(e);
                            if (t && t.innerError) return e;
                            var i = Error("TrackJS Caught: " + (t.message || t));
                            return i.description = "TrackJS Caught: " + t.description, i.file = t.file, i.line = t.line || t.lineNumber, i.column = t.column || t.columnNumber, i.stack = t.stack, i.innerError = e, i
                        }
                    }
                }(),
                m = function (e, t, i, n, a, o) {
                    this.util = e, this.log = t, this.onError = i, this.onFault = n, this.options = o, this.document = a, o.enabled && this.initialize(a)
                };
            m.prototype = {
                initialize: function (e) {
                    var t = this.util.bind(this.onDocumentClicked, this),
                        i = this.util.bind(this.onInputChanged, this);
                    e.addEventListener ? (e.addEventListener("click", t, !0), e.addEventListener("blur", i, !0)) : e.attachEvent && (e.attachEvent("onclick", t), e.attachEvent("onfocusout", i))
                },
                onDocumentClicked: function (e) {
                    try {
                        var t = this.getElementFromEvent(e);
                        t && t.tagName && (this.isDescribedElement(t, "a") || this.isDescribedElement(t, "button") || this.isDescribedElement(t, "input", ["button", "submit"]) ? this.writeVisitorEvent(t, "click") : this.isDescribedElement(t, "input", ["checkbox", "radio"]) && this.writeVisitorEvent(t, "input", t.value, t.checked))
                    } catch (i) {
                        this.onFault(i)
                    }
                },
                onInputChanged: function (e) {
                    try {
                        var t = this.getElementFromEvent(e);
                        t && t.tagName && (this.isDescribedElement(t, "textarea") ? this.writeVisitorEvent(t, "input", t.value) : this.isDescribedElement(t, "select") && t.options && t.options.length ? this.onSelectInputChanged(t) : this.isDescribedElement(t, "input") && !this.isDescribedElement(t, "input", ["button", "submit", "hidden", "checkbox", "radio"]) && this.writeVisitorEvent(t, "input", t.value))
                    } catch (i) {
                        this.onFault(i)
                    }
                },
                onSelectInputChanged: function (e) {
                    if (e.multiple)
                        for (var t = 0; t < e.options.length; t++) e.options[t].selected && this.writeVisitorEvent(e, "input", e.options[t].value);
                    else 0 <= e.selectedIndex && e.options[e.selectedIndex] && this.writeVisitorEvent(e, "input", e.options[e.selectedIndex].value)
                },
                writeVisitorEvent: function (e, t, n, a) {
                    "password" === this.getElementType(e) && (n = i);
                    var o = this.getElementAttributes(e);
                    e.innerText && (o.__trackjs_element_text = this.util.truncate(e.innerText, 500)), this.log.add("v", {
                        timestamp: this.util.isoNow(),
                        action: t,
                        element: {
                            tag: e.tagName.toLowerCase(),
                            attributes: o,
                            value: this.getMetaValue(n, a)
                        }
                    })
                },
                getElementFromEvent: function (e) {
                    return e.target || t.elementFromPoint(e.clientX, e.clientY)
                },
                isDescribedElement: function (e, t, i) {
                    if (e.tagName.toLowerCase() !== t.toLowerCase()) return !1;
                    if (!i) return !0;
                    for (e = this.getElementType(e), t = 0; t < i.length; t++)
                        if (i[t] === e) return !0;
                    return !1
                },
                getElementType: function (e) {
                    return (e.getAttribute("type") || "").toLowerCase()
                },
                getElementAttributes: function (e) {
                    for (var t = {}, i = Math.min(e.attributes.length, 10), n = 0; n < i; n++) {
                        var a = e.attributes[n];
                        u.contains(["data-value", "value"], a.name.toLowerCase()) || (t[a.name] = u.truncate(a.value, 100))
                    }
                    return t
                },
                getMetaValue: function (e, t) {
                    return e === i ? i : {
                        length: e.length,
                        pattern: this.matchInputPattern(e),
                        checked: t
                    }
                },
                matchInputPattern: function (e) {
                    return "" === e ? "empty" : /^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(e) ? "email" : /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(e) || /^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/.test(e) ? "date" : /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(e) ? "usphone" : /^\s*$/.test(e) ? "whitespace" : /^\d*$/.test(e) ? "numeric" : /^[a-zA-Z]*$/.test(e) ? "alpha" : /^[a-zA-Z0-9]*$/.test(e) ? "alphanumeric" : "characters"
                },
                report: function () {
                    return this.log.all("v")
                }
            };
            var b = function (e, t, i, n, a) {
                this.onError = e, this.onFault = t, this.serialize = i, a.enabled && this.watchWindowErrors(n), a.promise && this.watchPromiseErrors(n)
            };
            b.prototype = {
                watchPromiseErrors: function (e) {
                    var t = this;
                    e.addEventListener ? e.addEventListener("unhandledrejection", function (e) {
                        if (e = e || {}, e = e.detail ? u.tryGet(e.detail, "reason") : u.tryGet(e, "reason"), e !== i) {
                            if (!u.isError(e)) try {
                                throw Error(t.serialize(e))
                            } catch (n) {
                                e = n
                            }
                            t.onError("promise", e)
                        }
                    }) : e.onunhandledrejection = function (e) {
                        t.onError("promise", e)
                    }
                },
                watchWindowErrors: function (e) {
                    var t = this;
                    u.patch(e, "onerror", function (e) {
                        return function (i, n, a, o, r) {
                            try {
                                r = r || {}, r.message = r.message || t.serialize(i), r.name = r.name || "Error", r.line = r.line || parseInt(a, 10) || null, r.column = r.column || parseInt(o, 10) || null, "[object Event]" !== Object.prototype.toString.call(i) || n ? r.file = r.file || t.serialize(n) : r.file = (i.target || {}).src, t.onError("window", r)
                            } catch (l) {
                                t.onFault(l)
                            }
                            e.apply(this, arguments)
                        }
                    })
                }
            };
            var h = function () {
                this.hasInstalled = !1, this.hasEnabled = !0, this.window = e, this.document = t, this.util = u, this.install = u.bind(this.install, this), this.onError = u.bind(this.onError, this), this.onFault = u.bind(this.onFault, this), this.serialize = u.bind(this.serialize, this), this.log = new s(u), this.metadata = new d(this.serialize);
                var i = e && (e._trackJs || e._trackJS || e._trackjs);
                i && this.install(i)
            };
            return h.prototype = {
                install: function (e) {
                    try {
                        if ("undefined" == typeof t) return this.warn("monitoring disabled in node"), !1;
                        if (!u.has(e, "token")) return this.warn("missing token"), !1;
                        if (this.hasInstalled) return this.warn("already installed"), !1;
                        if (this.config = new a(e), this.transmitter = new p(this.util, this.config), this.environment = new l(this.config), this.customer = new r(this.config, this.util, this.log, this.window, this.document), !this.config.current.enabled) return this.hasEnabled = !1;
                        if (this.windowConsoleWatcher = new o(this.util, this.log, this.onError, this.onFault, this.serialize, this.window, this.config.current.console), !this.util.isBrowserSupported()) return !1;
                        this.callbackWatcher = new n(this.config.current.callback, this.onError, this.onFault), this.visitorWatcher = new m(this.util, this.log, this.onError, this.onFault, this.document, this.config.current.visitor), this.navigationWatcher = new c(this.log, this.config.current.navigation), this.networkWatcher = new g(this.util, this.log, this.onError, this.onFault, this.window, this.config.current.network), this.windowWatcher = new b(this.onError, this.onFault, this.serialize, this.window, this.config.current.window);
                        var i = this;
                        return u.afterDocumentLoad(function () {
                            i.transmitter.sendUsage({
                                token: i.customer.token,
                                correlationId: i.customer.correlationId,
                                application: i.config.current.application,
                                x: i.util.uuid()
                            })
                        }), this.hasInstalled = !0
                    } catch (s) {
                        return this.onFault(s), !1
                    }
                },
                pub: function () {
                    var e = this,
                        t = {
                            addMetadata: this.metadata.addMetadata,
                            attempt: function (t, i) {
                                try {
                                    var n = Array.prototype.slice.call(arguments, 2);
                                    return t.apply(i || this, n)
                                } catch (a) {
                                    throw e.onError("catch", a), u.wrapError(a)
                                }
                            },
                            configure: function (t) {
                                return !e.hasInstalled && e.hasEnabled ? (e.warn("agent must be installed"), !1) : e.config.setCurrent(t)
                            },
                            hash: "cf5522da9dcedb7390522470840acc128504902d",
                            isInstalled: function () {
                                return e.hasInstalled
                            },
                            install: this.install,
                            removeMetadata: this.metadata.removeMetadata,
                            track: function (t) {
                                if (!e.hasInstalled && e.hasEnabled) e.warn("agent must be installed");
                                else {
                                    var i = u.isError(t) ? t.message : e.serialize(t);
                                    if (t = t || {}, !t.stack) try {
                                        throw Error(i)
                                    } catch (n) {
                                        t = n
                                    }
                                    e.onError("direct", t)
                                }
                            },
                            version: "3.7.2",
                            watch: function (t, i) {
                                return function () {
                                    try {
                                        var n = Array.prototype.slice.call(arguments, 0);
                                        return t.apply(i || this, n)
                                    } catch (a) {
                                        throw e.onError("catch", a), u.wrapError(a)
                                    }
                                }
                            },
                            watchAll: function (e) {
                                var t, i = Array.prototype.slice.call(arguments, 1);
                                for (t in e) "function" != typeof e[t] || u.contains(i, t) || (e[t] = this.watch(e[t], e));
                                return e
                            }
                        };
                    return new o(u, e.log, e.onError, e.onFault, e.serialize, t, a.prototype.defaults.console), t
                },
                onError: function () {
                    var t, i = !1;
                    return function (n, a, o) {
                        if (this.hasInstalled && this.hasEnabled && u.isBrowserSupported()) try {
                            if (o = o || {
                                    bindStack: null,
                                    bindTime: null,
                                    force: !1
                                }, a && u.isError(a) || (a = {
                                    name: "Error",
                                    message: this.serialize(a, o.force)
                                }), -1 === a.message.indexOf("TrackJS Caught"))
                                if (i && -1 !== a.message.indexOf("Script error")) i = !1;
                                else {
                                    var r = u.defaultsDeep({}, {
                                        agentPlatform: "browser",
                                        bindStack: o.bindStack,
                                        bindTime: o.bindTime,
                                        column: a.column || a.columnNumber,
                                        console: this.windowConsoleWatcher.report(),
                                        customer: this.customer.report(),
                                        entry: n,
                                        environment: this.environment.report(),
                                        file: a.file || a.fileName,
                                        line: a.line || a.lineNumber,
                                        message: a.message,
                                        metadata: this.metadata.report(),
                                        nav: this.navigationWatcher.report(),
                                        network: this.networkWatcher.report(),
                                        url: (e.location || "").toString(),
                                        stack: a.stack,
                                        timestamp: this.util.isoNow(),
                                        visitor: this.visitorWatcher.report(),
                                        version: "3.7.2"
                                    });
                                    if (!o.force) try {
                                        if (!this.config.current.onError(r, a)) return
                                    } catch (l) {
                                        r.console.push({
                                            timestamp: this.util.isoNow(),
                                            severity: "error",
                                            message: l.message
                                        });
                                        var s = this;
                                        setTimeout(function () {
                                            s.onError("catch", l, {
                                                force: !0
                                            })
                                        }, 0)
                                    }
                                    if (this.config.current.dedupe) {
                                        var d = (r.message + r.stack).substr(0, 1e4);
                                        if (d === t) return;
                                        t = d
                                    }! function () {
                                        function e() {
                                            var e = 0;
                                            return u.forEach(r.console, function (t) {
                                                e += (t.message || "").length
                                            }), 8e4 <= e
                                        }
                                        for (var t = 0; e() && t < r.console.length;) r.console[t].message = u.truncate(r.console[t].message, 1e3), t++
                                    }(), this.log.clear(), setTimeout(function () {
                                        i = !1
                                    }), i = !0, this.transmitter.sendError(r, this.customer.token)
                                }
                        } catch (l) {
                            this.onFault(l)
                        }
                    }
                }(),
                onFault: function (e) {
                    var t = this.transmitter || new p;
                    e = e || {}, e = {
                        token: this.customer.token,
                        file: e.file || e.fileName,
                        msg: e.message || "unknown",
                        stack: (e.stack || "unknown").substr(0, 1e3),
                        url: this.window.location,
                        v: "3.7.2",
                        h: "cf5522da9dcedb7390522470840acc128504902d",
                        x: this.util.uuid()
                    }, t.sendTrackerFault(e)
                },
                serialize: function (e, t) {
                    if (this.hasInstalled && this.config.current.serialize && !t) try {
                        return this.config.current.serialize(e)
                    } catch (i) {
                        this.onError("catch", i, {
                            force: !0
                        })
                    }
                    return a.prototype.defaults.serialize(e)
                },
                warn: function (t) {
                    u.has(e, "console.warn") && e.console.warn("TrackJS: " + t)
                }
            }, (new h).pub()
        }("undefined" == typeof window ? void 0 : window, "undefined" == typeof document ? void 0 : document), window.tangibleeAnalytics = window.tangibleeAnalytics || function () {
            (window.tangibleeAnalytics.q = window.tangibleeAnalytics.q || []).push(arguments)
        };
        var e = {
            domain: "",
            activeLocale: document.documentElement.lang,
            useCookies: !0,
            doNotTrack: !1,
            container: ".tangiblee-modal-iframe-container",
            widgetVersion: "v3",
            showCTA: function (e, t) {},
            hideCTA: function () {},
            SKUs: [],
            activeSKU: "",
            activePrice: "",
            activeSalePrice: "",
            activeCurrency: "",
            activeATC: "",
            onCTAShown: function () {},
            onCtaClicked: function () {},
            onModalOpened: function () {},
            onIframeLoaded: function () {},
            onUserInteracted: function () {},
            onModalClosed: !1,
            onKeepAlive: !1,
            onATCClickInWidget: function () {},
            onSKUsValidated: function () {},
            iframe: {},
            modal: {},
            updateSKU: {},
            utils: {},
            validateSKUs: {},
            setCtaClickHandler: function () {
                var t, i = document.getElementsByClassName(e.ctaCssClass);
                if (!i.length) return !1;
                for (var n = !1, a = function (t) {
                        return !n && void(n = setTimeout(function () {
                            "onCTAClick" === e.loadIframe && (e.iframe.exists() ? e.iframe.update() : e.iframe.inject()), e.modal.show(e.modal.isUsed()), e.onCtaClicked(t), clearTimeout(n), n = !1
                        }, 50))
                    }, o = 0; o < i.length; o++) t = i[o], e.utils.bindClickAndTouch(t, a, e.preventDefaultOnCtaClick, e.stopPropagationOnCtaClick, !0)
            },
            ctaCssClass: "tangiblee-cta",
            validSKUs: [],
            useMultiVariations: !1,
            variationSKUs: [],
            isVisibleProduct: !0,
            product: {},
            products: [],
            thumbs: [],
            getFaceDiameter: !1,
            getFaceDiameterDimensions: !1,
            loadIframe: "onCTAClick",
            logOn: !1,
            translations: [],
            preventDefaultOnCtaClick: !0,
            stopPropagationOnCtaClick: !0,
            useClickEventInsteadMousedown: !1,
            availableModes: [],
            categoryThumbsDefault: {},
            customIframeSrcAttributes: [],
            getThumb: function (t) {
                var i = e.thumbs[t || e.product.id],
                    n = i && i.indexOf("tangiblee-thumb") > -1;
                return n ? e.categoryThumbsDefault[e.product.category] || e.categoryThumbsDefault["default"] || i : i
            },
            trackJSInstalled: !1
        };
        ! function () {
            e.promise = "undefined" == typeof Promise ? function () {
                "use strict";

                function e(e, t) {
                    p.add(e, t), g || (g = m(p.drain))
                }

                function t(e) {
                    var t, i = typeof e;
                    return null == e || "object" != i && "function" != i || (t = e.then), "function" == typeof t && t
                }

                function i() {
                    for (var e = 0; e < this.chain.length; e++) n(this, 1 === this.state ? this.chain[e].success : this.chain[e].failure, this.chain[e]);
                    this.chain.length = 0
                }

                function n(e, i, n) {
                    var a, o;
                    try {
                        i === !1 ? n.reject(e.msg) : (a = i === !0 ? e.msg : i.call(void 0, e.msg), a === n.promise ? n.reject(TypeError("Promise-chain cycle")) : (o = t(a)) ? o.call(a, n.resolve, n.reject) : n.resolve(a))
                    } catch (r) {
                        n.reject(r)
                    }
                }

                function a(n) {
                    var r, s = this;
                    if (!s.triggered) {
                        s.triggered = !0, s.def && (s = s.def);
                        try {
                            (r = t(n)) ? e(function () {
                                var e = new l(s);
                                try {
                                    r.call(n, function () {
                                        a.apply(e, arguments)
                                    }, function () {
                                        o.apply(e, arguments)
                                    })
                                } catch (t) {
                                    o.call(e, t)
                                }
                            }): (s.msg = n, s.state = 1, s.chain.length > 0 && e(i, s))
                        } catch (d) {
                            o.call(new l(s), d)
                        }
                    }
                }

                function o(t) {
                    var n = this;
                    n.triggered || (n.triggered = !0, n.def && (n = n.def), n.msg = t, n.state = 2, n.chain.length > 0 && e(i, n))
                }

                function r(e, t, i, n) {
                    for (var a = 0; a < t.length; a++) ! function (a) {
                        e.resolve(t[a]).then(function (e) {
                            i(a, e)
                        }, n)
                    }(a)
                }

                function l(e) {
                    this.def = e, this.triggered = !1
                }

                function s(e) {
                    this.promise = e, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0
                }

                function d(t) {
                    if ("function" != typeof t) throw TypeError("Not a function");
                    if (0 !== this.__NPO__) throw TypeError("Not a promise");
                    this.__NPO__ = 1;
                    var n = new s(this);
                    this.then = function (t, a) {
                        var o = {
                            success: "function" != typeof t || t,
                            failure: "function" == typeof a && a
                        };
                        return o.promise = new this.constructor(function (e, t) {
                            if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
                            o.resolve = e, o.reject = t
                        }), n.chain.push(o), 0 !== n.state && e(i, n), o.promise
                    }, this["catch"] = function (e) {
                        return this.then(void 0, e)
                    };
                    try {
                        t.call(void 0, function (e) {
                            a.call(n, e)
                        }, function (e) {
                            o.call(n, e)
                        })
                    } catch (r) {
                        o.call(n, r)
                    }
                }
                var c, g, p, u = Object.prototype.toString,
                    m = "undefined" != typeof setImmediate ? function (e) {
                        return setImmediate(e)
                    } : setTimeout;
                try {
                    Object.defineProperty({}, "x", {}), c = function (e, t, i, n) {
                        return Object.defineProperty(e, t, {
                            value: i,
                            writable: !0,
                            configurable: n !== !1
                        })
                    }
                } catch (b) {
                    c = function (e, t, i) {
                        return e[t] = i, e
                    }
                }
                p = function () {
                    function e(e, t) {
                        this.fn = e, this.self = t, this.next = void 0
                    }
                    var t, i, n;
                    return {
                        add: function (a, o) {
                            n = new e(a, o), i ? i.next = n : t = n, i = n, n = void 0
                        },
                        drain: function () {
                            var e = t;
                            for (t = i = g = void 0; e;) e.fn.call(e.self), e = e.next
                        }
                    }
                }();
                var h = c({}, "constructor", d, !1);
                return d.prototype = h, c(h, "__NPO__", 0, !1), c(d, "resolve", function (e) {
                    var t = this;
                    return e && "object" == typeof e && 1 === e.__NPO__ ? e : new t(function (t, i) {
                        if ("function" != typeof t || "function" != typeof i) throw TypeError("Not a function");
                        t(e)
                    })
                }), c(d, "reject", function (e) {
                    return new this(function (t, i) {
                        if ("function" != typeof t || "function" != typeof i) throw TypeError("Not a function");
                        i(e)
                    })
                }), c(d, "all", function (e) {
                    var t = this;
                    return "[object Array]" != u.call(e) ? t.reject(TypeError("Not an array")) : 0 === e.length ? t.resolve([]) : new t(function (i, n) {
                        if ("function" != typeof i || "function" != typeof n) throw TypeError("Not a function");
                        var a = e.length,
                            o = Array(a),
                            l = 0;
                        r(t, e, function (e, t) {
                            o[e] = t, ++l === a && i(o)
                        }, n)
                    })
                }), c(d, "race", function (e) {
                    var t = this;
                    return "[object Array]" != u.call(e) ? t.reject(TypeError("Not an array")) : new t(function (i, n) {
                        if ("function" != typeof i || "function" != typeof n) throw TypeError("Not a function");
                        r(t, e, function (e, t) {
                            i(t)
                        }, n)
                    })
                }), d
            }() : Promise
        }();
        var t = function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2
        };
        e.utils.isItiOS = t() && !window.MSStream, e.utils.isItMobileOrTablet = function () {
                var e = navigator.userAgent;
                return e.match(/Android/i) || e.match(/BlackBerry/i) || e.match(/Opera Mini/i) || e.match(/IEMobile/i) || t()
            }, e.utils.fireEvent = function (e, t) {
                if (!e) return !1;
                var i;
                if (e.ownerDocument) i = e.ownerDocument;
                else {
                    if (9 !== e.nodeType) throw new Error("Invalid node passed to fireEvent: " + e.id);
                    i = e
                }
                if (e.dispatchEvent) {
                    var n = "";
                    switch (t) {
                        case "click":
                        case "mousedown":
                        case "mouseup":
                            n = "MouseEvents";
                            break;
                        case "focus":
                        case "change":
                        case "blur":
                        case "select":
                            n = "HTMLEvents";
                            break;
                        default:
                            throw "fireEvent: Couldn't find an event class for event '" + t + "'."
                    }
                    var a = i.createEvent(n);
                    a.initEvent(t, !0, !0), a.synthetic = !0, e.dispatchEvent(a, !0)
                }
            }, e.utils.bindClickAndTouch = function (t, i, n, a, o) {
                function r(e) {
                    var n = t.getAttribute("data-last-event-handled");
                    if (!n || "touch" === n) {
                        var a = u - g,
                            o = m - p;
                        Math.abs(a) < c && Math.abs(o) < c && i(e), t.setAttribute("data-last-event-handled", "touch"), setTimeout(function () {
                            t.setAttribute("data-last-event-handled", "")
                        }, 50)
                    }
                }
                if (!t || t.getAttribute("data-click-and-touch-bound")) return !1;
                if (e.useClickEventInsteadMousedown) t.addEventListener("click", function (e) {
                    n && e.preventDefault(), a && e.stopPropagation();
                    var o = t.getAttribute("data-last-event-handled");
                    o && "click" !== o && "keydown" !== o || (i(e), t.setAttribute("data-last-event-handled", "click"))
                });
                else {
                    var l, s = 50;
                    t.addEventListener("mousedown", function (e) {
                        l = e.clientX
                    }), t.addEventListener("mouseup", function (e) {
                        var o = e.clientX;
                        n && e.preventDefault(), a && e.stopPropagation();
                        var r = t.getAttribute("data-last-event-handled");
                        if (!r || "click" === r || "keydown" === r) {
                            var d = !0;
                            e.button && 0 !== e.button && (d = !1), d && Math.abs(o - l) < s && (i(e), t.setAttribute("data-last-event-handled", "click"), setTimeout(function () {
                                t.setAttribute("data-last-event-handled", "")
                            }, 50))
                        }
                    })
                }
                var d = window.innerWidth || document.body.clientWidth,
                    c = Math.max(1, Math.floor(.01 * d)),
                    g = 0,
                    p = 0,
                    u = 0,
                    m = 0;
                t.addEventListener("touchstart", function (e) {
                    g = e.changedTouches[0].screenX, p = e.changedTouches[0].screenY
                }), t.addEventListener("touchend", function (e) {
                    n && e.cancelable && e.preventDefault(), a && e.stopPropagation(), u = e.changedTouches[0].screenX, m = e.changedTouches[0].screenY, r(e)
                }), o && t.addEventListener("keydown", function (e) {
                    var o = e.code || e.key;
                    "Enter" !== o && "Space" !== o || (n && e.preventDefault(), a && e.stopPropagation(), i(e, !0), t.setAttribute("data-last-event-handled", "keydown"), setTimeout(function () {
                        t.setAttribute("data-last-event-handled", "")
                    }, 50))
                }), t.setAttribute("data-click-and-touch-bound", "true")
            }, e.utils.http = {
                fetch: function (t, i, n) {
                    return new e.promise(function (e, a) {
                        try {
                            var o = new XMLHttpRequest;
                            o.open(i, t, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.setRequestHeader("Content-Type", "application/json"), o.onreadystatechange = function () {
                                o.readyState > 3 && o.status >= 200 && o.status < 400 && e(o.responseText.length && JSON.parse(o.responseText))
                            }, o.onerror = function () {
                                a(o.statusText)
                            }, o.send(n)
                        } catch (r) {
                            a()
                        }
                    })
                },
                jsonp: function (t) {
                    return new e.promise(function (e, i) {
                        try {
                            window.tangibleeCallbackRegistry = {};
                            var n = function (e, t, i) {
                                    function n() {
                                        a || (delete tangibleeCallbackRegistry[o], i(e))
                                    }
                                    var a = !1,
                                        o = "cb" + String(Math.random()).slice(-6);
                                    e += ~e.indexOf("?") ? "&" : "?", e += "callback=tangibleeCallbackRegistry." + o, tangibleeCallbackRegistry[o] = function (e) {
                                        a = !0, delete tangibleeCallbackRegistry[o], t(e)
                                    };
                                    var r = document.createElement("script");
                                    r.onreadystatechange = function () {
                                        "complete" !== this.readyState && "loaded" !== this.readyState || (this.onreadystatechange = null, setTimeout(n, 0))
                                    }, r.onload = n, r.onerror = n, r.src = e, document.head.appendChild(r)
                                },
                                a = function (t) {
                                    e(t)
                                };
                            n(t, a, r)
                        } catch (o) {
                            var r = function (e) {
                                i("error request: " + e)
                            }
                        }
                    })
                }
            }, e.utils.isElementVisible = function (e) {
                return e && (null !== e.offsetParent || "fixed" === window.getComputedStyle(e).position)
            }, e.utils.log = function (t) {
                e.logOn && console.log(t)
            }, e.utils.createCustomEvent = function (e, t) {
                if ("function" == typeof window.CustomEvent) var i = new CustomEvent(e, {
                    detail: t
                });
                else {
                    var i = document.createEvent("CustomEvent");
                    i.initCustomEvent(e, !0, !0, t)
                }
                document.dispatchEvent(i)
            }, e.utils.waitForConditionToMet = function (e, t) {
                t = t || 500;
                var i, n = 0,
                    a = function () {};
                return {
                    then: function (o) {
                        return function r() {
                            e() ? (o(), "undefined" != typeof i && clearTimeout(i)) : n++ > t ? (a(), "undefined" != typeof i && clearTimeout(i)) : i = setTimeout(r, 100)
                        }(), {
                            fail: function (e) {
                                a = e
                            }
                        }
                    }
                }
            }, e.utils.formatNumberWithCommas = function (e) {
                var t, i, n = function (e) {
                    var t = /.*\d+.*/g;
                    return t.test(e)
                };
                if (n(e)) try {
                    e = e.replace(/,/g, ""), t = parseFloat(e).toFixed(2);
                    var a = t.toString().split(".");
                    a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","), i = a.join(".")
                } catch (o) {}
                return i
            }, e.utils.ready = function (e) {
                "loading" != document.readyState ? e() : document.addEventListener("DOMContentLoaded", e)
            }, e.utils.getParam = function (e) {
                var t = function () {
                        for (var e, t, i, n = {}, a = window.location.search.substring(1).split("&"), o = 0; o < a.length; o++) e = a[o], t = e.split("="), i = {
                            key: t[0],
                            value: t[1]
                        }, i.key && (n[i.key] = i.value || "");
                        return n
                    },
                    i = t();
                return !!i[e] && decodeURI(i[e])
            }, e.utils.getCookie = function (e) {
                var t, i, n = e + "=",
                    a = document.cookie.split(";");
                for (t = 0; t < a.length; t++) {
                    for (i = a[t];
                        " " === i.charAt(0);) i = i.substring(1);
                    if (0 === i.indexOf(n)) return i.substring(n.length, i.length)
                }
                return ""
            }, e.utils.setCookie = function (e, t, i) {
                var n = new Date;
                n.setTime(n.getTime() + 24 * (i || 365) * 60 * 60 * 1e3);
                var a = "expires=" + n.toUTCString();
                document.cookie = e + "=" + t + ";" + a + ";path=/"
            }, e.validateSKUs = function () {
                if (e.SKUs.then) return e.SKUs.then(function (t) {
                    return e.validateSKUs(t)
                });
                if (e.SKUs.length && e.SKUs[0] && "string" == typeof e.SKUs[0]) {
                    var t = "https://api.tangiblee.com/api/tngimpr?ids=" + e.SKUs.join() + "&domain=" + e.domain + "&activeLocale=" + e.activeLocale;
                    return e.utils.http.fetch(t, "GET")
                }
                return new e.promise(function (e, t) {
                    t({
                        message: "Not correct SKUs format in _tangiblee.validateSKUs method"
                    })
                })
            }, e.validateAny = function () {
                if (e.SKUs.then) return e.SKUs.then(function (t) {
                    return e.validateAny(t)
                });
                if (e.SKUs.length && e.SKUs[0] && "string" == typeof e.SKUs[0]) {
                    var t = "https://api.tangiblee.com/api/productvalidateany?ids=" + e.SKUs.join() + "&domain=" + e.domain;
                    return e.utils.http.fetch(t, "GET")
                }
                return new e.promise(function (e, t) {
                    t({
                        message: "Not correct SKUs format in _tangiblee.validateAny method"
                    })
                })
            }, e.updateSku = function () {
                if (e.validSKUs.length) {
                    var t = e.product ? e.product.id : null;
                    if (e.product = e.products[e.activeSKU], t === e.activeSKU) return;
                    if (e.validSKUs.indexOf(e.activeSKU) > -1) {
                        var i = e.showCTA(e.activeSKU, e.getThumb());
                        i && i.then ? i.then(function (t) {
                            e.ctaCssClass = t, e.setCtaClickHandler()
                        }) : (e.ctaCssClass = i, e.setCtaClickHandler()), window.tangibleeAnalytics("trackImpression", [e.activeSKU]), e.iframe.exists() && e.iframe.update()
                    } else e.hideCTA(e.activeSKU), e.modal.close(e.modal.isUsed())
                }
            },
            function () {
                var t = function () {
                        var t = function () {
                                var t, i = function () {
                                    var t = window.screen.width,
                                        i = window.screen.height,
                                        n = window.devicePixelRatio;
                                    if (window.innerHeight > window.innerWidth && e.utils.isItiOS && n >= 2) {
                                        if (375 === t && 667 === i) return 547;
                                        if (414 === t && 736 === i) return 618;
                                        if (375 === t && 812 === i) return 629;
                                        if (414 === t && 896 === i) return 714;
                                        if (320 === t && 568 === i) return 448;
                                        if (768 === t && 1024 === i) return 950
                                    }
                                    return !1
                                };
                                return t = window.jQuery ? Math.min(window.innerHeight, jQuery(window).height()) : window.innerHeight, t = "v2" === e.widgetVersion ? Math.round(.92 * t) : i() !== !1 ? i() : window.innerHeight - 10
                            },
                            i = document.getElementsByClassName("tangiblee-modal-content")[0];
                        window.innerWidth < 1024 && e.utils.isItiOS ? i.style.width = window.innerWidth + "px" : i.style.width = window.innerWidth - 10 + "px", "v2" === e.widgetVersion && (i.style.width = window.innerWidth - 10 + "px"), i.style.height = t() + "px"
                    },
                    i = function () {
                        var t = document.getElementsByClassName("tangiblee-modal-content")[0];
                        if ("v2" === e.widgetVersion) t.style.width = "800px", t.style.height = "610px";
                        else {
                            var i = e.utils.isItMobileOrTablet(),
                                n = i ? 768 : 980;
                            t.style.width = Math.min(window.innerWidth - 120, n) + "px";
                            var a = i ? 900 : 610;
                            t.style.height = Math.min(window.innerHeight - 120, a) + "px"
                        }
                    },
                    n = function () {
                        var t = document.getElementsByClassName("tangiblee-modal-content")[0],
                            i = document.createElement("a"),
                            n = document.createElement("div");
                        i.id = "tng-btn-close-modal", i.href = "javascript:void(0)", i.rel = "modal:tng-close", i.className = "tng-close-modal", i.title = "Close Tangiblee Popup", i.style.position = n.style.position = "absolute", i.style.display = "block", i.style.zIndex = "2", i.style.cursor = "pointer", i.setAttribute("tabindex", "-1"), "v2" === e.widgetVersion ? (i.style.backgroundImage = "url(//cdn.tangiblee.com/tangiblee-static/shared/lib/jquery.modal/tng_close@2x.png)", i.style.backgroundSize = "18px 18px", i.style.backgroundPosition = "center center", i.style.backgroundColor = "#f9f9f9", i.style.backgroundRepeat = "no-repeat", i.style.top = n.style.top = "5px", i.style.right = n.style.right = "5px", i.style.width = n.style.width = "32px", i.style.height = n.style.height = "32px") : (i.style.backgroundImage = "url(https://cdn.tangiblee.com/tangiblee-static-img/close-mobile.svg)", i.style.backgroundSize = "18px 18px", i.style.backgroundColor = "rgba(0,0,0,0.05)", i.style.backgroundPosition = "8px 8px", i.style.backgroundRepeat = "no-repeat", i.style.top = n.style.top = "0", i.style.right = n.style.right = "0", i.style.width = n.style.width = "40px", i.style.height = n.style.height = "35px"), n.id = "tng-btn-close-modal__focusable", n.setAttribute("role", "button"), n.setAttribute("tabindex", "0"), t.appendChild(n), t.appendChild(i)
                    },
                    a = function () {
                        var e = document.getElementsByClassName("tangiblee-modal-content")[0],
                            t = document.createElement("a"),
                            i = document.createElement("div");
                        t.id = "tng-btn-close-modal", t.href = "javascript:void(0)", t.rel = "modal:tng-close", t.className = "tng-close-modal", t.title = "Close Tangiblee Popup", t.style.backgroundImage = "url(https://cdn.tangiblee.com/tangiblee-static-img/close-x.svg)", t.style.backgroundSize = "26px 28px", t.style.backgroundRepeat = "no-repeat", t.style.position = i.style.position = "absolute", t.style.top = i.style.top = "0px", t.style.right = i.style.right = "-42px", t.style.display = i.style.display = "block", t.style.width = i.style.width = "26px", t.style.height = i.style.height = "28px", t.style.zIndex = "2", t.setAttribute("tabindex", "-1"), i.id = "tng-btn-close-modal__focusable", i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), e.appendChild(i), e.appendChild(t)
                    },
                    o = function () {
                        return e.product.poweredbylink || "https://www.tangiblee.com"
                    },
                    r = function () {
                        var t = document.createElement("div"),
                            i = document.createElement("a");
                        t.style.backgroundSize = "contain", t.style.backgroundRepeat = "no-repeat", t.style.width = i.style.width = "155px", t.style.height = i.style.height = "35px", i.id = "tng-logo__focusable", i.style.position = "absolute", i.style.top = "0", i.style.left = "0", i.style.zIndex = "-1", i.setAttribute("role", "button"), i.setAttribute("tabindex", "0"), i.setAttribute("rel", "nofollow");
                        var n = document.createElement("a");
                        n.id = "tng-logo-wrapper", n.href = i.href = o(), n.rel = i.rel = "nofollow noopener", n.target = i.target = "_blank", n.style.display = "flex", n.style.alignItems = "center", n.style.width = "155px", n.style.position = "relative", n.setAttribute("tabindex", "-1"), n.setAttribute("rel", "nofollow"), "v2" === e.widgetVersion ? (t.style.backgroundImage = 'url("//cdn.tangiblee.com/tangiblee-static-img/powered-by-full-logo-horizontal.svg")', n.style.position = "absolute", n.style.bottom = "12px", n.style.left = "2px", n.style.zIndex = "10") : t.style.backgroundImage = 'url("//cdn.tangiblee.com/tangiblee-static-img/powered-by-full-logo-horizontal-inverted.svg")', n.appendChild(i), n.appendChild(t), document.getElementsByClassName("tangiblee-modal-content")[0].appendChild(n)
                    },
                    l = function () {
                        if ("v3" === e.widgetVersion) {
                            var t = document.createElement("a"),
                                i = document.createElement("a");
                            t.style.backgroundImage = 'url("//cdn.tangiblee.com/tangiblee-static-img/powered-by-full-logo-horizontal-inverted.svg")', t.style.backgroundSize = "contain", t.style.backgroundRepeat = "no-repeat", t.style.backgroundPosition = "center", t.style.display = "inline-block", t.rel = i.rel = "nofollow noopener", t.href = i.href = o(), t.target = i.target = "_blank", t.style.width = i.style.width = "150px", t.style.height = i.style.height = "35px", t.id = "tng-logo-link", t.setAttribute("tabindex", "-1"), i.setAttribute("rel", "nofollow"), i.id = "tng-logo__focusable", i.style.position = "absolute", i.style.top = "0", i.style.left = "50%", i.style.transform = "translateX(-50%)", i.style.zIndex = "-1", i.setAttribute("tabindex", "0"), i.setAttribute("role", "button"), i.setAttribute("rel", "nofollow");
                            var n = document.createElement("div");
                            n.id = "tng-logo-wrapper", n.style.display = "flex", n.style.alignItems = "center", n.style.justifyContent = "center", n.style.position = "relative", n.appendChild(i), n.appendChild(t);
                            var a = document.getElementsByClassName("tangiblee-modal-iframe-container")[0];
                            document.getElementsByClassName("tangiblee-modal-content")[0].insertBefore(n, a)
                        }
                    },
                    s = function () {
                        if ("v3" === e.widgetVersion) {
                            var t = document.getElementsByClassName("tangiblee-modal-content")[0],
                                i = document.createElement("a");
                            i.id = "tng-first-focusable-el", i.href = "javascript:void(0)", i.rel = "nofollow", i.style.position = "absolute", i.style.top = 0, i.style.left = 0, i.setAttribute("aria-hidden", !0), i.onfocusin = function () {
                                var e = document.getElementById("tng-btn-close-modal");
                                e && e.focus()
                            };
                            var n = t && t.children[0];
                            t.insertBefore(i, n)
                        }
                    },
                    d = function () {
                        if ("v3" === e.widgetVersion) {
                            var t = document.getElementsByClassName("tangiblee-modal-content")[0],
                                i = document.createElement("a");
                            i.id = "tng-last-focusable-el", i.href = "javascript:void(0)", i.rel = "nofollow", i.style.position = "absolute", i.style.top = 0, i.style.right = 0, i.setAttribute("aria-hidden", !0), i.onfocusin = function () {
                                var e = document.getElementById("tangiblee_iframe");
                                e && e.focus()
                            }, t.appendChild(i)
                        }
                    },
                    c = function () {
                        document.getElementById("tng-btn-close-modal") && document.getElementById("tng-btn-close-modal").remove(), document.getElementById("tng-btn-close-modal__focusable") && document.getElementById("tng-btn-close-modal__focusable").remove(), document.getElementById("tng-logo-wrapper") && document.getElementById("tng-logo-wrapper").remove(), document.getElementById("tng-logo__focusable") && document.getElementById("tng-logo__focusable").remove(), document.getElementById("tng-first-focusable-el") && document.getElementById("tng-first-focusable-el").remove(), document.getElementById("tng-last-focusable-el") && document.getElementById("tng-last-focusable-el").remove(), document.getElementsByClassName("tangiblee-atc")[0] && document.getElementsByClassName("tangiblee-atc")[0].remove()
                    },
                    g = function () {
                        var o = document.getElementsByClassName("tangiblee-modal-content")[0];
                        window.innerWidth <= 768 ? (t(), s(), l(), n(), d(), o.style.position = "absolute", e.utils.isItiOS ? (o.style.top = "0px", o.style.left = "0px") : (o.style.top = "5px", o.style.left = "5px"), "v2" === e.widgetVersion && (o.style.top = "5px", o.style.left = "5px")) : (i(), s(), r(), a(), d(), o.style.position = "relative", o.style.top = "0", o.style.left = "0");
                        var c = document.getElementById("tng-logo-wrapper");
                        e.utils.bindClickAndTouch(c, function () {}, !1, !0, !1);
                        var g = document.getElementById("tng-btn-close-modal");
                        e.utils.bindClickAndTouch(g, e.modal.close, !0, !0, !1);
                        var p = document.getElementById("tng-logo__focusable");
                        e.utils.bindClickAndTouch(p, function () {}, !1, !0, !0);
                        var u = document.getElementById("tng-btn-close-modal__focusable");
                        e.utils.bindClickAndTouch(u, e.modal.close, !0, !0, !0)
                    },
                    p = function () {
                        g();
                        var t = navigator.userAgent.match(/iPhone/i);
                        if (t) {
                            var i = !1;
                            window.addEventListener("orientationchange", function () {
                                i || (i = setTimeout(function () {
                                    e.validSKUs.indexOf(e.activeSKU) > -1 && (c(), g(), e.showCTA(e.activeSKU, e.getThumb()), clearTimeout(i), i = !1)
                                }, 250))
                            })
                        } else {
                            var n = !1;
                            window.addEventListener("resize", function () {
                                n || (n = setTimeout(function () {
                                    e.validSKUs.indexOf(e.activeSKU) > -1 && (c(), g(), e.showCTA(e.activeSKU, e.getThumb()), clearTimeout(n), n = !1)
                                }, 250))
                            })
                        }
                    },
                    u = function () {
                        var t;
                        return t = "v2" === e.widgetVersion ? window.innerWidth <= 768 ? "position: absolute; top: 5px; left: 5px; background:#fff;width:100%;height:100%;" : "position: relative; background:#fff;width:100%;height:100%;" : window.innerWidth <= 768 ? "position: absolute; top: 5px; left: 5px;width:100%;height:calc(100% - 35px);" : "position: relative;width:100%;height:calc(100% - 35px);"
                    };
                e.modal.isUsed = function () {
                    return ".tangiblee-modal-iframe-container" === e.container
                }, e.modal.inject = function () {
                    var t, i = u();
                    t = "v2" === e.widgetVersion ? '<div class="tangiblee-modal-overlay tng-disable-scrolling" style="display: flex!important; justify-content: center; align-items: center; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 2147483647; touch-action: none; transform: translate(-100%,-100%) translateZ(0); will-change: transform;"><div class="tangiblee-modal-content" style="' + i + '"><div class="tangiblee-modal-iframe-container" style="width:100%;height:calc(100%);"></div></div></div>' : '<div class="tangiblee-modal-overlay tng-disable-scrolling" style="display: flex!important; justify-content: center; align-items: center; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 2147483647; touch-action: none; transform: translate(-100%,-100%) translateZ(0); will-change: transform;"><div class="tangiblee-modal-content" style="' + i + '">' + (e.utils.isItiOS && window.innerWidth <= 768 ? '<div class="tangiblee-modal-bg" style="background:white;position:absolute;top:35px;left:5px;width:calc(100% - 10px);z-index: -1;height:calc(100% - 35px);"></div>' : "") + '<div class="tangiblee-modal-iframe-container" style="width:100%;height:calc(100% - 35px);"></div></div></div>', document.head.insertAdjacentHTML("beforeend", "<style>#tng-logo-wrapper:focus, #tng-btn-close-modal:focus {outline: none !important; box-shadow: none !important;} #tng-logo__focusable:focus, #tng-btn-close-modal__focusable:focus {outline: 2px solid #65d594 !important;}</style>"), document.body.insertAdjacentHTML("beforeend", t);
                    var n = document.getElementsByClassName("tangiblee-modal-overlay")[0];
                    n && (e.utils.bindClickAndTouch(n, e.modal.close, !0, !0), n.onkeydown = function (t) {
                        27 == t.keyCode && e.modal.close(e.modal.isUsed(), !0)
                    }, p())
                }, e.openedProducts = [], e.modal.show = function (t) {
                    var i = document.getElementsByClassName("tangiblee-modal-overlay")[0];
                    if (i || !e.modal.isUsed()) {
                        if (t) i.style.transform = "translate(0,0) translateZ(0)";
                        else if (i) i.style.transform = "translate(0,0) translateZ(0)", i.style.display = "block";
                        else {
                            var n = document.querySelector(e.container);
                            n && (n.style.display = "block")
                        }
                        if (e.utils.isItMobileOrTablet() && window.scrollY) {
                            var a = window.scrollY;
                            window.scrollTo(0, -1), setTimeout(function () {
                                window.scrollTo(0, a)
                            }, 50)
                        }
                        window.tangibleeAnalytics("getTangibleeUserId", function (t) {
                            e.iframe.messaging.postMessageToIframe('{"type":"widgetopened", "data":"' + t + '"}')
                        }), e.openedProducts.indexOf(e.activeSKU) == -1 && (window.tangibleeAnalytics("trackWidgetOpen"), e.openedProducts.push(e.activeSKU)), e.iframe.focusOnLoad(), e.onModalOpened(), (e.onModalClosed || e.onKeepAlive) && (e.timeInWidget = 0, e.keepAliveIntervalId = setInterval(function () {
                            e.onKeepAlive && e.onKeepAlive(), e.timeInWidget += 5
                        }, 5e3))
                    }
                };
                var m = function () {
                    var t;
                    if ("v3" === e.widgetVersion && (t = document.getElementById("tng-a11y-focusable-el"), !t)) {
                        var i = document.createElement("a");
                        i.id = "tng-a11y-focusable-el", i.href = "javascript:void(0)", i.rel = "nofollow", i.style.position = "absolute", i.style.top = 0, i.style.right = 0, i.setAttribute("aria-hidden", !0);
                        var n = document.getElementsByTagName("div")[0];
                        n && n.children && n.children[0] && (n.insertBefore(i, n.children[0]), t = document.getElementById("tng-a11y-focusable-el"))
                    }
                    return t
                };
                e.modal.close = function (t, i) {
                    var n = document.getElementsByClassName("tangiblee-modal-overlay")[0];
                    if (n || !e.modal.isUsed()) {
                        if (t)
                            if (n) n.style.transform = "translate(-100%,-100%) translateZ(0)";
                            else {
                                var a = document.querySelector(e.container);
                                a && (a.style.display = "none")
                            }
                        else n.style.display = "none";
                        if (window.tangibleeAnalytics("trackWidgetClose"), e.keepAliveIntervalId && clearInterval(e.keepAliveIntervalId), e.onModalClosed && e.onModalClosed(e.timeInWidget), e.iframe.messaging.postMessageToIframe('{"type":"widgetclosed"}'), i) {
                            var o = document.querySelector("." + e.ctaCssClass);
                            if (o && ("button" === o.tagName.toLowerCase() || "a" === o.tagName.toLowerCase() || o.hasAttribute("tabindex"))) o.focus();
                            else {
                                var r = m();
                                r && r.focus()
                            }
                        }
                    }
                }
            }(),
            function () {
                var t = function () {
                        if ("string" == typeof e.activeATC) {
                            var t = document.querySelectorAll(e.activeATC);
                            i(t)
                        } else Node.prototype.isPrototypeOf(e.activeATC) ? e.utils.isElementVisible(e.activeATC) && e.utils.fireEvent(e.activeATC, "click") : (HTMLCollection.prototype.isPrototypeOf(e.activeATC) || NodeList.prototype.isPrototypeOf(e.activeATC)) && i(e.activeATC)
                    },
                    i = function (t) {
                        for (var i, n = 0; n < t.length; n++)
                            if (i = t[n], e.utils.isElementVisible(i)) {
                                e.utils.fireEvent(i, "click");
                                break
                            }
                    },
                    n = [{
                        type: "widgetready",
                        listener: function () {
                            window.tangibleeAnalytics("getTangibleeUserId", function (t) {
                                e.iframe.messaging.postMessageToIframe('{"type":"user","data":"' + t + '"}')
                            })
                        }
                    }, {
                        type: "add_to_cart",
                        listener: function () {
                            e.modal.close(e.modal.isUsed()), t(), window.tangibleeAnalytics("trackATCWidgetClick"), e.onATCClickInWidget()
                        }
                    }, {
                        type: "tng_popup_close",
                        listener: function (t) {
                            e.modal.close(e.modal.isUsed(), t)
                        }
                    }],
                    a = function (e) {
                        if (e && e.data && "string" == typeof e.data) {
                            var t = {};
                            try {
                                t = JSON.parse(e.data)
                            } catch (i) {}
                            for (var a = 0; a < n.length; a++)
                                if (t.type == n[a].type) {
                                    var o = t.isKeyboardEvent || void 0;
                                    n[a].listener(o)
                                }
                        }
                    },
                    o = function (t) {
                        var i;
                        return i = "v2" === e.widgetVersion ? '<iframe scrolling="no" style="position:relative;z-index:1;width:100%;height:100%;border:none;" src="' + t + '" class="tangiblee-iframe" id="tangiblee_iframe"></iframe>' : window.innerWidth < 1024 && e.utils.isItiOS ? '<iframe scrolling="no" style="padding:0 5px;position:relative;z-index:1;width:100%;height:100%;border:none;box-sizing:border-box;" src="' + t + '" class="tangiblee-iframe" id="tangiblee_iframe" allow="camera"></iframe>' : '<iframe scrolling="no" style="background:white;position:relative;z-index:1;width:100%;height:100%;border:none;" src="' + t + '" class="tangiblee-iframe" id="tangiblee_iframe" allow="camera"></iframe>'
                    };
                e.iframe.onLoadIsSet = !1, e.iframe.getIframeSrc = function () {
                    var t;
                    if ("v2" === e.widgetVersion) t = window.innerWidth <= 808 ? "//widget.tangiblee.com/mobile/" + e.product.id + "?domain=" + e.domain : "//widget.tangiblee.com/desktop/" + e.product.id + "?domain=" + e.domain;
                    else {
                        var i = e.product && e.product.id,
                            n = [i];
                        if (e.variationSKUs.forEach(function (e) {
                                n.indexOf(e) === -1 && n.push(e)
                            }), t = "//cdn.tangiblee.com/widget/index.html?id=" + (e.useMultiVariations ? n.join(",") : e.product.id) + "&domain=" + e.domain, t += "&useCookies=" + e.useCookies, e.activePrice && (t += "&price=" + e.activePrice), e.activeSalePrice && e.activePrice && (t += "&discount=" + e.activeSalePrice), e.activeCurrency && (t += "&currency=" + e.activeCurrency), e.getFaceDiameter && e.getFaceDiameter() && (t += "&faceDiameter=" + e.getFaceDiameter()), e.getFaceDiameter && e.getFaceDiameter() && e.getFaceDiameterDimensions() && (t += "&faceDiameterDimensions=" + e.getFaceDiameterDimensions()), e.doNotTrack && (t += "&doNotTrack=" + e.doNotTrack), e.availableModes.length > 0) {
                            var a = e.availableModes.join(",");
                            t += "&modes=" + a
                        }
                        e.version && (t += "&version=" + e.version), e.customIframeSrcAttributes.forEach(function (e) {
                            t += "&" + e.key + "=" + e.value
                        })
                    }
                    return t
                }, e.iframe.inject = function () {
                    e.modal.isUsed() && e.modal.inject();
                    var t = document.querySelector(e.container);
                    if (t) {
                        var i = e.iframe.getIframeSrc(),
                            n = o(i);
                        t.innerHTML = n
                    }
                }, e.iframe.update = function () {
                    var t = document.getElementById("tangiblee_iframe");
                    if (t) {
                        var i = t.getAttribute("src").replace(/(^\w+:|^)/, ""),
                            n = e.iframe.getIframeSrc();
                        i != n && (t.src = n)
                    }
                }, e.iframe.exists = function () {
                    return document.getElementById("tangiblee_iframe")
                }, e.iframe.switchWidgetVariation = function (t) {
                    var i = JSON.stringify(t);
                    e.iframe.messaging.postMessageToIframe('{"type":"variationchanged","data":' + i + "}")
                }, e.iframe.focusOnLoad = function () {
                    var t = document.getElementById("tangiblee_iframe");
                    e.iframe.onLoadIsSet ? t.focus() : t.onload = function () {
                        e.onIframeLoaded(), e.isUserInteractedBefore || (t.addEventListener("click", e.onUserInteracted), e.isUserInteractedBefore = !0), setTimeout(function () {
                            t.focus(), e.iframe.onLoadIsSet = !0
                        }, 200)
                    }
                }, e.iframe.messaging = {
                    addMessageListener: function (e) {
                        n.push(e)
                    },
                    startListening: function () {
                        !window.initialTangiblee && window.addEventListener("message", a, !1), window.initialTangiblee = !0
                    },
                    postMessageToIframe: function (e) {
                        var t = document.getElementById("tangiblee_iframe");
                        if (t) {
                            var i = t.contentWindow;
                            i && "function" == typeof i.postMessage && i.postMessage(e, "*")
                        }
                    }
                }
            }();
        var i = {
                "www.tumi-hk.com": {
                    retailer: "www.tumi-hk.com",
                    ctaText: "Compare Size",
                    atcSelector: "#addToCartBtn",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "OPEN",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {border-left: 1px solid #dedede;}.tangiblee-additional__wrapper--single {border-left: none; border-bottom: 2px solid #dedede; border-top: 2px solid #dedede;padding-top:25px !important;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link{color: #000;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 59%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-additional__wrapper--single{padding: 10px 0 5px!important;border-top:none;}.detail-title-style.tangiblee-cta{display:inline-block!important;font-size:15px !important;width:185px;text-transform: capitalize;}.tangiblee-ruler-bg--additional{position:relative;top:7px;padding: 0 0 0 5px;}.tangiblee-additional__title{font-size:15px !important;}.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 5px !important;}.tangiblee-additional__wrapper{width: 100%!important; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;} .tangiblee-additional__open-link {position: absolute; top: auto; right: 0;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 5px 0px;} .tangiblee-additional__wrapper--single {width: calc(100% - 50px) !important;} .tangiblee-additional__open-link {margin: 5px 30px 0 0 !important;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {#tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__title{font-size: 15px !important;}}',
                    getActiveSku: function () {
                        var e;
                        return $('meta[itemprop="sku"]').length && (e = $('meta[itemprop="sku"]').attr("content")), e
                    },
                    injectCta: function (t) {
                        $(".cntr-product-alternate-items").length ? $(".cntr-product-alternate-items").append('<div class="tangiblee-thumb tangiblee-thumb-cn"><img src="' + t + '"/></div>') : $(".not-smallscreen").append('<div class="tangiblee-thumb-top tangiblee-cta"><img src="' + t + '"/></div>'), $(".alternate-prods-carousel .single-item.slick-slider").length ? $(".alternate-prods-carousel .single-item.slick-slider").slick("slickAdd", '<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>") : $(".alternate-prods-carousel .single-item").append('<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn" style="padding: 0;"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>"),
                            $(".not-smallscreen").append('<div class="tangiblee-cn-main"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>");
                        var a = '<div class="tangiblee-additional__wrapper items-link with-monogram"><span class="icon-img" style="height:24px;position:relative;top:-10px;"><div style="display: inline-block;vertical-align:middle;" class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + t + '"/></div></span><span class="detail-title-style tangiblee-cta" style="cursor:pointer;margin:0;font-size:14px;">' + i[n].sizeComparison + '</span><span class="item-desc">' + i[n].whatCanYouFitInYourTumiText + '</span><span class="tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer;margin:7px 0 0 0;font-size:12px;">' + i[n].exploreText + "</span></div>",
                            o = function () {
                                if ($(".monogrammin-items").length) {
                                    var t = $(".monogrammin-items .items-link").not(".hidden");
                                    if (1 === t.length) {
                                        var i = "49%";
                                        t.css("width", i), $(".monogrammin-items").append(a), $(".items-link.monogram-added-cntr").css("width", i), $(".tangiblee-additional__wrapper").css("width", i)
                                    }
                                    t.length > 1 && $(".cntr-add-to-cart").length && ($(".monogrammin-items").append(a), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single")), 0 === t.length && ($(".full-row.monogrammin-items").css("display", "block"), $(".monogrammin-items").append(a), $(".tangiblee-additional__wrapper").css({
                                        "margin-top": 0,
                                        "border-top": "none"
                                    }).addClass("tangiblee-additional__wrapper--single"))
                                } else $(".cntr-add-to-cart").length && ($(".cntr-add-to-cart").before(a), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single"));
                                e.setCtaClickHandler()
                            };
                        e.utils.waitForConditionToMet(function () {
                            return "complete" === document.readyState
                        }, 100).then(function () {
                            o()
                        }).fail(function () {
                            o()
                        }), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".cntr-prod-alternate-item").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $("span.icon").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#prod-details .prod-price-availabilty .prod-price");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "HK$"
                    }
                },
                "www.tumi-hk.com/zh/": {
                    retailer: "www.tumi-hk.com/zh/",
                    ctaText: "Compare Size",
                    atcSelector: "#addToCartBtn",
                    sizeComparison: "å°ºå¯¸æ¯”è¼ƒ",
                    comparisonToOtherItems: "èˆ‡å…¶ä»–é …ç›®æ¯”è¼ƒ",
                    openText: "æ‰“é–‹",
                    exploreText: "æŽ¢ç´¢",
                    exploreNowText: "ç«‹å³æŽ¢ç´¢",
                    whatCanYouFitInYourTumiText: "æ‚¨çš„TUMIèƒ½æ”¾ç”šéº¼ï¼Ÿ",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin: 4% 0 0 0; border-left: 1px solid #dedede; position: relative; text-align: center;}.tangiblee-additional__wrapper--single {width: 100%;padding: 10px 0; border-left: none; border-bottom: 2px solid #dedede; border-top: 2px solid #dedede;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}.tangiblee-additional__wrapper--single .item-desc {font-size: 12px; color: #777; letter-spacing: .02em;}@media(max-width: 1279px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__wrapper{width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;} .tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {padding: 0 0 0 5px; position: relative; top: 7px;} .tangiblee-additional__title{font-size: 15px !important;} .item-desc {display: none;} .tangiblee-additional__wrapper--without-top-border {padding: 0px 0 10px 0;} .tangiblee-additional__wrapper--single .tangiblee-additional__open-link {margin: 0 !important;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 5px 0px;} .tangiblee-additional__wrapper--single {width: calc(100% - 50px) !important; padding: 10px 0;} .tangiblee-additional__wrapper .tangiblee-additional__open-link {margin: 0 30px 0 0 !important;} .tangiblee-additional__open-link {margin: 5px 30px 0 0 !important; font-size: 12px !important;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {#tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}}',
                    getActiveSku: function () {
                        var e;
                        return $('meta[itemprop="sku"]').length && (e = $('meta[itemprop="sku"]').attr("content")), e
                    },
                    injectCta: function (t) {
                        $(".cntr-product-alternate-items").length ? $(".cntr-product-alternate-items").append('<div class="tangiblee-thumb tangiblee-thumb-cn"><img src="' + t + '"/></div>') : $(".not-smallscreen").append('<div class="tangiblee-thumb-top tangiblee-cta"><img src="' + t + '"/></div>'), $(".alternate-prods-carousel .single-item.slick-slider").length ? $(".alternate-prods-carousel .single-item.slick-slider").slick("slickAdd", '<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>") : $(".alternate-prods-carousel .single-item").append('<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>"), $(".not-smallscreen").append('<div class="tangiblee-cn-main"><div class="tangiblee-image-bg"><img style="width:100%;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>");
                        var a = '<div class="tangiblee-additional__wrapper items-link with-monogram"><span class="icon-img" style="height:24px;position:relative;top:-10px;"><div style="display: inline-block;vertical-align:middle;"class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + t + '"/></div></span><span class="tangiblee-additional__title tangiblee-cta" style="cursor:pointer;margin:0;font-size:14px; color: #222;">' + i[n].sizeComparison + '</span><span class="item-desc">' + i[n].whatCanYouFitInYourTumiText + '</span><span class="tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer;margin:7px 0 0 0;font-size:12px; color: #000;">' + i[n].exploreText + "</span></div>",
                            o = function () {
                                if ($(".monogrammin-items:visible").length) {
                                    var t = $(".monogrammin-items .items-link").not(".hidden");
                                    if (1 === t.length) {
                                        var i = "49%";
                                        t.css("width", i), $(".monogrammin-items").append(a), $(".items-link.monogram-added-cntr").css("width", i), $(".tangiblee-additional__wrapper").css("width", i)
                                    }
                                    t.length > 1 && $(".cntr-add-to-cart").length && ($(".cntr-add-to-cart").before(a), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single").addClass("tangiblee-additional__wrapper--without-top-border"))
                                } else $(".cntr-add-to-cart").length && ($(".cntr-add-to-cart").before(a), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single"));
                                e.setCtaClickHandler()
                            };
                        e.utils.waitForConditionToMet(function () {
                            return "complete" === document.readyState
                        }, 100).then(function () {
                            o()
                        }).fail(function () {
                            o()
                        }), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".cntr-prod-alternate-item").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $("span.icon").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#prod-details .prod-price-availabilty .prod-price");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "HK$"
                    }
                },
                "www.tumi.co.jp": {
                    retailer: "www.tumi.co.jp",
                    ctaText: "Compare Size",
                    atcSelector: ".shoppingBagBtnWrap .shoppingBagBtn a",
                    sizeComparison: "ã‚µã‚¤ã‚ºæ¯”è¼ƒ",
                    comparisonToOtherItems: "ä»–ã®è£½å“ã¨æ¯”è¼ƒã™ã‚‹",
                    openText: "é–‹ã„ãŸ",
                    exploreText: "ãƒã‚§ãƒƒã‚¯ã™ã‚‹",
                    exploreNowText: "ãƒã‚§ãƒƒã‚¯ã™ã‚‹",
                    whatCanYouFitInYourTumiText: "ã‚µã‚¤ã‚ºæ¯”è¼ƒ",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin: 4% 0 0 0; border-left: 1px solid #dedede;font-size:1.4rem; position: relative; text-align: center; color: #222;}.tangiblee-additional__wrapper--co-jp {flex: 1 0 auto;}.tangiblee-additional__wrapper--co-jp-single {width: 100%; padding: 10px 0; border-top: 2px solid #dedede; border-bottom: 2px solid #dedede; border-left: none;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: -10px 0 0 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 59%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-additional__description {display: none;} .tangiblee-additional__description {display:inline;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 0 !important;}.tangiblee-additional__wrapper{width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;} .tangiblee-additional__wrapper--co-jp {width: auto!important;flex-direction: column;justify-content:center; flex: 1 0 auto; border-left: 1px solid #dedede; border-bottom: none;} .tangiblee-additional__wrapper--co-jp-single {flex-direction: column; justify-content: center;} .tangiblee-additional__wrapper--co-jp-single .tangiblee-additional__open-link {position: initial;} .tangiblee-additional__wrapper--co-jp .tangiblee-additional__open-link {position: initial;} .tangiblee-additional__open-link {position: initial;} .tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {margin: 0 5px 0 0;}}@media(max-width: 768px) {.tangiblee-additional__wrapper {padding: 5px 10px;} #contents .serviceInfo {flex-direction: column;} .tangiblee-additional__wrapper--co-jp {width: 100%!important; flex-direction: row; justify-content: flex-start; border-left: none; border-top: 2px solid #dedede;} .tangiblee-additional__wrapper--co-jp  .tangiblee-additional__open-link {position: absolute;} .tangiblee-additional__wrapper--co-jp-single {width: 100%!important; flex-direction: row; justify-content: flex-start;} .tangiblee-additional__wrapper--co-jp-single .tangiblee-additional__open-link {position: absolute;} .tangiblee-additional__open-link {margin: 0 !important;}}@media(max-width: 700px) {#tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        if (window.location.href) {
                            var t = window.location.href.split("/");
                            t.length > 2 && (e = t.length ? t[t.length - 2] : null)
                        }
                        return e
                    },
                    injectCta: function (e) {
                        var t = -1;
                        $("#detailPhoto .photoArea .photoAreaBox .thumbnail.pc:first .item:last").after('<li class="item tangiblee-thumb"><img style="position:relative;" src="' + e + '" /></li>'), $(".photoSlide.slick-slider:visible").slick("slickAdd", '<li class="tangiblee-slick-item"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>");
                        var a = '<div class="tangiblee-additional__wrapper tangiblee-additional__wrapper--co-jp"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><p class="tangiblee-additional__title tangiblee-cta" style="cursor:pointer;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer;">' + i[n].exploreText + "</p></div>";
                        $("#contents .serviceInfo").length && $("#contents .serviceInfo").children().length < 2 ? ($("#contents .serviceInfo").append(a), $("#contents .serviceInfo").css("display", "flex"), $("#contents .serviceInfo").css("justify-content", "center"), $("#contents .serviceInfo figure").css("flex", "1 0 auto")) : $(".shoppingBagInfo.bdBottom").length && ($(".shoppingBagInfo.bdBottom").before(a), $(".tangiblee-additional__wrapper").removeClass("tangiblee-additional__wrapper--co-jp").addClass("tangiblee-additional__wrapper--co-jp-single"), $("#contents .serviceInfo").children().length > 1 && $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--without-top-border")), $(".tangiblee-thumb").on("click", function () {
                            $(".photoSlide.slick-slider").slick("slickGoTo", t)
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#detailPhoto .price:first");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "Â¥"
                    }
                },
                "www.tumi.my": {
                    retailer: "www.tumi.my",
                    ctaText: "Compare Size",
                    atcSelector: ".cartbuttondiv .BuyNow",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "Open",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper-my-sg-au {border-left: 1px solid #dedede;}.tangiblee-additional__wrapper--single-my-sg-au {width: 100%; padding: 10px 0; border-left: none !important;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-ruler-bg {order: 0; background-image: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png");background-repeat: no-repeat;background-position: 0px center;background-size: 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; display:block;margin:0 auto;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb--my-sg-au img{max-width:100%; max-height:100%}.tangiblee-slide--my-sg-au {position: absolute;top: 0;width: 100%;height: 100%;right:-15px;background: #f7f7f7;z-index:100;}.tangiblee-slide--my-sg-au .tangiblee-slick-item{position: absolute;width:100%;height: 100%;top: 50%;left: 50%;transform: translate(-50%, -50%);}.tangiblee-additional__wrapper-my-sg-au--top-line:before{background: #cccccc;content: "";height: 2px;left: 0;position: absolute;top: -4px;width: 100%;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {display:none;} .tangiblee-ruler-bg--additional{margin:0;} .tangiblee-additional__wrapper--single-my-sg-au{padding:0;}}',
                    getActiveSku: function () {
                        var e, t;
                        return window.location.href && (t = window.location.href.lastIndexOf("/"), e = window.location.href.slice(t + 1)), e
                    },
                    injectCta: function (e) {
                        $(".container7 .ctl_multiple_image .smallimages div.items a:last").after('<a class="imgthumbnail mjthumbnail tangiblee-thumb tangiblee-thumb--my-sg-au"><img style="position:relative;" src="' + e + '" /></a>'), $(".leftpane").append('<div class="tangiblee-slide--my-sg-au"><div class="tangiblee-slick-item"><div class="tangiblee-slider-content"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div>"), $(".tangiblee-slide--my-sg-au").css("display", "none"), $(".container7 .ctl_multiple_image .smallimages div.items a").on("click", function () {
                            $(".tangiblee-slide--my-sg-au").css("display", "none"), $("#MultipleImages").css({
                                position: "inherit",
                                "z-index": "inherit"
                            })
                        }), $(".tangiblee-thumb--my-sg-au").on("click", function () {
                            $("#MultipleImages").css({
                                position: "relative",
                                "z-index": "101"
                            }), $(".tangiblee-slide--my-sg-au").css("display", "block")
                        });
                        var t = '<div class="tangiblee-additional__wrapper-my-sg-au monogram_content"><p class="carry-moni-image"><span class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></span></p><p class="tangiblee-additional__title tangiblee-cta mono_title" style="cursor:pointer;text-align: center;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__description mono-guidance" style="text-align: center;">' + i[n].whatCanYouFitInYourTumiText + '</p><p class="tangiblee-additional__open-link tangiblee-cta mono-add1" style="cursor:pointer;text-align: center;"><a href="javascript:void(0);" class="monogramming_guide">' + i[n].exploreText + "</a></p></div>";
                        if ($(".mono-parent1:visible").length) {
                            var a = "100%",
                                o = $(".mono-parent1>div").not(".hidden");
                            o.length < 2 ? (1 === o.length && (a = "49%"), o.css("width", a), $(".mono-parent1").append(t), $(".tangiblee-additional__wrapper-my-sg-au").css("width", a), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper-my-sg-au--top-line"), 0 === o.length && $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au")) : ($(".mono-parent1").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                        } else $(".cartdetail").length && ($(".cartdetail").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                    },
                    getPrice: function () {
                        var e, t = $('#pnWebPrice [itemprop="price"] .sp_amt .sp_amt');
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "RM"
                    }
                },
                "www.tumi.sg": {
                    retailer: "www.tumi.sg",
                    ctaText: "Compare Size",
                    atcSelector: ".cartbuttondiv .BuyNow",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "Open",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper-my-sg-au {border-left: 1px solid #dedede;}.tangiblee-additional__wrapper--single-my-sg-au {width: 100%; padding: 10px 0; border-left: none !important;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-ruler-bg {order: 0; background-image: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png");background-repeat: no-repeat;background-position: 0px center;background-size: 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; display:block;margin:0 auto;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb--my-sg-au img{max-width:100%; max-height:100%}.tangiblee-slide--my-sg-au {position: absolute;top: 0;width: 100%;height: 100%;right:-15px;background: #f7f7f7;z-index:100;}.tangiblee-slide--my-sg-au .tangiblee-slick-item{position: absolute;width:100%;height: 100%;top: 50%;left: 50%;transform: translate(-50%, -50%);}.tangiblee-additional__wrapper-my-sg-au--top-line:before{background: #cccccc;content: "";height: 2px;left: 0;position: absolute;top: -4px;width: 100%;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {display:none;} .tangiblee-ruler-bg--additional{margin:0;} .tangiblee-additional__wrapper--single-my-sg-au{padding:0;}}',
                    getActiveSku: function () {
                        var e, t;
                        return window.location.href && (t = window.location.href.lastIndexOf("/"), e = window.location.href.slice(t + 1)), e
                    },
                    injectCta: function (e) {
                        $(".container7 .ctl_multiple_image .smallimages div.items a:last").after('<a class="imgthumbnail mjthumbnail tangiblee-thumb tangiblee-thumb--my-sg-au"><img style="position:relative;" src="' + e + '" /></a>'), $(".leftpane").append('<div class="tangiblee-slide--my-sg-au"><div class="tangiblee-slick-item"><div class="tangiblee-slider-content"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div>"), $(".tangiblee-slide--my-sg-au").css("display", "none"), $(".container7 .ctl_multiple_image .smallimages div.items a").on("click", function () {
                            $(".tangiblee-slide--my-sg-au").css("display", "none"), $("#MultipleImages").css({
                                position: "inherit",
                                "z-index": "inherit"
                            })
                        }), $(".tangiblee-thumb--my-sg-au").on("click", function () {
                            $("#MultipleImages").css({
                                position: "relative",
                                "z-index": "101"
                            }), $(".tangiblee-slide--my-sg-au").css("display", "block")
                        });
                        var t = '<div class="tangiblee-additional__wrapper-my-sg-au monogram_content"><p class="carry-moni-image"><span class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></span></p><p class="tangiblee-additional__title tangiblee-cta mono_title" style="cursor:pointer;text-align: center;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__description mono-guidance" style="text-align: center;">' + i[n].whatCanYouFitInYourTumiText + '</p><p class="tangiblee-additional__open-link tangiblee-cta mono-add1" style="cursor:pointer;text-align: center;"><a href="javascript:void(0);" class="monogramming_guide">' + i[n].exploreText + "</a></p></div>";
                        if ($(".mono-parent1:visible").length) {
                            var a = "100%",
                                o = $(".mono-parent1>div").not(".hidden");
                            o.length < 2 ? (1 === o.length && (a = "49%"), o.css("width", a), $(".mono-parent1").append(t), $(".tangiblee-additional__wrapper-my-sg-au").css("width", a), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper-my-sg-au--top-line"), 0 === o.length && $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au")) : ($(".mono-parent1").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                        } else $(".cartdetail").length && ($(".cartdetail").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                    },
                    getPrice: function () {
                        var e, t = $('[itemprop="price"] .sp_amt');
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "SG$"
                    }
                },
                "www.tumisgtest.martjack.com": {
                    retailer: "www.tumisgtest.martjack.com",
                    ctaText: "Compare Size",
                    atcSelector: ".cartbuttondiv .BuyNow",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "Open",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper-my-sg-au {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin:0; border-left: 1px solid #dedede;font-size:1.4rem; position: relative; text-align: center; color: #222;}.tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__title {padding: 5px 0; font-size: 14px; color: #222; font-weight: 400;}.tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {font-size: 12px; color: #777; font-weight: 400;}.tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__open-link {padding: 10px 0; font-size: 12px; color: #222; font-weight: 400;}.tangiblee-additional__wrapper--single-my-sg-au {width: 100%; padding: 10px 0; border-left: none !important; border-top: 2px solid #dedede;}.tangiblee-additional__wrapper--single-my-sg-au .tangiblee-ruler-bg--additional {margin: 0;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: -10px 0 0 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb--my-sg-au img{max-width:100%; max-height:100%}.tangiblee-slide--my-sg-au {position: absolute;top: 0;width: 100%;height: 100%;right:-15px;background: #f7f7f7;z-index:100;}.tangiblee-slide--my-sg-au .tangiblee-slick-item{position: absolute;width:100%;top: 50%;left: 50%;transform: translate(-50%, -50%);}.tangiblee-additional__wrapper-my-sg-au--top-line:before{background: #cccccc;content: "";height: 2px;left: 0;position: absolute;top: -4px;width: 100%;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-additional__description {display: none;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {display:inline;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 0 !important;}.tangiblee-additional__wrapper-my-sg-au {flex-direction: column; justify-content: center; border-bottom: none; border-left: 1px solid #dedede;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__open-link {position: initial;} .tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {margin: 0 5px 0 0;}}@media(max-width: 768px) {.tangiblee-additional__open-link {margin: 0 30px 0 0 !important;} #contents .serviceInfo {flex-direction: column;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__open-link {margin: 0 !important;}}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__wrapper-my-sg-au {width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 10px;box-sizing:border-box; border-left: none; border-top: 2px solid #dedede;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__open-link {position: absolute; margin: 0 35px 0 0 !important} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {display:none;}} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__title {padding-left: 20px;}@media(max-width: 450px) {.tangiblee-slide--my-sg-au .tangiblee__description span{display:block;.tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__open-link {position: absolute; margin: 0 20px 0 0 !important}}}',
                    getActiveSku: function () {
                        var e, t = $(".sku_style");
                        return t.length && (e = t.eq(0).text()), e
                    },
                    injectCta: function (e) {
                        $(".container7 .ctl_multiple_image .smallimages div.items a:last").after('<a class="imgthumbnail mjthumbnail tangiblee-thumb tangiblee-thumb--my-sg-au"><img style="position:relative;" src="' + e + '" /></a>'), $(".leftpane").append('<div class="tangiblee-slide--my-sg-au"><div class="tangiblee-slick-item"><div class="tangiblee-slider-content"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div>"), $(".tangiblee-slide--my-sg-au").css("display", "none"), $(".container7 .ctl_multiple_image .smallimages div.items a").on("click", function () {
                            $(".tangiblee-slide--my-sg-au").css("display", "none"), $("#MultipleImages").css({
                                position: "inherit",
                                "z-index": "inherit"
                            })
                        }), $(".tangiblee-thumb--my-sg-au").on("click", function () {
                            $("#MultipleImages").css({
                                position: "relative",
                                "z-index": "101"
                            }), $(".tangiblee-slide--my-sg-au").css("display", "block")
                        });
                        var t = '<div class="tangiblee-additional__wrapper-my-sg-au" style="text-align: center;font-size:14px;"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><p class="tangiblee-additional__title tangiblee-cta" style="cursor:pointer;text-align: center;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__description" style="text-align: center;">' + i[n].whatCanYouFitInYourTumiText + '</p><p class="tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer;text-align: center;">' + i[n].exploreText + "</p></div>";
                        if ($(".mono-parent1:visible").length) {
                            var a = "100%",
                                o = $(".mono-parent1>div").not(".hidden");
                            o.length < 2 ? (1 === o.length && (a = "49%"), o.css("width", a), $(".mono-parent1").append(t), $(".tangiblee-additional__wrapper-my-sg-au").css("width", a), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper-my-sg-au--top-line"), 0 === o.length && $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au")) : ($(".mono-parent1").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                        } else $(".cartdetail").length && ($(".cartdetail").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                    },
                    getPrice: function () {
                        var e, t = $('.rightpane [itemprop="price"] .sp_amt').eq(0);
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "SG$"
                    }
                },
                "www.tumi.com.au": {
                    retailer: "www.tumi.com.au",
                    ctaText: "Compare Size",
                    atcSelector: ".cartbuttondiv .BuyNow",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "Open",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper-my-sg-au {border-left: 1px solid #dedede;}.tangiblee-additional__wrapper--single-my-sg-au {width: 100%; padding: 10px 0; border-left: none !important;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-ruler-bg {order: 0; background-image: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png");background-repeat: no-repeat;background-position: 0px center;background-size: 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; display:block;margin:0 auto;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb--my-sg-au img{max-width:100%; max-height:100%}.tangiblee-slide--my-sg-au {position: absolute;top: 0;width: 100%;height: 100%;right:-15px;background: #f7f7f7;z-index:100;}.tangiblee-slide--my-sg-au .tangiblee-slick-item{position: absolute;width:100%;height: 100%;top: 50%;left: 50%;transform: translate(-50%, -50%);}.tangiblee-additional__wrapper-my-sg-au--top-line:before{background: #cccccc;content: "";height: 2px;left: 0;position: absolute;top: -4px;width: 100%;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__wrapper-my-sg-au .tangiblee-additional__description {display:none;} .tangiblee-ruler-bg--additional{margin:0;} .tangiblee-additional__wrapper--single-my-sg-au{padding:0;}}',
                    getActiveSku: function () {
                        var e, t;
                        return window.location.href && (t = window.location.href.lastIndexOf("/"), e = window.location.href.slice(t + 1)), e
                    },
                    injectCta: function (e) {
                        $(".container7 .ctl_multiple_image .smallimages div.items a:last").after('<a class="imgthumbnail mjthumbnail tangiblee-thumb tangiblee-thumb--my-sg-au"><img style="position:relative;" src="' + e + '" /></a>'), $(".leftpane").append('<div class="tangiblee-slide--my-sg-au"><div class="tangiblee-slick-item"><div class="tangiblee-slider-content"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div>"), $(".tangiblee-slide--my-sg-au").css("display", "none"), $(".container7 .ctl_multiple_image .smallimages div.items a").on("click", function () {
                            $(".tangiblee-slide--my-sg-au").css("display", "none"), $("#MultipleImages").css({
                                position: "inherit",
                                "z-index": "inherit"
                            })
                        }), $(".tangiblee-thumb--my-sg-au").on("click", function () {
                            $("#MultipleImages").css({
                                position: "relative",
                                "z-index": "101"
                            }), $(".tangiblee-slide--my-sg-au").css("display", "block")
                        });
                        var t = '<div class="tangiblee-additional__wrapper-my-sg-au monogram_content"><p class="carry-moni-image"><span class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></span></p><p class="tangiblee-additional__title tangiblee-cta mono_title" style="cursor:pointer;text-align: center;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__description mono-guidance" style="text-align: center;">' + i[n].whatCanYouFitInYourTumiText + '</p><p class="tangiblee-additional__open-link tangiblee-cta mono-add1" style="cursor:pointer;text-align: center;"><a href="javascript:void(0);" class="monogramming_guide">' + i[n].exploreText + "</a></p></div>";
                        if ($(".mono-parent1:visible").length) {
                            var a = "100%",
                                o = $(".mono-parent1>div").not(".hidden");
                            o.length < 2 ? (1 === o.length && (a = "49%"), o.css("width", a), $(".mono-parent1").append(t), $(".tangiblee-additional__wrapper-my-sg-au").css("width", a), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper-my-sg-au--top-line"), 0 === o.length && $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au")) : ($(".mono-parent1").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                        } else $(".cartdetail").length && ($(".cartdetail").after(t), $(".tangiblee-additional__wrapper-my-sg-au").addClass("tangiblee-additional__wrapper--single-my-sg-au"))
                    },
                    getPrice: function () {
                        var e, t = $('[itemprop="price"] .sp_amt');
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "AU$"
                    }
                },
                "www.tumi.cn": {
                    retailer: "www.tumi.cn",
                    ctaText: "Compare Size",
                    atcSelector: "#addToCartBtn",
                    sizeComparison: "å°ºå¯¸æ¯”è¾ƒ",
                    comparisonToOtherItems: "ä¸Žå…¶ä»–äº§å“æ¯”è¾ƒ",
                    openText: "æ‰“å¼€",
                    exploreText: "æŽ¢ç´¢",
                    exploreNowText: "ç«‹å³æŽ¢ç´¢",
                    whatCanYouFitInYourTumiText: "ä½ çš„TUMIèƒ½è£…ä¸‹ä»€ä¹ˆï¼Ÿ",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin: 4% 0 0 0; border-left: 1px solid #dedede;font-size:1.4rem; position: relative; text-align: center; color: #222;}.tangiblee-additional__wrapper--single {width: 100%;padding: 10px 0; border-left: none; border-bottom: 2px solid #dedede; border-top: 2px solid #dedede;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: -10px 0 0 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 0 !important;}.tangiblee-additional__wrapper{width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;} .tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {margin: 0 5px 0 0;}}@media(max-width: 700px) {#tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px; box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 5px 0px;} .tangiblee-additional__wrapper--single {width: calc(100% - 50px) !important;} .tangiblee-additional__open-link {margin: 0 30px 0 0 !important;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;} .tangiblee-additional__title{font-size: 15px !important;}}',
                    getActiveSku: function () {
                        for (var e, t = 0; t < dataLayer.length; t++)
                            if (dataLayer[t].ecommerce && dataLayer[t].ecommerce && dataLayer[t].ecommerce.detail && dataLayer[t].ecommerce.detail.products && dataLayer[t].ecommerce.detail.products[0]) {
                                e = dataLayer[t].ecommerce.detail.products[0].id;
                                break
                            } return e || (e = $("#style_product_code").val()), e
                    },
                    injectCta: function (e) {
                        $(".cntr-product-alternate-items").length ? $(".cntr-product-alternate-items").append('<div class="tangiblee-thumb tangiblee-thumb-cn"><img src="' + e + '"/></div>') : $(".not-smallscreen").append('<div class="tangiblee-thumb-top tangiblee-cta"><img src="' + e + '"/></div>'), $(".alternate-prods-carousel .single-item.slick-slider").length ? $(".alternate-prods-carousel .single-item.slick-slider").slick("slickAdd", '<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>") : $(".alternate-prods-carousel .single-item").append('<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>"), $(".not-smallscreen").append('<div class="tangiblee-cn-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>");
                        var t = '<div class="tangiblee-additional__wrapper"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><p class="tangiblee-additional__title tangiblee-cta" style="cursor:pointer; color: #000;margin:0;font-size: 14px;">' + i[n].sizeComparison + '</p><p class="tangiblee-additional__description" style="color: #777; margin:0;font-size: 12px;">' + i[n].whatCanYouFitInYourTumiText + '</p><p class="tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer; color: #000; margin:10px 0 0 0;font-size: 12px; text-decoration: none;">' + i[n].exploreText + "</p></div>";
                        if ($(".monogrammin-items:visible").length) {
                            var a = $(".monogrammin-items .items-link").not(".hidden");
                            if (1 === a.length) {
                                var o = "49%";
                                a.css("width", o), $(".monogrammin-items").append(t), $(".items-link.monogram-added-cntr").css("width", o), $(".tangiblee-additional__wrapper").css("width", o)
                            }
                            a.length > 1 && $(".cntr-add-to-cart").length && ($(".cntr-add-to-cart").before(t), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single").addClass("tangiblee-additional__wrapper--without-top-border"))
                        } else $(".cntr-add-to-cart").length && ($(".cntr-add-to-cart").before(t), $(".tangiblee-additional__wrapper").addClass("tangiblee-additional__wrapper--single"));
                        $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".cntr-prod-alternate-item").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $("span.icon").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#prod-details .prod-price-availabilty .prod-price");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "Â¥"
                    }
                },
                "www.tumi.co.th": {
                    retailer: "www.tumi.co.th",
                    ctaText: "Compare Size",
                    atcSelector: "#add-to-cart",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "OPEN",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {border-left: 1px solid #dedede;position: relative;}.tangiblee-additional__wrapper--single {width: 100%;border-left: none;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin:0; position: absolute; top: 5px; left: calc(50% - 20px)}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-th{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb-th img{width:100%;height:100%;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1280px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .tangiblee-additional__wrapper{flex: 1 1 100% !important;border: 1px solid rgba(0,0,0,0) !important;}.tangiblee-ruler-bg--additional{left: 0; top: 43px;}}@media(max-width: 1200px) {.tangiblee-ruler-bg--additional{top: 2px;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 0;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        return $('span[itemprop="productID"]:first').length && (e = $('span[itemprop="productID"]:first').text().trim()), e
                    },
                    injectCta: function (e) {
                        window.innerWidth > 767 ? ($("#thumbnails .thumb-list .thumb").length > 0 && "hidden" === $("#thumbnails .thumb-list").css("visibility") ? $(".product-primary-image").append('<div class="tangiblee-thumb-th tangiblee-thumb-top tangiblee-cta"><img src="' + e + '"/></div>') : $("#thumbnails .thumb-list").append('<div class="tangiblee-thumb tangiblee-thumb-th"><img src="' + e + '"/></div>'), $(".product-primary-image:first").append('<div class="tangiblee-cn-main tangiblee-th-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>")) : $(".thumb-list.owl-carousel").length && $(".thumb-list.owl-carousel").trigger("add.owl.carousel", ['<div class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></div>"]).trigger("refresh.owl.carousel");
                        var t = '<li class="tangiblee-additional__li tangiblee-additional__wrapper"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><h3 class="tangiblee-additional__title tangiblee-cta">' + i[n].sizeComparison + '</h3><p class="tangiblee-additional__description">' + i[n].whatCanYouFitInYourTumiText + '</p><a href="javascript:void(0)" class="tangiblee-additional__open-link tangiblee-cta">' + i[n].exploreText + "</a>";
                        $(".product-benefit:visible").append(t), $(".product-benefit:visible").length && document.querySelector(".product-benefit").setAttribute("style", "flex-wrap:wrap;-ms-flex-wrap:wrap;"), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".thumb-list .thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $(".close-image-zoom").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $(".product-price:first .price-sales");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "à¸¿"
                    }
                },
                "www.tumi.co.th/th/": {
                    retailer: "www.tumi.co.th/th/",
                    ctaText: "à¹€à¸›à¸£à¸µà¸¢à¸šà¹€à¸—à¸µà¸¢à¸šà¸‚à¸™à¸²à¸”",
                    atcSelector: "#add-to-cart",
                    sizeComparison: "à¸•à¸±à¸§à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸à¸²à¸£à¹€à¸›à¸£à¸µà¸¢à¸šà¹€à¸—à¸µà¸¢à¸šà¸‚à¸™à¸²à¸”",
                    comparisonToOtherItems: "à¹€à¸›à¸£à¸µà¸¢à¸šà¹€à¸—à¸µà¸¢à¸šà¸à¸±à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸­à¸·à¹ˆà¸™",
                    openText: "à¹€à¸›à¸´à¸”",
                    exploreText: "à¸ªà¸³à¸£à¸§à¸ˆ",
                    exploreNowText: "à¸ªà¸³à¸£à¸§à¸ˆà¸•à¸­à¸™à¸™à¸µà¹‰",
                    whatCanYouFitInYourTumiText: "à¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¸„à¸¸à¸“à¸ªà¸²à¸¡à¸²à¸£à¸–à¸žà¸­à¸”à¸µà¸à¸±à¸š TUMI à¸‚à¸­à¸‡à¸„à¸¸à¸“?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {border-left: 1px solid #dedede;position: relative;}.tangiblee-additional__wrapper--single {width: 100%;border-left: none;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin:0; position: absolute; top: 5px; left: calc(50% - 20px)}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-th{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb-th img{width:100%;height:100%;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1280px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .tangiblee-additional__wrapper{flex: 1 1 100% !important;border: 1px solid rgba(0,0,0,0) !important;}.tangiblee-ruler-bg--additional{left: 0; top: 43px;}}@media(max-width: 1200px) {.tangiblee-ruler-bg--additional{top: 2px;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 0;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        return $('span[itemprop="productID"]:first').length && (e = $('span[itemprop="productID"]:first').text().trim()), e
                    },
                    injectCta: function (e) {
                        window.innerWidth > 767 ? ($("#thumbnails .thumb-list .thumb").length > 0 && "hidden" === $("#thumbnails .thumb-list").css("visibility") ? $(".product-primary-image").append('<div class="tangiblee-thumb-th tangiblee-thumb-top tangiblee-cta"><img src="' + e + '"/></div>') : $("#thumbnails .thumb-list").append('<div class="tangiblee-thumb tangiblee-thumb-th"><img src="' + e + '"/></div>'), $(".product-primary-image:first").append('<div class="tangiblee-cn-main tangiblee-th-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>")) : $(".thumb-list.owl-carousel").length && $(".thumb-list.owl-carousel").trigger("add.owl.carousel", ['<div class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></div>"]).trigger("refresh.owl.carousel");
                        var t = '<li class="tangiblee-additional__li tangiblee-additional__wrapper"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><h3 class="tangiblee-additional__title tangiblee-cta">' + i[n].sizeComparison + '</h3><p class="tangiblee-additional__description">' + i[n].whatCanYouFitInYourTumiText + '</p><a href="javascript:void(0)" class="tangiblee-additional__open-link tangiblee-cta">' + i[n].exploreText + "</a>";
                        $(".product-benefit:visible").append(t), $(".product-benefit:visible").length && document.querySelector(".product-benefit").setAttribute("style", "flex-wrap:wrap;-ms-flex-wrap:wrap;"), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".thumb-list .thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $(".close-image-zoom").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $(".product-price:first .price-sales");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "à¸šà¸²à¸—"
                    }
                },
                "kr.tumi.com": {
                    retailer: "kr.tumi.com",
                    ctaText: "ì‚¬ì´ì¦ˆ ë¹„êµ",
                    atcSelector: "#addToCartBtn",
                    sizeComparison: "ì‚¬ì´ì¦ˆ ë¹„êµ ì²´í¬",
                    comparisonToOtherItems: "ë‹¤ë¥¸ ì•„ì´í…œê³¼ ë¹„êµ",
                    openText: "ì—´ê¸°",
                    exploreText: "ì‹¤í–‰í•˜ê¸°",
                    exploreNowText: "ì‹¤í–‰í•˜ê¸°",
                    whatCanYouFitInYourTumiText: "ì‹¤ì œ í¬ê¸°ë¥¼ í™•ì¸í•´ ë³´ì„¸ìš”",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin: 4% 0 0 0; border-left: 1px solid #dedede;font-size:1.4rem; position: relative; text-align: center; color: #222;}.tangiblee-additional__wrapper--single {width: 100%;padding: 10px 0; border-left: none; border-bottom: 2px solid #dedede; border-top: 2px solid #dedede;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: -10px 0 0 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-th{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb-th img{width:100%;height:100%;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}.tangiblee-block {display:flex;justify-content:space-between;align-items:center;text-align:center;border-bottom: 1px solid #ccc!important;}.tangiblee-block__open-link{font-size:12px;}.tangiblee-block__cross-wrap{width:15%;}.tangiblee-block__cross { position:relative;height:19px;width:19px;margin:auto;cursor:pointer;}.tangiblee-block__cross:after,.tangiblee-block__cross:before {position: absolute; content: ""; width:100%; height:3px; background: black; top: 50%;   left: 0;}.tangiblee-block__cross:before {transform: rotate(90deg);}.tangiblee-block__description {font-size: 12px;padding: 0;color: #777;margin: 0;}.tangiblee-block__title{font-size: 14px;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 0 !important;}.tangiblee-additional__wrapper{width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;}.tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {margin: 0 5px 0 0;}}@media(max-width: 768px) {.tangiblee-block__cross-wrap{width:calc(15% - 8px);}.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 5px 20px;} .tangiblee-additional__wrapper--single {width: calc(100% - 50px) !important;} .tangiblee-additional__open-link {margin: 0 30px 0 0 !important;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;}  #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        return $('meta[itemprop="sku"]').length && (e = $('meta[itemprop="sku"]').attr("content")), e
                    },
                    injectCta: function (e) {
                        $(".cntr-product-alternate-items").length ? $(".cntr-product-alternate-items").append('<div class="tangiblee-thumb tangiblee-thumb-cn"><img src="' + e + '"/></div>') : $(".not-smallscreen").append('<div class="tangiblee-thumb-top tangiblee-cta"><img src="' + e + '"/></div>'), $(".alternate-prods-carousel .single-item.slick-slider").length ? $(".alternate-prods-carousel .single-item.slick-slider").slick("slickAdd", '<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>") : $(".alternate-prods-carousel .single-item").append('<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></li>"), $(".not-smallscreen").append('<div class="tangiblee-cn-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>");
                        var t = '<div class="monograming-item tangiblee-block"><div class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + e + '"/></div><div><div class="tangiblee-block__title tangiblee-cta">' + i[n].sizeComparison + '</div><p class="tangiblee-block__description">' + i[n].whatCanYouFitInYourTumiText + '</p><a href="javascript:void(0)" class="tangiblee-block__open-link tangiblee-cta">' + i[n].exploreText + '</a></div><div class="tangiblee-block__cross-wrap"><div class="tangiblee-block__cross tangiblee-cta"></div></div></div>';
                        0 === $(".monogrammin-items .monograming-item").length && $(".monogrammin-items").css("display", "block"), $(".monogrammin-items").append(t), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".cntr-prod-alternate-item").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $("span.icon").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#prod-details .prod-price-availabilty .prod-price");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "$"
                    }
                },
                "staging-asia-samsonite.demandware.net/s/Tumi_KR/": {
                    retailer: "kr.tumi.com",
                    ctaText: "ì‚¬ì´ì¦ˆ ë¹„êµ",
                    atcSelector: ".add-to-cart",
                    sizeComparison: "ì‚¬ì´ì¦ˆ ë¹„êµ ì²´í¬",
                    comparisonToOtherItems: "ë‹¤ë¥¸ ì•„ì´í…œê³¼ ë¹„êµ",
                    openText: "ì—´ê¸°",
                    exploreText: "ì‹¤í–‰í•˜ê¸°",
                    exploreNowText: "ì‹¤í–‰í•˜ê¸°",
                    whatCanYouFitInYourTumiText: "ì‹¤ì œ í¬ê¸°ë¥¼ í™•ì¸í•´ ë³´ì„¸ìš”",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {border-left: 1px solid #dedede;position: relative;}.tangiblee-additional__wrapper--single {width: 100%;border-left: none;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {}.tangiblee-additional__open-link:hover {text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin:0; position: absolute; top: 5px; left: calc(50% - 20px)}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-th{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb-th img{width:100%;height:100%;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}.icreace-block-from-tng{max-width:50%!important;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1200px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .tangiblee-additional__wrapper{flex: 1 1 100% !important;border: 1px solid rgba(0,0,0,0) !important;}.tangiblee-ruler-bg--additional{ top: 2px;position:relative;}}@media(max-width:991px){.icreace-block-from-tng{max-width:100%!important;}.tangiblee-additional-item .icon-img{flex: 0 0 25%;top:-6px!important;}.tangiblee-ruler-bg--additional{left:0;}.tangiblee-additional__open-link{font-size: 0.857rem!important;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 0;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;} #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        return $(".product-detail.product-wrapper").length && (e = $(".product-detail.product-wrapper").attr("data-pid")), e
                    },
                    getSkus: function () {
                        window.varSKUs = [];
                        var e = [],
                            t = $(".attr-color .color-swatchs .attr-item"),
                            i = $(".product-detail.product-wrapper").attr("data-pid").slice(0, -5);
                        if (i && t.length > 1)
                            for (var n = 0; n < t.length; n++) {
                                var a = $(t[n]).find("span").attr("data-attr-value");
                                e.push(i + "-" + a), varSKUs.push(i + "-" + a)
                            } else e = [$(".product-detail.product-wrapper").attr("data-pid")];
                        return e
                    },
                    injectCta: function (t) {
                        if (!$(".tangiblee-additional-item").length || !$(".tangiblee-open-cta").length) {
                            if (window.innerWidth > 767) {
                                if ($(".thumbnail .thumbnail-item").length) {
                                    var a = $(".thumbnail-item:first a").attr("data-hi-res-url"),
                                        o = $(".thumbnail-item:first a").attr("data-large-url");
                                    $(".thumbnail").append('<div class="thumbnail-item tangiblee-open-cta" style="background: #fff"><a href="#" class="thumbnail-image-item tangiblee-thumb" style="background-color: #fff" data-large-url="' + o + '" data-hi-res-url="' + a + '"><img style="max-width:100%" src="' + t + '"/></a></div>')
                                }
                                $(".image-view-section").append('<div class="tangiblee-cn-main tangiblee-th-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div>")
                            } else {
                                var r = $(".product-images-carousel .slick-carousel");
                                r.length && r.slick("addSlide", '<div class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + t + '" /><div style="" class="tangiblee__description"><span><b>' + i[n].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i[n].exploreNowText + "</b></div></div></div></div></div></div>")
                            }
                            var l = '<div class="product-additional-item tangiblee-additional-item"><div class="content"><span class="icon-img" style="height:24px;position:relative;top:-10px;"><div style="display: inline-block;vertical-align:middle;" class="tangiblee-ruler-bg tangiblee-ruler-bg--additional"><img src="' + t + '"/></div></span><span class="info" style="margin-top: 5px;"><span class="info-title tangiblee-cta" style="cursor:pointer;margin:0;">' + i[n].sizeComparison + '</span><span class="info-desc">' + i[n].whatCanYouFitInYourTumiText + '</span></span><span class="explore tangiblee-additional__open-link tangiblee-cta" style="cursor:pointer;font-size:1rem;">' + i[n].exploreText + "</span></div></div>",
                                s = function () {
                                    var t = $(".product-detail-information-content .product-additional>div");
                                    t && 3 === t.length && ($(".product-additional").append(l), $(".tangiblee-additional-item").addClass("luggage-guideline increace-block-from-tng"), $(".product-additional-item.luggage-guideline").addClass("icreace-block-from-tng")), t && 2 === t.length && ($(".product-additional").append(l), $(".tangiblee-additional-item").addClass("luggage-guideline")), t && 1 === t.length && ($(".product-additional").append(l), $(".tangiblee-additional-item").addClass("increace-block-from-tng")), t && 0 === t.length && $(".product-additional").append(l), e.setCtaClickHandler()
                                };
                            e.utils.waitForConditionToMet(function () {
                                return "complete" === document.readyState
                            }, 100).then(function () {
                                s()
                            }).fail(function () {
                                s()
                            }), $(".tangiblee-open-cta").on("click", function () {
                                $(".tangiblee-cn-main").css("display", "flex")
                            }), $(".thumbnail-item:not(.tangiblee-open-cta)").on("click", function () {
                                $(".tangiblee-cn-main").css("display", "none")
                            }), $(".product-thumbnail-images .btn-magify").on("click", function () {
                                $(".tangiblee-cn-main").css("display", "none")
                            })
                        }
                    },
                    getPrice: function () {
                        var e, t = $(".prices .sales .value");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "ì›"
                    }
                },
                "ictdemo-tumi.myshopify.com": {
                    retailer: "ictdemo-tumi.myshopify.com",
                    ctaText: "Compare Size",
                    atcSelector: ".pplr_add_to_cart",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "Open",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-cta--thumb {background: transparent url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%; width: 60px !important; margin: auto;}.tangiblee-button{cursor:pointer;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative; width:100%;}.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px!important;width:100%;padding:0 !important; margin: 10px 0 !important;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-slider-content{z-index:1;direction: ltr;position:absolute;top:0;left:0;width:100%;height:100%;background:rgb(247 247 247); display: flex;flex-direction: column;justify-content: center;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}.hide-item-border[data-pf-type="ProductImageList"] > div[data-active="true"] { border-color: transparent;}.tangiblee-cta--thumb-border{border-style: solid;border-color: #4a90e2;}@media(max-width: 700px) {#tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}',
                    baseInit: function () {
                        var e = $(".tangiblee-button").parents(".sc-pbYdQ").eq(0);
                        e.addClass("tangiblee-cta-box"), e.css("display", "none")
                    },
                    getActiveSku: function () {
                        var e = location.pathname.split("/");
                        return e[e.length - 1]
                    },
                    getSkus: function () {
                        return [i[n].getActiveSku()]
                    },
                    injectCta: function (e) {
                        var t = $(".tangiblee-cta-box");
                        t.css("display", "block"), $(t).find("a").on("click", function (e) {
                            e.preventDefault()
                        });
                        var i = '<div class="tangiblee-cta--thumb"><img src="' + e + '"></div>';
                        $(t).prepend(i), $(".tangiblee-button").addClass("tangiblee-cta")
                    },
                    getPrice: function () {
                        var e;
                        $('[data-product-type="price"]').text();
                        return e
                    },
                    getCurrency: function () {
                        return "â‚±"
                    }
                },
                "default": {
                    retailer: "kr.tumi.com",
                    ctaText: "Compare Size",
                    atcSelector: "#addToCartBtn",
                    sizeComparison: "Size comparison",
                    comparisonToOtherItems: "Comparison to other items",
                    openText: "OPEN",
                    exploreText: "Explore",
                    exploreNowText: "Explore Now",
                    whatCanYouFitInYourTumiText: "What can you fit in your TUMI?",
                    css: '.tangiblee-image-bg{max-width: 450px; max-height: 415px; width: 100%;position:relative;}@media(max-width:600px){.tangiblee-main-image{max-width: 145px !important;}}.tangiblee-additional__wrapper {display: inline-flex; flex-direction: column; justify-content: center; align-items: center; margin: 4% 0 0 0; border-left: 1px solid #dedede;font-size:1.4rem; position: relative; text-align: center; color: #222;}.tangiblee-additional__wrapper--single {width: 100%;padding: 10px 0; border-left: none; border-bottom: 2px solid #dedede; border-top: 2px solid #dedede;}.tangiblee-additional__wrapper--without-top-border {border-top: none;}.tangiblee-additional__open-link {text-decoration: underline;}.tangiblee-additional__open-link:hover {color: #c41e3a !important; text-decoration: underline !important;}.tangiblee-thumb-top{position:absolute;top:10px; left: 10px;width:60px;height:60px;border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;cursor:pointer;}.tangiblee-thumb-top img {width:100%;height:100%;}.tangiblee-ruler-bg {order: 0; background: url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png") no-repeat 0px center / 100% 100%;box-sizing:border-box;padding:0 0 0 32px; margin: 10px auto;max-width:200px;}.tangiblee-ruler-bg--additional {max-width: 40px; padding: 0 0 0 10px; margin: -10px 0 0 0;}.tangiblee-ruler-bg--additional img {max-width: 32px !important; margin: 0 !important;}.tangiblee-thumb-th{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb-th img{width:100%;height:100%;}.tangiblee-thumb-cn{display:inline-block;overflow:hidden;margin-top:10px;margin-left:10px;border:1px solid #ebebeb;width:45px;height:45px;cursor:pointer;}.tangiblee-thumb img{width:100%;height:100%;}.tangiblee-thumb-cn img{width:100%;height:100%;}.tangiblee-cn-main{position:absolute;top:0;left:0;width:100%;height:100%;background: #f8f8f8;display:none;flex-direction:column;justify-content:center;align-items: center;}.tangiblee-slider-content{position:absolute;top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,.03); display: flex;flex-direction: column;justify-content: center;}.tangiblee-main-slider-wrapper{padding-top:100%;position:relative;}.tangiblee__open-button {order: 2; width: fit-content; height: 30px; padding: 0 30px; margin: 10px auto; background: #c41e3a; color: #fff; font-size: 13px; text-align: center; line-height: 30px; cursor: pointer;}.tangiblee__open-button:hover {background: #98172d;}.tangiblee-main-image{display:block;cursor:pointer;max-width:200px;width:100%;padding:0 !important; margin: 10px 0 !important;}.tangiblee-thumb{border: 1px solid #eee; background: #f8f8f8 url(//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/ruler2.png) no-repeat 0px center / 80% 60%;box-sizing: border-box;padding: 7px;}.tangiblee__description {order: 1; text-align: center;font-size: 16px; letter-spacing: -0.6px;}.tangiblee__description span:nth-child(1){margin-right: 5px;}.tangiblee-wrap{padding: 10px 0;}.tangiblee-custom-iframe-wrapper{position: absolute;top: 0; right: -100%; width: 100%; height: 100%; max-width: 510px; transition: .5s;}.tangiblee-close-btn{position: absolute;right: 10px; top:17px; width: 22px; height:22px;z-index: 2;cursor:pointer;}.tangiblee-close-btn:after{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(-45deg);position:absolute;top:9px;left:0;}.tangiblee-close-btn:before{content:"";display:block; width: 100%; height: 1px;background: black;transform:rotate(45deg);position:absolute;top:9px;left:0;}.tangiblee-custom-overlay{position: fixed; top: 0; right: -105%; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: -100000000;}#tng-logo-wrapper{position:absolute;right: 523px;top:calc(100% - 50px);z-index: 5;}@media(max-width: 1279px) {.tangiblee-thumb-cn{margin:0 3.7% 0 0;} .tangiblee-additional__description {display: none;} .monogrammin-items .items-link {width: 100% !important;} .tangiblee-additional__open-link {margin: 0 !important;}.tangiblee-additional__wrapper{width: 100%!important; flex-direction: row; justify-content: flex-start; padding: 5px 0; margin: 0; border-left: none; border-bottom: 2px solid #dedede;}.tangiblee-additional__open-link {position: absolute; top: auto; right: 0;} .tangiblee-ruler-bg--additional {margin: 0 5px 0 0;}}@media(max-width: 768px) {.tangiblee-slider-content-cn{padding:20px;}.tangiblee-main-image-cn{max-width:100px!important;} .tangiblee-additional__wrapper {padding: 5px 20px;} .tangiblee-additional__wrapper--single {width: calc(100% - 50px) !important;} .tangiblee-additional__open-link {margin: 0 30px 0 0 !important;} #contents .serviceInfo {flex-direction: column;}@media(max-width: 700px) {.tangiblee-slide--my-sg-au {right:0;}  #tng-logo-wrapper{position:absolute;right: 0; top: 0; width: 100%; max-width: 510px;}  #tng-logo-wrapper div {margin: 0 auto;} .tangiblee-custom-iframe-wrapper{padding-top: 40px;box-sizing: border-box;} .tangiblee-close-btn{top: 57px;}}@media(max-width: 650px) {.tangiblee-iframe{padding:0 !important}}@media(max-width: 640px) {.mono-parent1>div {width: 100% !important;}',
                    getActiveSku: function () {
                        var e;
                        return $('meta[itemprop="sku"]').length && (e = $('meta[itemprop="sku"]').attr("content")), e
                    },
                    injectCta: function (e) {
                        $(".cntr-product-alternate-items").length ? $(".cntr-product-alternate-items").append('<div class="tangiblee-thumb tangiblee-thumb-cn"><img src="' + e + '"/></div>') : $(".not-smallscreen").append('<div class="tangiblee-thumb-top tangiblee-cta"><img src="' + e + '"/></div>'), $(".alternate-prods-carousel .single-item.slick-slider").length ? $(".alternate-prods-carousel .single-item.slick-slider").slick("slickAdd", '<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i["default"].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i["default"].exploreNowText + "</b></div></div></div></div></div></li>") : $(".alternate-prods-carousel .single-item").append('<li class="tangiblee-slick-item alt-img-slider"><div class="tangiblee-main-slider-wrapper"><div class="tangiblee-slider-content tangiblee-slider-content-cn"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i["default"].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i["default"].exploreNowText + "</b></div></div></div></div></div></li>"), $(".not-smallscreen").append('<div class="tangiblee-cn-main"><div class="tangiblee-image-bg" style="margin:0 auto;"><img style="width:100%;padding:0;" class="" src="https://cdn.tangiblee.com/tangiblee-static/img/tumi-main-image-background.jpg" /><div style="position:absolute;width:100%;height:100%;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;" class="tangiblee-image-bg-inner"><img style="transform: translateX(40%);" class="tangiblee-main-image tangiblee-cta" src="' + e + '" /><div style="" class="tangiblee__description"><span><b>' + i["default"].whatCanYouFitInYourTumiText + '</b></span></div><div style="" class="tangiblee-cta tangiblee__open-button"><b>' + i["default"].exploreNowText + "</b></div></div></div></div>"), $(".tangiblee-thumb").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "flex")
                        }), $(".cntr-prod-alternate-item, .prev-icon-carousel-alternate, .next-icon-carousel-alternate").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        }), $("span.icon").on("click", function () {
                            $(".tangiblee-cn-main").css("display", "none")
                        })
                    },
                    getPrice: function () {
                        var e, t = $("#prod-details .prod-price-availabilty .prod-price");
                        return t.length && (e = t.text().trim().replace(/[^0-9.,]/g, "")), e
                    },
                    getCurrency: function () {
                        return "$"
                    }
                }
            },
            n = window.location.host;
        "test-tumi.bb-f.net" !== n && "preview-tumi.bb-f.net" !== n || (n = "www.tumi.co.jp"), "www.tumi-hk.com" === n && window.location.href && window.location.href.toLowerCase().indexOf("www.tumi-hk.com/zh/") > -1 && (n = "www.tumi-hk.com/zh/"), "www.tumi.co.th" === n && window.location.href && window.location.href.toLowerCase().indexOf("www.tumi.co.th/th/") > -1 && (n = "www.tumi.co.th/th/"), "www.tumi.co.th" === n && window.location.href && window.location.href.toLowerCase().indexOf("www.tumi.co.th/on/") > -1 && (n = "www.tumi.co.th/th/"), window.location.href && window.location.href.toLowerCase().indexOf("stage.tumi.cn") > -1 && (n = "www.tumi.cn"), window.location.href && window.location.href.toLowerCase().indexOf("dev.tumi.cn") > -1 && (n = "www.tumi.cn"), window.location.href && window.location.href.toLowerCase().indexOf("dev.tumi-hk.com") > -1 && (n = "www.tumi-hk.com"), window.location.href && window.location.href.toLowerCase().indexOf("dev.tumi-hk.com/zh/") > -1 && (n = "www.tumi-hk.com/zh/"), window.location.href && window.location.href.toLowerCase().indexOf("stage.tumi-hk.com") > -1 && (n = "www.tumi-hk.com"), window.location.href && window.location.href.toLowerCase().indexOf("stage.tumi-hk.com/zh/") > -1 && (n = "www.tumi-hk.com/zh/"), window.location.href && window.location.href.toLowerCase().indexOf("staging-asia-samsonite.demandware.net") > -1 && (n = "www.tumi.co.th/th/"), window.location.href && window.location.href.toLowerCase().indexOf("staging-asia-samsonite.demandware.net/s/tumi_kr/") > -1 && (n = "staging-asia-samsonite.demandware.net/s/Tumi_KR/"), window.location.href && window.location.href.toLowerCase().indexOf("tumikorea.co.kr") > -1 && (n = "staging-asia-samsonite.demandware.net/s/Tumi_KR/");
        var a, o, r, l, s, d, c, g, p, u, m, b = i[n] || i["default"];
        b.baseInit && "function" == typeof b.baseInit && b.baseInit(), a = b.retailer, o = b.ctaText, r = b.atcSelector, l = b.getActiveSku, s = b.selectorPointForInjectCta, d = b.injectCta, c = b.getPrice, g = b.getCurrency, p = b.sizeComparison, u = b.comparisonToOtherItems, m = i.openText, getCustomSkus = b.getSkus, e.iframe.messaging.addMessageListener({
            type: "add_to_cart",
            listener: function () {
                $(".tangiblee-custom-iframe-wrapper").css("right", "-100%"), $(".tangiblee-custom-overlay").css({
                    right: "-100%",
                    zIndex: -999999
                })
            }
        });
        var h = function () {
                var e = l();
                return e && e.toLowerCase && (e = e.toLowerCase()), e
            },
            f = function () {
                if (getCustomSkus) return getCustomSkus();
                var e = h();
                return [e]
            };
        ! function () {
            var e = b.css,
                t = document.createElement("style");
            t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
        }();
        var x = function (t, i) {
                return new e.promise(function (t) {
                    var a = $(".tangiblee-cta");
                    if (a.length) "staging-asia-samsonite.demandware.net/s/Tumi_KR/" === n && d(i), e.setCtaClickHandler();
                    else {
                        d(i);
                        var o = navigator.userAgent.toLowerCase(),
                            r = /mozilla/.test(o) && !/firefox/.test(o) && !/chrome/.test(o) && !/safari/.test(o) && !/opera/.test(o) || /msie/.test(o);
                        r && ($(".tangiblee-ruler-bg").css("background-image", 'url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/rulerIE.png")'), $(".tangiblee-thumb").css("background-image", 'url("//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/rulerIE.png")')), $("body").on("click", ".tangiblee-cta", function () {
                            $(".tangiblee-custom-overlay").css({
                                right: 0,
                                zIndex: 999999
                            }), $(".tangiblee-custom-iframe-wrapper").length && $(".tangiblee-custom-iframe-wrapper").css("right", 0)
                        }), t("tangiblee-cta")
                    }
                })
            },
            w = function () {
                return c()
            },
            v = function () {
                return g()
            };
        window.tangiblee = window.tangiblee || function () {
            (tangiblee.q = tangiblee.q || []).push(arguments)
        }, tangiblee("domain", a), tangiblee("useCookies", !0), tangiblee("showCTA", x), tangiblee("activeATC", r), tangiblee("container", ".tangiblee-custom-iframe-wrapper"), tangiblee("stopPropagationOnCtaClick", !1), tangiblee("preventDefaultOnCtaClick", !1);
        var y = "//cdn.tangiblee.com/integration/3.1/managed/www.tumi.com/revision_1/variation_original/img/";
        tangiblee("categoryThumbsDefault", {
            Luggage: y + "luggage.png",
            Backpacks: y + "backpacks.png",
            "default": y + "laptop.png"
        });
        var _ = function () {
            tangiblee("activeSKU", h()), tangiblee("activePrice", w()), tangiblee("activeCurrency", v()), tangiblee("startOnSKUs", f())
        };
        e.utils.ready(function () {
            $(document).ready(function () {
                $("body").append('<div class="tangiblee-custom-overlay tangiblee-modal-overlay"><div class="tangiblee-close-btn"></div><a id="tng-logo-wrapper" rel="nofollow noopener" target="_blank" href="https://tangiblee.com/"><div style="background-image: url(https://cdn.tangiblee.com/tangiblee-static-img/powered-by-full-logo-horizontal-inverted.svg); height:35px; width: 155px; background-size: contain;  background-repeat: no-repeat;"></div></a><div class="tangiblee-custom-iframe-wrapper"></div></div>'), $(".tangiblee-close-btn").on("click", function () {
                    $(".tangiblee-custom-iframe-wrapper").css("right", "-100%"), $(".tangiblee-custom-overlay").css({
                        right: "-100%",
                        zIndex: -999999
                    })
                }), $(".tangiblee-custom-overlay").on("click", function () {
                    $(".tangiblee-custom-iframe-wrapper").css("right", "-100%"), $(".tangiblee-custom-overlay").css({
                        right: "-100%",
                        zIndex: -999999
                    })
                }), "staging-asia-samsonite.demandware.net/s/Tumi_KR/" === n && $(".attr-item").on("click", function () {
                    var e = $(this).find("a").attr("data-url");
                    $.ajax({
                        url: e
                    }).done(function (e) {
                        $(".tangiblee-additional-item").remove();
                        var t = $(".icreace-block-from-tng");
                        t.length && t.removeClass("icreace-block-from-tng"), e && e.product && setTimeout(function () {
                            tangiblee("activeSKU", e.product.id), e.product.price && e.product.price.sales && tangiblee("activePrice", e.product.price.sales.decimalPrice)
                        }, 1500)
                    }).fail(function () {
                        $(".tangiblee-additional-item").remove();
                        var e = $(".icreace-block-from-tng");
                        e.length && e.removeClass("icreace-block-from-tng")
                    })
                })
            }), "www.tumi.co.jp" !== n || $(".photoSlide.slick-slider:visible").length ? _() : window.onload = function () {
                _()
            }
        }), window.tangibleeAnalytics = window.tangibleeAnalytics || function () {
            (window.tangibleeAnalytics.q = window.tangibleeAnalytics.q || []).push(arguments)
        }, window.tangibleeAnalytics("setAnalyticsPlugin", "GoogleAnalytics", {
            trackingId: "UA-61907198-46"
        }), window.tangibleeAnalytics("setAnalyticsPlugin", "InfoPortalAnalytics", {});
        var k = {
            startOnSKUs: function (t) {
                var i = function (e) {
                        for (var t, i = Object.keys(e), n = i.length, a = {}; n--;) t = i[n], a[t.toLowerCase()] = e[t];
                        return a
                    },
                    n = function (t) {
                        if (t) {
                            if ("string" == typeof t) e.SKUs.push(t);
                            else if (t.constructor === Array && t.length > 0)
                                for (var n = 0; n < t.length; n++) t[n] && "string" == typeof t[n] && e.SKUs.indexOf(t[n]) === -1 && e.SKUs.push(t[n]);
                            e.SKUs && 0 !== e.SKUs.length && (1 === e.SKUs.length && tangiblee("activeSKU", e.SKUs[0]), e.thumbs = {}, e.validateSKUs().then(function (t) {
                                e.onSKUsValidated(t.exists), e.translations = t.translations, e.products = t.products, e.isVisibleProduct = t.hide !== !0, e.thumbs = i(t.cta_urls);
                                var n = [];
                                for (var a in t.products) t.exists[a] && n.push(t.products[a].id);
                                if (n.length) {
                                    for (var o = 0; o < n.length; o++) e.validSKUs.indexOf(n[o]) === -1 && e.validSKUs.push(n[o]);
                                    if (e.product = e.products[e.activeSKU], n.indexOf(e.activeSKU) > -1) {
                                        e.iframe.update();
                                        var r = function (t) {
                                                t && (e.onCTAShown && e.onCTAShown(), e.setCtaClickHandler(), "onActiveSKUChange" === e.loadIframe && e.iframe.inject()), window.tangibleeAnalytics("setProduct", e.product);
                                                var i = n.slice().sort(function (t) {
                                                    return t == e.activeSKU ? -1 : 0
                                                });
                                                window.tangibleeAnalytics("trackImpression", i)
                                            },
                                            l = e.showCTA(e.activeSKU, e.getThumb());
                                        l && l.then ? l.then(function (t) {
                                            e.ctaCssClass = t, r(t)
                                        }) : (e.ctaCssClass = l, r(l))
                                    } else e.hideCTA()
                                } else e.hideCTA()
                            })["catch"](function (e) {
                                e && TrackJS.isInstalled() && TrackJS.track(e.message)
                            }))
                        }
                    };
                t && t.then ? t.then(function (e) {
                    n(e)
                }) : n(t)
            },
            domain: function (t) {
                e.domain = t, window.tangibleeAnalytics("setRetailer", t)
            },
            useCookies: function (t) {
                return "undefined" == typeof t ? e.useCookies : void(e.useCookies = t)
            },
            container: function (t) {
                e.container = t
            },
            require: function (t, i) {
                if (t) {
                    for (var n = [], a = 0; a < t.length; a++) e[t[a]] && n.push(e[t[a]]);
                    n.length > 0 && i.apply(this, n)
                }
            },
            showCTA: function (t) {
                e.showCTA = t
            },
            hideCTA: function (t) {
                e.hideCTA = t
            },
            setCtaClickHandler: function () {
                e.setCtaClickHandler()
            },
            widgetVersion: function (t) {
                var i = ["v3", "v2"];
                i.indexOf(t) > -1 && (e.widgetVersion = t)
            },
            activeSKU: function (t) {
                return t && t.toLowerCase && (e.activeSKU = t.toLowerCase(), e.updateSku()), e.activeSKU
            },
            activeLocale: function (t) {
                e.activeLocale = t, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update()
            },
            activePrice: function (t) {
                e.activePrice = t, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update()
            },
            activeSalePrice: function (t) {
                e.activeSalePrice = t, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update()
            },
            activateMultiVariations: function () {
                e.useMultiVariations = !0
            },
            variationSKUs: function (t) {
                return t ? (e.variationSKUs = t, void(e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update())) : e.variationSKUs
            },
            switchWidgetVariation: function (t) {
                var i = t.sku;
                if (e.validSKUs.indexOf(i) > -1 && e.variationSKUs.indexOf(i) > -1) {
                    var n = e.showCTA(i, e.getThumb(i));
                    n && n.then ? n.then(function (t) {
                        e.ctaCssClass = t, e.setCtaClickHandler()
                    }) : (e.ctaCssClass = n, e.setCtaClickHandler()), e.iframe.switchWidgetVariation(t), window.tangibleeAnalytics("trackImpression", [i])
                } else e.hideCTA(i), e.modal.close(e.modal.isUsed())
            },
            activeCurrency: function (t) {
                e.activeCurrency = t, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update()
            },
            activeATC: function (t) {
                e.activeATC = t
            },
            onSKUsValidated: function (t) {
                e.onSKUsValidated = t
            },
            onCTAShown: function (t) {
                e.onCTAShown = t
            },
            onCtaClicked: function (t) {
                e.onCtaClicked = t
            },
            onModalOpened: function (t) {
                e.onModalOpened = t
            },
            onIframeLoaded: function (t) {
                e.onIframeLoaded = t
            },
            onUserInteracted: function (t) {
                e.onUserInteracted = t
            },
            onModalClosed: function (t) {
                e.onModalClosed = t
            },
            onKeepAlive: function (t) {
                e.onKeepAlive = t
            },
            onATCClickInWidget: function (t) {
                e.onATCClickInWidget = t
            },
            validateSKUs: function (t, i) {
                var n = function (e) {
                        for (var t, i = Object.keys(e), n = i.length, a = {}; n--;) t = i[n], a[t.toLowerCase()] = e[t];
                        return a
                    },
                    a = function (t) {
                        if (t) {
                            if ("string" == typeof t) e.SKUs.push(t);
                            else if (t.constructor === Array && t.length > 0)
                                for (var a = 0; a < t.length; a++) t[a] && "string" == typeof t[a] && e.SKUs.indexOf(t[a]) === -1 && e.SKUs.push(t[a]);
                            e.SKUs && 0 !== e.SKUs.length && (1 === e.SKUs.length && tangiblee("activeSKU", e.SKUs[0]), e.thumbs = {}, e.validateSKUs().then(function (t) {
                                e.onSKUsValidated(t.exists), e.translations = t.translations, e.products = t.products, e.isVisibleProduct = t.hide !== !0, e.thumbs = n(t.cta_urls);
                                var a = [];
                                for (var o in t.products) t.exists[o] && a.push(t.products[o].id);
                                a.length ? (e.validSKUs = a, e.product = e.products[e.activeSKU], i()) : e.hideCTA()
                            })["catch"](function (e) {
                                e && TrackJS.isInstalled() && TrackJS.track(e.message)
                            }))
                        }
                    };
                t.then ? t.then(function (e) {
                    a(e)
                }) : a(t)
            },
            activateABTest: function () {
                var t = e.validSKUs;
                if (t.length && t.indexOf(e.activeSKU) > -1) {
                    e.iframe.update();
                    var i = function (i) {
                            i && (e.onCTAShown && e.onCTAShown(), e.setCtaClickHandler(), "onActiveSKUChange" === e.loadIframe && e.iframe.inject()), window.tangibleeAnalytics("setProduct", e.product);
                            var n = t.slice().sort(function (t) {
                                return t == e.activeSKU ? -1 : 0
                            });
                            window.tangibleeAnalytics("trackImpression", n)
                        },
                        n = e.showCTA(e.activeSKU, e.thumbs[e.product.id]);
                    n && n.then ? n.then(function (t) {
                        e.ctaCssClass = t, i(t)
                    }) : (e.ctaCssClass = n, i(n))
                } else e.hideCTA()
            },
            preventDefaultOnCtaClick: function (t) {
                e.preventDefaultOnCtaClick = t
            },
            stopPropagationOnCtaClick: function (t) {
                e.stopPropagationOnCtaClick = t
            },
            useClickEventInsteadMousedown: function (t) {
                e.useClickEventInsteadMousedown = t
            },
            availableModes: function (t) {
                t && Array.prototype.isPrototypeOf(t) && (e.availableModes = t, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update())
            },
            categoryThumbsDefault: function (t) {
                e.categoryThumbsDefault = t
            },
            setCustomIframeSrcAttributes: function (t) {
                var i = [],
                    n = function (e) {
                        return e.toString().trim().replace(/[^0-9A-z]/g, "")
                    };
                t instanceof Array && t.forEach(function (e) {
                    e.key && e.value && i.push({
                        key: n(e.key),
                        value: encodeURI(e.value.toString())
                    })
                }), e.customIframeSrcAttributes = i, e.iframe.exists() && e.activeSKU && e.validSKUs.indexOf(e.activeSKU) > -1 && e.iframe.update()
            }
        };
        if (Math.random() < .005 && TrackJS.install({
                token: "361b2d56afe74d42bc4f2b449e00b39a",
                application: "integration-scripts-31",
                console: {
                    enabled: !1
                },
                callback: {
                    enabled: !1
                },
                network: {
                    enabled: !1
                },
                visitor: {
                    enabled: !1
                },
                window: {
                    enabled: !1
                }
            }), !window.tangibleeScriptLoaded) {
            window.tangibleeScriptLoaded = !0;
            var C = window.tangiblee && window.tangiblee.q || [];
            window.tangiblee = function () {
                try {
                    for (var e = arguments[0], t = [], i = 1; i < arguments.length; i++) t.push(arguments[i]);
                    return k[e].apply(this, t)
                } catch (n) {
                    n && TrackJS.isInstalled() && TrackJS.track(n.message)
                }
            };
            for (var T = 0; T < C.length; T++) window.tangiblee.apply(this, C[T]);
            e.version = "3.1.1.116", e.timeOfInit = new Date, e.iframe.messaging.startListening()
        }! function () {
            var e = {
                config: {
                    variation: "Tangiblee ON",
                    retailer: "www.tangiblee.com",
                    parseOn: !1,
                    trackOn: !1,
                    orderParser: !1,
                    useCookies: "function" != typeof tangiblee || tangiblee("useCookies"),
                    cookieUserKey: "tangiblee:widget:user"
                },
                state: {
                    userId: !1,
                    plugins: {},
                    activatedPlugins: [],
                    timeOfInit: new Date
                },
                mailBox: {}
            };
            e.utils = {}, e.utils.storage = {
                    getCookie: function (e) {
                        var t, i, n = e + "=",
                            a = document.cookie.split(";");
                        for (t = 0; t < a.length; t++) {
                            for (i = a[t];
                                " " === i.charAt(0);) i = i.substring(1);
                            if (0 === i.indexOf(n)) return i.substring(n.length, i.length)
                        }
                        return ""
                    },
                    setCookie: function (e, t, i) {
                        var n = new Date;
                        n.setTime(n.getTime() + 24 * (i || 365) * 60 * 60 * 1e3);
                        var a = "expires=" + n.toUTCString();
                        document.cookie = e + "=" + t + ";" + a + ";path=/"
                    },
                    setLS: function (e, t) {
                        var i = "object" == typeof t ? JSON.stringify(t) : t;
                        if (i.length > 0) try {
                            return localStorage.setItem(e, i), !0
                        } catch (n) {
                            return !1
                        }
                        return !1
                    },
                    getLS: function (e) {
                        try {
                            var t = localStorage.getItem(e);
                            return JSON.parse(t)
                        } catch (i) {
                            return !1
                        }
                    },
                    removeLS: function (e) {
                        try {
                            return localStorage.removeItem(e), !0
                        } catch (t) {
                            return !1
                        }
                    }
                }, e.utils.getParam = function (e) {
                    var t = function () {
                            for (var e, t, i, n = {}, a = window.location.search.substring(1).split("&"), o = 0; o < a.length; o++) e = a[o], t = e.split("="), i = {
                                key: t[0],
                                value: t[1]
                            }, i.key && (n[i.key] = i.value || "");
                            return n
                        },
                        i = t();
                    return !!i[e] && decodeURI(i[e])
                }, e.utils.pageChecker = function () {
                    var t = function (e) {
                        if (!window.location || !window.location.href) return !1;
                        var t, i, n;
                        for (t = 0; t < e.length; t++)
                            if (i = e[t], n = !1, n = "function" == typeof i ? i() : "function" == typeof i.test ? i.test(window.location.href) : window.location.href.toLowerCase().indexOf(i.toString().toLowerCase()) > 0) return !0;
                        return !1
                    };
                    return {
                        isParseRevenuePage: function () {
                            return !!e.config.parseOn && t(e.config.parseOn)
                        },
                        isTrackRevenuePage: function () {
                            return !!e.config.trackOn && t(e.config.trackOn)
                        }
                    }
                }(), e.utils.transferCookies = function () {
                    var t = e.config.cookieUserKey,
                        i = e.utils.getParam(encodeURIComponent(t));
                    i && e.utils.storage.setCookie(t, i)
                }, e.utils.http = {
                    fetch: function (e, t, i, n, a) {
                        try {
                            var o = new XMLHttpRequest;
                            o.open(t, e, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.setRequestHeader("Content-Type", "application/json"), o.onreadystatechange = function () {
                                o.readyState > 3 && o.status >= 200 && o.status < 400 && n && n(o.responseText.length && JSON.parse(o.responseText))
                            }, o.onerror = function () {
                                a && a(o.statusText)
                            }, o.send(i)
                        } catch (r) {
                            a && a(r)
                        }
                    }
                }, e.utils.waitForConditionToMet = function (e, t) {
                    t = t || 500;
                    var i, n = 0,
                        a = function () {};
                    return {
                        then: function (o) {
                            return function r() {
                                e() ? (o(), "undefined" != typeof i && clearTimeout(i)) : n++ > t ? (a(), "undefined" != typeof i && clearTimeout(i)) : i = setTimeout(r, 100)
                            }(), {
                                fail: function (e) {
                                    a = e
                                }
                            }
                        }
                    }
                },
                function () {
                    var t = "ConvertAnalytics";
                    e.state.plugins[t] = function (t, i) {
                        var n = !1;
                        t = t || {};
                        var a = {
                            convertPDPImpression: !1,
                            convertWidgetOpenGoal: !1,
                            convertATCGoal: !1,
                            convertATCWidgetGoal: !1,
                            convertConversionGoal: !1,
                            convertRevenueGoal: !1
                        };
                        for (var o in a) t[o] = "undefined" != typeof t[o] ? t[o] : a[o];
                        var r = function () {
                            if (e.mailBox[i])
                                for (var t = 0; t < e.mailBox[i].length; t++) e.mailBox[i][t]();
                            n = !0, e.mailBox[i] = []
                        };
                        r();
                        var l = function (e) {
                            window._conv_q = window._conv_q || [], window._conv_q.push(["triggerConversion", e])
                        };
                        return {
                            _unique_id: t._unique_id,
                            isReady: function () {
                                return n
                            },
                            setExperiment: function () {
                                return !1
                            },
                            trackImpression: function () {
                                t.convertPDPImpression && l(t.convertPDPImpression)
                            },
                            trackWidgetOpen: function () {
                                t.convertWidgetOpenGoal && l(t.convertWidgetOpenGoal)
                            },
                            trackWidgetClose: function () {
                                return !1
                            },
                            trackATCClick: function () {
                                t.convertATCGoal && l(t.convertATCGoal)
                            },
                            trackATCWidgetClick: function () {
                                t.convertATCWidgetGoal && l(t.convertATCWidgetGoal)
                            },
                            trackOrder: function (e) {
                                t.convertConversionGoal || l(t.convertConversionGoal), t.convertRevenueGoal && e && 0 !== e.total && (window._conv_q = window._conv_q || [], e.id = e.id || (new Date).getTime(), window._conv_q.push(["sendRevenue", e.id, e.total, e.items.length, t.convertRevenueGoal]))
                            },
                            trackCustomEvent: function () {
                                return !1
                            }
                        }
                    }
                }(),
                function () {
                    var t = "DataLayerAnalytics";
                    e.state.plugins[t] = function (t, i) {
                        var n = !1;
                        t = t || {};
                        var a = {};
                        for (var o in a) t[o] = "undefined" != typeof t[o] ? t[o] : a[o];
                        var r = function () {
                            if (e.mailBox[i])
                                for (var t = 0; t < e.mailBox[i].length; t++) e.mailBox[i][t]();
                            n = !0, e.mailBox[i] = []
                        };
                        return r(), {
                            _unique_id: t._unique_id,
                            isReady: function () {
                                return n
                            },
                            setExperiment: function () {
                                return !1
                            },
                            trackImpression: function (e) {
                                dataLayer && dataLayer.push({
                                    event: "Tangiblee Impression"
                                })
                            },
                            trackWidgetOpen: function () {
                                if (dataLayer) {
                                    var e = (new Date).toISOString().substring(0, 10),
                                        t = "Widget Opened " + e;
                                    dataLayer.push({
                                        TangibleeOpen: t
                                    }), dataLayer.push({
                                        event: "Tangiblee Open"
                                    })
                                }
                            },
                            trackWidgetClose: function () {
                                return !1
                            },
                            trackATCClick: function () {
                                return !1
                            },
                            trackATCWidgetClick: function () {
                                dataLayer && dataLayer.push({
                                    event: "Tangiblee ATC"
                                })
                            },
                            trackOrder: function (e) {
                                return !1
                            },
                            trackCustomEvent: function () {
                                return !1
                            }
                        }
                    }
                }(),
                function () {
                    var t = "GoogleAnalytics",
                        i = "GoogleOptimize";
                    e.state.plugins[t] = function (t, n) {
                        var a = !1;
                        t = t || {};
                        var o = {
                            trackingId: !1,
                            inPageAnalytics: !1,
                            trackerName: "tangiblee",
                            useCustomerTrackingId: !1,
                            googleAnalyticsObject: !1,
                            ecommerceTracking: !0,
                            enhancedEcommerce: !1,
                            runExperiment: !1,
                            forceGaScriptInjecting: !1,
                            customTangibleeDimension: 1,
                            customWidgetDimension: 2,
                            customWidgetSessionDimension: 3,
                            customTangibleeSessionDimension: 4,
                            customTangibleeUserDimension: 5
                        };
                        for (var r in o) t[r] = "undefined" != typeof t[r] ? t[r] : o[r];
                        var l = "",
                            s = function (e) {
                                var t = new Date,
                                    i = t.getFullYear(),
                                    n = t.getMonth() + 1,
                                    a = t.getDate(),
                                    o = t.getHours(),
                                    r = t.getMinutes(),
                                    l = t.getSeconds(),
                                    s = Math.floor(t.getMilliseconds() / 100);
                                return "" + e + "-" + i + "-" + n + "-" + a + "T" + o + ":" + r + ":" + l + ":" + s
                            },
                            d = function () {
                                return "function" == typeof t.googleAnalyticsObject ? t.googleAnalyticsObject() : window[t.googleAnalyticsObject || "ga"]
                            },
                            c = function (e) {
                                if (t.forceGaScriptInjecting && "function" != typeof t.googleAnalyticsObject && !d()) {
                                    window[t.googleAnalyticsObject || "ga"] = function () {
                                        (ga.q = ga.q || []).push(arguments)
                                    }, ga.l = +new Date;
                                    var i = document.createElement("script"),
                                        n = document.getElementsByTagName("script")[0];
                                    return i.async = 1, i.src = "https://www.google-analytics.com/analytics.js", i.onload = function () {
                                        e()
                                    }, void n.parentNode.insertBefore(i, n)
                                }
                                if (d()) e();
                                else var a = setInterval(function () {
                                    d() && (clearInterval(a), e())
                                }, 500)
                            },
                            g = function () {
                                if (l = "" === t.trackerName ? "" : t.trackerName + ".", !t.inPageAnalytics) {
                                    var i = {
                                        name: t.trackerName,
                                        cookieDomain: t.useCustomerTrackingId ? "auto" : document.location.hostname
                                    };
                                    t.useCustomerTrackingId || (i.cookieName = "_ga_tng", i.cookieExpires = 63072e3,
                                        e.state.userId && (i.clientId = e.state.userId)), d()("create", t.trackingId, i), d()(l + "set", "anonymizeIp", !0)
                                }
                                t.ecommerceTracking && (t.enhancedEcommerce ? d()(l + "require", "ec") : d()(l + "require", "ecommerce"))
                            },
                            p = function (e) {
                                d()(l + "require", e.optimizeContainerId);
                                var t = e.customDataLayerObject || window.dataLayer || [],
                                    n = function () {
                                        t.push(arguments)
                                    },
                                    a = function (t) {
                                        e.onExperimentReady(i, t)
                                    };
                                n("event", "optimize.callback", {
                                    name: e.optimizeExperimentId,
                                    callback: a
                                })
                            },
                            u = function (e, t, i, n, a) {
                                var o = !a;
                                d()(l + "send", "event", e, t, i, n, {
                                    nonInteraction: o
                                })
                            },
                            m = function (e) {
                                for (var t = "", i = 0; i < e.length; i++) {
                                    var n = e[i];
                                    if (n.slot) {
                                        var a = n.slot,
                                            o = n.dimensionValue;
                                        d()(l + "set", "dimension" + a, o), t += "dimension" + a + "-" + o + ";"
                                    }
                                }
                                u("caller.js", "Set Custom Dimension", t, 1, !1)
                            },
                            b = function () {
                                c(function () {
                                    if (g(), e.mailBox[n])
                                        for (var t = 0; t < e.mailBox[n].length; t++) e.mailBox[n][t]();
                                    a = !0, e.mailBox[n] = []
                                })
                            };
                        return b(), {
                            _unique_id: t._unique_id,
                            isReady: function () {
                                return a
                            },
                            setExperiment: function (e) {
                                e.provider === i && t.runExperiment && p(e)
                            },
                            trackImpression: function () {
                                t.useCustomerTrackingId || d()(l + "send", "pageview"), m([{
                                    slot: t.customTangibleeDimension,
                                    dimensionValue: e.config.variation
                                }, {
                                    slot: t.customTangibleeSessionDimension,
                                    dimensionValue: e.config.variation
                                }, {
                                    slot: t.customTangibleeUserDimension,
                                    dimensionValue: e.state.userId
                                }]), u(e.config.product.category + "-" + e.config.product.categoryId, "Client Impression", e.state.userId, 1, !1)
                            },
                            trackWidgetOpen: function () {
                                var i = (new Date).toISOString().substring(0, 10),
                                    n = "Widget Opened " + i;
                                m([{
                                    slot: t.customWidgetDimension,
                                    dimensionValue: n
                                }, {
                                    slot: t.customWidgetSessionDimension,
                                    dimensionValue: n
                                }]), u(e.config.product.category + "-" + e.config.product.categoryId, "Client Open", e.config.product.label, 1, !0)
                            },
                            trackWidgetClose: function () {
                                return !1
                            },
                            trackATCClick: function () {
                                u(e.config.product.category + "-" + e.config.product.categoryId, "ATC", e.config.product.label, 1, !0)
                            },
                            trackATCWidgetClick: function () {
                                u(e.config.product.category + "-" + e.config.product.categoryId, "ATC Widget", e.config.product.labell, 1, !0)
                            },
                            trackOrder: function (i) {
                                if (!t.inPageAnalytics) {
                                    d()(l + "send", "pageview"), i.id = i.id || s(e.config.variation);
                                    var n, a;
                                    if (t.enhancedEcommerce) {
                                        for (d()(l + "set", "currencyCode", i.currency || "USD"), n = 0; n < i.items.length; n++) a = i.items[n], d()(l + "ec:addProduct", {
                                            id: a.sku || a.name,
                                            name: a.name,
                                            category: a.category || "",
                                            price: a.price,
                                            quantity: a.qty
                                        });
                                        d()(l + "ec:setAction", "purchase", {
                                            id: i.id,
                                            affiliation: e.config.retailer,
                                            revenue: i.total
                                        })
                                    } else {
                                        for (d()(l + "ecommerce:addTransaction", {
                                                id: i.id,
                                                affiliation: e.config.retailer,
                                                revenue: i.total,
                                                currency: i.currency || "USD"
                                            }), n = 0; n < i.items.length; n++) a = i.items[n], d()(l + "ecommerce:addItem", {
                                            id: i.id,
                                            name: a.name,
                                            sku: a.sku || a.name,
                                            category: a.category || "",
                                            price: a.price,
                                            quantity: a.qty,
                                            currency: i.currency || "USD"
                                        });
                                        d()(l + "ecommerce:send")
                                    }
                                    u("Tracking", "Order", i.id, Math.round(i.total), !1)
                                }
                            },
                            trackCustomEvent: function (t) {
                                u(e.config.product.category + "-" + e.config.product.categoryId, t.action, t.label, t.value || 1, t.isInteraction)
                            }
                        }
                    }
                }(),
                function () {
                    var t = "InfoPortalAnalytics";
                    e.state.plugins[t] = function (t, i) {
                        var n = !1;
                        t = t || {};
                        var a = {
                            analyticsUrl: "https://info.tangiblee.com"
                        };
                        for (var o in a) t[o] = "undefined" != typeof t[o] ? t[o] : a[o];
                        var r = function () {
                            if (e.mailBox[i])
                                for (var t = 0; t < e.mailBox[i].length; t++) e.mailBox[i][t]();
                            n = !0, e.mailBox[i] = []
                        };
                        r();
                        var l = function (t) {
                                var i = e.utils.storage.getCookie("_ga");
                                return i && /GA\d+\.\d+\.(.+)/gi.test(i) ? t + ";" + /GA\d+\.\d+\.(.+)/gi.exec(i)[1] : t
                            },
                            s = function () {
                                e.state.registerSessionIntervalId && clearInterval(e.state.registerSessionIntervalId), e.state.registerSessionIntervalId = setInterval(function () {
                                    var i = t.analyticsUrl + "/api/RegisterSession/" + escape(e.config.product.id) + "?domain=" + e.config.retailer + (e.state.userId ? "&user=" + escape(l(e.state.userId)) : "");
                                    e.utils.http.fetch(i, "POST")
                                }, 5e3)
                            },
                            d = function () {
                                e.state.registerSessionIntervalId && clearInterval(e.state.registerSessionIntervalId)
                            },
                            c = function () {
                                var i = e.state.buttonDisplayedAt - e.state.timeOfInit,
                                    n = t.analyticsUrl + "/api/registertimetobutton/" + e.config.product.id + "?domain=" + escape(e.config.retailer) + (e.state.userId ? "&user=" + escape(l(e.state.userId)) : "") + "&time=" + i;
                                e.utils.http.fetch(n, "POST")
                            };
                        return {
                            _unique_id: t._unique_id,
                            isReady: function () {
                                return n
                            },
                            setExperiment: function () {
                                return !1
                            },
                            trackImpression: function (i) {
                                e.state.buttonDisplayedAt = new Date;
                                var n = t.analyticsUrl + "/api/regimpr?ids=" + i.join() + "&domain=" + e.config.retailer + "&platformType=auto" + (e.state.userId ? "&user=" + escape(l(e.state.userId)) : "") + ("1" === e.utils.getParam("xtng_fake") ? "&fake=suppressimpression" : "");
                                e.utils.http.fetch(n, "POST"), c()
                            },
                            trackWidgetOpen: function () {
                                var i = e.state.buttonDisplayedAt ? new Date - e.state.buttonDisplayedAt : 0;
                                e.state.buttonDisplayedAt = null;
                                var n = t.analyticsUrl + "/api/RegisterOpen/" + escape(e.config.product.id) + "?domain=" + e.config.retailer + "&timeToOpen=" + i + (e.state.userId ? "&user=" + escape(l(e.state.userId)) : "");
                                e.utils.http.fetch(n, "POST"), e.utils.storage.setLS("tangiblee:widget:opened", "true"), s()
                            },
                            trackWidgetClose: function () {
                                d()
                            },
                            trackATCClick: function () {
                                return !1
                            },
                            trackATCWidgetClick: function () {
                                return !1
                            },
                            trackOrder: function (e) {
                                return !1
                            },
                            trackCustomEvent: function () {
                                return !1
                            }
                        }
                    }
                }(),
                function () {
                    var t = function (t) {
                            if (!t.id) return !1;
                            var i = e.utils.storage.getLS("latest_tng_orders") || [],
                                n = 20;
                            return i.indexOf(t.id) > -1 || (i.unshift(t.id), i.slice(0, Math.min(i.length, n)), e.utils.storage.setLS("latest_tng_orders", i), !1)
                        },
                        i = function (t, i) {
                            for (var n = 0; n < e.state.activatedPlugins.length; n++) {
                                var a = function (n) {
                                    return function () {
                                        e.state.activatedPlugins[n][t](i)
                                    }
                                }(n);
                                e.state.activatedPlugins[n].isReady() ? a() : (e.mailBox[n] || (e.mailBox[n] = []), e.mailBox[n].push(a))
                            }
                        },
                        n = function (t, n) {
                            var a = function () {
                                var e = t();
                                if (!e || !e.items || !e.items.length) return console.error("Wrong order data format, please check Tangiblee Documentation"), !1;
                                e.total = 0;
                                for (var i = 0; i < e.items.length; i++) e.total += e.items[i].price * e.items[i].qty;
                                return 0 === e.total ? (console.warn("Order Total is 0, please check Tangiblee Documentation"), !1) : e
                            };
                            if (e.utils.pageChecker.isParseRevenuePage()) {
                                var o = a();
                                o && e.utils.storage.setLS("tng_order", o)
                            }
                            if (e.utils.pageChecker.isTrackRevenuePage()) {
                                var o = a();
                                o || (o = e.utils.storage.getLS("tng_order"), n && (o.id = n() || !1)), o && (i("trackOrder", o), e.utils.storage.removeLS("tng_order"))
                            }
                        },
                        a = {
                            setAnalyticsPlugin: function (t, i) {
                                if (i._unique_id)
                                    for (var n = 0; n < e.state.activatedPlugins.length; n++)
                                        if (e.state.activatedPlugins[n]._unique_id === i._unique_id) return;
                                e.state.activatedPlugins.push(e.state.plugins[t](i, e.state.activatedPlugins.length))
                            },
                            setVariation: function (t) {
                                e.config.variation = t
                            },
                            setExperiment: function (e) {
                                e.provider || (e.provider = "GoogleOptimize"), i("setExperiment", e)
                            },
                            setRetailer: function (t) {
                                e.config.retailer = t
                            },
                            setProduct: function (t) {
                                e.config.product = {
                                    id: t.id,
                                    category: t.category || "Default",
                                    categoryId: t.categoryId || -1,
                                    label: (t.id ? t.id : "Unknown") + "-" + document.location.href
                                }
                            },
                            setCookieUserKey: function (t) {
                                e.config.cookieUserKey = t
                            },
                            setAutoTracking: function (t) {
                                e.config.parseOn = t.parseOn, e.config.trackOn = t.trackOn, n(t.parseOrder, t.transactionIdFetcher)
                            },
                            getTangibleeUserId: function (t) {
                                var i = 500,
                                    n = 0,
                                    a = function () {
                                        if (e.state.userId) {
                                            var a = e.state.userId,
                                                o = e.utils.storage.getCookie("_ga");
                                            return o && /GA\d+\.\d+\.(.+)/gi.test(o) && (a += ";" + /GA\d+\.\d+\.(.+)/gi.exec(o)[1]), t(a), a
                                        }
                                        i > n && (setTimeout(waitForUserId, 50), n++)
                                    };
                                a()
                            },
                            trackOrder: function (e) {
                                if (!e || !e.items || !e.items.length) return console.log("Wrong order data format, please check Tangiblee Documentation"), !1;
                                if (e.total = 0, t(e)) return console.log("Duplicated order was not sent"), !1;
                                for (var n = 0; n < e.items.length; n++) e.total += e.items[n].price * e.items[n].qty;
                                return 0 === e.total ? (console.warn("Order Total is 0, please check Tangiblee Documentation"), !1) : void i("trackOrder", e)
                            },
                            trackImpression: function (e) {
                                i("trackImpression", e)
                            },
                            trackATCClick: function () {
                                i("trackATCClick")
                            },
                            trackATCWidgetClick: function () {
                                i("trackATCWidgetClick")
                            },
                            trackWidgetOpen: function () {
                                i("trackWidgetOpen")
                            },
                            trackWidgetClose: function () {
                                i("trackWidgetClose")
                            },
                            trackCustomEvent: function (e) {
                                i("trackCustomEvent", e)
                            }
                        },
                        o = function (t) {
                            if (e.config.useCookies) {
                                var i = "https://info.tangiblee.com",
                                    n = function (i) {
                                        e.state.userId = i, e.utils.storage.setLS("tangiblee:widget:user", i), t(), e.utils.storage.setCookie(e.config.cookieUserKey, i, 365)
                                    },
                                    a = function () {
                                        var i = function () {
                                            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                                                var t = 16 * Math.random() | 0,
                                                    i = "x" == e ? t : 3 & t | 8;
                                                return i.toString(16)
                                            })
                                        };
                                        e.state.userId = i(), e.utils.storage.setLS("tangiblee:widget:user", e.state.userId), t(), e.utils.storage.setCookie(e.config.cookieUserKey, e.state.userId, 365)
                                    },
                                    o = e.utils.storage.getLS("tangiblee:widget:user"),
                                    r = e.utils.storage.getCookie(e.config.cookieUserKey);
                                e.state.userId = o, r && r !== e.state.userId && (e.state.userId = r);
                                var l = window.crypto || window.msCrypto;
                                if (e.state.userId) e.utils.storage.setLS("tangiblee:widget:user", e.state.userId), t(), e.utils.storage.setCookie(e.config.cookieUserKey, e.state.userId, 365);
                                else if ("undefined" != typeof l && l.getRandomValues) {
                                    var s = function () {
                                        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (e) {
                                            return (e ^ l.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)
                                        })
                                    };
                                    e.state.userId = s(), e.utils.storage.setLS("tangiblee:widget:user", e.state.userId), t(), e.utils.storage.setCookie(e.config.cookieUserKey, e.state.userId, 365)
                                } else e.utils.http.fetch(i + "/api/GetUser", "GET", !1, n, a)
                            }
                        },
                        r = function () {
                            if (e.utils.transferCookies(), !window.taScriptLoaded) {
                                window.taScriptLoaded = !0;
                                var t = window.tangibleeAnalytics && window.tangibleeAnalytics.q || [];
                                window.tangibleeAnalytics = function () {
                                    try {
                                        for (var e = arguments[0], t = [], i = 1; i < arguments.length; i++) t.push(arguments[i]);
                                        a[e].apply(this, t)
                                    } catch (n) {}
                                }, window.tangibleeAnalytics.loaded = !0;
                                for (var i = 0; i < t.length; i++) window.tangibleeAnalytics.apply(this, t[i])
                            }
                        };
                    o(r)
                }()
        }()
    } catch (S) {
        window.TrackJS && window.TrackJS.isInstalled() && window.TrackJS.track(S.message)
    }
}();
