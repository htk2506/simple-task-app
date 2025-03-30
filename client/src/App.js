import './App.css';
import InputTask from './components/InputTask';

function App() {
  return (
    <div className="App container">
      <InputTask />
      <p>{process.env.REACT_APP_SERVER_URL}</p>
    </div>
  );
}

export default App;
