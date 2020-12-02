import React from 'react';
import {Link} from 'react-router-dom';
import {Storage} from 'aws-amplify';
import './App.css';
import './verification.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';


function CandidateVerification() {

	const uploadHandler = async (e) => {


	    const file = e.target.files[0];
	    try {

	      // Upload the file to s3 with private access level. 
	      await Storage.put('picture.jpg', file, {
	        level: 'private',
	        contentType: 'image/jpg'
	      });

	    } catch (err) {
	      console.log(err);
	    }


	}





	return (
    <div>
    	<AmplifySignOut />
    	<br/><br/><br/>
    	<h1>Candidate Verification</h1><br/><br/>


    	Please upload an image of one of your verification documents.<br/>
    	You will be sent an email with the details of your verification.
    	<br/><br/>
    	The accepted documents are:<br/>
    	<ul>
    		<li>Birth Certificate</li>
			<li>Driver's License</li>
    		<li>Passport</li>
    		<li>Military ID</li>
    	</ul>
    	<br/>
    	<br/>

        <input type="file"/>
      	<button onClick={uploadHandler}>Upload selected images</button>
	</div>
  );
}

export default withAuthenticator(CandidateVerification);
