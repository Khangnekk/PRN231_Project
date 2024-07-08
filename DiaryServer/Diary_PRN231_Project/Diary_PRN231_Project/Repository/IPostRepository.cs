using Diary_PRN231_Project.DTOs;

namespace Diary_PRN231_Project.Repository;

public interface IPostRepository
{
    PostDto.PostDtoResponse? Insert(PostDto.PostDtoCreateRequest createRequest);
    PostDto.PostDtoResponse? Update(PostDto.PostDtoPut postDtoPut);
    PostDto.PostDtoResponse? Delete(int id);
    List<PostDto.PostDtoResponse>? PostsByUserName(string username);
    List<PostDto.PostDtoResponse>? MyPosts(string username);
    List<PostDto.PostDtoResponse>? Posts();
    PostDto.PostDtoResponse? PostById(int id);
}