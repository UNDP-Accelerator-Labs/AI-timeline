import { render as renderEvents } from './events.mjs';
import { render as renderPeriods } from './periods.mjs';

const onLoad = async function () {
	renderPeriods('body');
	renderEvents('main');
}

if (document.readyState === 'loading') {
 	document.addEventListener('DOMContentLoaded', onLoad);
} else {
	await onLoad();
}
