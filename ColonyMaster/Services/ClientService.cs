using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ColonyMaster.Data;
using ColonyMaster.Entities;
using ColonyMaster.Services.Interfaces;

namespace ColonyMaster.Services
{
    /// <summary>
    /// Client service implementation using EF Core.
    /// </summary>
    public class ClientService : IClientService
    {
        private readonly ApplicationDbContext _db;

        public ClientService(ApplicationDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Create a new client.
        /// </summary>
        public async Task<Client> CreateAsync(Client client)
        {
            if (client == null) throw new ArgumentNullException(nameof(client));
            _db.Clients.Add(client);
            await _db.SaveChangesAsync();
            return client;
        }

        /// <summary>
        /// Update an existing client.
        /// </summary>
        public async Task UpdateAsync(Client client)
        {
            if (client == null) throw new ArgumentNullException(nameof(client));
            _db.Clients.Update(client);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Deactivate (soft delete) a client by id.
        /// </summary>
        public async Task DeactivateAsync(Guid id)
        {
            var client = await _db.Clients.FindAsync(id);
            if (client == null) return;
            client.Deactivate();
            _db.Clients.Update(client);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Get a client by id.
        /// </summary>
        public async Task<Client?> GetByIdAsync(Guid id)
        {
            return await _db.Clients
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        /// <summary>
        /// Get all clients, optionally including inactive ones.
        /// </summary>
        public async Task<IEnumerable<Client>> GetAllAsync(bool includeInactive = false)
        {
            if (includeInactive)
                return await _db.Clients.ToListAsync();

            return await _db.Clients.Where(c => c.IsActive).ToListAsync();
        }
    }
}
