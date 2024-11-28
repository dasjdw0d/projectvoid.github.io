(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["end-animation"], {
    "0e2c": function(t, i, e) {
        "use strict";
        e.r(i);
        var s = function() {
            var t = this
              , i = t.$createElement
              , e = t._self._c || i;
            return e("div", {
                directives: [{
                    name: "animation-end",
                    rawName: "v-animation-end",
                    value: t.onAnimation,
                    expression: "onAnimation"
                }],
                staticClass: "game-ending",
                class: t.classes
            }, [t.isActive ? [e("div", {
                staticClass: "center rings"
            }, t._l(t.RINGS, (function(i, s) {
                return e("div", {
                    key: i + s,
                    staticClass: "center",
                    class: ["ring" + (s + 1)]
                }, t._l(i, (function(i, s) {
                    return e("div", {
                        key: i,
                        class: ["image" + (s + 1)]
                    }, [e("img", {
                        attrs: {
                            src: t.iconUrl(i),
                            alt: "icon"
                        }
                    })])
                }
                )), 0)
            }
            )), 0), e("div", {
                staticClass: "center dot"
            }), e("div", {
                staticClass: "center inner-dot"
            }), e("div", {
                staticClass: "center pop"
            }, t._l(7, (function(t) {
                return e("div", {
                    key: t,
                    class: ["pop" + t]
                }, [e("svg", {
                    staticClass: "first",
                    attrs: {
                        viewBox: "0 0 200 200",
                        xmlns: "http://www.w3.org/2000/svg"
                    }
                }, [e("circle", {
                    attrs: {
                        cx: "100",
                        cy: "100",
                        r: "100"
                    }
                })]), e("div", {
                    staticClass: "rectangle"
                }), e("svg", {
                    staticClass: "last",
                    attrs: {
                        viewBox: "0 0 200 200",
                        xmlns: "http://www.w3.org/2000/svg"
                    }
                }, [e("circle", {
                    attrs: {
                        cx: "100",
                        cy: "100",
                        r: "100"
                    }
                })])])
            }
            )), 0), t._m(0)] : t._e()], 2)
        }
          , n = [function() {
            var t = this
              , i = t.$createElement
              , e = t._self._c || i;
            return e("div", {
                staticClass: "center text"
            }, [e("div", [t._v(" all items"), e("br"), t._v("discovered! ")])])
        }
        ]
          , a = e("5530")
          , c = e("6e95")
          , r = e("53b2")
          , o = e("7d61")
          , l = e("fd41")
          , v = e("5c57")
          , m = e("1663");
        const d = o["a"][r["e"]]
          , h = [["1", "2", "3", "4"], ["11", "13", "24", "36", "114", "41"], ["42", "52", "72", "74", "87", "110", "141", "175", "212"]];
        var A = c["a"].extend({
            name: "animation-end",
            data: ()=>({
                animate: !1
            }),
            computed: Object(a["a"])(Object(a["a"])({}, Object(v["b"])(["isAnimationActive", "hasAllElements"])), {}, {
                isNewElementAnimationActive() {
                    return this.isAnimationActive(r["f"])
                },
                isActive() {
                    return this.isAnimationActive(r["e"])
                },
                hasAll() {
                    return this.hasAllElements
                },
                classes() {
                    const t = this.hasAll && this.isNewElementAnimationActive;
                    return {
                        "js-active": this.isActive && this.animate,
                        "js-show": t || this.isActive
                    }
                },
                RINGS() {
                    return h
                }
            }),
            mounted() {
                this.checkActive()
            },
            watch: {
                isActive() {
                    this.checkActive()
                }
            },
            methods: {
                checkActive() {
                    this.isActive && this.$nextTick(()=>{
                        window.setTimeout(()=>{
                            this.animate = !0
                        }
                        , 100)
                    }
                    )
                },
                iconUrl(t) {
                    return Object(l["a"])(t)
                },
                onAnimation({animationName: t}) {
                    t === d.end && this.onAnimationEnd()
                },
                onAnimationEnd() {
                    this.$store.dispatch("animationReset"),
                    m["a"].emit("GAME_END_ANIMATION_END")
                }
            }
        })
          , u = A
          , w = (e("da64"),
        e("2877"))
          , p = Object(w["a"])(u, s, n, !1, null, "9e71bc08", null);
        i["default"] = p.exports
    },
    "206d": function(t, i, e) {},
    da64: function(t, i, e) {
        "use strict";
        e("206d")
    }
}]);
//# sourceMappingURL=end-animation.baa89351.js.map
