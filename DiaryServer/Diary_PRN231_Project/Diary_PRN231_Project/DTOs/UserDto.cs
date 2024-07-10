using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class UserDto
{
    public class UserDtoPut
    {
        [Required]
        public string? Fullname { get; set; }
    }
}