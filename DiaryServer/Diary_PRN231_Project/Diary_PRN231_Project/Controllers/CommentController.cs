using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diary_PRN231_Project.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentController : Controller
{
    private readonly ICommentRepository _commentRepository;
    private readonly PostDAO _postDao;

    public CommentController(ICommentRepository commentRepository, PostDAO postDao)
    {
        _postDao = postDao;
        _commentRepository = commentRepository;
    }

    [HttpGet("PublicPost/ByPostId/{id}")]
    public Task<IActionResult> CommentsInPublicPostByPostId(int id)
    {
        var comments = _commentRepository.CommentsPublicPostByPostId(id);
        return Task.FromResult<IActionResult>(Ok(comments));
    }

    [HttpGet("MyPost/ByPostId/{id}")]
    [Authorize]
    public Task<IActionResult> CommentsByPostId(int id)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));

        var post = _postDao.GetMyPosts(username)!.FirstOrDefault(p => p.Id == id);
        if (post == null) return Task.FromResult<IActionResult>(Unauthorized("You don't have permission"));

        var comments = _commentRepository.CommentsByPostId(id);
        return Task.FromResult<IActionResult>(Ok(comments));
    }

    [HttpPost("CreateComment")]
    [Authorize]
    public Task<IActionResult> CreateComment([FromBody] CommentDto.CommentCreateRequest createRequest)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var comment = _commentRepository.Insert(new CommentDto.CommentDtoCreateRequest()
        {
            PostId = createRequest.PostId,
            Content = createRequest.Content,
            Author = username
        });
        return Task.FromResult<IActionResult>(Ok(comment));
    }

    [HttpPut("UpdateComment")]
    [Authorize]
    public Task<IActionResult> UpdateComment([FromBody] CommentDto.CommentDtoPut commentDto)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
        var fullname = User.Claims.FirstOrDefault(claim => claim.Type == "fullname")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));

        var commentDtoPut = new CommentDto.CommentPut
        {
            Id = commentDto.Id,
            Content = commentDto.Content,
            PostId = commentDto.PostId,
            Author = username
        };

        var comment = _commentRepository.Update(commentDtoPut);
        comment.FullName = fullname;
        return Task.FromResult<IActionResult>(Ok(comment));
    }

    [HttpDelete("Delete/{id}")]
    public Task<IActionResult> DeleteComment(int id)
    {
        var comment = _commentRepository.Delete(id);
        return Task.FromResult<IActionResult>(Ok(comment));
    }

}