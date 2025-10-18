import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App';

// Enable language support.
import './i18n';

// React Refresh is configured via Babel + Webpack in development.

ReactDOM.render(<App />, document.getElementById('app'));
