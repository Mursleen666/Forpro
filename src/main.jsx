import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext.jsx'
import ReactPixel from 'react-facebook-pixel'


const pixelId = '836878095584261'

ReactPixel.init(pixelId)
ReactPixel.pageView()

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <ShopContextProvider>
        <App />
     </ShopContextProvider>
    </BrowserRouter>
   
 
)
