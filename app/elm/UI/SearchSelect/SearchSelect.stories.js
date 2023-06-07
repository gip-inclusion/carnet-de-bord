import { Elm as AutocompleteElm } from './Autocomplete_Stories.elm';
import { Elm as ClassicElm } from './Classic_Stories.elm';
import classicSource from './Classic_Stories.elm?raw';
import { ElmComponent } from 'elm-storybook';

export default {
	title: 'UI/SearchSelect',
	parameters: { elmSource: classicSource },
	argTypes: {
		onAction: { action: 'Elm' },
	},
};

export const Classic = (controls) =>
	ElmComponent.create(ClassicElm.UI.SearchSelect.Classic_Stories, controls);

export const Autocomplete = (controls) =>
	ElmComponent.create(AutocompleteElm.UI.SearchSelect.Autocomplete_Stories, controls);
