import { IHistory as TheIHistory } from './createHistory';
export declare type IHistory = TheIHistory;
export interface IRouteProps {
    component?: any;
    keep?: boolean;
    leaveTime?: number;
    delay?: number;
    path: string;
    class: string;
}
/**
 *  为了单一数据驱动，Route 需要和 redux 进行绑定
 *  Route 使用 history.listen 而不使用 consumer 是因为 Route 属于非常固定的模式.
 *  Route 会常驻 VNode 对象树，使用 listen 可以有效减少不必要的 consumer 订阅。
 */
export declare function createRoute(store: any): TheIHistory;
