# Dental Practice E-commerce PWA

A Progressive Web Application built with Angular and .NET 8 for dental practice e-commerce integration with Shopify.

## Features

- Progressive Web App capabilities
- Angular Material Design UI components
- Responsive design for all devices
- Multiple theme support
- Shopify integration
- Secure payment processing
- WCAG compliant accessibility
- Offline capabilities

## Prerequisites

- Node.js (v18 or later)
- .NET 8 SDK
- Angular CLI (latest version)
- A Shopify account with API credentials
- SSL certificate for HTTPS (required for PWA)

## Project Structure

```
dental-pwa/
├── client/              # Angular frontend application
│   ├── src/
│   └── ...
├── server/              # .NET 8 backend application
│   ├── src/
│   └── ...
└── docs/               # Documentation
```

## Getting Started

1. Clone the repository
2. Set up the frontend:
   ```bash
   cd client
   npm install
   ng serve
   ```
3. Set up the backend:
   ```bash
   cd server
   dotnet restore
   dotnet run
   ```

## Environment Setup

Create the following environment files:

1. `client/src/environments/environment.ts`
2. `server/appsettings.json`

Add the necessary API keys and configuration values.

## Available Scripts

### Frontend
- `ng serve` - Run development server
- `ng build` - Build production version
- `ng test` - Run unit tests
- `ng e2e` - Run end-to-end tests

### Backend
- `dotnet run` - Run the API server
- `dotnet test` - Run unit tests
- `dotnet build` - Build the project

## Deployment

The application can be deployed to any hosting service that supports:
- Static file hosting (for Angular frontend)
- .NET 8 runtime (for backend API)

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Shopify Configuration

"Shopify": {
  "ApiUrl": "https://your-store.myshopify.com/admin/api/2024-01",
  "AccessToken": "your_access_token_here",
  "StorefrontAccessToken": "your_storefront_token_here"
} 