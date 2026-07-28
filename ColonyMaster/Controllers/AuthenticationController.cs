using Microsoft.AspNetCore.Mvc;
using ColonyMaster.DTOs;
using ColonyMaster.Services.Interfaces;

namespace ColonyMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        /// <summary>
        /// Controller for authentication endpoints.
        /// </summary>
        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Authenticate a user and return tokens.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Credentials request)
        {
            var result = await _authService.AuthenticateAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Register a new user.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Credentials request)
        {
            await _authService.RegisterAsync(request);
            return NoContent();
        }


    }
}
