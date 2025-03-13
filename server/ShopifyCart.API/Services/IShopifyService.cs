using System.Threading.Tasks;
using ShopifyCart.API.Models;
using System.Collections.Generic;

namespace ShopifyCart.API.Services
{
    public interface IShopifyService
    {
        Task<string> CreateCheckoutAsync(Cart cart);
        Task<bool> ValidateProductAvailabilityAsync(string productId, string variantId);
        Task<decimal> GetProductPriceAsync(string productId, string variantId);
        Task<CheckoutSession> GetCheckoutSessionAsync(string checkoutId);
        Task<IEnumerable<ShopifyProduct>> GetAllProductsAsync(int? limit = null);
    }
} 