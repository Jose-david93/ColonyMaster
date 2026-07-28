using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ColonyMaster.Services.Interfaces;

namespace ColonyMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PrintController : ControllerBase
    {
        private readonly IPrintService _printService;
        private readonly IInvoiceService _invoiceService;

        public PrintController(IPrintService printService, IInvoiceService invoiceService)
        {
            _printService = printService;
            _invoiceService = invoiceService;
        }

        /// <summary>
        /// Return invoice PDF bytes for the specified id.
        /// </summary>
        [HttpGet("invoice/{id:guid}")]
        public async Task<IActionResult> GetInvoicePdf([FromRoute] Guid id)
        {
            var inv = await _invoiceService.GetByIdAsync(id);
            if (inv == null) return NotFound();

            // Map to DTO used by print service
            var dto = new DTOs.InvoiceDto
            {
                Id = inv.Id,
                Date = inv.Date,
                ClientId = inv.ClientId,
                ClientName = inv.Client?.ClientName,
                ConsecutiveNumber = inv.ConsecutiveNumber,
                FromName = inv.FromName,
                FromAddress = inv.FromAddress,
                FromCity = inv.FromCity,
                FromState = inv.FromState,
                FromPostalCode = inv.FromPostalCode,
                SoldName = inv.SoldName,
                SoldAddress = inv.SoldAddress,
                SoldCity = inv.SoldCity,
                SoldState = inv.SoldState,
                SoldPostalCode = inv.SoldPostalCode,
                PaymentMethod = inv.PaymentMethod,
                Total = inv.Total,
                Taxes = inv.Taxes,
                AmountPaid = inv.AmountPaid,
                Notes = inv.Notes,
                Details = inv.Details?.Select(d => new DTOs.InvoiceDetailDto
                {
                    Id = d.Id,
                    Description = d.Description,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice
                }).ToList()
            };

            var pdf = await _printService.RenderInvoicePdfAsync(dto);
            return File(pdf, "application/pdf", $"invoice-{id}.pdf");
        }
    }
}
