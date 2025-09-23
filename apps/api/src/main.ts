import { AppModule } from '@/modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { DelayInterceptor } from './common/interceptors/delay.interceptor';

// Constants
const DEFAULT_PORT = 3000;
const DEVELOPMENT_ENV = 'development';
const PRODUCTION_ENV = 'production';
const ENABLE_DELAY_FLAG = 'true';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.APP_SECRET));

  const isDevelopment = process.env.NODE_ENV === DEVELOPMENT_ENV;
  const isDelayEnabled = process.env.ENABLE_DELAY === ENABLE_DELAY_FLAG;

  if (isDevelopment && isDelayEnabled) {
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  app.use(
    session({
      secret: process.env.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === PRODUCTION_ENV,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const port = process.env.APP_PORT ?? DEFAULT_PORT;
  await app.listen(port);
}

bootstrap();
