import addMdToPage from './libs/addMdToPage.js';
import dbQuery from './libs/dbQuery.js';
import tableFromData from './libs/tableFromData.js';
import drawGoogleChart from './libs/drawGoogleChart.js';

addMdToPage('## Work + Study Hours and Depression');

let studyHoursDepression = await dbQuery(`
  SELECT workStudyHours, ROUND(AVG(depression), 2) as avgDepression, COUNT(*) as total
  FROM result_new 
  GROUP BY workStudyHours 
  ORDER BY workStudyHours;
`);

tableFromData({ data: studyHoursDepression });

let studyChartData = [['Work + Study Hours', 'avgDepression']];
studyHoursDepression.forEach(row => {
  if (row.workStudyHours !== null && row.avgDepression !== null) {
    studyChartData.push([
      parseFloat(row.workStudyHours),
      parseFloat(row.avgDepression)
    ]);
  }
});

addMdToPage('### Diagram: Work + Study Hours and Depression');
drawGoogleChart({
  type: 'LineChart',
  data: studyChartData,
  options: {
    title: 'Work + Study Hours vs Average Depression',
    hAxis: {
      title: 'Work + Study Hours per Day',
      gridlines: { count: -1 }
    },
    vAxis: {
      title: 'avg Depression'
    },
    pointSize: 5,
    curveType: 'function',
    height: 400,
    legend: 'none'
  }
});
