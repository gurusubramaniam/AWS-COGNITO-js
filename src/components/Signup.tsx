import React, { useState } from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import Confirm from "./Confirmation";
import useHandlder from "./configHandler/useHandler";

const SignUp = () => {
  const { userPool } = useHandlder();

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    comfirmpassword: "",
    error: ""
  });

  const [confirm, setconfirm] = useState(false);

  const { username, email, password, comfirmpassword, error } = state;
  const attriList: CognitoUserAttribute[] = [];
  const EmailAttributes = {
    Name: "email",
    Value: email
  };
  attriList.push(new CognitoUserAttribute(EmailAttributes));
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userPool.signUp(username, password, attriList, null, (err, data) => {
      if (err) {
        setState({ ...state, error: err?.message });
      } else {
        //alert("Please visit your email");
      }
    });
  };

  return (
    <div className="App">
      <div className="App">
        <h1 style={{ textAlign: "center" }}>Signup Test</h1>
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
                  type="email"
                  value={email || ""}
                  onChange={handleChange}
                  placeholder="email"
                  id="email"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s4 offset-s4">
                <input
                  type="password"
                  value={password || ""}
                  onChange={handleChange}
                  placeholder="password"
                  id="password"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s4 offset-s4">
                <input
                  type="password"
                  value={comfirmpassword || ""}
                  onChange={handleChange}
                  placeholder="confirm password"
                  id="comfirmpassword"
                />
              </div>
            </div>
            {error ? <p style={{ color: "red" }}>{error}</p> : null}
            <button
              className="btn waves-effect waves-light"
              type="submit"
              name="action"
              disabled={!username}
            >
              Submit
            </button>
          </form>
          <button
            style={{ marginTop: 10 }}
            className="btn waves-effect waves-light"
            onClick={() => setconfirm(!confirm)}
          >
            Confirm
          </button>
          {confirm ? <Confirm /> : null}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
