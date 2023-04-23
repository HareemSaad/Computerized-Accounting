import logo from './logo.svg';
import './App.css';
import { Route, Routes} from "react-router-dom";
import { GeneralJournal } from './components/general-journal';

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<GeneralJournal/>} /> 
          {/* <Route path="/letter-keyboard" element={<Game1/>} />
          <Route path="/number-pops" element={<Game2/>} /> */}
      </Routes>
    </>
  );
}

export default App;
