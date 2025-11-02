import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@common/config/configuration';
import { PrismaModule } from '@database/prisma.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CourtsModule } from '../courts/courts.module';
import { EstablishmentsModule } from '../establishments/establishments.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { UsersModule } from '../users/users.module';
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
    UsersModule,
    EstablishmentsModule,
    CourtsModule,
    SchedulesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
