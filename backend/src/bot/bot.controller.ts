import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ServicesService } from '../services/services.service';

@Controller('bot')
export class BotController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly appointmentsService: AppointmentsService,
    private readonly servicesService: ServicesService,
    private readonly jwtService: JwtService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /bot/verify-token
   * Verifica si el access_token guardado en user.access_token sigue siendo válido.
   * El bot lo llama al inicio de cada conversación para saber si el usuario
   * ya tiene sesión activa en la web, SIN depender de triggers.
   * Devuelve los datos del usuario si el token es válido.
   */
  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  async verifyToken(@Body() body: { access_token: string }) {
    if (!body.access_token) {
      return { valid: false, user: null };
    }

    try {
      const decoded = this.jwtService.verify(body.access_token);
      const user = await this.usersService.findByEmail(decoded.email);
      if (!user) {
        return { valid: false, user: null };
      }
      return {
        valid: true,
        user: {
          nombre:   user.nombre,
          email:    user.email,
          telefono: user.telefono ?? '',
          rol:      user.rol,
        },
      };
    } catch {
      return { valid: false, user: null };
    }
  }

  /**
   * POST /bot/register
   * Registra un usuario nuevo desde el bot y devuelve el JWT.
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body()
    body: {
      nombre: string;
      email: string;
      password: string;
      telefono: string;
    },
  ) {
    if (!body.nombre || !body.email || !body.password || !body.telefono) {
      throw new BadRequestException('Todos los campos son obligatorios: nombre, email, password, telefono.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw new BadRequestException('El formato del email no es válido.');
    }

    if (body.password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres.');
    }

    // UsersService lanza BadRequestException si el email ya existe
    const user = await this.usersService.create(body);
    const loginResult = await this.authService.login(user.toObject());
    return loginResult; // { access_token, user: { id, nombre, email, rol, telefono } }
  }

  /**
   * POST /bot/login
   * Autentica un usuario existente y devuelve el JWT.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email y contraseña son obligatorios.');
    }

    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas. Verifica tu email y contraseña.');
    }

    return this.authService.login(user);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SERVICIOS / CATÁLOGO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * GET /bot/services
   * Devuelve el catálogo de servicios, opcionalmente filtrado por categoría.
   * Ejemplo: GET /bot/services?categoria=plomeria
   */
  @Get('services')
  async getServices(@Query('categoria') categoria?: string) {
    if (categoria) {
      return this.servicesService.findByCategory(categoria);
    }
    return this.servicesService.findAll();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DISPONIBILIDAD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /bot/check-availability
   * Verifica si un horario está libre (sin crear la cita).
   */
  @Post('check-availability')
  async checkAvailability(@Body() body: { fechaProgramada: string }) {
    if (!body.fechaProgramada) {
      throw new BadRequestException('fechaProgramada es obligatorio.');
    }

    const fecha = new Date(body.fechaProgramada);
    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Formato de fecha inválido. Usa ISO 8601.');
    }

    // Verifica que no sea domingo
    if (fecha.getDay() === 0) {
      return { available: false, reason: 'No trabajamos los domingos.' };
    }

    // Rango de horario laboral: 8am – 6pm
    const hora = fecha.getHours();
    if (hora < 8 || hora >= 18) {
      return { available: false, reason: 'El horario debe estar entre 8:00 AM y 6:00 PM.' };
    }

    const isAvailable = await this.appointmentsService.checkAvailability(fecha);
    return {
      available: isAvailable,
      reason: isAvailable ? null : 'El horario seleccionado ya está ocupado (ventana de ±30 min).',
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESERVAS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /bot/appointment
   * Crea una reserva. El bot envía el access_token que obtuvo en login/register.
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('appointment')
  async createAppointment(
    @Body()
    body: {
      access_token: string;
      servicio: string;
      descripcion: string;
      direccion: string;
      fechaProgramada: string;
      prioridad: 'normal' | 'urgente';
    },
  ) {
    if (!body.access_token) {
      throw new UnauthorizedException('Se requiere autenticación para crear una reserva.');
    }

    // Validaciones de campos
    if (!body.servicio || !body.descripcion || !body.direccion || !body.fechaProgramada) {
      throw new BadRequestException('Faltan campos obligatorios: servicio, descripcion, direccion, fechaProgramada.');
    }

    // Decodificar el JWT para obtener el userId del cliente
    let decoded: any;
    try {
      decoded = this.jwtService.verify(body.access_token);
    } catch {
      throw new UnauthorizedException('Token de acceso inválido o expirado. Por favor inicia sesión de nuevo.');
    }

    const fecha = new Date(body.fechaProgramada);
    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Formato de fecha inválido.');
    }

    // Validar que no sea domingo
    if (fecha.getDay() === 0) {
      throw new BadRequestException('No se pueden hacer reservas los domingos.');
    }

    // Validar horario laboral
    const hora = fecha.getHours();
    if (hora < 8 || hora >= 18) {
      throw new BadRequestException('El horario debe estar entre 8:00 AM y 6:00 PM.');
    }

    // Usar la prioridad enviada por el cliente (bot o frontend).
    // No sobreescribir automáticamente — el bot y la web ya calculan esto correctamente.
    const prioridadFinal: 'normal' | 'urgente' = body.prioridad === 'urgente' ? 'urgente' : 'normal';

    return this.appointmentsService.create({
      client_id: decoded.sub,
      servicio: body.servicio,
      descripcion: body.descripcion,
      direccion: body.direccion,
      fechaProgramada: fecha,
      prioridad: prioridadFinal,
    });
  }

  /**
   * GET /bot/my-appointments
   * Devuelve las citas del cliente autenticado.
   * El bot envía el token en el Authorization header.
   */
  @Get('my-appointments')
  async getMyAppointments(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Se requiere token de acceso.');
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    return this.appointmentsService.findByClient(decoded.sub);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COTIZACIONES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /bot/quote
   * Devuelve una cotización estimada basada en la categoría del problema.
   */
  @Post('quote')
  async getQuote(
    @Body() body: { categoria: string; descripcion?: string },
  ) {
    if (!body.categoria) {
      throw new BadRequestException('La categoría del servicio es obligatoria.');
    }

    const services = await this.servicesService.findByCategory(body.categoria);

    // Precios de respaldo por categoría si no hay servicios en la DB
    const fallbackRanges: Record<string, { min: number; max: number }> = {
      plomeria:      { min: 80_000,  max: 350_000 },
      electricidad:  { min: 100_000, max: 400_000 },
      aire:          { min: 150_000, max: 600_000 },
    };

    if (!services.length) {
      const fallback = fallbackRanges[body.categoria.toLowerCase()] || { min: 80_000, max: 300_000 };
      return {
        min: fallback.min,
        max: fallback.max,
        moneda: 'COP',
        serviciosDisponibles: [],
        nota: 'El precio puede variar según el diagnóstico en sitio.',
      };
    }

    const precios = services.map((s) => s.precioBase);
    const min = Math.min(...precios);
    const max = Math.round(Math.max(...precios) * 1.5); // +50% para el caso más complejo

    return {
      min,
      max,
      moneda: 'COP',
      serviciosDisponibles: services.map((s) => ({
        nombre: s.nombre,
        descripcion: s.descripcion,
        precioBase: s.precioBase,
      })),
      nota: 'El precio puede variar según el diagnóstico en sitio.',
    };
  }
}
