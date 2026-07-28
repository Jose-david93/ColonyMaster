using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ColonyMaster.Entities;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Service contract for managing clients.
    /// </summary>
    public interface IClientService
    {
        /// <summary>
        /// Create a new client.
        /// </summary>
        Task<Client> CreateAsync(Client client);

        /// <summary>
        /// Update an existing client.
        /// </summary>
        Task UpdateAsync(Client client);

        /// <summary>
        /// Deactivate (soft delete) a client by id.
        /// </summary>
        Task DeactivateAsync(Guid id);

        /// <summary>
        /// Get a client by id.
        /// </summary>
        Task<Client?> GetByIdAsync(Guid id);

        /// <summary>
        /// Get all clients (optionally include inactive).
        /// </summary>
        Task<IEnumerable<Client>> GetAllAsync(bool includeInactive = false);
    }
}
