import React, { Component } from 'react';
import '../styles/Signin.css'

class Signin extends Component {

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className ="intro">
        <div className="panel-landing" id="section-1">
          <div className="landing-title">
            <center><h1>My Favorite Things</h1></center>
          </div>
          <button
            className="btn btn-primary btn-lg bbutton"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
            >
            Sign In with Blockstack
          </button>
        </div>
      </div>
    );
  }
}

export default Signin
