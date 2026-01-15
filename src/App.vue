<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-6 max-w-6xl">
      <!-- Modern Header -->
      <header class="mb-6">
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-500/5 border border-white/20 dark:border-slate-700/50 p-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {{ t('app.title') }}
                </h1>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ t('app.subtitle') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- API Key Button - More Prominent -->
              <button
                @click="openApiKeyModal"
                class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
                :class="apiKey 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 animate-pulse'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>{{ apiKey ? 'API ✓' : '配置 API Key' }}</span>
              </button>
              
              <!-- Language Selector -->
              <select
                v-model="currentLocale"
                @change="changeLanguage"
                class="px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all"
              >
                <option value="en">EN</option>
                <option value="zh-CN">中文</option>
              </select>
              
              <!-- Theme Toggle -->
              <button
                @click="toggleTheme"
                class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
              >
                <svg v-if="theme === 'light'" class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg v-else class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main class="space-y-5">
        <!-- File Upload Section -->
        <section class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-500/5 border border-white/20 dark:border-slate-700/50 p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 class="text-base font-semibold text-slate-800 dark:text-white">{{ t('upload.title') }}</h2>
          </div>
          <FileUpload @file-loaded="handleFileLoaded" @error="handleUploadError" />
        </section>
        
        <!-- Code Editor Section -->
        <section class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-500/5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <!-- Editor Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700/50 border-b border-slate-200/50 dark:border-slate-700/50">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 class="text-base font-semibold text-slate-800 dark:text-white">{{ t('editor.title') }}</h2>
            </div>
            <button
              @click="handleReviewClick"
              :disabled="!code || isAnalyzing"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none flex items-center gap-2 justify-center"
            >
              <svg v-if="isAnalyzing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {{ isAnalyzing ? t('editor.analyzing') : t('editor.reviewButton') }}
            </button>
          </div>
          
          <!-- Error Message -->
          <div v-if="errorMessage" class="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">{{ errorMessage }}</p>
            </div>
          </div>
          
          <!-- Code Editor -->
          <div class="p-4">
            <CodeEditor
              ref="codeEditorRef"
              v-model:value="code"
              v-model:language="language"
              :theme="theme"
              :highlighted-lines="highlightedLines"
              @change="handleCodeChange"
            />
          </div>
        </section>
        
        <!-- Issue Panel -->
        <section v-if="issues.length > 0" class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-500/5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <IssuePanel
            :issues="issues"
            @issue-click="handleIssueClick"
            @filter-change="handleFilterChange"
            @export="handleExport"
          />
        </section>
        
        <!-- History Panel -->
        <section class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-500/5 border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <HistoryPanel
            :history="history"
            @select="handleHistorySelect"
            @delete="handleHistoryDelete"
            @clear-all="handleHistoryClearAll"
          />
        </section>
      </main>
      
      <!-- Footer -->
      <footer class="mt-8 pb-6 text-center">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          © 2026 CodeReview Pro · AI 驱动的代码审查助手
        </p>
      </footer>
    </div>
    
    <!-- API Key Modal -->
    <Teleport to="body">
      <div v-if="showApiKeyModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showApiKeyModal = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-white">{{ t('apiKey.title') }}</h3>
            </div>
            <button @click="showApiKeyModal = false" class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{{ t('apiKey.label') }}</label>
              <input
                v-model="apiKeyInput"
                type="password"
                :placeholder="t('apiKey.placeholder')"
                class="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
              <div class="flex gap-3">
                <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-blue-700 dark:text-blue-300">
                  <p class="font-medium mb-1">{{ t('apiKey.howToGet') }}</p>
                  <ol class="list-decimal list-inside space-y-0.5 text-xs opacity-90">
                    <li>{{ t('apiKey.step1') }}</li>
                    <li>{{ t('apiKey.step2') }}</li>
                    <li>{{ t('apiKey.step3') }}</li>
                  </ol>
                  <a href="https://dashscope.console.aliyun.com/" target="_blank" class="inline-flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium">
                    {{ t('apiKey.visitConsole') }} →
                  </a>
                </div>
              </div>
            </div>
            
            <div class="flex gap-2 pt-2">
              <button
                @click="saveApiKey"
                :disabled="!apiKeyInput.trim()"
                class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {{ t('apiKey.save') }}
              </button>
              <button
                v-if="apiKey"
                @click="clearApiKey"
                class="px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-xl transition-all"
              >
                {{ t('apiKey.clear') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CodeEditor from './components/CodeEditor.vue';
import FileUpload from './components/FileUpload.vue';
import IssuePanel from './components/IssuePanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import { analyzeCode } from './services/analysisEngine';
import { getHistory, saveToHistory, deleteHistoryItem, clearHistory } from './services/historyManager';
import { exportAnalysis } from './services/exportService';
import type { Issue, ReviewHistory, CodeAnalysis } from './types';

const { t, locale } = useI18n();

const codeEditorRef = ref<InstanceType<typeof CodeEditor> | null>(null);
const code = ref('');
const language = ref('javascript');
const theme = ref<'light' | 'dark'>('light');
const highlightedLines = ref<number[]>([]);
const isAnalyzing = ref(false);
const issues = ref<Issue[]>([]);
const errorMessage = ref('');
const history = ref<ReviewHistory[]>([]);
const currentAnalysis = ref<CodeAnalysis | null>(null);
const currentLocale = ref(locale.value);
const showApiKeyModal = ref(false);
const apiKey = ref('');
const apiKeyInput = ref('');

onMounted(() => {
  const savedApiKey = localStorage.getItem('aliyun_api_key');
  if (savedApiKey) apiKey.value = savedApiKey;
  
  const savedTheme = localStorage.getItem('codereview_theme') as 'light' | 'dark' | null;
  if (savedTheme) {
    theme.value = savedTheme;
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  }
  
  const savedLanguage = localStorage.getItem('codereview_language');
  if (savedLanguage) {
    currentLocale.value = savedLanguage;
    locale.value = savedLanguage;
  }
  
  loadHistory();
});

const changeLanguage = () => {
  locale.value = currentLocale.value;
  localStorage.setItem('codereview_language', currentLocale.value);
};

const openApiKeyModal = () => {
  apiKeyInput.value = apiKey.value;
  showApiKeyModal.value = true;
};

const saveApiKey = () => {
  if (apiKeyInput.value.trim()) {
    apiKey.value = apiKeyInput.value.trim();
    localStorage.setItem('aliyun_api_key', apiKey.value);
    showApiKeyModal.value = false;
  }
};

const clearApiKey = () => {
  apiKey.value = '';
  apiKeyInput.value = '';
  localStorage.removeItem('aliyun_api_key');
  showApiKeyModal.value = false;
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('codereview_theme', theme.value);
};

const handleFileLoaded = (content: string, detectedLanguage: string, filename: string) => {
  code.value = content;
  language.value = detectedLanguage;
  errorMessage.value = '';
  console.log(`File loaded: ${filename} (${detectedLanguage})`);
};

const handleUploadError = (message: string) => {
  errorMessage.value = message;
};

const handleCodeChange = (_newCode: string) => {
  highlightedLines.value = [];
  issues.value = [];
  errorMessage.value = '';
};

const handleReviewClick = async () => {
  if (!apiKey.value) {
    errorMessage.value = t('errors.apiKeyRequired');
    showApiKeyModal.value = true;
    return;
  }
  
  if (codeEditorRef.value && !codeEditorRef.value.checkSizeLimit()) {
    errorMessage.value = t('errors.codeTooLarge');
    return;
  }
  
  if (!code.value.trim()) {
    errorMessage.value = t('errors.codeEmpty');
    return;
  }
  
  isAnalyzing.value = true;
  errorMessage.value = '';
  issues.value = [];
  
  try {
    const analysis = await analyzeCode(code.value, language.value, apiKey.value);
    issues.value = analysis.issues;
    currentAnalysis.value = analysis;
    saveToHistory(analysis);
    loadHistory();
  } catch (error) {
    console.error('Analysis failed:', error);
    errorMessage.value = error instanceof Error ? error.message : t('errors.analysisFailed');
  } finally {
    isAnalyzing.value = false;
  }
};

const handleIssueClick = (issue: Issue) => {
  const lines: number[] = [];
  for (let i = issue.line[0]; i <= issue.line[1]; i++) {
    lines.push(i);
  }
  highlightedLines.value = lines;
  codeEditorRef.value?.focus();
};

const handleFilterChange = (filter: string) => {
  console.log('Filter changed to:', filter);
};

const loadHistory = () => {
  history.value = getHistory();
};

const handleHistorySelect = (item: ReviewHistory) => {
  code.value = item.code;
  language.value = item.language;
  issues.value = [];
  highlightedLines.value = [];
  errorMessage.value = '';
};

const handleHistoryDelete = (id: string) => {
  deleteHistoryItem(id);
  loadHistory();
};

const handleHistoryClearAll = () => {
  clearHistory();
  loadHistory();
};

const handleExport = (format: 'pdf' | 'markdown' | 'json') => {
  if (!currentAnalysis.value) {
    errorMessage.value = t('errors.noAnalysis');
    return;
  }
  try {
    exportAnalysis(currentAnalysis.value, format);
  } catch (error) {
    console.error('Export failed:', error);
    errorMessage.value = t('errors.exportFailed');
  }
};
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.animate-in {
  animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
}
</style>
