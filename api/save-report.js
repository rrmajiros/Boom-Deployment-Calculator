const Airtable = require('airtable');

module.exports = async (req, res) => {
    try {
        const {
            riverMile,
            riverWidth,
            driftTime,
            current,
            boomLength,
            angle,
            anchors,
            segments,
            segmentLength,
            report,
            anchorInterval
        } = req.body;

        // Vercel environment variables are accessed via process.env
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;

        if (!apiKey || !baseId) {
            return res.status(500).json({ message: "Airtable environment variables not configured." });
        }

        Airtable.configure({
            apiKey: apiKey,
        });

        const base = Airtable.base(baseId);

        const record = await base('Boom Deployments').create([{
            "fields": {
                "River Mile": riverMile,
                "River Width (ft)": riverWidth,
                "Drift Time (min)": driftTime,
                "Current (knots)": current,
                "Boom Length (ft)": boomLength,
                "Deployment Angle (degrees)": angle,
                "Required Anchors": anchors,
                "Number of Segments": segments,
                "Segment Length": segmentLength,
                "Anchor Interval": anchorInterval,
                "Report": report,
                "Timestamp": new Date().toISOString()
            }
        }]);

        res.status(200).json({
            message: "Report saved successfully!",
            recordId: record[0].id
        });

    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`
        });
    }
};
