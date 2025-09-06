
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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method Not Allowed'
    });
  }

  try {
    const data = req.body;

    // Debugging: Log the incoming data to see what the client is sending
    console.log('Received data:', data);

    const record = await base('Ops Reports').create([{
      fields: {
        "River Mile": data.riverMile,
        "Current": parseFloat(data.current),
        "Drift Time": data.driftTime,
        "River Width": parseFloat(data.riverWidth),
        "Segments": parseFloat(data.segments),
        "Seg Length": parseFloat(data.segLength),
        "Boom Length": parseFloat(data.boomLength),
        "Angle": parseFloat(data.angle),
        "Anchor Interval": parseFloat(data.anchorInterval),
        "Anchors": parseFloat(data.anchors),
        "Report": data.report
      }
    }]);

    console.log('Record created successfully:', record[0].id);

    return res.status(200).json({
      message: 'Report saved successfully!',
      id: record[0].id
    });
  } catch (error) {
    console.error('Failed to create record:', error);
    return res.status(500).json({
      message: `Failed to save report. Error: ${error.message}`
    });
  }
};
