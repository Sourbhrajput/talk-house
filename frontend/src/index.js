import * as ReactDom from 'react-dom/client';
import App from './App';
import Store from './Store/Store';
import { Provider } from 'react-redux';


const root = ReactDom.createRoot(
     document.getElementById('root')
)

root.render(<Provider store={Store}> <App /> </Provider>);

