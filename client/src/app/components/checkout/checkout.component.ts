import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { Cart, CheckoutSession } from '../../services/cart.service';


@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Checkout</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <!-- Order Summary -->
          <div class="order-summary" *ngIf="cart">
            <h2>Order Summary</h2>
            <div class="cart-items">
              <div *ngFor="let item of cart.items" class="cart-item">
                <img [src]="item.imageUrl" [alt]="item.title" class="item-image">
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p>Quantity: {{ item.quantity }}</p>
                  <p>Price: {{ item.price * item.quantity | currency }}</p>
                </div>
              </div>
            </div>
            <div class="total">
              <h3>Total: {{ cart.totalPrice | currency }}</h3>
            </div>
          </div>

          <!-- Checkout Form -->
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="checkoutForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="checkoutForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Back to Cart
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="checkoutForm.invalid || isLoading">
                <mat-icon>shopping_cart_checkout</mat-icon>
                Proceed to Payment
              </button>
            </div>
          </form>

          <!-- Loading Spinner -->
          <div class="loading-spinner" *ngIf="isLoading">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Creating your checkout session...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .order-summary {
      margin-bottom: 30px;
    }

    .cart-items {
      margin: 20px 0;
    }

    .cart-item {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      flex: 1;

      h3 {
        margin: 0 0 10px;
        color: #333;
      }

      p {
        margin: 5px 0;
        color: #666;
      }
    }

    .total {
      text-align: right;
      padding: 20px 0;
      border-top: 2px solid #eee;

      h3 {
        color: #1976d2;
        font-size: 1.4em;
        margin: 0;
      }
    }

    .checkout-form {
      margin-top: 30px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      
      p {
        margin-top: 10px;
        color: #666;
      }
    }

    @media (max-width: 600px) {
      .cart-item {
        flex-direction: column;
        gap: 10px;
      }

      .item-image {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  checkoutForm: FormGroup;
  isLoading = false;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        if (!cart || cart.items.length === 0) {
          this.snackBar.open('Your cart is empty', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.snackBar.open('Error loading cart details', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cart) {
      this.isLoading = true;
      const email = this.checkoutForm.get('email')?.value;

      this.cartService.createCheckout(email).subscribe({
        next: (session: CheckoutSession) => {
          // Redirect to Shopify checkout
          window.location.href = session.webUrl;
        },
        error: (error) => {
          console.error('Checkout error:', error);
          this.isLoading = false;
          this.snackBar.open(
            'Error creating checkout session. Please try again.',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
} 