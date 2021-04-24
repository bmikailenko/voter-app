import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getSurvey } from './graphql/queries';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import Chart from "react-google-charts";
import "survey-react/survey.css";
import './App.css';

function Dashboard() {
  var [userSurvey, setUserSurvey] = useState([]);
  var [userGroup, setUserGroup] = useState(null);
  var [isCandidate, setIsCandidate] = useState(false);
  var [bestCandidates, setBestCandidates] = useState();

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
    }

    const fetchAllCandidatesAndData = async (limit) => {
      try {
        var candidatesQlData = await API.graphql(graphqlOperation(getSurvey, {id: 'candidates'}));
        console.log('got survey');
        var candidateData = candidatesQlData.data.getSurvey.candidateData;
        var rest = []
        for (var i = 0; i < candidateData.length; i+=3) {
          rest.push({'Username': candidateData[i], 'Attributes':[{ 'Name': 'email', 'Value': candidateData[i+1]}]})
        }
      } catch (e) {
        console.log(e);
      }

      if (rest.length !== 0) {
        var tempCandidateSurveyArray = [];
        for (const user of rest) {
          var groups = 'candidate';
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
          //console.log(tempCandidateSurveyArray);
        }
        //Finding the best match candidate
        var userParsedSurvey = userSurvey;
        
        //console.log(userSurveylen)
        // going through all the fetched candidates from database
        for(const can of tempCandidateSurveyArray){ 
          var matchCount = 0;
          var candidateParsedSurveyArray = can.survey;
          //console.log(candidateParsedSurveyArray);
          var Surveylen = candidateParsedSurveyArray.length;
          // console.log(can.matchValue + "   " + can.username);
          for(i = 0; i < Surveylen; i++){
            //&& (userSurveylen === Surveylen) is temproray
            if((candidateParsedSurveyArray[i].localeCompare(userParsedSurvey[i]) === 0)){
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
       // console.log(bc);
       
        bc.sort(sortCandidates('matchValue'));
        //console.log(bc);
      // setting the candidate survey to match the best fit candidate
      if(tempCandidateSurveyArray){
        setBestCandidates(bc[bc.length-1].name);
      }
      else{
        console.log("failed to set results");
      }
    }    
  }

    getUserSurvey();

    
    fetchAllCandidatesAndData(50);
    
    
  }, []);
  
  function sortCandidates(key){
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return comparison
  }
}

  const fetchSurvey = async (sub) => {
    try {
      const surveyData = await API.graphql(graphqlOperation(getSurvey, { id: sub }));
      console.log("got survey");
      const survey = await surveyData.data.getSurvey;
      return survey;
    } catch (e) {
      console.log(e);
    }
  }


  // parse the user survey to generate charts
  if (userSurvey) {
    var yes_answers = 0;
    var no_answers = 0;
    var part_1 = 0;
    var part_2 = 0;
    var part_3 = 0;
    var part_4 = 0;
    var part_5 = 0;
    var k = 0;
    
    for (var i = 4; i < 247; i+=2) { // go through entire survey
      k += 1;

      if (userSurvey[i]) { // if there is a survey

        if (userSurvey[i].includes("Yes")) { // yes answers
          yes_answers += 1;
          if (k < 50) 
            part_1 += 1;
          if (k >= 50 && k < 100)
            part_2 += 1;
          if (k >= 100 && k < 150)
            part_3 += 1;
          if (k >= 150 && k < 200)
            part_4 += 1;
          if (k >= 200 && k < 247)
            part_5 += 1;
        }   
        if (userSurvey[i].includes("No")) { // no answers
          no_answers += 1;
          if (k < 50) 
            part_1 += 1;
          if (k >= 50 && k < 100)
            part_2 += 1;
          if (k >= 100 && k < 150)
            part_3 += 1;
          if (k >= 150 && k < 200)
            part_4 += 1;
          if (k >= 200 && k < 247)
            part_5 += 1;
        }
      }
    }

    // calculate how much the survey is finished
    var percent_finished = (yes_answers + no_answers) / 122;

    // calculate how many answers aren't answered
    var not_answered = 122 - yes_answers - no_answers;    
    
  }

  return (userGroup !== 'admin') ? (
    <div>

      <Container>

        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1>My Dashboard</h1>
          </Col>
        </Row>

        <Row className="justify-content-md-center" style={{'paddingTop': '60px'}}>
          <Col md="auto">
            <Button variant="success" href="/survey">Take the Survey</Button>
          </Col>
        </Row>

        <Row style={{'paddingTop': '60px'}}>
          <Col>
            <h4>Best Candidate Matches: {JSON.stringify(bestCandidates)}</h4>
            
          </Col>
        </Row>

        <Row style={{'paddingTop': '10px'}}>
            <Col>
              You are {Math.trunc(percent_finished * 100)}% done with the survey
              <ProgressBar now={percent_finished * 100}/>
            </Col>
          </Row>

          <Row style={{'paddingTop': '10px'}}>
            <Col>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Answer', 'Amount'],
                  ['Yes', yes_answers],
                  ['No', no_answers],
                ]}
                options={{
                  title: 'Yes/No Ratio',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Answer', 'Amount'],
                  ['Yes', yes_answers],
                  ['No', no_answers],
                  ['Not Answered', not_answered],
                ]}
                options={{
                  title: 'Survey Completion',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Part', 'Amount'],
                  ['Part 1', part_1],
                  ['Part 2', part_2],
                  ['Part 3', part_3],
                  ['Part 4', part_4],
                  ['Part 5', part_5],
                  ['Not Answered', not_answered],
                ]}
                options={{
                  title: 'Survey Completion By Parts',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Part', 'Amount'],
                  ['Part 1', part_1],
                  ['Part 2', part_2],
                  ['Part 3', part_3],
                  ['Part 4', part_4],
                  ['Part 5', part_5],
                ]}
                options={{
                  title: 'Survey By Parts',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
          </Row>

      </Container>

      <div className="fixed-bottom">
        {(isCandidate) ?
                (<div>
                  
                  <div>Current user status: candidate<Link to="/aboutcandidate">about candidate page</Link></div>
                </div>)
                :
                (<div>
                  Current user status: voter
                </div>)}

                <div>
                  <Link to="/candidate-verification">Are you a candidate?</Link>
                </div>
        </div>

    </div>
  ) :
    (
      <div>

        <Container>

          <Row className="justify-content-md-center">
            <Col md="auto">
              <h1>My Dashboard</h1>
            </Col>
          </Row>

          <Row className="justify-content-md-center" style={{'paddingTop': '60px'}}>
            <Col md="auto">
              <Button variant="success" href="/survey">Take the Survey</Button>
            </Col>

            <Col md="auto">
              <Button variant="secondary" href="/admin">Go to Admin Page</Button>
            </Col>
          </Row>

          <Row style={{'paddingTop': '60px'}}>
            <Col>
              <h4>Best Candidate Matches: {JSON.stringify(bestCandidates)}</h4>
            </Col>
          </Row>

          <Row style={{'paddingTop': '10px'}}>
            <Col>
              You are {Math.trunc(percent_finished * 100)}% done with the survey
              <ProgressBar now={percent_finished * 100}/>
            </Col>
          </Row>

          <Row style={{'paddingTop': '10px'}}>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Answer', 'Amount'],
                  ['Yes', yes_answers],
                  ['No', no_answers],
                ]}
                options={{
                  title: 'Yes/No Ratio',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Answer', 'Amount'],
                  ['Yes', yes_answers],
                  ['No', no_answers],
                  ['Not Answered', not_answered],
                ]}
                options={{
                  title: 'Survey Completion',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Part', 'Amount'],
                  ['Part 1', part_1],
                  ['Part 2', part_2],
                  ['Part 3', part_3],
                  ['Part 4', part_4],
                  ['Part 5', part_5],
                  ['Not Answered', not_answered],
                ]}
                options={{
                  title: 'Survey Completion By Parts',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col style={{'paddingLeft': '10px', 'paddingRight': '10px'}}>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Part', 'Amount'],
                  ['Part 1', part_1],
                  ['Part 2', part_2],
                  ['Part 3', part_3],
                  ['Part 4', part_4],
                  ['Part 5', part_5],
                ]}
                options={{
                  title: 'Survey By Parts',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
          </Row>
          
        </Container>

        <div className="fixed-bottom">
          {(isCandidate) ?
                  (<div>
                    
                    <div>Current user status: candidate<Link to="/aboutcandidate">about candidate page</Link></div>
                  </div>)
                  :
                  (<div>
                    Current user status: voter
                  </div>)}

                  <div>
                    <Link to="/candidate-verification">Are you a candidate?</Link>
                  </div>
        </div>
        

      </div>
    );
}

export default withAuthenticator(Dashboard);
