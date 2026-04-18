import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BotController } from './bot.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AppointmentsModule,
    ServicesModule,
    // Misma configuración del secret que en AuthModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_REPLACE_IN_PROD',
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  controllers: [BotController],
})
export class BotModule {}
