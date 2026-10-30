import type { FastifyInstance } from 'fastify';
import { getCountries } from '../utils.js';

const COUNTRIES_SCHEMA_GET = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [
                        'name',
                        'countryCode'
                    ],
                    properties: {
                        name: { type: 'string' },
                        countryCode: { type: 'string' }
                    }
                }
            }
        }
    }
};

async function routes(fastify: FastifyInstance, _options: Object) {
    fastify.get('/countries', COUNTRIES_SCHEMA_GET, async (_request, _reply) => {
        // TODO: Limit to countries the company operates in
        const countries = await getCountries();
        return countries;
    })
}

export default routes;