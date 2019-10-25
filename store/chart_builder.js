// Import google plots
google.charts.load("current", { packages: ["line", "scatter"] });
google.charts.setOnLoadCallback(function() {
	chart();
});

function chart() {
	let chart;
	let data;
	for (let i = 0; i < chart_store.length; i++) {
		// Задаем параметры графика
		let options = {
			chart: {
				title: chart_store[i].title
			},
			width: 1024,
			height: 645,
			vAxis: {
				viewWindow: {
					min: chart_store[i].vAxis[0],
					max: chart_store[i].vAxis[1]
				}
			},
			pointSize: 30,
			pointShape: "circle"
		};

		// Координаты:
		data = new google.visualization.DataTable();
		for (let j = 0; j < chart_store[i].line_names.length; j++) {
			data.addColumn("number", chart_store[i].line_names[j]);
		}
		data.addRows(
			chart_store[i].line_points[0].map((col, j) =>
				chart_store[i].line_points.map(row => row[j])
			)
		);

		// Рисуем
		if (chart_store[i].chart != "points") {
			chart = new google.charts.Line(
				document.getElementById("chart_div" + i)
			);
			chart.draw(data, google.charts.Line.convertOptions(options));
		} else {
			chart = new google.charts.Scatter(
				document.getElementById("chart_div" + i)
			);
			chart.draw(data, google.charts.Scatter.convertOptions(options));
		}
	}
}
