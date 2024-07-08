using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class RegisterModel
{
    [Required]
    [DataType(DataType.Text)]
    public string Username { get; set; }
    [Required]
    [DataType(DataType.Text)]
    public string Fullname { get; set; }
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
}