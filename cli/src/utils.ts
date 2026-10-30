import { createWriteStream } from 'node:fs';

// TODO: Read this from a .env
const HOLIDAY_API_BASE_URL = 'https://nagerholidays.com/api/v4';

const CSV_HEADER = 'Country,Name of the holiday,Date of the holiday,Days until holiday takes place (blank if passed),Holiday takes place at weekend (Yes/No)';

interface Holiday{     
    date: string,
    name: string,
    country: string,
    countryCode: string,
    nationalHoliday: false,
    subdivisionCodes: string[],
    holidayTypes: string[]
};

interface Country{
    countryCode: string;
    name: string;
};

// TODO: Limit to countries the company operates in (enum)

export async function getHolidays(country: string, year?: number): Promise<Holiday[]> {
    // Default to current year
    const forYear = year ?? new Date().getFullYear();    

    const countries = await getCountries();

    const cDetails = countries.find(c=>c.name === country);

    if(!cDetails){
        throw new Error('Error looking up country details');
    }

    const url = `${HOLIDAY_API_BASE_URL}/Holidays/${cDetails.countryCode}/${forYear}`;    
    const response = await fetch(url);

    // TODO: Something like zod for handling this would be better    

    const hols = ((await response.json()) as Holiday[]).map(h=>{
        const countryDetails = countries.find(c=>c.countryCode === h.countryCode);

        if(countryDetails){
            h.country = countryDetails.name;
        }

        return h;
    });

    return hols;
}

export async function toCSVFile(holidays: Holiday[], filePath?: string): Promise<void>{
    let fPath = './Holidays.csv';

    if(!holidays[0]){
        // Nothing to write to file
        return;
    }

    if(filePath){
        // TODO: Test supplied file path
    }else{
        fPath = `./Holidays-${holidays[0].country}-${new Date(holidays[0].date).getFullYear()}.csv`;
    }    

    const stream = createWriteStream(fPath, { flags: 'w' });

    stream.write(CSV_HEADER+'\n');
    const today = new Date();

    holidays.forEach(h=>{        
        const hDate = new Date(h.date);
        const daysDiff = getDaysDiff(today, hDate);
        const daysUntil = daysDiff < 0 ? Math.abs(daysDiff) : "";
        const isWeekend = [0,6].includes(hDate.getDay()) ? "Yes" : "No";

        stream.write(h.country+',');
        stream.write(quoteIfNeeded(h.name)+',');
        stream.write(h.date+',');
        stream.write(daysUntil+',');
        stream.write(isWeekend);

        stream.write('\n');
    });

    stream.end();
}

async function getCountries(): Promise<Country[]> {
    const url = `${HOLIDAY_API_BASE_URL}/Countries/Available`;    
    const response = await fetch(url);

    // TODO: Something like zod for handling this would be better

    const json = (await response.json()) as Country[];
    return json;
}

function quoteIfNeeded(value: string): string{
    if(value.includes(',')){
        return `"${value.replaceAll('"', '\\"')}"`;
    }   
    
    return value;
}

function getDaysDiff(date1: Date, date2: Date): number {
    const msDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    const diff = utc1 - utc2;
    return Math.floor(diff/msDay);
}