import React, { useState, useCallback, useEffect } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const Pool_Data = {
  UserPoolId: "eu-north-1_TICAwyFtg",
  ClientId: "70v4q090cg3ohbbaeasvda7qol"
};

export default function useHandler() {
  const [state, setstate] = useState({
    loading: false,
    isAuthenticated: false
  });

  const { loading, isAuthenticated } = state;

  const userPool = new CognitoUserPool(Pool_Data);

  const getAuthenticatedUser = useCallback(() => {
    return userPool.getCurrentUser();
  }, []);

  console.log(getAuthenticatedUser());

  useEffect(() => {
    getAuthenticatedUser();
  }, [getAuthenticatedUser]);

  const signOut = () => {
    return userPool.getCurrentUser()?.signOut();
  };
  console.log("I am gere", getAuthenticatedUser()?.getUsername());

  return {
    loading,
    isAuthenticated,
    userPool,
    getAuthenticatedUser,
    signOut
  };
}
