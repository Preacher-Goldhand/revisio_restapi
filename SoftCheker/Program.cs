using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;  // Dodaj ten using
using SoftCheker.Server.Entities;
using SoftCheker.Server.Services;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

// Configure the CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Replace with your front-end URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var connectionString = builder.Configuration.GetConnectionString("SoftChekerDb")
    .Replace("{DATABASE_PASSWORD}", Env.GetString("DATABASE_PASSWORD"));

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddDbContext<SoftChekerDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddScoped<ISoftService, SoftService>();
builder.Services.AddScoped<ISmtpConfigService, SmtpConfigService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<EmailRobotService>();
builder.Services.AddScoped<IDomainService, DomainService>();
builder.Services.AddScoped<ICertService, CertService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<ICsvGeneratorService, CsvGeneratorService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<SoftChekerDbContext>()
.AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtSecret = Env.GetString("JWT_SECRET");
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false; 
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// Apply migrations and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<SoftChekerDbContext>();
    context.Database.Migrate();

    if (!context.Softs.Any())
    {
        context.Softs.Add(new Soft
        {
            Id = 1,
            Name = "Example Software",
            Description = "Description of Example Software",
            CurrentVersion = "1.0",
            BasicSupport = DateTime.UtcNow.AddYears(-1),
            ExtendedSupport = DateTime.UtcNow.AddYears(1),
            NextVersion = "1.1"
        });

        context.SmtpConfigs.Add(new SmtpConfig
        {
            Id = 1,
            SmtpServer = "smtp.example.com",
            SmtpPort = 587,
            UseSsl = true,
            SmtpUsername = "user@example.com",
            RecipientEmail = "recipient@example.com"
        });

        context.Domains.Add(new Domain
        {
            Id = 1,
            Name = "example.com",
            Description = "Example domain",
            ExpiredDate = DateTime.UtcNow.AddYears(1)
        });

        context.Certs.Add(new Cert
        {
            Id = 1,
            Name = "SSL Certificate",
            Description = "SSL Certificate for example.com",
            IssuedDate = DateTime.UtcNow.AddYears(-1),
            ExpiredDate = DateTime.UtcNow.AddYears(1)
        });

        context.Contracts.Add(new Contract
        {
            Id = 1,
            ContractNumber = "12345",
            Description = "Example contract",
            StartDate = DateTime.UtcNow.AddMonths(-6),
            EndDate = DateTime.UtcNow.AddMonths(6),
            RenewDate = DateTime.UtcNow.AddMonths(5),
            GrossPrice = 1000.00m
        });

        await context.SaveChangesAsync();
    }

    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();

    var defaultUser = new IdentityUser
    {
        UserName = "admin",
        Email = "admin@cennam.com.pl"
    };

    string userPassword = Env.GetString("ADMIN_PASSWORD");

    var user = await userManager.FindByEmailAsync(defaultUser.Email);

    if (user == null)
    {
        var createPowerUser = await userManager.CreateAsync(defaultUser, userPassword);
    }
}

app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();