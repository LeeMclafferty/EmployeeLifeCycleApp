using App.Server.Data;
using App.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Middleware
{
    public class UserProvisioningMiddleware
    {
        private readonly RequestDelegate _next;

        public UserProvisioningMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext db)
        {
            foreach (var claim in context.User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }

            if (context.User.Identity?.IsAuthenticated == true)
            {
                var email =
                context.User.FindFirst("preferred_username")?.Value ??
                context.User.FindFirst("upn")?.Value ??
                context.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;

                if (!string.IsNullOrEmpty(email))
                {
                    var exists = await db.UserRoles.AnyAsync(u => u.Email == email);
                    if (!exists)
                    {
                        db.UserRoles.Add(new UserRole { Email = email, Role = "User" });
                        await db.SaveChangesAsync();
                    }
                }
            }

            await _next(context);
        }
    }

}
