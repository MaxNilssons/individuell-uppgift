import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Gender and depression');


let selectedGender = addDropdown('Kön', ['All', 'Male', 'Female']);

let genderData;
if (selectedGender === 'All') {

  genderData = await dbQuery(`
    SELECT gender, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
    FROM result_new
    GROUP BY gender;
  `);
} else {

  genderData = await dbQuery(`
    SELECT gender, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
    FROM result_new
    WHERE gender = '${selectedGender}'
    GROUP BY gender;
  `);
}



tableFromData({ data: genderData });


let chartData = [['Gender', 'Depression Rate']];
genderData.forEach(row => {
  chartData.push([row.gender, parseFloat(row.depressionRate)]);
});


addMdToPage('### Diagram: Gender and Depression');
drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: `Depression per kön (${selectedGender})`,
    hAxis: {
      title: 'Kön'
    },
    vAxis: {
      title: 'Depression Rate',
      minValue: 0,
      maxValue: 1,
      viewWindow: {
        min: 0,
        max: 1
      }
    },
    height: 400,
    legend: 'none',
    bar: { groupWidth: '60%' },
    chartArea: { width: '70%' }
  }
});
