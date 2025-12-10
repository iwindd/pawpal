import {
  INestApplication,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Session } from '@pawpal/shared';
import * as cookie from 'cookie';
import * as signature from 'cookie-signature';
import { Server, Socket } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(
    private readonly app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const cors = {
      origin: [
        this.configService.get<string>('WEB_ADMIN_URL'),
        this.configService.get<string>('WEB_FRONTEND_URL'),
        process.env.NODE_ENV == 'production' ? '' : '*',
      ],
      credentials: true,
    };

    this.logger.debug(
      `Configuring SocketIO server with custom cors options ${cors.origin.join(', ')} `,
    );

    const optionsWithCors = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCors);
    server.of('/admin').use(createTokenMiddleware(jwtService));
    server.of('/user').use(createTokenMiddleware(jwtService));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService) => (socket: Socket, next: (err?: Error) => void) => {
    try {
      const raw = socket.handshake.headers.cookie;
      const cookies = cookie.parse(raw || '');

      let signed = cookies['token'];

      signed = decodeURIComponent(signed);

      if (signed.startsWith('s:')) {
        signed = signed.slice(2);
      }

      if (!signed) throw new UnauthorizedException('Invalid token');

      const unsigned = signature.unsign(signed, process.env.APP_SECRET);
      const jwtPayload = jwtService.verify(unsigned);

      if (!jwtPayload) throw new UnauthorizedException('Invalid token');

      socket.handshake.auth.jwtPayload = jwtPayload;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };

export type SocketWithSession = Socket & {
  data: {
    user: Session;
  };
};
