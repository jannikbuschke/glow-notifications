using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Glow.NotificationsCore
{
    public static class SendEntryModifiedHubExtension
    {
        public static async Task SendToUser<THub>(
            this IHubContext<THub> hub,
            string userId,
            EntryModified message
        ) where THub : Hub
        {
            await hub.Clients.User(userId).SendAsync(
                nameof(EntryModified),
                message
            );
        }

        public static async Task SendToGroup<THub, T>(
          this IHubContext<THub> hub,
          string groupId,
          IMessage<T> message
        ) where THub : Hub
        {
            await hub.Clients.Group(groupId).SendAsync(
                message.Kind,
                message
            );
        }

        public static async Task SendToGroup<THub, T>(
            this THub hub,
            string groupId,
            IMessage<T> message
        ) where THub : Hub
        {
            await hub.Clients.Group(groupId).SendAsync(
                message.Kind,
                message
            );
        }
    }
}
