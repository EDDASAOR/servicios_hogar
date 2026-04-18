import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createData: any): Promise<AppointmentDocument> {
    const { fechaProgramada } = createData;

    const fecha = new Date(fechaProgramada);
    const start = new Date(fecha);
    start.setMinutes(start.getMinutes() - 30);
    const end = new Date(fecha);
    end.setMinutes(end.getMinutes() + 30);

    const conflicting = await this.appointmentModel
      .findOne({ fechaProgramada: { $gte: start, $lte: end } })
      .exec();

    if (conflicting) {
      throw new BadRequestException('El horario seleccionado no está disponible.');
    }

    const newAppointment = new this.appointmentModel(createData);
    return newAppointment.save();
  }

  /**
   * Verifica si un horario está libre sin crear la cita.
   * Usada por el endpoint GET /bot/check-availability.
   */
  async checkAvailability(fecha: Date): Promise<boolean> {
    const start = new Date(fecha);
    start.setMinutes(start.getMinutes() - 30);
    const end = new Date(fecha);
    end.setMinutes(end.getMinutes() + 30);

    const conflicting = await this.appointmentModel
      .findOne({ fechaProgramada: { $gte: start, $lte: end } })
      .exec();

    return !conflicting;
  }

  async findByClient(client_id: string): Promise<AppointmentDocument[]> {
    return this.appointmentModel
      .find({
        $or: [
          { client_id: new Types.ObjectId(client_id) },
          { client_id: client_id }
        ]
      })
      .sort({ fechaProgramada: 1 })
      .exec();
  }

  /**
   * Actualiza el estado de una cita.
   * Si el estado es 'confirmado' o 'cancelado', dispara el webhook de Make
   * para que se envíe el email correspondiente al cliente.
   */
  async updateStatus(
    id: string,
    estado: string,
    motivo?: string,
  ): Promise<AppointmentDocument | null> {
    const updateData: any = { estado };
    if (motivo) updateData.motivoCancelacion = motivo;

    const updated = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('client_id', 'nombre email telefono')
      .exec();

    // Disparar webhook de Make solo en confirmación o cancelación
    if (updated && (estado === 'confirmado' || estado === 'cancelado')) {
      await this.triggerMakeWebhook(updated, motivo);
    }

    return updated;
  }

  // ─── Webhook privado para Make ────────────────────────────────────────────
  private async triggerMakeWebhook(
    appointment: AppointmentDocument & { client_id: any },
    motivo?: string,
  ): Promise<void> {
    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    if (!makeUrl) {
      console.warn('⚠️  MAKE_WEBHOOK_URL no está configurado. No se enviará email.');
      return;
    }

    try {
        const d = new Date(appointment.fechaProgramada);
        // Formateamos para que Make no tenga que lidiar con ISOs feos
        const fechaFomateada = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const horaFormateada = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

        const payload = {
        tipo:            appointment.estado,          // 'confirmado' | 'cancelado'
        clienteNombre:   appointment.client_id?.nombre,
        clienteEmail:    appointment.client_id?.email,
        clienteTelefono: appointment.client_id?.telefono,
        servicio:        appointment.servicio,
        descripcion:     appointment.descripcion,
        fechaProgramada: appointment.fechaProgramada,
        fechaFomateada,
        horaFormateada,
        direccion:       appointment.direccion,
        prioridad:       appointment.prioridad,
        motivo:          motivo || null,
        appointmentId:   (appointment as any)._id.toString(),
      };

      const response = await fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`❌ Make webhook respondió con status ${response.status}`);
      } else {
        console.log(`✅ Webhook de Make disparado correctamente para cita ${payload.appointmentId} (${payload.tipo})`);
      }
    } catch (err) {
      // No lanzamos el error para no interrumpir la respuesta al admin
      console.error('❌ Error al llamar webhook de Make:', err);
    }
  }
}
