import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import './App.css';


function Dashboard() {
  Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  }).then(user => console.log(user))
  .catch(err => console.log(err));

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
