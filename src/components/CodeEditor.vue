<template>
  <div class="code-editor-wrapper rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <!-- Editor Header -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ t('editor.language') }}</label>
        <select
          v-model="selectedLanguage"
          @change="handleLanguageChange"
          class="px-2.5 py-1 text-xs font-medium border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
            {{ lang.label }}
          </option>
        </select>
      </div>
      <div class="text-xs font-medium" :class="sizeWarning ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'">
        {{ codeSize }} / 50KB
      </div>
    </div>
    
    <!-- Editor Container -->
    <div class="editor-container">
      <VueMonacoEditor
        v-model:value="editorValue"
        :language="selectedLanguage"
        :theme="editorTheme"
        :options="editorOptions"
        @mount="handleEditorMount"
      />
    </div>
    
    <!-- Size Warning -->
    <div v-if="sizeWarning" class="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
      <p class="text-xs text-red-600 dark:text-red-400">{{ t('editor.sizeWarning') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import type { editor } from 'monaco-editor';

interface Props {
  value?: string;
  language?: string;
  highlightedLines?: number[];
  theme?: 'light' | 'dark';
}

interface Emits {
  (e: 'update:value', value: string): void;
  (e: 'update:language', language: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  language: 'javascript',
  highlightedLines: () => [],
  theme: 'light',
});

const emit = defineEmits<Emits>();
const { t } = useI18n();

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
];

const editorInstance = ref<editor.IStandaloneCodeEditor | null>(null);
const editorValue = ref(props.value);
const selectedLanguage = ref(props.language);
const sizeWarning = ref(false);

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  tabSize: 2,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  lineNumbers: 'on',
  renderWhitespace: 'selection',
  folding: true,
  glyphMargin: false,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 3,
  padding: { top: 8, bottom: 8 },
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  renderLineHighlight: 'line',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
};

const editorTheme = computed(() => props.theme === 'dark' ? 'vs-dark' : 'vs');

const codeSize = computed(() => {
  const bytes = new Blob([editorValue.value]).size;
  return `${(bytes / 1024).toFixed(1)}KB`;
});

const checkSizeLimit = () => {
  const bytes = new Blob([editorValue.value]).size;
  sizeWarning.value = bytes / 1024 > 50;
  return bytes / 1024 <= 50;
};

const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
  editorInstance.value = editor;
  if (props.highlightedLines.length > 0) highlightLines(props.highlightedLines);
};

const handleLanguageChange = () => {
  emit('update:language', selectedLanguage.value);
};

const highlightLines = (lines: number[]) => {
  if (!editorInstance.value) return;
  const decorations: editor.IModelDeltaDecoration[] = lines.map(line => ({
    range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
    options: {
      isWholeLine: true,
      className: 'highlighted-line',
      glyphMarginClassName: 'highlighted-line-glyph',
    },
  }));
  editorInstance.value.deltaDecorations([], decorations);
};

const clearHighlights = () => {
  if (editorInstance.value) editorInstance.value.deltaDecorations([], []);
};

const setValue = (value: string) => { editorValue.value = value; };
const focus = () => { editorInstance.value?.focus(); };

watch(editorValue, (newValue) => {
  emit('update:value', newValue);
  emit('change', newValue);
  checkSizeLimit();
});

watch(() => props.value, (newValue) => {
  if (newValue !== editorValue.value) editorValue.value = newValue;
});

watch(() => props.language, (newLanguage) => {
  if (newLanguage !== selectedLanguage.value) selectedLanguage.value = newLanguage;
});

watch(() => props.highlightedLines, (newLines) => {
  if (newLines.length > 0) highlightLines(newLines);
  else clearHighlights();
}, { deep: true });

defineExpose({ setValue, highlightLines, clearHighlights, focus, checkSizeLimit });

onMounted(() => { checkSizeLimit(); });
</script>

<style scoped>
.editor-container {
  height: 280px;
}

:deep(.highlighted-line) {
  background-color: rgba(59, 130, 246, 0.12);
  border-left: 3px solid #3b82f6;
}

:deep(.highlighted-line-glyph) {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  width: 4px !important;
  margin-left: 3px;
  border-radius: 2px;
}
</style>
