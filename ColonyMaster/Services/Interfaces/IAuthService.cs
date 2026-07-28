using ColonyMaster.DTOs;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Contract for authentication operations.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Authenticate a user and produce tokens.
        /// </summary>
        Task<AuthResult> AuthenticateAsync(Credentials credentials);

        /// <summary>
        /// Refresh an access token using a refresh token.
        /// </summary>
        /// <summary>
        /// Register a new user.
        /// </summary>
        Task RegisterAsync(Credentials credentials);
    }
}
