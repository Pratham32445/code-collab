import {
  CopyObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.END_POINT!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const copyFolder = async (src_folder: string, dest_folder: string) => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.SRC_BUCKET!,
      Prefix: src_folder,
    });
    const res = await r2Client.send(listCommand);
    if (!res) return;
    for (const object of res.Contents!) {
      const objectKey = object.Key;
      if (!objectKey) return;
      const destinationKey = objectKey.replace(src_folder, dest_folder);
      const cmd = new CopyObjectCommand({
        Bucket: process.env.DEST_BUCKET!,
        CopySource: `/${process.env.SRC_BUCKET!}/${objectKey}`,
        Key: destinationKey!,
      });
      await r2Client.send(cmd);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
