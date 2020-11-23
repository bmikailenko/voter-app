import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import './App.css';

function Admin() {
  var [userGroup, setUserGroup] = useState(null);
  var [userSurveys, setUserSurveys] = useState();

  useEffect(() => {
    const getUserSurvey = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const group = await user.signInUserSession.idToken.payload['cognito:groups'];
      if (group.includes('admin')) {
        setUserGroup('admin');
        getAllUsersAndData(10);   
      }
    }

    let nextToken;
    const getAllUsersAndData = async (limit) => {
      const apiName = 'AdminQueries';
      const path = '/listUsers';
      const myInit = { 
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
      var userData = [];
      for (const user of rest.Users) {
        var userSurvey = await fetchSurvey(user.Username);
        if (!userSurvey) {
          userSurvey = {'data':'No Survey!'}
          userData.push({'username':user.Username, 'survey':userSurvey});
        } else {
          userData.push({'username':user.Username, 'survey':userSurvey});
        }
      }
      setUserSurveys(userData);
    }

    getUserSurvey();
  });

  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      const survey = await surveyData.data.getSurvey;
      return survey;
    } catch (e) {
      console.log(e);
    }
  }

  async function addCandidate (sub) {
    let nextToken;
    const apiName = 'AdminQueries';
    const path = '/addUserToGroup';
    const myInit = { 
      queryStringParameters: {
        "username": sub,
        "groupname": 'candidate',
        "token": nextToken
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
  }

  return (userGroup !== 'admin') ? (
      <div>
        <AmplifySignOut />
        <div>
          <Link to="/dashboard">Go back to dashboard</Link>
        </div>
        <div>
        <h2>You are not an admin. No access to this page</h2>
        </div>
      </div>
  ) :
  (
    <div>
      <table>
        <thead>
          <tr>
            <td>
              User Sub
            </td>
            <td>
              User Survey Data
            </td>
          </tr>
        </thead>
        <tbody>
          { (userSurveys) ? (userSurveys.map(user => (
            <React.Fragment key={user.username}>
              <tr>
                <td>
                  {user.username}
                </td>
                <td>
                  Groups: {userGroup}
                </td>
                <td>
                  <button>Add to Candidates</button>
                </td>
                <td>
                  {user.survey.data}
                </td>
              </tr>
            </React.Fragment> 
          ))) : (
            <tr>
              <td>
                Loading Data...
              </td>
            </tr>
          )}
        </tbody>    
      </table>
    </div>
  );
}

export default withAuthenticator(Admin);
