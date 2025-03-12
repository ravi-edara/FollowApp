import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopifyService } from '../../services/shopify.service';
import { CartService } from '../../services/cart.service';
import { ShopifyProduct } from '../../models/shopify-product.interface';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="product-detail" *ngIf="product">
      <div class="product-images">
        <div class="main-image">
          <img [src]="selectedImage?.src || product.images[0]?.src" [alt]="product.title">
        </div>
        <div class="thumbnail-list">
          <div 
            *ngFor="let image of product.images" 
            class="thumbnail"
            [class.selected]="selectedImage?.id === image.id"
            (click)="selectImage(image)">
            <img [src]="image.src" [alt]="product.title">
          </div>
        </div>
      </div>

      <div class="product-info">
        <h1>{{ product.title }}</h1>
        <p class="vendor">{{ product.vendor }}</p>
        
        <div class="price-section">
          <p class="price">{{ product.variants[0]?.price | currency }}</p>
          <p class="compare-price" *ngIf="product.variants[0]?.compare_at_price">
            {{ product.variants[0]?.compare_at_price | currency }}
          </p>
        </div>

        <div class="inventory-section">
          <p class="inventory" [class.low]="product.variants[0]?.inventory_quantity < 10">
            {{ product.variants[0]?.inventory_quantity }} in stock
          </p>
        </div>

        <div class="description">
          <h2>Description</h2>
          <div [innerHTML]="product.description"></div>
        </div>

        <div class="variants" *ngIf="product.variants.length > 1">
          <h2>Options</h2>
          <div class="variant-options">
            <div *ngFor="let option of product.options" class="option-group">
              <label>{{ option.name }}</label>
              <mat-form-field>
                <mat-select [(ngModel)]="selectedOptions[option.name]">
                  <mat-option *ngFor="let value of option.values" [value]="value">
                    {{ value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </div>

        <div class="actions">
          <button 
            mat-raised-button 
            color="primary" 
            [disabled]="!selectedVariant?.inventory_quantity"
            (click)="addToCart()">
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Loading product details...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="error-container">
      <mat-icon color="warn">error_outline</mat-icon>
      <p>{{ error }}</p>
    </div>
  `,
  styles: [`
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-images {
      .main-image {
        margin-bottom: 16px;
        
        img {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }
      }

      .thumbnail-list {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 8px 0;

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;

          &.selected {
            border-color: var(--primary-color);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .product-info {
      h1 {
        margin: 0 0 8px;
        font-size: 2em;
      }

      .vendor {
        color: var(--text-color-light);
        margin: 0 0 16px;
      }

      .price-section {
        margin-bottom: 16px;

        .price {
          font-size: 1.5em;
          font-weight: 500;
          margin: 0;
        }

        .compare-price {
          color: var(--text-color-light);
          text-decoration: line-through;
          margin: 4px 0 0;
        }
      }

      .inventory-section {
        margin-bottom: 24px;

        .inventory {
          margin: 0;
          font-size: 1.1em;
          
          &.low {
            color: var(--warn-color);
          }
        }
      }

      .description {
        margin-bottom: 32px;

        h2 {
          margin: 0 0 16px;
          font-size: 1.5em;
        }
      }

      .variants {
        margin-bottom: 32px;

        h2 {
          margin: 0 0 16px;
          font-size: 1.5em;
        }

        .variant-options {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .option-group {
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: 500;
            }

            mat-form-field {
              width: 100%;
            }
          }
        }
      }

      .actions {
        button {
          width: 100%;
          padding: 16px;
          font-size: 1.1em;
        }
      }
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
    }

    .error-container {
      color: var(--warn-color);
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 16px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: ShopifyProduct | null = null;
  selectedImage: any = null;
  selectedOptions: { [key: string]: string } = {};
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private shopifyService: ShopifyService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.shopifyService.getProduct(id)
      .subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.images[0];
          this.initializeOptions();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details. Please try again later.';
          this.loading = false;
        }
      });
  }

  initializeOptions(): void {
    if (this.product) {
      this.product.options.forEach(option => {
        this.selectedOptions[option.name] = option.values[0];
      });
    }
  }

  selectImage(image: any): void {
    this.selectedImage = image;
  }

  get selectedVariant(): any {
    if (!this.product) return null;

    return this.product.variants.find(variant => {
      return this.product?.options.every(option => {
        const optionValue = this.selectedOptions[option.name];
        return variant[`option${option.position}`] === optionValue;
      });
    });
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) {
      return;
    }

    try {
      this.cartService.addItem(this.product, this.selectedVariant.id);
      this.snackBar.open('Added to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } catch (error) {
      this.snackBar.open('Failed to add item to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }
} 