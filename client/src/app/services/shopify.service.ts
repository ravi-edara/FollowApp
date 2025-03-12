import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShopifyProduct, ShopifyProductsResponse } from '../models/shopify-product.interface';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private readonly apiUrl = environment.shopify.apiUrl;
  private readonly accessToken = environment.shopify.accessToken;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'X-Shopify-Access-Token': this.accessToken
    });
  }

  getProducts(limit: number = 12): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('limit', limit.toString());

    return this.http.get<{ products: ShopifyProduct[] }>(
      `${this.apiUrl}/products.json`,
      { headers: this.headers, params }
    ).pipe(
      map(response => ({
        products: response.products,
        pageInfo: {
          hasNextPage: response.products.length === limit
        }
      }))
    );
  }

  getProduct(id: string): Observable<ShopifyProduct> {
    return this.http.get<{ product: ShopifyProduct }>(
      `${this.apiUrl}/products/${id}.json`,
      { headers: this.headers }
    ).pipe(
      map(response => response.product)
    );
  }

  searchProducts(query: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('query', query);

    return this.http.get<{ products: ShopifyProduct[] }>(
      `${this.apiUrl}/products/search.json`,
      { headers: this.headers, params }
    ).pipe(
      map(response => ({
        products: response.products,
        pageInfo: {
          hasNextPage: false
        }
      }))
    );
  }

  getProductsByVendor(vendor: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('vendor', vendor);

    return this.http.get<{ products: ShopifyProduct[] }>(
      `${this.apiUrl}/products.json`,
      { headers: this.headers, params }
    ).pipe(
      map(response => ({
        products: response.products,
        pageInfo: {
          hasNextPage: false
        }
      }))
    );
  }

  getProductsByTag(tag: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('tag', tag);

    return this.http.get<{ products: ShopifyProduct[] }>(
      `${this.apiUrl}/products.json`,
      { headers: this.headers, params }
    ).pipe(
      map(response => ({
        products: response.products,
        pageInfo: {
          hasNextPage: false
        }
      }))
    );
  }

  getProductsByCollection(collectionId: string): Observable<ShopifyProductsResponse> {
    return this.http.get<{ data: { collection: { products: ShopifyProductsResponse } } }>(
      `${this.apiUrl}/collections/${collectionId}/products.json`,
      { headers: this.headers }
    ).pipe(
      map(response => response.data.collection.products)
    );
  }
} 