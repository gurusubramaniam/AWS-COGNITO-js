import React from 'react';
import { NavLink } from "react-router-dom";

export default function SigninLinks() {
  return (
    <div>
      <div>
        <ul className="right">
          <li><NavLink to='/signin'>SignIn</NavLink></li>
          <li><NavLink to='/signup'>SignUp</NavLink></li>
        </ul>
      </div>
    </div>
  )
}
