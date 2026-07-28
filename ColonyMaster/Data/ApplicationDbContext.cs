using Microsoft.EntityFrameworkCore;
using ColonyMaster.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ColonyMaster.Data
{
    /// <summary>
    /// Entity Framework database context for the application using Identity.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        /// <summary>
        /// Constructor used by DI.
        /// </summary>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Users DbSet for queries.
        /// </summary>
        public DbSet<ApplicationUser> AppUsers { get; set; } = null!;

        public DbSet<Client> Clients { get; set; } = null!;

        public DbSet<Invoice> Invoices { get; set; } = null!;

        public DbSet<InvoiceDetail> InvoiceDetails { get; set; } = null!;
    }
}
