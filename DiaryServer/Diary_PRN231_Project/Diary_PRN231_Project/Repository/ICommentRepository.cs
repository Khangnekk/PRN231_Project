using Diary_PRN231_Project.DTOs;

namespace Diary_PRN231_Project.Repository;

public interface ICommentRepository
{
    CommentDto.CommentDtoResponse? Insert(CommentDto.CommentDtoCreateRequest createRequest);
    CommentDto.CommentDtoResponse? Update(CommentDto.CommentDtoPut commentDtoPut);
    CommentDto.CommentDtoResponse? Delete(int id);
    CommentDto.CommentDtoResponse? Get(int id);
    List<CommentDto.CommentDtoResponse>? CommentsPublicPostByPostId(int id);
    List<CommentDto.CommentDtoResponse>? CommentsByPostId(int id);
}