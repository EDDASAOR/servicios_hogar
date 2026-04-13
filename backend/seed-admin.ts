import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@hogarpro.com';
  const adminPass = 'admin123';

  // Check if admin exists
  const exists = await usersService.findByEmail(adminEmail);
  if (!exists) {
    const adminData = {
      nombre: 'Administrador Principal',
      email: adminEmail,
      password: adminPass,
    };
    
    // Create new user using the users service mapping
    const createdAdmin = await usersService.create(adminData);
    
    // Force role up to ADMIN
    createdAdmin.rol = 'admin' as any;
    await createdAdmin.save();
    
    console.log('--- ADMIN CREADO EXITOSAMENTE ---');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPass);
  } else {
    exists.rol = 'admin' as any;
    await exists.save();
    console.log('--- ADMIN YA EXISTIA PERO ACTUALIZÉ SU ROL ---');
    console.log('Email: ' + adminEmail);
    console.log('Password al registrarse permanece igual.');
  }

  await app.close();
}
bootstrap();
