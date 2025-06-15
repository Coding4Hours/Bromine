;(() => {
  var e = {
      129: (e, r, t) => {
        t.d(r, { u: () => c })
        var o = t(9777),
          n = t(1762).Z
        class c extends EventTarget {
          controller
          frame
          constructor(e, r) {
            super(), (this.controller = e), (this.frame = r), (r[o.D1] = this)
          }
          get client() {
            return this.frame.contentWindow.window[o.a3]
          }
          get url() {
            return this.client.url
          }
          go(e) {
            e instanceof URL && (e = e.toString()),
              n.log("navigated to", e),
              (this.frame.src = this.controller.encodeUrl(e))
          }
          back() {
            this.frame.contentWindow?.history.back()
          }
          forward() {
            this.frame.contentWindow?.history.forward()
          }
          reload() {
            this.frame.contentWindow?.location.reload()
          }
        }
      },
      1762: (e, r, t) => {
        t.d(r, { Z: () => o })
        const o = {
          fmt: (e, r, ...t) => {
            const o = Error.prepareStackTrace
            Error.prepareStackTrace = (e, r) => {
              r.shift(), r.shift(), r.shift()
              let t = ""
              for (let e = 1; e < Math.min(2, r.length); e++)
                r[e].getFunctionName() &&
                  (t += `${r[e].getFunctionName()} -> ` + t)
              return t + (r[0].getFunctionName() || "Anonymous")
            }
            const n = (() => {
              try {
                throw Error()
              } catch (e) {
                return e.stack
              }
            })()
            ;(Error.prepareStackTrace = o),
              (console[e] || console.log)(
                `%c${n}%c ${r}`,
                `
		background-color: ${{ log: "#000", warn: "#f80", error: "#f00", debug: "transparent" }[e]};
		color: ${{ log: "#fff", warn: "#fff", error: "#fff", debug: "gray" }[e]};
		padding: ${{ log: 2, warn: 4, error: 4, debug: 0 }[e]}px;
		font-weight: bold;
		font-family: monospace;
		font-size: 0.9em;
	`,
                `${"debug" === e ? "color: gray" : ""}`,
                ...t,
              )
          },
          log: function (e, ...r) {
            this.fmt("log", e, ...r)
          },
          warn: function (e, ...r) {
            this.fmt("warn", e, ...r)
          },
          error: function (e, ...r) {
            this.fmt("error", e, ...r)
          },
          debug: function (e, ...r) {
            this.fmt("debug", e, ...r)
          },
        }
      },
      8810: (e, r, t) => {
        t.d(r, { h3: () => o, t8: () => c }),
          "$scramjet" in self ||
            (self.$scramjet = {
              version: { build: "e3316d9", version: "1.0.2-dev" },
              codec: {},
              flagEnabled: (e, r) => {
                const t = o.config.flags[e]
                for (const t in o.config.siteFlags) {
                  const n = o.config.siteFlags[t]
                  if (new RegExp(t).test(r.href) && e in n) return n[e]
                }
                return t
              },
            })
        const o = self.$scramjet,
          n = Function
        function c() {
          ;(o.codec.encode = n(`return ${o.config.codec.encode}`)()),
            (o.codec.decode = n(`return ${o.config.codec.decode}`)())
        }
      },
      9777: (e, r, t) => {
        t.d(r, { D1: () => n, a3: () => o })
        const o = Symbol.for("scramjet client global"),
          n = Symbol.for("scramjet frame handle")
      },
    },
    r = {}
  function t(o) {
    var n = r[o]
    if (void 0 !== n) return n.exports
    var c = (r[o] = { exports: {} })
    return e[o](c, c.exports, t), c.exports
  }
  ;(t.d = (e, r) => {
    for (var o in r)
      t.o(r, o) &&
        !t.o(e, o) &&
        Object.defineProperty(e, o, { enumerable: !0, get: r[o] })
  }),
    (t.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (() => {
      var e = t(129),
        r = t(8810),
        o = t(1762).Z
      window.ScramjetController = class {
        db
        constructor(e) {
          const t = (e, r) => {
              for (const o in r)
                r[o] instanceof Object &&
                  o in e &&
                  Object.assign(r[o], t(e[o], r[o]))
              return Object.assign(e || {}, r)
            },
            o = t(
              {
                prefix: "/scramjet/",
                globals: {
                  wrapfn: "$scramjet$wrap",
                  wrapthisfn: "$scramjet$wrapthis",
                  trysetfn: "$scramjet$tryset",
                  importfn: "$scramjet$import",
                  rewritefn: "$scramjet$rewrite",
                  metafn: "$scramjet$meta",
                  setrealmfn: "$scramjet$setrealm",
                  pushsourcemapfn: "$scramjet$pushsourcemap",
                },
                files: {
                  wasm: "/scramjet.wasm.js",
                  shared: "/scramjet.shared.js",
                  worker: "/scramjet.worker.js",
                  client: "/scramjet.client.js",
                  sync: "/scramjet.sync.js",
                },
                flags: {
                  serviceworkers: !1,
                  syncxhr: !1,
                  naiiveRewriter: !1,
                  strictRewrites: !0,
                  rewriterLogs: !1,
                  captureErrors: !0,
                  cleanErrors: !1,
                  scramitize: !1,
                  sourcemaps: !0,
                },
                siteFlags: {},
                codec: {
                  encode: (e) => (e ? encodeURIComponent(e) : e),
                  decode: (e) => (e ? decodeURIComponent(e) : e),
                },
              },
              e,
            )
          ;(o.codec.encode = o.codec.encode.toString()),
            (o.codec.decode = o.codec.decode.toString()),
            (r.h3.config = o)
        }
        async init() {
          ;(0, r.t8)(),
            await this.openIDB(),
            navigator.serviceWorker.controller?.postMessage({
              scramjet$type: "loadConfig",
              config: r.h3.config,
            }),
            o.log("config loaded")
        }
        createFrame(r) {
          return r || (r = document.createElement("iframe")), new e.u(this, r)
        }
        encodeUrl(e) {
          return (
            e instanceof URL && (e = e.toString()),
            r.h3.config.prefix + r.h3.codec.encode(e)
          )
        }
        decodeUrl(e) {
          return e instanceof URL && (e = e.toString()), r.h3.codec.decode(e)
        }
        async openIDB() {
          const e = indexedDB.open("$scramjet", 1)
          return new Promise((r, t) => {
            ;(e.onsuccess = async () => {
              ;(this.db = e.result), await this.#e(), r(e.result)
            }),
              (e.onupgradeneeded = () => {
                const r = e.result
                r.objectStoreNames.contains("config") ||
                  r.createObjectStore("config"),
                  r.objectStoreNames.contains("cookies") ||
                    r.createObjectStore("cookies")
              }),
              (e.onerror = () => t(e.error))
          })
        }
        async #e() {
          if (!this.db) return void console.error("Store not ready!")
          const e = this.db
            .transaction("config", "readwrite")
            .objectStore("config")
            .put(r.h3.config, "config")
          return new Promise((r, t) => {
            ;(e.onsuccess = r), (e.onerror = t)
          })
        }
        async modifyConfig(e) {
          ;(r.h3.config = Object.assign({}, r.h3.config, e)),
            (0, r.t8)(),
            await this.#e()
        }
      }
    })()
})()
//# sourceMappingURL=scramjet.controller.js.map
