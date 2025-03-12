import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Your trusted source for quality products. We strive to provide the best shopping experience for our customers.</p>
        </div>

        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/cart">Cart</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Shipping Information</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Connect With Us</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <mat-icon>facebook</mat-icon>
            </a>
            <a href="#" class="social-link">
              <mat-icon>twitter</mat-icon>
            </a>
            <a href="#" class="social-link">
              <mat-icon>instagram</mat-icon>
            </a>
            <a href="#" class="social-link">
              <mat-icon>linkedin</mat-icon>
            </a>
          </div>
          <div class="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form class="newsletter-form">
              <mat-form-field>
                <input matInput placeholder="Enter your email">
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Shopify Store. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--surface-color);
      padding: 48px 0 0;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .footer-section {
      h3 {
        margin: 0 0 16px;
        font-size: 1.2em;
        color: var(--text-color);
      }

      p {
        margin: 0;
        color: var(--text-color-light);
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;

          a {
            color: var(--text-color-light);
            text-decoration: none;
            transition: color 0.2s;

            &:hover {
              color: var(--primary-color);
            }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;

      .social-link {
        color: var(--text-color-light);
        transition: color 0.2s;

        &:hover {
          color: var(--primary-color);
        }

        mat-icon {
          font-size: 24px;
        }
      }
    }

    .newsletter {
      h4 {
        margin: 0 0 16px;
        font-size: 1em;
        color: var(--text-color);
      }

      .newsletter-form {
        display: flex;
        gap: 8px;

        mat-form-field {
          flex: 1;
        }

        button {
          white-space: nowrap;
        }
      }
    }

    .footer-bottom {
      margin-top: 48px;
      padding: 24px;
      text-align: center;
      border-top: 1px solid var(--border-color);

      p {
        margin: 0;
        color: var(--text-color-light);
      }
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 