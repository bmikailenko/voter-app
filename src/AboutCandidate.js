import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import "./AboutCandidate.css";
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
        <div class="candidate-profile-page">
            <h2 class="heading">Profile Setup</h2>
            <div class="inputContainer">
                <div class="textInput">
                    <form onSubmit={submitForm}>
                        <div class="form-group">
                            <label for="name">Name: </label><br></br>
                            <input type="text" class="text-box" name="name" placeholder="First and Last name here" onChange={updateName} /><br></br>
                            <div class="note">
                                This name is public and will display for other candidates and voters to view.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="description">Description: </label><br></br>
                            <textarea type="text" class="text-box" name="description" placeholder="Tell us a little bit about yourself" onChange={updateDesc}></textarea><br></br>
                            <div class="note">
                                This description will tell viewers a little bit about your passions, desires and ambitions.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="description">Political party: </label><br></br>
                            <input type="text" class="text-box" name="politcal-party" placeholder="What party best aligns with your ideals?"/><br></br>
                            <div class="note">
                                This box is optional for a quick overview for which party you most align with.
                            </div>
                        </div>
                        
                        <button>Submit</button>
                    </form>
                </div>
                <div class="fileInput">
                    <label for="pfp">Profile Picture: </label><br></br>
                    <input type="file"></input><br></br>
                    <label for="document">Documentation: </label><br></br>
                    <input type="file"></input><br></br>
                    <input type="submit" value="submit"></input>
                </div>

            </div>
        </div>

    );
}

export default AboutCandidate;