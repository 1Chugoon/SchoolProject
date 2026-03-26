using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LearningPlatform.Api.Auth
{
    public static class ClaimsExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var id = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return Guid.Parse(id!);
        }
    }
}
