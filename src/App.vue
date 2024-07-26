<script setup>
import { ref } from 'vue'
import FileTree from './components/FileTree.vue';
import FilePicker from './components/FilePicker.vue';
import Popup from './components/Popup.vue';
import { clearFileSystem, loadFile, listContents, extractFiles } from './7z-wasm-wrapper'
import { downloadBlob } from './file-utils'

const filePicker = ref(null);
const popup = ref(null)
const fileName = ref('');
const fileTree = ref([]);
const popupMsg = ref('')
const popupTitle = ref('')

function showPopup(title, msg) {
  popupTitle.value = title
  popupMsg.value = msg
  popup.value.showPopup()
}

function reportError(msg, ...obj) {
  console.error(msg, ...obj)
  if (popup.value) {
    showPopup("Error", msg + obj.join(' '))
  }
}

function handleFileLoad(file) {
  fileName.value = file.name;
  clearFileSystem()
  loadFile(file, _ => {
    updateFileTree()
  }, err => {
    reportError("Failed to load file: ", err)
  })
}

function reloadFile() {
  if (filePicker.value && filePicker.value.fileRef) {
    console.log("Reloading file:", filePicker.value.fileRef)
    handleFileLoad(filePicker.value.fileRef)
  } else {
    reportError("No file to reload")
  }
}

function updateFileTree() {
  if (fileName.value) {
    try {
      const tree = listContents(fileName.value)
      if (tree.length === 0) {
        reportError("Failed to list contents of file: ", fileName.value)
        return
      }
      console.log("File tree updated:", tree)
      fileTree.value = tree
    } catch (e) {
      reportError("Failed to list contents of file: ", fileName.value, '\n', e)
      return
    }
  }
}

function handleFileClicked(file) {
  console.log("Trying to extract:", file)
  try {
    const fileData = extractFiles(fileName.value, [file.path])[0]
    const mimetype = 'application/octet-stream'
    downloadBlob(fileData, file.name, mimetype)
  } catch (e) {
    reportError("Failed to extract file: ", e)
    return
  }
}

function clear() {
  clearFileSystem()
  fileTree.value = []
  fileName.value = ''
}
</script>

<template>
  <FilePicker ref="filePicker" @file-selected="handleFileLoad" />
  <button class="action-button green" @click="reloadFile()">Reload</button>
  <button class="action-button red" @click="clear()">Clear</button>
  <ul class="file-tree">
    <FileTree v-for="file in fileTree" :model="file" @file-clicked="handleFileClicked" />
  </ul>
  <Popup ref="popup" :title="popupTitle">
    {{ popupMsg }}
  </Popup>
</template>

<style scoped></style>
