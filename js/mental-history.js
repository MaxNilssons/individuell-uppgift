import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## History of mental illness in the family and depression');



let mentalIllness = await dbQuery(`
  SELECT historyMentalIllness, ROUND(AVG(depression), 2) as depressionRate, COUNT(*) as total
  FROM result_new
  GROUP BY historyMentalIllness;
`);


mentalIllness.forEach(row => {
  if (row.historyMentalIllness === 1) {
    row.historyMentalIllness = '1 (Ja)';
  } else if (row.historyMentalIllness === 0) {
    row.historyMentalIllness = '0 (Nej)';
  }
});


tableFromData({ data: mentalIllness });


let mentalChartData = [['History of Mental Illness', 'Depression Rate']];
mentalIllness.forEach(row => {
  let label = row.historyMentalIllness.includes('(Ja)') ? 'Ja' : 'Nej';
  mentalChartData.push([label, parseFloat(row.depressionRate)]);
});


addMdToPage('### Diagram: Mental Illness History and Depression');
drawGoogleChart({
  type: 'ColumnChart',
  data: mentalChartData,
  options: {
    title: 'Mental Illness in Family vs Depression Rate',
    hAxis: { title: 'History of Mental Illness' },
    vAxis: { title: 'Depression Rate' },
    height: 400,
    legend: 'none',
    bar: { groupWidth: '30%' }
  }
});
