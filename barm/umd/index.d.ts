import { Component, IComponentProps } from './Component';
import { createComponent, define, useHooks } from './define';
import { html } from './html';
import { createBabelConstruct } from './createBabelConstruct';
export interface IProps extends IComponentProps {
}
export { html, Component, createBabelConstruct, createComponent, define, useHooks };
