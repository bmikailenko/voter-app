import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import './App.css';

function Dashboard() {
  var [userSurvey, setUserSurvey] = useState();  
  var [userGroup, setUserGroup] = useState(null);
  var [isCandidate, setIsCandidate] = useState(false);

  useEffect(() => {
    const getUserSurvey = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const group = await user.signInUserSession.idToken.payload['cognito:groups'];
      const sub = await user.attributes.sub;
      const userSurvey = await fetchSurvey(sub);
      if (userSurvey) {
        setUserSurvey(userSurvey.data);
      } else {
        console.log("no user survey yet!");
      }
      if (group.includes('admin')) {
        setUserGroup('admin');
      }
      if (group.includes('candidate')) {
        setIsCandidate(true);
      }
    }
    getUserSurvey();
  },[userSurvey, isCandidate]);
  function modifySurveyResults(survey){
    var resultData = [];
    for(var key in survey.data){
      var question = survey.getQuestionByValueName(key);
      if(!!question) {
        var item = {value: question.value};
        if(key !== question.title){
          item.title = question.title;
        }
        if(item.value != question.displayValue){
          item.displayValue = question.displayValue
        }
        console.log(item.displayValue);
      }
      resultData.push(item.title);
      resultData.push(item.displayValue);
    }
    return resultData;
  }
  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      const survey = await surveyData.data.getSurvey;
      return survey;
    } catch (e) {
      console.log(e);
    }
  }

  return (userGroup !== 'admin') ? (
      <div>

        <AmplifySignOut />

        <h1>My Dashboard</h1>

        {(isCandidate) ?
        (<div>
          You are a candidate
        </div>)
        :
        (<div>
          You are a voter
        </div>)}

        <div>
          <Link to="/survey">Survey</Link>
        </div>

        <div>
          <Link to="/candidate-verification">Are you a candidate?</Link>
        </div>
        
        <div>
          <h2>Survey results:</h2>
          <p>{userSurvey}</p>
        </div>

      </div>
  ) :
  (
    <div>

      <AmplifySignOut />

      <h1>My Dashboard</h1>

      {(isCandidate) ?
        (<div>
          You are a candidate
        </div>)
        :
        (<div>
          You are a voter
        </div>)}

      <div>
      <Link to="/survey">Survey</Link>
      </div>

      <div>
        <Link to="/candidate-verification">Are you a candidate?</Link>
      </div>

      <div>
        <Link to="/admin">Go to admin page</Link>
      </div>

      <div>
        <h2>Survey results:</h2>
        <p>{userSurvey}</p>
      </div>

    </div>
  );
}

export default withAuthenticator(Dashboard);
