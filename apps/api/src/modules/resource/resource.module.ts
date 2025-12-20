import { Global, Module } from '@nestjs/common';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { ResourcesController } from './resource.controller';
import { ResourceService } from './resource.service';

@Global()
@Module({
  imports: [CloudflareModule],
  controllers: [ResourcesController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
