"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import path from "path";


var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _core = require("./utils/core");

var _url = require("./utils/url");

var _url2 = _interopRequireDefault(_url);

var _path = require("./utils/path");

var _path2 = _interopRequireDefault(_path);

var _spine = require("./spine");

var _spine2 = _interopRequireDefault(_spine);

var _locations = require("./locations");

var _locations2 = _interopRequireDefault(_locations);

var _container = require("./container");

var _container2 = _interopRequireDefault(_container);

var _packaging = require("./packaging");

var _packaging2 = _interopRequireDefault(_packaging);

var _navigation = require("./navigation");

var _navigation2 = _interopRequireDefault(_navigation);

var _resources = require("./resources");

var _resources2 = _interopRequireDefault(_resources);

var _pagelist = require("./pagelist");

var _pagelist2 = _interopRequireDefault(_pagelist);

var _rendition = require("./rendition");

var _rendition2 = _interopRequireDefault(_rendition);

var _archive = require("./archive");

var _archive2 = _interopRequireDefault(_archive);

var _request = require("./utils/request");

var _request2 = _interopRequireDefault(_request);

var _epubcfi = require("./epubcfi");

var _epubcfi2 = _interopRequireDefault(_epubcfi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTAINER_PATH = "META-INF/container.xml";
var EPUBJS_VERSION = "0.3";

/**
 * Creates a new Book
 * @class
 * @param {string} url
 * @param {object} options
 * @param {method} options.requestMethod a request function to use instead of the default
 * @param {boolean} [options.requestCredentials=undefined] send the xhr request withCredentials
 * @param {object} [options.requestHeaders=undefined] send the xhr request headers
 * @param {string} [options.encoding=binary] optional to pass 'binary' or base64' for archived Epubs
 * @param {string} [options.replacements=base64] use base64, blobUrl, or none for replacing assets in archived Epubs
 * @returns {Book}
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */

var Book = function () {
	function Book(url, options) {
		var _this = this;

		_classCallCheck(this, Book);

		// Allow passing just options to the Book
		if (typeof options === "undefined" && (typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
			options = url;
			url = undefined;
		}

		this.settings = (0, _core.extend)(this.settings || {}, {
			requestMethod: undefined,
			requestCredentials: undefined,
			requestHeaders: undefined,
			encoding: undefined,
			replacements: "base64"
		});

		(0, _core.extend)(this.settings, options);

		// Promises
		this.opening = new _core.defer();
		/**
   * @property {promise} opened returns after the book is loaded
   */
		this.opened = this.opening.promise;
		this.isOpen = false;

		this.loading = {
			manifest: new _core.defer(),
			spine: new _core.defer(),
			metadata: new _core.defer(),
			cover: new _core.defer(),
			navigation: new _core.defer(),
			pageList: new _core.defer(),
			resources: new _core.defer()
		};

		this.loaded = {
			manifest: this.loading.manifest.promise,
			spine: this.loading.spine.promise,
			metadata: this.loading.metadata.promise,
			cover: this.loading.cover.promise,
			navigation: this.loading.navigation.promise,
			pageList: this.loading.pageList.promise,
			resources: this.loading.resources.promise
		};

		// this.ready = RSVP.hash(this.loaded);
		/**
   * @property {promise} ready returns after the book is loaded and parsed
   * @private
   */
		this.ready = Promise.all([this.loaded.manifest, this.loaded.spine, this.loaded.metadata, this.loaded.cover, this.loaded.navigation, this.loaded.resources]);

		// Queue for methods used before opening
		this.isRendered = false;
		// this._q = queue(this);

		/**
   * @property {method} request
   * @private
   */
		this.request = this.settings.requestMethod || _request2.default;

		/**
   * @property {Spine} spine
   */
		this.spine = new _spine2.default();

		/**
   * @property {Locations} locations
   */
		this.locations = new _locations2.default(this.spine, this.load.bind(this));

		/**
   * @property {Navigation} navigation
   */
		this.navigation = undefined;

		/**
   * @property {PageList} pagelist
   */
		this.pageList = new _pagelist2.default();

		/**
   * @property {Url} url
   * @private
   */
		this.url = undefined;

		/**
   * @property {Path} path
   * @private
   */
		this.path = undefined;

		/**
   * @property {boolean} archived
   * @private
   */
		this.archived = false;

		if (url) {
			this.open(url).catch(function (error) {
				var err = new Error("Cannot load book at " + url);
				// console.error(err);
				_this.emit("openFailed", err);
			});
		}
	}

	/**
  * Open a epub or url
  * @param {string} input URL, Path or ArrayBuffer
  * @param {string} [what] to force opening
  * @returns {Promise} of when the book has been loaded
  * @example book.open("/path/to/book.epub")
  */


	_createClass(Book, [{
		key: "open",
		value: function open(input, what) {
			var opening;
			var type = what || this.determineType(input);

			if (type === "binary") {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.openEpub(input);
			} else if (type === "base64") {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.openEpub(input, type);
			} else if (type === "epub") {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.request(input, "binary").then(this.openEpub.bind(this));
			} else if (type == "opf") {
				this.url = new _url2.default(input);
				opening = this.openPackaging(this.url.Path.toString());
			} else {
				this.url = new _url2.default(input);
				opening = this.openContainer(CONTAINER_PATH).then(this.openPackaging.bind(this));
			}

			return opening;
		}

		/**
   * Open an archived epub
   * @private
   * @param  {binary} data
   * @param  {[string]} encoding
   * @return {Promise}
   */

	}, {
		key: "openEpub",
		value: function openEpub(data, encoding) {
			var _this2 = this;

			return this.unarchive(data, encoding || this.settings.encoding).then(function () {
				return _this2.openContainer(CONTAINER_PATH);
			}).then(function (packagePath) {
				return _this2.openPackaging(packagePath);
			});
		}

		/**
   * Open the epub container
   * @private
   * @param  {string} url
   * @return {string} packagePath
   */

	}, {
		key: "openContainer",
		value: function openContainer(url) {
			var _this3 = this;

			return this.load(url).then(function (xml) {
				_this3.container = new _container2.default(xml);
				return _this3.resolve(_this3.container.packagePath);
			});
		}

		/**
   * Open the Open Packaging Format Xml
   * @private
   * @param  {string} url
   * @return {Promise}
   */

	}, {
		key: "openPackaging",
		value: function openPackaging(url) {
			var _this4 = this;

			this.path = new _path2.default(url);
			return this.load(url).then(function (xml) {
				_this4.packaging = new _packaging2.default(xml);
				return _this4.unpack(_this4.packaging);
			});
		}

		/**
   * Load a resource from the Book
   * @param  {string} path path to the resource to load
   * @return {Promise}     returns a promise with the requested resource
   */

	}, {
		key: "load",
		value: function load(path) {
			var resolved;

			if (this.archived) {
				resolved = this.resolve(path);
				return this.archive.request(resolved);
			} else {
				resolved = this.resolve(path);
				return this.request(resolved, null, this.settings.requestCredentials, this.settings.requestHeaders);
			}
		}

		/**
   * Resolve a path to it's absolute position in the Book
   * @param  {string} path
   * @param  {[boolean]} absolute force resolving the full URL
   * @return {string}          the resolved path string
   */

	}, {
		key: "resolve",
		value: function resolve(path, absolute) {
			var resolved = path;
			var isAbsolute = path.indexOf("://") > -1;

			if (isAbsolute) {
				return path;
			}

			if (this.path) {
				resolved = this.path.resolve(path);
			}

			if (absolute != false && this.url) {
				resolved = this.url.resolve(resolved);
			}

			return resolved;
		}

		/**
   * Determine the type of they input passed to open
   * @private
   * @param  {string} input
   * @return {string}  binary | directory | epub | opf
   */

	}, {
		key: "determineType",
		value: function determineType(input) {
			var url;
			var path;
			var extension;

			if (this.settings.encoding === "base64") {
				return "base64";
			}

			if (typeof input != "string") {
				return "binary";
			}

			url = new _url2.default(input);
			path = url.path();
			extension = path.extension;

			if (!extension) {
				return "directory";
			}

			if (extension === "epub") {
				return "epub";
			}

			if (extension === "opf") {
				return "opf";
			}
		}

		/**
   * unpack the contents of the Books packageXml
   * @private
   * @param {document} packageXml XML Document
   */

	}, {
		key: "unpack",
		value: function unpack(opf) {
			var _this5 = this;

			this.package = opf;

			this.spine.unpack(this.package, this.resolve.bind(this));

			this.resources = new _resources2.default(this.package.manifest, {
				archive: this.archive,
				resolver: this.resolve.bind(this),
				replacements: this.settings.replacements
			});

			this.loadNavigation(this.package).then(function () {
				_this5.toc = _this5.navigation.toc;
				_this5.loading.navigation.resolve(_this5.navigation);
			});
			if (this.package.coverPath) {
				this.cover = this.resolve(this.package.coverPath);
			}
			// Resolve promises
			this.loading.manifest.resolve(this.package.manifest);
			this.loading.metadata.resolve(this.package.metadata);
			this.loading.spine.resolve(this.spine);
			this.loading.cover.resolve(this.cover);
			this.loading.resources.resolve(this.resources);
			this.loading.pageList.resolve(this.pageList);

			this.isOpen = true;

			if (this.archived) {
				this.replacements().then(function () {
					_this5.opening.resolve(_this5);
				});
			} else {
				// Resolve book opened promise
				this.opening.resolve(this);
			}
		}

		/**
   * Load Navigation and PageList from package
   * @private
   * @param {document} opf XML Document
   */

	}, {
		key: "loadNavigation",
		value: function loadNavigation(opf) {
			var _this6 = this;

			var navPath = opf.navPath || opf.ncxPath;

			if (!navPath) {
				return;
			}

			return this.load(navPath, "xml").then(function (xml) {
				_this6.navigation = new _navigation2.default(xml);
				_this6.pageList = new _pagelist2.default(xml);
				return _this6.navigation;
			});
		}

		/**
   * Alias for book.spine.get
   * @param {string} target
   */

	}, {
		key: "section",
		value: function section(target) {
			return this.spine.get(target);
		}

		/**
   * Sugar to render a book
   * @param  {element} element element to add the views to
   * @param  {[object]} options
   * @return {Rendition}
   */

	}, {
		key: "renderTo",
		value: function renderTo(element, options) {
			// var renderMethod = (options && options.method) ?
			//     options.method :
			//     "single";

			this.rendition = new _rendition2.default(this, options);
			this.rendition.attachTo(element);

			return this.rendition;
		}

		/**
   * Set if request should use withCredentials
   * @param {boolean} credentials
   */

	}, {
		key: "setRequestCredentials",
		value: function setRequestCredentials(credentials) {
			this.settings.requestCredentials = credentials;
		}

		/**
   * Set headers request should use
   * @param {object} headers
   */

	}, {
		key: "setRequestHeaders",
		value: function setRequestHeaders(headers) {
			this.settings.requestHeaders = headers;
		}

		/**
   * Unarchive a zipped epub
   * @private
   * @param  {binary} input epub data
   * @param  {[string]} encoding
   * @return {Archive}
   */

	}, {
		key: "unarchive",
		value: function unarchive(input, encoding) {
			this.archive = new _archive2.default();
			return this.archive.open(input, encoding);
		}

		/**
   * Get the cover url
   * @return {string} coverUrl
   */

	}, {
		key: "coverUrl",
		value: function coverUrl() {
			var _this7 = this;

			var retrieved = this.loaded.cover.then(function (url) {
				if (_this7.archived) {
					// return this.archive.createUrl(this.cover);
					return _this7.resources.get(_this7.cover);
				} else {
					return _this7.cover;
				}
			});

			return retrieved;
		}

		/**
   * load replacement urls
   * @private
   * @return {Promise} completed loading urls
   */

	}, {
		key: "replacements",
		value: function replacements() {
			var _this8 = this;

			this.spine.hooks.serialize.register(function (output, section) {
				section.output = _this8.resources.substitute(output, section.url);
			});

			return this.resources.replacements().then(function () {
				return _this8.resources.replaceCss();
			});
		}

		/**
   * Find a DOM Range for a given CFI Range
   * @param  {EpubCFI} cfiRange a epub cfi range
   * @return {Range}
   */

	}, {
		key: "range",
		value: function range(cfiRange) {
			var cfi = new _epubcfi2.default(cfiRange);
			var item = this.spine.get(cfi.spinePos);

			return item.load().then(function (contents) {
				var range = cfi.toRange(item.document);
				return range;
			});
		}

		/**
   * Generates the Book Key using the identifer in the manifest or other string provided
   * @param  {[string]} identifier to use instead of metadata identifier
   * @return {string} key
   */

	}, {
		key: "key",
		value: function key(identifier) {
			var ident = identifier || this.package.metadata.identifier || this.url.filename;
			return "epubjs:" + EPUBJS_VERSION + ":" + ident;
		}
	}]);

	return Book;
}();

//-- Enable binding events to book


(0, _eventEmitter2.default)(Book.prototype);

exports.default = Book;
module.exports = exports["default"];