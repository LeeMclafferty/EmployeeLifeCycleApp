using App.Server.Controllers;
using App.Server.Data;
using App.Server.Services;
using Azure.Identity;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;

namespace App.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Env.Load(); // Load .env file if present
            var tenantId = Environment.GetEnvironmentVariable("TENANT_ID")
                ?? throw new InvalidOperationException("TENANT_ID environment variable not set.");
            var clientId = Environment.GetEnvironmentVariable("CLIENT_ID")
                ?? throw new InvalidOperationException("CLIENT_ID environment variable not set.");
            var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET")
                ?? throw new InvalidOperationException("CLIENT_SECRET environment variable not set.");

            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

            var builder = WebApplication.CreateBuilder(args);

            // Register GraphServiceClient with DI
            builder.Services.AddSingleton(sp =>
                new GraphServiceClient(credential, new[] { "https://graph.microsoft.com/.default" })
            );

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Http client injection
            builder.Services.AddHttpClient<NotifyController>();

            // DB Connection String
            var connectionString =
                builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection String 'DefaultConnection' not found.");

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Allow list for CORS
            var allowedOrigins = new[] { "https://localhost:49866" };
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowPolicy", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<PersonLifecycleService>();

            var app = builder.Build();

            app.UseCors("AllowPolicy");
            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
