using ColonyMaster.Services.Interfaces;
using ColonyMaster.DTOs;
using ColonyMaster.Entities;
using Microsoft.AspNetCore.Identity;

namespace ColonyMaster.Services
{
    /// <summary>
    /// Authentication service using ASP.NET Identity and JWT generation.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IAppUserManager _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(IAppUserManager userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Register a new user.
        /// </summary>
        public async Task RegisterAsync(Credentials credentials)
        {
            var exists = await _userManager.FindByEmailAsync(credentials.Email);
            if (exists != null) throw new InvalidOperationException("User already exists");

            var user = new ApplicationUser();
            user.SetEmail(credentials.Email);

            var result = await _userManager.CreateAsync(user, credentials.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(';', result.Errors.Select(e => e.Description));
                throw new InvalidOperationException(errors);
            }
        }

        /// <summary>
        /// Authenticate user and issue JWT.
        /// </summary>
        public async Task<AuthResult> AuthenticateAsync(Credentials credentials)
        {
            var user = await _userManager.FindByEmailAsync(credentials.Email);
            if (user == null) throw new UnauthorizedAccessException("Invalid credentials");

            var valid = await _userManager.CheckPasswordAsync(user, credentials.Password);
            if (!valid) throw new UnauthorizedAccessException("Invalid credentials");

            var auth = _tokenService.CreateToken(user);
            return auth;
        }
    }
}


