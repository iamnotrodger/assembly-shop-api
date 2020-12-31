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
import './config/postgresConfig';
import './config/passportConfig';

//Routes
import AuthenticationRoutes from './routes/AuthenticationRoutes';

//Create Express Server
const app = express();

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

//Error Handling
app.use(notFound);
app.use(errorMiddleware);

export default app;
