/**
 * AdSense Settings stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import * as fixtures from '../assets/js/modules/adsense/datastore/__fixtures__';
import { STORE_NAME } from '../assets/js/modules/adsense/datastore/constants';
import {
	ACCOUNT_STATUS_PENDING,
	ACCOUNT_STATUS_APPROVED,
	SITE_STATUS_ADDED,
} from '../assets/js/modules/adsense/util/status';
import {
	createTestRegistry,
	provideUserAuthentication,
	provideModules,
	provideModuleRegistrations,
	provideSiteInfo,
} from '../tests/js/utils';
import createLegacySettingsWrapper from './utils/create-legacy-settings-wrapper';

const defaultSettings = {
	accountID: '',
	clientID: '',
	accountStatus: '',
	siteStatus: '',
	useSnippet: true,
	accountSetupComplete: false,
	siteSetupComplete: false,
	ownerID: 0,
};

const completeSettings = {
	...defaultSettings,
	accountID: fixtures.accounts[ 0 ].id,
	clientID: fixtures.clients[ 0 ].id,
	accountStatus: ACCOUNT_STATUS_APPROVED,
	siteStatus: SITE_STATUS_ADDED,
	accountSetupComplete: true,
	siteSetupComplete: true,
	webStoriesAdUnit: '0123456789',
	webStoriesActive: true,
};

const Settings = createLegacySettingsWrapper( 'adsense' );

const setUpAdUnits = ( registry ) => {
	registry.dispatch( STORE_NAME ).receiveGetAdUnits( fixtures.adunits, { accountID: fixtures.accounts[ 0 ].id, clientID: fixtures.clients[ 0 ].id } );
	registry.dispatch( STORE_NAME ).finishResolution( 'getAdUnits', [] );
};

storiesOf( 'AdSense Module/Settings', module )
	.addDecorator( ( storyFn ) => {
		const registry = createTestRegistry();
		registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( STORE_NAME ).receiveIsAdBlockerActive( false );
		provideSiteInfo( registry, { webStoriesActive: true } );
		provideUserAuthentication( registry );
		provideModules( registry, [ {
			slug: 'adsense',
			active: true,
			connected: true,
		} ] );
		provideModuleRegistrations( registry );

		return storyFn( registry );
	} )
	.add( 'View, closed', ( registry ) => {
		return <Settings isOpen={ false } registry={ registry } />;
	} )
	.add( 'View, open with setup incomplete', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			...completeSettings,
			accountStatus: ACCOUNT_STATUS_PENDING,
			accountSetupComplete: false,
			siteSetupComplete: false,
		} );

		const module = {
			...global._googlesitekitLegacyData.modules.adsense,
			active: true,
			setupComplete: false,
		};

		return <Settings isOpen={ true } registry={ registry } module={ module } />;
	} )
	.add( 'View, open with all settings', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( completeSettings );

		return <Settings isOpen={ true } registry={ registry } />;
	} )
	.add( 'Edit, open', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		setUpAdUnits( registry );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, open with existing tag (same account)', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( completeSettings.clientID );
		setUpAdUnits( registry );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, open with existing tag (different account)', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'ca-pub-12345678' );
		setUpAdUnits( registry );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
;
