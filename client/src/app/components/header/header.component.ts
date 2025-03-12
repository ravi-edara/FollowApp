import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PracticeInfo {
  name: string;
  logo: string;
  doctorName: string;
  patientName: string;
}

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <mat-toolbar-row class="main-toolbar">
        <!-- Logo and Practice Name -->
        <div class="practice-info">
        practiceInfo: {{ practiceInfo | json }}
          <img [src]="practiceInfo.logo" [alt]="practiceInfo.name" class="practice-logo">
          <span class="practice-name">{{ practiceInfo.name }}</span>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
          <a mat-button routerLink="/products" routerLinkActive="active">
            <mat-icon>store</mat-icon>
            Products
          </a>
          <a mat-button routerLink="/appointments" routerLinkActive="active">
            <mat-icon>event</mat-icon>
            Appointments
          </a>
        </div>

        <!-- Right Side Actions -->
        <div class="action-buttons">
          <!-- Theme Switcher -->
          <button mat-icon-button [matMenuTriggerFor]="themeMenu" aria-label="Theme switcher">
            <mat-icon>palette</mat-icon>
          </button>
          <mat-menu #themeMenu="matMenu">
            <button mat-menu-item (click)="changeTheme('light')">
              <mat-icon>light_mode</mat-icon>
              <span>Light</span>
            </button>
            <button mat-menu-item (click)="changeTheme('dark')">
              <mat-icon>dark_mode</mat-icon>
              <span>Dark</span>
            </button>
            <button mat-menu-item (click)="changeTheme('blue')">
              <mat-icon>water</mat-icon>
              <span>Blue</span>
            </button>
            <button mat-menu-item (click)="changeTheme('green')">
              <mat-icon>forest</mat-icon>
              <span>Green</span>
            </button>
          </mat-menu>

          <!-- Cart Button -->
          <button mat-icon-button [matMenuTriggerFor]="cartMenu">
            <mat-icon>shopping_cart</mat-icon>
            <span class="cart-count" *ngIf="itemCount > 0">{{ itemCount }}</span>
          </button>
          <mat-menu #cartMenu="matMenu">
            <div class="cart-menu">
              <div class="cart-items" *ngIf="itemCount > 0">
                <div class="cart-item" *ngFor="let item of cart.items">
                  <img [src]="item.image" [alt]="item.title">
                  <div class="item-details">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.price | currency }} x {{ item.quantity }}</p>
                  </div>
                </div>
              </div>
              <div class="empty-cart" *ngIf="itemCount === 0">
                <p>Your cart is empty</p>
              </div>
              <div class="cart-total" *ngIf="itemCount > 0">
                <span>Total:</span>
                <span>{{ cart.total | currency }}</span>
              </div>
              <div class="cart-actions">
                <button mat-button routerLink="/cart" matMenuClose>
                  View Cart
                </button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  routerLink="/cart" 
                  matMenuClose
                  [disabled]="itemCount === 0">
                  Checkout
                </button>
              </div>
            </div>
          </mat-menu>

          <!-- User Menu -->
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
            <mat-icon>account_circle</mat-icon>
            <span class="username">{{ practiceInfo.patientName }}</span>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info-header" mat-menu-item disabled>
              <strong>Dr. {{ practiceInfo.doctorName }}</strong>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/orders">
              <mat-icon>receipt_long</mat-icon>
              <span>Orders</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar-row>

      <!-- Mobile Navigation Menu -->
      <button mat-icon-button class="mobile-menu-button" (click)="toggleMobileMenu()">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <!-- Mobile Navigation Drawer -->
    <mat-sidenav-container class="mobile-sidenav-container" *ngIf="isMobileMenuOpen">
      <mat-sidenav mode="over" [opened]="isMobileMenuOpen" (closed)="isMobileMenuOpen = false">
        <mat-nav-list>
          <a mat-list-item routerLink="/products" (click)="isMobileMenuOpen = false">
            <mat-icon>store</mat-icon>
            <span>Products</span>
          </a>
          <a mat-list-item routerLink="/appointments" (click)="isMobileMenuOpen = false">
            <mat-icon>event</mat-icon>
            <span>Appointments</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item routerLink="/profile" (click)="isMobileMenuOpen = false">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </a>
          <a mat-list-item routerLink="/orders" (click)="isMobileMenuOpen = false">
            <mat-icon>receipt_long</mat-icon>
            <span>Orders</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item (click)="logout(); isMobileMenuOpen = false">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .main-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
    }

    .practice-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .practice-logo {
      height: 40px;
      width: auto;
      border-radius: 4px;
    }

    .practice-name {
      font-size: 1.2em;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      gap: 16px;
      margin: 0 32px;

      a {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .active {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .username {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-info-header {
      padding: 16px;
      background: rgba(0, 0, 0, 0.04);
    }

    .mobile-menu-button {
      display: none;
    }

    .mobile-sidenav-container {
      display: none;
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart-menu {
      width: 320px;
      padding: 16px;

      .cart-items {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 16px;

        .cart-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
          }

          img {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 4px;
          }

          .item-details {
            h4 {
              margin: 0 0 4px;
              font-size: 0.9em;
            }

            p {
              margin: 0;
              font-size: 0.8em;
              color: var(--text-color-light);
            }
          }
        }
      }

      .empty-cart {
        text-align: center;
        padding: 24px;
        color: var(--text-color-light);
      }

      .cart-total {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        border-top: 1px solid var(--border-color);
        font-weight: 500;
      }

      .cart-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;

        button {
          flex: 1;
        }
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .practice-name {
        font-size: 1em;
      }

      .username {
        display: none;
      }

      .mobile-menu-button {
        display: block;
      }

      .mobile-sidenav-container {
        display: block;
        position: fixed;
        top: 64px;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Input() practiceInfo!: PracticeInfo;
  @Output() themeChange = new EventEmitter<string>();

  isMobileMenuOpen = false;
  cart: any = { items: [], total: 0 };
  itemCount = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.itemCount = this.cartService.getItemCount();
    });
  }

  changeTheme(theme: string): void {
    this.themeChange.emit(theme);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
} 