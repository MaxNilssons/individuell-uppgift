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

// Byt ut siffror mot textetiketter
dietaryDepression.forEach(row => {
  row.dietaryHabits = dietLabels[row.dietaryHabits] || row.dietaryHabits;
});

tableFromData({ data: dietaryDepression });

// Använd makeChartFriendly
let dietChartData = makeChartFriendly(dietaryDepression, {
  x: "dietaryHabits",
  y: "depressionRate"
});

addMdToPage('### Diagram: Kostvanor och depression');
drawGoogleChart({
  type: 'ColumnChart',
  data: dietChartData,
  options: {
    title: `Kostvanor och depression (${selectedGender})`,
    hAxis: { title: 'Kostvanor' },
    vAxis: {
      title: 'Andel med depression (0–1)',
      minValue: 0,
      viewWindow: { min: 0, max: 1 }
    },
    pointSize: 5,
    height: 500,
    legend: 'none'
  }
});
