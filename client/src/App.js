import './App.css';
import InputTask from './components/InputTask';
import ListTasks from './components/ListTasks';

function App() {
  return (
    <div className="App container">
      <h1>Simple Task App</h1>
      <InputTask />
      <ListTasks />
    </div>
  );
}

export default App;
