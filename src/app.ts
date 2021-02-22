import express from 'express';

//Middleware
import errorMiddleware from './middleware/errorMiddleware';
import notFound from './middleware/notFound';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';

//Configuration
import './config/passportConfig';

//Routes
import AuthenticationRoutes from './route/AuthenticationRoutes';
import TeamRoutes from './route/TeamRoutes';
import ProjectRoutes from './route/ProjectRoutes';
import MemberRoutes from './route/MemberRoutes';
import TaskRoutes from './route/TaskRoutes';

//Utils
import { createConnection } from 'typeorm';
import { join } from 'path';

//Create Express Server
const app = express();

//Connect to Database
createConnection({
    type: 'postgres',
    database: 'assembly-shop',
    url: process.env.DATABASE_URL,
    entities: [join(__dirname, '/entity/*')],
    migrations: [join(__dirname, '/migration/*')],
    synchronize: true,
    logging: false,
})
    .then(() => {
        console.log('Connected to Postgres');
    })
    .catch((error) =>
        console.error('Unable to Connect to Postgres \n' + error),
    );

const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: process.env.FRONT_END_URL || '*',
    preflightContinue: false,
};

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(options));
app.use(helmet());
app.use(passport.initialize());

//Routes
app.use('/api/auth', AuthenticationRoutes);
app.use('/api/team', TeamRoutes);
app.use('/api/team', MemberRoutes);
app.use('/api', ProjectRoutes);
app.use('/api', TaskRoutes);

//Error Handling
app.use(notFound);
app.use(errorMiddleware);

export default app;
