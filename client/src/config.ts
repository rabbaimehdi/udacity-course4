// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7ebz6frz36'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-06m895h6.eu.auth0.com', // Auth0 domain
  clientId: 'R2o2vK49cTOGv0HzDlg33OpUKf4QyQ55', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
