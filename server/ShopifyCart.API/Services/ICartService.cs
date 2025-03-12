using System.Threading.Tasks;
using ShopifyCart.API.Models;

namespace ShopifyCart.API.Services
{
    public interface ICartService
    {
        Task<Cart> GetCartAsync(string cartId);
        Task<Cart> AddToCartAsync(string cartId, CartItem item);
        Task<Cart> UpdateCartItemAsync(string cartId, string itemId, int quantity);
        Task<Cart> RemoveFromCartAsync(string cartId, string itemId);
        Task<CheckoutSession> CreateCheckoutAsync(string cartId, string customerEmail);
    }
} 