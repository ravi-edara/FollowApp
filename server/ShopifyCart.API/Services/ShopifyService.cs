using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Configuration;
using ShopifyCart.API.Models;

namespace ShopifyCart.API.Services
{
    public class ShopifyService : IShopifyService
    {
        private readonly HttpClient _httpClient;
        private readonly string _shopifyUrl;
        private readonly string _accessToken;
        private readonly JsonSerializerOptions _jsonOptions;

        public ShopifyService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _shopifyUrl = configuration["Shopify:ApiUrl"];
            _accessToken = configuration["Shopify:AccessToken"];
            
            _httpClient.DefaultRequestHeaders.Add("X-Shopify-Access-Token", _accessToken);
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task<string> CreateCheckoutAsync(Cart cart)
        {
            var checkoutData = new
            {
                checkout = new
                {
                    line_items = cart.Items.Select(item => new
                    {
                        variant_id = item.VariantId,
                        quantity = item.Quantity
                    }),
                    email = cart.CustomerEmail
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(checkoutData, _jsonOptions),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                $"{_shopifyUrl}/checkouts.json",
                content);

            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var checkoutResponse = JsonSerializer.Deserialize<ShopifyCheckoutResponse>(
                responseContent,
                _jsonOptions);

            return checkoutResponse.Checkout.Token;
        }

        public async Task<bool> ValidateProductAvailabilityAsync(string productId, string variantId)
        {
            var response = await _httpClient.GetAsync(
                $"{_shopifyUrl}/products/{productId}/variants/{variantId}.json");

            if (!response.IsSuccessStatusCode)
                return false;

            var content = await response.Content.ReadAsStringAsync();
            var variant = JsonSerializer.Deserialize<ShopifyVariantResponse>(
                content,
                _jsonOptions);

            return variant.Variant.InventoryQuantity > 0;
        }

        public async Task<decimal> GetProductPriceAsync(string productId, string variantId)
        {
            var response = await _httpClient.GetAsync(
                $"{_shopifyUrl}/products/{productId}/variants/{variantId}.json");

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var variant = JsonSerializer.Deserialize<ShopifyVariantResponse>(
                content,
                _jsonOptions);

            return variant.Variant.Price;
        }

        public async Task<CheckoutSession> GetCheckoutSessionAsync(string checkoutId)
        {
            var response = await _httpClient.GetAsync(
                $"{_shopifyUrl}/checkouts/{checkoutId}.json");

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var checkout = JsonSerializer.Deserialize<ShopifyCheckoutResponse>(
                content,
                _jsonOptions);

            return new CheckoutSession
            {
                Id = checkout.Checkout.Token,
                WebUrl = checkout.Checkout.WebUrl,
                Status = checkout.Checkout.Status,
                TotalPrice = checkout.Checkout.TotalPrice
            };
        }
    }

    internal class ShopifyCheckoutResponse
    {
        public ShopifyCheckout Checkout { get; set; }
    }

    internal class ShopifyCheckout
    {
        public string Token { get; set; }
        public string WebUrl { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }

    internal class ShopifyVariantResponse
    {
        public ShopifyVariant Variant { get; set; }
    }

    internal class ShopifyVariant
    {
        public decimal Price { get; set; }
        public int InventoryQuantity { get; set; }
    }
} 