import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ShopifyProduct } from '../models/shopify-product.interface';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
  variantId: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface CheckoutSession {
  id: string;
  webUrl: string;
  status: string;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/api/cart`;
  private cartId: string;
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {
    this.cartId = localStorage.getItem('cartId') || this.generateCartId();
    this.loadCart();
  }

  private generateCartId(): string {
    const cartId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('cartId', cartId);
    return cartId;
  }

  private loadCart(): void {
    this.http.get<Cart>(`${this.apiUrl}/${this.cartId}`)
      .subscribe(cart => this.cartSubject.next(cart));
  }

  getCart(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

    addItem(product: ShopifyProduct, variantId: string, quantity: number = 1): void {
        const currentCart = this.cartSubject.value;
        const variant = product.variants.find(v => v.id === variantId);

        if (!variant) {
            throw new Error('Variant not found');
        }

        const existingItem = currentCart?.items.find(
            item => item.productId === product.id && item.variantId === variantId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentCart?.items.push({
                id: `${product.id}-${variantId}`,
                productId: product.id,
                title: product.title,
                price: variant.price,
                quantity,
                image: product.images[0]?.src || '',
                variantId
            });
        }
        if (currentCart) {
            this.updateCart(currentCart);
        }
  }

  updateQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart?.items.find(i => i.id === itemId);

      if (item && currentCart) {
      if (quantity <= 0) {
        currentCart.items = currentCart?.items.filter(i => i.id !== itemId);
      } else {
        item.quantity = quantity;
      }
        if (currentCart) {
            this.updateCart(currentCart);
        }
    }
  }

  removeItem(itemId: string): void {
      const currentCart = this.cartSubject.value;
      if (currentCart) {
          currentCart.items = currentCart?.items.filter(item => item.id !== itemId);
          this.updateCart(currentCart);
      }
  }

  updateCart(cart: Cart): void {
    cart.total = this.calculateTotal(cart.items);
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.cartSubject.value?.items.reduce((count, item) => count + item.quantity, 0) || 0;
  }

  createCheckout(customerEmail: string): Observable<CheckoutSession> {
    return this.http.post<CheckoutSession>(
      `${this.apiUrl}/${this.cartId}/checkout`,
      { customerEmail }
    ).pipe(
      map(session => {
        // Clear the cart after successful checkout
        this.cartSubject.next(null);
        return session;
      })
    );
  }

  clearCart(): void {
    this.cartId = this.generateCartId();
    this.cartSubject.next(null);
  }
} 