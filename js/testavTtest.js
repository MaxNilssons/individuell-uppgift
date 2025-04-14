import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## T-test: CGPA < 7 vs ≥ 7 och depression');

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

## 🧪 T-test: CGPA och depression

I denna undersökning ville jag ta reda på om det finns en **signifikant skillnad i andelen studenter med depression beroende på deras betyg (CGPA)**. Jag delade upp studenterna i två grupper:

- 👥 **Grupp 1:** Studenter med CGPA **under 7.0**  
- 👥 **Grupp 2:** Studenter med CGPA **7.0 eller högre**

Eftersom depression från början innehöll "ja/nej" och senare omvandlats till 0/1, kan vi tolka medelvärdet som **andel deprimerade i respektive grupp**.

---

### 🧠 Hypotesprövning

- **Nollhypotes (H₀):** Det finns **ingen skillnad** i andelen deprimerade mellan studenter med låg och hög CGPA.  
- **Alternativ hypotes (H₁):** Det finns **en signifikant skillnad** i andelen deprimerade mellan de två grupperna.

---

### 📈 Resultat från t-test

- **Andel deprimerade (CGPA < 7):** ${(meanLow * 100).toFixed(2)} %  
- **Andel deprimerade (CGPA ≥ 7):** ${(meanHigh * 100).toFixed(2)} %  
- **t-värde:** ${tValue.toFixed(4)}  
- **Frihetsgrader (df):** ${df.toFixed(1)}  
- **p-värde:** ${pValue.toFixed(4)}

---

### ✅ Slutsats

Eftersom p-värdet är mindre än 0.05 kan vi **förkasta nollhypotesen**.  
Detta tyder på att akademiska prestationer kan ha en koppling till psykisk ohälsa –  
eller åtminstone att det finns ett mätbart samband mellan betyg och depressionsnivåer.

---
`);
