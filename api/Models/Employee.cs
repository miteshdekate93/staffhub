namespace EmployeeDirectory.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public string JobTitle { get; set; } = "";
    public int DepartmentId { get; set; }
    public Department Department { get; set; } = null!;
    public DateTime HireDate { get; set; }
    public decimal Salary { get; set; }
    public bool IsActive { get; set; } = true;
    public string FullName => $"{FirstName} {LastName}";
}

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
