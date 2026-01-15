<template>
  <div class="history-panel">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-white">{{ t('history.title') }}</h3>
      </div>
      <button
        v-if="history.length > 0"
        @click="handleClearAll"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ t('history.clearAll') }}
      </button>
    </div>
    
    <!-- History List -->
    <div class="max-h-80 overflow-y-auto">
      <div v-if="history.length === 0" class="text-center py-10">
        <svg class="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ t('history.empty.title') }}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ t('history.empty.subtitle') }}</p>
      </div>
      
      <div
        v-for="item in history"
        :key="item.id"
        class="p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
        @click="handleSelect(item)"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded uppercase">
            {{ item.language }}
          </span>
          <span class="text-xs text-slate-400">{{ formatTime(item.timestamp) }}</span>
        </div>
        
        <p class="text-xs text-slate-600 dark:text-slate-300 font-mono truncate mb-2">{{ getPreview(item.code) }}</p>
        
        <div class="flex items-center justify-between">
          <div class="flex gap-1.5 flex-wrap">
            <span v-if="item.summary.critical > 0" class="px-1.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
              {{ item.summary.critical }} {{ t('severity.critical') }}
            </span>
            <span v-if="item.summary.high > 0" class="px-1.5 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
              {{ item.summary.high }} {{ t('severity.high') }}
            </span>
            <span v-if="item.summary.medium > 0" class="px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
              {{ item.summary.medium }} {{ t('severity.medium') }}
            </span>
            <span v-if="item.summary.low > 0" class="px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
              {{ item.summary.low }} {{ t('severity.low') }}
            </span>
          </div>
          
          <button
            @click.stop="handleDelete(item.id)"
            class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ReviewHistory } from '@/types';
import { formatTimestamp, getCodePreview } from '@/services/historyManager';

interface Props { history: ReviewHistory[]; }
interface Emits {
  (e: 'select', item: ReviewHistory): void;
  (e: 'delete', id: string): void;
  (e: 'clear-all'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const handleSelect = (item: ReviewHistory) => emit('select', item);
const handleDelete = (id: string) => emit('delete', id);
const handleClearAll = () => { if (confirm(t('history.confirmClear'))) emit('clear-all'); };
const formatTime = (timestamp: number) => formatTimestamp(timestamp);
const getPreview = (code: string) => getCodePreview(code);
</script>
