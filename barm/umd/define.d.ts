import { Component } from './Component';
export declare const createComponent: <T>(FN: any) => any;
declare function IDefineCb<P extends any>(functionComponent: (props: P, hooks: Component<P>) => any): any;
declare function IDefineCb<P extends any>(classComponent: any): any;
declare function IDefine(name: string): typeof IDefineCb;
export declare const useHooks: (setHooks: <P extends any>(hooks: Component<P>, ...args: any[]) => any) => <P extends any>(hooks: Component<P>, ...args: any[]) => any;
export declare const define: typeof IDefine;
export {};
