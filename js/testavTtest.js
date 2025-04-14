import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';

addMdToPage('## Test av t-test mellan grupper baserat på sömntimmar');

let rawSleepData = await dbQuery(`
  SELECT sleepDuration, depression
  FROM result_new
  WHERE sleepDuration IS NOT NULL
    AND depression IS NOT NULL
`);

let groupA = []; // Sömn ≥ 7h
let groupB = []; // Sömn < 7h

// Extra kontroll med isFinite
rawSleepData.forEach(row => {
  const sleep = parseFloat(row.sleepDuration);
  const depression = parseFloat(row.depression);

  if (isFinite(sleep) && isFinite(depression)) {
    if (sleep >= 7) {
      groupA.push(depression);
    } else {
      groupB.push(depression);
    }
  }
});

// 🔍 Logga datan i grupperna
console.log('Grupp A exempel:', groupA.slice(0, 10));
console.log('Grupp B exempel:', groupB.slice(0, 10));
console.log('Totalt i grupp A:', groupA.length);
console.log('Totalt i grupp B:', groupB.length);

if (groupA.length < 3 || groupB.length < 3) {
  addMdToPage(`❗ För få datapunkter för att genomföra t-test. Grupp A: ${groupA.length}, Grupp B: ${groupB.length}`);
} else {
  const meanA = ss.mean(groupA);
  const meanB = ss.mean(groupB);
  const diff = Math.abs(meanA - meanB).toFixed(3);

  const tValue = ss.tTestTwoSample(groupA, groupB, { equalVariance: false });

  console.log('t-värde:', tValue); // 👈 Debug t-värdet

  addMdToPage(`### t-test: Sömn ≥ 7h vs < 7h  
- Antal i grupp A (≥7h): ${groupA.length}  
- Antal i grupp B (<7h): ${groupB.length}  
- Medel depression (≥7h): ${meanA.toFixed(2)}  
- Medel depression (<7h): ${meanB.toFixed(2)}  
- Skillnad i medelvärde: ${diff}  
- t-värde: ${isFinite(tValue) ? tValue.toFixed(4) : '❌ t-värde kunde inte beräknas'}
*(p-värde ej beräknat – kräver extern funktion eller serveranalys)*`);
}
