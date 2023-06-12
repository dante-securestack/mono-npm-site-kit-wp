/**
 * GhostCardsSVG component.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useWindowWidth } from '@react-hook/window-size/throttled';

/**
 * WordPress dependencies
 */
import { lazy, Suspense } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PreviewBlock from '../../components/PreviewBlock';
import MediaErrorHandler from '../../components/MediaErrorHandler';
const LazyGhostCardsWideSVG = lazy( () =>
	import( '../../../svg/graphics/ghost-cards.svg' )
);
const LazyGhostCardsTabletSVG = lazy( () =>
	import( '../../../svg/graphics/ghost-cards-tablet.svg' )
);
const LazyGhostCardsMobileSVG = lazy( () =>
	import( '../../../svg/graphics/ghost-cards-mobile.svg' )
);

export default function GhostCardsSVG() {
	const windowWidth = useWindowWidth();

	let GhostCardComponent;
	if ( windowWidth > 783 ) {
		GhostCardComponent = <LazyGhostCardsWideSVG />;
	} else if ( windowWidth <= 783 && windowWidth > 600 ) {
		GhostCardComponent = <LazyGhostCardsTabletSVG />;
	} else {
		GhostCardComponent = <LazyGhostCardsMobileSVG />;
	}

	return (
		<Suspense fallback={ <PreviewBlock width="100%" height="90px" /> }>
			<MediaErrorHandler
				errorMessage={ __(
					'Failed to load graphic.',
					'google-site-kit'
				) }
			>
				{ GhostCardComponent }
			</MediaErrorHandler>
		</Suspense>
	);
}
