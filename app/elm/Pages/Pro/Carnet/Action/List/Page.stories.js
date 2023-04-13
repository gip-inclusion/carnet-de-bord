import { Elm } from './Stories.elm';
import elmSource from './Stories.elm?raw';
import { ElmComponent } from 'elm-storybook';

export default {
	title: 'Pages/Pro/Carnet/Action',
	parameters: { elmSource },
	argTypes: {
		onAction: { action: 'Elm' },
		error: { control: 'select', options: ['Ok', 'Line Error', 'Add Error'] },
	},
};

export const List = (controls) => {
	return ElmComponent.create(Elm.Pages.Pro.Carnet.Action.List.Stories, controls);
};
