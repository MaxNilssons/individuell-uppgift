import createMenu from './libs/createMenu.js';

createMenu(
  'Depression i Indien',
  [
    { name: 'Startsida', script: 'startsida.js' }, // 👈 Ny rad för startsidan
    { name: 'Test av normalfördelning', script: 'testingnormal.js' },
    { name: 'Sömn och depression', script: 'sleep-depression.js' },
    { name: 'Akademisk press', script: 'academic-pressure.js' },
    { name: 'Kostvanor', script: 'dietary-habits.js' },
    { name: 'Psykisk ohälsa i familjen', script: 'mental-history.js' },
    { name: 'CGPA och depression', script: 'cgpa-depression.js' },
    { name: 'Kön och depression', script: 'gender-depression.js' },
    { name: 'Antal timmar och depression', script: 'studyhours-depression.js' },
    { name: 'Stad och depression', script: 'city-depression.js' }
  ]
);

// ✅ Ladda startsidan automatiskt om ingen hash är satt
if (!location.hash || location.hash === '#') {
  location.hash = '#Startsida';
}
