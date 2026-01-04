using Microsoft.EntityFrameworkCore;
using ReadWithWrite.Models;

namespace ReadWithWrite.Data;

public class WritingDbContext : DbContext
{
    public WritingDbContext(DbContextOptions<WritingDbContext> options) : base(options)
    {
    }

    public DbSet<WritingTopic> WritingTopics { get; set; }
    public DbSet<WritingSession> WritingSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<WritingTopic>()
            .HasIndex(t => t.Date);
    }
}
