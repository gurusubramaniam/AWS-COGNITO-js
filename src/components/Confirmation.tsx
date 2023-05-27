import React, { useState } from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { useHistory } from "react-router-dom";

const Confirmation = () => {
  const history = useHistory();
  const poolData = {
    UserPoolId: "eu-north-1_TICAwyFtg",
    ClientId: "70v4q090cg3ohbbaeasvda7qol"
  };
  const [state, setState] = useState({
    username: "",
    verification: ""
  });

  const { username, verification } = state;

  console.log(username, verification);
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(verification, true, (err, result) => {
      if (err) {
        console.log({ err });
      } else {
        //
      }
    });
  };
  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Confirmation Test</h1>
      <div className="row center-align formbody">
        <form className="col s12" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-field col s4 offset-s4">
              <input
                value={username || ""}
                onChange={handleChange}
                placeholder="Username"
                id="username"
              />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4 offset-s4">
              <input
                value={verification || ""}
                onChange={handleChange}
                placeholder="verification"
                id="verification"
              />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light"
            type="submit"
            name="action"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Confirmation;
