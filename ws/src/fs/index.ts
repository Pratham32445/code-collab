import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";
import { Readable } from "stream";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.END_POINT!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const saveToLocal = async (spaceId: string) => {
  try {
    const bucket_name = process.env.DEST_BUCKET;
    const prefix = `${spaceId}/`;
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket_name!,
      Prefix: prefix,
    });
    const response = await r2Client.send(listCommand);
    if (!response.Contents || response.Contents.length == 0) {
      console.log("No Space found with this id");
      return;
    }
    const baseDir = path.join(__dirname, "../projects", spaceId);
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    for (const obj of response.Contents!) {
      if (obj.Key) {
        const relativePath = obj.Key.replace(prefix, "");
        const localFilePath = path.join(baseDir, relativePath);

        const fileDir = path.dirname(localFilePath);
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }

        const getCommand = new GetObjectCommand({
          Bucket: bucket_name,
          Key: obj.Key,
        });

        const { Body } = await r2Client.send(getCommand);

        if (Body instanceof Readable) {
          const writeStream = fs.createWriteStream(localFilePath);
          Body.pipe(writeStream);

          await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
          });

          console.log(`Downloaded: ${localFilePath}`);
        }
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
