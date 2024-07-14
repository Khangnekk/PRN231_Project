using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diary_PRN231_Project.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PostController : Controller
{
    private readonly IPostRepository _postRepository;
    private readonly PostDAO _postDao;
    public PostController(IPostRepository postRepository, PostDAO postDao)
    {
        _postDao = postDao;
        _postRepository = postRepository;
    }

    [HttpPost("CreatePost")]
    [Authorize]
    public Task<IActionResult> CreatePost([FromForm] PostDto.PostCreateRequest model, [FromForm] IFormFile? image)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var post = _postRepository.Insert(new PostDto.PostDtoCreateRequest()
        {
            Title = model.Title,
            Content = model.Content,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            IsPublic = model.IsPublic,
            UserId = username,
        }, image);
        return Task.FromResult<IActionResult>(Ok(post));
    }

    [HttpPut("UpdatePost")]
    [Authorize]
    public Task<IActionResult> UpdatePost([FromBody] PostDto.PostDtoPut postDtoPut)
    {
        var post = _postRepository.Update(postDtoPut);
        return Task.FromResult<IActionResult>(Ok(post));
    }

    [HttpDelete("DeletePost/{id}")]
    [Authorize]
    public Task<IActionResult> DeletePost(int id)
    {
        var post = _postRepository.Delete(id);
        return Task.FromResult<IActionResult>(Ok(post));
    }

    [HttpGet("{id}")]
    [Authorize]
    public Task<IActionResult> Post(int id)
    {
        var post = _postRepository.PostById(id);
        return Task.FromResult<IActionResult>(Ok(post));
    }

    [HttpGet("Posts")]
    [Authorize]
    public Task<IActionResult> Post(string username)
    {
        var posts = _postRepository.PostsByUserName(username);
        return Task.FromResult<IActionResult>(Ok(posts));
    }

    [HttpGet("MyPosts")]
    [Authorize]
    public Task<IActionResult> Post()
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var posts = _postRepository.MyPosts(username);
        return Task.FromResult<IActionResult>(Ok(posts));
    }

    [HttpGet("AllPublicPost")]
    public Task<IActionResult> PublicPost()
    {
        var posts = _postRepository.Posts();
        return Task.FromResult<IActionResult>(Ok(posts));
    }
    
    [HttpGet("GetImage/{id}")]
    public IActionResult GetImage(int id)
    {
        var post = _postDao.Get(id);
        if (post?.PostImage != null)
        {
            return File(post.PostImage, "image/jpeg");
        }
        return NotFound();
    }
}