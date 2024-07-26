<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['file-selected']);
const fileInput = ref(null);
const fileRef = computed(() => {
  if (!fileInput.value) return null;
  return fileInput.value.files[0];
})


function handleFileChange(event) {
  const file = event.target.files[0];
  emit('file-selected', file);
}

defineExpose({
  handleFileChange,
  fileRef,
});
</script>

<template>
  <div class="file-picker">
    <label for="file-input" class="file-picker-label blue">Choose File</label>
    <input ref="fileInput" id="file-input" type="file" @change="handleFileChange" />
  </div>
</template>
