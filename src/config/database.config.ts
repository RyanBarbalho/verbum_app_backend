import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST as string || (process.platform === 'win32' ? 'localhost' : 'host.docker.internal'),
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME as string || 'postgres',
    password: process.env.DB_PASSWORD as string || '123',
    database: process.env.DB_DATABASE as string || 'verbum_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, //quando estiver em produção setta pra false
    logging: ['error', 'warn'], // Only log errors and warnings
    retryAttempts: 3,
    retryDelay: 3000,
    autoLoadEntities: true
};