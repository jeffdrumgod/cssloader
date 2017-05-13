'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var loadCSS = function loadCSS(path) {
	/* eslint-disable consistent-return */
	var promise = new Promise(function (resolve, reject) {
		if (!/(^css!|\.css$)/.test(path)) {
			return reject('Invalid css file: ' + path);
		}

		var ss = document.styleSheets;
		for (var i = 0, max = ss.length; i < max; i += 1) {
			if ((ss[i].href || '').match(path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\\\$&'))) {
				return resolve(path);
			}
		}

		var e = document.createElement('link');
		var result = void 0;
		var fnCb = function fnCb(ev) {
			try {
				if (!e.sheet.rules.length) {
					return reject('No css rules in file: ' + path);
				}
				return resolve(path, result, ev.defaultPrevented);
			} catch (x) {
				// sheets objects created from load errors don't allow access to
				// `cssText`
				reject('Fail on load css file: ' + path);
			}

			return ev;
		};

		e.rel = 'stylesheet';
		e.href = path.replace(/^css!/, ''); // remove "css!" prefix
		e.onload = fnCb;
		e.onbeforeload = fnCb;

		e.onerror = function () {
			reject('Fail on load css file: ' + path);
		};

		try {
			document.head.appendChild(e);
		} catch (err) {
			reject('Fail on load css file: ' + path);
		}
	}).catch(function (e) {
		console.error(e);
	});
	/* eslint-enable */

	return promise;
};

exports.default = loadCSS;