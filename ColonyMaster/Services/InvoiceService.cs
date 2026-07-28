using Microsoft.EntityFrameworkCore;
using ColonyMaster.Data;
using ColonyMaster.Entities;
using ColonyMaster.Services.Interfaces;

namespace ColonyMaster.Services
{
    /// <summary>
    /// Invoice service implementation using EF Core.
    /// </summary>
    public class InvoiceService : IInvoiceService
    {
        private readonly ApplicationDbContext _db;

        public InvoiceService(ApplicationDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Create an invoice in the database.
        /// </summary>
        public async Task<Invoice> CreateAsync(Invoice invoice)
        {
            if (invoice == null) throw new ArgumentNullException(nameof(invoice));
            _db.Invoices.Add(invoice);
            await _db.SaveChangesAsync();
            return invoice;
        }

        /// <summary>
        /// Create an invoice using the client's next consecutive number and persist both
        /// invoice and updated client state atomically.
        /// </summary>
        public async Task<Invoice> CreateWithConsecutiveAsync(Invoice invoice)
        {
            if (invoice == null) throw new ArgumentNullException(nameof(invoice));
            using var tx = await _db.Database.BeginTransactionAsync();

            var client = await _db.Clients.FirstOrDefaultAsync(c => c.Id == invoice.ClientId);
            if (client == null) throw new InvalidOperationException("Client not found");

            var consecutive = client.DequeueNextConsecutive();
            invoice.SetConsecutiveNumber(consecutive.ToString());
            _db.Clients.Update(client);

            _db.Invoices.Add(invoice);
            _db.Clients.Update(client);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return invoice;
        }

        /// <summary>
        /// Update an existing invoice.
        /// </summary>
        public async Task UpdateAsync(Invoice invoice)
        {
            if (invoice == null) throw new ArgumentNullException(nameof(invoice));
            _db.Invoices.Update(invoice);
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Get an invoice by id including details and client.
        /// </summary>
        public async Task<Invoice?> GetByIdAsync(Guid id)
        {
            return await _db.Invoices
                .Include(i => i.Details)
                .Include(i => i.Client)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        /// <summary>
        /// Return all invoices including details and client information.
        /// </summary>
        public async Task<IEnumerable<Invoice>> GetAllAsync()
        {
            return await _db.Invoices
                .Include(i => i.Details)
                .Include(i => i.Client)
                .ToListAsync();
        }

        /// <summary>
        /// Return invoices for a specific client.
        /// </summary>
        public async Task<IEnumerable<Invoice>> GetByClientAsync(Guid clientId)
        {
            return await _db.Invoices
                .Where(i => i.ClientId == clientId)
                .Include(i => i.Details)
                .Include(i => i.Client)
                .ToListAsync();
        }
    }
}
