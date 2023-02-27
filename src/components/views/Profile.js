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

    let birthday_prettified = new Date(user.birthday).getDate() + "." + (new Date(user.birthday).getMonth() + 1) + "." + new Date(user.birthday).getFullYear();
    let creation_date_prettified = new Date(user.creation_date).getDate() + "." + (new Date(user.creation_date).getMonth() + 1) + "." + new Date(user.creation_date).getFullYear();
    if(user.birthday == null){
        birthday_prettified = "Not Set";
    }
    const updateProfile = async () => {
        try {
            const birthday = new Date();
            birthday.setFullYear(newBirthday.substring(6,10));
            birthday.setMonth(newBirthday.substring(3,5)-1);
            birthday.setDate(newBirthday.substring(0,2));
            const requestBody = JSON.stringify({birthday});
            await api.put('/users/' + user.id, requestBody);

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
        window.location.reload(false);
    }


    if(localStorage.getItem("token") === user.token){
        return (
            <BaseContainer>
                <div className="profile container">
                    <h1 className="profile title">Your Profile</h1>
                    <div className="profile username">Username: {user.username}</div>
                    <div className="profile id">User ID: {user.id}</div>
                    <div className="profile name">Name: {user.name}</div>
                    <div className="profile status">Status: {user.status}</div>
                    <div className="profile creation-date">Creation Date: {creation_date_prettified}</div>
                    <div className="profile birthday">Birthday: {birthday_prettified}</div>

                    <FormField
                        label="Birthday"
                        value={newBirthday}
                        onChange={un => setNewBirthday(un)}
                    />
                <Button
                    disabled={!newBirthday}
                    width="100%"
                    onClick={() => updateProfile()}
                    >
                    Update Profile
                </Button>
                </div>
            </BaseContainer>
        )
    }
    return (
        <div className="profile container">
            <h1 className="profile title">Profile</h1>
            <div className="profile username">Username: {user.username}</div>
            <div className="profile id">User ID: {user.id}</div>
            <div className="profile name">Name: {user.name}</div>
            <div className="profile status">Status: {user.status}</div>
            <div className="profile creation-date">Creation Date: {creation_date_prettified}</div>
            <div className="profile birthday">Birthday: {birthday_prettified}</div>

        </div>
    );;
}

const FormField = props => {
    return (
        <div className="register field">
            <label className="profile change-birthday-label">
                Change Birthday:
            </label>
            <input
                className="profile input"
                placeholder="DD/MM/YYYY"
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

            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;
    if (viewedUser) {
        content = (
            <div className="game container">
                <UserProfile user={viewedUser}/>
                <Button
                    width="100%"
                    onClick={() => history.push('/game')}
                >
                    Return
                </Button>
            </div>
        );
    }
    return(
        <BaseContainer>
            {content}
        </BaseContainer>

    )
}

Profile.propTypes = {
    user: PropTypes.object
};

export default Profile;