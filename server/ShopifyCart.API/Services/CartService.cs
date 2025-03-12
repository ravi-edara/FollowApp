using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Linq;
using ShopifyCart.API.Models;
using Microsoft.Extensions.Caching.Memory;

namespace ShopifyCart.API.Services
{
    public class CartService : ICartService
    {
        private readonly IMemoryCache _cache;
        private readonly IShopifyService _shopifyService;
        private static readonly ConcurrentDictionary<string, Cart> _carts = new();

        public CartService(IMemoryCache cache, IShopifyService shopifyService)
        {
            _cache = cache;
            _shopifyService = shopifyService;
        }

        public async Task<Cart> GetCartAsync(string cartId)
        {
            return _carts.GetValueOrDefault(cartId) ?? new Cart { Id = cartId };
        }

        public async Task<Cart> AddToCartAsync(string cartId, CartItem item)
        {
            // Validate product availability
            var isAvailable = await _shopifyService.ValidateProductAvailabilityAsync(
                item.ProductId,
                item.VariantId);

            if (!isAvailable)
                throw new InvalidOperationException("Product is not available");

            // Get current price
            var price = await _shopifyService.GetProductPriceAsync(
                item.ProductId,
                item.VariantId);

            item.Price = price;

            var cart = await GetCartAsync(cartId);
            var existingItem = cart.Items.FirstOrDefault(i => 
                i.ProductId == item.ProductId && 
                i.VariantId == item.VariantId);

            if (existingItem != null)
            {
                existingItem.Quantity += item.Quantity;
            }
            else
            {
                cart.Items.Add(item);
            }

            _carts.AddOrUpdate(cartId, cart, (_, _) => cart);
            return cart;
        }

        public async Task<Cart> UpdateCartItemAsync(string cartId, string itemId, int quantity)
        {
            var cart = await GetCartAsync(cartId);
            var item = cart.Items.FirstOrDefault(i => i.Id == itemId);

            if (item == null)
                throw new InvalidOperationException("Item not found in cart");

            if (quantity <= 0)
            {
                cart.Items.Remove(item);
            }
            else
            {
                // Validate availability for the new quantity
                var isAvailable = await _shopifyService.ValidateProductAvailabilityAsync(
                    item.ProductId,
                    item.VariantId);

                if (!isAvailable)
                    throw new InvalidOperationException("Product is not available in requested quantity");

                item.Quantity = quantity;
            }

            _carts.AddOrUpdate(cartId, cart, (_, _) => cart);
            return cart;
        }

        public async Task<Cart> RemoveFromCartAsync(string cartId, string itemId)
        {
            var cart = await GetCartAsync(cartId);
            var item = cart.Items.FirstOrDefault(i => i.Id == itemId);

            if (item != null)
            {
                cart.Items.Remove(item);
                _carts.AddOrUpdate(cartId, cart, (_, _) => cart);
            }

            return cart;
        }

        public async Task<CheckoutSession> CreateCheckoutAsync(string cartId, string customerEmail)
        {
            var cart = await GetCartAsync(cartId);

            if (!cart.Items.Any())
                throw new InvalidOperationException("Cannot checkout an empty cart");

            cart.CustomerEmail = customerEmail;

            // Create checkout in Shopify
            var checkoutId = await _shopifyService.CreateCheckoutAsync(cart);

            // Get checkout session details
            var session = await _shopifyService.GetCheckoutSessionAsync(checkoutId);

            // Clear the cart after successful checkout creation
            _carts.TryRemove(cartId, out _);

            return session;
        }
    }
} 