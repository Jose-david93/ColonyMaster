using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ColonyMaster.Entities
{
    /// <summary>
    /// Invoice entity.
    /// </summary>
    public class Invoice
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();

        [Required]
        public DateTime Date { get; private set; }

        [Required]
        public Guid ClientId { get; private set; }

        // Navigation property kept private to avoid cycles; controller maps to DTOs.
        [ForeignKey(nameof(ClientId))]
        public Client? Client { get; private set; }

        [Required]
        public string ConsecutiveNumber { get; private set; } = string.Empty;

        public string? FromName { get; private set; }
        public string? FromAddress { get; private set; }
        public string? FromCity { get; private set; }
        public string? FromState { get; private set; }
        public string? FromPostalCode { get; private set; }
        public string? FromSIN { get; private set; }

        public string? SoldName { get; private set; }
        public string? SoldAddress { get; private set; }
        public string? SoldCity { get; private set; }
        public string? SoldState { get; private set; }
        public string? SoldPostalCode { get; private set; }
        public string? SoldSIN { get; private set; }

        public string? PaymentMethod { get; private set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; private set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Taxes { get; private set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; private set; }

        public string? Notes { get; private set; }

        public ICollection<InvoiceDetail> Details { get; private set; } = new List<InvoiceDetail>();

        /// <summary>
        /// Parameterless constructor for EF.
        /// </summary>
        public Invoice() { }

        /// <summary>
        /// Create a new invoice instance for the specified client and date.
        /// The consecutive number may be assigned later by business logic.
        /// </summary>
        public Invoice(Guid clientId, DateTime date, string consecutiveNumber)
        {
            Id = Guid.NewGuid();
            ClientId = clientId;
            Date = date;
            ConsecutiveNumber = consecutiveNumber;
        }

        /// <summary>
        /// Set the sender information for the invoice.
        /// </summary>
        public void SetFromInfo(string? name, string? address, string? city, string? state, string? postalCode, string? sin)
        {
            FromName = name;
            FromAddress = address;
            FromCity = city;
            FromState = state;
            FromPostalCode = postalCode;
            FromSIN = sin;
        }

        /// <summary>
        /// Set the buyer information for the invoice.
        /// </summary>
        public void SetSoldInfo(string? name, string? address, string? city, string? state, string? postalCode, string? sin)
        {
            SoldName = name;
            SoldAddress = address;
            SoldCity = city;
            SoldState = state;
            SoldPostalCode = postalCode;
            SoldSIN = sin;
        }

        /// <summary>
        /// Set payment related values for the invoice.
        /// </summary>
        public void SetPayment(decimal total, decimal taxes, decimal amountPaid, string? paymentMethod, string? notes)
        {
            Total = total;
            Taxes = taxes;
            AmountPaid = amountPaid;
            PaymentMethod = paymentMethod;
            Notes = notes;
        }

        /// <summary>
        /// Add a detail line to the invoice.
        /// </summary>
        public void AddDetail(InvoiceDetail detail)
        {
            if (detail == null) throw new ArgumentNullException(nameof(detail));
            Details.Add(detail);
        }

        /// <summary>
        /// Set the invoice date.
        /// </summary>
        public void SetDate(DateTime date)
        {
            Date = date;
        }

        /// <summary>
        /// Set the invoice consecutive number.
        /// </summary>
        public void SetConsecutiveNumber(string consecutive)
        {
            ConsecutiveNumber = consecutive;
        }

        /// <summary>
        /// Update many aspects of the invoice in a single operation.
        /// This method updates scalar properties and synchronizes the details collection
        /// by adding new lines, updating existing ones and removing absent ones.
        /// </summary>
        public void UpdateInvoice(DateTime date,
            string? fromName, string? fromAddress, string? fromCity, string? fromState, string? fromPostalCode, string? fromSin,
            string? soldName, string? soldAddress, string? soldCity, string? soldState, string? soldPostalCode, string? soldSin,
            string? paymentMethod, decimal total, decimal taxes, decimal amountPaid, string? notes,
            IEnumerable<InvoiceDetail> newDetails)
        {
            SetDate(date);
            SetFromInfo(fromName, fromAddress, fromCity, fromState, fromPostalCode, fromSin);
            SetSoldInfo(soldName, soldAddress, soldCity, soldState, soldPostalCode, soldSin);
            SetPayment(total, taxes, amountPaid, paymentMethod, notes);

            var incoming = newDetails?.ToList() ?? new List<InvoiceDetail>();
            foreach (var d in incoming)
            {
                if (d.Id == Guid.Empty)
                {
                    var det = new InvoiceDetail(this.Id, d.Description, d.Quantity, d.UnitPrice);
                    AddDetail(det);
                }
                else
                {
                    var found = Details.FirstOrDefault(x => x.Id == d.Id);
                    if (found != null)
                    {
                        found.Update(d.Description, d.Quantity, d.UnitPrice);
                    }
                    else
                    {
                        var det = new InvoiceDetail(d.Id, this.Id, d.Description, d.Quantity, d.UnitPrice);
                        AddDetail(det);
                    }
                }
            }


            var incomingIds = incoming.Where(x => x.Id != Guid.Empty).Select(x => x.Id).ToHashSet();
            var toRemove = Details.Where(x => x.Id != Guid.Empty && !incomingIds.Contains(x.Id)).ToList();
            foreach (var r in toRemove)
            {
                Details.Remove(r);
            }
        }
    }
}
