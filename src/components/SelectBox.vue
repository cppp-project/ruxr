<template>
  <div
    ref="containerRef"
    class="floating-select"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <button
      :id="buttonId.toString()"
      class="floating-select__button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="menu"
      :aria-controls="menuId.toString()"
      @click="handleButtonClick"
    >
      <slot name="button">{{ title }}</slot>
      <span class="floating-select__caret" aria-hidden="true">▾</span>
    </button>

    <Transition name="fade-slide">
      <ul
        v-if="isOpen"
        :id="menuId.toString()"
        class="floating-select__menu"
        role="menu"
        :aria-labelledby="buttonId.toString()"
      >
        <slot name="menu-items">
          <li v-for="option in options" :key="option.label">
            <a href="#" role="menuitem" @click.prevent="option.callback">{{
              option.label
            }}</a>
          </li>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from "vue-class-component";
import { ref } from "vue";

interface Option {
  label: string;
  callback: () => void;
}

class Props {
  title = prop<string>({ required: true });
  options = prop<Option[]>({ required: true });
}

@Options({
  name: "SelectBox",
})
class SelectBox extends Vue.with(Props) {
  isOpen = false;

  // This Ref Tracks If The Menu Is In "Sticky" Mode (Opened By A Click).
  isSticky = false;

  // This Template Ref Binds To The Main Container Div.
  containerRef = ref<HTMLElement | null>(null);

  buttonId: string = "";
  menuId: string = "";

  async init(): Promise<void> {
    const uid = Math.random().toString(36).substring(2, 9);
    this.buttonId = `fs-button-${uid}`;
    this.menuId = `fs-menu-${uid}`;
  }

  /**
   * Handles The Click Event On The Button.
   * It Toggles The Menu's Open State And Activates Or Deactivates Sticky Mode.
   */
  handleButtonClick(): void {
    if (this.isOpen && this.isSticky) {
      // If The Menu Is Already Sticky, The Click Closes It.
      this.isOpen = false;
      this.isSticky = false;
    } else {
      // Otherwise, The Click Opens The Menu And Makes It Sticky.
      this.isOpen = true;
      this.isSticky = true;
    }
  }

  /**
   * Handles The Pointer Entering The Component's Area.
   * It Opens The Menu If It's Not Already In Sticky Mode.
   */
  handlePointerEnter(): void {
    if (!this.isSticky) {
      this.isOpen = true;
    }
  }

  /**
   * Handles The Pointer Leaving The Component's Area.
   * It Closes The Menu If It's Not In Sticky Mode.
   */
  handlePointerLeave(): void {
    if (!this.isSticky) {
      this.isOpen = false;
    }
  }

  /**
   * Handles Clicks Outside The Component.
   * If The Menu Is Sticky, An Outside Click Will Close It.
   * @param {MouseEvent} event - The Mouse Event.
   */
  handleClickOutside = (event: MouseEvent): void => {
    if (
      this.isSticky &&
      this.containerRef.value &&
      !this.containerRef.value.contains(event.target as Node)
    ) {
      this.isOpen = false;
      this.isSticky = false;
    }
  };

  /**
   * Handles The 'Escape' Key Press.
   * It Closes The Menu Regardless Of Its State.
   * @param {KeyboardEvent} event - The Keyboard Event.
   */
  handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.isOpen) {
      this.isOpen = false;
      this.isSticky = false;
      (
        this.containerRef.value?.querySelector("button") as HTMLButtonElement
      )?.focus();
    }
  };

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("keydown", this.handleEscapeKey);
  }

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleEscapeKey);
  }
}

export default SelectBox;
</script>

<style scoped>
.floating-select {
  position: relative;
  display: inline-block;
}

.floating-select__button {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  font-family: var(--font-family);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
  user-select: none;
}

.floating-select__caret {
  display: inline-block;
  transition: transform 250ms cubic-bezier(0.25, 1, 0.5, 1);
}

.floating-select__button[aria-expanded="true"] .floating-select__caret {
  transform: rotate(180deg);
}

.floating-select__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1000;

  min-width: 100%;
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
  background-color: var(--light);
  border: 1px solid var(--border);
  color: var(--dark);
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--shadow-hover);
}

.floating-select__menu :deep(a) {
  display: block;
  padding: 0.6rem 1.2rem;
  color: var(--dark);
  text-decoration: none;
  white-space: nowrap;
}

.floating-select__menu :deep(a:hover),
.floating-select__menu :deep(a:focus) {
  background-color: var(--secondary-light-hover);
  outline: none;
}

/* Animation Classes */

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
</style>
