addMdToPage('## Korrelation mellan CGPA och depression (medelvärde per betygsgrupp)');


let groupedData = await dbQuery(`
  SELECT ROUND(cgpa, 0) as roundedCgpa,
         ROUND(AVG(depression), 4) as avgDepression
  FROM result_new
  GROUP BY roundedCgpa
  ORDER BY roundedCgpa
`);

let corrData = [['CGPA', 'Genomsnittlig depression']];
let x = [];
let y = [];

groupedData.forEach(row => {
  const cgpa = parseFloat(row.roundedCgpa);
  const avgDep = parseFloat(row.avgDepression);
  if (!isNaN(cgpa) && !isNaN(avgDep)) {
    corrData.push([cgpa, avgDep]);
    x.push(cgpa);
    y.push(avgDep);
  }
});

const r = ss.sampleCorrelation(x, y);

// Visa linjediagram för medelvärden
drawGoogleChart({
  type: 'LineChart',
  data: corrData,
  options: {
    title: 'Genomsnittlig depression per CGPA',
    hAxis: { title: 'CGPA (avrundad)' },
    vAxis: {
      title: 'Andel deprimerade (medelvärde)',
      minValue: 0,
      maxValue: 1
    },
    curveType: 'function',
    pointSize: 6,
    height: 400,
    legend: 'none'
  }
});

// Tolkning under linjediagrammet
addMdToPage(`
---

## Tolkning av genomsnitt per betygsgrupp

Detta diagram visar trenden i genomsnittlig depression för varje CGPA-nivå.
Även om det ser ut att finnas en ökning, ger diagrammet i sig ingen exakt uppfattning om styrkan i sambandet.
För det krävs en korrelationsanalys baserad på fler datapunkter, vilket visualiseras nedan.

Eftersom detta är baserat på medelvärden per CGPA-grupp blir trenden tydlig utan att påverkas av extremvärden.
Däremot är det viktigt att inte dra slutsatser om orsakssamband.
Det kan finnas bakomliggande faktorer som påverkar både betyg och psykisk hälsa – till exempel stress, familjeförväntningar eller arbetsbörda.

Tänk också på att:
- Antalet studenter i varje CGPA-grupp kan variera
- En stark korrelation innebär inte att höga betyg orsakar depression

---
`);

// Förbered scatterdata
let scatterData = [['CGPA', 'Depression']];
for (let i = 0; i < x.length; i++) {
  scatterData.push([x[i], y[i]]);
}

// Visa scatterdiagram
drawGoogleChart({
  type: 'ScatterChart',
  data: scatterData,
  options: {
    title: 'Korrelation mellan CGPA och depression (datapunkter)',
    hAxis: { title: 'CGPA (avrundad)' },
    vAxis: { title: 'Genomsnittlig depression' },
    pointSize: 5,
    height: 400,
    legend: 'none',
    trendlines: { 0: {} }
  }
});

// Analys under scatterdiagrammet
addMdToPage(`
---

## Visualisering med datapunkter

Korrelationskoefficient (r): ${r.toFixed(3)}

Resultatet visar ett starkt positivt samband mellan betygsnivå (CGPA) och förekomst av depression.
En korrelationskoefficient på ${r.toFixed(3)} tyder på att depression tenderar att öka med högre CGPA.
Det kan verka oväntat, men det är möjligt att prestationsångest, press eller höga förväntningar är faktorer som påverkar psykiskt mående hos studenter med höga betyg.

---

## Fördjupad observation

Ett intressant mönster är att studenter med nästan högsta betyg (till exempel CGPA 9) verkar rapportera högre andel depression än de som faktiskt når CGPA 10.
Det skulle kunna bero på att dessa studenter upplever störst press, är mest självkritiska, eller strävar efter perfektion utan att riktigt nå dit.

Denna typ av observation bör tolkas med försiktighet eftersom den kan påverkas av andra faktorer, stora som små.

---
`);
