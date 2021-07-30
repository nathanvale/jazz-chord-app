import React from "react";
import { useIdentityContext } from "react-netlify-identity-gotrue";

export default function Protected() {
  const { user } = useIdentityContext();
  return (
    <div>
      <h3>Protected Page</h3>
      You are logged in as <b>{user?.email}</b>
    </div>
  );
}
