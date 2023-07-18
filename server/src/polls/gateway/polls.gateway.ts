import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PollsService } from '../polls.service';
import { Socket, Namespace } from 'socket.io';
import { SocketWithAuth } from '../types';

@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized`);
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.userID}, pollID: ${client.pollID} and name: ${client.name}`,
    );

    this.logger.log(`WS with client id: ${client.id} connected!`);
    this.logger.debug(`No of sockets connected: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
      const sockets = this.io.sockets;
      
      this.logger.debug(
        `Socket disconnected with userID: ${client.userID}, pollID: ${client.pollID} and name: ${client.name}`,
      );

    this.logger.log(`Disconnect socket id: ${client.id}`);
    this.logger.debug(`No of disconnected sockets: ${sockets.size}`);

    // TODO: remove client from poll and send `participants_updated` event to remaining clients
  }
}
