import {
  client_exports
} from "./chunk-ANKY43RT.js";
import {
  computed,
  getCurrentInstance,
  h
} from "./chunk-3JL2R52N.js";
import {
  camelize,
  capitalize
} from "./chunk-XYQ66V4O.js";

// node_modules/vuepress-shared/lib/client/index.js
var a = ({ name: e = "", color: n = "currentColor" }, { slots: r }) => {
  var _a;
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: ["icon", `${e}-icon`], viewBox: "0 0 1024 1024", fill: n, "aria-label": `${e} icon` }, (_a = r.default) == null ? void 0 : _a.call(r));
};
a.displayName = "IconBase";
var u = (t, { slots: e }) => {
  var _a;
  return ((_a = e.default) == null ? void 0 : _a.call(e)) || null;
};
var c = (t) => {
  const i = getCurrentInstance();
  return "object" == typeof (i == null ? void 0 : i.appContext.components) && (t in i.appContext.components || camelize(t) in i.appContext.components || capitalize(camelize(t)) in i.appContext.components);
};
var f = (t) => {
  const e = (0, client_exports.useRouteLocale)();
  return computed(() => t[e.value]);
};
var D = (t, e) => {
  let n = 1;
  for (let e2 = 0; e2 < t.length; e2++)
    n += t.charCodeAt(e2), n += n << 10, n ^= n >> 6;
  return n += n << 3, n ^= n >> 11, n % e;
};
var _ = /#.*$/u;
var Y = (t) => {
  const e = _.exec(t);
  return e ? e[0] : "";
};
var w = (t) => decodeURI(t).replace(_, "").replace(/(index)?\.(md|html)$/, "");
var b = (t, e) => {
  if (void 0 === e)
    return false;
  const n = w(t.path), r = w(e), i = Y(e);
  return i ? i === t.hash && (!r || n === r) : n === r;
};
Object.freeze({}), Object.freeze([]);
var x = (t, ...e) => {
  const n = t.resolve(...e), r = n.matched[n.matched.length - 1];
  if (!(r == null ? void 0 : r.redirect))
    return n;
  const { redirect: i } = r, s2 = "function" == typeof i ? i(n) : i;
  const o2 = ((t2) => "string" == typeof t2)(s2) ? { path: s2 } : s2;
  return x(t, { hash: n.hash, query: n.query, params: n.params, ...o2 });
};
var L;
var A = { exports: {} };
var H = A.exports = function() {
  var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s2 = "minute", o2 = "hour", a2 = "day", u2 = "week", c2 = "month", f2 = "quarter", d = "year", h2 = "date", l = "Invalid Date", m = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, p = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, $ = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, v = function(t2, e2, n2) {
    var r2 = String(t2);
    return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
  }, y = { s: v, z: function(t2) {
    var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
    return (e2 <= 0 ? "+" : "-") + v(r2, 2, "0") + ":" + v(i2, 2, "0");
  }, m: function t2(e2, n2) {
    if (e2.date() < n2.date())
      return -t2(n2, e2);
    var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c2), s3 = n2 - i2 < 0, o3 = e2.clone().add(r2 + (s3 ? -1 : 1), c2);
    return +(-(r2 + (n2 - i2) / (s3 ? i2 - o3 : o3 - i2)) || 0);
  }, a: function(t2) {
    return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
  }, p: function(t2) {
    return { M: c2, y: d, w: u2, d: a2, D: h2, h: o2, m: s2, s: i, ms: r, Q: f2 }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
  }, u: function(t2) {
    return void 0 === t2;
  } }, g = "en", M = {};
  M[g] = $;
  var D2 = function(t2) {
    return t2 instanceof b2;
  }, _2 = function t2(e2, n2, r2) {
    var i2;
    if (!e2)
      return g;
    if ("string" == typeof e2) {
      var s3 = e2.toLowerCase();
      M[s3] && (i2 = s3), n2 && (M[s3] = n2, i2 = s3);
      var o3 = e2.split("-");
      if (!i2 && o3.length > 1)
        return t2(o3[0]);
    } else {
      var a3 = e2.name;
      M[a3] = e2, i2 = a3;
    }
    return !r2 && i2 && (g = i2), i2 || !r2 && g;
  }, Y2 = function(t2, e2) {
    if (D2(t2))
      return t2.clone();
    var n2 = "object" == typeof e2 ? e2 : {};
    return n2.date = t2, n2.args = arguments, new b2(n2);
  }, w2 = y;
  w2.l = _2, w2.i = D2, w2.w = function(t2, e2) {
    return Y2(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
  };
  var b2 = function() {
    function $2(t2) {
      this.$L = _2(t2.locale, null, true), this.parse(t2);
    }
    var v2 = $2.prototype;
    return v2.parse = function(t2) {
      this.$d = function(t3) {
        var e2 = t3.date, n2 = t3.utc;
        if (null === e2)
          return new Date(NaN);
        if (w2.u(e2))
          return new Date();
        if (e2 instanceof Date)
          return new Date(e2);
        if ("string" == typeof e2 && !/Z$/i.test(e2)) {
          var r2 = e2.match(m);
          if (r2) {
            var i2 = r2[2] - 1 || 0, s3 = (r2[7] || "0").substring(0, 3);
            return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3);
          }
        }
        return new Date(e2);
      }(t2), this.$x = t2.x || {}, this.init();
    }, v2.init = function() {
      var t2 = this.$d;
      this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
    }, v2.$utils = function() {
      return w2;
    }, v2.isValid = function() {
      return !(this.$d.toString() === l);
    }, v2.isSame = function(t2, e2) {
      var n2 = Y2(t2);
      return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
    }, v2.isAfter = function(t2, e2) {
      return Y2(t2) < this.startOf(e2);
    }, v2.isBefore = function(t2, e2) {
      return this.endOf(e2) < Y2(t2);
    }, v2.$g = function(t2, e2, n2) {
      return w2.u(t2) ? this[e2] : this.set(n2, t2);
    }, v2.unix = function() {
      return Math.floor(this.valueOf() / 1e3);
    }, v2.valueOf = function() {
      return this.$d.getTime();
    }, v2.startOf = function(t2, e2) {
      var n2 = this, r2 = !!w2.u(e2) || e2, f3 = w2.p(t2), l2 = function(t3, e3) {
        var i2 = w2.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
        return r2 ? i2 : i2.endOf(a2);
      }, m2 = function(t3, e3) {
        return w2.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
      }, p2 = this.$W, $3 = this.$M, v3 = this.$D, y2 = "set" + (this.$u ? "UTC" : "");
      switch (f3) {
        case d:
          return r2 ? l2(1, 0) : l2(31, 11);
        case c2:
          return r2 ? l2(1, $3) : l2(0, $3 + 1);
        case u2:
          var g2 = this.$locale().weekStart || 0, M2 = (p2 < g2 ? p2 + 7 : p2) - g2;
          return l2(r2 ? v3 - M2 : v3 + (6 - M2), $3);
        case a2:
        case h2:
          return m2(y2 + "Hours", 0);
        case o2:
          return m2(y2 + "Minutes", 1);
        case s2:
          return m2(y2 + "Seconds", 2);
        case i:
          return m2(y2 + "Milliseconds", 3);
        default:
          return this.clone();
      }
    }, v2.endOf = function(t2) {
      return this.startOf(t2, false);
    }, v2.$set = function(t2, e2) {
      var n2, u3 = w2.p(t2), f3 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a2] = f3 + "Date", n2[h2] = f3 + "Date", n2[c2] = f3 + "Month", n2[d] = f3 + "FullYear", n2[o2] = f3 + "Hours", n2[s2] = f3 + "Minutes", n2[i] = f3 + "Seconds", n2[r] = f3 + "Milliseconds", n2)[u3], m2 = u3 === a2 ? this.$D + (e2 - this.$W) : e2;
      if (u3 === c2 || u3 === d) {
        var p2 = this.clone().set(h2, 1);
        p2.$d[l2](m2), p2.init(), this.$d = p2.set(h2, Math.min(this.$D, p2.daysInMonth())).$d;
      } else
        l2 && this.$d[l2](m2);
      return this.init(), this;
    }, v2.set = function(t2, e2) {
      return this.clone().$set(t2, e2);
    }, v2.get = function(t2) {
      return this[w2.p(t2)]();
    }, v2.add = function(r2, f3) {
      var h3, l2 = this;
      r2 = Number(r2);
      var m2 = w2.p(f3), p2 = function(t2) {
        var e2 = Y2(l2);
        return w2.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
      };
      if (m2 === c2)
        return this.set(c2, this.$M + r2);
      if (m2 === d)
        return this.set(d, this.$y + r2);
      if (m2 === a2)
        return p2(1);
      if (m2 === u2)
        return p2(7);
      var $3 = (h3 = {}, h3[s2] = e, h3[o2] = n, h3[i] = t, h3)[m2] || 1, v3 = this.$d.getTime() + r2 * $3;
      return w2.w(v3, this);
    }, v2.subtract = function(t2, e2) {
      return this.add(-1 * t2, e2);
    }, v2.format = function(t2) {
      var e2 = this, n2 = this.$locale();
      if (!this.isValid())
        return n2.invalidDate || l;
      var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = w2.z(this), s3 = this.$H, o3 = this.$m, a3 = this.$M, u3 = n2.weekdays, c3 = n2.months, f3 = function(t3, n3, i3, s4) {
        return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s4);
      }, d2 = function(t3) {
        return w2.s(s3 % 12 || 12, t3, "0");
      }, h3 = n2.meridiem || function(t3, e3, n3) {
        var r3 = t3 < 12 ? "AM" : "PM";
        return n3 ? r3.toLowerCase() : r3;
      }, m2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a3 + 1, MM: w2.s(a3 + 1, 2, "0"), MMM: f3(n2.monthsShort, a3, c3, 3), MMMM: f3(c3, a3), D: this.$D, DD: w2.s(this.$D, 2, "0"), d: String(this.$W), dd: f3(n2.weekdaysMin, this.$W, u3, 2), ddd: f3(n2.weekdaysShort, this.$W, u3, 3), dddd: u3[this.$W], H: String(s3), HH: w2.s(s3, 2, "0"), h: d2(1), hh: d2(2), a: h3(s3, o3, true), A: h3(s3, o3, false), m: String(o3), mm: w2.s(o3, 2, "0"), s: String(this.$s), ss: w2.s(this.$s, 2, "0"), SSS: w2.s(this.$ms, 3, "0"), Z: i2 };
      return r2.replace(p, function(t3, e3) {
        return e3 || m2[t3] || i2.replace(":", "");
      });
    }, v2.utcOffset = function() {
      return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
    }, v2.diff = function(r2, h3, l2) {
      var m2, p2 = w2.p(h3), $3 = Y2(r2), v3 = ($3.utcOffset() - this.utcOffset()) * e, y2 = this - $3, g2 = w2.m(this, $3);
      return g2 = (m2 = {}, m2[d] = g2 / 12, m2[c2] = g2, m2[f2] = g2 / 3, m2[u2] = (y2 - v3) / 6048e5, m2[a2] = (y2 - v3) / 864e5, m2[o2] = y2 / n, m2[s2] = y2 / e, m2[i] = y2 / t, m2)[p2] || y2, l2 ? g2 : w2.a(g2);
    }, v2.daysInMonth = function() {
      return this.endOf(c2).$D;
    }, v2.$locale = function() {
      return M[this.$L];
    }, v2.locale = function(t2, e2) {
      if (!t2)
        return this.$L;
      var n2 = this.clone(), r2 = _2(t2, e2, true);
      return r2 && (n2.$L = r2), n2;
    }, v2.clone = function() {
      return w2.w(this.$d, this);
    }, v2.toDate = function() {
      return new Date(this.valueOf());
    }, v2.toJSON = function() {
      return this.isValid() ? this.toISOString() : null;
    }, v2.toISOString = function() {
      return this.$d.toISOString();
    }, v2.toString = function() {
      return this.$d.toUTCString();
    }, $2;
  }(), S = b2.prototype;
  return Y2.prototype = S, [["$ms", r], ["$s", i], ["$m", s2], ["$H", o2], ["$W", a2], ["$M", c2], ["$y", d], ["$D", h2]].forEach(function(t2) {
    S[t2[1]] = function(e2) {
      return this.$g(e2, t2[0], t2[1]);
    };
  }), Y2.extend = function(t2, e2) {
    return t2.$i || (t2(e2, b2, Y2), t2.$i = true), Y2;
  }, Y2.locale = _2, Y2.isDayjs = D2, Y2.unix = function(t2) {
    return Y2(1e3 * t2);
  }, Y2.en = M[g], Y2.Ls = M, Y2.p = {}, Y2;
}();
var C = { exports: {} };
var E = C.exports = (L = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, function(t, e, n) {
  var r = e.prototype, i = r.format;
  n.en.formats = L, r.format = function(t2) {
    void 0 === t2 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
    var e2 = this.$locale().formats, n2 = function(t3, e3) {
      return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t4, n3, r2) {
        var i2 = r2 && r2.toUpperCase();
        return n3 || e3[r2] || L[r2] || e3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(t5, e4, n4) {
          return e4 || n4.slice(1);
        });
      });
    }(t2, void 0 === e2 ? {} : e2);
    return i.call(this, n2);
  };
});
var z = { exports: {} };
var N = z.exports = function(t, e, n) {
  var r = e.prototype, i = function(t2) {
    var e2, i2 = t2.date, s3 = t2.utc, o3 = {};
    if (!((e2 = i2) instanceof Date) && !(e2 instanceof Array) && e2 instanceof Object) {
      if (!Object.keys(i2).length)
        return new Date();
      var a3 = s3 ? n.utc() : n();
      Object.keys(i2).forEach(function(t3) {
        var e3, n2;
        o3[e3 = t3, n2 = r.$utils().p(e3), "date" === n2 ? "day" : n2] = i2[t3];
      });
      var u3 = o3.day || (o3.year || o3.month >= 0 ? 1 : a3.date()), c2 = o3.year || a3.year(), f2 = o3.month >= 0 ? o3.month : o3.year || o3.day ? 0 : a3.month(), d = o3.hour || 0, h2 = o3.minute || 0, l = o3.second || 0, m = o3.millisecond || 0;
      return s3 ? new Date(Date.UTC(c2, f2, u3, d, h2, l, m)) : new Date(c2, f2, u3, d, h2, l, m);
    }
    return i2;
  }, s2 = r.parse;
  r.parse = function(t2) {
    t2.date = i.bind(this)(t2), s2.bind(this)(t2);
  };
  var o2 = r.set, a2 = r.add, u2 = function(t2, e2, n2, r2) {
    if (void 0 === r2 && (r2 = 1), e2 instanceof Object) {
      var i2 = Object.keys(e2), s3 = this;
      return i2.forEach(function(n3) {
        s3 = t2.bind(s3)(e2[n3] * r2, n3);
      }), s3;
    }
    return t2.bind(this)(e2 * r2, n2);
  };
  r.set = function(t2, e2) {
    return e2 = void 0 === e2 ? t2 : e2, u2.bind(this)(function(t3, e3) {
      return o2.bind(this)(e3, t3);
    }, e2, t2);
  }, r.add = function(t2, e2) {
    return u2.bind(this)(a2, t2, e2);
  }, r.subtract = function(t2, e2) {
    return u2.bind(this)(a2, t2, e2, -1);
  };
};
var U = { exports: {} };
var k = U.exports = function() {
  var t = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, e = {};
  return function(n, r, i) {
    var s2, o2 = function(t2, n2, r2) {
      void 0 === r2 && (r2 = {});
      var i2 = new Date(t2), s3 = function(t3, n3) {
        void 0 === n3 && (n3 = {});
        var r3 = n3.timeZoneName || "short", i3 = t3 + "|" + r3, s4 = e[i3];
        return s4 || (s4 = new Intl.DateTimeFormat("en-US", { hour12: false, timeZone: t3, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: r3 }), e[i3] = s4), s4;
      }(n2, r2);
      return s3.formatToParts(i2);
    }, a2 = function(e2, n2) {
      for (var r2 = o2(e2, n2), s3 = [], a3 = 0; a3 < r2.length; a3 += 1) {
        var u3 = r2[a3], c3 = u3.type, f2 = u3.value, d = t[c3];
        d >= 0 && (s3[d] = parseInt(f2, 10));
      }
      var h2 = s3[3], l = 24 === h2 ? 0 : h2, m = s3[0] + "-" + s3[1] + "-" + s3[2] + " " + l + ":" + s3[4] + ":" + s3[5] + ":000", p = +e2;
      return (i.utc(m).valueOf() - (p -= p % 1e3)) / 6e4;
    }, u2 = r.prototype;
    u2.tz = function(t2, e2) {
      void 0 === t2 && (t2 = s2);
      var n2 = this.utcOffset(), r2 = this.toDate(), o3 = r2.toLocaleString("en-US", { timeZone: t2 }), a3 = Math.round((r2 - new Date(o3)) / 1e3 / 60), u3 = i(o3).$set("millisecond", this.$ms).utcOffset(15 * -Math.round(r2.getTimezoneOffset() / 15) - a3, true);
      if (e2) {
        var c3 = u3.utcOffset();
        u3 = u3.add(n2 - c3, "minute");
      }
      return u3.$x.$timezone = t2, u3;
    }, u2.offsetName = function(t2) {
      var e2 = this.$x.$timezone || i.tz.guess(), n2 = o2(this.valueOf(), e2, { timeZoneName: t2 }).find(function(t3) {
        return "timezonename" === t3.type.toLowerCase();
      });
      return n2 && n2.value;
    };
    var c2 = u2.startOf;
    u2.startOf = function(t2, e2) {
      if (!this.$x || !this.$x.$timezone)
        return c2.call(this, t2, e2);
      var n2 = i(this.format("YYYY-MM-DD HH:mm:ss:SSS"));
      return c2.call(n2, t2, e2).tz(this.$x.$timezone, true);
    }, i.tz = function(t2, e2, n2) {
      var r2 = n2 && e2, o3 = n2 || e2 || s2, u3 = a2(+i(), o3);
      if ("string" != typeof t2)
        return i(t2).tz(o3);
      var c3 = function(t3, e3, n3) {
        var r3 = t3 - 60 * e3 * 1e3, i2 = a2(r3, n3);
        if (e3 === i2)
          return [r3, e3];
        var s3 = a2(r3 -= 60 * (i2 - e3) * 1e3, n3);
        return i2 === s3 ? [r3, i2] : [t3 - 60 * Math.min(i2, s3) * 1e3, Math.max(i2, s3)];
      }(i.utc(t2, r2).valueOf(), u3, o3), f2 = c3[0], d = c3[1], h2 = i(f2).utcOffset(d);
      return h2.$x.$timezone = o3, h2;
    }, i.tz.guess = function() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }, i.tz.setDefault = function(t2) {
      s2 = t2;
    };
  };
}();
var j = { exports: {} };
var I = j.exports = function() {
  var t = "minute", e = /[+-]\d\d(?::?\d\d)?/g, n = /([+-]|\d\d)/g;
  return function(r, i, s2) {
    var o2 = i.prototype;
    s2.utc = function(t2) {
      return new i({ date: t2, utc: true, args: arguments });
    }, o2.utc = function(e2) {
      var n2 = s2(this.toDate(), { locale: this.$L, utc: true });
      return e2 ? n2.add(this.utcOffset(), t) : n2;
    }, o2.local = function() {
      return s2(this.toDate(), { locale: this.$L, utc: false });
    };
    var a2 = o2.parse;
    o2.parse = function(t2) {
      t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), a2.call(this, t2);
    };
    var u2 = o2.init;
    o2.init = function() {
      if (this.$u) {
        var t2 = this.$d;
        this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
      } else
        u2.call(this);
    };
    var c2 = o2.utcOffset;
    o2.utcOffset = function(r2, i2) {
      var s3 = this.$utils().u;
      if (s3(r2))
        return this.$u ? 0 : s3(this.$offset) ? c2.call(this) : this.$offset;
      if ("string" == typeof r2 && (r2 = function(t2) {
        void 0 === t2 && (t2 = "");
        var r3 = t2.match(e);
        if (!r3)
          return null;
        var i3 = ("" + r3[0]).match(n) || ["-", 0, 0], s4 = i3[0], o4 = 60 * +i3[1] + +i3[2];
        return 0 === o4 ? 0 : "+" === s4 ? o4 : -o4;
      }(r2), null === r2))
        return this;
      var o3 = Math.abs(r2) <= 16 ? 60 * r2 : r2, a3 = this;
      if (i2)
        return a3.$offset = o3, a3.$u = 0 === r2, a3;
      if (0 !== r2) {
        var u3 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
        (a3 = this.local().add(o3 + u3, t)).$offset = o3, a3.$x.$localOffset = u3;
      } else
        a3 = this.utc();
      return a3;
    };
    var f2 = o2.format;
    o2.format = function(t2) {
      var e2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
      return f2.call(this, e2);
    }, o2.valueOf = function() {
      var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
      return this.$d.valueOf() - 6e4 * t2;
    }, o2.isUTC = function() {
      return !!this.$u;
    }, o2.toISOString = function() {
      return this.toDate().toISOString();
    }, o2.toString = function() {
      return this.toDate().toUTCString();
    };
    var d = o2.toDate;
    o2.toDate = function(t2) {
      return "s" === t2 && this.$offset ? s2(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : d.call(this);
    };
    var h2 = o2.diff;
    o2.diff = function(t2, e2, n2) {
      if (t2 && this.$u === t2.$u)
        return h2.call(this, t2, e2, n2);
      var r2 = this.local(), i2 = s2(t2).local();
      return h2.call(r2, i2, e2, n2);
    };
  };
}();
H.extend(E), H.extend(N), H.extend(I), H.extend(k);
var W = { name: "zh-cn", weekdays: "\u661F\u671F\u65E5_\u661F\u671F\u4E00_\u661F\u671F\u4E8C_\u661F\u671F\u4E09_\u661F\u671F\u56DB_\u661F\u671F\u4E94_\u661F\u671F\u516D".split("_"), weekdaysShort: "\u5468\u65E5_\u5468\u4E00_\u5468\u4E8C_\u5468\u4E09_\u5468\u56DB_\u5468\u4E94_\u5468\u516D".split("_"), weekdaysMin: "\u65E5_\u4E00_\u4E8C_\u4E09_\u56DB_\u4E94_\u516D".split("_"), months: "\u4E00\u6708_\u4E8C\u6708_\u4E09\u6708_\u56DB\u6708_\u4E94\u6708_\u516D\u6708_\u4E03\u6708_\u516B\u6708_\u4E5D\u6708_\u5341\u6708_\u5341\u4E00\u6708_\u5341\u4E8C\u6708".split("_"), monthsShort: "1\u6708_2\u6708_3\u6708_4\u6708_5\u6708_6\u6708_7\u6708_8\u6708_9\u6708_10\u6708_11\u6708_12\u6708".split("_"), ordinal: (t, e) => "W" === e ? `${t}\u5468` : `${t}\u65E5`, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY\u5E74M\u6708D\u65E5", LLL: "YYYY\u5E74M\u6708D\u65E5Ah\u70B9mm\u5206", LLLL: "YYYY\u5E74M\u6708D\u65E5ddddAh\u70B9mm\u5206", l: "YYYY/M/D", ll: "YYYY\u5E74M\u6708D\u65E5", lll: "YYYY\u5E74M\u6708D\u65E5 HH:mm", llll: "YYYY\u5E74M\u6708D\u65E5dddd HH:mm" }, relativeTime: { future: "%s\u5185", past: "%s\u524D", s: "\u51E0\u79D2", m: "1 \u5206\u949F", mm: "%d \u5206\u949F", h: "1 \u5C0F\u65F6", hh: "%d \u5C0F\u65F6", d: "1 \u5929", dd: "%d \u5929", M: "1 \u4E2A\u6708", MM: "%d \u4E2A\u6708", y: "1 \u5E74", yy: "%d \u5E74" }, meridiem: (t, e) => {
  const n = 100 * t + e;
  return n < 600 ? "\u51CC\u6668" : n < 900 ? "\u65E9\u4E0A" : n < 1100 ? "\u4E0A\u5348" : n < 1300 ? "\u4E2D\u5348" : n < 1800 ? "\u4E0B\u5348" : "\u665A\u4E0A";
} };
var Z = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") };
H.locale("zh", W), H.locale("en", Z), H.extend(N), H.extend(I), H.extend(k);
var F = (t, e) => {
  if (t) {
    if (H(t instanceof Date ? t : t.trim()).isValid()) {
      const n2 = e ? H(t).tz(e) : H(t), r = n2.year(), i = n2.month() + 1, s2 = n2.date(), o2 = n2.hour(), a2 = n2.minute(), u2 = n2.second(), c2 = n2.millisecond(), f2 = 0 === o2 && 0 === a2 && 0 === u2 && 0 === c2;
      return { value: n2.toDate(), info: { year: r, month: i, day: s2, ...f2 ? {} : { hour: o2, minute: a2, second: u2 } }, type: f2 ? "date" : "full" };
    }
    const n = /(?:(\d{2,4})[/-](\d{1,2})[/-](\d{1,2}))?\s*(?:(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/u.exec(t.trim());
    if (n) {
      const [, t2, e2, r, i, s2, o2] = n, a2 = (t3) => void 0 === t3 ? void 0 : Number(t3), u2 = (t3) => i && s2 && !o2 ? 0 : t3, c2 = { year: ((t3) => t3 && t3 < 100 ? t3 + 2e3 : t3)(a2(t2)), month: a2(e2), day: a2(r), hour: a2(i), minute: a2(s2), second: u2(a2(o2)) }, f2 = void 0 === t2 && void 0 === e2 && void 0 === r, d = void 0 === i && void 0 === s2 && void 0 === o2, h2 = H({ ...c2, month: c2.month - 1 }).toDate();
      return { value: f2 ? void 0 : h2, info: d ? { year: c2.year, month: c2.month, day: c2.day } : f2 ? { hour: c2.hour, minute: c2.minute, second: c2.second } : c2, type: f2 ? "time" : d ? "date" : "full" };
    }
  }
  return null;
};
var V = (t, e = false) => t ? Array.isArray(t) ? t.map((t2) => "string" == typeof t2 ? { name: t2 } : t2) : "string" == typeof t ? [{ name: t }] : "object" == typeof t && t.name ? [t] : (console.error(`Expect 'author' to be \`AuthorInfo[] | AuthorInfo | string[] | string ${e ? "" : "| false"} | undefined\`, but got`, t), []) : [];
var B = (t) => {
  if (t) {
    if (Array.isArray(t))
      return t;
    if ("string" == typeof t)
      return [t];
    console.error("Expect 'category' to be `string[] | string | undefined`, but got", t);
  }
  return [];
};
var q = (t) => {
  if (t) {
    if (Array.isArray(t))
      return t;
    if ("string" == typeof t)
      return [t];
    console.error("Expect 'tag' to be `string[] | string | undefined`, but got", t);
  }
  return [];
};

export {
  a,
  u,
  c,
  f,
  D,
  b,
  x,
  F,
  V,
  B,
  q
};
//# sourceMappingURL=chunk-YEEH5TFH.js.map
