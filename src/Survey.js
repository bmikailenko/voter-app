import React from 'react';
import {Link} from 'react-router-dom';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import * as Survey_questions from "survey-react";
import "survey-react/survey.css";


function Survey() {
  var surveyJSON = {"pages":[{"name":"page1","elements":[{"type":"expression","name":"question1","title":"The following survey has 100 questions based on beliefs and values. Approximate time to finish the survey is 30 mins. Click \"next\" to begin. "}],"title":"Introduction","description":"This is an introduction to the following survey"},{"name":"page2","elements":[{"type":"checkbox","name":"question2","title":"Abortion should be illegal in the United States","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question6","visibleIf":"{question2} = ['other']","title":"For abortion, the MOTHER should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question7","visibleIf":"{question2} = ['other']","title":"For abortion, the FATHER should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question8","visibleIf":"{question2} = ['other']","title":"For abortion, the DOCTOR should have a right to choose","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question3","title":"Current US Presidents must choose a new supreme court judge in their term of office in the event of an unexpected death of the judge","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question5","title":"Citizens in the United States shouldn't own firearms","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"},{"type":"checkbox","name":"question4","title":"The United States Department of Agriculture is beneficial for the country","choices":[{"value":"item1","text":"Agree"}],"hasOther":true,"otherText":"Disagree","hasNone":true,"noneText":"Prefer not to answer"}],"title":"Questions"}]}

  function onComplete(survey) {
    console.log("The results are:" + JSON.stringify(survey.data));
  }

  return (
    <div>
      <AmplifySignOut />
      <h1>Survey Page</h1>
      <Survey_questions.Survey json={surveyJSON} onComplete={onComplete}/>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default withAuthenticator(Survey);
