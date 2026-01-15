<template>
  <div
    class="issue-card p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md"
    :class="cardClasses"
    @click="handleClick"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
  >
    <!-- Header -->
    <div class="flex items-start gap-3 mb-3">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" :class="iconBgClass">
        {{ typeIcon }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{ issue.title }}</h3>
        <div class="flex items-center gap-2 mt-1">
          <span class="px-2 py-0.5 text-xs font-semibold rounded-full" :class="severityClass">
            {{ severityLabel }}
          </span>
          <span class="text-xs text-slate-400">
            {{ t('issues.card.lines', { start: issue.line[0], end: issue.line[1] }) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Description -->
    <p class="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{{ issue.description }}</p>
    
    <!-- Suggestion -->
    <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg mb-2">
      <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{{ t('issues.card.suggestedFix') }}</div>
      <p class="text-sm text-emerald-700 dark:text-emerald-300">{{ issue.suggestion }}</p>
    </div>
    
    <!-- Code Example -->
    <div v-if="issue.codeExample" class="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{{ t('issues.card.example') }}</div>
      <pre class="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto font-mono"><code>{{ issue.codeExample }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Issue } from '@/types';

interface Props { issue: Issue; clickable?: boolean; }
interface Emits { (e: 'click', issue: Issue): void; }

const props = withDefaults(defineProps<Props>(), { clickable: true });
const emit = defineEmits<Emits>();
const { t } = useI18n();

const typeIcon = computed(() => {
  const icons: Record<string, string> = { security: '🔒', performance: '⚡', style: '📝' };
  return icons[props.issue.type] || '📋';
});

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    security: 'bg-red-100 dark:bg-red-900/30',
    performance: 'bg-amber-100 dark:bg-amber-900/30',
    style: 'bg-blue-100 dark:bg-blue-900/30',
  };
  return classes[props.issue.type] || 'bg-slate-100 dark:bg-slate-700';
});

const cardClasses = computed(() => {
  const borderColors: Record<string, string> = {
    security: 'border-l-red-500 bg-white dark:bg-slate-800 hover:bg-red-50/50 dark:hover:bg-red-900/10',
    performance: 'border-l-amber-500 bg-white dark:bg-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-900/10',
    style: 'border-l-blue-500 bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
  };
  return borderColors[props.issue.type] || 'border-l-slate-400 bg-white dark:bg-slate-800';
});

const severityClass = computed(() => {
  const classes: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  };
  return classes[props.issue.severity] || 'bg-slate-100 text-slate-700';
});

const severityLabel = computed(() => t(`severity.${props.issue.severity}`));
const handleClick = () => { if (props.clickable) emit('click', props.issue); };
</script>
