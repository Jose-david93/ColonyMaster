using System;
using Microsoft.AspNetCore.Identity;

namespace ColonyMaster.Entities
{
    /// <summary>
    /// Application user backed by ASP.NET Core Identity.
    /// </summary>
    public class ApplicationUser : IdentityUser<Guid>
    {
        /// <summary>
        /// Creation timestamp in UTC.
        /// </summary>
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        /// <summary>
        /// Parameterless constructor used by EF/Identity.
        /// </summary>
        public ApplicationUser()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Sets the email (and username) for the user.
        /// </summary>
        public void SetEmail(string email)
        {
            Email = email;
            UserName = email;
        }
    }
}
