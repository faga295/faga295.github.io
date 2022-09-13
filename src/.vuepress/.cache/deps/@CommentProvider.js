import {
  f
} from "./chunk-YEEH5TFH.js";
import {
  client_exports
} from "./chunk-ANKY43RT.js";
import {
  autosize_esm_default
} from "./chunk-PAIFMGR6.js";
import {
  useRoute
} from "./chunk-SWJALXVA.js";
import "./chunk-YACYAO4R.js";
import {
  Fragment,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createTextVNode,
  createVNode,
  defineComponent,
  getCurrentInstance,
  getCurrentScope,
  h,
  inject,
  isRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  onUnmounted,
  openBlock,
  provide,
  reactive,
  readonly,
  ref,
  renderList,
  resolveComponent,
  shallowRef,
  unref,
  vModelDynamic,
  vModelText,
  vShow,
  watch,
  withDirectives
} from "./chunk-3JL2R52N.js";
import {
  normalizeClass,
  normalizeStyle,
  toDisplayString
} from "./chunk-XYQ66V4O.js";
import "./chunk-BPKF3OQJ.js";

// node_modules/marked/lib/marked.esm.js
function getDefaults() {
  return {
    async: false,
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    highlight: null,
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}
var defaults = getDefaults();
function changeDefaults(newDefaults) {
  defaults = newDefaults;
}
var escapeTest = /[&<>"']/;
var escapeReplace = /[&<>"']/g;
var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
var escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html;
}
var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html) {
  return html.replace(unescapeTest, (_, n2) => {
    n2 = n2.toLowerCase();
    if (n2 === "colon")
      return ":";
    if (n2.charAt(0) === "#") {
      return n2.charAt(1) === "x" ? String.fromCharCode(parseInt(n2.substring(2), 16)) : String.fromCharCode(+n2.substring(1));
    }
    return "";
  });
}
var caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  regex = typeof regex === "string" ? regex : regex.source;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, "$1");
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}
var nonWordAndColonTest = /[^\w:]/g;
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
    } catch (e2) {
      return null;
    }
    if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e2) {
    return null;
  }
  return href;
}
var baseUrls = {};
var justDomain = /^[^:]+:\/*[^/]*$/;
var protocol = /^([^:]+:)[\s\S]*$/;
var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(base, href) {
  if (!baseUrls[" " + base]) {
    if (justDomain.test(base)) {
      baseUrls[" " + base] = base + "/";
    } else {
      baseUrls[" " + base] = rtrim(base, "/", true);
    }
  }
  base = baseUrls[" " + base];
  const relativeBase = base.indexOf(":") === -1;
  if (href.substring(0, 2) === "//") {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, "$1") + href;
  } else if (href.charAt(0) === "/") {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, "$1") + href;
  } else {
    return base + href;
  }
}
var noopTest = { exec: function noopTest2() {
} };
function merge(obj) {
  let i = 1, target, key;
  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
}
function splitCells(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
    let escaped = false, curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) {
    cells.pop();
  }
  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count)
      cells.push("");
  }
  for (; i < cells.length; i++) {
    cells[i] = cells[i].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0, i = 0;
  for (; i < l; i++) {
    if (str[i] === "\\") {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}
function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
  }
}
function repeatString(pattern, count) {
  if (count < 1) {
    return "";
  }
  let result = "";
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}
function outputLink(cap, link, raw, lexer2) {
  const href = link.href;
  const title = link.title ? escape(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    lexer2.state.inLink = true;
    const token = {
      type: "link",
      raw,
      href,
      title,
      text,
      tokens: lexer2.inlineTokens(text)
    };
    lexer2.state.inLink = false;
    return token;
  }
  return {
    type: "image",
    raw,
    href,
    title,
    text: escape(text)
  };
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
var Tokenizer = class {
  constructor(options2) {
    this.options = options2 || defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim() : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *>[ \t]?/gm, "");
      return {
        type: "blockquote",
        raw: cap[0],
        tokens: this.lexer.blockTokens(text, []),
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine, line, nextLine, rawLine, itemContents, endEarly;
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      while (src) {
        endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        line = cap[2].split("\n", 1)[0];
        nextLine = src.split("\n", 1)[0];
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        blankLine = false;
        if (!line && /^ *$/.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
          while (src) {
            rawLine = src.split("\n", 1)[0];
            line = rawLine;
            if (this.options.pedantic) {
              line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
            }
            if (fencesBeginRegex.test(line)) {
              break;
            }
            if (headingBeginRegex.test(line)) {
              break;
            }
            if (nextBulletRegex.test(line)) {
              break;
            }
            if (hrRegex.test(src)) {
              break;
            }
            if (line.search(/[^ ]/) >= indent || !line.trim()) {
              itemContents += "\n" + line.slice(indent);
            } else if (!blankLine) {
              itemContents += "\n" + line;
            } else {
              break;
            }
            if (!blankLine && !line.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
          }
        }
        if (!list.loose) {
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
          }
        }
        list.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });
        list.raw += raw;
      }
      list.items[list.items.length - 1].raw = raw.trimRight();
      list.items[list.items.length - 1].text = itemContents.trimRight();
      list.raw = list.raw.trimRight();
      const l = list.items.length;
      for (i = 0; i < l; i++) {
        this.lexer.state.top = false;
        list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
        const spacers = list.items[i].tokens.filter((t2) => t2.type === "space");
        const hasMultipleLineBreaks = spacers.every((t2) => {
          const chars = t2.raw.split("");
          let lineBreaks = 0;
          for (const char of chars) {
            if (char === "\n") {
              lineBreaks += 1;
            }
            if (lineBreaks > 1) {
              return true;
            }
          }
          return false;
        });
        if (!list.loose && spacers.length && hasMultipleLineBreaks) {
          list.loose = true;
          list.items[i].loose = true;
        }
      }
      return list;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        raw: cap[0],
        pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
        text: cap[0]
      };
      if (this.options.sanitize) {
        const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
        token.type = "paragraph";
        token.text = text;
        token.tokens = this.lexer.inline(text);
      }
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      if (cap[3])
        cap[3] = cap[3].substring(1, cap[3].length - 1);
      const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
      return {
        type: "def",
        tag,
        raw: cap[0],
        href: cap[2],
        title: cap[3]
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: "table",
        header: splitCells(cap[1]).map((c) => {
          return { text: c };
        }),
        align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : []
      };
      if (item.header.length === item.align.length) {
        item.raw = cap[0];
        let l = item.align.length;
        let i, j, k, row;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = "right";
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = "center";
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = "left";
          } else {
            item.align[i] = null;
          }
        }
        l = item.rows.length;
        for (i = 0; i < l; i++) {
          item.rows[i] = splitCells(item.rows[i], item.header.length).map((c) => {
            return { text: c };
          });
        }
        l = item.header.length;
        for (j = 0; j < l; j++) {
          item.header[j].tokens = this.lexer.inline(item.header[j].text);
        }
        l = item.rows.length;
        for (j = 0; j < l; j++) {
          row = item.rows[j];
          for (k = 0; k < row.length; k++) {
            row[k].tokens = this.lexer.inline(row[k].text);
          }
        }
        return item;
      }
    }
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape(cap[1])
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: this.options.sanitize ? "text" : "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
        title: title ? title.replace(this.rules.inline._escapes, "$1") : title
      }, cap[0], this.lexer);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
      link = links[link.toLowerCase()];
      if (!link || !link.href) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
      return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim)
          continue;
        rLength = rDelim.length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = src.slice(1, lLength + match.index + rLength);
          return {
            type: "em",
            raw: src.slice(0, lLength + match.index + rLength + 1),
            text: text2,
            tokens: this.lexer.inlineTokens(text2)
          };
        }
        const text = src.slice(2, lLength + match.index + rLength - 1);
        return {
          type: "strong",
          raw: src.slice(0, lLength + match.index + rLength + 1),
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src, mangle2) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape(this.options.mangle ? mangle2(cap[1]) : cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src, mangle2) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape(this.options.mangle ? mangle2(cap[0]) : cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + text;
        } else {
          href = text;
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src, smartypants2) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
      } else {
        text = escape(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
};
var block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: noopTest,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block.listItemStart = edit(/^( *)(bull) */).replace("bull", block.bullet).getRegex();
block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
block.normal = merge({}, block);
block.gfm = merge({}, block.normal, {
  table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
});
block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.gfm.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", block.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
block.pedantic = merge({}, block.normal, {
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
});
var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline.escapedEmSt = /\\\*|\\_/g;
inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
inline.emStrong.lDelim = edit(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, "g").replace(/punct/g, inline._punctuation).getRegex();
inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, "g").replace(/punct/g, inline._punctuation).getRegex();
inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
inline.reflink = edit(inline.reflink).replace("label", inline._label).replace("ref", block._label).getRegex();
inline.nolink = edit(inline.nolink).replace("ref", block._label).getRegex();
inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
inline.normal = merge({}, inline);
inline.pedantic = merge({}, inline.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
});
inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});
inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace("{2,}", "*").getRegex(),
  text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
});
function smartypants(text) {
  return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
}
function mangle(text) {
  let out = "", i, ch;
  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = "x" + ch.toString(16);
    }
    out += "&#" + ch + ";";
  }
  return out;
}
var Lexer = class {
  constructor(options2) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options2 || defaults;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  static get rules() {
    return {
      block,
      inline
    };
  }
  static lex(src, options2) {
    const lexer2 = new Lexer(options2);
    return lexer2.lex(src);
  }
  static lexInline(src, options2) {
    const lexer2 = new Lexer(options2);
    return lexer2.inlineTokens(src);
  }
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n");
    this.blockTokens(src, this.tokens);
    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }
    return this.tokens;
  }
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
        return leading + "    ".repeat(tabs.length);
      });
    }
    let token, lastToken, cutSrc, lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          tokens[tokens.length - 1].raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
};
var Renderer = class {
  constructor(options2) {
    this.options = options2 || defaults;
  }
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
  }
  blockquote(quote) {
    return `<blockquote>
${quote}</blockquote>
`;
  }
  html(html) {
    return html;
  }
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id}">${text}</h${level}>
`;
    }
    return `<h${level}>${text}</h${level}>
`;
  }
  hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }
  list(body, ordered, start) {
    const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  listitem(text) {
    return `<li>${text}</li>
`;
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  paragraph(text) {
    return `<p>${text}</p>
`;
  }
  table(header, body) {
    if (body)
      body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow(content) {
    return `<tr>
${content}</tr>
`;
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
    return tag + content + `</${type}>
