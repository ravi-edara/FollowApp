import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShopifyProduct, ShopifyProductsResponse } from '../models/shopify-product.interface';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private readonly apiUrl = environment.apiUrl;
  private readonly accessToken = environment.shopify.accessToken;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'X-Shopify-Access-Token': this.accessToken
    });
  }

  private mapProduct(product: any): ShopifyProduct {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      vendor: product.vendor,
      product_type: product.product_type,
      created_at: product.created_at,
      handle: product.handle,
      updated_at: product.updated_at,
      published_at: product.published_at,
      template_suffix: product.template_suffix,
      status: product.status,
      published_scope: product.published_scope,
      tags: product.tags,
      variants: product.variants,
      images: product.images,
      options: product.options
    };
  }

  getProducts(limit: number = 250): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('limit', limit.toString());

    return this.http.get(
      `${this.apiUrl}/products`,
      {
        headers: this.headers,
        params,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        const products = (parsed || []).map((product: any) => this.mapProduct(product));
        return {
          products,
          pageInfo: {
            hasNextPage: products.length === limit,
            hasPreviousPage: false
          }
        };
      })
    );
  }

  getProduct(id: string): Observable<ShopifyProduct> {
    return this.http.get(
      `${this.apiUrl}/products/${id}.json`,
      {
        headers: this.headers,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        return this.mapProduct(parsed.product);
      })
    );
  }

  searchProducts(query: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('query', query);

    return this.http.get(
      `${this.apiUrl}/products/search.json`,
      {
        headers: this.headers,
        params,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        const products = (parsed.products || []).map((product: any) => this.mapProduct(product));
        return {
          products,
          pageInfo: {
            hasNextPage: false
          }
        };
      })
    );
  }

  getProductsByVendor(vendor: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('vendor', vendor);

    return this.http.get(
      `${this.apiUrl}/products.json`,
      {
        headers: this.headers,
        params,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        const products = (parsed.products || []).map((product: any) => this.mapProduct(product));
        return {
          products,
          pageInfo: {
            hasNextPage: false
          }
        };
      })
    );
  }

  getProductsByTag(tag: string): Observable<ShopifyProductsResponse> {
    const params = new HttpParams()
      .set('tag', tag);

    return this.http.get(
      `${this.apiUrl}/products.json`,
      {
        headers: this.headers,
        params,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        const products = (parsed.products || []).map((product: any) => this.mapProduct(product));
        return {
          products,
          pageInfo: {
            hasNextPage: false
          }
        };
      })
    );
  }

  getProductsByCollection(collectionId: string): Observable<ShopifyProductsResponse> {
    return this.http.get(
      `${this.apiUrl}/collections/${collectionId}/products.json`,
      {
        headers: this.headers,
        responseType: 'text'
      }
    ).pipe(
      map(response => {
        const parsed = JSON.parse(response);
        const products = (parsed.data?.collection?.products || []).map((product: any) => this.mapProduct(product));
        return {
          products,
          pageInfo: {
            hasNextPage: false
          }
        };
      })
    );
  }
} 