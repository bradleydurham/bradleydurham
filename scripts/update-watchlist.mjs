import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ICAL_URL = process.env.ICAL_URL;
if (!ICAL_URL) throw new Error('ICAL_URL environment variable is required');

const NOW_JSON_PATH = join(dirname(fileURLToPath(import.meta.url)), '../src/data/now.json');

function unfold(text) {
	return text.replace(/\r?\n[ \t]/g, '');
}

function parseICal(text) {
	const unfolded = unfold(text);
	const events = [];

	for (const block of unfolded.split('BEGIN:VEVENT').slice(1)) {
		const lines = block.split(/\r?\n/);
		const event = {};

		for (const line of lines) {
			if (line.startsWith('SUMMARY:')) {
				event.title = line.slice(8).replace(/\\,/g, ',').trim();
			} else if (line.startsWith('DESCRIPTION:')) {
				event.description = line.slice(12).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
			} else if (line.startsWith('DTSTART;VALUE=DATE:')) {
				event.date = line.slice(19).trim();
			} else if (line.match(/^DTSTART(;[^:]+)?:/)) {
				event.date = line.replace(/^DTSTART(;[^:]+)?:/, '').slice(0, 8);
			}
		}

		if (event.title && event.date) events.push(event);
	}

	return events;
}

function parseDescription(desc = '') {
	const [service, type] = desc.split('\n')[0].split('|').map((s) => s.trim());
	return { service: service || '', type: type || '' };
}

function todayNY() {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' })
		.format(new Date())
		.replace(/-/g, '');
}

const response = await fetch(ICAL_URL);
if (!response.ok) throw new Error(`Failed to fetch iCal: ${response.status}`);
const text = await response.text();

const events = parseICal(text);
const today = todayNY();

const past = events
	.filter((e) => e.date <= today)
	.sort((a, b) => b.date.localeCompare(a.date));

const future = events
	.filter((e) => e.date > today)
	.sort((a, b) => a.date.localeCompare(b.date));

const watchlist = { movies: [], tvShows: [], documentaries: [] };

for (const event of future) {
	const { service, type } = parseDescription(event.description);
	const entry = { title: event.title, service };

	if (type === 'Movie') watchlist.movies.push(entry);
	else if (type === 'TV') watchlist.tvShows.push(entry);
	else if (type === 'Documentary') watchlist.documentaries.push(entry);
	else console.warn(`Skipping "${event.title}" — unrecognized type: "${type}"`);
}

const now = JSON.parse(readFileSync(NOW_JSON_PATH, 'utf-8'));

if (past[0]) {
	const { service } = parseDescription(past[0].description);
	now.watching = { title: past[0].title, service };
}

now.watchlist = watchlist;

writeFileSync(NOW_JSON_PATH, JSON.stringify(now, null, 2) + '\n');
console.log(`Updated: watching="${now.watching.title}", ${watchlist.movies.length} movies, ${watchlist.tvShows.length} TV shows, ${watchlist.documentaries.length} documentaries`);
