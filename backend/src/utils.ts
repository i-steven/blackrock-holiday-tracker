// TODO: The cli has similar code so could be shared

// TODO: Read this from a .env
const HOLIDAY_API_BASE_URL = 'https://nagerholidays.com/api/v4';

interface Holiday{     
    date: string;
    name: string;
    country?: string;
    countryCode: string;
    nationalHoliday: boolean;
    subdivisionCodes: string[];
    holidayTypes: string[];
    daysUntil?: string;
    isWeekend?: boolean;
};

interface Country{
    countryCode: string;
    name: string;
};

type CacheArray = Country[] | Holiday[];
const cache = new Map<string, CacheArray>();

// TODO: Limit to countries the company operates in (enum)

export async function getHolidays(countryCode: string, year?: number): Promise<Holiday[]> {
    // Default to current year
    const forYear = year ?? new Date().getFullYear();    

    const countries = await getCountries();

    const cDetails = countries.find(c=>c.countryCode === countryCode);

    if(!cDetails){
        throw new Error('Error looking up country details');
    }

    const url = `${HOLIDAY_API_BASE_URL}/Holidays/${cDetails.countryCode}/${forYear}`;    
    const response = await fetchData<Holiday[]>(url);

    // TODO: Something like zod for handling this would be better    

    const today = new Date();

    const hols = response.map(h=>{
        const countryDetails = countries.find(c=>c.countryCode === h.countryCode);

        if(countryDetails){
            h.country = countryDetails.name;
        }

        const hDate = new Date(h.date);
        const daysDiff = getDaysDiff(today, hDate);
        const daysUntil = daysDiff < 0 ? Math.abs(daysDiff)+"" : "";
        const isWeekend = [0,6].includes(hDate.getDay());

        h.daysUntil = daysUntil;
        h.isWeekend = isWeekend;

        return h;
    });

    return hols;
}

export async function getCountries(): Promise<Country[]> {
    const url = `${HOLIDAY_API_BASE_URL}/Countries/Available`;
    const response = await fetchData<Country[]>(url);

    // TODO: Something like zod for handling this would be better
    
    return response;
}

async function fetchData<T extends CacheArray>(url: string): Promise<T> {
    const cached = cache.get(url);

    if(cached !== undefined){
        return cached as T;
    }

    const response = await fetch(url);
    const data = (await response.json()) as T;

    cache.set(url, data);
    return data;
}

function getDaysDiff(date1: Date, date2: Date): number {
    const msDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    const diff = utc1 - utc2;
    return Math.floor(diff/msDay);
}