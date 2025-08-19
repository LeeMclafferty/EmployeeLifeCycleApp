
using App.Server.Data;
using App.Server.Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Azure.Identity;
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

            var credntials = new ClientSecretCredential(
                tenantId, clientId, clientSecret);

            var builder = WebApplication.CreateBuilder(args);

            // App-only credential for Graph
            builder.Services.AddSingleton(credntials);

            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // DB Connection String
            var connectionString =
                builder.Configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection String"
                + "'DefaultConnection' not found.");

            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

            // Allow list for CORS
            var allowedOrigins = new[]
            {
                "https://localhost:49866"
            };

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

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            //Will use to define dashboard as the default route later
//             app.MapControllerRoute(
//                 name: "default",
//                 pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
