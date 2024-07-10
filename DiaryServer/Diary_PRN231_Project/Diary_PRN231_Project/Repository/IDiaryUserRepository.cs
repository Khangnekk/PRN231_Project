using Diary_PRN231_Project.DTOs;

namespace Diary_PRN231_Project.Repository;

public interface IDiaryUserRepository
{
    UserDto.UserDtoResponse? Update(UserDto.UserDtoPut userDtoPut);
    UserDto.UserDtoResponse? Get(string username);
}