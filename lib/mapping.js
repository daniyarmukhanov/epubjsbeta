"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _epubcfi = require("./epubcfi");

var _epubcfi2 = _interopRequireDefault(_epubcfi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapping = function () {
	function Mapping(layout) {
		_classCallCheck(this, Mapping);

		this.layout = layout;
	}

	_createClass(Mapping, [{
		key: "section",
		value: function section(view) {
			var ranges = this.findRanges(view);
			var map = this.rangeListToCfiList(view.section.cfiBase, ranges);

			return map;
		}
	}, {
		key: "page",
		value: function page(contents, cfiBase, start, end) {
			var root = contents && contents.document ? contents.document.body : false;

			if (!root) {
				return;
			}

			return this.rangePairToCfiPair(cfiBase, {
				start: this.findStart(root, start, end),
				end: this.findEnd(root, start, end)
			});
		}
	}, {
		key: "walk",
		value: function walk(root, func) {
			//var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, null, false);
			var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
				acceptNode: function acceptNode(node) {
					if (node.data.trim().length > 0) {
						return NodeFilter.FILTER_ACCEPT;
					} else {
						return NodeFilter.FILTER_REJECT;
					}
				}
			}, false);
			var node;
			var result;
			while (node = treeWalker.nextNode()) {
				result = func(node);
				if (result) break;
			}

			return result;
		}
	}, {
		key: "findRanges",
		value: function findRanges(view) {
			var columns = [];
			var scrollWidth = view.contents.scrollWidth();
			var count = this.layout.count(scrollWidth);
			var column = this.layout.column;
			var gap = this.layout.gap;
			var start, end;

			for (var i = 0; i < count.pages; i++) {
				start = (column + gap) * i;
				end = column * (i + 1) + gap * i;
				columns.push({
					start: this.findStart(view.document.body, start, end),
					end: this.findEnd(view.document.body, start, end)
				});
			}

			return columns;
		}
	}, {
		key: "findStart",
		value: function findStart(root, start, end) {
			var stack = [root];
			var $el;
			var found;
			var $prev = root;
			while (stack.length) {

				$el = stack.shift();

				found = this.walk($el, function (node) {
					var left, right;
					var elPos;
					var elRange;

					if (node.nodeType == Node.TEXT_NODE) {
						elRange = document.createRange();
						elRange.selectNodeContents(node);
						elPos = elRange.getBoundingClientRect();
					} else {
						elPos = node.getBoundingClientRect();
					}

					left = elPos.left;
					right = elPos.right;

					if (left >= start && left <= end) {
						return node;
					} else if (right > start) {
						return node;
					} else {
						$prev = node;
						stack.push(node);
					}
				});

				if (found) {
					return this.findTextStartRange(found, start, end);
				}
			}

			// Return last element
			return this.findTextStartRange($prev, start, end);
		}
	}, {
		key: "findEnd",
		value: function findEnd(root, start, end) {
			var stack = [root];
			var $el;
			var $prev = root;
			var found;

			while (stack.length) {

				$el = stack.shift();

				found = this.walk($el, function (node) {

					var left, right;
					var elPos;
					var elRange;

					if (node.nodeType == Node.TEXT_NODE) {
						elRange = document.createRange();
						elRange.selectNodeContents(node);
						elPos = elRange.getBoundingClientRect();
					} else {
						elPos = node.getBoundingClientRect();
					}

					left = elPos.left;
					right = elPos.right;

					if (left > end && $prev) {
						return $prev;
					} else if (right > end) {
						return node;
					} else {
						$prev = node;
						stack.push(node);
					}
				});

				if (found) {
					return this.findTextEndRange(found, start, end);
				}
			}

			// end of chapter
			return this.findTextEndRange($prev, start, end);
		}
	}, {
		key: "findTextStartRange",
		value: function findTextStartRange(node, start, end) {
			var ranges = this.splitTextNodeIntoRanges(node);
			var range;
			var pos;

			for (var i = 0; i < ranges.length; i++) {
				range = ranges[i];

				pos = range.getBoundingClientRect();

				if (pos.left >= start) {
					return range;
				}

				// prev = range;
			}

			return ranges[0];
		}
	}, {
		key: "findTextEndRange",
		value: function findTextEndRange(node, start, end) {
			var ranges = this.splitTextNodeIntoRanges(node);
			var prev;
			var range;
			var pos;

			for (var i = 0; i < ranges.length; i++) {
				range = ranges[i];

				pos = range.getBoundingClientRect();

				if (pos.left > end && prev) {
					return prev;
				} else if (pos.right > end) {
					return range;
				}

				prev = range;
			}

			// Ends before limit
			return ranges[ranges.length - 1];
		}
	}, {
		key: "splitTextNodeIntoRanges",
		value: function splitTextNodeIntoRanges(node, _splitter) {
			var ranges = [];
			var textContent = node.textContent || "";
			var text = textContent.trim();
			var range;
			var doc = node.ownerDocument;
			var splitter = _splitter || " ";

			var pos = text.indexOf(splitter);

			if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
				range = doc.createRange();
				range.selectNodeContents(node);
				return [range];
			}

			range = doc.createRange();
			range.setStart(node, 0);
			range.setEnd(node, pos);
			ranges.push(range);
			range = false;

			while (pos != -1) {

				pos = text.indexOf(splitter, pos + 1);
				if (pos > 0) {

					if (range) {
						range.setEnd(node, pos);
						ranges.push(range);
					}

					range = doc.createRange();
					range.setStart(node, pos + 1);
				}
			}

			if (range) {
				range.setEnd(node, text.length);
				ranges.push(range);
			}

			return ranges;
		}
	}, {
		key: "rangePairToCfiPair",
		value: function rangePairToCfiPair(cfiBase, rangePair) {

			var startRange = rangePair.start;
			var endRange = rangePair.end;

			startRange.collapse(true);
			endRange.collapse(true);

			// startCfi = section.cfiFromRange(startRange);
			// endCfi = section.cfiFromRange(endRange);
			var startCfi = new _epubcfi2.default(startRange, cfiBase).toString();
			var endCfi = new _epubcfi2.default(endRange, cfiBase).toString();

			return {
				start: startCfi,
				end: endCfi
			};
		}
	}, {
		key: "rangeListToCfiList",
		value: function rangeListToCfiList(cfiBase, columns) {
			var map = [];
			var cifPair;

			for (var i = 0; i < columns.length; i++) {
				cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);

				map.push(cifPair);
			}

			return map;
		}
	}]);

	return Mapping;
}();

exports.default = Mapping;
module.exports = exports["default"];