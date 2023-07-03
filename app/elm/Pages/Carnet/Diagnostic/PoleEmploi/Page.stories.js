import { Elm } from './Stories.elm';
import elmSource from './Stories.elm?raw';
import { ElmComponent } from 'elm-storybook';

export default {
	title: 'Pages/Carnet/Diagnostic/PoleEmploi',
	parameters: { elmSource },
	argTypes: {
		onAction: { action: 'Elm' },
	},
};

export const Page = (controls) => {
	return ElmComponent.create(Elm.Pages.Carnet.Diagnostic.PoleEmploi.Stories, controls);
};
