using Diary_PRN231_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace Diary_PRN231_Project.DAO;

public class CommentDAO
{
    private readonly DiaryDbContext _context;

    public CommentDAO(DiaryDbContext context)
    {
        _context = context;
    }

    public Comment? Insert(Comment model)
    {
        _context.Add(model);
        _context.SaveChanges();
        return model;
    }
    
    public Comment? Update(Comment model)
    {
        var comment = _context.Comments.FirstOrDefault(c => c.Id == model.Id);
        if (comment == null) return null;
        
        comment.Content = model.Content;
        comment.Author = model.Author;
        comment.UpdatedAt = DateTime.Now;
        _context.Update(comment);
        _context.SaveChanges();
        return comment;
    }
    
    public Comment? Delete(int id)
    {
        var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
        if (comment == null) return null;
        _context.Remove(comment);
        _context.SaveChanges();
        return comment;
    }

    public Comment? Get(int id)
    {
        var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
        if (comment == null) return null;
        return comment;
    }

    public List<Comment>? CommentsInPublicPostByPostId(int id)
    {
        var comments = _context.Comments
            .Include(c => c.Post)
            .Where(c => c.PostId == id && c.Post.IsPublic == true)
            .ToList();
        return comments;
    }
    
    public List<Comment>? CommentsPostByPostId(int id)
    {
        var comments = _context.Comments
            .Include(c => c.Post)
            .Where(c => c.PostId == id)
            .ToList();
        return comments;
    }
}