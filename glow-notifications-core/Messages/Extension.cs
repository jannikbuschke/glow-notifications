using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Glow.NotificationsCore.Messages
{
    public interface Message
    {
        string Kind { get; }
    }

    public static class HubExtensions
    {
        public static async Task SendToUserAsync<THub, T>(
          this IHubContext<THub> hub,
          string userId,
          Message message
        ) where THub : Hub
        {
            await hub.Clients.User(userId).SendAsync(
                message.Kind,
                message
            );
        }

        public static async Task SendToGroupAsync<THub, T>(
            this THub hub,
            string groupId,
            Message message
        ) where THub : Hub
        {
            await hub.Clients.Group(groupId).SendAsync(
                message.Kind,
                message
            );
        }
    }
}
