using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistance;

namespace Infrastructure.Security
{
  public class IsHostRequirement : IAuthorizationRequirement
  {

  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _dbContext;

    public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
      this._dbContext = dbContext;
      this._httpContextAccessor = httpContextAccessor;

    }
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
      //Get UserId
      var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

      if (userId == null) return Task.CompletedTask;

      //Turn GUID to string
      var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
          .SingleOrDefault(x => x.Key == "id").Value?.ToString());

      var attendee = _dbContext.ActivityAttendees.FindAsync(userId, activityId).Result;

      if (attendee == null) return Task.CompletedTask;

      if (attendee.IsHost) context.Succeed(requirement);

      return Task.CompletedTask;

    }
  }
}