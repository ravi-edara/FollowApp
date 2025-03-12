# Shopify Store

A modern e-commerce application built with Angular and Shopify's Admin API.

## Features

- Product listing with pagination
- Product details with variants
- Shopping cart functionality
- Checkout integration with Shopify
- Responsive design
- Dark/Light theme support
- Progressive Web App (PWA) support

## Prerequisites

- Node.js (v16 or later)
- Angular CLI (v16 or later)
- Shopify store with Admin API access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update the Shopify configuration with your store's API credentials

## Development

Run the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## Production Build

Build the application for production:
```bash
ng build --configuration production
```

The built files will be in the `dist/client` directory.

## Environment Configuration

### Development
```typescript
{
  production: false,
  apiUrl: 'http://localhost:5000/api',
  shopify: {
    apiUrl: 'https://your-store.myshopify.com/admin/api/2024-01',
    accessToken: 'your_access_token_here',
    storefrontAccessToken: 'your_storefront_token_here'
  }
}
```

### Production
```typescript
{
  production: true,
  apiUrl: '/api',
  shopify: {
    apiUrl: 'https://your-store.myshopify.com/admin/api/2024-01',
    accessToken: 'your_access_token_here',
    storefrontAccessToken: 'your_storefront_token_here'
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── cart/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── product-detail/
│   │   ├── product-list/
│   │   └── theme-switcher/
│   ├── models/
│   ├── services/
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── assets/
├── environments/
├── styles.scss
└── main.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 