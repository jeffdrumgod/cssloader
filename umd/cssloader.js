(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.cssloader = factory());
}(this, (function () { 'use strict';

const cssloader = path => {
	/* eslint-disable consistent-return */
	const promise = new Promise((resolve, reject) => {
		if (!/(^css!|\.css$)/.test(path)) {
			return reject(`Invalid css file: ${path}`);
		}

		const ss = document.styleSheets;
		const reg = new RegExp(path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
		for (let i = 0, max = ss.length; i < max; i += 1) {
			if ((ss[i].href || '').match(reg)) {
				return resolve(path);
			}
		}

		const e = document.createElement('link');
		let result;
		const fnCb = ev => {
			try {
				if (!e.sheet.rules.length) {
					return reject(`No css rules in file: ${path}`);
				}
				return resolve(path, result, ev.defaultPrevented);
			} catch (x) {
				// sheets objects created from load errors don't allow access to
				// `cssText`
				reject(`Fail on load css file: ${path}`);
			}

			return ev;
		};

		e.rel = 'stylesheet';
		e.href = path.replace(/^css!/, ''); // remove "css!" prefix
		e.onload = fnCb;
		e.onbeforeload = fnCb;

		e.onerror = () => {
			reject(`Fail on load css file: ${path}`);
		};

		try {
			document.head.appendChild(e);
		} catch (err) {
			reject(`Fail on load css file: ${path}`);
		}
	}).catch(e => {
		console.error(e);
	});
	/* eslint-enable */

	return promise;
};

return cssloader;

})));
