import {Redirect, Route, useHistory} from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from 'prop-types';
import Profile from "../../views/Profile";
import {api} from "../../../helpers/api";
import {useState} from "react";

const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <Route exact path={`${props.base}/profile`}>
            <Redirect to={`${props.base}/dashboard`}/>
        </Route>
        <Route path={`${props.base}/profile/`}>
            <Profile/>
        </Route>
      <Route exact path={`${props.base}/dashboard`}>
        <Game/>
      </Route>
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/dashboard`}/>
      </Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
