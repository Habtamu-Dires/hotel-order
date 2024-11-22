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

import { IdResponse } from '../models/id-response';
import { updateOrderDetailStatus } from '../fn/order-details/update-order-detail-status';
import { UpdateOrderDetailStatus$Params } from '../fn/order-details/update-order-detail-status';

@Injectable({ providedIn: 'root' })
export class OrderDetailsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateOrderDetailStatus()` */
  static readonly UpdateOrderDetailStatusPath = '/order-details/update-status/{detail-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateOrderDetailStatus()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateOrderDetailStatus$Response(params: UpdateOrderDetailStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<IdResponse>> {
    return updateOrderDetailStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateOrderDetailStatus$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateOrderDetailStatus(params: UpdateOrderDetailStatus$Params, context?: HttpContext): Observable<IdResponse> {
    return this.updateOrderDetailStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<IdResponse>): IdResponse => r.body)
    );
  }

}
