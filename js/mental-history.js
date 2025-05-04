addMdToPage('## Psykisk ohälsa i familjen och depression');

let selectedGender = await addDropdown('Kön:', ['Alla', 'Man', 'Kvinna']);

let genderLabel = selectedGender === 'Alla'
  ? 'alla studenter'
  : selectedGender === 'Man'
    ? 'manliga studenter'
    : 'kvinnliga studenter';

let genderFilter = '';
if (selectedGender === 'Man') {
  genderFilter = `WHERE gender = 'Male'`;
} else if (selectedGender === 'Kvinna') {
  genderFilter = `WHERE gender = 'Female'`;
}

addMdToPage(`
> Den här analysen undersöker om det finns ett samband mellan psykisk ohälsa i familjen och om ${genderLabel} uppger depression.  
> Depression är kodad som \`0 = Nej\` och \`1 = Ja\`, vilket gör att medelvärdet motsvarar andelen som svarat "ja".

Analysen baseras på svar från ${genderLabel}. Tabellen och diagrammet visar hur andelen med depression skiljer sig beroende på om det finns psykisk ohälsa i familjen eller inte. Vad jag kan se så är skillnader mellan könen obefintliga.
`);

let mentalIllness = await dbQuery(`
  SELECT historyMentalIllness, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
  FROM result_new
  ${genderFilter}
  GROUP BY historyMentalIllness;
`);

// Byt etiketter tydligt
mentalIllness.forEach(row => {
  row.historyMentalIllness = row.historyMentalIllness === 1 ? 'Ja' : 'Nej';
});

tableFromData({ data: mentalIllness });

let mentalChartData = makeChartFriendly(mentalIllness, {
  x: "historyMentalIllness",
  y: "depressionRate"
});

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
