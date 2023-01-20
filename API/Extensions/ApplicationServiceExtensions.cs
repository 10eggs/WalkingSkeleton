using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;
using FluentValidation.AspNetCore;
using FluentValidation;
using Infrastructure.Security;
using Application.Interfaces;

namespace API.Extensions
{
  public static class ApplicationServiceExtensions
  {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {

      services.AddEndpointsApiExplorer();
      services.AddSwaggerGen();


      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
      });

      services.AddCors(opt =>
      {
        opt.AddPolicy("CorsPolicy", policy =>
              {
                policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
              });
      });

      services.AddMediatR(typeof(List.Handler).Assembly);

      services.AddAutoMapper(typeof(MappingProfiles).Assembly);

      services.AddFluentValidationAutoValidation();

      services.AddValidatorsFromAssemblyContaining<Create>();

      services.AddHttpContextAccessor();

      services.AddScoped<IUserAccessor,UserAccessor>();

      return services;
    }
  }
}