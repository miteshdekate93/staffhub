using EmployeeDirectory.Data;
using EmployeeDirectory.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Auth
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "default-secret-key-change-me!!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

// CORS for Angular
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Employee Directory API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

// Application Insights
builder.Services.AddApplicationInsightsTelemetry();

// Health checks
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Health check
app.MapHealthChecks("/health");

// Employees endpoints
app.MapGet("/api/employees", async (AppDbContext db, string? search, int page = 1, int pageSize = 10) =>
{
    var query = db.Employees.Include(e => e.Department).Where(e => e.IsActive);
    if (!string.IsNullOrEmpty(search))
        query = query.Where(e => e.FirstName.Contains(search) || e.LastName.Contains(search) || e.Email.Contains(search));

    var total = await query.CountAsync();
    var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    return Results.Ok(new { total, page, pageSize, items });
});

app.MapGet("/api/employees/{id}", async (int id, AppDbContext db) =>
    await db.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == id)
        is Employee emp ? Results.Ok(emp) : Results.NotFound());

app.MapPost("/api/employees", async (Employee emp, AppDbContext db) =>
{
    db.Employees.Add(emp);
    await db.SaveChangesAsync();
    return Results.Created($"/api/employees/{emp.Id}", emp);
}).RequireAuthorization();

app.MapPut("/api/employees/{id}", async (int id, Employee updated, AppDbContext db) =>
{
    var emp = await db.Employees.FindAsync(id);
    if (emp is null) return Results.NotFound();
    emp.FirstName = updated.FirstName;
    emp.LastName = updated.LastName;
    emp.Email = updated.Email;
    emp.JobTitle = updated.JobTitle;
    emp.DepartmentId = updated.DepartmentId;
    emp.Salary = updated.Salary;
    await db.SaveChangesAsync();
    return Results.Ok(emp);
}).RequireAuthorization();

app.MapDelete("/api/employees/{id}", async (int id, AppDbContext db) =>
{
    var emp = await db.Employees.FindAsync(id);
    if (emp is null) return Results.NotFound();
    emp.IsActive = false; // Soft delete
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// Departments
app.MapGet("/api/departments", async (AppDbContext db) =>
    await db.Departments.ToListAsync());

app.Run();
