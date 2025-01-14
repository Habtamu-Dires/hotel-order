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

import { CategoryResponse } from '../models/category-response';
import { deleteCategory } from '../fn/categories/delete-category';
import { DeleteCategory$Params } from '../fn/categories/delete-category';
import { getAllCategory } from '../fn/categories/get-all-category';
import { GetAllCategory$Params } from '../fn/categories/get-all-category';
import { getCategoryById } from '../fn/categories/get-category-by-id';
import { GetCategoryById$Params } from '../fn/categories/get-category-by-id';
import { getMainCategories } from '../fn/categories/get-main-categories';
import { GetMainCategories$Params } from '../fn/categories/get-main-categories';
import { getPageOfCategories } from '../fn/categories/get-page-of-categories';
import { GetPageOfCategories$Params } from '../fn/categories/get-page-of-categories';
import { getPagesOfMainCategories } from '../fn/categories/get-pages-of-main-categories';
import { GetPagesOfMainCategories$Params } from '../fn/categories/get-pages-of-main-categories';
import { getPagesOfSubCategories } from '../fn/categories/get-pages-of-sub-categories';
import { GetPagesOfSubCategories$Params } from '../fn/categories/get-pages-of-sub-categories';
import { IdResponse } from '../models/id-response';
import { PageResponseCategoryResponse } from '../models/page-response-category-response';
import { saveCategory } from '../fn/categories/save-category';
import { SaveCategory$Params } from '../fn/categories/save-category';
import { searchCategoryByName } from '../fn/categories/search-category-by-name';
import { SearchCategoryByName$Params } from '../fn/categories/search-category-by-name';
import { uploadCoverPicture1 } from '../fn/categories/upload-cover-picture-1';
import { UploadCoverPicture1$Params } from '../fn/categories/upload-cover-picture-1';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getAllCategory()` */
  static readonly GetAllCategoryPath = '/categories';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategory$Response(params?: GetAllCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CategoryResponse>>> {
    return getAllCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategory(params?: GetAllCategory$Params, context?: HttpContext): Observable<Array<CategoryResponse>> {
    return this.getAllCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CategoryResponse>>): Array<CategoryResponse> => r.body)
    );
  }

  /** Path part for operation `saveCategory()` */
  static readonly SaveCategoryPath = '/categories';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveCategory$Response(params: SaveCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<IdResponse>> {
    return saveCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveCategory(params: SaveCategory$Params, context?: HttpContext): Observable<IdResponse> {
    return this.saveCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<IdResponse>): IdResponse => r.body)
    );
  }

  /** Path part for operation `uploadCoverPicture1()` */
  static readonly UploadCoverPicture1Path = '/categories/cover-picture/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadCoverPicture1()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadCoverPicture1$Response(params: UploadCoverPicture1$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return uploadCoverPicture1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadCoverPicture1$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  uploadCoverPicture1(params: UploadCoverPicture1$Params, context?: HttpContext): Observable<{
}> {
    return this.uploadCoverPicture1$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getCategoryById()` */
  static readonly GetCategoryByIdPath = '/categories/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCategoryById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCategoryById$Response(params: GetCategoryById$Params, context?: HttpContext): Observable<StrictHttpResponse<CategoryResponse>> {
    return getCategoryById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCategoryById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCategoryById(params: GetCategoryById$Params, context?: HttpContext): Observable<CategoryResponse> {
    return this.getCategoryById$Response(params, context).pipe(
      map((r: StrictHttpResponse<CategoryResponse>): CategoryResponse => r.body)
    );
  }

  /** Path part for operation `deleteCategory()` */
  static readonly DeleteCategoryPath = '/categories/{category-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCategory$Response(params: DeleteCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return deleteCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCategory(params: DeleteCategory$Params, context?: HttpContext): Observable<{
}> {
    return this.deleteCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getPagesOfSubCategories()` */
  static readonly GetPagesOfSubCategoriesPath = '/categories/sub/page';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPagesOfSubCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPagesOfSubCategories$Response(params?: GetPagesOfSubCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseCategoryResponse>> {
    return getPagesOfSubCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPagesOfSubCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPagesOfSubCategories(params?: GetPagesOfSubCategories$Params, context?: HttpContext): Observable<PageResponseCategoryResponse> {
    return this.getPagesOfSubCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseCategoryResponse>): PageResponseCategoryResponse => r.body)
    );
  }

  /** Path part for operation `searchCategoryByName()` */
  static readonly SearchCategoryByNamePath = '/categories/search/name/{category-name}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `searchCategoryByName()` instead.
   *
   * This method doesn't expect any request body.
   */
  searchCategoryByName$Response(params: SearchCategoryByName$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CategoryResponse>>> {
    return searchCategoryByName(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `searchCategoryByName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  searchCategoryByName(params: SearchCategoryByName$Params, context?: HttpContext): Observable<Array<CategoryResponse>> {
    return this.searchCategoryByName$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CategoryResponse>>): Array<CategoryResponse> => r.body)
    );
  }

  /** Path part for operation `getPageOfCategories()` */
  static readonly GetPageOfCategoriesPath = '/categories/page';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPageOfCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfCategories$Response(params?: GetPageOfCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseCategoryResponse>> {
    return getPageOfCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPageOfCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPageOfCategories(params?: GetPageOfCategories$Params, context?: HttpContext): Observable<PageResponseCategoryResponse> {
    return this.getPageOfCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseCategoryResponse>): PageResponseCategoryResponse => r.body)
    );
  }

  /** Path part for operation `getMainCategories()` */
  static readonly GetMainCategoriesPath = '/categories/main';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMainCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMainCategories$Response(params?: GetMainCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CategoryResponse>>> {
    return getMainCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getMainCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMainCategories(params?: GetMainCategories$Params, context?: HttpContext): Observable<Array<CategoryResponse>> {
    return this.getMainCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CategoryResponse>>): Array<CategoryResponse> => r.body)
    );
  }

  /** Path part for operation `getPagesOfMainCategories()` */
  static readonly GetPagesOfMainCategoriesPath = '/categories/main/page';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPagesOfMainCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPagesOfMainCategories$Response(params?: GetPagesOfMainCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseCategoryResponse>> {
    return getPagesOfMainCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPagesOfMainCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPagesOfMainCategories(params?: GetPagesOfMainCategories$Params, context?: HttpContext): Observable<PageResponseCategoryResponse> {
    return this.getPagesOfMainCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseCategoryResponse>): PageResponseCategoryResponse => r.body)
    );
  }

}
