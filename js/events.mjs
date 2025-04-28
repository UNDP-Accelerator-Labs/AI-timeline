import { getData, nest } from './helpers.mjs';
import { d3_extended as d3 } from './d3.extensions.mjs';

export async function render (containerElem) {
	const data = await getData('events');
	const nested = nest.call(data.filter(d => !isNaN(+d.year)), 'year');
	const split = [[],[]];
	nested.forEach((d, i) => {
		d.key = +d.key;
		split[i % 2].push(d);
	});

	const timescale = d3.scaleLinear(d3.extent(nested, d => d.key), [0, 10000]);

	const container = d3.select(containerElem);
	const entries = container.addElems('div', 'column', split)
	.addElems('div', 'date hide', d => d)
		.attr('tabindex', (d, i) => i + 1)
		.attr('data-year', d => d.key)
		.style('top', d => `${timescale(d.key)}px`)
	.on('focus', function () {
		d3.select(this).classed('hide', false);
	}).addElems('div', 'entry', d => d.values)
		.each(function (d) {
			d3.select(this).classed(d.category, true)
			d3.select(this.parentNode).moveToFront();
		})
	
	entries.addElems('small', 'category', d => d.category?.length && d.category !== 'citation' ? [d] : [])
		.html(d => `[${d.category}: ${d.subcategory}]`)
	entries.addElems('small', 'places', d => d.places?.length ? [d] : [])
		.html(d => `${d.places.split(';')}`)
	entries.addElems('h2', 'title', d => d.name?.length ? [d] : [])
		.addElems('a')
		.attr('href', d => d.links?.split()[0] || '#')
		.attr('target', '_blank')
		.html(d => d.name)
	entries.addElems('div', 'concepts', d => d.concepts?.length ? [d] : [])
		.addElems('button', 'concept chip', d => d.concepts.split(','))
		.html(d => d)
	entries.addElems('p', 'description')
		.html(d => {
			if (d.category === 'citation') return `“${d.description}”`;
			else return d.description
		})
	entries.addElems('div', 'people', d => d.people?.length ? [d] : [])
		.addElems('button', 'person chip', d => d.people.split(','))
		.html(d => d)
}