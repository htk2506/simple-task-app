
import React, { useEffect, useState } from "react";
import './App.css';
import InputTask from './components/InputTask';
import ListTasks from './components/ListTasks';

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');

  // Make GET request to the /user-info route
  const getUserInfo = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER_BASE_URL}/user-info`;
      const response = await fetch(url, { method: 'GET', credentials: 'include' });

      // Handle server response
      if (response.ok) {
        const responseJson = await response.json();
        console.log(responseJson);
        setIsAuth(true);
        setUserName(responseJson.name);
      } else if (response.status === 401) {
        setIsAuth(false);
      }
      else {
        const responseText = await response.text();
        alert(responseText);
      }
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  }

  // Make GET request to /logout
  const logout = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER_BASE_URL}/logout`;
      const response = await fetch(url, { method: 'GET', credentials: 'include' });

      // Handle server response
      if (response.ok) {
        setIsAuth(false);
      } else {
        const responseText = await response.text();
        alert(responseText);
      }
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  }

  // Call when first rendered
  useEffect(() => {
    getUserInfo();
  }, []);

  if (isAuth) {
    return (
      <div className="App container">
        <h1>Simple Task App</h1>
        <p>{`Welcome ${userName}`}</p>
        <button
          className="btn btn-danger"
          onClick={() => logout()}
        >
          Logout
        </button>
        <InputTask />
        <ListTasks />
      </div>
    );
  } else {
    return (
      <div className="App container">
        <h1>Simple Task App</h1>
        <p>
          You are not logged in
          <br />
          <a href={`${process.env.REACT_APP_API_SERVER_BASE_URL}/login/google`}>Login with Google</a>
        </p>
      </div>
    )
  }
}

export default App;
