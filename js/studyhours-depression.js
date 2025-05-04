addMdToPage('## Arbets- och studietid per dag och depression');


const selectedGender = await addDropdown('Kön:', ['Alla', 'Man', 'Kvinna']);
const genderLabel = selectedGender === 'Alla'
  ? 'alla studenter'
  : selectedGender === 'Man'
    ? 'manliga studenter'
    : 'kvinnliga studenter';

let genderFilter = '';
if (selectedGender === 'Man') {
  genderFilter = `AND gender = 'Male'`;
} else if (selectedGender === 'Kvinna') {
  genderFilter = `AND gender = 'Female'`;
}


addMdToPage(`
> Den här analysen undersöker om det finns ett samband mellan den totala arbetsbelastningen per dag (studier + extrajobb tror jag var sagt) och förekomsten av depression bland ${genderLabel}.  
> Antagandet är att en högre totalbelastning kan vara kopplad till ökad risk för psykisk ohälsa.

Valt kön: **${selectedGender}**
`);


let groupResult = await dbQuery(`
  SELECT workStudyHours, 
         ROUND(AVG(depression), 2) as avgDepression, 
         COUNT(*) as total
  FROM result_new
  WHERE workStudyHours IS NOT NULL ${genderFilter}
  GROUP BY workStudyHours
  ORDER BY workStudyHours;
`);

tableFromData({ data: groupResult });

let chartData = [['Work + Study Hours', 'Genomsnittlig depression']];
groupResult.forEach(row => {
  chartData.push([
    parseFloat(row.workStudyHours),
    parseFloat(row.avgDepression)
  ]);
});

addMdToPage('### Diagram: Arbets- och studietid per dag och depression');
drawGoogleChart({
  type: 'LineChart',
  data: chartData,
  options: {
    title: `Samband mellan arbete/studier och depression (${selectedGender})`,
    hAxis: { title: 'Timmar per dag (studier + extrajobb)' },
    vAxis: {
      title: 'Andel deprimerade (medelvärde)',
      minValue: 0,
      maxValue: 1
    },
    pointSize: 5,
    curveType: 'function',
    height: 450,
    legend: 'none'
  }
});

// Tolkning
addMdToPage(`
---

## Tolkning

Det visar  en viss variation i depression beroende på hur mycket studenter arbetar och studerar per dag.  
Men för att verkligen förstå sambandet behöver vi även räkna ut korrelation på individnivå.

---
`);

// Individdata för korrelation och scatterplot
let indivData = await dbQuery(`
  SELECT workStudyHours, depression 
  FROM result_new
  WHERE workStudyHours IS NOT NULL AND depression IS NOT NULL
  ${genderFilter}
`);

// Slumpa max 500 rader för visualisering---> inte all data. to much?
let sample = indivData.sort(() => 0.5 - Math.random()).slice(0, 500);

let x = [], y = [], scatterData = [['Work + Study Hours', 'Depression']];
sample.forEach(row => {
  const h = parseFloat(row.workStudyHours);
  const d = parseFloat(row.depression);
  if (!isNaN(h) && !isNaN(d)) {
    x.push(h);
    y.push(d);
    const jitter = (Math.random() - 0.5) * 0.1;
    scatterData.push([h, d + jitter]);
  }
});

const r = ss.sampleCorrelation(x, y);

addMdToPage(`
---

## Korrelation per individ

**Korrelationskoefficient (r):** ${r.toFixed(3)}  
Ett positivt värde indikerar att högre arbetsbelastning tenderar att hänga ihop med ökad förekomst av depression.

Observera att detta endast är ett statistiskt samband, inte ett bevis för orsak och verkan.

---
`);

drawGoogleChart({
  type: 'ScatterChart',
  data: scatterData,
  options: {
    title: 'Korrelation mellan arbets- och studietid och depression (individuella svar)',
    hAxis: { title: 'Work + Study Hours per Day' },
    vAxis: { title: 'Depression (0 = nej, 1 = ja)' },
    pointSize: 5,
    height: 450,
    legend: 'none',
    trendlines: { 0: {} }
  }
});

addMdToPage(`
---

## Reflektion

Analysen ger indikation på att hög arbets- och studietid kan ha viss koppling till ökad psykisk ohälsa.  
Men sambandet är inte helt linjärt, och andra faktorer som återhämtning, sömn och livssituation kan också påverka och väga in i resultatet.

---
`);