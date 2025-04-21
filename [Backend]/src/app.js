import Fastify from 'fastify';
import './config/db.js';
import { syncModels } from './model/index.js';
import authRoutes from './routes/auth.js';
import cors from '@fastify/cors';
import teamRoutes from './routes/team.js';
const fastify = Fastify({ logger: { level: 'info' } });

fastify.register(authRoutes);
fastify.register(teamRoutes);
fastify.register(cors);


const start = async () => {
    try {
        await syncModels();
        await fastify.listen({ port: 5000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
