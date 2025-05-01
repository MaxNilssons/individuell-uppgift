import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';
import addDropdown from './libs/addDropdown.js';

addMdToPage('## Psykisk ohälsa i familjen och depression');

// Dropdown för kön
let selectedGender = addDropdown('Kön', ['Alla', 'Male', 'Female']);
let genderLabel = selectedGender === 'Alla' ? 'alla studenter' :
  selectedGender === 'Male' ? 'manliga studenter' :
    'kvinnliga studenter';

// Inledning
addMdToPage(`
> Den här analysen undersöker om det finns ett samband mellan psykisk ohälsa i familjen och om ${genderLabel} uppger depression.  
> Depression är kodad som \`0 = Nej\` och \`1 = Ja\`, vilket gör att medelvärdet motsvarar andelen som svarat "ja".

Analysen baseras på svar från ${genderLabel}. Tabellen och diagrammet visar hur andelen med depression skiljer sig beroende på om det finns psykisk ohälsa i familjen eller inte. Vad jag kan se så är skillnader mellan könen obefintliga
`);

// Korrekt filtrerad SQL-fråga
let mentalIllness = await dbQuery(`
  SELECT historyMentalIllness, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
  FROM result_new
  ${selectedGender !== 'Alla' ? `WHERE gender = '${selectedGender}'` : ''}
  GROUP BY historyMentalIllness;
`);

// Omvandla 0/1 till etiketter
mentalIllness.forEach(row => {
  if (row.historyMentalIllness === 1) {
    row.historyMentalIllness = '1 (Ja)';
  } else if (row.historyMentalIllness === 0) {
    row.historyMentalIllness = '0 (Nej)';
  }
});

// Visa tabell
tableFromData({ data: mentalIllness });

// Förbered diagram
let mentalChartData = [['Psykisk ohälsa i familjen', 'Andel med depression']];
mentalIllness.forEach(row => {
  let label = row.historyMentalIllness.includes('(Ja)') ? 'Ja' : 'Nej';
  mentalChartData.push([label, parseFloat(row.depressionRate)]);
});

// Visa diagram
addMdToPage(`### Diagram: Andel deprimerade (${genderLabel}) – beroende på psykisk ohälsa i familjen`);
drawGoogleChart({
  type: 'ColumnChart',
  data: mentalChartData,
  options: {
    title: `Psykisk ohälsa i familjen och depression (${genderLabel})`,
    hAxis: { title: 'Psykisk ohälsa i familjen' },
    vAxis: {
      title: 'Andel med depression (0–1)',
      minValue: 0,
      viewWindow: { min: 0, max: 1 }
    },
    height: 400,
    legend: 'none',
    bar: { groupWidth: '30%' }
  }
});
