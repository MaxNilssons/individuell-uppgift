import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Sömn och depression');


let selectedGender = addDropdown('Kön', ['Alla', 'Male', 'Female']);
addMdToPage(`**Valt kön: ${selectedGender}**`);


let avgSleep = await dbQuery(`
  SELECT ROUND(AVG(sleepDuration), 2) as avgSleepDuration
  FROM result_new
  WHERE sleepDuration IS NOT NULL
  ${selectedGender !== 'Alla' ? `AND gender = '${selectedGender}'` : ''}
`);

addMdToPage(`**Genomsnittlig sömn för alla: ${avgSleep[0].avgSleepDuration} timmar per natt**`);


let genderFilter = selectedGender !== 'Alla' ? `AND gender = '${selectedGender}'` : '';

let allStudents = await dbQuery(`
  SELECT sleepDuration, ROUND(AVG(depression), 2) as avgDepression, COUNT(*) as total
  FROM result_new
  WHERE sleepDuration IS NOT NULL ${genderFilter}
  GROUP BY sleepDuration
  ORDER BY sleepDuration;
`);

if (allStudents.length > 0) {
  tableFromData({ data: allStudents });

  let sleepChartData = [['Sleep Duration (hours)', 'Average Depression']];
  allStudents.forEach(row => {
    sleepChartData.push([
      parseFloat(row.sleepDuration),
      parseFloat(row.avgDepression)
    ]);
  });

  addMdToPage('### Diagram: Sömn och depression');
  drawGoogleChart({
    type: 'ColumnChart',
    data: sleepChartData,
    options: {
      title: `Sömnens längd vs Genomsnittlig depression (${selectedGender})`,
      hAxis: { title: 'Sömnlängd (timmar)' },
      vAxis: {
        title: 'Genomsnittlig depression',
        minValue: 0,
        maxValue: 1,
        viewWindow: { min: 0, max: 1 }
      },
      pointSize: 5,
      curveType: 'function',
      legend: 'none',
      height: 500
    }
  });
};

