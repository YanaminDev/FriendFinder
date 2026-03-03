import { supabase } from "../../../lib/supabase"

interface FileData {
  fieldname: string
  originalname: string
  mimetype: string
  buffer: Buffer
  size: number
}

export async function uploadFile(file: FileData) {
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.originalname}`
  const filePath = `user-images/${fileName}`

  const { data, error } = await supabase.storage
    .from('userImage')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: publicData } = supabase.storage
    .from('userImage')
    .getPublicUrl(filePath)

  return {
    success: true,
    imageUrl: publicData.publicUrl,
    path: filePath
  }
}