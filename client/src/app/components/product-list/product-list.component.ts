import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopifyService } from '../../services/shopify.service';
import { ShopifyProduct } from '../../models/shopify-product.interface';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading products...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error_outline</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadProducts()">
          Try Again
        </button>
      </div>

      <!-- Products Grid -->
      <div *ngIf="!loading && !error" class="products-grid">
        <mat-card *ngFor="let product of products" class="product-card">
          <img mat-card-image [src]="product.images[0]?.src || 'assets/placeholder.jpg'" [alt]="product.title">
          <mat-card-content>
            <h2>{{ product.title }}</h2>
            <p class="vendor">{{ product.vendor }}</p>
            <p class="price">{{ (product.variants[0]?.price || '0.00') | currency }}</p>
            <p class="inventory" [class.low]="(product.variants[0]?.inventory_quantity || 0) < 10">
              {{ product.variants[0]?.inventory_quantity || 0 }} in stock
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="viewProduct(product)">
              View Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && !error && products.length > 0" class="pagination">
        <button 
          mat-button 
          [disabled]="currentPage === 1"
          (click)="loadPreviousPage()">
          Previous
        </button>
        <span>Page {{ currentPage }}</span>
        <button 
          mat-button 
          [disabled]="!pageInfo?.hasNextPage"
          (click)="loadNextPage()">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-list {
      padding: 24px;
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

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
      }

      img {
        height: 200px;
        object-fit: cover;
      }

      mat-card-content {
        flex-grow: 1;
        padding: 16px;

        h2 {
          margin: 0 0 8px;
          font-size: 1.2em;
          line-height: 1.4;
        }

        .vendor {
          color: var(--text-color-light);
          margin: 0 0 8px;
        }

        .price {
          font-size: 1.1em;
          font-weight: 500;
          margin: 0 0 8px;
        }

        .inventory {
          margin: 0;
          font-size: 0.9em;
          
          &.low {
            color: var(--warn-color);
          }
        }
      }

      mat-card-actions {
        padding: 16px;
        display: flex;
        justify-content: center;
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
    }

    @media (max-width: 600px) {
      .product-list {
        padding: 16px;
      }

      .products-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: ShopifyProduct[] = [];
  loading = true;
  error: string | null = null;
  pageInfo: any = null;
  currentPage = 1;
  itemsPerPage = 250;

  constructor(
    private shopifyService: ShopifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.shopifyService.getProducts(this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.pageInfo = response.pageInfo;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
        }
      });
  }

  loadNextPage(): void {
    if (this.pageInfo?.hasNextPage) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  loadPreviousPage(): void {
    if (this.pageInfo?.hasPreviousPage) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  viewProduct(product: ShopifyProduct): void {
    this.router.navigate(['/products', product.id]);
  }
} 