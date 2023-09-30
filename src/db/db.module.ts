import { Module } from '@nestjs/common';
import * as mariadb from 'mariadb';


const pool = mariadb.createPool({
  host: 'localhost',
  user: 'fyp',
  password: 'xq010614chia',
  database: 'rnd',
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