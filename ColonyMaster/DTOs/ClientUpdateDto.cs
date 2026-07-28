namespace ColonyMaster.DTOs
{
    /// <summary>
    /// Payload to update a client.
    /// </summary>
    public record ClientUpdateDto
    {
        public Guid Id { get; init; }
        public string ClientName { get; init; } = string.Empty;
        public string? Address { get; init; }
        public string? City { get; init; }
        public string? State { get; init; }
        public string? PostalCode { get; init; }
        public bool IsActive { get; init; }
    }
}
