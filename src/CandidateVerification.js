import React from 'react';
import {Link} from 'react-router-dom';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';


function CandidateVerification() {

  return (
    <div>
      <AmplifySignOut />
      <h1>Candidate Verification Page</h1>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default withAuthenticator(CandidateVerification);
