import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceItem, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(ServiceItem.name) private serviceModel: Model<ServiceDocument>) {}

  async findAll(): Promise<ServiceItem[]> {
    return this.serviceModel.find({ activo: true }).exec();
  }

  async findByCategory(categoria: string): Promise<ServiceItem[]> {
    return this.serviceModel.find({ categoria, activo: true }).exec();
  }

  async create(createData: any): Promise<ServiceItem> {
    const newService = new this.serviceModel(createData);
    return newService.save();
  }
}
