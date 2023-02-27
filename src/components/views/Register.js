import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
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
        <div className="register field">
            <label className="register label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="register input"
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

const Register = props => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const status = "ONLINE";

    const routeChange = () =>{
        let path = `/login`;
        history.push(path);
    }
    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({username, name, password});
            const response = await api.post('/users', requestBody);
            // Get the returned user and update a new object.
            const user = new User(response.data);
            //Set registered user to online
            await api.put('/users/' + user.id, JSON.stringify({status}));
            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('id', user.id);


            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="register container">
                <div className="register form">
                    <h3 className="register title">Register</h3>
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label ="Password"
                        value={password}
                        type="password"
                        onChange={pw => setPassword(pw)}
                    />
                    <FormField
                        label="Name"
                        value={name}
                        onChange={n => setName(n)}
                    />
                    <div className="register question"> Already Registered?
                        <button color="primary" className="register login-button" onClick={routeChange}>Login</button>
                    </div>

                    <div className="register button-container">
                        <Button
                            disabled={!username || !name || !password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            Register
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
export default Register;
