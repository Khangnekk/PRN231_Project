using AutoMapper;
using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;
using Diary_PRN231_Project.Repository;
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
    private readonly IDiaryUserRepository _diaryUserRepository;
    private readonly IMapper _mapper;

    public UserController(UserManager<DiaryUser> userManager, UserDAO userDao, 
        IDiaryUserRepository diaryUserRepository, IMapper mapper)
    {
        _mapper = mapper;
        _userDao = userDao;
        _userManager = userManager;
        _diaryUserRepository = diaryUserRepository;
    }

    [HttpGet("GetProfile")]
    [Authorize]
    public Task<IActionResult> GetUserProfile()
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var user = _diaryUserRepository.Get(username);
        return Task.FromResult<IActionResult>(Ok(user));
    }
    
    [HttpPut("UpdateProfile")]
    [Authorize]
    public Task<IActionResult> UpdateProfile(UserDto.UserDtoPutRequest userDtoPutRequest)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var userDtoPut = _mapper.Map<UserDto.UserDtoPutRequest, UserDto.UserDtoPut>(userDtoPutRequest);
        userDtoPut.UserName = username;
        var userResponse = _diaryUserRepository.Update(userDtoPut);
        return Task.FromResult<IActionResult>(Ok(userResponse));
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