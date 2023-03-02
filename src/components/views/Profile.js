import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";


const UserProfile = ({user}) => {
    const [newBirthday, setNewBirthday] = useState(null);
    const [newUsername, setNewUsername] = useState(null);
    const [show, setShow] = useState(false);

    let birthday_prettified = new Date(user.birthday).getDate() + "." + (new Date(user.birthday).getMonth() + 1) + "." + new Date(user.birthday).getFullYear();
    let creation_date_prettified = new Date(user.creation_date).getDate() + "." + (new Date(user.creation_date).getMonth() + 1) + "." + new Date(user.creation_date).getFullYear();
    if (user.birthday == null) {
        birthday_prettified = "Not Set";
    }
    const openProfileText = () => {
        if (show) {
            return "Close"
        } else {
            return "Edit Profile"
        }
    }
    const profileWindow = ({user}) => {
        return (
            <div>
                <FormField
                    label="Change Username"
                    value={newUsername}
                    placeholder="enter here..."
                    onChange={un => setNewUsername(un)}
                />
                <FormField
                    label="Change Birthday"
                    type = "date"
                    value={newBirthday}
                    onChange={un => setNewBirthday(un)}
                />
                <Button
                    disabled={!newUsername && !newBirthday}
                    width="100%"
                    onClick={() => updateProfile()}
                > Save Changes
                </Button>
            </div>
        )
    }
    const updateProfile = async () => {

        try {
            if (newBirthday != null) {
                await api.put('/users/' + user.id, JSON.stringify({birthday: newBirthday}));
            }
            if (newUsername != null && newUsername !== "") {
                const userList = await api.get('/users');
                for (let i = 0; i < userList.data.length; i++) {
                    if (userList.data[i].username === newUsername) {
                        alert("Username already exists");
                        return;
                    }
                }
                await api.put('/users/' + user.id, JSON.stringify({username: newUsername}))
            }
        } catch (error) {
            alert(`Something went wrong during the profile updating: \n${handleError(error)}`);
        }
        window.location.reload(false);
    }


    if (localStorage.getItem("token") === user.token) {
        return (
            <BaseContainer>
                <div className="profile container">
                    <h1 className="profile title">Your Profile {user.status === "ONLINE" ? "🟢" : "🔴"}</h1>
                    <div className="profile username">Username: {user.username}</div>
                    <div className="profile id">User ID: {user.id}</div>
                    <div className="profile name">Name: {user.name}</div>
                    <div className="profile status">Status: {user.status}</div>
                    <div className="profile creation-date">Creation Date: {creation_date_prettified}</div>
                    <div className="profile birthday">Birthday: {birthday_prettified}</div>

                    <Button
                        width="100%"

                        onClick={() => setShow(!show)}
                    >
                        {openProfileText()}
                    </Button>
                    {show && profileWindow(user)}
                </div>
            </BaseContainer>
        )
    }
    return (
        <div className="profile container">
            <h1 className="profile title">Profile {user.status === "ONLINE" ? "🟢" : "🔴"}</h1>
            <div className="profile username">Username: {user.username}</div>
            <div className="profile id">User ID: {user.id}</div>
            <div className="profile name">Name: {user.name}</div>
            <div className="profile status">Status: {user.status}</div>
            <div className="profile creation-date">Creation Date: {creation_date_prettified}</div>
            <div className="profile birthday">Birthday: {birthday_prettified}</div>

        </div>
    );
}

const FormField = props => {
    return (
        <div className="profile field">
            <label className="profile change-birthday-label">
                {props.label}
            </label>
            <input
                className="profile input"
                type = {props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};


const Profile = () => {
    const history = useHistory();
    const [viewedUser, setUser] = useState(null);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            const urlID = window.location.href.split("/").pop();
            try {
                const response = await api.get('/users/' + urlID);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUser(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("This user doesn't exist");
                history.push('/game');

            }
        }

        fetchData();
    });

    let content = <Spinner/>;
    if (viewedUser) {
        content = (
            <div className="game container">
                <UserProfile user={viewedUser}/>
                <Button
                    width="50%"
                    onClick={() => history.push('/game')}
                >
                    Return
                </Button>
            </div>
        );
    }
    return (
        <BaseContainer>
            {content}
        </BaseContainer>

    )
}

Profile.propTypes = {
    user: PropTypes.object,
};

export default Profile;