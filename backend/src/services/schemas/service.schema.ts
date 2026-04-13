import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = ServiceItem & Document;

@Schema({ timestamps: true })
export class ServiceItem {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  categoria: string; // Ej: plomeria, electricidad, aire

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  precioBase: number;

  @Prop({ default: true })
  activo: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(ServiceItem);
