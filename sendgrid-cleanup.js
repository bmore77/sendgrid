const sgClient = require('@sendgrid/client');
require('dotenv').config();

sgClient.setApiKey(process.env.SENDGRID_API_KEY);

async function removeInternalSuppressions(domain) {
  try {
    const request = {
      method: 'GET',
      url: '/v3/suppression/bounces'
    };
    const [response, body] = await sgClient.request(request);

    const emailsToRemove = body
      .filter(entry => entry.email.endsWith(`@${domain}`))
      .map(entry => entry.email);

    if (emailsToRemove.length > 0) {
      await sgClient.request({
        method: 'DELETE',
        url: '/v3/suppression/bounces',
        body: emailsToRemove
      });
      console.log(`Removed: ${emailsToRemove.join(', ')}`);
    } else {
      console.log('No internal suppressions found.');
    }
  } catch (error) {
    console.error('Error clearing suppressions:', error.response?.body || error);
  }
}

removeInternalSuppressions('harmsag.ca');
