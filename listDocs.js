const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client();

exports.handler = async (event) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "CORS preflight handled" }),
        };
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME,
        });

        const response = await s3.send(command);

        const files = response.Contents?.map(obj => ({
            id: obj.Key,
            lastModified: obj.LastModified,
            size: obj.Size
        })) || [];

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ files }),
        };
    } catch (err) {
        console.error("List error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
