/**
 * `useInView` hook tests.
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
 * Internal dependencies
 */
import { actHook as act, renderHook } from '../../../tests/js/test-utils';
import { useInView } from './useInView';

describe( 'useInView', () => {
	it( 'should return true when a parent <InViewProvider /> has a `true` value', () => {
		const { result } = renderHook( () => useInView(), { inView: true } );

		expect( result.current ).toEqual( true );
	} );

	it( 'should return false when a parent <InViewProvider /> has a `false` value', () => {
		const { result } = renderHook( () => useInView(), { inView: false } );

		expect( result.current ).toEqual( false );
	} );

	it( 'should return true if <InViewProvider /> has a `false` value, but then is updated to `true`', () => {
		const { result, setInView } = renderHook( () => useInView(), {
			inView: false,
		} );

		expect( result.current ).toEqual( false );

		act( () => setInView( true ) );

		expect( result.current ).toEqual( true );
	} );

	it( 'should return true if `{ sticky: true }` is set when a parent <InViewProvider /> has a `false` value, if <InViewProvider /> has been `true` once', () => {
		const { result, setInView } = renderHook(
			() => useInView( { sticky: true } ),
			{
				inView: true,
			}
		);

		expect( result.current ).toEqual( true );

		act( () => setInView( false ) );

		expect( result.current ).toEqual( true );
	} );

	it( 'should return false if `{ sticky: false }` is set when a parent <InViewProvider /> has a `false` value, if <InViewProvider /> has been `true` once', () => {
		const { result, setInView } = renderHook(
			() => useInView( { sticky: false } ),
			{
				inView: true,
			}
		);

		expect( result.current ).toEqual( true );

		act( () => setInView( false ) );

		expect( result.current ).toEqual( false );
	} );

	it( 'should change the return value if the sticky prop is updated', () => {
		let sticky = true;

		const { result, rerender, setInView } = renderHook(
			() => useInView( { sticky } ),
			{
				inView: true,
			}
		);

		expect( result.current ).toEqual( true );

		act( () => setInView( false ) );

		expect( result.current ).toEqual( true );

		sticky = false;
		rerender();

		expect( result.current ).toEqual( false );
	} );
} );
