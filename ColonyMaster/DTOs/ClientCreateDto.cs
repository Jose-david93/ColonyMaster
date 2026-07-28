namespace ColonyMaster.DTOs
{
    /// <summary>
    /// Payload to create a client.
    /// </summary>
    public record ClientCreateDto
    {
        public string ClientName { get; init; } = string.Empty;
        public string? Address { get; init; }
        public string? City { get; init; }
        public string? State { get; init; }
        public string? PostalCode { get; init; }
        public int InitialConsecutive { get; init; }
        public int NextConsecutive { get; init; }
    }
}
