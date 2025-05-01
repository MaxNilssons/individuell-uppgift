import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Akademisk press och depression');

addMdToPage(`
> **Notering:** Extremvärdet med \`academicPressure = 0\` har tagits bort eftersom endast 9 personer svarade så. Det är för få för att dra några säkra slutsatser, och värdet riskerade att snedvrida analysen.

Diagrammet visar sambandet mellan upplevd akademisk press (skala 1 till 5) och andelen studenter som uppgett att de lider av depression.  
Eftersom depression är kodad som 1 = "Ja" och 0 = "Nej", motsvarar värdet på y-axeln andelen som svarat "ja".

Till exempel:
- Vid \`academicPressure = 1\` är medelvärdet 0,19 ⇒ **19 %** uppger depression.
- Vid \`academicPressure = 5\` är det 0,86 ⇒ **hela 86 %** uppger depression.

Det tyder på ett starkt samband där ökad akademisk press också innebär att fler studenter lider av psykisk ohälsa.
`);

let pressureAndDepression = await dbQuery(`
  SELECT academicPressure, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total 
  FROM result_new 
  WHERE academicPressure > 0
  GROUP BY academicPressure 
  ORDER BY academicPressure;
`);

tableFromData({ data: pressureAndDepression });

let pressureChartData = [['Akademisk press', 'Andel depression']];
pressureAndDepression.forEach(row => {
  if (row.academicPressure !== null && row.depressionRate !== null) {
    pressureChartData.push([
      parseFloat(row.academicPressure),
      parseFloat(row.depressionRate)
    ]);
  }
});

addMdToPage('### Diagram: Akademisk press och depression');
drawGoogleChart({
  type: 'LineChart',
  data: pressureChartData,
  options: {
    title: 'Samband mellan akademisk press och depression',
    hAxis: { title: 'Upplevd akademisk press (skala 1–5)' },
    vAxis: { title: 'Andel med depression (0–1)' },
    pointSize: 5,
    height: 500,
    curveType: 'function',
    legend: 'none'
  }
});
