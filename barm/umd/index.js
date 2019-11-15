!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).barm={})}(this,function(t){"use strict";var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};function r(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var u=function(){return(u=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};function i(t){function e(){return Reflect.construct(t,[],this.__proto__.constructor)}return Object.setPrototypeOf(e,t),Object.setPrototypeOf(e.prototype,t.prototype),e}function s(t,e,n){if(Array.isArray(e)&&n)return p(n,e),n;var o=l(t,e);return n&&o.parentNode!==n&&n.append(o),o}function l(t,e){var n=t;if(null!=e&&"boolean"!=typeof e||(e=""),"number"!=typeof e&&e.tag||(e=String(e)),"string"==typeof e)return t&&3===t.nodeType?t.textContent!==e&&(t.textContent=e):(n=document.createTextNode(e),t&&t.replaceWith(n)),n;var o=!1,r=!1,i="string"==typeof e.tag&&0<e.tag.indexOf("-"),s=u({},e.props,{children:1===e.children.length?e.children[0]:e.children});t&&function(t,e){return!(!t||!e)&&("string"!=typeof e&&"number"!=typeof e?"string"!=typeof e.tag?t&&t._node&&t._node.tag===e.tag:t.nodeName.toLocaleLowerCase()===e.tag:3===t.nodeType)}(t,e)||(n=document.createElement(e.tag),t&&n&&3!==n.nodeType&&(n.append.apply(n,t.childNodes),i&&(n.newProps&&n.newProps(s),!n.__isInit&&n.componentWillMount&&n.componentWillMount(),o=!0),r=!0)),function(e,t){var n=e._node&&e._node.props||{},o=t.props||{};Object.keys(n).forEach(function(t){t in o||f(e,t,void 0)}),Object.keys(o).forEach(function(t){n[t]!==o[t]&&f(e,t,o[t])})}(n,e);var a=n.childNodes&&0<n.childNodes.length,c=e.children&&0<e.children.length;return i||!c&&!a||p(n,e.children),n._node=e,!o&&i&&(n.newProps&&n.newProps(s),!n.__isInit&&n.componentWillMount&&n.componentWillMount()),r&&t.replaceWith(n),n}function p(t,e){var n=t.childNodes,o=n.length,r={};if(0<o)for(var i=0;i<o;i++){r[u=(p=n[i]).key||"__$key__"+i]=p}var s=e?e.length:0;if(0<s){var a=[];for(i=0;i<s;i++){"function"!=typeof(c=e[i])&&(Array.isArray(c)?c.forEach(function(t){a.push(t)}):a.push(c))}for(i=0;i<a.length;i++){var c,u;if(r[u=(c=a[i])&&c.key||"__$key__"+i]){var p=r[u];r[u]=void 0,p.key=u,l(p,c)}else{p=l(null,c);3===t.nodeType?t.replaceWith(p):p&&(p.key=u,t.append(p))}}}Object.keys(r).forEach(function(t){t&&function(t){t&&t.parentNode&&t.parentNode.removeChild(t)}(t)})}function f(t,e,n){3!==t.nodeType&&("key"===e?t[e]=n:"ref"===e?n(t):0===e.indexOf("on")?t[e]&&n||(t[e]=n):"style"===e?t.style.cssText=n:("className"===e&&(e="class"),n?t.setAttribute(e,n):t.removeAttribute(e,n)))}var e,n=i(HTMLElement),a=(r(c,e=n),c.prototype.connectedCallback=function(){var r=this;this.isInited||Object.keys(this.attributes).forEach(function(t){var e=r.attributes[t],n=e.name,o=e.value;r.props[n]=o,"id"===n&&(r.id=o),r.__attributes[n]=!0});var t=this.render();Array.isArray(t)?s(null,t,this):this.__vdom=s(this.__vdom,t,this),this.isInited=!0,this.componentDidMount()},c.prototype.disconnectedCallback=function(){this.componentWillUnmount(),this.isRemoved=!0,this.isInited=!1},c.isClass=!0,c.getDerivedStateFromProps=null,c);function c(){var a=e.call(this)||this;return a.state={},a.props={},a.shouldComponentUpdate=void 0,a.isInited=!1,a.isRemoved=!1,a.__isFocusUpdate=!1,a.__nextProps={},a.__nextState=null,a.__attributes={},a.__vdom=null,a.__setStateTimer=null,a.update=function(t,e,n){if(a.checkShouldUpdate(t,e)){if(!n&&c.getDerivedStateFromProps){var o=c.getDerivedStateFromProps(t,e);void 0!==o&&(e=o)}a.props=t,a.state=e;var r=a.render();Array.isArray(r)?s(null,r,a):a.__vdom=s(a.__vdom,r,void 0),a.componentDidUpdate()}},a.checkShouldUpdate=function(t,e){if(a.isRemoved)return!1;if(a.__isFocusUpdate)return!(a.__isFocusUpdate=!1);var n=!1;if(a.shouldComponentUpdate)n=a.shouldComponentUpdate(t,e);else{for(var o=Object.keys(e),r=0;r<o.length;r++){if(e[s=o[r]]!==a.state[s]){n=!0;break}}if(!n){var i=Object.keys(t);for(r=0;r<i.length;r++){var s;if(t[s=i[r]]!==a.props[s]){n=!0;break}}}}return n},a.newProps=function(t){a.__nextProps=u({},t),a.isInited?a.update(a.__nextProps,a.state):a.props=t},a.focusUpdate=function(){a.__isFocusUpdate=!0,a.setState(a.__nextState)},a.setState=function(t,e){"function"==typeof t?(a.__nextState||(a.__nextState=a.state),a.__nextState=u({},a.__nextState,t(a.__nextState))):a.__nextState=u({},a.__nextState,t),a.__setStateTimer&&(clearTimeout(a.__setStateTimer),a.__setStateTimer=null),a.__setStateTimer=setTimeout(function(){a.update(a.props,a.__nextState,!0),e&&e(a.state)},17)},a.setAttribute=function(t,e){var n;a.__attributes[t]&&(a.__nextProps=u({},a.props,((n={})[t]=e,n)))},a.componentWillMount=function(){},a.componentDidMount=function(){},a.componentDidUpdate=function(){},a.componentWillUnmount=function(){},a.render=function(){},a}function d(e){if(e.isClass)return i(e);var n;function t(){var t=null!==n&&n.apply(this,arguments)||this;return t.render=function(){return e(t.props,t)},t}return i((r(t,n=a),t))}var _={createElement:function(){}};_.createElement=function(t,e){for(var n=[],o=2;o<arguments.length;o++)n[o-2]=arguments[o];return"function"==typeof t?t(e):{tag:t,props:e||{},children:n,key:e&&e.key||null}},t.Component=a,t.createBabelConstruct=i,t.createComponent=d,t.define=function(e){return function(t){customElements.define(e,d(t))}},t.html=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var o,r,i=arguments,s=_.createElement,a=1,c="",u="",p=[0],l=function(t){1===a&&(t||(c=c.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?p.push(t?i[t]:c):3===a&&(t||c)?(p[1]=t?i[t]:c,a=2):2===a&&"..."===c&&t?p[2]=Object.assign(p[2]||{},i[t]):2===a&&c&&!t?(p[2]=p[2]||{})[c]=!0:5<=a&&(5===a?((p[2]=p[2]||{})[r]=t?c?c+i[t]:i[t]:c,a=6):(t||c)&&(p[2][r]+=t?c+i[t]:c)),c=""},f=0;f<t.length;f++){f&&(1===a&&l(),l(f));for(var d=0;d<t[f].length;d++)o=t[f][d],1===a?"<"===o?(l(),p=[p,"",null],a=3):c+=o:4===a?c="--"===c&&">"===o?(a=1,""):o+c[0]:u?o===u?u="":c+=o:'"'===o||"'"===o?u=o:">"===o?(l(),a=1):a&&("="===o?(a=5,r=c,c=""):"/"===o&&(a<5||">"===t[f][d+1])?(l(),3===a&&(p=p[0]),(p=(a=p)[0]).push(s.apply(null,a.slice(1))),a=0):" "===o||"\t"===o||"\n"===o||"\r"===o?(l(),a=2):c+=o),3===a&&"!--"===c&&(a=4,p=p[0])}return l(),2<p.length?p.slice(1):p[1]},t.useHooks=function(t){return t},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map
