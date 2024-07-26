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
  <li v-if="isFolder">
    <details>
      <summary @click="toggle">
        {{ model.name }}
      </summary>
      <ul :open="isOpen">
        <FileTree class="item" v-for="model in model.children" :model="model" @file-clicked="handleFileClicked" />
      </ul>
    </details>
  </li>
  <li v-else>
    <a href='#' @click.prevent="handleFileClicked(model)">
      {{ model.name }}
    </a>
  </li>
</template>

<style scoped>
li {
  display: block;
  position: relative;
  padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
}

ul {
  margin-left: calc(var(--radius) - var(--spacing));
  padding-left: 0;
}
</style>