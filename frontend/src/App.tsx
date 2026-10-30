import { useState, useEffect, type ChangeEvent } from 'react';
import './App.css';
import type { HolidayType } from './Holiday';
import Holiday from './Holiday';

// TODO: Read this from a .env
const API_BASE_URL = 'http://localhost:3000/api/v1';
const DEFAULT_COUNTRY = 'GB';

interface Country {
  name: string;
  countryCode: string;
}

function App() {
  const [countryData, setCountryData] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY);

  const [holidaysData, setHolidaysData] = useState<HolidayType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Move into generic hook
    const fetchCountries = async () => {
      try {
        const url = `${API_BASE_URL}/countries`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch countries');

        const data = await response.json();
        setCountryData(data);
      } catch (e) {
        setError(`Error fetching country data: ${(e as Error)?.message}`);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // So we can abort
    const controller = new AbortController();

    // TODO: Move into generic hook
    const fetchHolidays = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/holidays/${countryCode}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch holidays');

        const data = await response.json();
        setHolidaysData(data);

      } catch (err) {
        // Check if was abort
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message);
        }
      } finally {
        // Always set loading done
        setLoading(false);
      }
    };

    fetchHolidays();

    return () => controller.abort();
  }, [countryCode]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cc = e.target.value;
    setCountryCode(cc);
  };

  const countriesCombo = (
    <select id="countryCombo" value={countryCode} onChange={handleChange}>
      {countryData.map(c => (<option key={c.countryCode} value={c.countryCode}>{c.name}</option>))}
    </select>
  );

  return (
    <>
      <h1>Holidays</h1>

      <label htmlFor="countryCombo">Please select a country: </label>
      {countriesCombo}

      {loading && <p>Loading holidays, please wait...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && holidaysData.length > 0 && (
        <div className="holidays-container">
          {holidaysData.map(h => (
            <Holiday
              key={`${h.countryCode}-${h.date}-${h.name}`}
              date={h.date}
              name={h.name}
              country={h.country}
              daysUntil={h.daysUntil}
              isWeekend={h.isWeekend}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default App;
