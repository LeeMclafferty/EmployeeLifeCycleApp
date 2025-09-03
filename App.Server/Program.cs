using App.Server.Controllers;
using App.Server.Data;
using App.Server.Middleware;
using App.Server.Services;
using Azure.Identity;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using Microsoft.Identity.Web;

namespace App.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
//             Env.Load(); // Load .env file if present
//             var tenantId = Environment.GetEnvironmentVariable("TENANT_ID")
//                 ?? throw new InvalidOperationException("TENANT_ID environment variable not set.");
//             var clientId = Environment.GetEnvironmentVariable("CLIENT_ID")
//                 ?? throw new InvalidOperationException("CLIENT_ID environment variable not set.");
//             var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET")
//                 ?? throw new InvalidOperationException("CLIENT_SECRET environment variable not set.");
// 
//             var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
// 
// 
//             // Register GraphServiceClient with DI
//             builder.Services.AddSingleton(sp =>
//                 new GraphServiceClient(credential, new[] { "https://graph.microsoft.com/.default" })
//             );

            var builder = WebApplication.CreateBuilder(args);

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

            Console.WriteLine("AzureAd:ClientId => " + builder.Configuration["AzureAd:ClientId"]);
            Console.WriteLine("AzureAd:TenantId => " + builder.Configuration["AzureAd:TenantId"]);
            Console.WriteLine("AzureAd:ClientSecret => " + (string.IsNullOrEmpty(builder.Configuration["AzureAd:ClientSecret"]) ? "(empty)" : "(loaded)"));

            // Authentication with Azure AD
            builder.Services.AddAuthentication("Bearer")
                .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

            builder.Services.AddAuthorization();


            builder.Services.AddAuthorization();

            // Require authenticated users globally to use api
            builder.Services.AddControllers(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            });


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

            // Configure Azure AD authentication & authorization
            app.UseAuthentication();
            app.UseMiddleware<UserProvisioningMiddleware>(); // ensure users are in UserRoles table
            app.UseAuthorization();

            app.UseCors("AllowPolicy");
            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
