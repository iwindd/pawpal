import { AppModule } from '@/modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { join } from 'path';
import { ZodFilter } from './common/execeptions/ZodFilter';
import { DelayInterceptor } from './common/interceptors/delay.interceptor';
import { PrismaService } from './modules/prisma/prisma.service';

// Constants
const DEFAULT_PORT = 3000;
const DEVELOPMENT_ENV = 'development';
const PRODUCTION_ENV = 'production';
const ENABLE_DELAY_FLAG = 'true';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser(process.env.APP_SECRET));

  const isDevelopment = process.env.NODE_ENV === DEVELOPMENT_ENV;
  const isDelayEnabled = process.env.ENABLE_DELAY === ENABLE_DELAY_FLAG;

  if (isDevelopment && isDelayEnabled) {
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  const prismaService = app.get(PrismaService);

  app.use(
    session({
      secret: process.env.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(prismaService, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }),
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
    origin: [process.env.WEB_ADMIN_URL, process.env.WEB_FRONTEND_URL],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const port = process.env.APP_PORT ?? DEFAULT_PORT;

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/storage/',
  });

  app.useGlobalFilters(new ZodFilter());

  // swagger
  const config = new DocumentBuilder().setTitle('PawpalAPI').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}

bootstrap();
