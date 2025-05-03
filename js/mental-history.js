

addMdToPage('## Psykisk ohälsa i familjen och depression');

// Dropdown för kön (svenska etiketter)
let selectedGender = await addDropdown('Kön:', ['Alla', 'Man', 'Kvinna']);

// Anpassa etikett och filter
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

// Inledning
addMdToPage(`
> Den här analysen undersöker om det finns ett samband mellan psykisk ohälsa i familjen och om ${genderLabel} uppger depression.  
> Depression är kodad som \`0 = Nej\` och \`1 = Ja\`, vilket gör att medelvärdet motsvarar andelen som svarat "ja".

Analysen baseras på svar från ${genderLabel}. Tabellen och diagrammet visar hur andelen med depression skiljer sig beroende på om det finns psykisk ohälsa i familjen eller inte. Vad jag kan se så är skillnader mellan könen obefintliga.
`);

// Hämta data från databasen
let mentalIllness = await dbQuery(`
  SELECT historyMentalIllness, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
  FROM result_new
  ${genderFilter}
  GROUP BY historyMentalIllness;
`);

// Etikettera 0/1 till text
mentalIllness.forEach(row => {
  row.historyMentalIllness = row.historyMentalIllness === 1 ? '1 (Ja)' : '0 (Nej)';
});

// Visa tabell
tableFromData({ data: mentalIllness });

// Förbered data till diagram
let mentalChartData = [['Psykisk ohälsa i familjen', 'Andel med depression']];
mentalIllness.forEach(row => {
  const label = row.historyMentalIllness.includes('(Ja)') ? 'Ja' : 'Nej';
  mentalChartData.push([label, parseFloat(row.depressionRate)]);
});

// Visa stapeldiagram
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
