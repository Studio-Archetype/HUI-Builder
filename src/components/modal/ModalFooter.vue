<template>
  <footer class="footer">
    <slot />
  </footer>
</template>

<style scoped>
.footer {
  @apply flex flex-grow-0 justify-end p-2 bg-neutral-800;
}
</style>
