import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';
import addDropdown from './libs/addDropdown.js';

addMdToPage('## Betyg (CGPA) och depression');

// Dropdown för kön
let selectedGender = addDropdown('Kön', ['Alla', 'Male', 'Female']);
let genderLabel = selectedGender === 'Alla' ? 'alla studenter' :
  selectedGender === 'Male' ? 'manliga studenter' :
    'kvinnliga studenter';

addMdToPage(`
> Den här analysen undersöker om det finns ett samband mellan betyg (CGPA) och hur stor andel av ${genderLabel} som uppger depression.  
> CGPA är ett genomsnittligt betygssystem i Indien, ofta mellan 0 och 10.  
> Depression är kodad som \`1 = Ja\`, \`0 = Nej\`, så medelvärdet visar andelen som uppgett depression.

Tabellen och diagrammet visar hur andelen som uppger depression förändras beroende på betyget, avrundat till hela tal (t.ex. 6, 7, 8).
`);

let genderFilter = selectedGender !== 'Alla' ? `WHERE gender = '${selectedGender}'` : '';

let cgpaDepression = await dbQuery(`
  SELECT ROUND(cgpa, 0) as roundedCgpa, 
         ROUND(AVG(depression), 2) as depressionRate, 
         COUNT(*) as total 
  FROM result_new 
  ${genderFilter}
  GROUP BY roundedCgpa 
  ORDER BY roundedCgpa;
`);

tableFromData({ data: cgpaDepression });

let cgpaChartData = [['CGPA (avrundad)', 'Andel med depression']];
cgpaDepression.forEach(row => {
  if (row.roundedCgpa !== null && row.depressionRate !== null) {
    cgpaChartData.push([parseFloat(row.roundedCgpa), parseFloat(row.depressionRate)]);
  }
});

addMdToPage(`### Diagram: CGPA och andel depression (${genderLabel})`);
drawGoogleChart({
  type: 'LineChart',
  data: cgpaChartData,
  options: {
    title: `CGPA och depression (${genderLabel})`,
    hAxis: { title: 'Avrundat CGPA' },
    vAxis: {
      title: 'Andel med depression (0–1)',
      minValue: 0,
      viewWindow: { min: 0, max: 1 }
    },
    pointSize: 5,
    curveType: 'function',
    legend: 'none',
    height: 500
  }
});
