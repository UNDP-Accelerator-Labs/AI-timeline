import { getData, nest } from './helpers.mjs';
import { d3_extended as d3 } from './d3.extensions.mjs';

export async function render (containerElem) {
	const eventsData = await getData('events');
	const nested = nest.call(eventsData.filter(d => !isNaN(+d.year)), 'year');
	const split = [[],[]];
	nested.forEach((d, i) => {
		d.key = +d.key;
		split[i % 2].push(d);
	});

	const timescale = d3.scaleLinear(d3.extent(nested, d => d.key), [0, 10000]);

	const data = await getData('periods');
	data.forEach(d => {
		d.dates = d.period.split('-').map(c => +c);
	});

	const container = d3.select(containerElem);
	const entries = container.addElems('div', 'periods')
		.addElems('div', 'period', data)
		.each(function (d) {
			console.log(d)
			d3.select(this).classed(d.subcategory, true);
		}).style('top', d => `${timescale(d.dates[0])}px`)
		.style('height', d => `${timescale(d.dates[1]) - timescale(d.dates[0])}px`);
}