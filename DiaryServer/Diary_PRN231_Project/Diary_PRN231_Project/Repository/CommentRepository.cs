using AutoMapper;
using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.Repository;

public class CommentRepository : ICommentRepository
{
    private readonly IMapper _mapper;
    private readonly CommentDAO _commentDao;

    public CommentRepository(IMapper mapper, CommentDAO commentDao)
    {
        _mapper = mapper;
        _commentDao = commentDao;
    }

    public CommentDto.CommentDtoResponse? Insert(CommentDto.CommentDtoCreateRequest createRequest)
    {
        var comment = _commentDao.Insert(_mapper.Map<CommentDto.CommentDtoCreateRequest, Comment>(createRequest));
        return comment == null ? null : _mapper.Map<Comment, CommentDto.CommentDtoResponse>(comment);
    }

    public CommentDto.CommentDtoResponse? Update(CommentDto.CommentDtoPut commentDtoPut)
    {
        var comment = _commentDao.Update(_mapper.Map<CommentDto.CommentDtoPut, Comment>(commentDtoPut));
        return comment == null ? null : _mapper.Map<Comment, CommentDto.CommentDtoResponse>(comment);
    }

    public CommentDto.CommentDtoResponse? Delete(int id)
    {
        var comment = _commentDao.Delete(id);
        return comment == null ? null : _mapper.Map<Comment, CommentDto.CommentDtoResponse>(comment);
    }

    public CommentDto.CommentDtoResponse? Get(int id)
    {
        var comment = _commentDao.Get(id);
        return comment == null ? null : _mapper.Map<Comment, CommentDto.CommentDtoResponse>(comment);
    }

    public List<CommentDto.CommentDtoResponse>? CommentsPublicPostByPostId(int id)
    {
        var comments = _commentDao.CommentsInPublicPostByPostId(id);
        return comments == null ? null : _mapper.Map<List<Comment>, List<CommentDto.CommentDtoResponse>>(comments);
    }
    
    public List<CommentDto.CommentDtoResponse>? CommentsByPostId(int id)
    {
        var comments = _commentDao.CommentsPostByPostId(id);
        return comments == null ? null : _mapper.Map<List<Comment>, List<CommentDto.CommentDtoResponse>>(comments);
    }
}