import { createElement } from 'preact';
import Display from '../display';

export default function createDisplay(context, menuItemText) {
	return props => (
		<Display {...props}>{{context}}</Display>
	);
}
