import { Global, Module } from '@nestjs/common';
import { GhlService } from './ghl.service';

@Global()
@Module({
  providers: [GhlService],
  exports: [GhlService],
})
export class GhlModule {}
