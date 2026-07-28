using ColonyMaster.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ColonyMaster.Data
{
    /// <summary>
    /// Database seeder to add initial data using Identity services.
    /// </summary>
    public static class DbSeed
    {
        /// <summary>
        /// Seeds the database if no users exist.
        /// </summary>
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager)
        {
            var any = await userManager.Users.AnyAsync();
            if (any) return;

            var initial = new ApplicationUser();
            initial.SetEmail("admin@colonymaster.local");

            var result = await userManager.CreateAsync(initial, "ChangeMe123!");
            if (result.Succeeded)
            {
                await userManager.AddClaimAsync(initial, new System.Security.Claims.Claim("role", "Administrator"));
            }
        }
    }
}

