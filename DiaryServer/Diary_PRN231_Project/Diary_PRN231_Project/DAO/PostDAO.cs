using Diary_PRN231_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace Diary_PRN231_Project.DAO;

public class PostDAO
{
    private readonly DiaryDbContext _context;

    public PostDAO(DiaryDbContext context)
    {
        _context = context;
    }

    public Post? Insert(Post model)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserName == model.UserId);
        var userid = user!.Id;
        if (userid == null) return null;
        model.UserId = userid;
        model.User = user;
        _context.Posts.Add(model);
        _context.SaveChanges();
        return model;
    }
    
    public Post? Update(Post model)
    {
        var post = _context.Posts.FirstOrDefault(p => p.Id == model.Id);
        if (post == null) return null;

        post.Id = model.Id;
        post.Content = model.Content;
        post.Title = model.Title;
        post.IsPublic = model.IsPublic;
        post.UpdatedAt = DateTime.Now;

        _context.Posts.Update(post);
        _context.SaveChanges();
        return post;
    }
    
    public Post? Delete(int id)
    {
        var post = _context.Posts.FirstOrDefault(p => p.Id == id);
        if (post == null) return null;
        
        var comments = _context.Comments.Where(c => c.Post.Id == id).ToList();
        _context.Comments.RemoveRange(comments);
        _context.Posts.Remove(post);
        _context.SaveChanges();
        return post;
    }

    public Post? Get(int id)
    {
        var post = _context.Posts.FirstOrDefault(p => p.Id == id && p.IsPublic == true);
        return post;
    }
    
    public List<Post>? GetByUsername(string username)
    {
        var userid = _context.Users.FirstOrDefault(u => u.UserName == username)?.Id;
        var posts = _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Where(p => p.UserId == userid && p.IsPublic == true)
            .ToList();
        return posts;
    }
    
    public List<Post>? GetMyPosts(string username)
    {
        var userid = _context.Users.FirstOrDefault(u => u.UserName == username)?.Id;
        var posts = _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Where(p => p.UserId == userid).ToList();
        return posts;
    }

    public List<Post>? Posts()
    {
        var posts = _context.Posts
            .Include(u => u.User)
            .OrderByDescending(p => p.CreatedAt)
            .Where(p => p.IsPublic).ToList();
        return posts;
    }
}