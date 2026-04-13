import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // lo crearemos ahora

@Controller('services-catalog')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get('category/:categoria')
  async findByCategory(@Param('categoria') categoria: string) {
    return this.servicesService.findByCategory(categoria);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createData: any) {
    // Idealmente, validaríamos que el usuario es Admin aquí con otro guard
    return this.servicesService.create(createData);
  }
}
