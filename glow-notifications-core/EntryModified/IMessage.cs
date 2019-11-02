namespace Glow.NotificationsCore
{
    public interface IMessage<T>
    {
        string Kind { get; }
        T Payload { get; set; }
    }
}
