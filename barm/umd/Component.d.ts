export interface IComponentProps {
    children?: any;
    key?: string;
    ref?: (fn: (ref: any) => any) => any;
}
declare const BabelHTMLElement: any;
export declare class Component<P> extends BabelHTMLElement {
    static isClass: boolean;
    /** at update props, return new state */
    static getDerivedStateFromProps: (nextProps: any, nowState: any) => any;
    /** web-component self state */
    state: any;
    /** props is out params */
    props: P;
    /** at setState and change props, if return false, block update */
    shouldComponentUpdate: (nextProps: any, nextState: any) => boolean;
    /** web-component is new init, before componentDidMount */
    isInited: boolean;
    /** web-component is remove */
    isRemoved: boolean;
    /** web-component at focusUpdate */
    private __isFocusUpdate;
    private __nextProps;
    private __nextState;
    private readonly __attributes;
    /** render dom */
    private __vdom;
    /** merge some setState at onece */
    private __setStateTimer;
    constructor();
    private readonly update;
    private readonly checkShouldUpdate;
    newProps: (val: P) => void;
    focusUpdate: () => void;
    /** change state, and run update */
    setState: (value: any, updateCallback?: any) => void;
    connectedCallback(): void;
    setAttribute: (name: string, value: any) => void;
    disconnectedCallback(): void;
    /** web-component constructor no have props, so keep this API  */
    componentWillMount: () => void;
    /** web-component connectedCallback and render  */
    componentDidMount: () => void;
    /** web-component after render  */
    componentDidUpdate: () => void;
    /** web-component at disconnectedCallback */
    componentWillUnmount: () => void;
    render: () => void;
}
export {};
