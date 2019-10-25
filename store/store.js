let chart_store = [];

/** The function stores information for the chart builder
 *
 * @param {String} title Chart Name
 * @param {Array<String>} line_names Array with line names
 * @param {Array<Array<Number>>} line_points Array with arrays of points
 * @param {String} chart ["points" || "lines"]
 */
function plot(title, line_names, line_points, chart, vAxis = [null, null]) {
	// Получаем массив с максимальным количеством элементов
	let x = line_points.reduce(function(accum, element) {
		if (element[0].length > accum[0].length) accum = element;
		return accum[0];
	});

	// Подготавливаем параметр line_points для отправки в chart_builder.js
	line_points = line_points.map(element => interpolate(x, element));
	line_points.unshift(x);

	// Отправка
	chart_store.push({
		title: title,
		line_names: line_names,
		line_points: line_points,
		vAxis: vAxis,
		chart: chart
	});
}

/** Linear interpolation */
function interpolate(x, points) {
	let error = 0.00001;
	let interpolation = [points[1][0]];

	for (let i = 1; i < x.length; i++) {
		let index = points[0].findIndex(element => element > x[i] - error) - 1;

		let [fx0, fx1] = points[1].slice(index);
		let [x0, x1] = points[0].slice(index);

		interpolation.push(fx0 + ((fx1 - fx0) / (x1 - x0)) * (x[i] - x0));
	}
	return interpolation;
}
