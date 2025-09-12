using App.Server.Data;
using App.Server.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Authorization
{
    public class AuthorizeRoleFilter : IAsyncAuthorizationFilter
    {
        private readonly string[] _roles;
        private readonly AppDbContext _context;

        public AuthorizeRoleFilter(string[] roles, AppDbContext context)
        {
            _roles = roles;
            _context = context;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var email = context.HttpContext.User.GetEmail();
            if (string.IsNullOrEmpty(email))
            {
                context.Result = new ForbidResult();
                return;
            }

            var userRoles = await _context.UserRoles
                .Where(u => u.Email == email)
                .Select(u => u.Role)
                .ToListAsync();

            // ✅ Pass if the user has ANY of the allowed roles
            if (!_roles.Any(r => userRoles.Contains(r)))
            {
                context.Result = new ForbidResult();
            }
        }
    }

}
