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
        console.log("ping"); 
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
        var groups = await listGroups(user.Username);
        groups = groups.map(function(elem){
          return elem.GroupName;
        }).join(', ');
        var userSurvey = await fetchSurvey(user.Username);
        if (!userSurvey) {
          userSurvey = {'data':'No Survey!'}
          userData.push({'username':user.Username, 'survey':userSurvey, 'groups': groups});
        } else {
          userData.push({'username':user.Username, 'survey':userSurvey, 'groups': groups});
        }
      }
      setUserSurveys(userData);
    }

    getUserSurvey();
  },[userGroup]);

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
    const apiName = 'AdminQueries';
    const path = '/addUserToGroup';
    const myInit = { 
      body: {
        "username": sub,
        "groupname": 'candidate',
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    API.post(apiName, path, myInit);
  }

  async function removeCandidate (sub) {
    const apiName = 'AdminQueries';
    const path = '/removeUserFromGroup';
    const myInit = { 
      body: {
        "username": sub,
        "groupname": 'candidate',
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    await API.post(apiName, path, myInit);
  }

  async function listGroups (sub) {
    const apiName = 'AdminQueries';
    const path = '/listGroupsForUser';
    const myInit = { 
      queryStringParameters: {
        "username": sub,
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    const value =  await API.get(apiName, path, myInit);
    return value.Groups;
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
                  Groups: {user.groups}
                </td>
                <td>
                  <button onClick={() => addCandidate(user.username)}>Add to Candidates</button>
                </td>
                <td>
                  <button onClick={() => removeCandidate(user.username)}>Remove from Candidates</button>
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
