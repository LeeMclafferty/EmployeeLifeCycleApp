using App.Server.Data;
using App.Server.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace App.Server.Authorization
{
    public class AuthorizeRoleFilter : IAsyncAuthorizationFilter
    {
        private readonly string _role;
        private readonly AppDbContext _context;

        public AuthorizeRoleFilter(string role, AppDbContext context)
        {
            _role = role;
            _context = context;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            var email = user.GetEmail();

            if (string.IsNullOrEmpty(email))
            {
                context.Result = new ForbidResult();
                return;
            }

            var role = await _context.UserRoles
                .Where(u => u.Email == email)
                .Select(u => u.Role)
                .FirstOrDefaultAsync();

            if (role != _role)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
