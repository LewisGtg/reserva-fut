import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@common/config/configuration';
import { PrismaModule } from '@database/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
