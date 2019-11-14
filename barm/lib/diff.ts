export function diff(dom: any, vnode: any, container: any) {
  if (Array.isArray(vnode) && container) {
    diffChildren(container, vnode);

    return container;
  }

  const nextVdom = diffNode(dom, vnode);

  if (container && nextVdom.parentNode !== container) {
    container.append(nextVdom);
  }

  return nextVdom;
}

function diffNode(dom: any, vnode: any) {
  let out = dom;

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = '';
  }

  if (typeof vnode === 'number' || !vnode.tag) {
    vnode = String(vnode);
  }

  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom) {
        (dom as HTMLElement).replaceWith(out);
      }
    }

    return out;
  }

  let isUpdated = false;
  let isNeedReplace = false;
  const isWebComponent = vnode && vnode.tag.indexOf('-') > 0;

  const nextProps = {
    ...vnode.props,
    children: vnode.children.length === 1 ? vnode.children[0] : vnode.children,
  };

  if (!dom || !checkIsSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);

    // 如果该位置已有元素，新状态中tag变了，替换元素
    if (dom && out && out.nodeType !== 3) {
      out.append(...dom.childNodes);

      // web-component 在插入render之前，需要先设置props
      if (isWebComponent) {
        if (out.newProps) {
          out.newProps(nextProps);
        }

        if (!out.__isInit && out.componentWillMount) {
          out.componentWillMount();
        }

        isUpdated = true;
      }
      isNeedReplace = true;
    }
  }

  // 先设置样式、属性
  diffAttributes(out, vnode);

  const isArrayOutChildNodes = out.childNodes && out.childNodes.length > 0;
  const isArrayVnodeChildren = vnode.children && vnode.children.length > 0;

  // 创建子对象，使用旧的_node 对象判断子对象
  if (!isWebComponent && (isArrayVnodeChildren || isArrayOutChildNodes)) {
    diffChildren(out, vnode.children);
  }

  // 更新_node
  out._node = vnode;

  // 尝试更新web-component
  if (!isUpdated && isWebComponent) {
    if (out.newProps) {
      out.newProps(nextProps);
    }

    if (!out.__isInit && out.componentWillMount) {
      out.componentWillMount();
    }
  }

  if (isNeedReplace) {
    // 如果需要替换dom， 在虚拟dom状态更新完之后，再替换真实的dom
    (dom as HTMLElement).replaceWith(out);
  }

  return out;
}

function diffChildren(dom: any, vchildren: any) {
  const domChidNodes = dom.childNodes;
  const domChildNodesLen = domChidNodes.length;
  const oldChilds = {} as any;

  if (domChildNodesLen > 0) {
    for (let i = 0; i < domChildNodesLen; i++) {
      const child = domChidNodes[i];
      const key = child.key || `__$key__${i}`;
      oldChilds[key] = child;
    }
  }

  const vchildrenLen = vchildren ? vchildren.length : 0;
  if (vchildrenLen > 0) {
    // 扁平化子数组
    const plantVchildren = [];
    for (let i = 0; i < vchildrenLen; i++) {
      const vchild = vchildren[i];
      if (typeof vchild === 'function') {
        continue;
      }
      if (Array.isArray(vchild)) {
        //
        vchild.forEach(c => {
          plantVchildren.push(c);
        });
      } else {
        plantVchildren.push(vchild);
      }
    }

    for (let i = 0; i < plantVchildren.length; i++) {
      const vchild = plantVchildren[i];

      const key = (vchild && vchild.key) || `__$key__${i}`;

      if (oldChilds[key]) {
        const child = oldChilds[key];
        oldChilds[key] = undefined;
        // 应用新的属性
        child.key = key;
        diffNode(child, vchild);
      } else {
        const child = diffNode(null, vchild);
        if (dom.nodeType === 3) {
          (dom as HTMLElement).replaceWith(child);
        } else if (child) {
          child.key = key;
          dom.append(child);
        }
      }
    }
  }

  Object.keys(oldChilds).forEach((child: any) => {
    if (child) {
      removeNode(child);
    }
  });
}

function checkIsSameNodeType(dom: any, vnode: any) {
  if (!dom || !vnode) {
    return false;
  }
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }
  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLocaleLowerCase() === vnode.tag;
  }

  return dom && dom._node && dom._node.tag === vnode.tag;
}

function removeNode(ele: HTMLElement) {
  if (ele && ele.parentNode) {
    ele.parentNode.removeChild(ele);
  }
}

function diffAttributes(dom: any, vnode: any) {
  const lastProps = (dom._node && dom._node.props) || {};
  const nextProps = vnode.props || {};

  Object.keys(lastProps).forEach(name => {
    if (!(name in nextProps)) {
      setAttribute(dom, name, undefined);
    }
  });

  Object.keys(nextProps).forEach(name => {
    if (lastProps[name] !== nextProps[name]) {
      setAttribute(dom, name, nextProps[name]);
    }
  });
}

export function setAttribute(dom: any, name: string, value: any) {
  // 如果dom是一个文本, 不进行设置属性
  if (dom.nodeType === 3) {
    return;
  }

  // 实现renderProps
  if (name === 'key') {
    dom[name] = value;
  } else if (name === 'ref') {
    value(dom);
  } else if (name.indexOf('on') === 0) {
    // 对已有事件，只做清空切换, 减少重复捆绑事件的开销
    if (!dom[name] || !value) {
      dom[name] = value;
    }
  } else if (name === 'style') {
    dom.style.cssText = value;
  } else {
    // 兼容 react
    if (name === 'className') {
      name = 'class';
    }

    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name, value);
    }
  }
}
