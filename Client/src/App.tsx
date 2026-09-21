
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Workspace from './components/Workspace';

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" toastOptions={{
        className: 'text-sm font-medium',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      }} />
      <Workspace />
    </AppProvider>
  );
}

export default App;
