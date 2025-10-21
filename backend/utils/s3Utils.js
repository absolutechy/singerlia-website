const {
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const s3Client = require("../config/s3Config");

const streamToString = async (stream) =>
  new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });

const getS3JsonObject = async (bucket, key) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);
  const jsonStr = await streamToString(response.Body);
  return JSON.parse(jsonStr);
};

const putS3JsonObject = async (bucket, key, jsonData) => {
  const jsonString = JSON.stringify(jsonData, null, 2);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: jsonString,
    ContentType: "application/json",
  });

  await s3Client.send(command);
};

const uploadToS3 = async (
  localFilePath,
  bucketName,
  s3Key,
  contentType = "application/pdf"
) => {
  const stats = fs.statSync(localFilePath);
  const fileStream = fs.createReadStream(localFilePath);

  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    throw err;
  });

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileStream,
        ContentType: contentType,
        ContentLength: stats.size,
      },
      queueSize: 4,
      partSize: 10 * 1024 * 1024,
    });

    upload.on("httpUploadProgress", (p) =>
      console.log(`Progress: ${p.loaded}/${p.total}`)
    );

    await upload.done();
    console.log(`✅ Uploaded successfully: ${s3Key}`);
    return true;
  } catch (err) {
    console.error("❌ Upload error:", err);
    throw new Error(`S3 Upload Failed: ${err.message}`);
  }
};

async function uploadToDirectlyS3(
  data,
  bucketName,
  s3Key,
  contentType = "application/pdf"
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: data,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (err) {
    throw new Error(`S3 Upload Failed: ${err.message}`);
  }
}

async function generatePresignedUrl(bucket, key, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (err) {
    throw new Error(`Presigned URL Failed: ${err.message}`);
  }
}

const s3DownloadFile = async (bucketName, s3Key, localFilePath) => {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    const stream = response.Body;
    const writeStream = fs.createWriteStream(localFilePath);
    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading file from S3: ${error.message}`);
    throw error;
  }
};

const listS3Objects = async (bucketName, prefix = "") => {
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error(`Error listing S3 objects: ${error.message}`);
    throw error;
  }
};

const checkS3ObjectExists = async (bucketName, s3Key) => {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
  };

  try {
    const command = new HeadObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    console.error(`Error checking S3 object existence: ${error.message}`);
    throw error;
  }
};

async function uploadTos3_GetURL(bucketName, localPath, s3Key, contentType) {
  await uploadToS3(localPath, bucketName, s3Key, contentType);

  const url = await generatePresignedUrl(bucketName, s3Key);
  if (!url) {
    throw new Error("Failed to generate presigned URL");
  }

  return url;
}

const deleteS3Object = async (bucketName, key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

    console.log(
      `✅ Successfully deleted object: ${key} from bucket: ${bucketName}`
    );
  } catch (error) {
    console.error(
      `❌ Error deleting object ${key} from bucket ${bucketName}:`,
      error
    );
    throw new Error("Failed to delete S3 object");
  }
};

module.exports = {
  getS3JsonObject,
  putS3JsonObject,
  generatePresignedUrl,
  uploadToS3,
  s3DownloadFile,
  listS3Objects,
  checkS3ObjectExists,
  uploadToDirectlyS3,
  uploadTos3_GetURL,
  deleteS3Object,
};
