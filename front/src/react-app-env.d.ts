/// <reference types="react-scripts" />
/// <reference types="react/next" />
/// <reference types="react-dom/next" />
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35707
declare module 'babel-plugin-relay/macro' {
	export { graphql } from 'react-relay'
}
