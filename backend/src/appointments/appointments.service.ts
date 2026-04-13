import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

  async create(createData: any): Promise<AppointmentDocument> {
    // Basic validation to avoid double booking
    const { fechaProgramada } = createData;
    
    // Asumimos que los servicios no se pueden solapar para el técnico (Lógica simplificada)
    // En la vida real, depende del servicio y técnico.
    const start = new Date(fechaProgramada);
    start.setMinutes(start.getMinutes() - 30); // 30 min prev
    const end = new Date(fechaProgramada);
    end.setMinutes(end.getMinutes() + 30);

    const conflicting = await this.appointmentModel.findOne({
      fechaProgramada: { $gte: start, $lte: end }
    }).exec();

    if (conflicting) {
      throw new BadRequestException('El horario seleccionado no está disponible.');
    }

    const newAppointment = new this.appointmentModel(createData);
    return newAppointment.save();
  }

  async findByClient(client_id: string): Promise<AppointmentDocument[]> {
    return this.appointmentModel.find({ client_id: new Types.ObjectId(client_id) }).exec();
  }

  async updateStatus(id: string, estado: string): Promise<AppointmentDocument | null> {
    return this.appointmentModel.findByIdAndUpdate(id, { estado }, { new: true }).exec();
  }
}
