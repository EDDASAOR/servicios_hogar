import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

export enum AppointmentStatus {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en proceso',
  FINALIZADO = 'finalizado',
}

export enum PriorityLevel {
  NORMAL = 'normal',
  URGENTE = 'urgente',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client_id: Types.ObjectId;

  @Prop({ required: true })
  servicio: string; // Puede ser el nombre o el ID del servicio

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: false })
  direccion: string;

  @Prop({ type: String, enum: PriorityLevel, default: PriorityLevel.NORMAL })
  prioridad: PriorityLevel;

  @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.PENDIENTE })
  estado: AppointmentStatus;

  // Fecha solicitada
  @Prop({ required: true })
  fechaProgramada: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
