

addMdToPage('## Test av normalfördelning – CGPA');

let cgpaData = await dbQuery(`
  SELECT cgpa
  FROM result_new
`);

let values = [];
cgpaData.forEach(row => {
  const v = parseFloat(row.cgpa);
  if (!isNaN(v)) values.push(v);
});


let bins = {};
let binSize = 0.5;

values.forEach(value => {
  let rounded = Math.floor(value / binSize) * binSize;
  bins[rounded] = (bins[rounded] || 0) + 1;
});

let chartData1 = [['CGPA', 'Antal studenter']];
Object.entries(bins).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).forEach(([cgpa, count]) => {
  chartData1.push([parseFloat(cgpa), count]);
});


drawGoogleChart({
  type: 'ColumnChart',
  data: chartData1,
  options: {
    title: 'Diagram över CGPA – Är det normalfördelat?',
    hAxis: { title: 'CGPA (avrundat till 0.5)' },
    vAxis: { title: 'Antal studenter' },
    legend: 'none',
    height: 400,
    bar: { groupWidth: '90%' }
  }
});

addMdToPage(`---

## Vad är normalfördelning?

En normalfördelning är en klockformad kurva där:

- De flesta värden ligger nära medelvärdet
- Färre värden finns längre från mitten (i båda riktningar)
- Fördelningen är symmetrisk

---

### Vad visar datan som jag visualiserat?

Det ovan visar hur studenternas betyg (CGPA) är fördelade. Det vi ser är:

- Betyg mellan 5 och 9 är vanligast – där finns tusentals studenter i varje kategori.
- Det finns väldigt få studenter med CGPA 10 – de sticker ut som extremvärden.
- Fördelningen liknar inte en perfekt klockform (normalfördelning), utan är lite ojämn och skev.
- Det ser ut att finnas flera toppar snarare än en enda tydlig mittpunkt.

---

### Slutsats

- CGPA i detta dataset är inte perfekt normalfördelat.
- Det är data med färre studenter i ytterkanten och fler i mitten – men inte helt symmetriskt.
- Därför bör vi vara försiktiga när vi använder metoder som t-test eller linjär regression, som ofta antar att datan är normalfördelad.

CGPA är delvis normalfördelat, men inte exakt. En perfekt normalfördelning skulle ha haft en enda tydlig topp i mitten och varit spegelvänd åt båda håll.

---`);

addMdToPage(`---

## Varför båda testerna visas på samma sida

Innan jag gjorde t-testet för att jämföra depression mellan CGPA-grupper ville jag först undersöka hur CGPA är fördelat.  
Eftersom många statistiska tester, som t-test, bygger på antagandet att datan är normalfördelad, är det viktigt att förstå datans form innan man tolkar resultatet.

---`);

addMdToPage('## T-test: CGPA och depression');

let rawData = await dbQuery(`
  SELECT cgpa, depression
  FROM result_new
  WHERE cgpa IS NOT NULL AND depression IS NOT NULL
`);

let lowGroup = [];
let highGroup = [];

rawData.forEach(row => {
  const cgpa = parseFloat(row.cgpa);
  const depression = parseFloat(row.depression);
  if (!isFinite(cgpa) || !isFinite(depression)) return;

  if (cgpa < 7) {
    lowGroup.push(depression);
  } else {
    highGroup.push(depression);
  }
});

const meanLow = ss.mean(lowGroup);
const meanHigh = ss.mean(highGroup);
const varLow = ss.variance(lowGroup);
const varHigh = ss.variance(highGroup);
const nLow = lowGroup.length;
const nHigh = highGroup.length;

const numerator = meanLow - meanHigh;
const denominator = Math.sqrt(varLow / nLow + varHigh / nHigh);
const tValue = numerator / denominator;

const df = Math.pow(varLow / nLow + varHigh / nHigh, 2) /
  (Math.pow(varLow / nLow, 2) / (nLow - 1) + Math.pow(varHigh / nHigh, 2) / (nHigh - 1));

const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tValue), df));

addMdToPage(`### Resultat av t-test: CGPA < 7 vs ≥ 7  
- Antal i låg CGPA-grupp: ${nLow}  
- Antal i hög CGPA-grupp: ${nHigh}  
- Andel deprimerade (CGPA < 7): ${(meanLow * 100).toFixed(2)}%  
- Andel deprimerade (CGPA ≥ 7): ${(meanHigh * 100).toFixed(2)}%  
- t-värde: ${tValue.toFixed(4)}  
- Frihetsgrader (df): ${df.toFixed(1)}  
- p-värde: ${pValue.toFixed(4)}  
`);

addMdToPage('### Diagram: Andel deprimerade i låg vs hög CGPA');

const chartData = [
  ['CGPA-grupp', 'Andel deprimerade'],
  ['< 7', parseFloat((meanLow * 100).toFixed(2))],
  ['≥ 7', parseFloat((meanHigh * 100).toFixed(2))]
];

drawGoogleChart({
  type: 'ColumnChart',
  data: chartData,
  options: {
    title: 'Depression (%) i låg vs hög CGPA (gräns: 7.0)',
    hAxis: { title: 'CGPA-grupp' },
    vAxis: {
      title: 'Andel deprimerade (%)',
      minValue: 0,
      maxValue: 100
    },
    height: 400,
    legend: 'none'
  }
});

addMdToPage(`---

## Tolkning av resultatet

I denna undersökning ville jag ta reda på om det finns en signifikant skillnad i andelen studenter med depression beroende på deras betyg (CGPA). Jag delade upp studenterna i två grupper:

- Grupp 1: Studenter med CGPA under 7.0  
- Grupp 2: Studenter med CGPA 7.0 eller högre

Eftersom depression från början innehöll "ja/nej" och senare omvandlats till 0/1, kan vi tolka medelvärdet som andel deprimerade i respektive grupp.

---

### Hypotesprövning

- Nollhypotes (H₀): Det finns ingen skillnad i andelen deprimerade mellan studenter med låg och hög CGPA.  
- Alternativ hypotes (H₁): Det finns en signifikant skillnad i andelen deprimerade mellan de två grupperna.

---

### Slutsats

Eftersom p-värdet är mindre än 0.05 kan vi förkasta nollhypotesen.  
Detta tyder på att akademiska prestationer kan ha en koppling till psykisk ohälsa –  
eller åtminstone att det finns ett mätbart samband mellan betyg och depressionsnivåer.

---`);
