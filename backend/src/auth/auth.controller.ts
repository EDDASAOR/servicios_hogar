import { Controller, Post, Get, Body, Request, UseGuards, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  /**
   * GET /auth/me
   * Devuelve los datos del usuario autenticado usando el JWT almacenado.
   * El frontend llama esto al iniciar la app para restaurar la sesión
   * sin que el usuario tenga que volver a iniciar sesión.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) throw new UnauthorizedException();
    return {
      id:       user._id,
      nombre:   user.nombre,
      email:    user.email,
      telefono: user.telefono ?? '',
      rol:      user.rol,
    };
  }
}
