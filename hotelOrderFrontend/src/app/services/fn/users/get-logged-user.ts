/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserResponse } from '../../models/user-response';

export interface GetLoggedUser$Params {
}

export function getLoggedUser(http: HttpClient, rootUrl: string, params?: GetLoggedUser$Params, context?: HttpContext): Observable<StrictHttpResponse<UserResponse>> {
  const rb = new RequestBuilder(rootUrl, getLoggedUser.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<UserResponse>;
    })
  );
}

getLoggedUser.PATH = '/users/logged';
