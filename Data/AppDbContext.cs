using Microsoft.EntityFrameworkCore;
using ReadWithWrite.Models;

namespace ReadWithWrite.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Article> Articles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Article>()
            .HasIndex(a => a.PublishDate);
            
        modelBuilder.Entity<Article>()
            .HasIndex(a => a.SourceId);
    }
}
