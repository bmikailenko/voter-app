import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import './App.css';


function Dashboard() {
  return (
      <div>
        <AmplifySignOut />
        <h1>My Dashboard</h1>
        <Link to="/survey">Survey</Link>
      </div>
  );
}

export default withAuthenticator(Dashboard);
