<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

# ePub

Creates a new Book

**Parameters**

-   `url` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))** URL, Path or ArrayBuffer
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** to pass to the book

**Examples**

```javascript
ePub("/path/to/book.epub", {})
```

Returns **[Book](#book)** a new Book object

## register

register plugins

### manager

register a new view manager

### view

register a new view

# Book

Creates a new Book

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.requestMethod` **method** a request function to use instead of the default
    -   `options.requestCredentials` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** send the xhr request withCredentials (optional, default `undefined`)
    -   `options.requestHeaders` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** send the xhr request headers (optional, default `undefined`)
    -   `options.encoding` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** optional to pass 'binary' or base64' for archived Epubs (optional, default `binary`)
    -   `options.replacements` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** use base64, blobUrl, or none for replacing assets in archived Epubs (optional, default `base64`)

**Examples**

```javascript
new Book("/path/to/book.epub", {})
```

```javascript
new Book({ replacements: "blobUrl" })
```

Returns **[Book](#book)** 

## opened

**Properties**

-   `opened` **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** returns after the book is loaded

## spine

**Properties**

-   `spine` **[Spine](#spine)** 

## locations

**Properties**

-   `locations` **[Locations](#locations)** 

## navigation

**Properties**

-   `navigation` **[Navigation](#navigation)** 

## pageList

**Properties**

-   `pagelist` **[PageList](#pagelist)** 

## open

Open a epub or url

**Parameters**

-   `input` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL, Path or ArrayBuffer
-   `what` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** to force opening

**Examples**

```javascript
book.open("/path/to/book.epub")
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** of when the book has been loaded

## load

Load a resource from the Book

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** path to the resource to load

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** returns a promise with the requested resource

## resolve

Resolve a path to it's absolute position in the Book

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `absolute` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]** force resolving the full URL

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the resolved path string

## section

Alias for book.spine.get

**Parameters**

-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## renderTo

Sugar to render a book

**Parameters**

