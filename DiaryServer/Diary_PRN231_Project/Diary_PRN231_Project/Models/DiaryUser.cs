using Microsoft.AspNetCore.Identity;

namespace Diary_PRN231_Project.Models
{
    public class DiaryUser : IdentityUser
    {
        public byte[]? Avatar { get; set; }
    }
}