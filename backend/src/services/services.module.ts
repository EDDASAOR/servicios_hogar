import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceItem, ServiceSchema } from './schemas/service.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceItem.name, schema: ServiceSchema }])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
