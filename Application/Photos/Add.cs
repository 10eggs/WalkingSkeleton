using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Result<Photo>>
    {
      //NOTE! It has to be called File, otherway we need to do some extra configuration in postman
      public IFormFile File { get; set; }
    }


    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
      private readonly DataContext _context;
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;

      public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
      {
        this._userAccessor = userAccessor;
        this._photoAccessor = photoAccessor;
        this._context = context;

      }

      public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
      {
        //Eager loading
        var user = await _context.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

        if (user == null) return null;

        var photoUploadResults = await _photoAccessor.AddPhoto(request.File);

        var photo = new Photo
        {
          Url = photoUploadResults.Url,
          Id = photoUploadResults.PublicId
        };

        if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

        user.Photos.Add(photo);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Result<Photo>.Success(photo);

        return Result<Photo>.Failure("Problem with adding photo");

      }
    }
  }


}