<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: String
})

const isVisible = ref(false);

function showPopup() {
  isVisible.value = true;
};

function hidePopup() {
  isVisible.value = false;
};

defineExpose({
  isVisible,
  showPopup,
  hidePopup,
});
</script>

<template>
  <div v-if="isVisible" class="popup-backdrop" @click="hidePopup">
    <div class="popup-content" @click.stop>
      <h2>{{ title }}</h2>
      <div>
        <slot></slot>
      </div>
      <button @click="hidePopup">Close</button>
    </div>
  </div>
</template>

<style scoped>
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-content div {
  margin-bottom: 20px;
  white-space: pre-wrap;
}
</style>