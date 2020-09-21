import AsmlValidator from '.';
// const AsmlValidator = require('./index').default;

import sampleModel from 'asml/examples/sending-email.asm.json';
// import sampleState from 'asml/examples/sending-email.json';

const asml = new AsmlValidator;

const sampleState = {
  "from": "samanib",
  "to": "dennis.wolters@upb.de",
  "body": "this is a text"
}

async function main() {
  const result = asml.validate(sampleModel, sampleState);
  console.log('errors:', asml.errors);
  console.log('result:', result)
}

main();
