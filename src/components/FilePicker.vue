<script setup>
const emit = defineEmits(['file-selected']);

function handleFileChange(event) {
  const file = event.target.files[0];
  emit('file-selected', file);
}
</script>

<template>
  <div>
    <input type="file" @change="handleFileChange" />
  </div>
</template>
