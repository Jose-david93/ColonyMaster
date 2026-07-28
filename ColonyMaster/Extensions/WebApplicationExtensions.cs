using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using ColonyMaster.Data;
using Microsoft.EntityFrameworkCore;
using ColonyMaster.Entities;
using Microsoft.AspNetCore.Identity;

namespace ColonyMaster.Extensions
{
    /// <summary>
    /// Extension methods for WebApplication lifecycle tasks.
    /// </summary>
    public static class WebApplicationExtensions
    {
        /// <summary>
        /// Applies pending migrations and runs the database seed.
        /// </summary>
        public static async Task MigrateAndSeedAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            var db = services.GetRequiredService<ApplicationDbContext>();
            await Task.Run(() => db.Database.Migrate());
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            await DbSeed.SeedAsync(userManager);
        }
    }
}
