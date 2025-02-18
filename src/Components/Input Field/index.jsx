import React from 'react'
import FileUploader from '../FileUploaderRegular'

const Input = ({ spanText, labelFor, uploadAccept = "image/*", disabled, labelText, name, value, onChange, id, options, uploadFunc, inputType }) => {
   return (
      <div className='formFieldContainer'>
         {
            spanText ?
               <span className='fieldLabel'>{spanText}</span>
               :
               labelText ?
                  <label className='fieldLabel' htmlFor={labelFor}>{labelText}</label>
                  :
                  <></>
         }
         {
            options ?
               <select
                  name={name}
                  value={value}
                  className="formField"
                  onChange={onChange}
                  id={id}
                  disabled={disabled}
               >
                  {
                     options?.map((opt, index) => {
                        return (
                           <option key={index} value={opt.value}>
                              {opt.label}
                           </option>
                        )
                     })
                  }

               </select>
               :
               <></>
         }
         {
            uploadFunc ?
               <div className='customFileUploadContainer'>
                  <FileUploader
                     updateFileFunc={uploadFunc}
                     uploadAccept={uploadAccept}
                  />
               </div>
               :
               <></>
         }
         {
            inputType ?
               <input
                  type={inputType}
                  name={name}
                  id={id}
                  className='formField'
                  value={value}
                  onChange={onChange}
               />
               :
               <></>
         }
      </div>
   )
}

export default Input