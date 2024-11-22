import { OrderDetail } from "./orderDetail";
import { OrderLocation } from "./orderLocation";

export interface Order{
    id:string,
    totalPrice:number,
    orderType:string,
    orderDetails:OrderDetail[],
    locationId:string,
    location?:OrderLocation,
    createdAt:string,
    note?:string,
    orderStatus:string

}
