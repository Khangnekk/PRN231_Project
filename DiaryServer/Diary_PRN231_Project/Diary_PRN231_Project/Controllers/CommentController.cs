﻿using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Repository;
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
    public Task<IActionResult> CommentsByPostId(int id)
    {
        var username = User.Claims.FirstOrDefault(claim => claim.Type == "username")?.Value;
        if (username == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));

        var post = _postDao.GetByUsername(username)!.FirstOrDefault(p => p.Id == id);
        if(post == null) return Task.FromResult<IActionResult>(Unauthorized("You don't have permission"));
        
        var comments = _commentRepository.CommentsByPostId(id);
        return Task.FromResult<IActionResult>(Ok(comments));
    }

    [HttpPost("CreateComment")]
    public Task<IActionResult> CreateComment([FromBody] CommentDto.CommentCreateRequest createRequest)
    {
        var fullname = User.Claims.FirstOrDefault(claim => claim.Type == "fullname")?.Value;
        if (fullname == null) return Task.FromResult<IActionResult>(BadRequest("Username doesn't exist"));
        var comment = _commentRepository.Insert(new CommentDto.CommentDtoCreateRequest()
        {
            PostId = createRequest.PostId,
            Content = createRequest.Content,
            Author = fullname
        });
        return Task.FromResult<IActionResult>(Ok(comment));
    }

    [HttpPut("UpdateComment")]
    public Task<IActionResult> UpdateComment([FromBody] CommentDto.CommentDtoPut commentDtoPut)
    {
        var comment = _commentRepository.Update(commentDtoPut);
        return Task.FromResult<IActionResult>(Ok(comment));
    }

    [HttpDelete("{id}")]
    public Task<IActionResult> DeleteComment(int id)
    {
        var comment = _commentRepository.Delete(id);
        return Task.FromResult<IActionResult>(Ok(comment));
    }
    
}