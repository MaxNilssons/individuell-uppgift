const gender = await addDropdown('Kön:', ['Alla', 'Man', 'Kvinna']);

addMdToPage('## Studienöjdhet och depression');

addMdToPage(`
Den här analysen undersöker om det finns ett samband mellan hur nöjd en student är med sina studier och om de uppger att de lider av depression.

Nöjdhet mäts på en skala från 1 (mycket missnöjd) till 5 (mycket nöjd), och depression är kodad som 1 = "Ja", 0 = "Nej".
Medelvärdet visar alltså andelen i varje grupp som svarat att de är deprimerade.

Valt kön: **${gender}**
`);

let where = "studySatisfaction BETWEEN 1 AND 5";
if (gender === 'Man') {
  where += " AND gender = 'Male'";
} else if (gender === 'Kvinna') {
  where += " AND gender = 'Female'";
}

let results = await dbQuery(`
  SELECT studySatisfaction, 
         ROUND(AVG(depression), 2) AS avgDepression,
         COUNT(*) AS total
  FROM result_new
  WHERE ${where}
  GROUP BY studySatisfaction
  ORDER BY studySatisfaction
`);

tableFromData({ data: results });

let chartData = [['Studienöjdhet', 'Andel depression']];
results.forEach(row => {
  chartData.push([
    parseFloat(row.studySatisfaction),
    parseFloat(row.avgDepression)
  ]);
});

addMdToPage('### Diagram: Studienöjdhet och depression');

drawGoogleChart({
  type: 'LineChart',
  data: chartData,
  options: {
    title: 'Samband mellan studienöjdhet och depression',
    hAxis: { title: 'Nöjdhet med studier (1 = missnöjd, 5 = mycket nöjd)' },
    vAxis: { title: 'Andel deprimerade', minValue: 0, maxValue: 1 },
    pointSize: 6,
    height: 500,
    curveType: 'function',
    legend: 'none'
  }
});

addMdToPage(`
---

## Tolkning av genomsnittsanalys

Resultatet visar ett tydligt negativt samband: ju nöjdare studenter är med sina studier, desto mindre andel uppger att de är deprimerade.

Till exempel:
- Vid studySatisfaction = 1 är andelen deprimerade 71 %
- Vid studySatisfaction = 5 är andelen 47 %

Men eftersom detta bygger på medelvärden per grupp, kan vi inte vara helt säkra på styrkan i sambandet. Därför räknar vi nedan korrelation på individnivå också.

---
`);

// Korr på individnivå
let indivData = await dbQuery(`
  SELECT studySatisfaction, depression 
  FROM result_new 
  WHERE studySatisfaction BETWEEN 1 AND 5 
    AND depression IS NOT NULL
    ${gender === 'Man' ? "AND gender = 'Male'" : gender === 'Kvinna' ? "AND gender = 'Female'" : ""}
`);

// Slumpa fram max 500 datapunkter. Inte mer, 27k rader känns alot.
let indivSample = indivData.sort(() => 0.5 - Math.random()).slice(0, 500);

let x = [], y = [], scatterData = [['Studienöjdhet', 'Depression']];
indivSample.forEach(row => {
  const satisfaction = parseFloat(row.studySatisfaction);
  let depression = parseFloat(row.depression);
  if (!isNaN(satisfaction) && !isNaN(depression)) {
    x.push(satisfaction);
    y.push(depression);
    const jitter = (Math.random() - 0.5) * 0.1; //Jitter sprider ut punkterna litegrann
    scatterData.push([satisfaction, depression + jitter]);
  }
});

const r = ss.sampleCorrelation(x, y);

addMdToPage(`
---

## Korrelation per individ

För att fördjupa analysen har vi även räknat korrelation på individnivå – alltså utan att först gruppera svaren.

**Korrelationskoefficient (r):** ${r.toFixed(3)}

Ett värde nära -1 tyder på ett starkt negativt samband, vilket innebär att högre studienöjdhet hänger ihop med lägre förekomst av depression.

---
`);

drawGoogleChart({
  type: 'ScatterChart',
  data: scatterData,
  options: {
    title: 'Korrelation mellan studienöjdhet och depression (urval av individer)',
    hAxis: { title: 'Nöjdhet med studier (1–5)' },
    vAxis: { title: 'Depression (0 = nej, 1 = ja)' },
    pointSize: 5,
    height: 500,
    legend: 'none',
    trendlines: { 0: {} }
  }
});

addMdToPage(`
---

## Reflektion

Den negativa korrelationen stärks av både linjediagrammet och scatterdiagrammet.

Det visar tydligt att psykiskt mående verkar hänga ihop med hur nöjda studenterna är med sina studier.
Även om vi inte kan avgöra vad som orsakar vad, ger detta ett starkt underlag för vidare diskussion.

---
`);
