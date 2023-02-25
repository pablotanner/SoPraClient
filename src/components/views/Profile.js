import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import user from "../../models/User";
import User from "../../models/User";


const UserProfile = ({user}) => {
    const history = useHistory();
    const [userBirthday, setBirthday] = useState(null);
    if(user.birthday == null){
        user.birthday = "Not Set";
    }
    let creation_date_prettified = new Date(user.creation_date).getDate() + "." + (new Date(user.creation_date).getMonth() + 1) + "." + new Date(user.creation_date).getFullYear();

    // Get the ID from the URL
    const urlID = window.location.href.split("/").pop();
    // Only show profile whose id matches the url/clicked user
    if(user.id == urlID){
        return (
            <div className="profile container">
                <h1 className="profile title">Profile</h1>
                <div className="profile username">Username: {user.username}</div>
                <div className="profile id">User ID: {user.id}</div>
                <div className="profile name">Name: {user.name}</div>
                <div className="profile status">Status: {user.status}</div>
                <div className="profile birthday">Birthday: {user.birthday}</div>
                <div className="profile creation-date">Creation Date: {creation_date_prettified}</div>
            </div>
        );
    }
    return(null);
}

const Profile = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);

    async function fetchData(){
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            alert("Something went wrong while fetching the users:");
        }
    }
    useEffect(
        () => {
            fetchData();
        }, []);


    let content = <Spinner/>;
    if (users) {
        content = (
            <div className="game container">
                {users.map(user => (
                    <UserProfile user={user}/>
                ))}
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