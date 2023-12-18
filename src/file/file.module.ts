import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
