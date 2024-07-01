using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Diary_PRN231_Project.Models;

public class DiaryDbContext : IdentityDbContext<DiaryUser>
{
    public DiaryDbContext(DbContextOptions<DiaryDbContext> options)
        : base(options) { }


    protected DiaryDbContext()
    {
    }

    public virtual DbSet<Post> Posts { get; set; }
    public virtual  DbSet<Comment> Comments { get; set; }
    // public virtual  DbSet<DiaryUser> DiaryUsers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<DiaryUser>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }
}