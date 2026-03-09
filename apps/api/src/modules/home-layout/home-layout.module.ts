import { Module } from '@nestjs/common';
import { HomeLayoutProviders } from './home-layout.providers';
import { AdminHomeLayoutController } from './presentation/admin-home-layout.controller';
import { HomeLayoutController } from './presentation/home-layout.controller';

@Module({
  controllers: [AdminHomeLayoutController, HomeLayoutController],
  providers: [...HomeLayoutProviders],
  exports: [...HomeLayoutProviders],
})
export class HomeLayoutModule {}
