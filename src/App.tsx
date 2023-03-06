import "./App.css";

import React from "react";

import useScript from "./use-script";

// TODO(developer): Set to client ID and API key from the Google Developer Console
const CLIENT_ID =
  REPLACE_CLIENT_ID; // OAuth 2.0 Client IDs TractorClient
const API_KEY = REPLACE_API_KEY; // TractorAPIKEY

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://docs.googleapis.com/$discovery/rest?version=v1";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents.readonly";

interface ssArgs {
  apiKey: string;
  discoveryDocs?: string[];
  sheetId: string;
}

declare global {
  interface Window {}
}

function useSpreadsheet({ apiKey, discoveryDocs, sheetId }: ssArgs) {
  const gapiLoadingState = useScript("https://apis.google.com/js/api.js");
  const [gapiInited, setGapiInited] = React.useState(false);

  React.useEffect(() => {
    async function initializeGapiClient() {
      await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
      });
      console.log("gapiInited true");
      setGapiInited(true);
    }
    console.log("entry", { gapiLoadingState });
    if (gapiLoadingState === "ready" && window.gapi) {
      console.log("ready:", { gapi: window.gapi });
      gapi.load("client", initializeGapiClient);
    }
    return () => {
      console.log("cleanup");
    };
  }, [gapiLoadingState, gapiInited]);

  return { gapiLoadingState: gapiLoadingState, gapiInited };
}

function App() {
  const tokenClient = React.useState();

  const { gapiLoadingState, gapiInited } = useSpreadsheet({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
    sheetId: "1",
  });

  return (
    <div className="App">
      <fieldset>
        <legend>Google Stuff</legend>
        <input
          id="gapiInited"
          type="checkbox"
          checked={gapiInited}
          disabled
        ></input>
        <label htmlFor="gapiInited">gapiInited</label>
        <p>{gapiLoadingState}</p>
        <p>{gapiLoadingState === "ready" && "GO"}</p>
      </fieldset>
    </div>
  );
}

export default App;
