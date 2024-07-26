<script setup>
import { ref } from 'vue'
import FileTree from './components/FileTree.vue';
import FilePicker from './components/FilePicker.vue';
import { clearFileSystem, loadFile, listContents, extractFiles } from './7z-wasm-wrapper'
import { downloadBlob } from './file-utils'

const fileRef = ref(null)
const fileName = ref('');
const fileTree = ref(null);

function handleFileLoad(file) {
  fileRef.value = file
  fileName.value = file.name;
  clearFileSystem()
  loadFile(file, _ => {
    updateFileTree()
  })
}

function reloadFile() {
  if (fileRef.value) {
    handleFileLoad(fileRef.value)
  }
}

function updateFileTree() {
  if (fileName.value) {
    const tree = listContents(fileName.value)
    console.log("File tree updated:", tree)
    fileTree.value = tree
  }
}

function handleFileClicked(file) {
  console.log("Trying to extract:", file)
  const fileData = extractFiles(fileName.value, [file.path])[0]
  console.log(fileData)
  const mimetype = 'application/octet-stream'
  downloadBlob(fileData, file.name, mimetype)
}

</script>

<template>
  <FilePicker @file-selected="handleFileLoad" />
  <ul class="file-tree-area">
    <FileTree v-for="file in fileTree" :model="file" @file-clicked="handleFileClicked" />
  </ul>
  <button @click="reloadFile">Reload</button>
</template>

<style scoped></style>
