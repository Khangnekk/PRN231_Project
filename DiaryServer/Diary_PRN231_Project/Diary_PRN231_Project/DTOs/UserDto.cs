using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class UserDto
{
    public class UserDtoPutRequest
    {
        [Required(ErrorMessage = "Fullname is required")]
        public string? FullName { get; set; }
        [Required(ErrorMessage = "EmailAddress is required"),EmailAddress]
        public string? Email { get; set; }
        [Required(ErrorMessage = "Phone number is required"),Phone]
        public string? PhoneNumber { get; set; }
    }
    
    public class UserDtoPut
    {
        [Required]
        public string? FullName { get; set; }
        [Required]
        public string? UserName { get; set; }
        [Required,EmailAddress]
        public string? Email { get; set; }
        [Required,Phone]
        public string? PhoneNumber { get; set; }
    }
    
    public class UserDtoResponse
    {
        [Required]
        public string? FullName { get; set; }
        [Required]
        public string? UserName { get; set; }
        [Required,EmailAddress]
        public string? Email { get; set; }
        [Required,Phone]
        public string? PhoneNumber { get; set; }
    }
}