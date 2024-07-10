using AutoMapper;
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

    public DiaryUser? UpdateProfile(UserDto.UserDtoPut userDtoPut)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserName == userDtoPut.UserName);

        user!.Fullname = userDtoPut.FullName;
        user.UserName = userDtoPut.UserName;
        user.Email = userDtoPut.Email;
        user.PhoneNumber = userDtoPut.PhoneNumber;

        _context.Users.Update(user);
        _context.SaveChanges();
        return user;
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

    public DiaryUser? GetUserProfile(string username)
    {
        var user =
            _context.Users
                .FirstOrDefault(u => u.UserName == username);
        return user;
    }
}