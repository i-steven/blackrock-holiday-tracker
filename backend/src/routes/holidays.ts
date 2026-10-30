import type { FastifyInstance } from 'fastify';
import { getHolidays } from '../utils.js';

interface RequestParams {
    countryCode: string;
}

const HOLIDAYS_SCHEMA_GET = {
    schema: {
        params: {
            type: 'object',
            properties: { countryCode: { type: 'string' } },
            required: ['countryCode']
        },
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    required: [
                        'date',
                        'name',
                        'country',
                        'countryCode',
                        'nationalHoliday',
                        'subdivisionCodes',
                        'holidayTypes',
                        'daysUntil',
                        'isWeekend'
                    ],
                    properties: {
                        date: { type: 'string', format: 'date' },
                        name: { type: 'string' },
                        country: { type: 'string' },
                        countryCode: { type: 'string' },
                        nationalHoliday: { type: 'boolean' },
                        subdivisionCodes: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        holidayTypes: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        daysUntil: { type: 'integer' },
                        isWeekend: { type: 'boolean' }
                    }
                }
            }
        }
    }
};

async function routes(fastify: FastifyInstance, _options: Object) {
    fastify.get<{ Params: RequestParams }>('/holidays/:countryCode', HOLIDAYS_SCHEMA_GET, async (request, _reply) => {
        const countryCode = request.params.countryCode;

        // TODO: Further validate country code

        // TODO: Limit to countries the company operates in

        const hols = await getHolidays(countryCode);
        return hols;
    })
}

export default routes;