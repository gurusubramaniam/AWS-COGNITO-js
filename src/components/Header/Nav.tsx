import React, { useEffect } from "react";
import SigninLinks from "./SigninLinks";
import SignoutLinks from "./SignoutLinks";
import useHandlder from "../configHandler/useHandler";

const Nav = () => {
  const { getAuthenticatedUser } = useHandlder();

  const Links = getAuthenticatedUser() ? <SigninLinks /> : <SignoutLinks />;
  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="container">
        <h2 className="brand-logo">Logo</h2>
        {Links}
      </div>
    </nav>
  );
};

export default Nav;
