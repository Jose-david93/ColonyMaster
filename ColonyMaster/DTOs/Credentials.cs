namespace ColonyMaster.DTOs
{
    /// <summary>
    /// Credentials used in authentication requests.
    /// </summary>
    public record Credentials
    {
        /// <summary>
        /// Email used as username.
        /// </summary>
        public string Email { get; init; } = string.Empty;

        /// <summary>
        /// Plaintext password.
        /// </summary>
        public string Password { get; init; } = string.Empty;
    }
}
