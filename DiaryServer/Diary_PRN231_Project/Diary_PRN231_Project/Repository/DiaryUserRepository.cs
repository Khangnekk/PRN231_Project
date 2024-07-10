using AutoMapper;
using Diary_PRN231_Project.DAO;
using Diary_PRN231_Project.DTOs;
using Diary_PRN231_Project.Models;

namespace Diary_PRN231_Project.Repository;

public class DiaryUserRepository : IDiaryUserRepository
{
    private readonly IMapper _mapper;
    private readonly UserDAO _userDao;

    public DiaryUserRepository(IMapper mapper, UserDAO userDao)
    {
        _mapper = mapper;
        _userDao = userDao;
    }

    public UserDto.UserDtoResponse? Update(UserDto.UserDtoPut userDtoPut)
    {
        var user = _userDao.UpdateProfile(userDtoPut);
        return _mapper.Map<DiaryUser, UserDto.UserDtoResponse>(user);
    }

    public UserDto.UserDtoResponse? Get(string username)
    {
        var user = _userDao.GetUserProfile(username);
        return _mapper.Map<DiaryUser, UserDto.UserDtoResponse>(user);
    }
}