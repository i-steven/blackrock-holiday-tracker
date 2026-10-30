import './Holiday.css';

export interface HolidayType {
  date: string;
  name: string;
  country: string;
  countryCode?: string;
  nationalHoliday?: boolean;
  subdivisionCodes?: string[];
  holidayTypes?: string[];
  daysUntil: string;
  isWeekend: boolean;
};

function Holiday({
  date,
  name,
  daysUntil,
  isWeekend
}: HolidayType) {
  const days = parseInt(daysUntil);
  const background = days > 0 ? 'future-holiday' : 'past-holiday';

  return (
    <>
      <div className={`holiday-card ${background}`}>
        <div>
          <div className="holiday-card-header">
            <span className="holiday-date">{date}</span>
            {isWeekend && <span className="holiday-badge">Weekend</span>}
          </div>
          <h3 className="holiday-title">{name}</h3>
        </div>

        <div className="holiday-card-footer">
          {days > 0 && <span className="holiday-badge">{daysUntil} days away</span>}
        </div>
      </div>
    </>
  )
}

export default Holiday;
