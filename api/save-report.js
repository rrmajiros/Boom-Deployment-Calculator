const Airtable = require('airtable');

module.exports = async (req, res) => {
    // Check if the request is a POST request
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    try {
        const { riverMile, riverWidth, driftTime, current, boomLength, angle, anchors, segments, segmentLength, report, anchorInterval } = req.body;

        // Check for required environment variables
        if (!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
            return res.status(500).json({ error: 'Airtable environment variables not set.' });
        }

        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
        });

        const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

        await base('Deployment Reports').create([
            {
                fields: {
                    "River Mile": riverMile,
                    "River Width (ft)": riverWidth,
                    "Drift Time (min)": driftTime,
                    "Current (knots)": current,
                    "Boom Length (ft)": boomLength,
                    "Deployment Angle (degrees)": angle,
                    "Required Anchors": anchors,
                    "Number of Segments": segments,
                    "Segment Length": segmentLength,
                    "Anchor Interval (ft)": anchorInterval,
                    "Report": report
                }
            }
        ]);

        res.status(200).json({ message: 'Report saved successfully!', data: req.body });
    } catch (error) {
        console.error('Error saving report to Airtable:', error);
        res.status(500).json({ error: 'Failed to save report to Airtable.', details: error.message });
    }
};
