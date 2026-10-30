
# Public holiday tracker 🏖️

This project is a service to help employees in the company keep track public holidays in the countries where we operate.

**Minimize use of dependancies**

## 1. MVP (script 💻)

As a minimum we need node.js script that accepts the name of a country (keyed) and returns a CSV file of all that country's public holidays.

### In scope

- Script accepts name of country (keyed)
- Returns CSV file of the format:
    - `Country`
    - `Name of the holiday`
    - `Date of the holiday`
    - `Days until holiday takes place (blank if passed)`
    - `Holiday takes place at weekend (Yes/No)`
- Use data from the public API here https://nagerholidays.com/api

### Out of scope

- Limit to countries the company operates in
- List all countries
- List all countries matching a given string (allow partial matches)
- Output format CSV/JSON/XLS
- Pick columns for output e.g. only Country/Name/Date
- Exclude past holidays flag
- Name file to create
- Sort options

## 2. Portal v1 (basic functionality ✅)

It would be nice to have a web portal for employees to view public holidays for their and other countries.

### In scope
- Web frontend at allows users to select a country and see a table of holidays:
    - `React` (Vite) for fast development
    - No frameworks to be used
    - All countries available in a simple combo box
    - Selection of a country will output a table:
        - Upcoming holidays green
        - Past holidays red (end user's preference)
- Backend with a `GET` endpoint that accepts a URL query parameter `country` to supply the data:
    - `Node.js` server with `Fastify`
    - Use data from the public API here https://nagerholidays.com/api
    - Cache queries to prevent unnecessary additional calls to the public API

### Out of scope
- Filter by region/subdivision
- Authentication - require user to be authenticated (preference would be to SSO)
- Free text search for country
- Recent searches
- Most searched for countries in a quick-pick row/grid
- Favourite countries

## 3. Portal v2 (enhanced experience 🏁)

Enhancements to the portal that make it more fun and enjoyable for the users. I would look to confirm the value to the business before going ahead with these features.

### In scope
- Show flags - possibly from https://github.com/lipis/flag-icons/tree/main/flags/4x3 (check license, evaluate, consider other options)
- Show national animal - to be sourced
- If today is public holiday in user's country, wish them a happy day:
    - One-time load an animation transitioning the greeting between:
        - The country’s official language in its native alphabet
        - The Romanized version of the country’s official language while retaining the page
alignment & letter direction of its native alphabet
        - The English version of the greeting
- Enhance to accept to accept a mock date and country, to allow test the greeting logic:
    - via URL query parameters `mockDate`/`mockCountry`

## 4. Portal v3 (world map 🌎)

A navrail with additional link to world map page with countries or regions experiencing a public holiday highlighted. I would look to confirm the value to the business before going ahead with these features.

### In scope
- Navrail with links to home page and new world map page:
- Use a shaded polygon with appropriate borders to highlight the country or region, not a point - possibly from https://github.com/nvkelso/natural-earth-vector (check license, evaluate, consider other options)
- Date slider beneath the map that allows any day in the calendar year to be selected. The
slider should be set to today’s date (or the server mock date) by default but can be moved by
the user to select any date and highlight its holidays on the map.

## 5. Portal v4 (polyphonic 🎵)

Create polyphonic versions of each country’s national anthem. I would look to confirm the value to the business before going ahead with these features.

### In scope
- Create polyphonic versions of each country’s national anthem
- Play when:
    - Country is selected in combo box
    - Country is selected on the map
    - Glowing pulse effect to selected country that pulses in time with the music
    - Also do this when it is a public holiday in user's country