`;
  }
  strong(text) {
    return `<strong>${text}</strong>`;
  }
  em(text) {
    return `<em>${text}</em>`;
  }
  codespan(text) {
    return `<code>${text}</code>`;
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(text) {
    return `<del>${text}</del>`;
  }
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }
  text(text) {
    return text;
  }
};
var TextRenderer = class {
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
};
var Slugger = class {
  constructor() {
    this.seen = {};
  }
  serialize(value) {
    return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + "-" + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }
  slug(value, options2 = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options2.dryrun);
  }
};
var Parser = class {
  constructor(options2) {
    this.options = options2 || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }
  static parse(tokens, options2) {
    const parser2 = new Parser(options2);
    return parser2.parse(tokens);
  }
  static parseInline(tokens, options2) {
    const parser2 = new Parser(options2);
    return parser2.parseInline(tokens);
  }
  parse(tokens, top = true) {
    let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          out += this.renderer.heading(
            this.parseInline(token.tokens),
            token.depth,
            unescape(this.parseInline(token.tokens, this.textRenderer)),
            this.slugger
          );
          continue;
        }
        case "code": {
          out += this.renderer.code(
            token.text,
            token.lang,
            token.escaped
          );
          continue;
        }
        case "table": {
          header = "";
          cell = "";
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(
              this.parseInline(token.header[j].tokens),
              { header: true, align: token.align[j] }
            );
          }
          header += this.renderer.tablerow(cell);
          body = "";
          l2 = token.rows.length;
          for (j = 0; j < l2; j++) {
            row = token.rows[j];
            cell = "";
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k].tokens),
                { header: false, align: token.align[k] }
              );
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l2 = token.items.length;
          body = "";
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;
            itemBody = "";
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }
          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case "html": {
          out += this.renderer.html(token.text);
          continue;
        }
        case "paragraph": {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case "text": {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === "text") {
            token = tokens[++i];
            body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = "", i, token, ret;
    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          out += renderer.text(token.text);
          break;
        }
        case "html": {
          out += renderer.html(token.text);
          break;
        }
        case "link": {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case "image": {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case "strong": {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case "em": {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case "codespan": {
          out += renderer.codespan(token.text);
          break;
        }
        case "br": {
          out += renderer.br();
          break;
        }
        case "del": {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case "text": {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
};
function marked(src, opt, callback) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  if (typeof opt === "function") {
    callback = opt;
    opt = null;
  }
  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  if (callback) {
    const highlight = opt.highlight;
    let tokens;
    try {
      tokens = Lexer.lex(src, opt);
    } catch (e2) {
      return callback(e2);
    }
    const done = function(err) {
      let out;
      if (!err) {
        try {
          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }
          out = Parser.parse(tokens, opt);
        } catch (e2) {
          err = e2;
        }
      }
      opt.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };
    if (!highlight || highlight.length < 3) {
      return done();
    }
    delete opt.highlight;
    if (!tokens.length)
      return done();
    let pending = 0;
    marked.walkTokens(tokens, function(token) {
      if (token.type === "code") {
        pending++;
        setTimeout(() => {
          highlight(token.text, token.lang, function(err, code) {
            if (err) {
              return done(err);
            }
            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }
            pending--;
            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });
    if (pending === 0) {
      done();
    }
    return;
  }
  function onError(e2) {
    e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e2.message + "", true) + "</pre>";
    }
    throw e2;
  }
  try {
    const tokens = Lexer.lex(src, opt);
    if (opt.walkTokens) {
      if (opt.async) {
        return Promise.all(marked.walkTokens(tokens, opt.walkTokens)).then(() => {
          return Parser.parse(tokens, opt);
        }).catch(onError);
      }
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parse(tokens, opt);
  } catch (e2) {
    onError(e2);
  }
}
marked.options = marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = getDefaults;
marked.defaults = defaults;
marked.use = function(...args) {
  const opts = merge({}, ...args);
  const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
  let hasExtensions;
  args.forEach((pack) => {
    if (pack.extensions) {
      hasExtensions = true;
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error("extension name required");
        }
        if (ext.renderer) {
          const prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
          if (prevRenderer) {
            extensions.renderers[ext.name] = function(...args2) {
              let ret = ext.renderer.apply(this, args2);
              if (ret === false) {
                ret = prevRenderer.apply(this, args2);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) {
          if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) {
            if (ext.level === "block") {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === "inline") {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) {
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
    }
    if (pack.renderer) {
      const renderer = marked.defaults.renderer || new Renderer();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        renderer[prop] = (...args2) => {
          let ret = pack.renderer[prop].apply(renderer, args2);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args2);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        tokenizer[prop] = (...args2) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args2);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args2);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }
    if (pack.walkTokens) {
      const walkTokens2 = marked.defaults.walkTokens;
      opts.walkTokens = function(token) {
        let values = [];
        values.push(pack.walkTokens.call(this, token));
        if (walkTokens2) {
          values = values.concat(walkTokens2.call(this, token));
        }
        return values;
      };
    }
    if (hasExtensions) {
      opts.extensions = extensions;
    }
    marked.setOptions(opts);
  });
};
marked.walkTokens = function(tokens, callback) {
  let values = [];
  for (const token of tokens) {
    values = values.concat(callback.call(marked, token));
    switch (token.type) {
      case "table": {
        for (const cell of token.header) {
          values = values.concat(marked.walkTokens(cell.tokens, callback));
        }
        for (const row of token.rows) {
          for (const cell of row) {
            values = values.concat(marked.walkTokens(cell.tokens, callback));
          }
        }
        break;
      }
      case "list": {
        values = values.concat(marked.walkTokens(token.items, callback));
        break;
      }
      default: {
        if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
          marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            values = values.concat(marked.walkTokens(token[childTokens], callback));
          });
        } else if (token.tokens) {
          values = values.concat(marked.walkTokens(token.tokens, callback));
        }
      }
    }
  }
  return values;
};
marked.parseInline = function(src, opt) {
  if (typeof src === "undefined" || src === null) {
    throw new Error("marked.parseInline(): input parameter is undefined or null");
  }
  if (typeof src !== "string") {
    throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
  }
  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);
  try {
    const tokens = Lexer.lexInline(src, opt);
    if (opt.walkTokens) {
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parseInline(tokens, opt);
  } catch (e2) {
    e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
    if (opt.silent) {
      return "<p>An error occurred:</p><pre>" + escape(e2.message + "", true) + "</pre>";
    }
    throw e2;
  }
};
marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.Tokenizer = Tokenizer;
marked.Slugger = Slugger;
marked.parse = marked;
var options = marked.options;
var setOptions = marked.setOptions;
var use = marked.use;
var walkTokens = marked.walkTokens;
var parseInline = marked.parseInline;
var parser = Parser.parse;
var lexer = Lexer.lex;

// node_modules/vuepress-plugin-comment2/lib/client/components/Waline.js
import { pageviewCount as V } from "@waline/client/dist/pageview";
import "/Users/bytedance/project/faga1.github.io/node_modules/@waline/client/dist/waline.css";
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-plugin-comment2/lib/client/styles/waline.scss";
var D;
var W = "undefined" != typeof window;
var G = () => {
};
function q(e2) {
  return "function" == typeof e2 ? e2() : unref(e2);
}
function J(e2, t2) {
  return function(...n2) {
    e2(() => t2.apply(this, n2), { fn: t2, thisArg: this, args: n2 });
  };
}
W && (null == (D = null == window ? void 0 : window.navigator) ? void 0 : D.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
var K = (e2) => e2();
function Q(e2) {
  return !!getCurrentScope() && (onScopeDispose(e2), true);
}
function Z(e2, t2 = 200, n2 = {}) {
  return J(function(e3, t3 = {}) {
    let n3, l;
    return (o) => {
      const a = q(e3), i = q(t3.maxWait);
      if (n3 && clearTimeout(n3), a <= 0 || void 0 !== i && i <= 0)
        return l && (clearTimeout(l), l = null), o();
      i && !l && (l = setTimeout(() => {
        n3 && clearTimeout(n3), l = null, o();
      }, i)), n3 = setTimeout(() => {
        l && clearTimeout(l), l = null, o();
      }, a);
    };
  }(t2, n2), e2);
}
var Y = Object.getOwnPropertySymbols;
var X = Object.prototype.hasOwnProperty;
var ee = Object.prototype.propertyIsEnumerable;
var te = Object.defineProperty;
var ne = Object.defineProperties;
var le = Object.getOwnPropertyDescriptors;
var oe = Object.getOwnPropertySymbols;
var ae = Object.prototype.hasOwnProperty;
var ie = Object.prototype.propertyIsEnumerable;
var re = (e2, t2, n2) => t2 in e2 ? te(e2, t2, { enumerable: true, configurable: true, writable: true, value: n2 }) : e2[t2] = n2;
function se(e2, t2, n2 = {}) {
  const l = n2, { eventFilter: i } = l, r = ((e3, t3) => {
    var n3 = {};
    for (var l2 in e3)
      ae.call(e3, l2) && t3.indexOf(l2) < 0 && (n3[l2] = e3[l2]);
    if (null != e3 && oe)
      for (var l2 of oe(e3))
        t3.indexOf(l2) < 0 && ie.call(e3, l2) && (n3[l2] = e3[l2]);
    return n3;
  })(l, ["eventFilter"]), { eventFilter: s, pause: c, resume: u, isActive: m } = function(e3 = K) {
    const t3 = ref(true);
    return { isActive: t3, pause: function() {
      t3.value = false;
    }, resume: function() {
      t3.value = true;
    }, eventFilter: (...n3) => {
      t3.value && e3(...n3);
    } };
  }(i), d = function(e3, t3, n3 = {}) {
    const l2 = n3, { eventFilter: o = K } = l2, i2 = ((e4, t4) => {
      var n4 = {};
      for (var l3 in e4)
        X.call(e4, l3) && t4.indexOf(l3) < 0 && (n4[l3] = e4[l3]);
      if (null != e4 && Y)
        for (var l3 of Y(e4))
          t4.indexOf(l3) < 0 && ee.call(e4, l3) && (n4[l3] = e4[l3]);
      return n4;
    })(l2, ["eventFilter"]);
    return watch(e3, J(o, t3), i2);
  }(e2, t2, (v = ((e3, t3) => {
    for (var n3 in t3 || (t3 = {}))
      ae.call(t3, n3) && re(e3, n3, t3[n3]);
    if (oe)
      for (var n3 of oe(t3))
        ie.call(t3, n3) && re(e3, n3, t3[n3]);
    return e3;
  })({}, r), ne(v, le({ eventFilter: s }))));
  var v;
  return { stop: d, pause: c, resume: u, isActive: m };
}
var ce = W ? window : void 0;
var ue = W ? window.document : void 0;
var me = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
var de = "__vueuse_ssr_handlers__";
me[de] = me[de] || {};
var ve = me[de];
var pe = Object.defineProperty;
var ge = Object.getOwnPropertySymbols;
var fe = Object.prototype.hasOwnProperty;
var he = Object.prototype.propertyIsEnumerable;
var ye = (e2, t2, n2) => t2 in e2 ? pe(e2, t2, { enumerable: true, configurable: true, writable: true, value: n2 }) : e2[t2] = n2;
var we = (e2, t2) => {
  for (var n2 in t2 || (t2 = {}))
    fe.call(t2, n2) && ye(e2, n2, t2[n2]);
  if (ge)
    for (var n2 of ge(t2))
      he.call(t2, n2) && ye(e2, n2, t2[n2]);
  return e2;
};
var be = { boolean: { read: (e2) => "true" === e2, write: (e2) => String(e2) }, object: { read: (e2) => JSON.parse(e2), write: (e2) => JSON.stringify(e2) }, number: { read: (e2) => Number.parseFloat(e2), write: (e2) => String(e2) }, any: { read: (e2) => e2, write: (e2) => String(e2) }, string: { read: (e2) => e2, write: (e2) => String(e2) }, map: { read: (e2) => new Map(JSON.parse(e2)), write: (e2) => JSON.stringify(Array.from(e2.entries())) }, set: { read: (e2) => new Set(JSON.parse(e2)), write: (e2) => JSON.stringify(Array.from(e2)) }, date: { read: (e2) => new Date(e2), write: (e2) => e2.toISOString() } };
function ke(e2, t2, n2, l = {}) {
  var i;
  const { flush: r = "pre", deep: s = true, listenToStorageChanges: c = true, writeDefaults: u = true, mergeDefaults: m = false, shallow: d, window: v = ce, eventFilter: p, onError: g = (e3) => {
    console.error(e3);
  } } = l, h2 = (d ? shallowRef : ref)(t2);
  if (!n2)
    try {
      n2 = (ve.getDefaultStorage || (() => {
        var e3;
        return null == (e3 = ce) ? void 0 : e3.localStorage;
      }))();
    } catch (e3) {
      g(e3);
    }
  if (!n2)
    return h2;
  const y = q(t2), w = function(e3) {
    return null == e3 ? "any" : e3 instanceof Set ? "set" : e3 instanceof Map ? "map" : e3 instanceof Date ? "date" : "boolean" == typeof e3 ? "boolean" : "string" == typeof e3 ? "string" : "object" == typeof e3 || Array.isArray(e3) ? "object" : Number.isNaN(e3) ? "any" : "number";
  }(y), b = null != (i = l.serializer) ? i : be[w], { pause: k, resume: C } = se(h2, () => function(t3) {
    try {
      null == t3 ? n2.removeItem(e2) : n2.setItem(e2, b.write(t3));
    } catch (e3) {
      g(e3);
    }
  }(h2.value), { flush: r, deep: s, eventFilter: p });
  return v && c && function(...e3) {
    let t3, n3, l2, o;
    if ("string" == typeof e3[0] ? ([n3, l2, o] = e3, t3 = ce) : [t3, n3, l2, o] = e3, !t3)
      return G;
    let i2 = G;
    const r2 = watch(() => function(e4) {
      var t4;
      const n4 = q(e4);
      return null != (t4 = null == n4 ? void 0 : n4.$el) ? t4 : n4;
    }(t3), (e4) => {
      i2(), e4 && (e4.addEventListener(n3, l2, o), i2 = () => {
        e4.removeEventListener(n3, l2, o), i2 = G;
      });
    }, { immediate: true, flush: "post" }), s2 = () => {
      r2(), i2();
    };
    Q(s2);
  }(v, "storage", I), I(), h2;
  function I(t3) {
    t3 && t3.key !== e2 || (h2.value = function(t4) {
      if (!t4 || t4.key === e2) {
        k();
        try {
          const l2 = t4 ? t4.newValue : n2.getItem(e2);
          if (null == l2)
            return u && null !== y && n2.setItem(e2, b.write(y)), y;
          if (!t4 && m) {
            const e3 = b.read(l2);
            return "function" == typeof m ? m(e3, y) : "object" !== w || Array.isArray(e3) ? e3 : we(we({}, y), e3);
          }
          return "string" != typeof l2 ? l2 : b.read(l2);
        } catch (e3) {
          g(e3);
        } finally {
          C();
        }
      }
    }(t3));
  }
}
var Ce;
var Ie;
var $e = Object.defineProperty;
var je = Object.getOwnPropertySymbols;
var Le = Object.prototype.hasOwnProperty;
var Se = Object.prototype.propertyIsEnumerable;
var Ee = (e2, t2, n2) => t2 in e2 ? $e(e2, t2, { enumerable: true, configurable: true, writable: true, value: n2 }) : e2[t2] = n2;
(Ie = Ce || (Ce = {})).UP = "UP", Ie.RIGHT = "RIGHT", Ie.DOWN = "DOWN", Ie.LEFT = "LEFT", Ie.NONE = "NONE";
var xe = 0;
var Oe = Object.defineProperty;
var Re = Object.getOwnPropertySymbols;
var Ae = Object.prototype.hasOwnProperty;
var ze = Object.prototype.propertyIsEnumerable;
var Me = (e2, t2, n2) => t2 in e2 ? Oe(e2, t2, { enumerable: true, configurable: true, writable: true, value: n2 }) : e2[t2] = n2;
((e2, t2) => {
  for (var n2 in t2 || (t2 = {}))
    Ae.call(t2, n2) && Me(e2, n2, t2[n2]);
  if (Re)
    for (var n2 of Re(t2))
      ze.call(t2, n2) && Me(e2, n2, t2[n2]);
})({ linear: function(e2) {
  return e2;
} }, { easeInSine: [0.12, 0, 0.39, 0], easeOutSine: [0.61, 1, 0.88, 1], easeInOutSine: [0.37, 0, 0.63, 1], easeInQuad: [0.11, 0, 0.5, 0], easeOutQuad: [0.5, 1, 0.89, 1], easeInOutQuad: [0.45, 0, 0.55, 1], easeInCubic: [0.32, 0, 0.67, 0], easeOutCubic: [0.33, 1, 0.68, 1], easeInOutCubic: [0.65, 0, 0.35, 1], easeInQuart: [0.5, 0, 0.75, 0], easeOutQuart: [0.25, 1, 0.5, 1], easeInOutQuart: [0.76, 0, 0.24, 1], easeInQuint: [0.64, 0, 0.78, 0], easeOutQuint: [0.22, 1, 0.36, 1], easeInOutQuint: [0.83, 0, 0.17, 1], easeInExpo: [0.7, 0, 0.84, 0], easeOutExpo: [0.16, 1, 0.3, 1], easeInOutExpo: [0.87, 0, 0.13, 1], easeInCirc: [0.55, 0, 1, 0.45], easeOutCirc: [0, 0.55, 0.45, 1], easeInOutCirc: [0.85, 0, 0.15, 1], easeInBack: [0.36, 0, 0.66, -0.56], easeOutBack: [0.34, 1.56, 0.64, 1], easeInOutBack: [0.68, -0.6, 0.32, 1.6] });
var Pe = ({ size: e2 }) => h("svg", { width: e2, height: e2, viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid" }, h("circle", { cx: 50, cy: 50, fill: "none", stroke: "currentColor", strokeWidth: "4", r: "40", "stroke-dasharray": "85 30" }, h("animateTransform", { attributeName: "transform", type: "rotate", repeatCount: "indefinite", dur: "1s", values: "0 50 50;360 50 50", keyTimes: "0;1" })));
var Ue = defineComponent({ name: "ImageWall", components: { LoadingIcon: Pe }, props: { items: { type: Array, default: () => [] }, columnWidth: { type: Number, default: 300 }, gap: { type: Number, default: 0 } }, emits: ["insert"], setup(e2) {
  let t2 = null;
  const n2 = ref(null), l = ref({}), s = ref([]), c = () => {
    const t3 = Math.floor((n2.value.getBoundingClientRect().width + e2.gap) / (e2.columnWidth + e2.gap));
    return t3 > 0 ? t3 : 1;
  }, u = async (t3) => {
    var _a;
    if (t3 >= e2.items.length)
      return;
    await nextTick();
    const l2 = Array.from(((_a = n2.value) == null ? void 0 : _a.children) || []).reduce((e3, t4) => t4.getBoundingClientRect().height < e3.getBoundingClientRect().height ? t4 : e3);
    s.value[Number(l2.dataset.index)].push(t3), await u(t3 + 1);
  }, m = async (e3 = false) => {
    if (s.value.length === c() && !e3)
      return;
    var t3;
    s.value = (t3 = c(), new Array(t3).fill(null).map(() => []));
    const n3 = window.scrollY;
    await u(0), window.scrollTo({ top: n3 });
  };
  return watch(() => [e2.items], () => {
    l.value = {}, m(true);
  }), watch(() => [e2.columnWidth, e2.gap], () => m()), onMounted(() => {
    m(true), t2 = new ResizeObserver(() => m()), t2.observe(n2.value);
  }), onBeforeUnmount(() => t2.unobserve(n2.value)), { columns: s, state: l, wall: n2 };
} });
var Ne = (e2, t2) => {
  const n2 = e2.__vccOpts || e2;
  for (const [e3, l] of t2)
    n2[e3] = l;
  return n2;
};
var Te = ["data-index"];
var Be = ["src", "title", "onLoad", "onClick"];
var He = Ne(Ue, [["render", function(e2, t2, n2, l, o, a) {
  const i = resolveComponent("LoadingIcon");
  return openBlock(), createElementBlock("div", { ref: "wall", class: "wl-gallery", style: normalizeStyle({ gap: `${e2.gap}px` }) }, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.columns, (t3, n3) => (openBlock(), createElementBlock("div", { key: n3, class: "wl-gallery-column", "data-index": n3, style: normalizeStyle({ gap: `${e2.gap}px` }) }, [(openBlock(true), createElementBlock(Fragment, null, renderList(t3, (t4) => (openBlock(), createElementBlock(Fragment, { key: t4 }, [e2.state[e2.items[t4].src] ? createCommentVNode("v-if", true) : (openBlock(), createBlock(i, { key: 0, size: 36, style: { margin: "20px auto" } })), createBaseVNode("img", { class: "wl-gallery-item", src: e2.items[t4].src, title: e2.items[t4].title, loading: "lazy", onLoad: (n4) => e2.state[e2.items[t4].src] = true, onClick: (n4) => e2.$emit("insert", `![](${e2.items[t4].src})`) }, null, 40, Be)], 64))), 128))], 12, Te))), 128))], 4);
}], ["__file", "ImageWall.vue"]]);
var Ve = ["nick", "mail", "link"];
var _e = (e2) => e2.filter((e3) => Ve.includes(e3));
var Fe = (e2) => new Promise((t2, n2) => {
  if (e2.size > 128e3)
    return n2(new Error("File too large! File size limit 128KB"));
  const l = new FileReader();
  l.readAsDataURL(e2), l.onload = () => {
    var _a;
    return t2(((_a = l.result) == null ? void 0 : _a.toString()) || "");
  }, l.onerror = n2;
});
var De = (e2) => true === e2 ? '<p class="wl-tex">Tex is not available in preview</p>' : '<span class="wl-tex">Tex is not available in preview</span>';
var We = () => {
  const e2 = { next: "" }, t2 = ({ keyword: e3, pos: t3 }) => {
    const n2 = new URLSearchParams("media_filter=minimal");
    return n2.set("key", "PAY5JLFIH6V6"), n2.set("limit", "20"), n2.set("pos", t3 || ""), n2.set("q", e3), fetch(`https://g.tenor.com/v1/search?${n2.toString()}`, { headers: { "Content-Type": "application/json" } }).then((e4) => e4.json()).catch(() => ({ next: t3 || "", results: [] }));
  };
  return { search: (n2 = "") => t2({ keyword: n2 }).then((t3) => (e2.next = t3.next, t3.results.map((e3) => ({ title: e3.title, src: e3.media[0].tinygif.url })))), more: (n2) => t2({ keyword: n2, pos: e2.next }).then((t3) => (e2.next = t3.next, t3.results.map((e3) => ({ title: e3.title, src: e3.media[0].tinygif.url })))) };
};
var Ge = new RegExp(`(${/[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/.source}|${/</.source})|((?:${/(?:^|\s)\/\/(.+?)$/gm.source})|(?:${/\/\*([\S\s]*?)\*\//gm.source}))`, "gmi");
var qe = ["23AC69", "91C132", "F19726", "E8552D", "1AAB8E", "E1147F", "2980C1", "1BA1E6", "9FA0A0", "F19726", "E30B20", "E30B20", "A3338B"];
var Je = {};
var Ke = (e2) => {
  let t2 = 0;
  return e2.replace(Ge, (e3, n2, l) => {
    if (l)
      return `<span style="color: slategray">${l}</span>`;
    if ("<" === n2)
      return "&lt;";
    let o;
    Je[n2] ? o = Je[n2] : (o = qe[t2], Je[n2] = o);
    const a = `<span style="color: #${o}">${n2}</span>`;
    return t2 = ++t2 % qe.length, a;
  });
};
var Qe = ["nick", "nickError", "mail", "mailError", "link", "optional", "placeholder", "sofa", "submit", "like", "cancelLike", "reply", "cancelReply", "comment", "refresh", "more", "preview", "emoji", "uploadImage", "seconds", "minutes", "hours", "days", "now", "uploading", "login", "logout", "admin", "sticky", "word", "wordHint", "anonymous", "level0", "level1", "level2", "level3", "level4", "level5", "gif", "gifSearchPlaceholder", "profile", "approved", "waiting", "spam", "unsticky", "oldest", "latest", "hottest"];
var Ze = (e2) => Object.fromEntries(e2.map((e3, t2) => [Qe[t2], e3]));
var Ye = Ze(["NickName", "NickName cannot be less than 3 bytes.", "E-Mail", "Please confirm your email address.", "Website", "Optional", "Comment here...", "No comment yet.", "Submit", "Like", "Cancel like", "Reply", "Cancel reply", "Comments", "Refresh", "Load More...", "Preview", "Emoji", "Upload Image", "seconds ago", "minutes ago", "hours ago", "days ago", "just now", "Uploading", "Login", "logout", "Admin", "Sticky", "Words", "Please input comments between $0 and $1 words!\n Current word number: $2", "Anonymous", "Dwarves", "Hobbits", "Ents", "Wizards", "Elves", "Maiar", "GIF", "Search GIF", "Profile", "Approved", "Waiting", "Spam", "Unsticky", "Oldest", "Latest", "Hottest"]);
var Xe = Ze(["\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0", "3\u30D0\u30A4\u30C8\u4EE5\u4E0A\u306E\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044.", "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044.", "\u30B5\u30A4\u30C8", "\u30AA\u30D7\u30B7\u30E7\u30F3", "\u3053\u3053\u306B\u30B3\u30E1\u30F3\u30C8", "\u30B3\u30E1\u30F3\u30C8\u3057\u307E\u3057\u3087\u3046~", "\u63D0\u51FA\u3059\u308B", "Like", "Cancel like", "\u8FD4\u4FE1\u3059\u308B", "\u30AD\u30E3\u30F3\u30BB\u30EB", "\u30B3\u30E1\u30F3\u30C8", "\u66F4\u65B0", "\u3055\u3089\u306B\u8AAD\u307F\u8FBC\u3080", "\u30D7\u30EC\u30D3\u30E5\u30FC", "\u7D75\u6587\u5B57", "\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9", "\u79D2\u524D", "\u5206\u524D", "\u6642\u9593\u524D", "\u65E5\u524D", "\u305F\u3063\u3060\u4ECA", "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9", "\u30ED\u30B0\u30A4\u30F3\u3059\u308B", "\u30ED\u30B0\u30A2\u30A6\u30C8", "\u7BA1\u7406\u8005", "\u30C8\u30C3\u30D7\u306B\u7F6E\u304F", "\u30EF\u30FC\u30C9", "\u30B3\u30E1\u30F3\u30C8\u306F $0 \u304B\u3089 $1 \u30EF\u30FC\u30C9\u306E\u9593\u3067\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093!\n \u73FE\u5728\u306E\u5358\u8A9E\u756A\u53F7: $2", "\u533F\u540D", "\u3046\u3048\u306B\u3093", "\u306A\u304B\u306B\u3093", "\u3057\u3082\u304A\u3057", "\u7279\u306B\u3057\u3082\u304A\u3057", "\u304B\u3052", "\u306A\u306C\u3057", "GIF", "\u63A2\u3059 GIF", "\u500B\u4EBA\u60C5\u5831", "\u627F\u8A8D\u6E08\u307F", "\u5F85\u3063\u3066\u3044\u308B", "\u30B9\u30D1\u30E0", "\u3079\u305F\u3064\u304B\u306A\u3044", "\u9006\u9806", "\u6B63\u9806", "\u4EBA\u6C17\u9806"]);
var et = Ze(["\u6635\u79F0", "\u6635\u79F0\u4E0D\u80FD\u5C11\u4E8E3\u4E2A\u5B57\u7B26", "\u90AE\u7BB1", "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u4EF6\u5730\u5740", "\u7F51\u5740", "\u53EF\u9009", "\u6B22\u8FCE\u8BC4\u8BBA", "\u6765\u53D1\u8BC4\u8BBA\u5427~", "\u63D0\u4EA4", "\u559C\u6B22", "\u53D6\u6D88\u559C\u6B22", "\u56DE\u590D", "\u53D6\u6D88\u56DE\u590D", "\u8BC4\u8BBA", "\u5237\u65B0", "\u52A0\u8F7D\u66F4\u591A...", "\u9884\u89C8", "\u8868\u60C5", "\u4E0A\u4F20\u56FE\u7247", "\u79D2\u524D", "\u5206\u949F\u524D", "\u5C0F\u65F6\u524D", "\u5929\u524D", "\u521A\u521A", "\u6B63\u5728\u4E0A\u4F20", "\u767B\u5F55", "\u9000\u51FA", "\u535A\u4E3B", "\u7F6E\u9876", "\u5B57", "\u8BC4\u8BBA\u5B57\u6570\u5E94\u5728 $0 \u5230 $1 \u5B57\u4E4B\u95F4\uFF01\n\u5F53\u524D\u5B57\u6570\uFF1A$2", "\u533F\u540D", "\u6F5C\u6C34", "\u5192\u6CE1", "\u5410\u69FD", "\u6D3B\u8DC3", "\u8BDD\u75E8", "\u4F20\u8BF4", "\u8868\u60C5\u5305", "\u641C\u7D22\u8868\u60C5\u5305", "\u4E2A\u4EBA\u8D44\u6599", "\u901A\u8FC7", "\u5F85\u5BA1\u6838", "\u5783\u573E", "\u53D6\u6D88\u7F6E\u9876", "\u6309\u5012\u5E8F", "\u6309\u6B63\u5E8F", "\u6309\u70ED\u5EA6"]);
var tt = Ze(["\u66B1\u7A31", "\u66B1\u7A31\u4E0D\u80FD\u5C11\u65BC3\u500B\u5B57\u5143", "\u90F5\u7BB1", "\u8ACB\u586B\u5BEB\u6B63\u78BA\u7684\u90F5\u4EF6\u5730\u5740", "\u7DB2\u5740", "\u53EF\u9078", "\u6B61\u8FCE\u8A55\u8AD6", "\u4F86\u767C\u8A55\u8AD6\u5427~", "\u63D0\u4EA4", "\u559C\u6B61", "\u53D6\u6D88\u559C\u6B61", "\u56DE\u8986", "\u53D6\u6D88\u56DE\u8986", "\u8A55\u8AD6", "\u5237\u65B0", "\u8F09\u5165\u66F4\u591A...", "\u9810\u89BD", "\u8868\u60C5", "\u4E0A\u50B3\u5716\u7247", "\u79D2\u524D", "\u5206\u9418\u524D", "\u5C0F\u6642\u524D", "\u5929\u524D", "\u525B\u525B", "\u6B63\u5728\u4E0A\u50B3", "\u767B\u9304", "\u9000\u51FA", "\u535A\u4E3B", "\u7F6E\u9802", "\u5B57", "\u8A55\u8AD6\u5B57\u6578\u61C9\u5728 $0 \u5230 $1 \u5B57\u4E4B\u9593\uFF01\n\u7576\u524D\u5B57\u6578\uFF1A$2", "\u533F\u540D", "\u6F5B\u6C34", "\u5192\u6CE1", "\u5410\u69FD", "\u6D3B\u8E8D", "\u8A71\u7646", "\u50B3\u8AAA", "\u8868\u60C5\u5305", "\u641C\u7D22\u8868\u60C5\u5305", "\u500B\u4EBA\u8CC7\u6599", "\u901A\u904E", "\u5F85\u5BE9\u6838", "\u5783\u573E", "\u53D6\u6D88\u7F6E\u9802", "\u6309\u5012\u5E8F", "\u6309\u6B63\u5E8F", "\u6309\u71B1\u5EA6"]);
var nt = Ze(["Apelido", "Apelido n\xE3o pode ser menor que 3 bytes.", "E-Mail", "Por favor, confirme seu endere\xE7o de e-mail.", "Website", "Opcional", "Comente aqui...", "Nenhum coment\xE1rio, ainda.", "Enviar", "Like", "Cancel like", "Responder", "Cancelar resposta", "Coment\xE1rios", "Refrescar", "Carregar Mais...", "Visualizar", "Emoji", "Enviar Imagem", "segundos atr\xE1s", "minutos atr\xE1s", "horas atr\xE1s", "dias atr\xE1s", "agora mesmo", "Enviando", "Entrar", "Sair", "Admin", "Sticky", "Palavras", "Favor enviar coment\xE1rio com $0 a $1 palavras!\n N\xFAmero de palavras atuais: $2", "An\xF4nimo", "Dwarves", "Hobbits", "Ents", "Wizards", "Elves", "Maiar", "GIF", "Pesquisar GIF", "informa\xE7\xE3o pessoal", "Aprovado", "Espera", "Spam", "Unsticky", "Mais velho", "Mais recentes", "Mais quente"]);
var lt = Ze(["\u041F\u0441\u0435\u0432\u0434\u043E\u043D\u0438\u043C", "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435 3 \u0431\u0430\u0439\u0442.", "\u042D\u043B. \u0430\u0434\u0440\u0435\u0441", "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0432\u0430\u0448\u0435\u0439 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B.", "\u0412\u0435\u0431-\u0441\u0430\u0439\u0442", "\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439", "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u0437\u0434\u0435\u0441\u044C...", "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432.", "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C", "Like", "Cancel like", "\u041E\u0442\u0432\u0435\u0447\u0430\u0442\u044C", "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0442\u0432\u0435\u0442", "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438", "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C", "\u0417\u0430\u0433\u0440\u0443\u0437\u0438 \u0431\u043E\u043B\u044C\u0448\u0435...", "\u041F\u0440\u0435\u0432\u044C\u044E", "\u044D\u043C\u043E\u0434\u0437\u0438", "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435", "\u0441\u0435\u043A\u0443\u043D\u0434 \u043D\u0430\u0437\u0430\u0434", "\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043C\u0438\u043D\u0443\u0442 \u043D\u0430\u0437\u0430\u0434", "\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0447\u0430\u0441\u043E\u0432 \u043D\u0430\u0437\u0430\u0434", "\u0434\u043D\u0435\u0439 \u043D\u0430\u0437\u0430\u0434", "\u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441", "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F", "\u0412\u044B\u0445\u043E\u0434 \u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043C\u044B", "\u0410\u0434\u043C\u0438\u043D", "\u041B\u0438\u043F\u043A\u0438\u0439", "\u0421\u043B\u043E\u0432\u0430", "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043E\u0442 $0 \u0434\u043E $1 \u0441\u043B\u043E\u0432!\n\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0441\u043B\u043E\u0432\u0430: $2", "\u0410\u043D\u043E\u043D\u0438\u043C\u043D\u044B\u0439", "Dwarves", "Hobbits", "Ents", "Wizards", "Elves", "Maiar", "GIF", "\u041F\u043E\u0438\u0441\u043A GIF", "\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435", "\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u044B\u0439", "\u041E\u0436\u0438\u0434\u0430\u044E\u0449\u0438\u0439", "\u0421\u043F\u0430\u043C", "\u041D\u0435\u043B\u0438\u043F\u043A\u0438\u0439", "\u0441\u0430\u043C\u044B\u0439 \u0441\u0442\u0430\u0440\u044B\u0439", "\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439", "\u0441\u0430\u043C\u044B\u0439 \u0433\u043E\u0440\u044F\u0447\u0438\u0439"]);
var ot = { zh: et, "zh-cn": et, "zh-CN": et, "zh-tw": tt, "zh-TW": tt, en: Ye, "en-US": Ye, "en-us": Ye, jp: Xe, "jp-jp": Xe, "jp-JP": Xe, "pt-br": nt, "pt-BR": nt, ru: lt, "ru-ru": lt, "ru-RU": lt };
var at = (e2) => {
  try {
    e2 = decodeURI(e2);
  } catch (e3) {
  }
  return e2;
};
var it = (e2 = "") => e2.replace(/\/$/u, "");
var rt = (e2) => /^(https?:)?\/\//.test(e2);
var st = (e2) => {
  const t2 = it(e2);
  return rt(t2) ? t2 : `https://${t2}`;
};
var ct = (e2) => Array.isArray(e2) ? e2 : !!e2 && [0, e2];
var ut = (e2, t2) => "function" == typeof e2 ? e2 : false !== e2 && t2;
var mt = "{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bgcolor:#1e1e1e;--waline-bgcolor-light:#272727;--waline-bgcolor-hover: #444;--waline-border-color:#333;--waline-disable-bgcolor:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bgcolor:#272727;--waline-info-color:#666}";
var dt = (e2, t2) => {
  let n2 = e2.toString();
  for (; n2.length < t2; )
    n2 = "0" + n2;
  return n2;
};
var vt = (e2, t2 = "", n2 = "", l = "") => `${t2 ? `${t2}/` : ""}${n2}${e2}${l ? `.${l}` : ""}`;
var pt = { "Content-Type": "application/json" };
var gt = ({ serverURL: e2, lang: t2, token: n2, objectId: l, ...o }) => fetch(`${e2}/comment/${l}?lang=${t2}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${n2}` }, body: JSON.stringify(o) }).then((e3) => e3.json());
var ft = (e2) => e2.type.includes("image");
var ht = (e2) => {
  const t2 = Array.from(e2).find(ft);
  return t2 ? t2.getAsFile() : null;
};
var yt = /\$.*?\$/;
var wt = /^\$(.*?)\$/;
var bt = /^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/;
var kt = (e2 = "", t2 = {}) => e2.replace(/:(.+?):/g, (e3, n2) => t2[n2] ? `<img class="wl-emoji" src="${t2[n2]}" alt="${n2}">` : e3);
var Ct = null;
var It = () => Ct || (Ct = ke("WALINE_USER", {}));
var $t = null;
var jt = () => $t || ($t = ke("WALINE_LIKE", []));
var Lt = defineComponent({ name: "CommentBox", components: { CloseIcon: ({ size: e2 }) => h("svg", { class: "wl-close-icon", viewBox: "0 0 1024 1024", width: e2, height: e2 }, [h("path", { d: "M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z", fill: "currentColor" }), h("path", { d: "m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z", fill: "#888" })]), EmojiIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, h("path", { d: "M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z", fill: "currentColor" })), ImageIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [h("path", { d: "M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z", fill: "currentColor" }), h("path", { d: "M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z", fill: "currentColor" })]), ImageWall: He, MarkdownIcon: () => h("svg", { width: "16", height: "16", ariaHidden: "true" }, h("path", { d: "M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z", fill: "currentColor" })), PreviewIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [h("path", { d: "M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0", fill: "currentColor" }), h("path", { d: "M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0", fill: "currentColor" })]), LoadingIcon: Pe, GifIcon: () => h("svg", { width: 24, height: 24, fill: "currentcolor", viewBox: "0 0 24 24" }, [h("path", { style: "transform: translateY(0.5px)", d: "M18.968 10.5H15.968V11.484H17.984V12.984H15.968V15H14.468V9H18.968V10.5V10.5ZM8.984 9C9.26533 9 9.49967 9.09367 9.687 9.281C9.87433 9.46833 9.968 9.70267 9.968 9.984V10.5H6.499V13.5H8.468V12H9.968V14.016C9.968 14.2973 9.87433 14.5317 9.687 14.719C9.49967 14.9063 9.26533 15 8.984 15H5.984C5.70267 15 5.46833 14.9063 5.281 14.719C5.09367 14.5317 5 14.2973 5 14.016V9.985C5 9.70367 5.09367 9.46933 5.281 9.282C5.46833 9.09467 5.70267 9.001 5.984 9.001H8.984V9ZM11.468 9H12.968V15H11.468V9V9Z" }), h("path", { d: "M18.5 3H5.75C3.6875 3 2 4.6875 2 6.75V18C2 20.0625 3.6875 21.75 5.75 21.75H18.5C20.5625 21.75 22.25 20.0625 22.25 18V6.75C22.25 4.6875 20.5625 3 18.5 3ZM20.75 18C20.75 19.2375 19.7375 20.25 18.5 20.25H5.75C4.5125 20.25 3.5 19.2375 3.5 18V6.75C3.5 5.5125 4.5125 4.5 5.75 4.5H18.5C19.7375 4.5 20.75 5.5125 20.75 6.75V18Z" })]) }, props: { rootId: { type: String, default: "" }, replyId: { type: String, default: "" }, replyUser: { type: String, default: "" }, edit: { type: Object, default: null } }, emits: ["submit", "cancel-reply", "cancel-edit"], setup(e2, { emit: t2 }) {
  const n2 = inject("config"), l = ke("WALINE_COMMENT_BOX_EDITOR", ""), r = ke("WALINE_USER_META", { nick: "", mail: "", link: "" }), s = It(), v = ref({}), p = ref(null), g = ref(null), f2 = ref(null), h2 = ref(null), y = ref(null), w = ref(null), b = ref(null), k = ref({ tabs: [], map: {} }), C = ref(0), I = ref(false), $ = ref(false), j = ref(false), L = ref(""), S = ref(0), E = reactive({ loading: true, list: [] }), x = ref(0), O = ref(false), R = ref(""), A = ref(false), z = computed(() => n2.value.locale), M = computed(() => {
    var _a;
    return Boolean((_a = s.value) == null ? void 0 : _a.token);
  }), P = computed(() => false !== n2.value.imageUploader), U = (e3) => {
    const t3 = p.value, n3 = t3.selectionStart, o = t3.selectionEnd || 0, a = t3.scrollTop;
    l.value = t3.value.substring(0, n3) + e3 + t3.value.substring(o, t3.value.length), t3.focus(), t3.selectionStart = n3 + e3.length, t3.selectionEnd = n3 + e3.length, t3.scrollTop = a;
  }, N = (e3) => {
    const t3 = `![${n2.value.locale.uploading} ${e3.name}]()`;
    return U(t3), Promise.resolve().then(() => n2.value.imageUploader(e3)).then((n3) => {
      l.value = l.value.replace(t3, `\r
![${e3.name}](${n3})`);
    }).catch((e4) => {
      alert(e4.message), l.value = l.value.replace(t3, "");
    });
  }, T = () => {
    var _a, _b, _c, _d, _e2;
    const { serverURL: o, lang: a, login: i, wordLimit: c, requiredMeta: u } = n2.value, m = { comment: R.value, nick: r.value.nick, mail: r.value.mail, link: r.value.link, ua: navigator.userAgent, url: n2.value.path };
    if ((_a = s.value) == null ? void 0 : _a.token)
      m.nick = s.value.display_name, m.mail = s.value.email, m.link = s.value.url;
    else {
      if ("force" === i)
        return;
      if (u.indexOf("nick") > -1 && !m.nick)
        return (_b = v.value.nick) == null ? void 0 : _b.focus(), alert(z.value.nickError);
      if (u.indexOf("mail") > -1 && !m.mail || m.mail && !/^\w(?:[\w._-]*\w)?@(?:\w(?:[\w-]*\w)?\.)*\w+$/.exec(m.mail))
        return (_c = v.value.mail) == null ? void 0 : _c.focus(), alert(z.value.mailError);
      if (!m.comment)
        return void ((_d = p.value) == null ? void 0 : _d.focus());
      m.nick || (m.nick = z.value.anonymous);
    }
    if (!O.value)
      return alert(z.value.wordHint.replace("$0", c[0].toString()).replace("$1", c[1].toString()).replace("$2", S.value.toString()));
    m.comment = kt(m.comment, k.value.map), e2.replyId && e2.rootId ? (m.pid = e2.replyId, m.rid = e2.rootId, m.at = e2.replyUser) : e2.edit && (m.eid = e2.edit.objectId), A.value = true, (({ serverURL: e3, lang: t3, token: n3, comment: l2 }) => {
      const o2 = { "Content-Type": "application/json" };
      return n3 && (o2.Authorization = `Bearer ${n3}`), l2.eid ? fetch(`${e3}/comment/${l2.eid}?lang=${t3}`, { method: "PUT", headers: o2, body: JSON.stringify(l2) }).then((e4) => e4.json()) : fetch(`${e3}/comment?lang=${t3}`, { method: "POST", headers: o2, body: JSON.stringify(l2) }).then((e4) => e4.json());
    })({ serverURL: o, lang: a, token: (_e2 = s.value) == null ? void 0 : _e2.token, comment: m }).then((n3) => {
      var _a2;
      if (A.value = false, n3.errmsg)
        return alert(n3.errmsg);
      t2("submit", n3.data), l.value = "", L.value = "", e2.replyId && t2("cancel-reply"), ((_a2 = e2.edit) == null ? void 0 : _a2.objectId) && t2("cancel-edit");
    }).catch((e3) => {
      A.value = false, alert(e3.message);
    });
  }, V2 = (e3) => {
    f2.value.contains(e3.target) || h2.value.contains(e3.target) || (I.value = false), y.value.contains(e3.target) || w.value.contains(e3.target) || ($.value = false);
  }, _ = async (e3) => {
    var _a;
    const { scrollTop: t3, clientHeight: l2, scrollHeight: o } = e3.target, a = (l2 + t3) / o, i = n2.value.search, r2 = ((_a = b.value) == null ? void 0 : _a.value) || "";
    a < 0.9 || E.loading || (E.loading = true, E.list.push(...i.more ? await i.more(r2, E.list.length) : await i.search(r2)), E.loading = false, setTimeout(() => {
      e3.target.scrollTop = t3;
    }, 50));
  }, F = Z((e3) => {
    E.list = [], _(e3);
  }, 300);
  watch([n2, S], ([e3, t3]) => {
    const { wordLimit: n3 } = e3;
    n3 ? t3 < n3[0] && 0 !== n3[0] ? (x.value = n3[0], O.value = false) : t3 > n3[1] ? (x.value = n3[1], O.value = false) : (x.value = n3[1], O.value = true) : (x.value = 0, O.value = true);
  }, { immediate: true }), watch($, async (e3) => {
    if (!e3)
      return;
    const t3 = n2.value.search;
    b.value && (b.value.value = ""), E.loading = true, E.list = t3.default ? await t3.default() : await t3.search(""), E.loading = false;
  });
  const D2 = ({ data: e3 }) => {
    e3 && "profile" === e3.type && (s.value = { ...s.value, ...e3.data }, [localStorage, sessionStorage].filter((e4) => e4.getItem("WALINE_USER")).forEach((e4) => e4.setItem("WALINE_USER", JSON.stringify(s))));
  };
  return onMounted(() => {
    var _a;
    document.body.addEventListener("click", V2), window.addEventListener("message", D2), ((_a = e2.edit) == null ? void 0 : _a.objectId) && (l.value = e2.edit.orig), watch(() => l.value, (e3) => {
      const { highlighter: t3, texRenderer: l2 } = n2.value;
      R.value = e3, L.value = ((e4, { emojiMap: t4, highlighter: n3, texRenderer: l3 }) => {
        if (marked.setOptions({ highlight: n3 || void 0, breaks: true, smartLists: true, smartypants: true }), l3) {
          const e5 = ((e6) => [{ name: "blockMath", level: "block", tokenizer(t5) {
            const n4 = bt.exec(t5);
            if (null !== n4)
              return { type: "html", raw: n4[0], text: e6(true, n4[1]) };
          } }, { name: "inlineMath", level: "inline", start(e7) {
            const t5 = e7.search(yt);
            return -1 !== t5 ? t5 : e7.length;
          }, tokenizer(t5) {
            const n4 = wt.exec(t5);
            if (null !== n4)
              return { type: "html", raw: n4[0], text: e6(false, n4[1]) };
          } }])(l3);
          marked.use({ extensions: e5 });
        }
        return marked.parse(kt(e4, t4));
      })(e3, { emojiMap: k.value.map, highlighter: t3, texRenderer: l2 }), S.value = ((e4) => ((e5) => e5.match(/[\w\d\s\u00C0-\u024F]+/giu) || [])(e4).reduce((e5, t4) => e5 + ("" === t4.trim() ? 0 : t4.trim().split(/\s+/u).length), 0) + ((e5) => e5.match(/[\u4E00-\u9FA5]/gu) || [])(e4).length)(e3), e3 ? autosize_esm_default(p.value) : autosize_esm_default.destroy(p.value);
    }, { immediate: true }), watch(() => n2.value.emoji, (e3) => {
      return (t3 = Array.isArray(e3) ? e3 : [], Promise.all(t3.map((e4) => "string" == typeof e4 ? ((e5) => {
        const t4 = ke("WALINE_EMOJI", {}), n3 = Boolean(/@[0-9]+\.[0-9]+\.[0-9]+/.test(e5));
        if (n3) {
          const n4 = t4.value[e5];
          if (n4)
            return Promise.resolve(n4);
        }
        return fetch(`${e5}/info.json`).then((e6) => e6.json()).then((l2) => {
          const o = { folder: e5, ...l2 };
          return n3 && (t4.value[e5] = o), o;
        });
      })(it(e4)) : Promise.resolve(e4))).then((e4) => {
        const t4 = { tabs: [], map: {} };
        return e4.forEach((e5) => {
          const { name: n3, folder: l2, icon: o, prefix: a, type: i, items: r2 } = e5;
          t4.tabs.push({ name: n3, icon: vt(o, l2, a, i), items: r2.map((e6) => {
            const n4 = `${a || ""}${e6}`;
            return t4.map[n4] = vt(e6, l2, a, i), n4;
          }) });
        }), t4;
      })).then((e4) => {
        k.value = e4;
      });
      var t3;
    }, { immediate: true });
  }), onUnmounted(() => {
    document.body.removeEventListener("click", V2), window.removeEventListener("message", D2);
  }), { config: n2, locale: z, insert: U, onChange: () => {
    const e3 = g.value;
    e3.files && P.value && N(e3.files[0]).then(() => {
      e3.value = "";
    });
  }, onDrop: (e3) => {
    var _a;
    if ((_a = e3.dataTransfer) == null ? void 0 : _a.items) {
      const t3 = ht(e3.dataTransfer.items);
      t3 && P.value && (N(t3), e3.preventDefault());
    }
  }, onKeyDown: (e3) => {
    const t3 = e3.key;
    (e3.ctrlKey || e3.metaKey) && "Enter" === t3 && T();
  }, onPaste: (e3) => {
    if (e3.clipboardData) {
      const t3 = ht(e3.clipboardData.items);
      t3 && P.value && N(t3);
    }
  }, onLogin: (e3) => {
    e3.preventDefault();
    const { lang: t3, serverURL: l2 } = n2.value, o = (window.innerWidth - 450) / 2, a = (window.innerHeight - 450) / 2, i = window.open(`${l2}/ui/login?lng=${encodeURIComponent(t3)}`, "_blank", `width=450,height=450,left=${o},top=${a},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);
    i == null ? void 0 : i.postMessage({ type: "TOKEN", data: null }, "*");
    const r2 = ({ data: e4 }) => {
      e4 && "userInfo" === e4.type && e4.data.token && (i == null ? void 0 : i.close(), s.value = e4.data, (e4.data.remember ? localStorage : sessionStorage).setItem("WALINE_USER", JSON.stringify(e4.data)), window.removeEventListener("message", r2));
    };
    window.addEventListener("message", r2);
  }, onLogout: () => {
    s.value = {}, localStorage.setItem("WALINE_USER", "null"), sessionStorage.setItem("WALINE_USER", "null");
  }, onProfile: (e3) => {
    var _a;
    e3.preventDefault();
    const { lang: t3, serverURL: l2 } = n2.value, o = (window.innerWidth - 800) / 2, a = (window.innerHeight - 800) / 2;
    (_a = window.open(`${l2}/ui/profile?lng=${encodeURIComponent(t3)}`, "_blank", `width=800,height=800,left=${o},top=${a},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`)) == null ? void 0 : _a.postMessage({ type: "TOKEN", data: s.value.token }, "*");
  }, submitComment: T, onImageWallScroll: _, onGifSearch: F, isLogin: M, userInfo: s, isSubmitting: A, wordNumber: S, wordLimit: x, isWordNumberLegal: O, editor: l, userMeta: r, emoji: k, emojiTabIndex: C, showEmoji: I, gifData: E, showGif: $, canUploadImage: P, previewText: L, showPreview: j, inputRefs: v, editorRef: p, emojiButtonRef: f2, emojiPopupRef: h2, gifButtonRef: y, gifPopupRef: w, imageUploadRef: g, gifSearchInputRef: b };
} });
var St = { class: "wl-comment" };
var Et = { key: 0, class: "wl-login-info" };
var xt = { class: "wl-avatar" };
var Ot = ["title"];
var Rt = ["title"];
var At = ["src"];
var zt = ["title", "textContent"];
var Mt = { class: "wl-panel" };
var Pt = ["for", "textContent"];
var Ut = ["id", "onUpdate:modelValue", "name", "type"];
var Nt = ["placeholder"];
var Tt = { class: "wl-preview" };
var Bt = createBaseVNode("hr", null, null, -1);
var Ht = ["innerHTML"];
var Vt = { class: "wl-footer" };
var _t = { class: "wl-actions" };
var Ft = { href: "https://guides.github.com/features/mastering-markdown/", title: "Markdown Guide", "aria-label": "Markdown is supported", class: "wl-action", target: "_blank", rel: "noreferrer" };
var Dt = ["title"];
var Wt = ["title"];
var Gt = ["title"];
var qt = ["title"];
var Jt = { class: "wl-info" };
var Kt = { class: "wl-text-number" };
var Qt = { key: 0 };
var Zt = createTextVNode(" \xA0/\xA0 ");
var Yt = ["textContent"];
var Xt = ["textContent"];
var en = ["disabled"];
var tn = ["placeholder"];
var nn = { key: 0, class: "wl-loading" };
var ln = { key: 0, class: "wl-tab-wrapper" };
var on = ["title", "onClick"];
var an = ["src", "alt"];
var rn = { key: 0, class: "wl-tabs" };
var sn = ["onClick"];
var cn = ["src", "alt", "title"];
var un = ["title"];
var mn = Ne(Lt, [["render", function(e2, t2, n2, l, o, a) {
  var _a, _b;
  const i = resolveComponent("CloseIcon"), r = resolveComponent("MarkdownIcon"), s = resolveComponent("EmojiIcon"), c = resolveComponent("GifIcon"), u = resolveComponent("ImageIcon"), m = resolveComponent("PreviewIcon"), d = resolveComponent("LoadingIcon"), g = resolveComponent("ImageWall");
  return openBlock(), createElementBlock("div", St, ["disable" !== e2.config.login && e2.isLogin && !((_a = e2.edit) == null ? void 0 : _a.objectId) ? (openBlock(), createElementBlock("div", Et, [createBaseVNode("div", xt, [createBaseVNode("button", { class: "wl-logout-btn", title: e2.locale.logout, onClick: t2[0] || (t2[0] = (...t3) => e2.onLogout && e2.onLogout(...t3)) }, [createVNode(i, { size: 14 })], 8, Ot), createBaseVNode("a", { href: "#", class: "wl-login-nick", "aria-label": "Profile", title: e2.locale.profile, onClick: t2[1] || (t2[1] = (...t3) => e2.onProfile && e2.onProfile(...t3)) }, [createBaseVNode("img", { src: e2.userInfo.avatar, alt: "avatar" }, null, 8, At)], 8, Rt)]), createBaseVNode("a", { href: "#", class: "wl-login-nick", "aria-label": "Profile", title: e2.locale.profile, onClick: t2[2] || (t2[2] = (...t3) => e2.onProfile && e2.onProfile(...t3)), textContent: toDisplayString(e2.userInfo.display_name) }, null, 8, zt)])) : createCommentVNode("v-if", true), createBaseVNode("div", Mt, ["force" !== e2.config.login && e2.config.meta.length && !e2.isLogin ? (openBlock(), createElementBlock("div", { key: 0, class: normalizeClass(["wl-header", `item${e2.config.meta.length}`]) }, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.config.meta, (t3) => (openBlock(), createElementBlock("div", { key: t3, class: "wl-header-item" }, [createBaseVNode("label", { for: t3, textContent: toDisplayString(e2.locale[t3] + (e2.config.requiredMeta.includes(t3) || !e2.config.requiredMeta.length ? "" : `(${e2.locale.optional})`)) }, null, 8, Pt), withDirectives(createBaseVNode("input", { id: `wl-${t3}`, ref_for: true, ref: (n3) => {
    n3 && (e2.inputRefs[t3] = n3);
  }, "onUpdate:modelValue": (n3) => e2.userMeta[t3] = n3, class: normalizeClass(["wl-input", `wl-${t3}`]), name: t3, type: "mail" === t3 ? "email" : "text" }, null, 10, Ut), [[vModelDynamic, e2.userMeta[t3]]])]))), 128))], 2)) : createCommentVNode("v-if", true), withDirectives(createBaseVNode("textarea", { id: "wl-edit", ref: "editorRef", "onUpdate:modelValue": t2[3] || (t2[3] = (t3) => e2.editor = t3), class: "wl-editor", placeholder: e2.replyUser ? `@${e2.replyUser}` : e2.locale.placeholder, onKeydown: t2[4] || (t2[4] = (...t3) => e2.onKeyDown && e2.onKeyDown(...t3)), onDrop: t2[5] || (t2[5] = (...t3) => e2.onDrop && e2.onDrop(...t3)), onPaste: t2[6] || (t2[6] = (...t3) => e2.onPaste && e2.onPaste(...t3)) }, null, 40, Nt), [[vModelText, e2.editor]]), withDirectives(createBaseVNode("div", Tt, [Bt, createBaseVNode("h4", null, toDisplayString(e2.locale.preview) + ":", 1), createCommentVNode(" eslint-disable-next-line vue/no-v-html "), createBaseVNode("div", { class: "wl-content", innerHTML: e2.previewText }, null, 8, Ht)], 512), [[vShow, e2.showPreview]]), createBaseVNode("div", Vt, [createBaseVNode("div", _t, [createBaseVNode("a", Ft, [createVNode(r)]), withDirectives(createBaseVNode("button", { ref: "emojiButtonRef", class: normalizeClass(["wl-action", { actived: e2.showEmoji }]), title: e2.locale.emoji, onClick: t2[7] || (t2[7] = (t3) => e2.showEmoji = !e2.showEmoji) }, [createVNode(s)], 10, Dt), [[vShow, e2.emoji.tabs.length]]), e2.config.search ? (openBlock(), createElementBlock("button", { key: 0, ref: "gifButtonRef", class: normalizeClass(["wl-action", { actived: e2.showGif }]), title: e2.locale.gif, onClick: t2[8] || (t2[8] = (t3) => e2.showGif = !e2.showGif) }, [createVNode(c)], 10, Wt)) : createCommentVNode("v-if", true), createBaseVNode("input", { id: "wl-image-upload", ref: "imageUploadRef", class: "upload", type: "file", accept: ".png,.jpg,.jpeg,.webp,.bmp,.gif", onChange: t2[9] || (t2[9] = (...t3) => e2.onChange && e2.onChange(...t3)) }, null, 544), e2.canUploadImage ? (openBlock(), createElementBlock("label", { key: 1, for: "wl-image-upload", class: "wl-action", title: e2.locale.uploadImage }, [createVNode(u)], 8, Gt)) : createCommentVNode("v-if", true), createBaseVNode("button", { class: normalizeClass(["wl-action", { actived: e2.showPreview }]), title: e2.locale.preview, onClick: t2[10] || (t2[10] = (t3) => e2.showPreview = !e2.showPreview) }, [createVNode(m)], 10, qt)]), createBaseVNode("div", Jt, [createBaseVNode("div", Kt, [createTextVNode(toDisplayString(e2.wordNumber) + " ", 1), e2.config.wordLimit ? (openBlock(), createElementBlock("span", Qt, [Zt, createBaseVNode("span", { class: normalizeClass({ illegal: !e2.isWordNumberLegal }), textContent: toDisplayString(e2.wordLimit) }, null, 10, Yt)])) : createCommentVNode("v-if", true), createTextVNode(" \xA0" + toDisplayString(e2.locale.word), 1)]), "disable" === e2.config.login || e2.isLogin ? createCommentVNode("v-if", true) : (openBlock(), createElementBlock("button", { key: 0, class: "wl-btn", onClick: t2[11] || (t2[11] = (...t3) => e2.onLogin && e2.onLogin(...t3)), textContent: toDisplayString(e2.locale.login) }, null, 8, Xt)), "force" !== e2.config.login || e2.isLogin ? (openBlock(), createElementBlock("button", { key: 1, class: "wl-btn primary", title: "Cmd|Ctrl + Enter", disabled: e2.isSubmitting, onClick: t2[12] || (t2[12] = (...t3) => e2.submitComment && e2.submitComment(...t3)) }, [e2.isSubmitting ? (openBlock(), createBlock(d, { key: 0, size: 16 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(e2.locale.submit), 1)], 64))], 8, en)) : createCommentVNode("v-if", true)]), createBaseVNode("div", { ref: "gifPopupRef", class: normalizeClass(["wl-gif-popup", { display: e2.showGif }]) }, [createBaseVNode("input", { ref: "gifSearchInputRef", type: "text", placeholder: e2.locale.gifSearchPlaceholder, onInput: t2[13] || (t2[13] = (...t3) => e2.onGifSearch && e2.onGifSearch(...t3)) }, null, 40, tn), createVNode(g, { items: e2.gifData.list, "column-width": 200, gap: 6, onInsert: t2[14] || (t2[14] = (t3) => e2.insert(t3)), onScroll: e2.onImageWallScroll }, null, 8, ["items", "onScroll"]), e2.gifData.loading ? (openBlock(), createElementBlock("div", nn, [createVNode(d, { size: 30 })])) : createCommentVNode("v-if", true)], 2), createBaseVNode("div", { ref: "emojiPopupRef", class: normalizeClass(["wl-emoji-popup", { display: e2.showEmoji }]) }, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.emoji.tabs, (t3, n3) => (openBlock(), createElementBlock(Fragment, { key: t3.name }, [n3 === e2.emojiTabIndex ? (openBlock(), createElementBlock("div", ln, [(openBlock(true), createElementBlock(Fragment, null, renderList(t3.items, (t4) => (openBlock(), createElementBlock("button", { key: t4, title: t4, onClick: (n4) => e2.insert(`:${t4}:`) }, [e2.showEmoji ? (openBlock(), createElementBlock("img", { key: 0, class: "wl-emoji", src: e2.emoji.map[t4], alt: t4, loading: "lazy", referrerPolicy: "no-referrer" }, null, 8, an)) : createCommentVNode("v-if", true)], 8, on))), 128))])) : createCommentVNode("v-if", true)], 64))), 128)), e2.emoji.tabs.length > 1 ? (openBlock(), createElementBlock("div", rn, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.emoji.tabs, (t3, n3) => (openBlock(), createElementBlock("button", { key: t3.name, class: normalizeClass(["wl-tab", { active: e2.emojiTabIndex === n3 }]), onClick: (t4) => e2.emojiTabIndex = n3 }, [createBaseVNode("img", { class: "wl-emoji", src: t3.icon, alt: t3.name, title: t3.name, loading: "lazy", referrerPolicy: "no-referrer" }, null, 8, cn)], 10, sn))), 128))])) : createCommentVNode("v-if", true)], 2)])]), e2.replyId || ((_b = e2.edit) == null ? void 0 : _b.objectId) ? (openBlock(), createElementBlock("button", { key: 1, class: "wl-close", title: e2.locale.cancelReply, onClick: t2[15] || (t2[15] = (t3) => e2.$emit(e2.replyId ? "cancel-reply" : "cancel-edit")) }, [createVNode(i, { size: 24 })], 8, un)) : createCommentVNode("v-if", true)]);
}], ["__file", "CommentBox.vue"]]);
var dn = ["approved", "waiting", "spam"];
var vn = defineComponent({ components: { CommentBox: mn, DeleteIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, h("path", { d: "m341.013 394.667 27.755 393.45h271.83l27.733-393.45h64.106l-28.01 397.952a64 64 0 0 1-63.83 59.498H368.768a64 64 0 0 1-63.83-59.52l-28.053-397.93h64.128zm139.307 19.818v298.667h-64V414.485h64zm117.013 0v298.667h-64V414.485h64zM181.333 288h640v64h-640v-64zm453.483-106.667v64h-256v-64h256z", fill: "red" })), LikeIcon: ({ active: e2 = false }) => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, [h("path", { d: "M850.654 323.804c-11.042-25.625-26.862-48.532-46.885-68.225-20.022-19.61-43.258-34.936-69.213-45.73-26.78-11.124-55.124-16.727-84.375-16.727-40.622 0-80.256 11.123-114.698 32.135A214.79 214.79 0 0 0 512 241.819a214.79 214.79 0 0 0-23.483-16.562c-34.442-21.012-74.076-32.135-114.698-32.135-29.25 0-57.595 5.603-84.375 16.727-25.872 10.711-49.19 26.12-69.213 45.73-20.105 19.693-35.843 42.6-46.885 68.225-11.453 26.615-17.303 54.877-17.303 83.963 0 27.439 5.603 56.03 16.727 85.117 9.31 24.307 22.659 49.52 39.715 74.981 27.027 40.293 64.188 82.316 110.33 124.915 76.465 70.615 152.189 119.394 155.402 121.371l19.528 12.525c8.652 5.52 19.776 5.52 28.427 0l19.529-12.525c3.213-2.06 78.854-50.756 155.401-121.371 46.143-42.6 83.304-84.622 110.33-124.915 17.057-25.46 30.487-50.674 39.716-74.981 11.124-29.087 16.727-57.678 16.727-85.117.082-29.086-5.768-57.348-17.221-83.963z" + (e2 ? "" : "M512 761.5S218.665 573.55 218.665 407.767c0-83.963 69.461-152.023 155.154-152.023 60.233 0 112.473 33.618 138.181 82.727 25.708-49.109 77.948-82.727 138.18-82.727 85.694 0 155.155 68.06 155.155 152.023C805.335 573.551 512 761.5 512 761.5z"), fill: e2 ? "red" : "currentColor" })]), ReplyIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, h("path", { d: "M810.667 213.333a64 64 0 0 1 64 64V704a64 64 0 0 1-64 64H478.336l-146.645 96.107a21.333 21.333 0 0 1-33.024-17.856V768h-85.334a64 64 0 0 1-64-64V277.333a64 64 0 0 1 64-64h597.334zm0 64H213.333V704h149.334v63.296L459.243 704h351.424V277.333zm-271.36 213.334v64h-176.64v-64h176.64zm122.026-128v64H362.667v-64h298.666z", fill: "currentColor" })), EditIcon: () => h("svg", { viewBox: "0 0 1024 1024", width: "24", height: "24" }, h("path", { d: "M813.039 318.772L480.53 651.278H360.718V531.463L693.227 198.961C697.904 194.284 704.027 192 710.157 192C716.302 192 722.436 194.284 727.114 198.961L813.039 284.88C817.72 289.561 820 295.684 820 301.825C820 307.95 817.72 314.093 813.039 318.772ZM710.172 261.888L420.624 551.431V591.376H460.561L750.109 301.825L710.172 261.888ZM490.517 291.845H240.906V771.09H720.156V521.479C720.156 504.947 733.559 491.529 750.109 491.529C766.653 491.529 780.063 504.947 780.063 521.479V791.059C780.063 813.118 762.18 831 740.125 831H220.937C198.882 831 181 813.118 181 791.059V271.872C181 249.817 198.882 231.935 220.937 231.935H490.517C507.06 231.935 520.47 245.352 520.47 261.888C520.47 278.424 507.06 291.845 490.517 291.845Z", fill: "currentColor" })), VerifiedIcon: () => h("svg", { class: "verified-icon", viewBox: "0 0 1024 1024", width: "14", height: "14" }, h("path", { d: "m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z", fill: "#27ae60" })) }, props: { comment: { type: Object, required: true }, rootId: { type: String, required: true }, reply: { type: Object, default: null }, edit: { type: Object, default: null } }, emits: ["submit", "reply", "like", "delete", "status", "sticky", "edit"], setup(e2) {
  const t2 = inject("config"), n2 = jt(), l = It(), i = computed(() => t2.value.locale), r = computed(() => {
    const { link: t3 } = e2.comment;
    return t3 ? rt(t3) ? t3 : `https://${t3}` : "";
  }), s = computed(() => n2.value.includes(e2.comment.objectId)), u = ((e3, t3) => {
    const n3 = function(e4 = {}) {
      const { controls: t4 = false, interval: n4 = "requestAnimationFrame" } = e4, l2 = ref(new Date()), i2 = () => l2.value = new Date(), r2 = "requestAnimationFrame" === n4 ? function(e5, t5 = {}) {
        const { immediate: n5 = true, window: l3 = ce } = t5, a = ref(false);
        let i3 = null;
        function r3() {
          a.value && l3 && (e5(), i3 = l3.requestAnimationFrame(r3));
        }
        function s2() {
          !a.value && l3 && (a.value = true, r3());
        }
        function c() {
          a.value = false, null != i3 && l3 && (l3.cancelAnimationFrame(i3), i3 = null);
        }
        return n5 && s2(), Q(c), { isActive: a, pause: c, resume: s2 };
      }(i2, { immediate: true }) : function(e5, t5 = 1e3, n5 = {}) {
        const { immediate: l3 = true, immediateCallback: i3 = false } = n5;
        let r3 = null;
        const s2 = ref(false);
        function c() {
          r3 && (clearInterval(r3), r3 = null);
        }
        function u2() {
          s2.value = false, c();
        }
        function m() {
          unref(t5) <= 0 || (s2.value = true, i3 && e5(), c(), r3 = setInterval(e5, q(t5)));
        }
        return l3 && W && m(), isRef(t5) && Q(watch(t5, () => {
          s2.value && W && m();
        })), Q(u2), { isActive: s2, pause: u2, resume: m };
      }(i2, n4, { immediate: true });
      return t4 ? ((e5, t5) => {
        for (var n5 in t5 || (t5 = {}))
          Le.call(t5, n5) && Ee(e5, n5, t5[n5]);
        if (je)
          for (var n5 of je(t5))
            Se.call(t5, n5) && Ee(e5, n5, t5[n5]);
        return e5;
      })({ now: l2 }, r2) : l2;
    }();
    return computed(() => ((e4, t4, n4) => {
      if (!e4)
        return "";
      const l2 = "string" == typeof e4 ? new Date(-1 !== e4.indexOf(" ") ? e4.replace(/-/g, "/") : e4) : e4, o = t4.getTime() - l2.getTime(), a = Math.floor(o / 864e5);
      if (0 === a) {
        const e5 = o % 864e5, t5 = Math.floor(e5 / 36e5);
        if (0 === t5) {
          const t6 = e5 % 36e5, l3 = Math.floor(t6 / 6e4);
          if (0 === l3) {
            const e6 = t6 % 6e4;
            return `${Math.round(e6 / 1e3)} ${n4.seconds}`;
          }
          return `${l3} ${n4.minutes}`;
        }
        return `${t5} ${n4.hours}`;
      }
      return a < 0 ? n4.now : a < 8 ? `${a} ${n4.days}` : ((e5) => {
        const t5 = dt(e5.getDate(), 2), n5 = dt(e5.getMonth() + 1, 2);
        return `${dt(e5.getFullYear(), 2)}-${n5}-${t5}`;
      })(l2);
    })(e3, n3.value, t3));
  })(e2.comment.insertedAt, i.value), d = computed(() => "administrator" === l.value.type), v = computed(() => e2.comment.user_id && l.value.objectId === e2.comment.user_id);
  console.log("lizheming:", e2.comment.user_id, l.value.objectId, v.value);
  const p = computed(() => {
    var _a;
    return e2.comment.objectId === ((_a = e2.reply) == null ? void 0 : _a.objectId);
  }), g = computed(() => {
    var _a;
    return e2.comment.objectId === ((_a = e2.edit) == null ? void 0 : _a.objectId);
  });
  return { config: t2, locale: i, isReplyingCurrent: p, isEditingCurrent: g, link: r, like: s, time: u, isAdmin: d, isOwner: v, commentStatus: dn };
} });
var pn = ["id"];
var gn = { class: "wl-user", "aria-hidden": "true" };
var fn = ["src"];
var hn = { class: "wl-card" };
var yn = { class: "wl-head" };
var wn = ["href"];
var bn = { key: 1, class: "wl-nick" };
var kn = ["textContent"];
var Cn = ["textContent"];
var In = ["textContent"];
var $n = ["textContent"];
var jn = ["textContent"];
var Ln = { class: "wl-comment-actions" };
var Sn = ["title"];
var En = ["textContent"];
var xn = ["title"];
var On = { class: "wl-meta", "aria-hidden": "true" };
var Rn = ["data-value", "textContent"];
var An = ["data-value", "textContent"];
var zn = ["data-value", "textContent"];
var Mn = ["innerHTML"];
var Pn = { key: 1, class: "wl-admin-actions" };
var Un = { class: "wl-comment-status" };
var Nn = ["disabled", "onClick", "textContent"];
var Tn = { key: 3, class: "wl-quote" };
var Bn = [{ key: "insertedAt_desc", name: "latest" }, { key: "insertedAt_asc", name: "oldest" }, { key: "like_desc", name: "hottest" }];
var Hn = defineComponent({ name: "WalineRoot", components: { CommentBox: mn, CommentCard: Ne(vn, [["render", function(e2, t2, n2, l, o, a) {
  var _a;
  const i = resolveComponent("VerifiedIcon"), r = resolveComponent("EditIcon"), s = resolveComponent("DeleteIcon"), c = resolveComponent("LikeIcon"), u = resolveComponent("ReplyIcon"), m = resolveComponent("CommentBox"), d = resolveComponent("CommentCard", true);
  return openBlock(), createElementBlock("div", { id: e2.comment.objectId, class: "wl-item" }, [createBaseVNode("div", gn, [e2.comment.avatar ? (openBlock(), createElementBlock("img", { key: 0, src: e2.comment.avatar }, null, 8, fn)) : createCommentVNode("v-if", true), e2.comment.type ? (openBlock(), createBlock(i, { key: 1 })) : createCommentVNode("v-if", true)]), createBaseVNode("div", hn, [createBaseVNode("div", yn, [e2.link ? (openBlock(), createElementBlock("a", { key: 0, class: "wl-nick", href: e2.link, target: "_blank", rel: "nofollow noreferrer" }, toDisplayString(e2.comment.nick), 9, wn)) : (openBlock(), createElementBlock("span", bn, toDisplayString(e2.comment.nick), 1)), "administrator" === e2.comment.type ? (openBlock(), createElementBlock("span", { key: 2, class: "wl-badge", textContent: toDisplayString(e2.locale.admin) }, null, 8, kn)) : createCommentVNode("v-if", true), e2.comment.label ? (openBlock(), createElementBlock("span", { key: 3, class: "wl-badge", textContent: toDisplayString(e2.comment.label) }, null, 8, Cn)) : createCommentVNode("v-if", true), e2.comment.sticky ? (openBlock(), createElementBlock("span", { key: 4, class: "wl-badge", textContent: toDisplayString(e2.locale.sticky) }, null, 8, In)) : createCommentVNode("v-if", true), void 0 !== e2.comment.level && e2.comment.level >= 0 ? (openBlock(), createElementBlock("span", { key: 5, class: normalizeClass(`wl-badge level${e2.comment.level}`), textContent: toDisplayString(e2.locale[`level${e2.comment.level}`] || `Level ${e2.comment.level}`) }, null, 10, $n)) : createCommentVNode("v-if", true), createBaseVNode("span", { class: "wl-time", textContent: toDisplayString(e2.time) }, null, 8, jn), createBaseVNode("div", Ln, [e2.isAdmin || e2.isOwner ? (openBlock(), createElementBlock("button", { key: 0, class: "wl-edit", onClick: t2[0] || (t2[0] = (t3) => e2.$emit("edit", e2.comment)) }, [createVNode(r)])) : createCommentVNode("v-if", true), e2.isAdmin || e2.isOwner ? (openBlock(), createElementBlock("button", { key: 1, class: "wl-delete", onClick: t2[1] || (t2[1] = (t3) => e2.$emit("delete", e2.comment)) }, [createVNode(s)])) : createCommentVNode("v-if", true), createBaseVNode("button", { class: "wl-like", title: e2.like ? e2.locale.cancelLike : e2.locale.like, onClick: t2[2] || (t2[2] = (t3) => e2.$emit("like", e2.comment)) }, [createVNode(c, { active: e2.like }, null, 8, ["active"]), "like" in e2.comment ? (openBlock(), createElementBlock("span", { key: 0, textContent: toDisplayString(e2.comment.like) }, null, 8, En)) : createCommentVNode("v-if", true)], 8, Sn), createBaseVNode("button", { class: normalizeClass(["wl-reply", { active: e2.isReplyingCurrent }]), title: e2.isReplyingCurrent ? e2.locale.cancelReply : e2.locale.reply, onClick: t2[3] || (t2[3] = (t3) => e2.$emit("reply", e2.isReplyingCurrent ? null : e2.comment)) }, [createVNode(u)], 10, xn)])]), createBaseVNode("div", On, [e2.comment.addr ? (openBlock(), createElementBlock("span", { key: 0, class: "wl-addr", "data-value": e2.comment.addr, textContent: toDisplayString(e2.comment.addr) }, null, 8, Rn)) : createCommentVNode("v-if", true), e2.comment.browser ? (openBlock(), createElementBlock("span", { key: 1, class: "wl-browser", "data-value": e2.comment.browser, textContent: toDisplayString(e2.comment.browser) }, null, 8, An)) : createCommentVNode("v-if", true), e2.comment.os ? (openBlock(), createElementBlock("span", { key: 2, class: "wl-os", "data-value": e2.comment.os, textContent: toDisplayString(e2.comment.os) }, null, 8, zn)) : createCommentVNode("v-if", true)]), createCommentVNode(" eslint-disable vue/no-v-html "), e2.isEditingCurrent ? createCommentVNode("v-if", true) : (openBlock(), createElementBlock("div", { key: 0, class: "wl-content", innerHTML: e2.comment.comment }, null, 8, Mn)), createCommentVNode(" eslint-enable vue/no-v-html "), e2.isAdmin && !e2.isEditingCurrent ? (openBlock(), createElementBlock("div", Pn, [createBaseVNode("span", Un, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.commentStatus, (t3) => (openBlock(), createElementBlock("button", { key: t3, class: normalizeClass(`wl-btn wl-${t3}`), disabled: e2.comment.status === t3, onClick: (n3) => e2.$emit("status", { status: t3, comment: e2.comment }), textContent: toDisplayString(e2.locale[t3]) }, null, 10, Nn))), 128))]), e2.isAdmin && !e2.comment.rid ? (openBlock(), createElementBlock("button", { key: 0, class: "wl-btn wl-sticky", onClick: t2[4] || (t2[4] = (t3) => e2.$emit("sticky", e2.comment)) }, toDisplayString(e2.comment.sticky ? e2.locale.unsticky : e2.locale.sticky), 1)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), e2.isReplyingCurrent || e2.isEditingCurrent ? (openBlock(), createElementBlock("div", { key: 2, class: normalizeClass({ "wl-reply-wrapper": e2.isReplyingCurrent, "wl-edit-wrapper": e2.isEditingCurrent }) }, [createVNode(m, { edit: e2.edit, "reply-id": (_a = e2.reply) == null ? void 0 : _a.objectId, "reply-user": e2.comment.nick, "root-id": e2.rootId, onSubmit: t2[5] || (t2[5] = (t3) => e2.$emit("submit", t3)), onCancelReply: t2[6] || (t2[6] = (t3) => e2.$emit("reply", null)), onCancelEdit: t2[7] || (t2[7] = (t3) => e2.$emit("edit", null)) }, null, 8, ["edit", "reply-id", "reply-user", "root-id"])], 2)) : createCommentVNode("v-if", true), e2.comment.children ? (openBlock(), createElementBlock("div", Tn, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.comment.children, (n3) => (openBlock(), createBlock(d, { key: n3.objectId, comment: n3, reply: e2.reply, edit: e2.edit, "root-id": e2.rootId, onReply: t2[8] || (t2[8] = (t3) => e2.$emit("reply", t3)), onSubmit: t2[9] || (t2[9] = (t3) => e2.$emit("submit", t3)), onLike: t2[10] || (t2[10] = (t3) => e2.$emit("like", t3)), onEdit: t2[11] || (t2[11] = (t3) => e2.$emit("edit", t3)), onDelete: t2[12] || (t2[12] = (t3) => e2.$emit("delete", t3)), onStatus: t2[13] || (t2[13] = (t3) => e2.$emit("status", t3)), onSticky: t2[14] || (t2[14] = (t3) => e2.$emit("sticky", t3)) }, null, 8, ["comment", "reply", "edit", "root-id"]))), 128))])) : createCommentVNode("v-if", true)])], 8, pn);
}], ["__file", "CommentCard.vue"]]), LoadingIcon: Pe }, props: ["serverURL", "path", "meta", "requiredMeta", "dark", "lang", "locale", "pageSize", "wordLimit", "emoji", "login", "highlighter", "texRenderer", "imageUploader", "search", "copyright"], setup(e2) {
  const t2 = computed(() => (({ serverURL: e3, path: t3 = location.pathname, lang: n3 = "zh-CN", locale: l2, emoji: o = ["//unpkg.com/@waline/emojis@1.1.0/weibo"], meta: a = ["nick", "mail", "link"], requiredMeta: i = [], dark: r2 = false, pageSize: s2 = 10, wordLimit: c2, imageUploader: u2, highlighter: m, texRenderer: d2, copyright: v2 = true, login: p2 = "enable", search: g = We(), ...f3 }) => ({ serverURL: st(e3), path: at(t3), locale: { ...ot[n3] || ot["zh-CN"], ..."object" == typeof l2 ? l2 : {} }, wordLimit: ct(c2), meta: _e(a), requiredMeta: _e(i), imageUploader: ut(u2, Fe), highlighter: ut(m, Ke), texRenderer: ut(d2, De), lang: n3, dark: r2, emoji: o, pageSize: s2, login: p2, copyright: v2, search: g, ...f3 }))(e2)), n2 = It(), l = jt(), r = ref("loading"), s = ref(0), c = ref(1), u = ref(0), d = ref(Bn[0].key), v = ref([]), p = ref(null), f2 = ref(null), h2 = computed(() => {
    return "string" == typeof (e3 = t2.value.dark) ? "auto" === e3 ? `@media(prefers-color-scheme:dark){body${mt}}` : `${e3}${mt}` : true === e3 ? `:root${mt}` : "";
    var e3;
  });
  let k;
  !function(e3, t3 = {}) {
    const n3 = ref(false), { document: l2 = ue, immediate: r2 = true, manual: s2 = false, id: c2 = "vueuse_styletag_" + ++xe } = t3, u2 = ref(e3);
    let m = () => {
    };
    const d2 = () => {
      if (!l2)
        return;
      const e4 = l2.getElementById(c2) || l2.createElement("style");
      e4.type = "text/css", e4.id = c2, t3.media && (e4.media = t3.media), l2.head.appendChild(e4), n3.value || (m = watch(u2, (t4) => {
        e4.innerText = t4;
      }, { immediate: true }), n3.value = true);
    }, v2 = () => {
      l2 && n3.value && (m(), l2.head.removeChild(l2.getElementById(c2)), n3.value = false);
    };
    r2 && !s2 && function(e4, t4 = true) {
      getCurrentInstance() ? onMounted(e4) : t4 ? e4() : nextTick(e4);
    }(d2), s2 || Q(v2), readonly(n3);
  }(h2);
  const C = (e3) => {
    var _a;
    const { serverURL: l2, path: o, pageSize: a } = t2.value, i = new AbortController();
    r.value = "loading", k == null ? void 0 : k(), (({ serverURL: e4, lang: t3, path: n3, page: l3, pageSize: o2, sortBy: a2, signal: i2, token: r2 }) => {
      const s2 = {};
      return r2 && (s2.Authorization = `Bearer ${r2}`), fetch(`${e4}/comment?path=${encodeURIComponent(n3)}&pageSize=${o2}&page=${l3}&lang=${t3}&sortBy=${a2}`, { signal: i2, headers: s2 }).then((e5) => e5.json()).then((e5) => ((e6, t4 = "") => {
        if ("object" == typeof e6 && e6.errno)
          throw new TypeError(`Fetch ${t4} failed with ${e6.errno}: ${e6.errmsg}`);
        return e6;
      })(e5, "comment list"));
    })({ serverURL: l2, lang: t2.value.lang, path: o, pageSize: a, sortBy: d.value, page: e3, signal: i.signal, token: (_a = n2.value) == null ? void 0 : _a.token }).then((t3) => {
      r.value = "success", s.value = t3.count, v.value.push(...t3.data), c.value = e3, u.value = t3.totalPages;
    }).catch((e4) => {
      "AbortError" !== e4.name && (console.error(e4.message), r.value = "error");
    }), k = i.abort.bind(i);
  }, I = () => {
    s.value = 0, v.value = [], C(1);
  };
  return provide("config", t2), watch(() => e2.path, I), onMounted(() => I()), { config: t2, darkmodeStyle: h2, i18n: computed(() => t2.value.locale), status: r, count: s, page: c, totalPages: u, sortBy: d, sortByItems: Bn, data: v, reply: p, edit: f2, loadMore: () => C(c.value + 1), refresh: I, onSortByChange: (e3) => {
    d.value !== e3 && (d.value = e3, I());
  }, onReply: (e3) => {
    p.value = e3;
  }, onSubmit: (e3) => {
    if (f2.value)
      f2.value.comment = e3.comment, f2.value.orig = e3.orig;
    else if (e3.rid) {
      const t3 = v.value.find(({ objectId: t4 }) => t4 === e3.rid);
      if (!t3)
        return;
      Array.isArray(t3.children) || (t3.children = []), t3.children.push(e3);
    } else
      v.value.unshift(e3);
  }, onStatusChange: async ({ comment: e3, status: l2 }) => {
    var _a;
    if (e3.status === l2)
      return;
    const { serverURL: o, lang: a } = t2.value;
    await gt({ serverURL: o, lang: a, token: (_a = n2.value) == null ? void 0 : _a.token, objectId: e3.objectId, status: l2 }), e3.status = l2;
  }, onDelete: async ({ objectId: e3 }) => {
    var _a;
    if (!confirm("Are you sure you want to delete this comment?"))
      return;
    const { serverURL: l2, lang: o } = t2.value;
    await (({ serverURL: e4, lang: t3, token: n3, objectId: l3 }) => fetch(`${e4}/comment/${l3}?lang=${t3}`, { method: "DELETE", headers: { Authorization: `Bearer ${n3}` } }).then((e5) => e5.json()))({ serverURL: l2, lang: o, token: (_a = n2.value) == null ? void 0 : _a.token, objectId: e3 }), v.value.some((t3, n3) => t3.objectId === e3 ? (v.value = v.value.filter((e4, t4) => t4 !== n3), true) : t3.children.some((l3, o2) => l3.objectId === e3 && (v.value[n3].children = t3.children.filter((e4, t4) => t4 !== o2), true)));
  }, onSticky: async (e3) => {
    var _a;
    if (e3.rid)
      return;
    const { serverURL: l2, lang: o } = t2.value;
    await gt({ serverURL: l2, lang: o, token: (_a = n2.value) == null ? void 0 : _a.token, objectId: e3.objectId, sticky: e3.sticky ? 0 : 1 }), e3.sticky = !e3.sticky;
  }, onLike: async (e3) => {
    const { serverURL: n3, lang: o } = t2.value, { objectId: a } = e3, i = l.value.includes(a);
    await (({ serverURL: e4, lang: t3, objectId: n4, like: l2 }) => fetch(`${e4}/comment/${n4}?lang=${t3}`, { method: "PUT", headers: pt, body: JSON.stringify({ like: l2 }) }).then((e5) => e5.json()))({ serverURL: n3, lang: o, objectId: a, like: !i }), i ? l.value = l.value.filter((e4) => e4 !== a) : (l.value = [...l.value, a], l.value.length > 50 && (l.value = l.value.slice(-50))), e3.like = (e3.like || 0) + (i ? -1 : 1);
  }, onEdit: (e3) => {
    f2.value = e3;
  }, version: "2.8.1" };
} });
var Vn = { "data-waline": "" };
var _n = { class: "wl-meta-head" };
var Fn = { class: "wl-count" };
var Dn = ["textContent"];
var Wn = { class: "wl-sort" };
var Gn = ["onClick"];
var qn = { class: "wl-cards" };
var Jn = { key: 1, class: "wl-operation" };
var Kn = ["textContent"];
var Qn = { key: 0, class: "wl-loading" };
var Zn = ["textContent"];
var Yn = { class: "wl-operation" };
var Xn = ["textContent"];
var el = { key: 3, class: "wl-power" };
var tl = createTextVNode(" Powered by ");
var nl = createBaseVNode("a", { href: "https://github.com/walinejs/waline", target: "_blank", rel: "noreferrer" }, " Waline ", -1);
var ll = Ne(Hn, [["render", function(e2, t2, n2, l, o, a) {
  const i = resolveComponent("CommentBox"), r = resolveComponent("CommentCard"), s = resolveComponent("LoadingIcon");
  return openBlock(), createElementBlock("div", Vn, [e2.reply ? createCommentVNode("v-if", true) : (openBlock(), createBlock(i, { key: 0, onSubmit: e2.onSubmit }, null, 8, ["onSubmit"])), createBaseVNode("div", _n, [createBaseVNode("div", Fn, [e2.count ? (openBlock(), createElementBlock("span", { key: 0, class: "wl-num", textContent: toDisplayString(e2.count) }, null, 8, Dn)) : createCommentVNode("v-if", true), createTextVNode(" " + toDisplayString(e2.i18n.comment), 1)]), createBaseVNode("ul", Wn, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.sortByItems, (t3) => (openBlock(), createElementBlock("li", { key: t3.key, class: normalizeClass([t3.key === e2.sortBy ? "active" : ""]), onClick: (n3) => e2.onSortByChange(t3.key) }, toDisplayString(e2.i18n[t3.name]), 11, Gn))), 128))])]), createBaseVNode("div", qn, [(openBlock(true), createElementBlock(Fragment, null, renderList(e2.data, (t3) => (openBlock(), createBlock(r, { key: t3.objectId, "root-id": t3.objectId, comment: t3, reply: e2.reply, edit: e2.edit, onReply: e2.onReply, onEdit: e2.onEdit, onSubmit: e2.onSubmit, onStatus: e2.onStatusChange, onDelete: e2.onDelete, onSticky: e2.onSticky, onLike: e2.onLike }, null, 8, ["root-id", "comment", "reply", "edit", "onReply", "onEdit", "onSubmit", "onStatus", "onDelete", "onSticky", "onLike"]))), 128))]), "error" === e2.status ? (openBlock(), createElementBlock("div", Jn, [createBaseVNode("button", { type: "button", class: "wl-btn", onClick: t2[0] || (t2[0] = (...t3) => e2.refresh && e2.refresh(...t3)), textContent: toDisplayString(e2.i18n.refresh) }, null, 8, Kn)])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, ["loading" === e2.status ? (openBlock(), createElementBlock("div", Qn, [createVNode(s, { size: 30 })])) : e2.data.length ? e2.page < e2.totalPages ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [createCommentVNode(" Load more button "), createBaseVNode("div", Yn, [createBaseVNode("button", { type: "button", class: "wl-btn", onClick: t2[1] || (t2[1] = (...t3) => e2.loadMore && e2.loadMore(...t3)), textContent: toDisplayString(e2.i18n.more) }, null, 8, Xn)])], 2112)) : createCommentVNode("v-if", true) : (openBlock(), createElementBlock("div", { key: 1, class: "wl-empty", textContent: toDisplayString(e2.i18n.sofa) }, null, 8, Zn))], 64)), createCommentVNode(" Copyright Information "), e2.config.copyright ? (openBlock(), createElementBlock("div", el, [tl, nl, createTextVNode(" v" + toDisplayString(e2.version), 1)])) : createCommentVNode("v-if", true)]);
}], ["__file", "Waline.vue"]]);
var ol = COMMENT_OPTIONS;
var al = WALINE_LOCALES;
var il = Boolean(ol.serverURL);
false !== ol.metaIcon && import("/Users/bytedance/project/faga1.github.io/node_modules/@waline/client/dist/waline-meta.css");
var rl = defineComponent({ name: "WalineComment", setup() {
  const l = useRoute(), o = (0, client_exports.usePageFrontmatter)(), r = (0, client_exports.usePageLang)(), c = f(al);
  let u;
  const d = computed(() => {
    if (!il)
      return false;
    const e2 = false !== ol.comment, t2 = o.value.comment;
    return Boolean(t2) || false !== e2 && false !== t2;
  }), v = computed(() => {
    if (!il)
      return false;
    const e2 = false !== ol.pageview, t2 = o.value.pageview;
    return Boolean(t2) || false !== e2 && false !== t2;
  }), p = computed(() => ({ lang: "zh-CN" === r.value ? "zh-CN" : "en", locale: { ...c.value, ...ol.locale || {} }, emoji: ["//unpkg.com/@waline/emojis@1.1.0/weibo", "//unpkg.com/@waline/emojis@1.1.0/bilibili"], dark: "html.dark", ...ol, path: (0, client_exports.withBase)(l.path) }));
  return onMounted(() => {
    watch(() => l.path, () => {
      u == null ? void 0 : u(), v.value && setTimeout(() => {
        u = V({ serverURL: ol.serverURL, path: (0, client_exports.withBase)(l.path) });
      }, ol.delay || 500);
    }, { immediate: true });
  }), () => d.value ? h("div", { class: "waline-wrapper" }, il ? h(ll, p.value) : []) : null;
} });

// dep:@CommentProvider
var CommentProvider_default = rl;
export {
  CommentProvider_default as default
};
//# sourceMappingURL=@CommentProvider.js.map
