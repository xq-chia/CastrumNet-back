import { Module } from '@nestjs/common';
import { createPool } from 'mariadb';

const pool = createPool({
  host: '127.0.0.1',
  user: 'fyp',
  password: 'xq010614chia',
  database: 'fyp',
});

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        return await pool.getConnection();
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DbModule {}
