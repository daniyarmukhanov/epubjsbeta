import {qs, qsa, qsp} from "./utils/core";

/**
 * Open Packaging Format Parser
 * @class
 * @param {document} packageDocument OPF XML
 */
class Packaging {
	constructor(packageDocument) {
		if (packageDocument) {
			this.parse(packageDocument);
		}
	}

	/**
	 * Parse OPF XML
	 * @param  {document} packageDocument OPF XML
	 * @return {object} parsed package parts
	 */
	parse(packageDocument){
		var metadataNode, manifestNode, spineNode;

		if(!packageDocument) {
			throw new Error("Package File Not Found");
		}

		metadataNode = qs(packageDocument, "metadata");
		if(!metadataNode) {
			throw new Error("No Metadata Found");
		}

		manifestNode = qs(packageDocument, "manifest");
		if(!manifestNode) {
			throw new Error("No Manifest Found");
		}

		spineNode = qs(packageDocument, "spine");
		if(!spineNode) {
			throw new Error("No Spine Found");
		}

		this.manifest = this.parseManifest(manifestNode);
		this.navPath = this.findNavPath(manifestNode);
		this.ncxPath = this.findNcxPath(manifestNode, spineNode);
		this.coverPath = this.findCoverPath(packageDocument);

		this.spineNodeIndex = Array.prototype.indexOf.call(spineNode.parentNode.childNodes, spineNode);

		this.spine = this.parseSpine(spineNode, this.manifest);

		this.metadata = this.parseMetadata(metadataNode);

		this.metadata.direction = spineNode.getAttribute("page-progression-direction");


		return {
			"metadata" : this.metadata,
			"spine"    : this.spine,
			"manifest" : this.manifest,
			"navPath"  : this.navPath,
			"ncxPath"  : this.ncxPath,
			"coverPath": this.coverPath,
			"spineNodeIndex" : this.spineNodeIndex
		};
	}

	/**
	 * Parse Metadata
	 * @private
	 * @param  {document} xml
	 * @return {object} metadata
	 */
	parseMetadata(xml){
		var metadata = {};

		metadata.title = this.getElementText(xml, "title");
		metadata.creator = this.getElementText(xml, "creator");
		metadata.description = this.getElementText(xml, "description");

		metadata.pubdate = this.getElementText(xml, "date");

		metadata.publisher = this.getElementText(xml, "publisher");

		metadata.identifier = this.getElementText(xml, "identifier");
		metadata.language = this.getElementText(xml, "language");
		metadata.rights = this.getElementText(xml, "rights");

		metadata.modified_date = this.getPropertyText(xml, "dcterms:modified");

		metadata.layout = this.getPropertyText(xml, "rendition:layout");
		metadata.orientation = this.getPropertyText(xml, "rendition:orientation");
		metadata.flow = this.getPropertyText(xml, "rendition:flow");
		metadata.viewport = this.getPropertyText(xml, "rendition:viewport");
		// metadata.page_prog_dir = packageXml.querySelector("spine").getAttribute("page-progression-direction");

		return metadata;
	}

	/**
	 * Parse Manifest
	 * @private
	 * @param  {document} manifestXml
	 * @return {object} manifest
	 */
	parseManifest(manifestXml){
		var manifest = {};

		//-- Turn items into an array
		// var selected = manifestXml.querySelectorAll("item");
		var selected = qsa(manifestXml, "item");
		var items = Array.prototype.slice.call(selected);

		//-- Create an object with the id as key
		items.forEach(function(item){
			var id = item.getAttribute("id"),
					href = item.getAttribute("href") || "",
					type = item.getAttribute("media-type") || "",
					properties = item.getAttribute("properties") || "";

			manifest[id] = {
				"href" : href,
				// "url" : href,
				"type" : type,
				"properties" : properties.length ? properties.split(" ") : []
			};

		});

		return manifest;

	}

	/**
	 * Parse Spine
	 * @param  {document} spineXml
	 * @param  {Packaging.manifest} manifest
	 * @return {object} spine
	 */
	parseSpine(spineXml, manifest){
		var spine = [];

		var selected = spineXml.getElementsByTagName("itemref");
		var items = Array.prototype.slice.call(selected);

		// var epubcfi = new EpubCFI();

		//-- Add to array to mantain ordering and cross reference with manifest
		items.forEach(function(item, index){
			var idref = item.getAttribute("idref");
			// var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
			var props = item.getAttribute("properties") || "";
			var propArray = props.length ? props.split(" ") : [];
			// var manifestProps = manifest[Id].properties;
			// var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];

			var itemref = {
				"idref" : idref,
				"linear" : item.getAttribute("linear") || "",
				"properties" : propArray,
				// "href" : manifest[Id].href,
				// "url" :  manifest[Id].url,
				"index" : index
				// "cfiBase" : cfiBase
			};
			spine.push(itemref);
		});

		return spine;
	}

	/**
	 * Find TOC NAV
	 * @private
	 */
	findNavPath(manifestNode){
		// Find item with property "nav"
		// Should catch nav irregardless of order
		// var node = manifestNode.querySelector("item[properties$='nav'], item[properties^='nav '], item[properties*=' nav ']");
		var node = qsp(manifestNode, "item", {"properties":"nav"});
		return node ? node.getAttribute("href") : false;
	}

	/**
	 * Find TOC NCX
	 * media-type="application/x-dtbncx+xml" href="toc.ncx"
	 * @private
	 */
	findNcxPath(manifestNode, spineNode){
		// var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
		var node = qsp(manifestNode, "item", {"media-type":"application/x-dtbncx+xml"});
		var tocId;

		// If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
		// according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
		// "The item that describes the NCX must be referenced by the spine toc attribute."
		if (!node) {
			tocId = spineNode.getAttribute("toc");
			if(tocId) {
				// node = manifestNode.querySelector("item[id='" + tocId + "']");
				node = manifestNode.getElementById(tocId);
			}
		}

		return node ? node.getAttribute("href") : false;
	}

	/**
	 * Find the Cover Path
	 * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
	 * Fallback for Epub 2.0
	 * @param  {document} packageXml
	 * @return {string} href
	 */
	findCoverPath(packageXml){
		var pkg = qs(packageXml, "package");
		var epubVersion = pkg.getAttribute("version");

		if (epubVersion === "2.0") {
			var metaCover = qsp(packageXml, "meta", {"name":"cover"});
			if (metaCover) {
				var coverId = metaCover.getAttribute("content");
				// var cover = packageXml.querySelector("item[id='" + coverId + "']");
				var cover = packageXml.getElementById(coverId);
				return cover ? cover.getAttribute("href") : "";
			}
			else {
				return false;
			}
		}
		else {
			// var node = packageXml.querySelector("item[properties='cover-image']");
			var node = qsp(packageXml, "item", {"properties":"cover-image"});
			return node ? node.getAttribute("href") : "";
		}
	}

	/**
	 * Get text of a namespaced element
	 * @private
	 * @param  {document} xml
	 * @param  {string} tag
	 * @return {string} text
	 */
	getElementText(xml, tag){
		var found = xml.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", tag);
		var el;

		if(!found || found.length === 0) return "";

		el = found[0];

		if(el.childNodes.length){
			return el.childNodes[0].nodeValue;
		}

		return "";

	}

	/**
	 * Get text by property
	 * @private
	 * @param  {document} xml
	 * @param  {string} property
	 * @return {string} text
	 */
	getPropertyText(xml, property){
		var el = qsp(xml, "meta", {"property":property});

		if(el && el.childNodes.length){
			return el.childNodes[0].nodeValue;
		}

		return "";
	}
}

export default Packaging;
