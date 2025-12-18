# Backend Development Guidelines for Ahadu Center (ASP.NET Core)

## Project Structure

The Ahadu Center backend should follow a layered architecture with clear separation of concerns:

```
Backend/
├── AhaduCenter.Api/           # API layer (Controllers)
│   ├── Controllers/
│   ├── Properties/
│   └── Program.cs
├── AhaduCenter.Application/   # Application layer (Services, DTOs)
│   ├── Services/
│   ├── DTOs/
│   └── Interfaces/
├── AhaduCenter.Domain/        # Domain layer (Entities, Enums)
│   ├── Entities/
│   ├── Enums/
│   └── Interfaces/
├── AhaduCenter.Infrastructure/ # Infrastructure layer (Data, Repositories)
│   ├── Data/
│   ├── Repositories/
│   └── Migrations/
├── AhaduCenter.Tests/         # Unit and integration tests
└── AhaduCenter.sln            # Solution file
```

## Technology Stack

1. **ASP.NET Core 8.0** with **Web API**
2. **Entity Framework Core** for data access
3. **SQL Server** or **PostgreSQL** for database
4. **JWT** for authentication
5. **AutoMapper** for object mapping
6. **Swagger/OpenAPI** for API documentation
7. **Serilog** for logging

## Setup Instructions

1. Install .NET 8 SDK from https://dotnet.microsoft.com/download/dotnet/8.0

2. Create solution and projects:

```bash
dotnet new sln -n AhaduCenter
dotnet new webapi -n AhaduCenter.Api
dotnet new classlib -n AhaduCenter.Application
dotnet new classlib -n AhaduCenter.Domain
dotnet new classlib -n AhaduCenter.Infrastructure
dotnet sln add AhaduCenter.Api
dotnet sln add AhaduCenter.Application
dotnet sln add AhaduCenter.Domain
dotnet sln add AhaduCenter.Infrastructure
```

3. Add project references:

```bash
dotnet add AhaduCenter.Api reference AhaduCenter.Application
dotnet add AhaduCenter.Application reference AhaduCenter.Domain
dotnet add AhaduCenter.Application reference AhaduCenter.Infrastructure
dotnet add AhaduCenter.Infrastructure reference AhaduCenter.Domain
```

4. Install NuGet packages:

```bash
# For Api project
dotnet add AhaduCenter.Api package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add AhaduCenter.Api package Swashbuckle.AspNetCore

# For Application project
dotnet add AhaduCenter.Application package AutoMapper.Extensions.Microsoft.DependencyInjection

# For Infrastructure project
dotnet add AhaduCenter.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add AhaduCenter.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add AhaduCenter.Infrastructure package Microsoft.EntityFrameworkCore.Design
```

5. Configure `Program.cs` in AhaduCenter.Api:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ahadu Center API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Configuration

Add to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AhaduCenterDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Key": "YourSecretKeyHereWhichShouldBeVeryLongAndSecure",
    "Issuer": "AhaduCenter",
    "Audience": "AhaduCenterUsers",
    "ExpireDays": 30
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile (protected)

### Products

- GET `/api/products` - Get all products
- GET `/api/products/{id}` - Get product by ID
- POST `/api/products` - Create new product (admin)
- PUT `/api/products/{id}` - Update product (admin)
- DELETE `/api/products/{id}` - Delete product (admin)

### Categories

- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create new category (admin)

### Orders

- GET `/api/orders` - Get user orders (protected)
- POST `/api/orders` - Create new order (protected)

## Data Models

### User Entity

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum UserRole
{
    User,
    Admin
}
```

### Product Entity

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string ImageUrl { get; set; }
    public bool InStock { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Category Category { get; set; }
}
```

### Order Entity

```csharp
public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }

    // Navigation properties
    public Order Order { get; set; }
    public Product Product { get; set; }
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered
}
```

## Security Best Practices

1. Use HTTPS in production
2. Implement proper authentication and authorization
3. Validate and sanitize all inputs
4. Use parameterized queries to prevent SQL injection
5. Store secrets in Azure Key Vault or environment variables
6. Implement rate limiting
7. Regularly update NuGet packages

## Deployment

1. Publish the application:

```bash
dotnet publish -c Release -o ./publish
```

2. Deploy to platforms like:

   - Azure App Service
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - On-premises IIS server

3. Set up database (Azure SQL, SQL Server, or PostgreSQL)
4. Configure environment variables on deployment platform

## Testing

1. Use xUnit or NUnit for unit testing
2. Test all controllers and services
3. Mock database calls in tests
4. Implement integration tests for critical flows

This guideline provides a foundation for building a scalable and maintainable backend for the Ahadu Center application using ASP.NET Core.
