using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ColonyMaster.Services.Interfaces;
using ColonyMaster.Settings;
using ColonyMaster.DTOs;

namespace ColonyMaster.Services
{
    /// <summary>
    /// Default implementation for token generation.
    /// </summary>
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _settings;

        public TokenService(JwtSettings settings)
        {
            _settings = settings;
        }

        public AuthResult CreateToken(Microsoft.AspNetCore.Identity.IdentityUser<Guid> user)
        {
            var now = DateTime.UtcNow;
            var expires = now.AddMinutes(_settings.ExpiresInMinutes);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret ?? string.Empty));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResult
            {
                AccessToken = accessToken,
                ExpiresAt = expires
            };
        }
    }
}
