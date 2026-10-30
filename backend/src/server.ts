import Fastify from 'fastify';
import cors from '@fastify/cors';

import holidayRoutes from './routes/holidays.js';
import countriesRoutes from './routes/countries.js';

// TODO: Read from .env
const LOCAL_ORIGIN = 'http://localhost:5173';

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
  origin: LOCAL_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});
fastify.register(holidayRoutes, { prefix: '/api/v1' });
fastify.register(countriesRoutes, { prefix: '/api/v1' });

const go = async () => {
    try {
        await fastify.listen({ port: 3000, host: 'localhost' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

go().catch(console.error);