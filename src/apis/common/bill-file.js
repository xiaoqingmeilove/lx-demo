import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
  getBillFiles: resolveUrl('file/folder-info/list'),
  addFolder: resolveUrl('file/folder-info/save'),
  deleteFolder: resolveUrl('file/folder-info/del'),
  updateFolder: resolveUrl('file/folder-info/edit'),
  addBillFile: resolveUrl('file/folder-info/save-file'),
  updateBillFlieName: resolveUrl('file/folder-info/edit-file'),
  moveFile: resolveUrl('file/folder-info/move-file-folder'),
  deleteFile: resolveUrl('file/folder-info/del-file'),
  exportFiles: resolveUrl('file/download-center/common-download'),

  getBillAuthFiles: resolveUrl('file/folder-auth/list-auth'),
  addAuthBillFile: resolveUrl('file/folder-auth/save-file-auth'),
  updateBillAuthFlieName: resolveUrl('file/folder-auth/edit-file-auth'),
  moveAuthFile: resolveUrl('file/folder-auth/move-file-folder-auth'),
  deleteAuthFile: resolveUrl('file/folder-auth/del-file-auth'),
  exportAuthFiles: resolveUrl('file/folder-auth/common-download-auth'),
}

const getBillFiles = (billId, billType) => {
  return request({
    method: 'GET',
    url: URLs.getBillFiles,
    params: {
      billId,
      billType
    }
  })
}
const getBillAuthFiles = (billId, billType,menuCode) => {
  return request({
    method: 'GET',
    url: URLs.getBillAuthFiles,
    params: {
      billId,
      billType,
      menuCode
    }
  })
}

const addFolder = (billId, billType, folderName) => {
  return request({
    method: 'POST',
    url: URLs.addFolder,
    data: {
      billId,
      billType,
      folderName
    }
  })
}

const deleteFolder = (id, billId, billType) => {
  return request({
    method: 'DELETE',
    url: URLs.deleteFolder,
    data: {
      id,
      billId,
      billType,
    }
  })
}

const updateFolder = (data) => {
  return request({
    method: 'PUT',
    url: URLs.updateFolder,
    data: {
      ...data
    }
  })
}

const addBillFile = data => {
  return request({
    method: 'POST',
    url: URLs.addBillFile,
    data: {
      ...data
    }
  })
}

const updateBillFlieName = (data) => {
  return request({
    method: 'PUT',
    url: URLs.updateBillFlieName,
    data: {
      ...data
    }
  })
}

const moveFile = (data) => {
  return request({
    method: 'PUT',
    url: URLs.moveFile,
    data: {
      ...data
    }
  })
}

const deleteFile = (data) => {
  return request({
    method: 'PUT',
    url: URLs.deleteFile,
    data: {
      ...data
    }
  })
}

const exportFiles = (billId, billType, folderInfoId) => {
  return request({
    method: 'POST',
    url: URLs.exportFiles,
    data: {
      billId,
      billType,
      folderInfoId
    },
    responseType: 'blob',
  })
}

const addAuthBillFile = data => {
  return request({
    method: 'POST',
    url: URLs.addAuthBillFile,
    data: {
      ...data
    }
  })
}

const updateBillAuthFlieName = (data) => {
  return request({
    method: 'PUT',
    url: URLs.updateBillAuthFlieName,
    data: {
      ...data
    }
  })
}

const moveAuthFile = (data) => {
  return request({
    method: 'PUT',
    url: URLs.moveAuthFile,
    data: {
      ...data
    }
  })
}

const deleteAuthFile = (data) => {
  return request({
    method: 'PUT',
    url: URLs.deleteAuthFile,
    data: {
      ...data
    }
  })
}

const exportAuthFiles = (billId, billType, folderInfoId,menuCode,folderCode) => {
  return request({
    method: 'POST',
    url: URLs.exportAuthFiles,
    data: {
      billId,
      billType,
      folderInfoId,
      menuCode,
      folderCode
    },
    responseType: 'blob',
  })
}

export default {
  getBillFiles,
  addFolder,
  deleteFolder,
  updateFolder,
  addBillFile,
  updateBillFlieName,
  moveFile,
  deleteFile,
  exportFiles,
  getBillAuthFiles,

  addAuthBillFile,
  updateBillAuthFlieName,
  moveAuthFile,
  deleteAuthFile,
  exportAuthFiles
}
