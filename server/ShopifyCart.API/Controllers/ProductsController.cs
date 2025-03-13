using Microsoft.AspNetCore.Mvc;
using ShopifyCart.API.Services;

namespace ShopifyCart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IShopifyService _shopifyService;

        public ProductsController(IShopifyService shopifyService)
        {
            _shopifyService = shopifyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int? limit)
        {
            var products = await _shopifyService.GetAllProductsAsync(limit);
            return Ok(products);
        }
    }
} 