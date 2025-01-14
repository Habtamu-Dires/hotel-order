/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { LocationResponse } from '../models/location-response';
import { OrderDetailResponse } from '../models/order-detail-response';
export interface OrderResponse {
  createdDate?: string;
  id?: string;
  location?: LocationResponse;
  locationId?: string;
  note?: string;
  orderDetails?: Array<OrderDetailResponse>;
  orderStatus?: 'PENDING' | 'VERIFIED' | 'OnPROCESS' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELED' | 'BillREADY' | 'BillREQUEST';
  orderType?: 'DINE_IN' | 'TAKEAWAY';
  totalPrice?: number;
}
