using ColonyMaster.Entities;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Service contract for managing invoices.
    /// </summary>
    public interface IInvoiceService
    {
        /// <summary>
        /// Create an invoice in the database.
        /// </summary>
        Task<Invoice> CreateAsync(Invoice invoice);

        /// <summary>
        /// Create an invoice and increment the client's NextConsecutive atomically.
        /// </summary>
        Task<Invoice> CreateWithConsecutiveAsync(Invoice invoice);

        /// <summary>
        /// Update an existing invoice.
        /// </summary>
        Task UpdateAsync(Invoice invoice);

        /// <summary>
        /// Get an invoice by id including related details.
        /// </summary>
        Task<Invoice?> GetByIdAsync(Guid id);

        /// <summary>
        /// Get all invoices.
        /// </summary>
        Task<IEnumerable<Invoice>> GetAllAsync();

        /// <summary>
        /// Get invoices for a specific client.
        /// </summary>
        Task<IEnumerable<Invoice>> GetByClientAsync(Guid clientId);
    }
}
