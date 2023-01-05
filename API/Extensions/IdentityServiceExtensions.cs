using Domain;
using Persistance;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>{
                opt.Password.RequireNonAlphanumeric = false;

            })
            .AddEntityFrameworkStores<DataContext>();

            services.AddAuthentication();

            return services;
        }
    }
}