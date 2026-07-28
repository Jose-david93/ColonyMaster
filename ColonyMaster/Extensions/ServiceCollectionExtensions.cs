using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ColonyMaster.Data;
using ColonyMaster.Entities;
using ColonyMaster.Services;
using ColonyMaster.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ColonyMaster.Extensions
{
    /// <summary>
    /// Extension methods to register application services and infrastructure.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Register persistence services (DbContext).
        /// </summary>
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? configuration["ConnectionStrings:DefaultConnection"];
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured. Set it in appsettings.json or environment variables.");
            }

            services.AddDbContext<ApplicationDbContext>(opts =>
            {
                opts.UseMySQL(connectionString);
            });

            return services;
        }

        /// <summary>
        /// Register Identity, authentication and application security services.
        /// </summary>
        public static IServiceCollection AddIdentityAndAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddJwtAuthentication(configuration);

            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            });

            services.AddScoped<IAppUserManager, ApplicationUserManager>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IInvoiceService, InvoiceService>();
            services.AddScoped<IClientService, ClientService>();
            services.AddScoped<IPrintService, PrintService>();

            return services;
        }

        /// <summary>
        /// Register API documentation, controllers and CORS.
        /// </summary>
        public static IServiceCollection AddApiDocs(this IServiceCollection services)
        {
            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", p => p
                    .WithOrigins("https://colonymaster-production.up.railway.app")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services.AddSwaggerGen();

            return services;
        }

        /// <summary>
        /// Register application services in a single call (keeps backward compatibility).
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddPersistence(configuration);
            services.AddIdentityAndAuth(configuration);
            services.AddApiDocs();

            return services;
        }
    }
}
