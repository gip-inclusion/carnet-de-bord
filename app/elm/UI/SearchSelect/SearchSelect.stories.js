import { Elm } from './Stories.elm';
import elmSource from './Stories.elm?raw';
import { ElmComponent } from 'elm-storybook';

export default {
	title: 'SearchSelect',
	parameters: { elmSource },
	argTypes: {
		onAction: { action: 'Elm' },
	},
};

export const SearchSelect = (controls) =>
	ElmComponent.create(Elm.UI.SearchSelect.Stories, controls);
