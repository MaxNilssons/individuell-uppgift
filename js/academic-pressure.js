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


addMdToPage(`

---

## Tolkning av resultatet

Resultaten visar ett tydligt samband mellan upplevd akademisk press och andelen studenter som uppger att de lider av depression.
Ju högre press studenterna rapporterar, desto större andel anger att de mår psykiskt dåligt.

Till exempel:
- Bland de som skattar akademisk press som låg (nivå 1), är det endast 19 % som uppger depression.
- Bland de som upplever mycket hög press (nivå 5), är det hela 86 %.

Det tyder på att akademisk press är en viktig faktor att beakta i arbetet med att förebygga psykisk ohälsa bland studenter.

---

## Om datans fördelning

Datan i tabellen är uppdelad i fem nivåer av akademisk press (1 till 5).
Grupperna är ganska jämnt fördelade, vilket gör det möjligt att jämföra dem.
Dock är datan inte normalfördelad i statistisk mening, eftersom den är uppdelad i ett fåtal diskreta nivåer.

Det går ändå att dra slutsatser om mönster i datan, men man bör undvika att använda statistiska tester som kräver normalfördelning,
 såsom klassiskt t-test mellan alla grupper.

Det viktiga här är det tydliga och systematiska sambandet – att ju mer press studenterna känner, desto vanligare är det att de rapporterar depression.

---
`);
