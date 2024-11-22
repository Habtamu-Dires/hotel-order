import { OrderDetail } from "../../../services/old-services/models/orderDetail";

export interface OrderedItem {
    id:string,
    locationType:string,
    locationNumber:string,
    locationAddress:string,
    orderType:string,
    orderStatus: string, 
    orderDate:string,
    orderTime:string,
    timeDuration:string,
    orderDetails: OrderDetail[],
    totalPrice: number, 
    note?:string,
    orderDateTime:Date
}