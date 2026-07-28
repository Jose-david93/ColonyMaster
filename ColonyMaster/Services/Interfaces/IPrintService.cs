using ColonyMaster.DTOs;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Service responsible for rendering documents (PDF) from DTOs.
    /// </summary>
    public interface IPrintService
    {
        /// <summary>
        /// Render an invoice DTO to PDF bytes.
        /// </summary>
        Task<byte[]> RenderInvoicePdfAsync(InvoiceDto invoice);
    }
}
