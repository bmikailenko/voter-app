import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import './App.css';


function AboutCandidate(){
    return (
        <div>
            <h1>AboutCandidate</h1>
            <div class="inputContainer">
                <label for="pfp">Profile Picture: </label>
                <input type="file"></input><br></br>
                <label for="fname">First name: </label>
                <input type="text" id="fname" name="fname"></input><br></br>
                <label for="lname">Last name: </label>
                <input type="text" id="lname" name="lname"></input><br></br>
                <p>
                    <label>Description: </label>
                    <textarea></textarea>
                </p>
                <label for="document">Documentation: </label>
                <input type="file"></input><br></br>
                <input type="submit" value="submit"></input>
            </div>
        </div>

    );
}

export default AboutCandidate;