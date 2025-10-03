import { Global, Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';
import { ResourcesController } from './resource.controller';
import { ResourceService } from './resource.service';

@Global()
@Module({
  controllers: [ResourcesController],
  providers: [LocalStorageService, ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
