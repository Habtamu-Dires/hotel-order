/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { OrderDetailRequest } from '../models/order-detail-request';
export interface ItemOrderRequest {
  id?: string;
  locationId: string;
  note?: string;
  orderDetails?: Array<OrderDetailRequest>;
  orderType: string;
  totalPrice: number;
}
