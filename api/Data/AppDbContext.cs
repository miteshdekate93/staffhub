using EmployeeDirectory.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Engineering", Description = "Software development team" },
            new Department { Id = 2, Name = "HR", Description = "Human resources" },
            new Department { Id = 3, Name = "Marketing", Description = "Marketing and growth" }
        );
    }
}
