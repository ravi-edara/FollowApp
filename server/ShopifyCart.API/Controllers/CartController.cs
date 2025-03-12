using System;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ShopifyCart.API.Models;
using ShopifyCart.API.Services;

namespace ShopifyCart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{cartId}")]
        public async Task<ActionResult<Cart>> GetCart(string cartId)
        {
            var cart = await _cartService.GetCartAsync(cartId);
            return Ok(cart);
        }

        [HttpPost("{cartId}/items")]
        public async Task<ActionResult<Cart>> AddToCart(string cartId, [FromBody] CartItem item)
        {
            try
            {
                var cart = await _cartService.AddToCartAsync(cartId, item);
                return Ok(cart);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{cartId}/items/{itemId}")]
        public async Task<ActionResult<Cart>> UpdateCartItem(
            string cartId,
            string itemId,
            [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var cart = await _cartService.UpdateCartItemAsync(cartId, itemId, request.Quantity);
                return Ok(cart);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{cartId}/items/{itemId}")]
        public async Task<ActionResult<Cart>> RemoveFromCart(string cartId, string itemId)
        {
            var cart = await _cartService.RemoveFromCartAsync(cartId, itemId);
            return Ok(cart);
        }

        [HttpPost("{cartId}/checkout")]
        public async Task<ActionResult<CheckoutSession>> CreateCheckout(
            string cartId,
            [FromBody] CreateCheckoutRequest request)
        {
            try
            {
                var session = await _cartService.CreateCheckoutAsync(cartId, request.CustomerEmail);
                return Ok(session);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }

    public class CreateCheckoutRequest
    {
        public string CustomerEmail { get; set; }
    }
} 