import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FindMethodsUserNotificationUseCase } from '@notification/userNotification/use-case/userNotification-find-methods';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';
import { User } from '@platform-user/user/domain/user';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
})
export class UserNotificationUnreadWs
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly findMethodsUserNotificationUseCase: FindMethodsUserNotificationUseCase,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<
    string,
    { socket: Socket; userId: number }
  >();

  private userToSocketMap = new Map<number, string[]>();

  handleConnection(client: Socket) {
    // Store the connection initially without user data
    this.connectedClients.set(client.id, {
      socket: client,
      userId: null,
    });

    // Try to authenticate on connection if token is provided in handshake
    const user = (client?.handshake as any)?.user as User;
    if (user) {
      this.associateUserWithSocket(client, user);
    }
  }

  handleDisconnect(client: Socket) {
    // Get client data before removing
    const clientData = this.connectedClients.get(client.id);

    // Remove from connectedClients map
    this.connectedClients.delete(client.id);

    const socketsForUser = this.userToSocketMap.get(clientData.userId) || [];
    const updatedSockets = socketsForUser.filter((id) => id !== client.id);

    if (updatedSockets.length > 0) {
      this.userToSocketMap.set(clientData.userId, updatedSockets);
    } else {
      this.userToSocketMap.delete(clientData.userId);
    }
  }

  private associateUserWithSocket(socket: Socket, user: User): void {
    // Update client connection data
    this.connectedClients.set(socket.id, {
      socket,
      userId: user.id,
    });

    // Update cardToSocketMap for quick lookups
    const existingSockets = this.userToSocketMap.get(user.id) || [];
    if (!existingSockets.includes(socket.id)) {
      existingSockets.push(socket.id);
      this.userToSocketMap.set(user.id, existingSockets);
    }
  }

  public async broadcastNotification(userId: number): Promise<void> {
    const socketIds = this.userToSocketMap.get(userId) || [];
    if (socketIds.length === 0) {
      return;
    }

    const unreadUserNotifications =
      await this.findMethodsUserNotificationUseCase.getAllFullByFilter({
        userId: userId,
        readStatus: ReadStatus.NOT_READ,
      });
    const unreadUserNotificationsCount = unreadUserNotifications.length;
    console.log(unreadUserNotificationsCount);

    for (const socketId of socketIds) {
      const clientData = this.connectedClients.get(socketId);
      if (clientData && clientData.socket.connected) {
        clientData.socket.emit(
          'unread_notification',
          unreadUserNotificationsCount,
        );
      } else {
        this.connectedClients.delete(socketId);

        const updatedSocketIds = socketIds.filter((id) => id !== socketId);
        if (updatedSocketIds.length > 0) {
          this.userToSocketMap.set(userId, updatedSocketIds);
        } else {
          this.userToSocketMap.delete(userId);
        }
      }
    }
  }
}
