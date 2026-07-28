using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ColonyMaster.Entities;

namespace ColonyMaster.Services.Interfaces
{
    /// <summary>
    /// Abstraction over UserManager to reduce coupling in services.
    /// </summary>
    public interface IAppUserManager
    {
        Task<ApplicationUser?> FindByEmailAsync(string email);
        Task<IdentityResult> CreateAsync(ApplicationUser user, string password);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<ApplicationUser?> FindByIdAsync(Guid id);
    }
}
