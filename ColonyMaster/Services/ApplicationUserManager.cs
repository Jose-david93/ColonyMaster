using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ColonyMaster.Entities;
using ColonyMaster.Services.Interfaces;

namespace ColonyMaster.Services
{
    /// <summary>
    /// Wrapper around UserManager to provide a smaller, testable surface.
    /// </summary>
    public class ApplicationUserManager : IAppUserManager
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ApplicationUserManager(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public Task<ApplicationUser?> FindByEmailAsync(string email) => _userManager.FindByEmailAsync(email);

        public Task<IdentityResult> CreateAsync(ApplicationUser user, string password) => _userManager.CreateAsync(user, password);

        public Task<bool> CheckPasswordAsync(ApplicationUser user, string password) => _userManager.CheckPasswordAsync(user, password);

        public Task<ApplicationUser?> FindByIdAsync(Guid id) => _userManager.FindByIdAsync(id.ToString());
    }
}
