import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import CityDetails from './pages/city-details/CityDetails';
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';

function App(): JSX.Element {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/city-details/:cityId" element={<CityDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
