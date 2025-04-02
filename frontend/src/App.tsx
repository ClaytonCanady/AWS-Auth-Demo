import { useEffect } from "react";
import "./App.css";

import { fetchAuthSession } from "aws-amplify/auth";
import { signOut } from "@aws-amplify/auth";

async function getAuthToken(): Promise<string | undefined> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

function App() {
  useEffect(() => {
    console.log("mounted");

    getAuthToken().then((token) => {
      if (token === undefined) {
        console.log("No token found");
        return;
      }
      console.log("Token:", token);
    });
  }, []);

  function handleSignOut() {
    signOut();
  }

  return (
    <>
      <h1>Session 7 Frontend</h1>
      <div className="card">
        <button onClick={handleSignOut}>SignOut</button>
      </div>
    </>
  );
}

export default App;
