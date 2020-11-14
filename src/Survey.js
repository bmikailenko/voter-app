import React from 'react';
import {Link} from 'react-router-dom';
import './App.css';
import './Survey.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import * as SurveyQuestions from "survey-react";
import "survey-react/survey.css";


function Survey() {
  var surveyJSON = {
    pages: [
        {   name: "page1",
            title: "Section 1", description: "This is an explanation to the following section",
            elements: [ 
            { type: "expression", name: "question1", title: "The following survey has 100 questions based on beliefs and values. Approximate time to finish the survey is 30 mins. Click \"next\" to begin." } ]
        },

        {   name: "page2",
            title: "Questions",
            elements: [ 
            { type: "checkbox", name: "question2", title: "Abortion should be illegal in the United States", 
                choices: [
                { value: "item1", text: "Agree"} ],
                hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" }, 

                { type: "checkbox", name: "question6", visibleIf: "{question2} = ['other']", title: "For abortion, the MOTHER should have a right to choose", 
                    choices: [ 
                    { value: "item1", text: "Agree" } ],
                    hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" },

                { type: "checkbox", name: "question7", visibleIf: "{question2} = ['other']", title: "For abortion, the FATHER should have a right to choose",
                    choices: [
                    { value: "item1", text: "Agree" } ],
                    hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" },

                { type: "checkbox", name: "question8", visibleIf: "{question2} = ['other']", title: "For abortion, the DOCTOR should have a right to choose", 
                    choices: [
                    { value: "item1", text: "Agree" } ],
                    hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" },
                
            { type: "checkbox", name: "question3", title: "Current US Presidents must choose a new supreme court judge in their term of office in the event of an unexpected death of the judge",
                choices: [
                { value: "item1", text: "Agree" } ],
                hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" },
                
            { type: "checkbox", name: "question5", title: "Citizens in the United States shouldn't own firearms",
                choices: [ 
                { value: "item1", text: "Agree" } ],
                hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" },
                    
            { type: "checkbox", name: "question4", title: "The United States Department of Agriculture is beneficial for the country",
                choices: [
                { value: "item1", text: "Agree" } ],
                hasOther: true, otherText: "Disagree", hasNone: true, noneText: "Prefer not to answer" } ],
        } 
     ] 
   }

  function onComplete(survey) {
    console.log("The results are:" + JSON.stringify(survey.data));
  }

  return (
    <div>
      <AmplifySignOut />
      <div class="title-section">
        <h1>Survey Page</h1>
        <p>Answer as many questions as desired to further express your ideals, policy opinions, and beliefs in any field provided down below.</p>
      </div>
      <div class="questions">
        <SurveyQuestions.Survey json={surveyJSON} onComplete={onComplete}/>
      </div>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default withAuthenticator(Survey);
