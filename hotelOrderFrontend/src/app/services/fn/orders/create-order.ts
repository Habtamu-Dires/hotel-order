/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { IdResponse } from '../../models/id-response';
import { OrderRequest } from '../../models/order-request';

export interface CreateOrder$Params {
      body: OrderRequest
}

export function createOrder(http: HttpClient, rootUrl: string, params: CreateOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<IdResponse>> {
  const rb = new RequestBuilder(rootUrl, createOrder.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<IdResponse>;
    })
  );
}

createOrder.PATH = '/orders';
