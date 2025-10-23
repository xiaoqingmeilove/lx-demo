import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  uploadFile: resolveUrl('file/notAuthFile/upload'),
  getDictByCode: resolveUrl('sys/sys-dictionaries/getDictionariesApply'),
  getPCAData: resolveUrl('basic-data/region/tree'),
}

/*
class ApiInstance {
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', new Blob([file]), file.name)
    return request({
    	method: 'POST',
    	url: URLs.uploadFile,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  getDictByCode(code) {
    return request({
    	method: 'POST',
    	url: URLs.getDictByCode,
      data: code,
    })
  }
  getPCAData() {
    return request({
      method: 'GET',
      url: URLs.getPCAData,
    })
  }
}

export default ApiInstance
*/

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', new Blob([file]), file.name)
  return request({
    method: 'POST',
    url: URLs.uploadFile,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
const getDictByCode = (code) => {
  return request({
    method: 'POST',
    url: URLs.getDictByCode,
    data: code,
  })
}

const getPCAData = () => {
  return request({
    method: 'GET',
    url: URLs.getPCAData,
  })
}

export default {
  uploadFile,
  getDictByCode,
  getPCAData
}