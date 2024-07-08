using AutoMapper;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.Mapper;

public class ApplicationMapper : Profile
{
    public ApplicationMapper()
    {
        // Map Post
        CreateMap<Post, PostDto.PostDtoResponse>();
        CreateMap<PostDto.PostDtoCreateRequest, Post>();
        CreateMap<PostDto.PostDtoPut, Post>();
    }
}