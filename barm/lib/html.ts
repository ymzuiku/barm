// clone by https://github.com/developit/htm

const MINI = true;
const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;

const TAG_SET = 1;
const CHILD_APPEND = 0;
const CHILD_RECURSE = 2;
const PROPS_ASSIGN = 3;
const PROP_SET = MODE_PROP_SET;
const PROP_APPEND = MODE_PROP_APPEND;

// Turn a result of a build(...) call into a tree that is more
// convenient to analyze and transform (e.g. Babel plugins).
// For example:
// 	treeify(
//		build'<div href="1${a}" ...${b}><${x} /></div>`,
//		[X, Y, Z]
//	)
// returns:
// 	{
// 		tag: 'div',
//		props: [ { href: ["1", X] },	Y ],
// 		children: [ { tag: Z, props: [], children: [] } ]
// 	}
export const treeify = (built: any, fields: any) => {
  const _treeify = (theBuilt: any): any => {
    let tag = '';
    let currentProps = null;
    const props = [];
    const children = [];

    for (let i = 1; i < theBuilt.length; i++) {
      const field = theBuilt[i++];
      const value = typeof field === 'number' ? fields[field - 1] : field;

      if (theBuilt[i] === TAG_SET) {
        tag = value;
      } else if (theBuilt[i] === PROPS_ASSIGN) {
        props.push(value);
        currentProps = null;
      } else if (theBuilt[i] === PROP_SET) {
        if (!currentProps) {
          currentProps = Object.create(null);
          props.push(currentProps);
        }
        currentProps[theBuilt[++i]] = [value];
      } else if (theBuilt[i] === PROP_APPEND) {
        currentProps[theBuilt[++i]].push(value);
      } else if (theBuilt[i] === CHILD_RECURSE) {
        children.push(_treeify(value));
      } else if (theBuilt[i] === CHILD_APPEND) {
        children.push(value);
      }
    }

    return { tag, props, children };
  };
  const { children } = _treeify(built);
  return children.length > 1 ? children : children[0];
};

export const evaluate = (h: any, built: any, fields: any, args: any) => {
  for (let i = 1; i < built.length; i++) {
    const field = built[i];
    const value = typeof field === 'number' ? fields[field] : field;
    const type = built[++i];

    if (type === TAG_SET) {
      args[0] = value;
    } else if (type === PROPS_ASSIGN) {
      args[1] = Object.assign(args[1] || {}, value);
    } else if (type === PROP_SET) {
      (args[1] = args[1] || {})[built[++i]] = value;
    } else if (type === PROP_APPEND) {
      args[1][built[++i]] += value + '';
    } else if (type) {
      // code === CHILD_RECURSE
      args.push(h.apply(null, evaluate(h, value, fields, ['', null])));
    } else {
      // code === CHILD_APPEND
      args.push(value);
    }
  }

  return args;
};

export const cache = {
  createElement: () => {},
};

export const html = function(statics: any, ...args: any) {
  const fields = arguments;
  const self = cache.createElement;

  let mode = MODE_TEXT;
  let buffer = '';
  let quote = '';
  let current = [0] as any;
  let char: any;
  let propName: any;

  const commit = (field?: any) => {
    if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))) {
      if (MINI) {
        current.push(field ? fields[field] : buffer);
      } else {
        current.push(field || buffer, CHILD_APPEND);
      }
    } else if (mode === MODE_TAGNAME && (field || buffer)) {
      if (MINI) {
        current[1] = field ? fields[field] : buffer;
      } else {
        current.push(field || buffer, TAG_SET);
      }
      mode = MODE_WHITESPACE;
    } else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
      if (MINI) {
        current[2] = Object.assign(current[2] || {}, fields[field]);
      } else {
        current.push(field, PROPS_ASSIGN);
      }
    } else if (mode === MODE_WHITESPACE && buffer && !field) {
      if (MINI) {
        (current[2] = current[2] || {})[buffer] = true;
      } else {
        current.push(true, PROP_SET, buffer);
      }
    } else if (mode >= MODE_PROP_SET) {
      if (MINI) {
        if (mode === MODE_PROP_SET) {
          (current[2] = current[2] || {})[propName] = field
            ? buffer
              ? buffer + fields[field]
              : fields[field]
            : buffer;
          mode = MODE_PROP_APPEND;
        } else if (field || buffer) {
          current[2][propName] += field ? buffer + fields[field] : buffer;
        }
      } else {
        if (buffer || (!field && mode === MODE_PROP_SET)) {
          current.push(buffer, mode, propName);
          mode = MODE_PROP_APPEND;
        }
        if (field) {
          current.push(field, mode, propName);
          mode = MODE_PROP_APPEND;
        }
      }
    }

    buffer = '';
  };

  for (let i = 0; i < statics.length; i++) {
    if (i) {
      if (mode === MODE_TEXT) {
        commit();
      }
      commit(i);
    }

    for (let j = 0; j < statics[i].length; j++) {
      char = statics[i][j];

      if (mode === MODE_TEXT) {
        if (char === '<') {
          // commit buffer
          commit();
          if (MINI) {
            current = [current, '', null];
          } else {
            current = [current];
          }
          mode = MODE_TAGNAME;
        } else {
          buffer += char;
        }
      } else if (mode === MODE_COMMENT) {
        // Ignore everything until the last three characters are '-', '-' and '>'
        if (buffer === '--' && char === '>') {
          mode = MODE_TEXT;
          buffer = '';
        } else {
          buffer = char + buffer[0];
        }
      } else if (quote) {
        if (char === quote) {
          quote = '';
        } else {
          buffer += char;
        }
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>') {
        commit();
        mode = MODE_TEXT;
      } else if (!mode) {
        // Ignore everything until the tag ends
      } else if (char === '=') {
        mode = MODE_PROP_SET;
        propName = buffer;
        buffer = '';
      } else if (char === '/' && (mode < MODE_PROP_SET || statics[i][j + 1] === '>')) {
        commit();
        if (mode === MODE_TAGNAME) {
          current = current[0];
        }
        mode = current;
        if (MINI) {
          (current = current[0]).push((self as any).apply(null, (mode as any).slice(1)));
        } else {
          (current = current[0]).push(mode, CHILD_RECURSE);
        }
        mode = MODE_SLASH;
      } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        // <a disabled>
        commit();
        mode = MODE_WHITESPACE;
      } else {
        buffer += char;
      }

      if (mode === MODE_TAGNAME && buffer === '!--') {
        mode = MODE_COMMENT;
        current = current[0];
      }
    }
  }
  commit();

  if (MINI) {
    return current.length > 2 ? current.slice(1) : current[1];
  }
  return current;
};

function h(tag: any, props: any, ...children: any[]) {
  if (typeof tag === 'function') {
    return tag(props);
  }

  return {
    tag,
    props: props || {},
    children,
    key: (props && props.key) || null,
  };
}

cache.createElement = h as any;
