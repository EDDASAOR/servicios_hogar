import { Controller, Get, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Request() req, @Body() createData: any) {
    createData.client_id = req.user.userId;
    return this.appointmentsService.create(createData);
  }

  @Get('my-appointments')
  async getMyLibAppointments(@Request() req) {
    return this.appointmentsService.findByClient(req.user.userId);
  }

  @Roles('admin')
  @Get('all')
  async getAllAppointments() {
    // Reutilizamos el modelo para jalar todas pre-poblando en un futuro el usuario.
    return this.appointmentsService['appointmentModel'].find().populate('client_id', 'nombre email telefono').exec();
  }

  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @Body('motivo') motivo?: string,
  ) {
    return this.appointmentsService.updateStatus(id, estado, motivo);
  }
}
