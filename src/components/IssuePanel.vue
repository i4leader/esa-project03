<template>
  <div class="issue-panel">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-rose-400 to-orange-500 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-slate-800 dark:text-white">
          {{ t('issues.title') }}
          <span class="text-slate-400 font-normal">{{ t('issues.count', { count: filteredIssues.length }) }}</span>
        </h2>
      </div>
      
      <div v-if="issues.length > 0" class="flex gap-1">
        <button @click="$emit('export', 'json')" class="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">JSON</button>
        <button @click="$emit('export', 'markdown')" class="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">MD</button>
        <button @click="$emit('export', 'pdf')" class="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">PDF</button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="handleFilterChange(filter.value)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
        :class="currentFilter === filter.value 
          ? 'bg-blue-500 text-white shadow-sm' 
          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'"
      >
        <span>{{ filter.icon }} {{ filter.label.value }}</span>
        <span v-if="filter.value !== 'all'" class="ml-1 opacity-70">({{ getFilterCount(filter.value) }})</span>
      </button>
    </div>
    
    <!-- Summary Stats -->
    <div v-if="issues.length > 0" class="grid grid-cols-4 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
      <div class="text-center p-2 bg-white dark:bg-slate-700 rounded-lg">
        <div class="text-lg font-bold text-red-500">{{ summary.critical }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('issues.summary.critical') }}</div>
      </div>
      <div class="text-center p-2 bg-white dark:bg-slate-700 rounded-lg">
        <div class="text-lg font-bold text-orange-500">{{ summary.high }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('issues.summary.high') }}</div>
      </div>
      <div class="text-center p-2 bg-white dark:bg-slate-700 rounded-lg">
        <div class="text-lg font-bold text-amber-500">{{ summary.medium }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('issues.summary.medium') }}</div>
      </div>
      <div class="text-center p-2 bg-white dark:bg-slate-700 rounded-lg">
        <div class="text-lg font-bold text-blue-500">{{ summary.low }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('issues.summary.low') }}</div>
      </div>
    </div>
    
    <!-- Issues List -->
    <div class="p-4">
      <div v-if="filteredIssues.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ issues.length === 0 ? t('issues.empty.noIssues') : t('issues.empty.noMatch') }}
        </p>
      </div>
      
      <div v-else class="space-y-3">
        <IssueCard v-for="issue in filteredIssues" :key="issue.id" :issue="issue" @click="handleIssueClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IssueCard from './IssueCard.vue';
import type { Issue, IssueType } from '@/types';

interface Props { issues: Issue[]; }
interface Emits {
  (e: 'issue-click', issue: Issue): void;
  (e: 'filter-change', filter: IssueType | 'all'): void;
  (e: 'export', format: 'pdf' | 'markdown' | 'json'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const currentFilter = ref<IssueType | 'all'>('all');

const filters = [
  { value: 'all' as const, label: computed(() => t('issues.filters.all')), icon: '📋' },
  { value: 'security' as const, label: computed(() => t('issues.filters.security')), icon: '🔒' },
  { value: 'performance' as const, label: computed(() => t('issues.filters.performance')), icon: '⚡' },
  { value: 'style' as const, label: computed(() => t('issues.filters.style')), icon: '📝' },
];

const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const sortedIssues = computed(() => 
  [...props.issues].sort((a, b) => (severityOrder[a.severity] ?? 999) - (severityOrder[b.severity] ?? 999))
);

const filteredIssues = computed(() => 
  currentFilter.value === 'all' ? sortedIssues.value : sortedIssues.value.filter(i => i.type === currentFilter.value)
);

const summary = computed(() => {
  const stats = { critical: 0, high: 0, medium: 0, low: 0 };
  props.issues.forEach(i => stats[i.severity]++);
  return stats;
});

const getFilterCount = (filterValue: IssueType) => props.issues.filter(i => i.type === filterValue).length;
const handleFilterChange = (filter: IssueType | 'all') => { currentFilter.value = filter; emit('filter-change', filter); };
const handleIssueClick = (issue: Issue) => { emit('issue-click', issue); };
</script>
