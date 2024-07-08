using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class LoginModel
{
    [Required]
    [DataType(DataType.Text)]
    public string Username { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}