-   `element` **[element](https://developer.mozilla.org/en-US/docs/Web/API/Element)** element to add the views to
-   `options` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** 

Returns **[Rendition](#rendition)** 

## setRequestCredentials

Set if request should use withCredentials

**Parameters**

-   `credentials` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## setRequestHeaders

Set headers request should use

**Parameters**

-   `headers` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## coverUrl

Get the cover url

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** coverUrl

## range

Find a DOM Range for a given CFI Range

**Parameters**

-   `cfiRange` **[EpubCFI](#epubcfi)** a epub cfi range

Returns **[Range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)** 

## key

Generates the Book Key using the identifer in the manifest or other string provided

**Parameters**

-   `identifier` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** to use instead of metadata identifier

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** key

# Url

creates a uri object

**Parameters**

-   `urlString` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a url string (relative or absolute)
-   `baseString` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** optional base for the url,
    default to window.location.href

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** url

# Spine

A collection of Spine Items

## unpack

Unpack items from a opf into spine items

**Parameters**

-   `_package` **Package** 
-   `resolver` **method** URL resolver

## get

Get an item from the spine

**Parameters**

-   `target`  

**Examples**

```javascript
spine.get();
```

```javascript
spine.get(1);
```

```javascript
spine.get("chap1.html");
```

```javascript
spine.get("#id1234");
```

Returns **[Section](#section)** section

## each

Loop over the Sections in the Spine

Returns **method** forEach

# Section

Represents a Section of the Book
In most books this is equivelent to a Chapter

**Parameters**

-   `item` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The spine item representing the section
-   `hooks` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** hooks for serialize and content

## load

Load the section from its url

**Parameters**

-   `_request` **method** a request method to use for loading

Returns **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** a promise with the xml document

## render

Render the contents of a section

**Parameters**

-   `_request` **method** a request method to use for loading

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** output a serialized XML Document

## find

Find a string in a section
TODO: need reimplementation from v0.2

**Parameters**

-   `query` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** [description]

Returns **\[type]** [description]

## reconcileLayoutSettings

Reconciles the current chapters layout properies with
the global layout properities.

**Parameters**

-   `global` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The globa layout settings object, chapter properties string

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** layoutProperties Object with layout properties

## cfiFromRange

Get a CFI from a Range in the Section

**Parameters**

-   `_range` **[range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** cfi an EpubCFI string

## cfiFromElement

Get a CFI from an Element in the Section

**Parameters**

-   `el` **[element](https://developer.mozilla.org/en-US/docs/Web/API/Element)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** cfi an EpubCFI string

# Locations

Find Locations for a Book

**Parameters**

-   `spine` **[Spine](#spine)** 
-   `request` **[request](https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request)** 

## generate

Load all of sections in the book to generate locations

**Parameters**

-   `chars` **int** how many chars to split on

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** locations

# Container

Handles Parsing and Accessing an Epub Container

**Parameters**

-   `containerDocument` **\[[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)]** xml document

## parse

Parse the Container XML

**Parameters**

-   `containerDocument` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** 

# Packaging

Open Packaging Format Parser

**Parameters**

-   `packageDocument` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** OPF XML

## parse

Parse OPF XML

**Parameters**

-   `packageDocument` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** OPF XML

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** parsed package parts

## parseSpine

Parse Spine

**Parameters**

-   `spineXml` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** 
-   `manifest` **Packaging.manifest** 

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** spine

## findCoverPath

Find the Cover Path
<item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
Fallback for Epub 2.0

**Parameters**

-   `packageXml` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** href

# Navigation

Navigation Parser

**Parameters**

-   `xml` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** navigation html / xhtml / ncx

## parse

Parse out the navigation items

**Parameters**

-   `xml` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** navigation html / xhtml / ncx

## get

Get an item from the navigation

**Parameters**

-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** navItems

# Resources

Handle Package Resources

**Parameters**

-   `manifest` **Manifest** 
-   `options` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** 
    -   `options.archive` **\[[Archive](#archive)]** 
    -   `options.resolver` **\[method]** 

## replacements

Create blob urls for all the assets

**Parameters**

-   `archive` **[Archive](#archive)** 
-   `resolver` **resolver** Url resolver

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** returns replacement urls

## relativeTo

Resolve all resources URLs relative to an absolute URL

**Parameters**

-   `absolute` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** to be resolved to
-   `resolver` **\[resolver]** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** array with relative Urls

## get

Get a URL for a resource

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** url

# PageList

Page List Parser

**Parameters**

-   `xml` **\[[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)]** 

## parse

Parse PageList Xml

**Parameters**

-   `xml` **[document](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** 

## addCFIs

Replace HREFs with CFI
TODO: implement getting CFI from Href

## pageFromCfi

Get a PageList result from a EpubCFI

**Parameters**

-   `cfi` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** EpubCFI String

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** page

## cfiFromPage

Get an EpubCFI from a Page List Item

**Parameters**

-   `pg` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** cfi

## pageFromPercentage

Get a Page from Book percentage

**Parameters**

-   `percent` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** page

## percentageFromPage

Returns a value between 0 - 1 corresponding to the location of a page

**Parameters**

-   `pg` **int** the page

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** percentage

## percentageFromCfi

Returns a value between 0 - 1 corresponding to the location of a cfi

**Parameters**

-   `cfi` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** EpubCFI String

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** percentage

# Archive

Handles Unzipping a requesting files from an Epub Archive

## open

Open an archive

**Parameters**

-   `input` **binary** 
-   `isBase64` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** tells JSZip if the input data is base64 encoded

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** zipfile

## openUrl

Load and Open an archive

**Parameters**

-   `zipUrl` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `isBase64` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** tells JSZip if the input data is base64 encoded

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** zipfile

## request

Request

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a url to request from the archive
-   `type` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** specify the type of the returned result

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getBlob

Get a Blob from Archive by Url

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** 

Returns **[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)** 

## getText

Get Text from Archive by Url

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `encoding` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## getBase64

Get a base64 encoded result from Archive by Url

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** base64 encoded

## createUrl

Create a Url from an unarchived item

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options`  
    -   `options.base64` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** use base64 encoding or blob url

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** url promise with Url string

## revokeUrl

Revoke Temp Url for a achive item

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** url of the item in the archive

# EpubCFI

EPUB CFI spec: <http://www.idpf.org/epub/linking/cfi/epub-cfi.html>

Implements:

-   Character Offset: epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)
-   Simple Ranges : epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)

Does Not Implement:

-   Temporal Offset (~)
-   Spatial Offset (@)
-   Temporal-Spatial Offset (~ + @)
-   Text Location Assertion (\[)

**Parameters**

-   `cfiFrom`  
-   `base`  
-   `ignoreClass`  

# content

**Properties**

-   `hooks.content` **method** 

# Rendition

[Rendition description]

**Parameters**

-   `book` **[Book](#book)** 
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.width` **int** 
    -   `options.height` **int** 
    -   `options.ignoreClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.manager` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.view` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.layout` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.spread` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
    -   `options.minSpreadWidth` **int** overridden by spread: none (never) / both (always)

## hooks

Adds Hook methods to the Rendition prototype

**Properties**

-   `hooks` **[Hook](#hook)** 

## setManager

Set the manager function

**Parameters**

-   `manager` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

## requireManager

Require the manager from passed string, or as a function

**Parameters**

-   `manager` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function))** [description]

Returns **method** 

## requireView

Require the view from passed string, or as a function

**Parameters**

-   `view` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function))** 

Returns **view** 

## start

Start the rendering

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** rendering has started

## attachTo

Call to attach the container to an element in the dom
Container must be attached before rendering can begin

**Parameters**

-   `element` **[element](https://developer.mozilla.org/en-US/docs/Web/API/Element)** to attach to

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## display

Display a point in the book
The request will be added to the rendering Queue,
so it will wait until book is opened, rendering started
and all other rendering tasks have finished to be called.

**Parameters**

-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Url or EpubCFI

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## moveTo

Move the Rendition to a specific offset
Usually you would be better off calling display()

**Parameters**

-   `offset` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## next

Go to the next "page" in the rendition

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## prev

Go to the previous "page" in the rendition

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flow

Adjust the flow of the rendition to paginated or scrolled
(scrolled-continuous vs scrolled-doc are handled by different view managers)

**Parameters**

-   `flow` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## layout

Adjust the layout of the rendition to reflowable or pre-paginated

**Parameters**

-   `settings` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## spread

Adjust if the rendition uses spreads

**Parameters**

-   `spread` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** none | auto (TODO: implement landscape, portrait, both)
-   `min` **int** min width to use spreads at

## currentLocation

Get the Current Location CFI

Returns **[EpubCFI](#epubcfi)** location (may be a promise)

## destroy

Remove and Clean Up the Rendition

## range

Get a Range from a Visible CFI

**Parameters**

-   `cfi` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** EpubCfi String
-   `ignoreClass` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input)** 

## adjustImages

Hook to adjust images to fit in columns

**Parameters**

-   `view` **View** 

# Hook

Hooks allow for injecting functions that must all complete in order before finishing
They will execute in parallel but all must finish before continuing
Functions may return a promise if they are asycn.

**Parameters**

-   `context` **any** scope of this

**Examples**

```javascript
this.content = new EPUBJS.Hook(this);
```

## register

Adds a function to be run before a hook completes

**Examples**

```javascript
this.content.register(function(){...});
```

## trigger

Triggers a hook to run all functions

**Examples**

```javascript
this.content.trigger(args).then(function(){...});
```

# Queue

Queue for handling tasks one at a time

**Parameters**

-   `context` **scope** what this will resolve to in the tasks

## enqueue

Add an item to the queue

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## dequeue

Run one item

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## run

Run all tasks sequentially, at convince

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## flush

Flush all, as quickly as possible

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## clear

Clear all items in wait

## length

Get the number of tasks in the queue

Returns **int** tasks

## pause

Pause a running queue

# Layout

Figures out the CSS to apply for a layout

**Parameters**

-   `settings` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `settings.spread` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** 

## flow

Switch the flow between paginated and scrolled

**Parameters**

-   `flow` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** paginated | scrolled

## spread

Switch between using spreads or not, and set the
width at which they switch to single.

**Parameters**

-   `spread` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** true | false
-   `min` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** integer in pixels

## calculate

Calculate the dimensions of the pagination

**Parameters**

-   `_width` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** [description]
-   `_height` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** [description]
-   `_gap` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** [description]

## format

Apply Css to a Document

**Parameters**

-   `contents` **Contents** 

Returns **\[[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)]** 

## count

Count number of pages

**Parameters**

-   `totalWidth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** spreads

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** pages
