import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
          type={props.type}
          className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = props => {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const routeChange = () =>{
    let path = `/register`;
    history.push(path);
  }

  const doLogin = async () => {
    try {
      const response = await api.get('/users');
      let userExists = false;
      const status = "ONLINE";
      const requestBody = JSON.stringify({status});

      response.data.forEach(user => {
        if(user.username === username && user.password === password){
          userExists = true;
          // Store the token into the local storage.
          localStorage.setItem('token', user.token);
          localStorage.setItem('id', user.id);
          // Login successfully worked --> navigate to the route /game in the GameRouter
          api.put('/users/' + user.id, requestBody);
          history.push(`/game`);


        }
        });
    if(!userExists){
      alert("Username or password is wrong");
    }
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <h3 className="login title">Login</h3>
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
            />
          <FormField
          label ="Password"
          type="password"
          value={password}
          onChange={pw => setPassword(pw)}
          />
          <div className="login question"> Not Registered yet?
            <button color="primary" className="login register-button" onClick={routeChange}>Create Account</button>
          </div>

          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
