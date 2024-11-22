/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LocationResponse } from '../../models/location-response';

export interface GetLocationById$Params {
  'location-id': string;
}

export function getLocationById(http: HttpClient, rootUrl: string, params: GetLocationById$Params, context?: HttpContext): Observable<StrictHttpResponse<LocationResponse>> {
  const rb = new RequestBuilder(rootUrl, getLocationById.PATH, 'get');
  if (params) {
    rb.path('location-id', params['location-id'], {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<LocationResponse>;
    })
  );
}

getLocationById.PATH = '/locations/{location-id}';