addMdToPage('## Betyg (CGPA) och depression');

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
> Den här analysen undersöker om det finns ett samband mellan betyg (CGPA) och hur stor andel av ${genderLabel} som uppger depression.  
> CGPA är ett genomsnittligt betygssystem i Indien, ofta mellan 0 och 10.  
> Depression är kodad som \`1 = Ja\`, \`0 = Nej\`, så medelvärdet visar andelen som uppgett depression.

Tabellen och diagrammet visar hur andelen som uppger depression förändras beroende på betyget, avrundat till hela tal (t.ex. 6, 7, 8).
`);

addMdToPage(`
> **Notering:** Värdet CGPA = 0 har uteslutits eftersom endast 9 personer uppgav detta, vilket inte är ett tillräckligt underlag för att dra säkra slutsatser.
`);

let cgpaDepression = await dbQuery(`
  SELECT ROUND(cgpa, 0) as roundedCgpa, 
         ROUND(AVG(depression), 2) as depressionRate, 
         COUNT(*) as total 
  FROM result_new 
  ${genderFilter}
  GROUP BY roundedCgpa 
  HAVING roundedCgpa > 0
  ORDER BY roundedCgpa;
`);

tableFromData({ data: cgpaDepression });

let cgpaChartData = makeChartFriendly(cgpaDepression, {
  x: "roundedCgpa",
  y: "depressionRate"
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
