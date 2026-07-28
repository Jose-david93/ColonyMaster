using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ColonyMaster.Services.Interfaces;
using ColonyMaster.DTOs;
using ColonyMaster.Entities;

namespace ColonyMaster.Controllers
{
    /// <summary>
    /// Controller for managing clients.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        /// <summary>
        /// Create controller with injected client service.
        /// </summary>
        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        private static DTOs.ClientDto ToDto(Client c)
        {
            return new DTOs.ClientDto
            {
                Id = c.Id,
                ClientName = c.ClientName,
                Address = c.Address,
                City = c.City,
                State = c.State,
                PostalCode = c.PostalCode,
                SIN = c.SIN,
                InitialConsecutive = c.InitialConsecutive,
                NextConsecutive = c.NextConsecutive,
                IsActive = c.IsActive
            };
        }

        /// <summary>
        /// Return all clients.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            var list = await _clientService.GetAllAsync(includeInactive);
            var dtos = list.Select(ToDto);
            return Ok(dtos);
        }

        /// <summary>
        /// Return a client by id.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null) return NotFound();
            return Ok(ToDto(client));
        }

        /// <summary>
        /// Create a new client.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClientCreateDto dto)
        {
            if (dto == null) return BadRequest();

            var client = new Client(dto.ClientName)
            {
                // setters are private; use domain methods
            };

            client.UpdateAddress(dto.Address, dto.City, dto.State, dto.PostalCode);
            client.UpdateIdentifiers(dto.SIN);
            client.SetConsecutives(dto.InitialConsecutive, dto.NextConsecutive);

            var created = await _clientService.CreateAsync(client);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
        }

        /// <summary>
        /// Update an existing client.
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ClientUpdateDto dto)
        {
            if (dto == null || dto.Id != id) return BadRequest();

            var existing = await _clientService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            // update domain
            existing.SetName(dto.ClientName);
            existing.UpdateAddress(dto.Address, dto.City, dto.State, dto.PostalCode);
            existing.UpdateIdentifiers(dto.SIN);

            if (dto.IsActive && !existing.IsActive)
            {
                existing.Activate();
            }
            else if (!dto.IsActive && existing.IsActive)
            {
                existing.Deactivate();
            }

            await _clientService.UpdateAsync(existing);
            return NoContent();
        }

        /// <summary>
        /// Deactivate a client (soft delete).
        /// </summary>
        [HttpPost("{id:guid}/deactivate")]
        public async Task<IActionResult> Deactivate([FromRoute] Guid id)
        {
            await _clientService.DeactivateAsync(id);
            return NoContent();
        }
    }
}
