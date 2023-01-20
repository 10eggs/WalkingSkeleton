using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistance;

namespace Application.Activities
{
  public class List
  {
    public class Query : IRequest<Result<List<ActivityDto>>>
    {

    }


    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
    {
      private readonly DataContext _context;
      private readonly ILogger<List> _logger;
      private readonly IMapper _mapper;
      public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
      {
        this._mapper = mapper;
        this._logger = logger;
        _context = context;
      }

      public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var activities = await _context.Activities
          .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);

        // not needed anymore as we are using projection
        // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

        return Result<List<ActivityDto>>.Success(activities);
      }
    }
  }
}