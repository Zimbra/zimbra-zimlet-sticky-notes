import { createElement } from 'preact';
import Display from '../display';

export default function createDisplay(context) {
	return props => (
		<Display {...props}>{{context}}</Display>
	);
}
