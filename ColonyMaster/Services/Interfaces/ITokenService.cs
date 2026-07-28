using System;
using ColonyMaster.DTOs;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Token service responsible for generating JWTs and related tokens.
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Create a JWT access token for the given user and return the result.
        /// </summary>
        AuthResult CreateToken(Microsoft.AspNetCore.Identity.IdentityUser<Guid> user);
    }
}
