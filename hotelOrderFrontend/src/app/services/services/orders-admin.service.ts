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

import { DailyAverageOrderResponse } from '../models/daily-average-order-response';
import { DayOfTheWeekAnalysisResponse } from '../models/day-of-the-week-analysis-response';
import { getDailyAverageOrders } from '../fn/orders-admin/get-daily-average-orders';
import { GetDailyAverageOrders$Params } from '../fn/orders-admin/get-daily-average-orders';
import { getDayOfTheWeekAverages } from '../fn/orders-admin/get-day-of-the-week-averages';
import { GetDayOfTheWeekAverages$Params } from '../fn/orders-admin/get-day-of-the-week-averages';
import { getFrequentlyOrderedItemsOfPast30Days } from '../fn/orders-admin/get-frequently-ordered-items-of-past-30-days';
import { GetFrequentlyOrderedItemsOfPast30Days$Params } from '../fn/orders-admin/get-frequently-ordered-items-of-past-30-days';
import { getMonthlyOrderData } from '../fn/orders-admin/get-monthly-order-data';
import { GetMonthlyOrderData$Params } from '../fn/orders-admin/get-monthly-order-data';
import { getTopOrderedItemsADay } from '../fn/orders-admin/get-top-ordered-items-a-day';
import { GetTopOrderedItemsADay$Params } from '../fn/orders-admin/get-top-ordered-items-a-day';
import { getTotalNumberOfOrders } from '../fn/orders-admin/get-total-number-of-orders';
import { GetTotalNumberOfOrders$Params } from '../fn/orders-admin/get-total-number-of-orders';
import { getTotalTransaction } from '../fn/orders-admin/get-total-transaction';
import { GetTotalTransaction$Params } from '../fn/orders-admin/get-total-transaction';
import { MonthlyOrderDataResponse } from '../models/monthly-order-data-response';
import { OrderedItemsFrequencyResponse } from '../models/ordered-items-frequency-response';
import { PageResponseOrderedItemsFrequencyResponse } from '../models/page-response-ordered-items-frequency-response';

@Injectable({ providedIn: 'root' })
export class OrdersAdminService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getTotalTransaction()` */
  static readonly GetTotalTransactionPath = '/orders/completed/total-transaction-after';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTotalTransaction()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTotalTransaction$Response(params: GetTotalTransaction$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getTotalTransaction(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTotalTransaction$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTotalTransaction(params: GetTotalTransaction$Params, context?: HttpContext): Observable<number> {
    return this.getTotalTransaction$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getTopOrderedItemsADay()` */
  static readonly GetTopOrderedItemsADayPath = '/orders/completed/top-ordered-items-of-today';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTopOrderedItemsADay()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTopOrderedItemsADay$Response(params?: GetTopOrderedItemsADay$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<OrderedItemsFrequencyResponse>>> {
    return getTopOrderedItemsADay(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTopOrderedItemsADay$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTopOrderedItemsADay(params?: GetTopOrderedItemsADay$Params, context?: HttpContext): Observable<Array<OrderedItemsFrequencyResponse>> {
    return this.getTopOrderedItemsADay$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<OrderedItemsFrequencyResponse>>): Array<OrderedItemsFrequencyResponse> => r.body)
    );
  }

  /** Path part for operation `getFrequentlyOrderedItemsOfPast30Days()` */
  static readonly GetFrequentlyOrderedItemsOfPast30DaysPath = '/orders/completed/top-ordered-items-of-past-30days';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFrequentlyOrderedItemsOfPast30Days()` instead.
   *
   * This method doesn't expect any request body.
   */
  getFrequentlyOrderedItemsOfPast30Days$Response(params?: GetFrequentlyOrderedItemsOfPast30Days$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseOrderedItemsFrequencyResponse>> {
    return getFrequentlyOrderedItemsOfPast30Days(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getFrequentlyOrderedItemsOfPast30Days$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getFrequentlyOrderedItemsOfPast30Days(params?: GetFrequentlyOrderedItemsOfPast30Days$Params, context?: HttpContext): Observable<PageResponseOrderedItemsFrequencyResponse> {
    return this.getFrequentlyOrderedItemsOfPast30Days$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseOrderedItemsFrequencyResponse>): PageResponseOrderedItemsFrequencyResponse => r.body)
    );
  }

  /** Path part for operation `getTotalNumberOfOrders()` */
  static readonly GetTotalNumberOfOrdersPath = '/orders/completed/number-of-orders-after';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTotalNumberOfOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTotalNumberOfOrders$Response(params: GetTotalNumberOfOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getTotalNumberOfOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTotalNumberOfOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTotalNumberOfOrders(params: GetTotalNumberOfOrders$Params, context?: HttpContext): Observable<number> {
    return this.getTotalNumberOfOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getMonthlyOrderData()` */
  static readonly GetMonthlyOrderDataPath = '/orders/completed/monthly-order-data';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMonthlyOrderData()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMonthlyOrderData$Response(params: GetMonthlyOrderData$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<MonthlyOrderDataResponse>>> {
    return getMonthlyOrderData(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getMonthlyOrderData$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMonthlyOrderData(params: GetMonthlyOrderData$Params, context?: HttpContext): Observable<Array<MonthlyOrderDataResponse>> {
    return this.getMonthlyOrderData$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<MonthlyOrderDataResponse>>): Array<MonthlyOrderDataResponse> => r.body)
    );
  }

  /** Path part for operation `getDayOfTheWeekAverages()` */
  static readonly GetDayOfTheWeekAveragesPath = '/orders/completed/day-of-the-week-average-order-data-for-28days';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDayOfTheWeekAverages()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDayOfTheWeekAverages$Response(params?: GetDayOfTheWeekAverages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<DayOfTheWeekAnalysisResponse>>> {
    return getDayOfTheWeekAverages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getDayOfTheWeekAverages$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDayOfTheWeekAverages(params?: GetDayOfTheWeekAverages$Params, context?: HttpContext): Observable<Array<DayOfTheWeekAnalysisResponse>> {
    return this.getDayOfTheWeekAverages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<DayOfTheWeekAnalysisResponse>>): Array<DayOfTheWeekAnalysisResponse> => r.body)
    );
  }

  /** Path part for operation `getDailyAverageOrders()` */
  static readonly GetDailyAverageOrdersPath = '/orders/completed/daily-average-order-data-for-past-7days';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDailyAverageOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDailyAverageOrders$Response(params?: GetDailyAverageOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<DailyAverageOrderResponse>> {
    return getDailyAverageOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getDailyAverageOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDailyAverageOrders(params?: GetDailyAverageOrders$Params, context?: HttpContext): Observable<DailyAverageOrderResponse> {
    return this.getDailyAverageOrders$Response(params, context).pipe(
      map((r: StrictHttpResponse<DailyAverageOrderResponse>): DailyAverageOrderResponse => r.body)
    );
  }

}
