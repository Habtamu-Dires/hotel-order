import { OrderLocation } from "./orderLocation"

export interface ServiceRequest{
    id?:string,
    locationId:string,
    serviceStatus:string,
    serviceType:string,
    location?:OrderLocation,
    createdAt?:string,
    complatedAt?:string
}