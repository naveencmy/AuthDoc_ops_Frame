import multer from "multer"
import path from "path"
import env from "../config/env.js"

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(env.STORAGE_PATH,"uploads"))
  },
  filename:(req,file,cb)=>{
    const name = Date.now()+"_"+file.originalname
    cb(null,name)
  }
})

const fileFilter = (req,file,cb)=>{
  if(!file.originalname.endsWith(".zip")){
    return cb(new Error("Only ZIP files allowed"))
  }
  cb(null,true)
}
export const upload = multer({
  storage,
  fileFilter,
  limits:{
    fileSize: 1024*1024*500
  }
})