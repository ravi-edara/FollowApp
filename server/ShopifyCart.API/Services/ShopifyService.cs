using System.Text;
using System.Text.Json;
using ShopifyCart.API.Models;
using System.Text.Json.Serialization;
using System.Globalization;

namespace ShopifyCart.API.Services
{
    public class DecimalConverter : JsonConverter<decimal>
    {
        public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                string stringValue = reader.GetString();
                if (decimal.TryParse(stringValue, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal value))
                {
                    return value;
                }
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetDecimal();
            }
            
            throw new JsonException();
        }

        public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(CultureInfo.InvariantCulture));
        }
    }

    public class ShopifyService : IShopifyService
    {
        private readonly HttpClient _httpClient;
        private readonly string _shopifyUrl;
        private readonly string _accessToken;
        private readonly JsonSerializerOptions _jsonOptions;

        public ShopifyService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _shopifyUrl = configuration["Shopify:APIURL"];
            _accessToken = configuration["Shopify:AccessToken"];
            
            _httpClient.DefaultRequestHeaders.Add("X-Shopify-Access-Token", _accessToken);
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters = { new DecimalConverter() }
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

        public async Task<IEnumerable<ShopifyProduct>> GetAllProductsAsync(int? limit = null)
        {
            var url = $"{_shopifyUrl}/products.json";
            if (limit.HasValue)
            {
                url += $"?limit={limit.Value}";
            }

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var productsResponse = JsonSerializer.Deserialize<ShopifyProductsResponse>(
                content,
                _jsonOptions);

            return productsResponse.Products;
        }
    }

    public class ShopifyCheckoutResponse
    {
        public ShopifyCheckout Checkout { get; set; }
    }

    public class ShopifyCheckout
    {
        public string Token { get; set; }
        public string WebUrl { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class ShopifyVariantResponse
    {
        public ShopifyVariant Variant { get; set; }
    }

    public class ShopifyVariant
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        [JsonPropertyName("product_id")]
        public long ProductId { get; set; }
        public string Title { get; set; }
        [JsonPropertyName("price")]
        [JsonConverter(typeof(DecimalConverter))]
        public decimal Price { get; set; }
        public string Sku { get; set; }
        public int Position { get; set; }
        [JsonPropertyName("inventory_policy")]
        public string InventoryPolicy { get; set; }
        [JsonPropertyName("compare_at_price")]
        [JsonConverter(typeof(DecimalConverter))]
        public decimal? CompareAtPrice { get; set; }
        [JsonPropertyName("inventory_quantity")]
        public int InventoryQuantity { get; set; }
        [JsonPropertyName("inventory_management")]
        public string InventoryManagement { get; set; }
    }

    public class ShopifyProductsResponse
    {
        public List<ShopifyProduct> Products { get; set; }
    }

    public class ShopifyProduct
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        [JsonPropertyName("product_type")]
        public string ProductType { get; set; }
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        public string Handle { get; set; }
        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
        [JsonPropertyName("published_at")]
        public DateTime PublishedAt { get; set; }
        [JsonPropertyName("template_suffix")]
        public string TemplateSuffix { get; set; }
        public string Status { get; set; }
        [JsonPropertyName("published_scope")]
        public string PublishedScope { get; set; }
        public string Tags { get; set; }
        public List<ShopifyVariant> Variants { get; set; }
        public List<ShopifyImage> Images { get; set; }
    }

    public class ShopifyImage
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        [JsonPropertyName("product_id")]
        public long ProductId { get; set; }
        public int Position { get; set; }
        public string Src { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Alt { get; set; }
    }
} 