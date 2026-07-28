namespace ColonyMaster.DTOs
{
    /// <summary>
    /// Result returned after successful authentication.
    /// </summary>
    public record AuthResult
    {
        /// <summary>
        /// JWT access token.
        /// </summary>
        public string AccessToken { get; init; } = string.Empty;

        /// <summary>
        /// Expiration time in UTC.
        /// </summary>
        public DateTime ExpiresAt { get; init; }
    }
}
