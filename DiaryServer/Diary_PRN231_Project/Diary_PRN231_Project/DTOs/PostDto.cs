using System.ComponentModel.DataAnnotations;

namespace Diary_PRN231_Project.DTOs;

public class PostDto
{
    public class PostCreateRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsPublic { get; set; }
    }

    public class PostDtoCreateRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; }
    }

    public class PostDtoResponse
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Author { get; set; }
        public string AuthorFullname { get; set; }
        
        public bool haveImage { get; set; }
    }

    public class PostDtoPut
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Content { get; set; }
        [Required]
        public bool? IsPublic { get; set; }
    }
}