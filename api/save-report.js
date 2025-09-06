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

        const record = await base('Ops Reports').create([{
            "fields": {
                "River Mile": parseFloat(riverMile),
                "River Width (ft)": parseFloat(riverWidth),
                "Drift Time (min)": driftTime,
                "Current (knots)": parseFloat(current),
                "Boom Length (ft)": parseFloat(boomLength),
                "Deployment Angle (degrees)": parseFloat(angle),
                "Required Anchors": parseFloat(anchors),
                "Number of Segments": parseFloat(segments),
                "Segment Length": parseFloat(segmentLength),
                "Anchor Interval": parseFloat(anchorInterval),
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
