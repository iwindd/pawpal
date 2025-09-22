import { AppModule } from '@/modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { DelayInterceptor } from './common/interceptors/delay.interceptor';
import { ProductTagUpdaterService } from './modules/productTags/product-tag-updater.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.APP_SECRET));

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_DELAY === 'true'
  ) {
    app.useGlobalInterceptors(new DelayInterceptor());
  }

  app.use(
    session({
      secret: process.env.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      // TODO: Implement a database session store in the future
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
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

  app.get(ProductTagUpdaterService).updateSystemTags();

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
