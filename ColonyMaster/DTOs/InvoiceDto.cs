namespace ColonyMaster.DTOs
{
    public record InvoiceDto
    {
        public Guid Id { get; init; }
        public DateTime Date { get; init; }
        public Guid ClientId { get; init; }
        public string? ClientName { get; init; }
        public string ConsecutiveNumber { get; init; } = string.Empty;

        public string? FromName { get; init; }
        public string? FromAddress { get; init; }
        public string? FromCity { get; init; }
        public string? FromState { get; init; }
        public string? FromPostalCode { get; init; }
        public string? FromSIN { get; init; }

        public string? SoldName { get; init; }
        public string? SoldAddress { get; init; }
        public string? SoldCity { get; init; }
        public string? SoldState { get; init; }
        public string? SoldPostalCode { get; init; }
        public string? SoldSIN { get; init; }

        public string? PaymentMethod { get; init; }
        public decimal Total { get; init; }
        public decimal Taxes { get; init; }
        public decimal AmountPaid { get; init; }
        public string? Notes { get; init; }

        public IEnumerable<InvoiceDetailDto>? Details { get; init; }
    }
}
