import fs from "fs";
import Jimp = require("jimp");
const Axios = require('axios')

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {

      let photo : any = await GetImage(inputURL,__dirname + '/tmp/image.jpg');
      photo = await Jimp.read(photo);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img:any) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

async function GetImage(inputURL:string, filepath:string) {
  const result = await Axios.get(inputURL,{
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
   result.data.pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}


// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
