const blobToFile = (data, filename) => {
  console.log(data,'data');
  let url = window.URL.createObjectURL(data)
  let a = document.createElement('a')
  a.href = url;
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
const  downloadUrlFile = (url) => {
  let a = document.createElement('a')
  a.target = '_blank'
  a.href = url;
  a.click()
}
const MIME_TYPE = {
  "png": "image/png",
  "gif": "image/gif",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "bmp": "image/x-ms-bmp",
  "pdf": "application/pdf",
  "txt": "text/plain",
  "xml": "text/xml",
}
const getFileExtensionFromUrl = (url) => {
  const match = url.match(/[^\/\\&\?]+\.(?:[^\/\\&\?]+)(?=[\?&]|\s|$)/)
  if (match) {
    const filename = match[0]
    return filename.split('.').pop()
  }
  return null
}
const previewFile = (url) => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const ext = getFileExtensionFromUrl(url)
      const mime = MIME_TYPE[ext]
      if (mime) {
        const fileUrl = URL.createObjectURL(new Blob([blob], { type: MIME_TYPE[ext] }))
        window.open(fileUrl, '_blank')
      } else {
        window.open(url, '_blank')
      }
    }).catch(error => this.$message.error('文件转换失败'));
}
export {
  blobToFile,
  downloadUrlFile,
  previewFile,
}
