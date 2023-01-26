using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

      //AsNoTracking stops EF with tracking this entity. It has to be done as we are not getting related
      //objects in EditClass - it cause an issue where Attendees and HostUserName are cleaned up (we won't to avoid it)  
      var attendee = _dbContext.ActivityAttendees
        .AsNoTracking()
        .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result;

      if (attendee == null) return Task.CompletedTask;

      if (attendee.IsHost) context.Succeed(requirement);

      return Task.CompletedTask;

    }
  }
}