"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceBase = replaceBase;
exports.replaceCanonical = replaceCanonical;
exports.replaceLinks = replaceLinks;
exports.substitute = substitute;

var _core = require("./core");

var _url = require("./url");

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replaceBase(doc, section) {
	var base;
	var head;

	if (!doc) {
		return;
	}

	// head = doc.querySelector("head");
	// base = head.querySelector("base");
	head = (0, _core.qs)(doc, "head");
	base = (0, _core.qs)(head, "base");

	if (!base) {
		base = doc.createElement("base");
		head.insertBefore(base, head.firstChild);
	}

	base.setAttribute("href", section.url);
}

function replaceCanonical(doc, section) {
	var head;
	var link;
	var url = section.url; // window.location.origin +  window.location.pathname + "?loc=" + encodeURIComponent(section.url);

	if (!doc) {
		return;
	}

	head = (0, _core.qs)(doc, "head");
	link = (0, _core.qs)(head, "link[rel='canonical']");

	if (link) {
		link.setAttribute("href", url);
	} else {
		link = doc.createElement("link");
		link.setAttribute("rel", "canonical");
		link.setAttribute("href", url);
		head.appendChild(link);
	}
}
// TODO: move me to Contents
function replaceLinks(contents, fn) {

	var links = contents.querySelectorAll("a[href]");
	var base = (0, _core.qs)(contents.ownerDocument, "base");
	var location = base ? base.href : undefined;
	var replaceLink = function (link) {
		var href = link.getAttribute("href");

		if (href.indexOf("mailto:") === 0) {
			return;
		}

		var absolute = href.indexOf("://") > -1;
		var linkUrl = new _url2.default(href, location);

		if (absolute) {

			link.setAttribute("target", "_blank");
		} else {
			link.onclick = function () {

				if (linkUrl && linkUrl.hash) {
					fn(linkUrl.Path.path + linkUrl.hash);
				} else if (linkUrl) {
					fn(linkUrl.Path.path);
				} else {
					fn(href);
				}

				return false;
			};
		}
	}.bind(this);

	for (var i = 0; i < links.length; i++) {
		replaceLink(links[i]);
	}
}

function substitute(content, urls, replacements) {
	urls.forEach(function (url, i) {
		if (url && replacements[i]) {
			content = content.replace(new RegExp(url, "g"), replacements[i]);
		}
	});
	return content;
}