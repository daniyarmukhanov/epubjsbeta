"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _core = require("../../utils/core");

var _mapping = require("../../mapping");

var _mapping2 = _interopRequireDefault(_mapping);

var _queue = require("../../utils/queue");

var _queue2 = _interopRequireDefault(_queue);

var _stage = require("../helpers/stage");

var _stage2 = _interopRequireDefault(_stage);

var _views = require("../helpers/views");

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultViewManager = function () {
	function DefaultViewManager(options) {
		_classCallCheck(this, DefaultViewManager);

		this.name = "default";
		this.View = options.view;
		this.request = options.request;
		this.renditionQueue = options.queue;
		this.q = new _queue2.default(this);

		this.settings = (0, _core.extend)(this.settings || {}, {
			infinite: true,
			hidden: false,
			width: undefined,
			height: undefined,
			// globalLayoutProperties : { layout: "reflowable", spread: "auto", orientation: "auto"},
			// layout: null,
			axis: "vertical",
			ignoreClass: ""
		});

		(0, _core.extend)(this.settings, options.settings || {});

		this.viewSettings = {
			ignoreClass: this.settings.ignoreClass,
			axis: this.settings.axis,
			layout: this.layout,
			width: 0,
			height: 0
		};
	}

	_createClass(DefaultViewManager, [{
		key: "render",
		value: function render(element, size) {

			// Save the stage
			this.stage = new _stage2.default({
				width: size.width,
				height: size.height,
				overflow: this.settings.overflow,
				hidden: this.settings.hidden,
				axis: this.settings.axis
			});

			this.stage.attachTo(element);

			// Get this stage container div
			this.container = this.stage.getContainer();

			// Views array methods
			this.views = new _views2.default(this.container);

			// Calculate Stage Size
			this._bounds = this.bounds();
			this._stageSize = this.stage.size();

			// Set the dimensions for views
			this.viewSettings.width = this._stageSize.width;
			this.viewSettings.height = this._stageSize.height;

			// Function to handle a resize event.
			// Will only attach if width and height are both fixed.
			this.stage.onResize(this.onResized.bind(this));

			// Add Event Listeners
			this.addEventListeners();

			// Add Layout method
			// this.applyLayoutMethod();
			if (this.layout) {
				this.updateLayout();
			}
		}
	}, {
		key: "addEventListeners",
		value: function addEventListeners() {
			window.addEventListener("unload", function (e) {
				this.destroy();
			}.bind(this));
		}
	}, {
		key: "destroy",
		value: function destroy() {
			// this.views.each(function(view){
			// 	view.destroy();
			// });

			/*
   		clearTimeout(this.trimTimeout);
   	if(this.settings.hidden) {
   		this.element.removeChild(this.wrapper);
   	} else {
   		this.element.removeChild(this.container);
   	}
   */
		}
	}, {
		key: "onResized",
		value: function onResized(e) {
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = setTimeout(function () {
				this.resize();
			}.bind(this), 150);
		}
	}, {
		key: "resize",
		value: function resize(width, height) {

			// Clear the queue
			this.q.clear();

			this._stageSize = this.stage.size(width, height);
			this._bounds = this.bounds();

			// Update for new views
			this.viewSettings.width = this._stageSize.width;
			this.viewSettings.height = this._stageSize.height;

			// Update for existing views
			this.views.each(function (view) {
				view.size(this._stageSize.width, this._stageSize.height);
			}.bind(this));

			this.updateLayout();

			this.emit("resized", {
				width: this.stage.width,
				height: this.stage.height
			});
		}
	}, {
		key: "createView",
		value: function createView(section) {
			return new this.View(section, this.viewSettings);
		}
	}, {
		key: "display",
		value: function display(section, target) {

			var displaying = new _core.defer();
			var displayed = displaying.promise;

			// Check to make sure the section we want isn't already shown
			var visible = this.views.find(section);

			// View is already shown, just move to correct location
			if (visible && target) {
				var offset = visible.locationOf(target);
				this.moveTo(offset);
				displaying.resolve();
				return displayed;
			}

			// Hide all current views
			this.views.hide();

			this.views.clear();

			this.add(section).then(function (view) {

				// Move to correct place within the section, if needed
				if (target) {
					var _offset = view.locationOf(target);
					this.moveTo(_offset);
				}
			}.bind(this)).then(function () {
				var next;
				if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
					next = section.next();
					if (next) {
						return this.add(next);
					}
				}
			}.bind(this)).then(function () {

				this.views.show();

				displaying.resolve();
			}.bind(this));
			// .then(function(){
			// 	return this.hooks.display.trigger(view);
			// }.bind(this))
			// .then(function(){
			// 	this.views.show();
			// }.bind(this));
			return displayed;
		}
	}, {
		key: "afterDisplayed",
		value: function afterDisplayed(view) {
			this.emit("added", view);
		}
	}, {
		key: "afterResized",
		value: function afterResized(view) {
			this.emit("resize", view.section);
		}

		// moveTo(offset){
		// 	this.scrollTo(offset.left, offset.top);
		// };

	}, {
		key: "moveTo",
		value: function moveTo(offset) {
			var distX = 0,
			    distY = 0;

			if (this.settings.axis === "vertical") {
				distY = offset.top;
			} else {
				distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;

				if (distX + this.layout.delta > this.container.scrollWidth) {
					distX = this.container.scrollWidth - this.layout.delta;
				}
			}

			this.scrollTo(distX, distY);
		}
	}, {
		key: "add",
		value: function add(section) {
			var view = this.createView(section);

			this.views.append(view);

			// view.on("shown", this.afterDisplayed.bind(this));
			view.onDisplayed = this.afterDisplayed.bind(this);
			view.onResize = this.afterResized.bind(this);

			return view.display(this.request);
		}
	}, {
		key: "append",
		value: function append(section) {
			var view = this.createView(section);
			this.views.append(view);

			view.onDisplayed = this.afterDisplayed.bind(this);
			view.onResize = this.afterResized.bind(this);

			return view.display(this.request);
		}
	}, {
		key: "prepend",
		value: function prepend(section) {
			var view = this.createView(section);

			this.views.prepend(view);

			view.onDisplayed = this.afterDisplayed.bind(this);
			view.onResize = this.afterResized.bind(this);

			return view.display(this.request);
		}
		// resizeView(view) {
		//
		// 	if(this.settings.globalLayoutProperties.layout === "pre-paginated") {
		// 		view.lock("both", this.bounds.width, this.bounds.height);
		// 	} else {
		// 		view.lock("width", this.bounds.width, this.bounds.height);
		// 	}
		//
		// };

	}, {
		key: "next",
		value: function next() {
			var next;
			var left;

			if (!this.views.length) return;

			if (this.settings.axis === "horizontal") {

				this.scrollLeft = this.container.scrollLeft;

				left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;

				if (left < this.container.scrollWidth) {
					this.scrollBy(this.layout.delta, 0);
				} else if (left - this.layout.columnWidth === this.container.scrollWidth) {
					this.scrollTo(this.container.scrollWidth - this.layout.delta, 0);
				} else {
					next = this.views.last().section.next();
				}
			} else {

				next = this.views.last().section.next();
			}

			if (next) {
				this.views.clear();

				return this.append(next).then(function () {
					var right;
					if (this.layout.name && this.layout.divisor > 1) {
						right = next.next();
						if (right) {
							return this.append(right);
						}
					}
				}.bind(this)).then(function () {
					this.views.show();
				}.bind(this));
			}
		}
	}, {
		key: "prev",
		value: function prev() {
			var prev;
			var left;

			if (!this.views.length) return;

			if (this.settings.axis === "horizontal") {

				this.scrollLeft = this.container.scrollLeft;

				left = this.container.scrollLeft;

				if (left > 0) {
					this.scrollBy(-this.layout.delta, 0);
				} else {
					prev = this.views.first().section.prev();
				}
			} else {

				prev = this.views.first().section.prev();
			}

			if (prev) {
				this.views.clear();

				return this.prepend(prev).then(function () {
					var left;
					if (this.layout.name && this.layout.divisor > 1) {
						left = prev.prev();
						if (left) {
							return this.prepend(left);
						}
					}
				}.bind(this)).then(function () {
					if (this.settings.axis === "horizontal") {
						this.scrollTo(this.container.scrollWidth - this.layout.delta, 0);
					}
					this.views.show();
				}.bind(this));
			}
		}
	}, {
		key: "current",
		value: function current() {
			var visible = this.visible();
			if (visible.length) {
				// Current is the last visible view
				return visible[visible.length - 1];
			}
			return null;
		}
	}, {
		key: "currentLocation",
		value: function currentLocation() {

			if (this.settings.axis === "vertical") {
				this.location = this.scrolledLocation();
			} else {
				this.location = this.paginatedLocation();
			}
			return this.location;
		}
	}, {
		key: "scrolledLocation",
		value: function scrolledLocation() {
			var view;

			if (this.views.length) {
				view = this.views.first();
				return this.mapping.page(view, view.section.cfiBase);
			}
		}
	}, {
		key: "paginatedLocation",
		value: function paginatedLocation() {
			var view;
			var start, end;

			if (this.views.length) {
				view = this.views.first();
				start = this._bounds.left - view.position().left;
				end = start + this.layout.spreadWidth;
				return this.mapping.page(view, view.section.cfiBase, start, end);
			}
		}
	}, {
		key: "isVisible",
		value: function isVisible(view, offsetPrev, offsetNext, _container) {
			var position = view.position();
			var container = _container || this.bounds();

			if (this.settings.axis === "horizontal" && position.right > container.left - offsetPrev && position.left < container.right + offsetNext) {

				return true;
			} else if (this.settings.axis === "vertical" && position.bottom > container.top - offsetPrev && position.top < container.bottom + offsetNext) {

				return true;
			}

			return false;
		}
	}, {
		key: "visible",
		value: function visible() {
			// return this.views.displayed();
			var container = this.bounds();
			var views = this.views.displayed();
			var viewsLength = views.length;
			var visible = [];
			var isVisible;
			var view;

			for (var i = 0; i < viewsLength; i++) {
				view = views[i];
				isVisible = this.isVisible(view, 0, 0, container);

				if (isVisible === true) {
					visible.push(view);
				}
			}
			return visible;
		}
	}, {
		key: "scrollBy",
		value: function scrollBy(x, y, silent) {
			if (silent) {
				this.ignore = true;
			}

			if (this.settings.height) {

				if (x) this.container.scrollLeft += x;
				if (y) this.container.scrollTop += y;
			} else {
				window.scrollBy(x, y);
			}
			// console.log("scrollBy", x, y);
			this.scrolled = true;
			this.onScroll();
		}
	}, {
		key: "scrollTo",
		value: function scrollTo(x, y, silent) {
			if (silent) {
				this.ignore = true;
			}

			if (this.settings.height) {
				this.container.scrollLeft = x;
				this.container.scrollTop = y;
			} else {
				window.scrollTo(x, y);
			}
			// console.log("scrollTo", x, y);
			this.scrolled = true;
			this.onScroll();
			// if(this.container.scrollLeft != x){
			//   setTimeout(function() {
			//     this.scrollTo(x, y, silent);
			//   }.bind(this), 10);
			//   return;
			// };
		}
	}, {
		key: "onScroll",
		value: function onScroll() {}
	}, {
		key: "bounds",
		value: function bounds() {
			var bounds;

			bounds = this.stage.bounds();

			return bounds;
		}
	}, {
		key: "applyLayout",
		value: function applyLayout(layout) {

			this.layout = layout;
			this.updateLayout();

			this.mapping = new _mapping2.default(this.layout);
			// this.manager.layout(this.layout.format);
		}
	}, {
		key: "updateLayout",
		value: function updateLayout() {
			if (!this.stage) {
				return;
			}

			this._stageSize = this.stage.size();

			if (this.settings.axis === "vertical") {
				this.layout.calculate(this._stageSize.width, this._stageSize.height);
			} else {
				this.layout.calculate(this._stageSize.width, this._stageSize.height, this.settings.gap);

				// Set the look ahead offset for what is visible
				this.settings.offset = this.layout.delta;

				this.stage.addStyleRules("iframe", [{ "margin-right": this.layout.gap + "px" }]);
			}

			// Set the dimensions for views
			this.viewSettings.width = this.layout.width;
			this.viewSettings.height = this.layout.height;

			this.setLayout(this.layout);
		}
	}, {
		key: "setLayout",
		value: function setLayout(layout) {

			this.viewSettings.layout = layout;

			if (this.views) {

				this.views.each(function (view) {
					view.setLayout(layout);
				});
			}
		}
	}, {
		key: "updateFlow",
		value: function updateFlow(flow) {
			var axis = flow === "paginated" ? "horizontal" : "vertical";

			this.settings.axis = axis;

			this.viewSettings.axis = axis;

			this.settings.overflow = flow === "paginated" ? "hidden" : "auto";
			// this.views.each(function(view){
			// 	view.setAxis(axis);
			// });
		}
	}, {
		key: "getContents",
		value: function getContents() {
			var contents = [];
			this.views.each(function (view) {
				contents.push(view.contents);
			});
			return contents;
		}
	}]);

	return DefaultViewManager;
}();

//-- Enable binding events to Manager


(0, _eventEmitter2.default)(DefaultViewManager.prototype);

exports.default = DefaultViewManager;
module.exports = exports["default"];