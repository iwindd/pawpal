import { SessionSerializer } from '@/common/serializers/session.serializer';
import { JwtStrategy } from '@/common/strategies/jwt.strategy';
import { LocalStrategy } from '@/common/strategies/local.strategy';
import sessionConfig from '@/config/session';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('APP_SECRET'),
        signOptions: {
          expiresIn: sessionConfig.jwtExpiresIn,
          algorithm: 'HS384',
        },
        verifyOptions: {
          algorithms: ['HS384'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
})
export class AuthModule {}
