import createMenu from './libs/createMenu.js';

createMenu(
  'Depression i Indien',
  [
    { name: 'Startsida', script: 'startsida.js' },
    { name: 'testavTtest', script: 'testavTtest.js' },
    { name: 'Test av normalfördelning', script: 'testingnormal.js' },
    { name: 'Korrelation', script: 'cgpa-korrelation.js' },
    { name: 'Sömn och depression', script: 'sleep-depression.js' },
    { name: 'Akademisk press', script: 'academic-pressure.js' },
    { name: 'Kostvanor', script: 'dietary-habits.js' },
    { name: 'Psykisk ohälsa i familjen', script: 'mental-history.js' },
    { name: 'CGPA och depression', script: 'cgpa-depression.js' },
    { name: 'Kön och depression', script: 'gender-depression.js' },
    { name: 'Antal timmar och depression', script: 'studyhours-depression.js' },
    { name: 'Stad och depression', script: 'city-depression.js' },
    { name: 'Sammanfattningsvis', script: 'summary.js' },
  ]
);

