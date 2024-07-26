<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  model: Object
})

const emit = defineEmits(['file-clicked'])

const isOpen = ref(false)
const isFolder = computed(() => {
  return props.model.children && props.model.children.length
})

function toggle() {
  isOpen.value = !isOpen.value
}

function addChild() {
  props.model.children.push({ name: 'new stuff' })
}

function handleFileClicked(file) {
  // console.log(file)
  emit('file-clicked', file)
}
</script>

<template>
  <li v-if="isFolder" class="folder">
    <details :open="isOpen">
      <summary @click="toggle">
        <span class="file-name">
          <span class="folder-icon" :class="{ open: isOpen }"></span>
          {{ model.name }}
        </span>
      </summary>
      <ul class="file-tree">
        <FileTree v-for="model in model.children" :model="model" @file-clicked="handleFileClicked" />
      </ul>
    </details>
  </li>
  <li v-else class="file">
    <a href='#' @click.prevent="handleFileClicked(model)">
      <div class="file-name">
        <span class="file-icon"></span>
        {{ model.name }}
      </div>
    </a>
  </li>
</template>
