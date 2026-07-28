using System.ComponentModel.DataAnnotations;

namespace ColonyMaster.Entities
{
    /// <summary>
    /// Client entity.
    /// </summary>
    public class Client
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();

        [Required]
        public string ClientName { get; private set; } = string.Empty;

        public string? Address { get; private set; }

        public string? City { get; private set; }

        public string? State { get; private set; }

        public string? PostalCode { get; private set; }

        public string? SIN { get; private set; }

        public int NextConsecutive { get; private set; }

        public int InitialConsecutive { get; private set; }

        public bool IsActive { get; private set; } = true;

        public ICollection<Invoice> Invoices { get; private set; } = new List<Invoice>();

        /// <summary>
        /// Parameterless constructor for EF.
        /// </summary>
        public Client() { }

        /// <summary>
        /// Create a new client with the given name.
        /// </summary>
        public Client(string clientName)
        {
            Id = Guid.NewGuid();
            ClientName = clientName;
        }

        /// <summary>
        /// Update the client's address fields.
        /// </summary>
        public void UpdateAddress(string? address, string? city, string? state, string? postalCode)
        {
            Address = address;
            City = city;
            State = state;
            PostalCode = postalCode;
        }

        /// <summary>
        /// Update client identifiers such as SIN.
        /// </summary>
        public void UpdateIdentifiers(string? sin)
        {
            SIN = sin;
        }

        /// <summary>
        /// Set or change the client's display name.
        /// </summary>
        public void SetName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Client name cannot be empty", nameof(name));
            ClientName = name;
        }

        /// <summary>
        /// Mark the client as inactive (soft delete).
        /// </summary>
        public void Deactivate()
        {
            IsActive = false;
        }

        /// <summary>
        /// Reactivate the client.
        /// </summary>
        public void Activate()
        {
            IsActive = true;
        }

        /// <summary>
        /// Set the initial and next consecutive numbers for the client.
        /// </summary>
        public void SetConsecutives(int initial, int next)
        {
            InitialConsecutive = initial;
            NextConsecutive = next;
        }

        /// <summary>
        /// Return the current NextConsecutive and increment it for the next use.
        /// </summary>
        public int DequeueNextConsecutive()
        {
            var current = NextConsecutive;
            NextConsecutive = NextConsecutive + 1;
            return current;
        }
    }
}
