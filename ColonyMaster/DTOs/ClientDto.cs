using System;

namespace ColonyMaster.DTOs
{
    /// <summary>
    /// Data transfer object for client details returned by the API.
    /// </summary>
    public record ClientDto
    {
        public Guid Id { get; init; }
        public string ClientName { get; init; } = string.Empty;
        public string? Address { get; init; }
        public string? City { get; init; }
        public string? State { get; init; }
        public string? PostalCode { get; init; }
        public int InitialConsecutive { get; init; }
        public int NextConsecutive { get; init; }
        public bool IsActive { get; init; }
    }
}
