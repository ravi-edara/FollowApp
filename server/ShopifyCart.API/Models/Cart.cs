using System;
using System.Collections.Generic;
using System.Linq;

namespace ShopifyCart.API.Models
{
    public class Cart
    {
        public string Id { get; set; }
        public List<CartItem> Items { get; set; } = new();
        public string CustomerEmail { get; set; }
        public decimal TotalPrice => Items.Sum(item => item.Price * item.Quantity);
    }

    public class CartItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProductId { get; set; }
        public string VariantId { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
    }

    public class CheckoutSession
    {
        public string Id { get; set; }
        public string WebUrl { get; set; }
        public string Status { get; set; }
        public decimal TotalPrice { get; set; }
    }
} 