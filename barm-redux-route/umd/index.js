!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("barm"),require("querystring-number")):"function"==typeof define&&define.amd?define(["exports","barm","querystring-number"],e):e((t=t||self).queryString={},t.barm,t.queryString)}(this,function(t,f,y){"use strict";var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};var v=function(){return(v=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function w(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function r(a){function r(t,e){var n=t+e;if(c.has(n))return c.get(n);var i=t&&t.split("/"),o=e&&e.split("/");if(!o||!i)return c.set(n,!1),!1;var r=!0;return i.forEach(function(t,e){"*"!==t&&t!==o[e]&&(r=!1)}),c.set(n,r),r}function n(t){for(var e=a.getState().paths,n=!1,i=-1,o=e.length-1;0<=o;o--){if(r(t,e[o])){i=o,n=!0;break}}return{match:r(t,e[e.length-1]),stackMatch:n,lastPage:r(t,e[e.length-2]),index:i}}function s(){if(0<window.location.hash.length){var t=window.location.hash.split("?"),e=t[0],n=t[1],i=void 0===n?"":n;return[e.replace(d,""),i]}return[window.location.pathname,window.location.search||""]}function l(e,n){i.forEach(function(t){t(e,n,a.getState())})}function u(i,o,r){i!==a.getState().paths[a.getState().paths.length-1]&&(a.update(function(t){t.paths.push(i);var e=v({},t.history[i],o);if(t.history[i]=e,t.history=v({},t.history),"undefined"!=typeof window&&!r&&!h){var n=y.stringify(e);window.history.pushState(null,""+d+i,""===n?""+d+i:""+d+i+"?"+n)}}),l(i,o))}function p(t,n){var i=a.getState(),o="number"==typeof t?t:i.paths.length-1,e=i.paths[o-1],r=i.history[e];a.update(function(t){for(var e=0;e<t.paths.length-o;e++)n||window.history.back(),t.history[i.paths[o]]={},t.paths.pop(),t.history=v({},t.history),t.paths=t.paths.slice()}),l(e,r)}var c=new Map,d="",h=!1,i=new Set;if("undefined"!=typeof window){window.addEventListener("popstate",function(){var t=a.getState().paths;if(s()[0]!==t[t.length-1]){var n=!1;if(t.forEach(function(t,e){t===s()[0]&&(n=!0)}),n)p(void 0,!0);else{var e=s(),i=e[0],o=e[1];u(i,""!==o?y.parse(o):void 0,!0)}}else l(s()[0],void 0)})}return{checkUrlMatch:n,checkUrlsStaskTop:function(t,e){return n(t).index===e.map(function(t){return n(t).index}).slice().sort(function(t,e){return e-t})[0]},init:function(t,e,n){if(void 0===n&&(n="#"),h=e||!1,d=n,a.update(function(t){t.paths=[],t.history=v({},t.history)}),"undefined"!=typeof window){var i=s(),o=i[0],r=i[1];"/"===o||o===t?u(t,y.parse(r)):(u(t),setTimeout(function(){u(o,y.parse(r))},20))}},listen:function(t){return i.add(t),function(){i.delete(t)}},pop:p,push:u,replace:function(i,o){var t=a.getState(),r=i||t.paths[t.paths.length-1];a.update(function(t){var e=v({},t.history[i],o);if(t.history[i]=e,t.paths[t.paths.length-1]=r,t.history=v({},t.history),t.paths=t.paths.slice(),"undefined"!=typeof window){var n=y.stringify(e);window.history.replaceState(null,""+d+r,""===n?""+d+r:""+d+r+"?"+n)}}),l(r,o)},defineRoute:function(){return""}}}var m,g,a,b="block",S="block",C="absolute",x="auto",k="none";t.createRoute=function(t){var e,h=r(t),n=(function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}(i,e=f.Component),i.defaultProps={sync:"sync",keep:!0,animeTime:0},i);function i(){var d=null!==e&&e.apply(this,arguments)||this;return d.animeTimer=null,d.realChild=null,d.state={isRenderChild:null,realChild:null,style:{display:S,position:C,zIndex:1}},d.unListen=null,d.componentWillMount=function(){var t=d.props,e=t.delay,n=t.component;void 0!==e&&0!==e&&setTimeout(function(){d.state.realChild||n()},e)},d.componentDidMount=function(){d.unListen=h.listen(d.onHistoryUpdate)},d.componentWillUnmount=function(){d.unListen&&d.unListen(),d.realChild=null,d.animeTimer=null},d.onHistoryUpdate=function(){var t=d.props,e=t.path,n=t.delay,i=t.component,o=t.keep,r=t.leaveTime,a=d.state.isRenderChild,s=h.checkUrlMatch(e),l=s.match,u=s.stackMatch,p=s.lastPage;if(l)d.realChild||(void 0===n?(d.realChild=f.html(m=m||w(["\n              <"," />\n            "],["\n              <"," />\n            "]),i),d.onHistoryUpdate()):i().then(function(t){d.realChild=f.html(g=g||w(["\n                <"," />\n              "],["\n                <"," />\n              "]),t),d.onHistoryUpdate()})),d.setState({isRenderChild:!0,style:{pointerEvents:x,display:b,position:"relative",zIndex:3}});else{var c=o&&u;void 0!==a&&!0!==a||(p&&r&&0<r?d.setState({style:{pointerEvents:x,display:b,position:C,zIndex:b}},function(){setTimeout(function(){d.setState({isRenderChild:c,style:{pointerEvents:k,display:S,position:C,zIndex:1}})},r)}):d.setState({isRenderChild:c,style:{pointerEvents:k,display:S,position:C,zIndex:p?2:1}}))}},d.render=function(){var t=d.props,e=t.path,n=t.class,i=d.state,o=i.style;if(!i.isRenderChild)return null;var r="width: 100%; height: 100%; overflow: hidden; left: 0px; top: 0px; "+o;return f.html(a=a||w(["\n        <div data-path="," class="," style=",">\n          ","\n        </div>\n      "],["\n        <div data-path="," class="," style=",">\n          ","\n        </div>\n      "]),e,n,r,d.realChild)},d}return h.defineRoute=function(t){return f.define(t)(n),t},h},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map