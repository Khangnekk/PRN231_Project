using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Diary_PRN231_Project.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : Controller
{
    private readonly UserManager<DiaryUser> _userManager;
    private readonly UserDAO _userDao;

    public UserController(UserManager<DiaryUser> userManager, UserDAO userDao)
    {
        _userDao = userDao;
        _userManager = userManager;
    }

    [HttpPut("UpdateProfile")]
    [Authorize]
    public Task<IActionResult> UpdateProfile(UserDto.UserDtoPut userDtoPut)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var isSuccess = _userDao.UpdateProfile(username, userDtoPut, out var message);
        return isSuccess == true 
            ? Task.FromResult<IActionResult>(Ok(message)) 
            : Task.FromResult<IActionResult>(BadRequest(message));
    }

    [HttpPut("UpdateAvatar")]
    [Authorize]
    public Task<IActionResult> UpdateAvatar(IFormFile avatar)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var isSuccess = _userDao.UpdateAvatar(avatar, username, out var message);
        return isSuccess == true 
            ? Task.FromResult<IActionResult>(Ok(message)) 
            : Task.FromResult<IActionResult>(BadRequest(message));
    }
    
    [HttpGet("GetAvatar/{username}")]
    public IActionResult GetAvatar(string username)
    {
        var user = _userManager.FindByNameAsync(username).Result;
        if (user?.Avatar != null)
        {
            return File(user.Avatar, "image/jpeg");
        }
        return NotFound();
    }

    [HttpGet("GetFullname/{username}")]
    public IActionResult GetFullname(string username)
    {
        var user = _userManager.FindByNameAsync(username).Result;
        return Ok(user.Fullname);
    }
}