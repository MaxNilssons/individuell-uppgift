
addMdToPage('## 📊 Korrelation mellan CGPA och depression (medelvärde per betygsgrupp)');

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

addMdToPage(`---

##  Resultat

**Korrelationskoefficient (r):** ${r.toFixed(3)}  

- Detta visar hur starkt sambandet är mellan **betyg** och **andelen deprimerade** per CGPA-nivå.
- Ett värde nära 1 eller -1 indikerar ett starkt samband, medan ett värde nära 0 indikerar ett svagt samband.

---

##  Fördel med detta tillvägagångssätt

Eftersom vi räknar på **medelvärden per grupp**, dämpas brus och eventuella extremvärden. Det gör att sambandet blir lättare att visualisera och tolka.

Men tänk på att:

- Antalet studenter per CGPA-nivå varierar
- Vi kan fortfarande inte säga något om **orsakssamband**

---
`);
