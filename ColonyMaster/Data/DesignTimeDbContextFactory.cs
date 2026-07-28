using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ColonyMaster.Data
{
    /// <summary>
    /// Design-time factory for EF Core tools to create ApplicationDbContext.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();
            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddEnvironmentVariables();

            var config = builder.Build();
            var conn = config.GetConnectionString("DefaultConnection");
            var options = new DbContextOptionsBuilder<ApplicationDbContext>();
            if (string.IsNullOrWhiteSpace(conn))
            {
                throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            }

            options.UseMySQL(conn);
            return new ApplicationDbContext(options.Options);
        }
    }
}
