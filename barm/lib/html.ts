import { build, cache } from './htm';

function h(tag: any, props: any, ...children: any[]) {
  if (tag.define) {
    return { tag: tag.name, props: props || {}, children, key: (props && props.key) || null };
  }

  return { tag, props: props || {}, children, key: (props && props.key) || null };
}

// export const html = (htm as any).bind(h);
cache.createElement = h as any;

export const html = build;
