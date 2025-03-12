import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      <!-- Empty Cart State -->
      <div *ngIf="!cart.items.length" class="empty-cart">
        <mat-icon>shopping_cart</mat-icon>
        <p>Your cart is empty</p>
        <button mat-raised-button color="primary" routerLink="/">
          Continue Shopping
        </button>
      </div>

      <!-- Cart Items -->
      <div *ngIf="cart.items.length" class="cart-content">
        <div class="cart-items">
          <mat-card *ngFor="let item of cart.items" class="cart-item">
            <img [src]="item.image" [alt]="item.title">
            <div class="item-details">
              <h3>{{ item.title }}</h3>
              <p class="price">{{ item.price | currency }}</p>
            </div>
            <div class="quantity-controls">
              <button mat-icon-button (click)="updateQuantity(item, item.quantity - 1)">
                <mat-icon>remove</mat-icon>
              </button>
              <span>{{ item.quantity }}</span>
              <button mat-icon-button (click)="updateQuantity(item, item.quantity + 1)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <button mat-icon-button color="warn" (click)="removeItem(item.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ cart.total | currency }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ cart.total | currency }}</span>
          </div>

          <!-- Checkout Form -->
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-error *ngIf="checkoutForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="checkoutForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="!checkoutForm.valid || loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Proceed to Checkout</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;

      h1 {
        margin-bottom: 24px;
      }
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        color: var(--text-color-light);
      }

      p {
        margin-bottom: 24px;
        font-size: 1.2em;
        color: var(--text-color-light);
      }
    }

    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .cart-item {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 16px;
        align-items: center;
        padding: 16px;

        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details {
          h3 {
            margin: 0 0 8px;
            font-size: 1.1em;
          }

          .price {
            margin: 0;
            font-weight: 500;
          }
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;

          span {
            min-width: 24px;
            text-align: center;
          }
        }
      }
    }

    .cart-summary {
      background: var(--surface-color);
      padding: 24px;
      border-radius: 4px;

      h2 {
        margin: 0 0 24px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        &.total {
          font-weight: 500;
          font-size: 1.2em;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }
      }

      .checkout-form {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }

        button {
          width: 100%;
          padding: 16px;
          font-size: 1.1em;

          mat-spinner {
            margin-right: 8px;
          }
        }
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: any = { items: [], total: 0 };
  checkoutForm: FormGroup;
  loading = false;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  //updateQuantity(item: CartItem, quantity: number): void {
  //  if (quantity > 0) {
  //    this.cartService.updateQuantity(item.id, quantity);
  //  }
  //}

  //removeItem(itemId: string): void {
  //  this.cartService.removeItem(itemId);
  //  this.snackBar.open('Item removed from cart', 'Close', {
  //    duration: 3000,
  //    horizontalPosition: 'end',
  //    verticalPosition: 'top'
  //  });
  //}

  //onSubmit(): void {
  //  if (this.checkoutForm.valid) {
  //    this.loading = true;
  //    const email = this.checkoutForm.get('email')?.value;

  //    this.cartService.createCheckout(email).subscribe({
  //      next: (response) => {
  //        window.location.href = response.checkoutUrl;
  //      },
  //      error: (error) => {
  //        this.snackBar.open('Failed to create checkout', 'Close', {
  //          duration: 3000,
  //          horizontalPosition: 'end',
  //          verticalPosition: 'top'
  //        });
  //        this.loading = false;
  //      }
  //    });
  //  }
  //}
} 