'use strict';var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};/**
 *
 *
 * @author Jerry Bendy <jerry@icewingcc.com>
 * @licence MIT
 *
 */(function(self){'use strict';var nativeURLSearchParams=self.URLSearchParams?self.URLSearchParams:null,isSupportObjectConstructor=nativeURLSearchParams&&new nativeURLSearchParams({a:1}).toString()==='a=1',__URLSearchParams__='__URLSearchParams__',prototype=URLSearchParamsPolyfill.prototype,iterable=!!(self.Symbol&&self.Symbol.iterator);if(nativeURLSearchParams&&isSupportObjectConstructor){return}/**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */function URLSearchParamsPolyfill(search){search=search||'';// support construct object with another URLSearchParams instance
if(search instanceof URLSearchParams||search instanceof URLSearchParamsPolyfill){search=search.toString()}this[__URLSearchParams__]=parseToDict(search)}/**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */prototype.append=function(name,value){appendTo(this[__URLSearchParams__],name,value)};/**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */prototype.delete=function(name){delete this[__URLSearchParams__][name]};/**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */prototype.get=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name][0]:null};/**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */prototype.getAll=function(name){var dict=this[__URLSearchParams__];return name in dict?dict[name].slice(0):[]};/**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */prototype.has=function(name){return name in this[__URLSearchParams__]};/**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */prototype.set=function set(name,value){this[__URLSearchParams__][name]=[''+value]};/**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */prototype.toString=function(){var dict=this[__URLSearchParams__],query=[],i,key,name,value;for(key in dict){name=encode(key);for(i=0,value=dict[key];i<value.length;i++){query.push(name+'='+encode(value[i]))}}return query.join('&')};/*
     * Apply polifill to global object and append other prototype into it
     */self.URLSearchParams=nativeURLSearchParams&&!isSupportObjectConstructor?new Proxy(nativeURLSearchParams,{construct:function construct(target,args){return new target(new URLSearchParamsPolyfill(args[0]).toString())}}):URLSearchParamsPolyfill;var USPProto=self.URLSearchParams.prototype;USPProto.polyfill=true;/**
     *
     * @param {function} callback
     * @param {object} thisArg
     */USPProto.forEach=USPProto.forEach||function(callback,thisArg){var dict=parseToDict(this.toString());Object.getOwnPropertyNames(dict).forEach(function(name){dict[name].forEach(function(value){callback.call(thisArg,value,name,this)},this)},this)};/**
     * Sort all name-value pairs
     */USPProto.sort=USPProto.sort||function(){var dict=parseToDict(this.toString()),keys=[],k,i,j;for(k in dict){keys.push(k)}keys.sort();for(i=0;i<keys.length;i++){this.delete(keys[i])}for(i=0;i<keys.length;i++){var key=keys[i],values=dict[key];for(j=0;j<values.length;j++){this.append(key,values[j])}}};/**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */USPProto.keys=USPProto.keys||function(){var items=[];this.forEach(function(item,name){items.push([name])});return makeIterator(items)};/**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */USPProto.values=USPProto.values||function(){var items=[];this.forEach(function(item){items.push([item])});return makeIterator(items)};/**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */USPProto.entries=USPProto.entries||function(){var items=[];this.forEach(function(item,name){items.push([name,item])});return makeIterator(items)};if(iterable){USPProto[self.Symbol.iterator]=USPProto[self.Symbol.iterator]||USPProto.entries}function encode(str){var replace={'!':'%21','\'':'%27','(':'%28',')':'%29','~':'%7E','%20':'+','%00':'\0'};return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g,function(match){return replace[match]})}function decode(str){return decodeURIComponent(str.replace(/\+/g,' '))}function makeIterator(arr){var iterator={next:function next(){var value=arr.shift();return{done:value===undefined,value:value}}};if(iterable){iterator[self.Symbol.iterator]=function(){return iterator}}return iterator}function parseToDict(search){var dict={};if((typeof search==='undefined'?'undefined':_typeof(search))==='object'){for(var i in search){if(search.hasOwnProperty(i)){var str=typeof search[i]==='string'?search[i]:JSON.stringify(search[i]);appendTo(dict,i,str)}}}else{// remove first '?'
if(search.indexOf('?')===0){search=search.slice(1)}var pairs=search.split('&');for(var j=0;j<pairs.length;j++){var value=pairs[j],index=value.indexOf('=');if(-1<index){appendTo(dict,decode(value.slice(0,index)),decode(value.slice(index+1)))}}}return dict}function appendTo(dict,name,value){if(name in dict){dict[name].push(''+value)}else{dict[name]=[''+value]}}})(typeof global!=='undefined'?global:typeof window!=='undefined'?window:undefined);