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
  }, [userSurvey, isCandidate]);

  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, { id: sub }));
      const survey = await surveyData.data.getSurvey;
      return survey;
    } catch (e) {
      console.log(e);
    }
  }
  function parseSurvey(survey) {
    var surveyArray = '' + survey;
    var arrey = surveyArray.split('"1.)', 1);
    var newArray = arrey[0];
    //Remove the zipcode from display
    surveyArray = surveyArray.replace(newArray + '"', '');
    surveyArray = surveyArray.replace('"]', '');
    const theArray = surveyArray.split('","');
    return theArray;
  }

  return (userGroup !== 'admin') ? (
    <div>

      <AmplifySignOut />

      <h1>My Dashboard</h1>

      {(isCandidate) ?
        (<div>
          You are a candidate
          <Link to="/aboutcandidate">aboutcandidate page</Link>
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
        <div>
          {parseSurvey(userSurvey).map(txt => <p>{txt}</p>)}
        </div>
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
            <div><Link to="/aboutcandidate">aboutcandidate page</Link></div>
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
          <div>
            {parseSurvey(userSurvey).map(txt => <p>{txt}</p>)}
          </div>
        </div>

      </div>
    );
}

export default withAuthenticator(Dashboard);
