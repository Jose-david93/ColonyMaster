using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using ColonyMaster.Services.Interfaces;
using ColonyMaster.DTOs;
using ColonyMaster.Entities;

namespace ColonyMaster.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        /// <summary>
        /// Return all invoices.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _invoiceService.GetAllAsync();
            var dtos = list.Select(i => ToDto(i));
            return Ok(dtos);
        }

        /// <summary>
        /// Return a specific invoice by id.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var inv = await _invoiceService.GetByIdAsync(id);
            if (inv == null) return NotFound();
            return Ok(ToDto(inv));
        }

        /// <summary>
        /// Return invoices for a specific client identifier.
        /// </summary>
        [HttpGet("by-client/{clientId:guid}")]
        public async Task<IActionResult> GetByClient([FromRoute] Guid clientId)
        {
            var list = await _invoiceService.GetByClientAsync(clientId);
            var dtos = list.Select(i => ToDto(i));
            return Ok(dtos);
        }

        /// <summary>
        /// Create a new invoice. Client must provide all fields except Id and ConsecutiveNumber.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] InvoiceCreateDto dto)
        {
            if (dto == null) return BadRequest();
            var invoice = new Invoice(dto.ClientId, dto.Date, string.Empty);

            var details = dto.Details?.Select(d =>
            {
                if (d.Id == Guid.Empty)
                    return new InvoiceDetail(invoice.Id, d.Description, d.Quantity, d.UnitPrice);
                return new InvoiceDetail(d.Id, invoice.Id, d.Description, d.Quantity, d.UnitPrice);
            }).ToList() ?? new List<InvoiceDetail>();

            invoice.UpdateInvoice(dto.Date,
                dto.FromName, dto.FromAddress, dto.FromCity, dto.FromState, dto.FromPostalCode, dto.FromSIN,
                dto.SoldName, dto.SoldAddress, dto.SoldCity, dto.SoldState, dto.SoldPostalCode, dto.SoldSIN,
                dto.PaymentMethod, dto.Total, dto.Taxes, dto.AmountPaid, dto.Notes,
                details);

            var created = await _invoiceService.CreateWithConsecutiveAsync(invoice);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
        }

        /// <summary>
        /// Update an existing invoice by id. The payload should contain the desired final state.
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] InvoiceUpdateDto dto)
        {
            if (dto == null || dto.Id != id) return BadRequest();

            var existing = await _invoiceService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var incomingDetails = dto.Details?.Select(d =>
            {
                if (d.Id == Guid.Empty)
                    return new InvoiceDetail(existing.Id, d.Description, d.Quantity, d.UnitPrice);
                return new InvoiceDetail(d.Id, existing.Id, d.Description, d.Quantity, d.UnitPrice);
            }).ToList() ?? new List<InvoiceDetail>();

            existing.UpdateInvoice(dto.Date,
                dto.FromName, dto.FromAddress, dto.FromCity, dto.FromState, dto.FromPostalCode, dto.FromSIN,
                dto.SoldName, dto.SoldAddress, dto.SoldCity, dto.SoldState, dto.SoldPostalCode, dto.SoldSIN,
                dto.PaymentMethod, dto.Total, dto.Taxes, dto.AmountPaid, dto.Notes,
                incomingDetails);

            await _invoiceService.UpdateAsync(existing);
            return NoContent();
        }

        private static InvoiceDto ToDto(Invoice i)
        {
            return new InvoiceDto
            {
                Id = i.Id,
                Date = i.Date,
                ClientId = i.ClientId,
                ClientName = i.Client?.ClientName,
                ConsecutiveNumber = i.ConsecutiveNumber,
                FromName = i.FromName,
                FromAddress = i.FromAddress,
                FromCity = i.FromCity,
                FromState = i.FromState,
                FromPostalCode = i.FromPostalCode,
                FromSIN = i.FromSIN,
                SoldName = i.SoldName,
                SoldAddress = i.SoldAddress,
                SoldCity = i.SoldCity,
                SoldState = i.SoldState,
                SoldPostalCode = i.SoldPostalCode,
                SoldSIN = i.SoldSIN,
                PaymentMethod = i.PaymentMethod,
                Total = i.Total,
                Taxes = i.Taxes,
                AmountPaid = i.AmountPaid,
                Notes = i.Notes,
                Details = i.Details?.Select(d => new InvoiceDetailDto
                {
                    Id = d.Id,
                    Description = d.Description,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice
                }).ToList()
            };
        }

    }
}
