import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import './App.css';


function Dashboard() {
  var [userSurvey, setUserSurvey] = useState();  

  useEffect(() => {
    const getUserSurvey = async () => {
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const userSurvey = await fetchSurvey(sub);
      if (userSurvey) {
        setUserSurvey(userSurvey.data);
        console.log(userSurvey.data);
      } else {
        console.log("no user survey yet!");
      }
    }
    getUserSurvey();
  },[userSurvey]);

  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      const survey = await surveyData.data.getSurvey;
      return survey;
    } catch (e) {
      console.log(e);
    }
  }

  return (
      <div>
        <AmplifySignOut />
        <h1>My Dashboard</h1>
        <div>
          <Link to="/survey">Survey</Link>
        </div>
        <div>
          <Link to="/candidate-verification">Are you a candidate?</Link>
        </div>
      </div>
  );
}

export default withAuthenticator(Dashboard);
