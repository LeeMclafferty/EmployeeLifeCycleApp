using System.Security.Claims;

namespace App.Server.Extensions
{
    // Extension methods extend a class without modifying the original class.
    public static class ClaimsPrincipalExtensions
    {
        public static string? GetEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst("preferred_username")?.Value
                ?? user.FindFirst("upn")?.Value
                ?? user.FindFirst(ClaimTypes.Email)?.Value
                ?? user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
        }
    }
}
