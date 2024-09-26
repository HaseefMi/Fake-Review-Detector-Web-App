import ReviewInput from "./components/review-input/review-input";
import ResultDisplay from "./components/result-display/result-display";
import { Routes, Route } from 'react-router-dom'
import { ResultProvider } from "./contexts/result-context";
function App() {
  return (
    <div>
      <ResultProvider>
      <Routes>
        <Route path='/' element={<ReviewInput />}/>
        <Route path='/result' element={<ResultDisplay />} />
      </Routes>
      </ResultProvider>
    </div>
  );
}

export default App;
