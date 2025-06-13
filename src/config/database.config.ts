import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'verbum_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, //quando estiver em produção setta pra false
    logging: ['error', 'warn'], // Only log errors and warnings
    retryAttempts: 3,
    retryDelay: 3000,
    autoLoadEntities: true
};