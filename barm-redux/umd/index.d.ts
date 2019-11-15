export declare type IMiddleware = <T>(getState: any, dispatch: any) => {
    getState: any;
    dispatch: any;
};
export interface IConsumer<S> {
    subscribe: (state: S) => any[];
    children: any;
}
export interface IStore<T> {
    dispatch: (action: any) => any;
    update: (action: (state: T) => any) => any;
    getState: () => T;
    defineConsumer: (tag: string) => void;
    subscribe: (fn: (state: T) => any) => any;
    connect: (mapStateToProps?: (state: T) => any, mapDispatchToProps?: (dispatch: any) => any) => (tag: string) => any;
    defineConnect: (tag: string, mapStateToProps?: (state: T) => any, mapDispatchToProps?: (dispatch: any) => any) => (Ele: any) => any;
    applyMiddleware: (...middleWares: IMiddleware[]) => any;
    applyReducer: (newReducer: any) => void;
}
declare function reducerInAction(state: any, action: any): any;
declare namespace reducerInAction {
    var key: string;
}
export default reducerInAction;
export declare const createStore: <T>(reducer: any, initState: T) => IStore<T>;
