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
    }
    getUserSurvey();
  },[userSurvey]);

  let nextToken;

  async function listUsers(limit){
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let myInit = { 
        queryStringParameters: {
          "limit": limit,
          "token": nextToken
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    console.log(rest);
    return rest;
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
      Hah you rock
      <button onClick={() => listUsers(10)}>List users</button>
    </div>
  );
}

export default withAuthenticator(Dashboard);
