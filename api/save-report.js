/**
 * Vercel Serverless Function to save boom deployment reports to Airtable.
 * This function handles a POST request, parses the JSON body, and
 * creates a new record in the specified Airtable base and table.
 *
 * To run this function, you need to set up the following environment variables on Vercel:
 * - AIRTABLE_API_KEY
 * - AIRTABLE_BASE_ID
 * - AIRTABLE_TABLE_NAME (e.g., "Reports")
 */

import Airtable from 'airtable';

// Initialize Airtable with API key from environment variables.
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const data = req.body;

        // Ensure all required fields are present in the data
        if (!data.report || !data.riverMile || !data.boomLength) {
            return res.status(400).json({ message: 'Missing required data fields' });
        }

        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = process.env.AIRTABLE_TABLE_NAME;

        if (!baseId || !tableName) {
            return res.status(500).json({ message: 'Airtable environment variables not configured.' });
        }

        // Use the base and table name from environment variables
        const base = airtable.base(baseId);

        // Create a new record in Airtable
        const record = await base(tableName).create({
            "River Mile": data.riverMile,
            "Current": data.current,
            "Boom Length": data.boomLength,
            "Angle": data.angle,
            "Required Anchors": data.anchors,
            "Segments": data.segments,
            "Segment Length": data.segmentLength,
            "Report": data.report,
            "River Width": data.riverWidth,
            "Drift Time": data.driftTime,
            "Anchor Interval": data.anchorInterval,
            "Date": new Date().toISOString()
        });
        
        console.log('Record created successfully:', record.id);
        
        // Respond with a success message
        return res.status(200).json({ message: 'Report saved successfully!', data: record.id });

    } catch (error) {
        console.error('Function error:', error);
        return res.status(500).json({ message: 'Failed to save report', error: error.message });
    }
}
