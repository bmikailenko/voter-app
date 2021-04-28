import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import {updateSurvey} from './graphql/mutations';import "survey-react/survey.css";
import { Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import "./AboutCandidate.css";
import './App.css';
import default_pfp from './default-pfp-avatar.webp';


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
            console.log("got survey aboutcandidate, line 21");
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
            console.log("updated survey about candidate, line 54");
            setCandidateName(name);
            setCandidateDesc(description);
        } catch (e) {
            console.log(e);
        }
    }

    // file inputting functions (image uploads)
    // $("#profileImage").on("click", function(e) {
    //     $("#imageUpload").on();
    // });

    return (
        <div class="candidate-profile-page">
        <h2 class="heading">Profile Setup</h2>
        <div class="inputContainer">
            <div class="textInput">
                <form onSubmit={submitForm}>
                    <br></br>
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
                    {/* <div class="form-group">
                        <label for="description">Political party: </label><br></br>
                        <input type="text" class="text-box" name="politcal-party" placeholder="What party best aligns with your ideals?"/><br></br>
                        <div class="note">
                            This box is optional for a quick overview for which party you most align with.
                        </div>
                    </div> */}
                    <br></br>
                    <button class="update-button">Update Profile</button>
                </form>
            </div>
            <div class="fileInput">
                {/* <svg viewBox="0 0 16 16" fill="none" width="64" height="64">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" vector-effect="non-scaling-stroke"></circle>
                    <path d="M15 8a7.002 7.002 0 00-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
                        <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"></animateTransform>
                </svg> */}
                {/* <div>Profile Picture</div>
                <label for="pfp" class="pfp-upload">
                    <div alt="image" src={default_pfp} width="120"/>
                    <input id="pfp" type="file"></input>
                </label>
                <br></br><br></br><br></br>
                <label for="document" class="doc-upload">
                    Documentation
                    <input id="document" type="file"></input>
                </label>
                <div class="note">
                    Insert necessary file for review to determine eligibility for VoterApp.
                </div> */}
            </div>

        </div>
    </div>

    );
}

export default withAuthenticator(AboutCandidate);