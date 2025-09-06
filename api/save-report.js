const Airtable = require('airtable');

// Configure Airtable with your API key and base ID
const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID
} = process.env;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Airtable API key and base ID are not configured.'
    }),
  };
}

const base = new Airtable({
  apiKey: AIRTABLE_API_KEY
}).base(AIRTABLE_BASE_ID);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: 'Method Not Allowed'
      }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Debugging: Log the incoming data to see what the client is sending
    console.log('Received data:', data);

    const record = await base('Boom Deployments').create([{
      fields: {
        "River Mile": data["River Mile"],
        "Current": data["Current"],
        "Drift Time": data["Drift Time"],
        "River Width": data["River Width"],
        "Segments": data["Segments"],
        "Seg Length": data["Seg Length"],
        "Boom Length": data["Boom Length"],
        "Angle": data["Angle"],
        "Anchor Interval": data["Anchor Interval"],
        "Anchors": data["Anchors"],
        "Report": data["Report"]
      }
    }]);

    console.log('Record created successfully:', record[0].id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Report saved successfully!',
        id: record[0].id
      }),
    };
  } catch (error) {
    console.error('Failed to create record:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to save report. Error: ${error.message}`
      }),
    };
  }
};
