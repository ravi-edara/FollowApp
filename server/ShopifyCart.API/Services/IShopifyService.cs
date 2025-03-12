using System.Threading.Tasks;
using ShopifyCart.API.Models;

namespace ShopifyCart.API.Services
{
    public interface IShopifyService
    {
        Task<string> CreateCheckoutAsync(Cart cart);
        Task<bool> ValidateProductAvailabilityAsync(string productId, string variantId);
        Task<decimal> GetProductPriceAsync(string productId, string variantId);
        Task<CheckoutSession> GetCheckoutSessionAsync(string checkoutId);
    }
} 