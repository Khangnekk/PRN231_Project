using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class CommentDto
{
    public class CommentCreateRequest
    {
        [Required]
        public string? Content { get; set; }
        [Required]
        public int PostId { get; set; }
    }
    
    public class CommentDtoCreateRequest
    {
        [Required]
        public string? Content { get; set; }
        [Required]
        public int PostId { get; set; }
        [Required]
        public string? Author { get; set; }
    }
    
    public class CommentDtoResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int PostId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Author { get; set; }
        public string FullName { get; set; }
    }
    
    public class CommentDtoPut
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int PostId { get; set; }
    }
}