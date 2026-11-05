import React from 'react';
import { createRoot } from 'react-dom/client';
import PublicRouter from '../public/PublicRouter';

// A entrada apenas conecta a aplicação ao elemento da página.
createRoot(document.getElementById('root')).render(<PublicRouter />);
