import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import './App.css';


function AboutCandidate() {
    var [candidateName, setCandidateName] = useState('');
    var [candidateDesc, setCandidateDesc] = useState('');
    const updateName = (e) => {
        setCandidateName(e.target.value);
    }
    const updateDesc = (e) => {
        setCandidateDesc(e.target.value);
    }
    const submitForm = (e) => {
        e.preventDefault();
        console.log( candidateName);
        console.log( candidateDesc);
    }
    return (
        <div>
            <h1>AboutCandidate</h1>
            <div class="inputContainer">
                <form onSubmit={submitForm}>
                    <label for="name">Name: </label>
                    <input type="text" name="name" onChange={updateName} />
                    <p>
                        <label for="description"> Description: </label>
                        <textarea type="text" name="description" onChange={updateDesc}></textarea>
                    </p>
                    <button>Submit</button>
                </form>
                <label for="pfp">Profile Picture: </label>
                <input type="file"></input><br></br>
                <label for="document">Documentation: </label>
                <input type="file"></input><br></br>
                <input type="submit" value="submit"></input>
            </div>
        </div>

    );
}

export default AboutCandidate;