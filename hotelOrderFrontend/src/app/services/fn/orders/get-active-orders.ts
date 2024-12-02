/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrderResponse } from '../../models/order-response';

export interface GetActiveOrders$Params {
}

export function getActiveOrders(http: HttpClient, rootUrl: string, params?: GetActiveOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderResponse>>> {
  const rb = new RequestBuilder(rootUrl, getActiveOrders.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<OrderResponse>>;
    })
  );
}

getActiveOrders.PATH = '/orders/active';
