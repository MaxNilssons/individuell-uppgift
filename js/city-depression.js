import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Depression per stad');

// Dropdown för kön
let selectedGender = addDropdown('Kön', ['Alla', 'Male', 'Female']);
addMdToPage(`**Valt kön: ${selectedGender}**`);

// SQL-filter för kön
let genderFilter = selectedGender !== 'Alla' ? `AND gender = '${selectedGender}'` : '';

let cityData = await dbQuery(`
  SELECT city, 
         ROUND(AVG(depression), 2) AS depressionRate, 
         COUNT(*) AS total
  FROM result_new
  WHERE city IS NOT NULL
  ${genderFilter}
  GROUP BY city
  HAVING COUNT(*) > 10
  ORDER BY depressionRate DESC;
`);

if (cityData.length > 0) {
  tableFromData({ data: cityData });

  // För diagrammet
  let chartData = [['Stad', 'Genomsnittlig depression']];
  cityData.forEach(row => {
    chartData.push([row.city, parseFloat(row.depressionRate)]);
  });

  addMdToPage('### Diagram: Genomsnittlig depression per stad');
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: `Genomsnittlig depression per stad (${selectedGender})`,
      hAxis: { title: 'Stad', slantedText: true, slantedTextAngle: 45 },
      vAxis: {
        title: 'Depression',
        minValue: 0,
        maxValue: 1
      },
      height: 600,
      bar: { groupWidth: '60%' },
      legend: 'none'
    }
  });
} else {
  addMdToPage('⚠️ Ingen data att visa för det valda könet eller kriteriet.');
}
