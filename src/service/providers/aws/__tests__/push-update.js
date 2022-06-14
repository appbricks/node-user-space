// Required dependencies conflict
//
// "aws-appsync": "^4.1.4",
// "aws-sdk": "^2.1058.0",
// "graphql-tag": "^2.12.6",
// "node-fetch": "^2.6.6",
//
// npm install -D aws-sdk
// npm install -D aws-appsync
// npm install -D graphql-tag
// npm install -D node-fetch

if (!globalThis.fetch) {
  const fetch = require('node-fetch');
  globalThis.fetch = fetch;
}

const region = process.env.AWS_REGION
const apiUrl = process.env.API_URL

AWS=require('aws-sdk');
AWS.config.region=region;

const { AWSAppSyncClient } = require('aws-appsync');
const gqlClient = new AWSAppSyncClient({
  url: apiUrl,
  region: region,
  auth: {
    type: 'AWS_IAM',
    credentials: new AWS.EnvironmentCredentials('AWS')
  },
  disableOffline: true
});

const gql = require('graphql-tag');

const mutation = gql`mutation PushUpdate($data: String!) {
  ${process.argv[2]}
}`;
const dataTmpl = process.argv[3];

const numUpdates = parseInt(process.argv[4], 10);
let i = 0;

function pushUpdate() {
  const regex = new RegExp('\\$i', "g");
  const data = JSON.parse(dataTmpl.replace(regex, `${i}`));
  const variables = {
    data: JSON.stringify(data)
  };
  const j = i;
  gqlClient.mutate({mutation, variables})
    .then(data => console.log(JSON.stringify({data: data.data, updateCount: j})))
    .catch(error => console.error(error));  

  if (++i < numUpdates) {
    setTimeout(pushUpdate, 100)
  }
}

pushUpdate();
