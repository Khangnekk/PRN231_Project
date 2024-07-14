using AutoMapper;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.Mapper;

public class ApplicationMapper : Profile
{

    public ApplicationMapper()
    {
        // Map Post
        CreateMap<Post, PostDto.PostDtoResponse>()
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.AuthorFullname, opt => opt.MapFrom(src => src.User.Fullname))
            .ForMember(dest => dest.haveImage, opt => opt.MapFrom(src => src.PostImage!=null ?true:false));
        CreateMap<PostDto.PostDtoCreateRequest, Post>();
        CreateMap<PostDto.PostDtoPut, Post>();

        // Map Comment
        CreateMap<Comment, CommentDto.CommentDtoResponse>();
        CreateMap<CommentDto.CommentDtoCreateRequest, Comment>();
        CreateMap<CommentDto.CommentDtoPut, Comment>();
        CreateMap<CommentDto.CommentPut, Comment>();

        // Map User
        CreateMap<DiaryUser, UserDto.UserDtoResponse>();
        CreateMap<UserDto.UserDtoPutRequest, UserDto.UserDtoPut>();
    }
}