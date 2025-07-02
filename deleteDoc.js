const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client();

exports.handler = async (event) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS",
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "CORS preflight handled" }),
        };
    }

    try {
        // Get fileKey from path parameters, not body
        const fileKey = event.pathParameters && event.pathParameters.id;

        if (!fileKey) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "File key (id) is required" }),
            };
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey
        });

        await s3.send(command);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: `Deleted file ${fileKey}` }),
        };
    } catch (err) {
        console.error("Delete error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
