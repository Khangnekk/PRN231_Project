using AutoMapper;
using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.Repository;

public class PostRepository : IPostRepository
{
    private readonly IMapper _mapper;
    private readonly PostDAO _postDao;
    
    public PostRepository(IMapper mapper, PostDAO postDao)
    {
        _postDao = postDao;
        _mapper = mapper;
    }

    public PostDto.PostDtoResponse? Insert(PostDto.PostDtoCreateRequest createRequest)
    {
        var post = _postDao.Insert(_mapper.Map<PostDto.PostDtoCreateRequest, Post>(createRequest));
        return post == null ? null : _mapper.Map<Post, PostDto.PostDtoResponse>(post);
    }

    public PostDto.PostDtoResponse? Update(PostDto.PostDtoPut postDtoPut)
    {
        var post = _postDao.Update(_mapper.Map<PostDto.PostDtoPut, Post>(postDtoPut));
        return post == null ? null : _mapper.Map<Post, PostDto.PostDtoResponse>(post);
    }

    public PostDto.PostDtoResponse? Delete(int id)
    {
        var post = _postDao.Delete(id);
        return post == null ? null : _mapper.Map<Post, PostDto.PostDtoResponse>(post);
    }

    public List<PostDto.PostDtoResponse>? PostsByUserName(string username)
    {
        var posts = _postDao.GetByUsername(username);
        return posts == null ? null : _mapper.Map<List<Post>, List<PostDto.PostDtoResponse>>(posts);
    }

    public List<PostDto.PostDtoResponse>? MyPosts(string username)
    {
        var posts = _postDao.GetMyPosts(username);
        return posts == null ? null : _mapper.Map<List<Post>, List<PostDto.PostDtoResponse>>(posts);
    }

    public List<PostDto.PostDtoResponse>? Posts()
    {
        var posts = _postDao.Posts();
        return posts == null ? null : _mapper.Map<List<Post>, List<PostDto.PostDtoResponse>>(posts);
    }

    public PostDto.PostDtoResponse? PostById(int id)
    {
        var post = _postDao.Get(id);
        return post == null ? null : _mapper.Map<Post, PostDto.PostDtoResponse>(post);
    }
}