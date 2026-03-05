import { supabase } from "../../../lib/supabase"

interface FileData {
  fieldname: string
  originalname: string
  mimetype: string
  buffer: Buffer
  size: number
}

export async function uploadFile(file: FileData , bucket: string , path : string) {
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.originalname}`
  const filePath = `${path}/${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    success: true,
    imageUrl: publicData.publicUrl,
    path: filePath
  }
}