using System.Text;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Persistance;

namespace API.Extensions
{
  public static class IdentityServiceExtensions
  {
    public static IServiceCollection AddIdentityService(this IServiceCollection services, IConfiguration config)
    {
      services.AddIdentityCore<AppUser>(opt =>
      {
        opt.Password.RequireNonAlphanumeric = false;
        opt.User.RequireUniqueEmail = true;

      })
      .AddEntityFrameworkStores<DataContext>();

      services.AddAuthentication();

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(opt =>
          {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
              ValidateIssuerSigningKey = true,
              IssuerSigningKey = key,
              ValidateIssuer = false,
              ValidateAudience = false
            };
          });
      services.AddScoped<TokenService>();

      return services;
    }
  }
}