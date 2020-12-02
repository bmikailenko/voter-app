import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import "survey-react/survey.css";
import './App.css';
//import { ListGroup } from 'react-bootstrap';

function Dashboard() {
  var [userSurvey, setUserSurvey] = useState();
  var [userGroup, setUserGroup] = useState(null);
  var [isCandidate, setIsCandidate] = useState(false);
  var [candidateSurveyArray, setCandidateSurvey] = useState();
  var [bestCandidates, setBestCandidates] = useState();
  // getting all the candidates of the database ready for comparison
  async function listGroups(sub) {
    const apiName = 'AdminQueries';
    const path = '/listGroupsForUser';
    const myInit = {
      queryStringParameters: {
        "username": sub,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    const value = await API.get(apiName, path, myInit);
    return value.Groups;
  }
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

      if (group !== undefined) {
        if (group.includes('candidate')) {
          setIsCandidate(true);
        }
        if (group.includes('admin')) {
          setUserGroup('admin');
        }
      }
      //fetchAllCandidatesAndData(10);
    }
    let nextToken;
    //var allCandidates = [];
    const fetchAllCandidatesAndData = async (limit) => {
      const apiName = 'AdminQueries';
      const path = '/listUsers';
      const myInit = {
        queryStringParameters: {
          "limit": limit,
          "token": nextToken
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
      }
      const { NextToken, ...rest } = await API.get(apiName, path, myInit);
      nextToken = NextToken;
      //var candidateSurveyArray = [];
      //var bestCandidates = [];

      var tempCandidateSurveyArray = [];
      for (const user of rest.Users) {
        var groups = await listGroups(user.Username);
        groups = groups.map(function (elem) {
          return elem.GroupName;
        }).join(', ');
        var candidateSurvey = await fetchSurvey(user.Username);
        //fetch only candidates into the candidate array
        var emailAsUserName;
        for(const j of user.Attributes){
          if(j.Name === "email"){
            emailAsUserName = j.Value
            //console.log(j.Value);
          }
        }
        if (groups === 'candidate' || groups === 'candidate, admin' || groups === 'admin, candidate') {
          if (!candidateSurvey) {
            candidateSurvey = {'data': 'No Survey!' }
            tempCandidateSurveyArray.push({ 'username': emailAsUserName, 'survey': candidateSurvey, 'groups': groups, 'matchValue': 0});
          } else {
            tempCandidateSurveyArray.push({ 'username': emailAsUserName, 'survey': candidateSurvey.data, 'groups': groups, 'matchValue': 0});
          }
        }
      }
      //Finding the best match candidate
      var userSurveylen = parseSurvey(userSurvey).length;
      var userParsedSurvey = parseSurvey(userSurvey);
      
      console.log(userSurveylen)
      // going through all the fetched candidates from database
      for(const can of tempCandidateSurveyArray){ 
        var matchCount = 0;
        var candidateParsedSurveyArray = parseSurvey(can.survey);
        var Surveylen = candidateParsedSurveyArray.length;
        // console.log(can.matchValue + "   " + can.username);
        for(var i = 0; i < Surveylen; i++){
          //&& (userSurveylen === Surveylen) is temproray
          if((candidateParsedSurveyArray[i].localeCompare(userParsedSurvey[i]) === 0) && (userSurveylen === Surveylen)){
            if(candidateParsedSurveyArray[i] !== ""){
             // console.log(candidateParsedSurveyArray[i] + " === " + userParsedSurvey[i])
              matchCount++;
            }
            else{
              //console.log("null " + " === " + " null")
            }
          }
        }
        can.matchValue = matchCount;
        //console.log(can.matchValue + "   " + can.username);
      }

      var bc = [];
      for(const can of tempCandidateSurveyArray){
          bc.push({'matchValue' : can.matchValue, 'name' : can.username});
      }
      bc.sort((a, b) => a - b);
      //console.log(JSON.stringify(bc[bc.length-1]));
    if(tempCandidateSurveyArray){
      setBestCandidates(bc[bc.length-1].name);
    }
    else{
      console.log("failed to set results");
    }
    }

    getUserSurvey();

    fetchAllCandidatesAndData(50);
  }, [userSurvey, isCandidate, candidateSurveyArray, bestCandidates]);
  
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
    //console.log(survey);
    var surveyArray = '' + survey;
    var arrey = surveyArray.split('"1.)', 1);
    var newArray = arrey[0];
    //Remove the zipcode from display
    surveyArray = surveyArray.replace(newArray + '"', '');
    surveyArray = surveyArray.replace('"]', '');
    const theArray = surveyArray.split('","');
    //console.log(theArray);
    return theArray;
    //{parseSurvey(candidateSurveyArray).map(txt => <p>{txt}</p>)}
  }

  return (userGroup !== 'admin') ? (
    <div>

      <AmplifySignOut />

      <h1>My Dashboard</h1>

      {(isCandidate) ?
        (<div>
          You are a candidate
          <Link to="/aboutcandidate">about candidate page</Link>
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
           
          </div>
          <h2>Best Candidate Matches:</h2>
          <div>
         {<p>{JSON.stringify(bestCandidates)}</p>}
          </div>
        </div>

      </div>
    );
}

export default withAuthenticator(Dashboard);
