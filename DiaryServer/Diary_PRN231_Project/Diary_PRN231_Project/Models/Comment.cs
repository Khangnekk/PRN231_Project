using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Diary_PRN231_Project.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Content { get; set; }
        public int PostId { get; set; }
        public DateTime CreatedAt { get; set; }

        [ForeignKey("PostId")]
        public Post Post { get; set; }
    }
}