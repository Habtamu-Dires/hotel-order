/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface UpdateRoomStatus$Params {
  'room-id': string;
  status: 'OCCUPIED' | 'ONCHANGE' | 'READY' | 'DND' | 'OOO';
}

export function updateRoomStatus(http: HttpClient, rootUrl: string, params: UpdateRoomStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, updateRoomStatus.PATH, 'put');
  if (params) {
    rb.path('room-id', params['room-id'], {});
    rb.query('status', params.status, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

updateRoomStatus.PATH = '/locations/rooms/update-status/{room-id}';
