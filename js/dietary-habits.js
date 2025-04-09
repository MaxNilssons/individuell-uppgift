import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Kostvanor och depression');

// Dropdown 
let selectedGender = addDropdown('Kön', ['Alla', 'Male', 'Female']);
addMdToPage(`**Valt kön: ${selectedGender}**`);

// Siffror till ord för lättare förståelse 
const dietLabels = {
  1: 'Ohälsosam',
  2: 'Medel',
  3: 'Hälsosam'
};


let genderFilter = selectedGender !== 'Alla' ? `AND gender = '${selectedGender}'` : '';

let dietaryDepression = await dbQuery(`
  SELECT dietaryHabits, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total 
  FROM result_new 
  WHERE dietaryHabits IS NOT NULL ${genderFilter}
  GROUP BY dietaryHabits 
  ORDER BY dietaryHabits;
`);

dietaryDepression.forEach(row => {
  row.dietaryHabits = dietLabels[row.dietaryHabits] || row.dietaryHabits;
});

tableFromData({ data: dietaryDepression });


let dietChartData = [['Kostvanor', 'Depression']];
dietaryDepression.forEach(row => {
  if (row.dietaryHabits && row.depressionRate !== null) {
    dietChartData.push([
      row.dietaryHabits,
      parseFloat(row.depressionRate)
    ]);
  }
});

addMdToPage('### Diagram: Kostvanor och depression');
drawGoogleChart({
  type: 'ColumnChart',
  data: dietChartData,
  options: {
    title: `Depression per kostkvalitet (${selectedGender})`,
    hAxis: {
      title: 'Kostvanor'
    },
    vAxis: {
      title: 'Depression',
      minValue: 0,
      maxValue: 1,
      viewWindow: { min: 0, max: 1 }
    },
    bar: { groupWidth: '30%' },
    height: 400,
    legend: 'none'
  }
});
