//Load components from Zimbra
import { createElement } from "preact";

//Load the createDisplay function from our Zimlet component
import createDisplay from "./components/createDisplay";

//Create function by Zimbra convention
export default function Zimlet(context) {
	//Get the 'plugins' object from context and define it in the current scope
	const { plugins } = context;
	const exports = {};

	//moreMenu stores a Zimlet menu item. We pass context to it here
	const display = createDisplay(context);

	exports.init = function init() {
		//Here we load the moreMenu Zimlet item into the UI slot:
		plugins.register('slot::message-body-top', display);
	};

	return exports;
}
