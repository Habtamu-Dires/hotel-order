/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ItemResponse } from '../../models/item-response';

export interface GetAllItems$Params {
}

export function getAllItems(http: HttpClient, rootUrl: string, params?: GetAllItems$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
  const rb = new RequestBuilder(rootUrl, getAllItems.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ItemResponse>>;
    })
  );
}

getAllItems.PATH = '/items';
