using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Persistance;
using Persistence;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

//Add services and containers

builder.Services.AddControllers(opt =>
{
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  opt.Filters.Add(new AuthorizeFilter(policy));


});

builder.Services.AddHttpContextAccessor();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

//Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

// app.UseHttpsRedirection();
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
  var context = services.GetRequiredService<DataContext>();
  var userManager = services.GetRequiredService<UserManager<AppUser>>();
  await context.Database.MigrateAsync();
  await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex, "An error occured during migration");
}

app.Run();