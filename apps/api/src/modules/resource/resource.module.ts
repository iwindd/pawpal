import { Global, Module } from '@nestjs/common';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { resourceProviders } from './infrastructure/resource.providers';
import { ResourcesController } from './presentation/resource.controller';

@Global()
@Module({
  imports: [CloudflareModule],
  controllers: [ResourcesController],
  providers: [...resourceProviders],
  exports: [...resourceProviders],
})
export class ResourceModule {}
