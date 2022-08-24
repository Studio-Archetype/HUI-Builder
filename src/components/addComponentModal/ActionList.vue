<script setup lang="ts">
import type { PropType } from 'vue';
import type { Action, CommandAction, SoundAction, SoundSource } from '@/schema';
import { soundSources } from '@/schema';
import {
  faAdd,
  faMusic,
  faTerminal,
  faTrashCan,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits(['edit', 'new', 'delete']);
const props = defineProps({
  actions: {
    type: Array as PropType<Array<Action>>,
    required: true,
  },
});

function emitEdit(index: number, newAction: Action) {
  emit('edit', index, newAction);
}

function editCommand(index: number, newCommand: string) {
  const oldAction = props.actions[index] as CommandAction;
  const newAction: CommandAction = {
    ...oldAction,
    command: newCommand,
  };
  emitEdit(index, newAction);
}

function editSound(index: number, newSound: string) {
  const oldAction = props.actions[index] as SoundAction;
  const newAction: SoundAction = {
    ...oldAction,
    sound: newSound,
  };
  emitEdit(index, newAction);
}

function emitAdd() {
  emit('new');
}

function emitDelete(index: number) {
  emit('delete', index);
}

function switchType(index: number) {
  const oldAction = props.actions[index];

  let newAction: Action;
  if (oldAction.type === 'command')
    newAction = {
      type: 'sound',
      sound: '',
      source: 'master',
      volume: 1,
      pitch: 1,
    };
  else if (oldAction.type === 'sound')
    newAction = {
      type: 'command',
      command: '',
      source: 'player',
    };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  emitEdit(index, newAction!);
}

function editSoundSource(index: number, newSource: SoundSource) {
  const oldAction = props.actions[index] as SoundAction;
  const newAction: SoundAction = {
    ...oldAction,
    source: newSource,
  };
  emitEdit(index, newAction);
}

function editPitch(index: number, newPitch: number) {
  const oldAction = props.actions[index] as SoundAction;
  const newAction: SoundAction = {
    ...oldAction,
    pitch: newPitch,
  };
  emitEdit(index, newAction);
}

function editVolume(index: number, newVolume: number) {
  const oldAction = props.actions[index] as SoundAction;
  const newAction: SoundAction = {
    ...oldAction,
    volume: newVolume,
  };
  emitEdit(index, newAction);
}
</script>

<template>
  <div class="actionList">
    <div
      class="action"
      v-for="(action, index) in actions"
      :key="`action${index}`"
    >
      <template v-if="action.type === 'command'">
        <input
          class="flex-grow"
          placeholder="/give @s diamond_block"
          :value="action.command"
          @input="(e) => editCommand(index, (e.target as HTMLInputElement).value)"
        />
      </template>

      <template v-if="action.type === 'sound'">
        <input
          class="flex-grow"
          placeholder="Sound"
          :size="1"
          :value="action.sound"
          @inpit="(e) => editSound(index, (e.target as HTMLInputElement).value)"
        />
        <select
          id="actionSoundSource"
          @change="(e) => editSoundSource(index, (e.target as HTMLSelectElement).value as SoundSource)"
          :value="action.source"
        >
          <option v-for="source in soundSources" :key="source">
            {{ source }}
          </option>
        </select>

        <div class="labelIcon" title="Volume">
          <font-awesome-icon :icon="faVolumeHigh"></font-awesome-icon>
        </div>
        <input
          type="number"
          :min="1"
          :max="100"
          :value="action.volume"
          @input="(e) => editVolume(index, parseInt((e.target as HTMLInputElement).value))"
        />
        <div class="labelIcon" title="Pitch">
          <font-awesome-icon :icon="faMusic"></font-awesome-icon>
        </div>
        <input
          type="number"
          :min="1"
          :max="100"
          :value="action.pitch"
          @input="(e) => editPitch(index, parseInt((e.target as HTMLInputElement).value))"
        />
      </template>
      <button class="actionBtn" @click="switchType(index)">
        <font-awesome-icon
          :icon="action.type === 'command' ? faTerminal : faVolumeHigh"
          fixed-width
        ></font-awesome-icon>
      </button>
      <button class="actionBtn delete" @click="emitDelete(index)">
        <font-awesome-icon :icon="faTrashCan" fixed-width></font-awesome-icon>
      </button>
    </div>
    <button class="addButton" @click="emitAdd">
      <font-awesome-icon
        :icon="faAdd"
        fixed-width
        class="icon"
      ></font-awesome-icon>
      Add
    </button>
  </div>
</template>

<style scoped lang="scss">
.actionList {
  @apply rounded;

  & > * {
    &:first-child {
      @apply rounded-t;
    }

    &:last-child {
      @apply rounded-b;
    }

    &:not(:last-child) {
      @apply mb-[1px];
    }
  }

  .action {
    @apply flex;

    & > *:not(:last-child):not(.labelIcon) {
      @apply mr-[1px];
    }

    &:first-child {
      input:first-child,
      select:first-child {
        @apply rounded-tl;
      }

      .actionBtn:last-child {
        @apply rounded-tr;
      }
    }

    &:last-child {
      input:first-child,
      select:first-child {
        @apply rounded-bl;
      }

      .actionBtn:last-child {
        @apply rounded-br;
      }
    }

    .labelIcon {
      @apply py-1 px-2 bg-opacity-10 bg-white text-white text-base align-middle appearance-none;
    }

    input,
    select {
      @apply bg-opacity-10 bg-white text-white py-1 px-3 transition text-base align-middle appearance-none rounded-none placeholder-opacity-50 placeholder-white w-auto;

      &[type='number'] {
        @apply px-1;
        width: 4em;
      }

      &:focus {
        @apply outline-0;

        &:not([readonly]) {
          @apply bg-opacity-25;
        }
      }
    }

    .actionBtn {
      @apply flex justify-center bg-opacity-10 bg-white text-white py-1 px-2 transition items-center aspect-square;

      &.delete {
        @apply bg-opacity-10 bg-red-500 text-red-500;
      }

      &:hover {
        @apply bg-opacity-25;
      }
    }
  }

  .addButton {
    @apply flex justify-center bg-opacity-10 bg-white text-white py-1 px-3 transition items-center w-full;

    &:hover {
      @apply bg-opacity-25;
    }

    .icon {
      @apply mr-2;
    }
  }
}
</style>
