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

import { deleteItem } from '../fn/items/delete-item';
import { DeleteItem$Params } from '../fn/items/delete-item';
import { getAllItems } from '../fn/items/get-all-items';
import { GetAllItems$Params } from '../fn/items/get-all-items';
import { getAvailableItems } from '../fn/items/get-available-items';
import { GetAvailableItems$Params } from '../fn/items/get-available-items';
import { getAvailableItemsByCategory } from '../fn/items/get-available-items-by-category';
import { GetAvailableItemsByCategory$Params } from '../fn/items/get-available-items-by-category';
import { getItemById } from '../fn/items/get-item-by-id';
import { GetItemById$Params } from '../fn/items/get-item-by-id';
import { getItemsByCategory } from '../fn/items/get-items-by-category';
import { GetItemsByCategory$Params } from '../fn/items/get-items-by-category';
import { getPageOfItems } from '../fn/items/get-page-of-items';
import { GetPageOfItems$Params } from '../fn/items/get-page-of-items';
import { getPageOfItemsByCategory } from '../fn/items/get-page-of-items-by-category';
import { GetPageOfItemsByCategory$Params } from '../fn/items/get-page-of-items-by-category';
import { IdResponse } from '../models/id-response';
import { ItemResponse } from '../models/item-response';
import { PageResponseItemResponse } from '../models/page-response-item-response';
import { saveItem } from '../fn/items/save-item';
import { SaveItem$Params } from '../fn/items/save-item';
import { searchItemsByName } from '../fn/items/search-items-by-name';
import { SearchItemsByName$Params } from '../fn/items/search-items-by-name';
import { updateItemStatus } from '../fn/items/update-item-status';
import { UpdateItemStatus$Params } from '../fn/items/update-item-status';
import { uploadCoverPicture } from '../fn/items/upload-cover-picture';
import { UploadCoverPicture$Params } from '../fn/items/upload-cover-picture';

@Injectable({ providedIn: 'root' })
export class ItemsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateItemStatus()` */
  static readonly UpdateItemStatusPath = '/items/toggle-availability/{item-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateItemStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateItemStatus$Response(params: UpdateItemStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return updateItemStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateItemStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  updateItemStatus(params: UpdateItemStatus$Params, context?: HttpContext): Observable<string> {
    return this.updateItemStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `getAllItems()` */
  static readonly GetAllItemsPath = '/items';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllItems()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllItems$Response(params?: GetAllItems$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
    return getAllItems(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllItems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllItems(params?: GetAllItems$Params, context?: HttpContext): Observable<Array<ItemResponse>> {
    return this.getAllItems$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ItemResponse>>): Array<ItemResponse> => r.body)
    );
  }

  /** Path part for operation `saveItem()` */
  static readonly SaveItemPath = '/items';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveItem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveItem$Response(params: SaveItem$Params, context?: HttpContext): Observable<StrictHttpResponse<IdResponse>> {
    return saveItem(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveItem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveItem(params: SaveItem$Params, context?: HttpContext): Observable<IdResponse> {
    return this.saveItem$Response(params, context).pipe(
      map((r: StrictHttpResponse<IdResponse>): IdResponse => r.body)
    );
  }

  /** Path part for operation `uploadCoverPicture()` */
  static readonly UploadCoverPicturePath = '/items/cover-picture/{item-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadCoverPicture()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadCoverPicture$Response(params: UploadCoverPicture$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return uploadCoverPicture(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadCoverPicture$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadCoverPicture(params: UploadCoverPicture$Params, context?: HttpContext): Observable<{
}> {
    return this.uploadCoverPicture$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getItemById()` */
  static readonly GetItemByIdPath = '/items/{item-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getItemById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getItemById$Response(params: GetItemById$Params, context?: HttpContext): Observable<StrictHttpResponse<ItemResponse>> {
    return getItemById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getItemById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getItemById(params: GetItemById$Params, context?: HttpContext): Observable<ItemResponse> {
    return this.getItemById$Response(params, context).pipe(
      map((r: StrictHttpResponse<ItemResponse>): ItemResponse => r.body)
    );
  }

  /** Path part for operation `deleteItem()` */
  static readonly DeleteItemPath = '/items/{item-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteItem()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteItem$Response(params: DeleteItem$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return deleteItem(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteItem$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteItem(params: DeleteItem$Params, context?: HttpContext): Observable<{
}> {
    return this.deleteItem$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `searchItemsByName()` */
  static readonly SearchItemsByNamePath = '/items/search/name/{item-name}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `searchItemsByName()` instead.
   *
   * This method doesn't expect any request body.
   */
  searchItemsByName$Response(params: SearchItemsByName$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
    return searchItemsByName(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `searchItemsByName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  searchItemsByName(params: SearchItemsByName$Params, context?: HttpContext): Observable<Array<ItemResponse>> {
    return this.searchItemsByName$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ItemResponse>>): Array<ItemResponse> => r.body)
    );
  }

  /** Path part for operation `getPageOfItems()` */
  static readonly GetPageOfItemsPath = '/items/page';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPageOfItems()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfItems$Response(params?: GetPageOfItems$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseItemResponse>> {
    return getPageOfItems(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPageOfItems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfItems(params?: GetPageOfItems$Params, context?: HttpContext): Observable<PageResponseItemResponse> {
    return this.getPageOfItems$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseItemResponse>): PageResponseItemResponse => r.body)
    );
  }

  /** Path part for operation `getItemsByCategory()` */
  static readonly GetItemsByCategoryPath = '/items/category/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getItemsByCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  getItemsByCategory$Response(params: GetItemsByCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
    return getItemsByCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getItemsByCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getItemsByCategory(params: GetItemsByCategory$Params, context?: HttpContext): Observable<Array<ItemResponse>> {
    return this.getItemsByCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ItemResponse>>): Array<ItemResponse> => r.body)
    );
  }

  /** Path part for operation `getPageOfItemsByCategory()` */
  static readonly GetPageOfItemsByCategoryPath = '/items/category/page/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPageOfItemsByCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfItemsByCategory$Response(params: GetPageOfItemsByCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseItemResponse>> {
    return getPageOfItemsByCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPageOfItemsByCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfItemsByCategory(params: GetPageOfItemsByCategory$Params, context?: HttpContext): Observable<PageResponseItemResponse> {
    return this.getPageOfItemsByCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseItemResponse>): PageResponseItemResponse => r.body)
    );
  }

  /** Path part for operation `getAvailableItems()` */
  static readonly GetAvailableItemsPath = '/items/available';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAvailableItems()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableItems$Response(params?: GetAvailableItems$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
    return getAvailableItems(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAvailableItems$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableItems(params?: GetAvailableItems$Params, context?: HttpContext): Observable<Array<ItemResponse>> {
    return this.getAvailableItems$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ItemResponse>>): Array<ItemResponse> => r.body)
    );
  }

  /** Path part for operation `getAvailableItemsByCategory()` */
  static readonly GetAvailableItemsByCategoryPath = '/items/available/category/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAvailableItemsByCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableItemsByCategory$Response(params: GetAvailableItemsByCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ItemResponse>>> {
    return getAvailableItemsByCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAvailableItemsByCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAvailableItemsByCategory(params: GetAvailableItemsByCategory$Params, context?: HttpContext): Observable<Array<ItemResponse>> {
    return this.getAvailableItemsByCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ItemResponse>>): Array<ItemResponse> => r.body)
    );
  }

}
