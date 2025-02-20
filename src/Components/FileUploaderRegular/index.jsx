// import React from 'react'
import React, { useId, useState } from 'react'
import { GoUpload } from "react-icons/go";
import "./style.css"
import imageCompression from "browser-image-compression"
import { FFmpeg } from '@ffmpeg/ffmpeg';


const FileUploader = ({ updateFileFunc, uploadAccept, updateStatus, multiple = false, maxFiles, minFiles }) => {
   const uniqueId = useId()

   const [name, setName] = useState("");

   const processFile = async (files) => {
      if (multiple) {
         let processedFiles = [];
         let processFileName = "";
         for (let index = 0; index < files.length; index++) {
            var file = files[index];
            let type = file.type;
            if (file === undefined || type === undefined) {

            }
            else {
               if (type.startsWith('image')) {
                  // Compress and convert image
                  const compressedFile = await imageCompression(file, {
                     maxSizeMB: 1,
                     maxWidthOrHeight: 800,
                     useWebWorker: true,
                  });
                  processFileName += compressedFile.name + ",";
                  processedFiles.push(compressedFile);
               } else if (type.startsWith('audio')) {
                  // Process audio with FFmpeg
                  const ffmpegInstance = ({ log: true });
                  await ffmpegInstance.load();

                  const audioData = new Uint8Array(await file.arrayBuffer());
                  ffmpegInstance.FS('writeFile', 'input.mp3', audioData);

                  await ffmpegInstance.run('-i', 'input.mp3', '-b:a', '64k', 'output.mp3');
                  const output = ffmpegInstance.FS('readFile', 'output.mp3');

                  const finalOutput = Buffer.from(output).toString('base64');

                  return JSON.stringify(finalOutput);
               } else {
                  throw new Error('Unsupported file type');
               }
            }
         }
         setName(processFileName);
         return updateFileFunc(processedFiles);
      }
      else {
         let file = files[0];
         let type = file.type;
         if (file === undefined || type === undefined) {
            if (name === "") {
               updateStatus(undefined);
            }
         }
         else {
            if (type.startsWith('image')) {
               // Compress and convert image
               const compressedFile = await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 800,
                  useWebWorker: true,
               });
               setName(compressedFile.name);
               return updateFileFunc(compressedFile);
            } else if (type.startsWith('audio')) {
               // Process audio with FFmpeg
               const ffmpegInstance = new FFmpeg({ log: true });
               await ffmpegInstance.load();


               const audioData = new Uint8Array(await file.arrayBuffer());
               await ffmpegInstance.writeFile('./input.mp3', audioData);
               // ffmpegInstance.FS('writeFile', 'input.mp3', audioData);

               await ffmpegInstance.exec(['-i', 'input.mp3', '-b:a', '64k', 'output.mp3']);
               const output = await ffmpegInstance.readFile("./output.mp3");
               return updateFileFunc(output);

               // await ffmpegInstance.run('-i', 'input.mp3', '-b:a', '64k', 'output.mp3');
               // const output = ffmpegInstance.FS('readFile', 'output.mp3');

               // return Buffer.from(output).toString('base64');
            } else {
               throw new Error('Unsupported file type');
            }
         }
      }
   };

   return (
      <div style={{ display: "flex", height: "36px" }}>
         <div className='uploadContainer' style={{ height: "36px", width: "120px" }}>
            <input
               style={{ width: "120px", height: "100% ", display: "none", cursor: "pointer" }}
               type="file"
               multiple={multiple}
               accept={uploadAccept}
               id={`fileInput${uniqueId}`}
               min={multiple ? minFiles : 1}
               max={multiple ? maxFiles : 1}
               onChange={(e) => processFile(e.target.files)}
            />
            <GoUpload size={16} />
            <label style={{ cursor: "pointer" }} htmlFor={`fileInput${uniqueId}`} className='uploadText'>Upload file</label>
         </div>
         <div style={{ paddingLeft: "8px", fontSize: "12px", whiteSpace: "nowrap", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis" }}> {name}</div>
      </div>
   )
}

export default FileUploader