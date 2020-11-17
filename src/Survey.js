import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {Link} from 'react-router-dom';
import { createSurvey, updateSurvey } from './graphql/mutations';
import { getSurvey } from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import * as SurveyQuestions from "survey-react";
import './App.css';
import "survey-react/survey.css";


function Survey() {
  var [userSurvey, setUserSurvey] = useState(); 

  var surveyJSON = {"pages":[{"name":"page1","elements":[{"type":"expression","name":"question1","title":"The following survey has 100 questions based on beliefs and values. Approximate time to finish the survey is 30 mins. Click \"next\" to begin. "}],"title":"Introduction","description":"This is an introduction to the following survey"},{"name":"page2","elements":[{"type":"checkbox","name":"question2","title":"Abortion should be illegal in the United States","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question6","visibleIf":"{question2} = ['other']","title":"For abortion, the MOTHER should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question7","visibleIf":"{question2} = ['other']","title":"For abortion, the FATHER should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question8","visibleIf":"{question2} = ['other']","title":"For abortion, the DOCTOR should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question3","title":"Current US Presidents must choose a new supreme court judge in their term of office in the event of an unexpected death of the judge","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question5","title":"Citizens in the United States shouldn't own firearms","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question4","title":"The United States Department of Agriculture is beneficial for the country","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"}],"title":"Questions"}]}

  useEffect(() => {
    const getUserSurvey = async () => { 
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      const userSurvey = await await surveyData.data.getSurvey.data;
      if (userSurvey) {
        setUserSurvey(userSurvey)
      } else {
        setUserSurvey('You dont have one yet!');
      }
    }
    getUserSurvey();
  },[userSurvey]);

  const updateUserSurvey = async (newSurvey) => {
    try {
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const graphqlEntry = { 'id': sub, 'data': newSurvey };
      if (!userSurvey) {
        await API.graphql(graphqlOperation(createSurvey, {input: graphqlEntry}));
      } else {
        await API.graphql(graphqlOperation(updateSurvey, {input: graphqlEntry}));
      }
    } catch (e) {
      console.log(e);
    }
  }

  function onComplete(survey) {
    console.log("The results are:" + JSON.stringify(survey.data));
    const newSurvey = survey.data;
    updateUserSurvey(newSurvey);
    setUserSurvey(newSurvey);
  }

  return (
    <div>
      <AmplifySignOut />
      <h1>Survey Page</h1>
      <SurveyQuestions.Survey json={surveyJSON} onComplete={onComplete}/>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default withAuthenticator(Survey);
