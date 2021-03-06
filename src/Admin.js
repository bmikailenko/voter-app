import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { updateSurvey } from './graphql/mutations';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import "survey-react/survey.css";
import './App.css';

class Voter {
  constructor(username, survey, bestScore, candidate, zipcode){
    this.username = username;
    this.survey = survey;
    this.bestScore = bestScore;
    this.candidate = candidate;
    this.zipcode = zipcode;
  }
}
//var zipcodes = ["98662", "33314", "98629", "34343", "20041"];
class Candidate {
  constructor(username){
    this.username = username;
    this.results = {
        "98662": 0,
        "33314": 0,
        "98629": 0,
        "34343": 0,
        "20041": 0
    };
  }

}


function Admin() {
  var [userGroup, setUserGroup] = useState(null);
  var [userSurveys, setUserSurveys] = useState();

  useEffect(() => {

    // function checks if user is admin
    // then runs getAllUsersAndData() if user is admin
    const isAdmin = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const group = await user.signInUserSession.idToken.payload['cognito:groups'];
      if (group !== undefined) {
        if (group.includes('admin')) {
          setUserGroup('admin');
          getAllUsersAndData(50);  
        }
      }
    }

    // function gets all the users data
    let nextToken;
    const getAllUsersAndData = async (limit) => {

      // query gets a list of all the users (10)
      // use nextToken to get the next 10 users
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
      var { NextToken, ...rest } =  await API.get(apiName, path, myInit);
      nextToken = NextToken; // next token if there are 10+ users in database

      // myInit.queryStringParameters.token = nextToken;
      // var { NextToken, ...rest } =  await API.get(apiName, path, myInit);
      // nextToken = NextToken; // next token if there are 10+ users in database

      // myInit.queryStringParameters.token = nextToken;
      // var { NextToken, ...rest } =  await API.get(apiName, path, myInit);
      // nextToken = NextToken; // next token if there are 10+ users in database

      // array of the all the users data 
      // ex: [{username, survey, groups}{username, survey, groups}]
      var userData = [];
      for (const user of rest.Users) {

        // get the users groups
        var groups = await listGroups(user.Username);

        // format result from listGroups() to seperate by commas
        groups = groups.map(function(elem){
          return elem.GroupName;
        }).join(', ');

        // get the users survey
        var userSurvey = await fetchSurvey(user.Username);


        if (!userSurvey) {
          userSurvey = {'data':'No Survey!'}

          // add to the array of all users data
          userData.push({'username':user.Username, 'survey':userSurvey, 'groups': groups});
        } else {

          // add to the array of all users data
          userData.push({'username':user.Username, 'survey': {'data': userSurvey}, 'groups': groups});
        }
      }

      // set the useState variable userSurveys to array of all users data
      console.log(userData);
      setUserSurveys(userData);
    }

    // need to run isAdmin() here at the end of useEffect()
    // so that isAdmin() runs everytime the /admin page refreshes
    // otherwise we are just declaring the functions and not executing them
    isAdmin();

    // useEffect() is executed whenever the userGroup variable is manipulated
  },[userGroup]);


  // function gets the user survey 
  // input: 'id'
  // output: 'array'
  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      console.log("got survey admin, line 132")
      if (surveyData.data.getSurvey) {
        const survey = await surveyData.data.getSurvey.data;
        return survey;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  // function adds a user as a candidate
  // also adds user to the 'candidates' graphql entry
  async function addCandidate (sub, survey) {

    // add the user to the 'candidates' pool group
    const apiName = 'AdminQueries';
    var path = '/addUserToGroup';
    var myInit = { 
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

    // get the candidates username
    path = '/getUser';
    myInit = { 
      queryStringParameters: {
        "username": sub,
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    const user = await API.get(apiName, path, myInit);
    for (var attributes of user.UserAttributes){
      if (attributes.Name === "email") {
        var candidateName = attributes.Value;
      }
    }

    // adding candidate to graphql entry with id: 'candidates'
    try {
      var candidatesQlData = await API.graphql(graphqlOperation(getSurvey, {id: 'candidates'}));
      console.log("got survey admin, line 183");
      var candidateData = candidatesQlData.data.getSurvey.candidateData;
      if (candidateData === null) {
        candidateData = [] 
      } 
      if (!candidateData.includes(sub)){
        candidateData.push(sub);
        candidateData.push(candidateName);
        candidateData.push(survey);
        const graphqlEntry = { 'id': 'candidates', 'candidateData': candidateData };
        await API.graphql(graphqlOperation(updateSurvey, { input: graphqlEntry }));
        console.log("updated survey admin, line 195");
      }
    } catch (e) {
      console.log(e);
    }

    window.location.reload(false);
  }

  // function removes a user from the 'candidates' pool group
  // also removes them from the 'candidates' graphql entry
  async function removeCandidate (sub) {

    // removing candidate from user pool group
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

    // removing candidate from graphQl entry with id: 'candidates'
    try {
      var candidatesQlData = await API.graphql(graphqlOperation(getSurvey, {id: 'candidates'}));
      console.log("got survey admin, line 226")
      var candidateData = candidatesQlData.data.getSurvey.candidateData;
      for (var i = 0; i < candidateData.length; i++) {
        if (candidateData[i] === sub) {
          candidateData.splice(i, 3);
        }
      }
      const graphqlEntry = { 'id': 'candidates', 'candidateData': candidateData };
      await API.graphql(graphqlOperation(updateSurvey, { input: graphqlEntry }));
    } catch (e) {
      console.log(e);
    }

    window.location.reload(false);
  }

  // function lists the groups for a user
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

  // function compares 'voter' users with 'candidate' users
  // and organizes them by zipcode
  function mineData(userData) {
    if (userData) {
      var candidates = []; // candidates
      var candidateObs = []; // candidates
      var voters = [];     // voters
      var voterObs = [];  // Voter class objects
      var zipcodes = [];   // zipcodes

      // ex: [{zipcode, candidate_username: number_of_voters, candidate_username: number_of_voters}, 
      //      {zipcode, candidate_username: number_of_voters, candidate_username: number_of_voters}, 
      //          etc...]
      //
      // top candidates at a zipcode is decided by:
      //    - comparing each candidate with each voters survey
      //    - deciding which candidates survey is the best match
      //    - having the most number of best matches at a zipcode
      var topCandidatesAtZipcode = [];

      // seperate candidates from voters
      userData.forEach(user => {
        if (user.groups.includes('candidate') && user.survey.data !== 'No Survey!') {
          candidates.push(user);
          var tempCand = new Candidate(user.username);
          candidateObs.push(tempCand);
          zipcodes.push(user.survey.data[2]);
        }
        else {
          if (user.survey.data !== 'No Survey!') {
            var temp = new Voter(user.username, user.survey.data, 0, null, user.survey.data[2]);
            voterObs.push(temp);
            voters.push(user);
            zipcodes.push(user.survey.data[2]);
          } 
        }
      });

      // uncomment to debug
      // console.log('candidates', candidates);
      console.log('voters objects', voterObs);
      // console.log('zipcodes', zipcodes);
      candidates.forEach(candidate => {
        //console.log(candidate);
        voterObs.forEach(voter => {
          // get the voteres zipcode
          // var voterZipcode = voter.survey.data[2];
         // console.log("hello");

         // Best is an array with two entries [x,x]. Entry 1 is the candidate, entry 2 is the score
          var best = tempBestMatch(voter, candidate);
          //console.log("The voter is " + voter.username + "the array is ");
        //  console.log(best);
         // console.log("Voter score is " + voter.bestScore + " AND best score is " + best[1]);
          if(best[1] > voter.bestScore){
            console.log("UHFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
            voter.bestScore = best[1];
            voter.candidate = best[0];
          }
          // // get the voters best match candidate
          // var theBestMatch = bestMatch(voter, candidate);
          // console.log("The best match was " + theBestMatch);
          // var bestMatchUsername = theBestMatch.username;
        });

      });
        // voters.forEach(voter => {
          
        //   // get the voteres zipcode
        //   var voterZipcode = voter.survey.data[2];

        //   // get the voters best match candidate
        //   var theBestMatch = bestMatch(voter, candidates);
        //   console.log("The best match was " + theBestMatch);
        //   var bestMatchUsername = theBestMatch.username;

        //   // 
        //   // adding to the array
        //   //

        //   // // case 1: this is the first voter in that zipcode
        //   // if (!(topCandidatesAtZipcode.find(o => o.zipcode === voterZipcode))) {
        //   //   console.log("case 1");

        //   //   topCandidatesAtZipcode.push(
        //   //     {
        //   //       zipcode : voterZipcode,
        //   //       candidates : 
        //   //         {
        //   //           candidate : bestMatchUsername,
        //   //           matches : 1
        //   //         }
        //   //     }
        //   //   )
        //   // } 
        //   // else {

        //   // // case 2: this isn't the first voter at the zipcode
        //   // //         but is a new candidate at that zipcode
        //   //   if (!(topCandidatesAtZipcode.find(o => o.candidates.candidate === bestMatchUsername))) {
        //   //     topCandidatesAtZipcode[voterZipcode].candidates.push(
        //   //       {
        //   //         candidate : bestMatchUsername,
        //   //         matches : 1
        //   //       }
        //   //     )
        //   //   }

        //   //   // case 3: this isn't the first voter at the zipcode
        //   //   //         and its an existing candidate
        //   //   else {
        //   //     console.log("case 3", topCandidatesAtZipcode);
        //   //     //console.log('--', topCandidatesAtZipcode.find(o => o.candidates.candidate === bestMatchUsername));
        //   //     //topCandidatesAtZipcode[voterZipcode][bestMatchUsername] += 1;
        //   //   }
        //   // }
        // });


      var returnArray = [];
      topCandidatesAtZipcode.forEach((zipcode, idx) => {
        returnArray[idx] = [zipcode.zipcode, Object.values(zipcode.candidates)];
      });

     // console.log(returnArray);

     // console.log(candidateObs);
      voterObs.forEach(voter => {
        console.log("The best score was " + voter.bestScore +  " The best match was ");
        console.log(voter.candidate);
      });

      console.log(" Size of candidates :" + candidateObs.length);
      console.log(" Size of Voters :" + voterObs.length);
      candidateObs.forEach(candidate => {
        voterObs.forEach(voter => {
         // console.log("Candidate type = " + candidate.username + " Voter's candidate = " + voter.candidate.username);
         // console.log(voter.candidate.username);
          if((voter.candidate !== null && voter.candidate.username !== null) && candidate.username === voter.candidate.username){
            console.log("SUFHBIUYSFGHIUSGFHIUSGIUGHSS");
            candidate.results[voter.zipcode] += 1;
          }
        });
      });

   // console.log(candidateObs);

    var returnThis = [];
      candidateObs.forEach(candidate => {
        returnThis.push(candidate.username);
        returnThis.push(candidate.results);
      });

      console.log(returnThis);

    return JSON.stringify(returnThis);
    }
  }

  // // finds the best candidate for a voter from a list of candidates
  // // returns: the candidates survey
  // function bestMatch(voter, candidates) {
  //   const voterSurvey = voter.survey.data;
  //   var bestMatch = null;
  //   var score = 0;
  //   var prevScore = 0;

  //   candidates.forEach(candidate => {
  //     var candidateSurvey = candidate.survey.data;
  //     // console.log('candidate surveys', candidateSurvey);
      
  //     // add to score if candidate answered similarly to voter
  //     candidateSurvey.forEach((question, index) => {
  //       if (question === voterSurvey[index])
  //         score += 1;
  //     });

  //     if (score > prevScore) {
  //       bestMatch = candidate;
  //       prevScore = score;
  //     }
  //   });
  //  // console.log(voter.username);
  //   return bestMatch;
  // }

    // finds the best candidate for a voter from a list of candidates
  // returns: the candidates survey
  function tempBestMatch(voter, candidate) {
    const voterSurvey = voter.survey;
    var candidateSurvey = candidate.survey.data;
    var bestMatch = null;
    var score = 0;
    var prevScore = 0;
    var zipcodes = ["98662", "33314", "98629", "34343", "20041"];
    var candidateSurvey = candidate.survey.data;
    // console.log('candidate surveys', candidateSurvey);
      
     // add to score if candidate answered similarly to voter
     
     if(zipcodes.includes(voter.zipcode)){
      candidateSurvey.forEach((question, index) => {
        if (question === voterSurvey[index])
          score += 1;
      });

      if (score > prevScore) {
        bestMatch = candidate;
        prevScore = score;
      }
    }
    var arr = [bestMatch, score];
    // console.log("The score is " + score + " The username is : " + voter.username + " The zipcode is : " + voter.survey.data[2]);
    return arr;
  }

  return (userGroup !== 'admin') ? (
      <div>
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
              User Groups
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
                  {user.groups}
                </td>
                <td style={{'padding-right': '10px', 'padding-top': '5px'}}>
                  <Button variant="outline-primary" onClick={() => addCandidate(user.username, user.survey.data)}>Add to Candidates</Button>
                </td>
                <td style={{'padding-right': '10px', 'padding-top': '5px'}}>
                  <Button variant="outline-danger" onClick={() => removeCandidate(user.username)}>Remove from Candidates</Button>
                </td>
              </tr>
            </React.Fragment> 
          ))) : (
            <tr>
              <td>
                Loading Data <Spinner animation="border" size="sm" />
              </td>
            </tr>
          )}
          <tr>
            <td>
              { mineData(userSurveys) }
            </td>
          </tr>
        </tbody>    
      </table>
    </div>
  );
}

export default withAuthenticator(Admin);
