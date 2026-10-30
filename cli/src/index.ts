#!/usr/bin/env node

import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';
import { getHolidays, toCSVFile } from './utils.js';

async function main() {
    const options = {
        country: {
            type: "string",
            short: "c",
            multiple: false
        }
    } satisfies ParseArgsOptionsConfig;

    const {
        values: { country }
    } = parseArgs({ options, allowPositionals: true });

    if(!country){
        throw new Error('Missing required country. Please supply country name.');
    }

    // TODO: This is to handle npm/windows escape characters
    const cleanCountry = country.replace(/\^/g, '');

    // TODO: Further validate country name

    // TODO: Limit to countries the company operates in
    
    const hols = await getHolidays(cleanCountry);
    
    // Write to file
    // Default to e.g. "Holidays-GB-2026.csv" and override if exists
    
    // Sort ascending
    hols.sort((a,b)=>(new Date(a.date).getTime() - (new Date(b.date).getTime())));

    toCSVFile(hols);
}


main().catch(e => {
    console.error(e);
    process.exit(-1);
});
