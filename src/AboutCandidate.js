import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import {updateSurvey} from './graphql/mutations';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import "./AboutCandidate.css";
import './App.css';


function AboutCandidate() {
    var [candidateName, setCandidateName] = useState();
    var [updateCandName, setUpdateCandName] = useState();
    
    var [candidateDesc, setCandidateDesc] = useState();
    var [updateCandDesc, setUpdateCandDesc] = useState();
    useEffect(() => {
        const getCandName = async () => {
            const user = await Auth.currentUserInfo();
            const sub = await user.attributes.sub;
            const dbdata = await API.graphql(graphqlOperation(getSurvey, { id: sub }));
            if (!!dbdata.data.getSurvey.candidateName) {
                console.log(dbdata.data.getSurvey.candidateName);
                setCandidateName(await dbdata.data.getSurvey.candidateName);
            } else {
                setCandidateName("No name provided");
                console.log("no name");
            }
            if(!!dbdata.data.getSurvey.candidateDesc){
                setCandidateDesc(dbdata.data.getSurvey.candidateDesc);
            } else {
                setCandidateDesc("No description provided");
            }
        }
        getCandName();
    }, [candidateName]);
    const updateName = (e) => {
        console.log(e.target.value);
        setUpdateCandName(e.target.value);
    }
    const updateDesc = (e) => {
        console.log(e.target.value);
        setUpdateCandDesc(e.target.value);
    }
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const user = await Auth.currentUserInfo();
            const sub = await user.attributes.sub;
            const name = '' + updateCandName;
            const description = '' + updateCandDesc;
            const graphqlEntry = { 'id': sub, 'candidateName': name, 'candidateDesc': description };
            await API.graphql(graphqlOperation(updateSurvey, { input: graphqlEntry }));
            setCandidateName(name);
            setCandidateDesc(description);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div class="candidate-profile-page">
            <h2>{candidateName}</h2>
                    <h3>{candidateDesc}</h3>
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

export default withAuthenticator(AboutCandidate);