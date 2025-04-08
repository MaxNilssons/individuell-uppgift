import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

let depressionValues = await dbQuery(`
  SELECT depression 
  FROM result_new;
`);

let counts = { '0': 0, '1': 0 };

depressionValues.forEach(row => {
  if (row.depression === 0 || row.depression === 1) {
    counts[row.depression]++;
  }
});

let chartData = [
  ['Svarsalternativ', 'Antal'],
  ['Nej (0)', counts[0]],
  ['Ja (1)', counts[1]]
];

addMdToPage('### Fördelning av svar: Har du upplevt depression?');
addMdToPage('Eftersom svarsalternativen enbart är "Ja" (1) eller "Nej" (0), så är det inte en normalfördelning. Då hade det krävts mer svarsalternativ, förmodligen 1-10 för att kunna läsa ut datan');

drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: 'Depression bland studenter – fördelning av svar',
    hAxis: { title: 'Svarsalternativ' },
    vAxis: { title: 'Antal studenter' },
    height: 400,
    bar: { groupWidth: '50%' },
    legend: 'none'
  }
});
