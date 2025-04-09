import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';



addMdToPage('## Grade (CGPA) och depression');

let cgpaDepression = await dbQuery(`
  SELECT ROUND(cgpa, 0) as roundedCgpa, 
         ROUND(AVG(depression), 2) as depressionRate, 
         COUNT(*) as total 
  FROM result_new 
  GROUP BY roundedCgpa 
  ORDER BY roundedCgpa;
`);
tableFromData({ data: cgpaDepression });


let cgpaChartData = [['CGPA', 'Depression Rate']];
cgpaDepression.forEach(row => {
  if (row.roundedCgpa !== null && row.depressionRate !== null) {
    cgpaChartData.push([parseFloat(row.roundedCgpa), parseFloat(row.depressionRate)]);
  }
});

addMdToPage('### Diagram: Grade (CGPA) vs Depression');
drawGoogleChart({
  type: 'LineChart',
  data: cgpaChartData,
  options: {
    title: 'CGPA vs Average Depression',
    hAxis: { title: 'Rounded CGPA' },
    vAxis: { title: 'Depression Rate' },
    pointSize: 5,
    curveType: 'function',
    legend: 'none',
    height: 500
  }
});

