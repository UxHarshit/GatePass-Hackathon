import Fastify from 'fastify';
import './config/db.js';
import { syncModels } from './model/index.js';
import authRoutes from './routes/auth.js';
import cors from '@fastify/cors';
import teamRoutes from './routes/team.js';
const fastify = Fastify({ logger: { level: 'info' } });

fastify.register(authRoutes);
fastify.register(teamRoutes);
fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
});


const start = async () => {
    try {
        await syncModels();
        await fastify.listen({ port: 5001,host: '0.0.0.0'});
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
