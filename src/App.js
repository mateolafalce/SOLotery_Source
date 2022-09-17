import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import Main from './components/Main';
import About from './components/About';
import Exchange from './components/Exchange';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;