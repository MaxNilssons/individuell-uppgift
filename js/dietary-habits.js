

addMdToPage('## Kostvanor och depression');


let selectedGender = await addDropdown('Kön', ['Alla', 'Man', 'Kvinna']);
addMdToPage(`**Valt kön: ${selectedGender}**`);

let genderFilter = '';
if (selectedGender === 'Man') {
  genderFilter = `AND gender = 'Male'`;
} else if (selectedGender === 'Kvinna') {
  genderFilter = `AND gender = 'Female'`;
}

// Tydligare etiketter för kostvanor
const dietLabels = {
  1: 'Ohälsosam',
  2: 'Medel',
  3: 'Hälsosam'
};


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
