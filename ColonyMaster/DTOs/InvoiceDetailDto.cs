namespace ColonyMaster.DTOs
{
    public record InvoiceDetailDto
    {
        public Guid Id { get; init; }
        public string? Description { get; init; }
        public decimal Quantity { get; init; }
        public decimal UnitPrice { get; init; }
    }
}
