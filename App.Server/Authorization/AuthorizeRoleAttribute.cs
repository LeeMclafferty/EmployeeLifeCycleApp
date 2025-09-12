using Microsoft.AspNetCore.Mvc;

namespace App.Server.Authorization
{
    public class AuthorizeRoleAttribute : TypeFilterAttribute
    {
        public AuthorizeRoleAttribute(params string[] roles) : base(typeof(AuthorizeRoleFilter))
        {
            Arguments = new object[] { roles };
        }
    }

}
