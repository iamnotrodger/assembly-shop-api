import { join } from 'path';
import { createConnection as connect } from 'typeorm';

export const createConnection = () =>
    connect({
        type: 'postgres',
        database: 'assembly-shop',
        url: process.env.DATABASE_URL,
        entities: [join(__dirname, '../entities/*')],
        migrations: [join(__dirname, '../migrations/*')],
        synchronize: true,
        logging: false,
    });
