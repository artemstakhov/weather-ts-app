import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import StoreProvider from './store/StoreProvider';

const root = createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
    <StoreProvider>
        <App />
    </StoreProvider>,
);
