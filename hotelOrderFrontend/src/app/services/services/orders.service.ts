/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createOrder } from '../fn/orders/create-order';
import { CreateOrder$Params } from '../fn/orders/create-order';
import { getActiveOrders } from '../fn/orders/get-active-orders';
import { GetActiveOrders$Params } from '../fn/orders/get-active-orders';
import { getAllItemOrders } from '../fn/orders/get-all-item-orders';
import { GetAllItemOrders$Params } from '../fn/orders/get-all-item-orders';
import { getBillReadyOrders } from '../fn/orders/get-bill-ready-orders';
import { GetBillReadyOrders$Params } from '../fn/orders/get-bill-ready-orders';
import { getCompletedOrders } from '../fn/orders/get-completed-orders';
import { GetCompletedOrders$Params } from '../fn/orders/get-completed-orders';
import { getOnProcessOrders } from '../fn/orders/get-on-process-orders';
import { GetOnProcessOrders$Params } from '../fn/orders/get-on-process-orders';
import { getOrdersByLocation } from '../fn/orders/get-orders-by-location';
import { GetOrdersByLocation$Params } from '../fn/orders/get-orders-by-location';
import { getPendingOrders } from '../fn/orders/get-pending-orders';
import { GetPendingOrders$Params } from '../fn/orders/get-pending-orders';
import { getReadyOrders } from '../fn/orders/get-ready-orders';
import { GetReadyOrders$Params } from '../fn/orders/get-ready-orders';
import { getServedOrders } from '../fn/orders/get-served-orders';
import { GetServedOrders$Params } from '../fn/orders/get-served-orders';
import { IdResponse } from '../models/id-response';
import { OrderResponse } from '../models/order-response';
import { updateOrderStatus } from '../fn/orders/update-order-status';
import { UpdateOrderStatus$Params } from '../fn/orders/update-order-status';

@Injectable({ providedIn: 'root' })
export class OrdersService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateOrderStatus()` */
  static readonly UpdateOrderStatusPath = '/orders/update-status/{order-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateOrderStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateOrderStatus$Response(params: UpdateOrderStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return updateOrderStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateOrderStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateOrderStatus(params: UpdateOrderStatus$Params, context?: HttpContext): Observable<{
}> {
    return this.updateOrderStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getAllItemOrders()` */
  static readonly GetAllItemOrdersPath = '/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllItemOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllItemOrders$Response(params?: GetAllItemOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getAllItemOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllItemOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllItemOrders(params?: GetAllItemOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getAllItemOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `createOrder()` */
  static readonly CreateOrderPath = '/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createOrder$Response(params: CreateOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<IdResponse>> {
    return createOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createOrder(params: CreateOrder$Params, context?: HttpContext): Observable<IdResponse> {
    return this.createOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<IdResponse>): IdResponse => r.body)
    );
  }

  /** Path part for operation `getServedOrders()` */
  static readonly GetServedOrdersPath = '/orders/served';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getServedOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getServedOrders$Response(params?: GetServedOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getServedOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getServedOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getServedOrders(params?: GetServedOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getServedOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getReadyOrders()` */
  static readonly GetReadyOrdersPath = '/orders/ready';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReadyOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReadyOrders$Response(params?: GetReadyOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getReadyOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getReadyOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReadyOrders(params?: GetReadyOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getReadyOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getPendingOrders()` */
  static readonly GetPendingOrdersPath = '/orders/pending';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPendingOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPendingOrders$Response(params?: GetPendingOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getPendingOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPendingOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPendingOrders(params?: GetPendingOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getPendingOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getOnProcessOrders()` */
  static readonly GetOnProcessOrdersPath = '/orders/on-process';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOnProcessOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOnProcessOrders$Response(params?: GetOnProcessOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getOnProcessOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOnProcessOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOnProcessOrders(params?: GetOnProcessOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getOnProcessOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getOrdersByLocation()` */
  static readonly GetOrdersByLocationPath = '/orders/locations/{location-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOrdersByLocation()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOrdersByLocation$Response(params: GetOrdersByLocation$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getOrdersByLocation(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOrdersByLocation$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOrdersByLocation(params: GetOrdersByLocation$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getOrdersByLocation$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getCompletedOrders()` */
  static readonly GetCompletedOrdersPath = '/orders/completed';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompletedOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompletedOrders$Response(params: GetCompletedOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getCompletedOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCompletedOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompletedOrders(params: GetCompletedOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getCompletedOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getBillReadyOrders()` */
  static readonly GetBillReadyOrdersPath = '/orders/bill-ready';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getBillReadyOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getBillReadyOrders$Response(params?: GetBillReadyOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getBillReadyOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getBillReadyOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getBillReadyOrders(params?: GetBillReadyOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getBillReadyOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

  /** Path part for operation `getActiveOrders()` */
  static readonly GetActiveOrdersPath = '/orders/active';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getActiveOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveOrders$Response(params?: GetActiveOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
    return getActiveOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getActiveOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveOrders(params?: GetActiveOrders$Params, context?: HttpContext): Observable<Array<OrderResponse>> {
    return this.getActiveOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderResponse>>): Array<OrderResponse> => r.body)
    );
  }

}
