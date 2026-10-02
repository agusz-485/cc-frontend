import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes.jsx';
import HelpSupportBot from './components/support/HelpSupportBot';

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
            <HelpSupportBot />
        </BrowserRouter>
    );
}