using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Diary_PRN231_Project.Models
{
    public class DiaryUser : IdentityUser
    {
        [MaxLength(255)]
        public string? Fullname { get; set; }
        public byte[]? Avatar { get; set; }
    }
}