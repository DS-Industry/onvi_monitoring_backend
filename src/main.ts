import { rolesMapBootstrap } from './container-role';

async function bootstrap() {
  // Get the role from environment variable, default to 'app'
  const role = process.env.APP_ROLE || 'app';

  if (!rolesMapBootstrap[role]) {
    console.error(`Invalid role: ${role}`);
    process.exit(1);
  }

  try {
    await rolesMapBootstrap[role]();
  } catch (error) {
    console.error(`Failed to start application with role ${role}:`, error);
    process.exit(1);
  }
}

bootstrap();
