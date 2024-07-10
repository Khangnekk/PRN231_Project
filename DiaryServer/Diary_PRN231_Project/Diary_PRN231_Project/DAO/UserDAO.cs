using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.DAO;

public class UserDAO
{
    private readonly DiaryDbContext _context;

    public UserDAO(DiaryDbContext context)
    {
        _context = context;
    }

    public bool? UpdateProfile(string username, UserDto.UserDtoPut userDtoPut, out string message)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserName == username);
        if (user == null)
        {
            message = "User not found";
            return null;
        }

        user.Fullname = userDtoPut.Fullname;

        _context.Users.Update(user);
        _context.SaveChanges();
        message = "Profile update successfully";
        return true;
    }
    
    public bool? UpdateAvatar(IFormFile? formFile, string username, out string message)
    {
        if (formFile != null && formFile.Length > 0)
        {
            using var memoryStream = new MemoryStream();
            formFile.CopyTo(memoryStream);
            var imageByteArray = memoryStream.ToArray();
            if (memoryStream.Length < 2097152)
            {
                var updateAvatarUser = _context.Users.FirstOrDefault(u => u.UserName == username);
                if (updateAvatarUser == null)
                {
                    message = "User not found";
                    return false;
                } 
                updateAvatarUser.Avatar = imageByteArray;
                _context.SaveChanges();
                message = "Avatar updated successfully.";
                return true;
            }
            message = "The file is too large to be uploaded.";
            return false;
        }
        message = "FormFile is null or empty.";
        return false;
    }

    public string GetUsernameByUserId(string userId)
    {
        var user =
            _context.Users
            .FirstOrDefault(u => u.Id == userId);
        var username = user.UserName;
        return username;
    }
}