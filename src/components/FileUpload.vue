<template>
  <div class="file-upload">
    <div
      class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
      :class="isDragOver 
        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedExtensions"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-transform duration-300" :class="isDragOver ? 'scale-110' : ''">
          <svg class="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            <span class="font-semibold text-blue-500">{{ t('upload.clickToUpload') }}</span>
            <span class="text-slate-400"> {{ t('upload.dragAndDrop') }}</span>
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {{ t('upload.supportedFormats') }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Emits {
  (e: 'file-loaded', content: string, language: string, filename: string): void;
  (e: 'error', message: string): void;
}

const emit = defineEmits<Emits>();
const { t } = useI18n();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const error = ref('');

const acceptedExtensions = '.js,.jsx,.ts,.tsx,.py,.java,.go,.cpp,.c,.h,.cs,.php,.rb,.rs';

const languageMap: Record<string, string> = {
  'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
  'py': 'python', 'java': 'java', 'go': 'go', 'cpp': 'cpp', 'c': 'cpp', 'h': 'cpp',
  'cs': 'csharp', 'php': 'php', 'rb': 'ruby', 'rs': 'rust',
};

const detectLanguage = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return languageMap[extension] || 'javascript';
};

const validateFileSize = (file: File): boolean => {
  const maxSize = 50 * 1024;
  if (file.size > maxSize) {
    error.value = t('upload.error.sizeExceeded', { size: (file.size / 1024).toFixed(2) });
    emit('error', error.value);
    return false;
  }
  return true;
};

const validateFileExtension = (filename: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const validExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'rs'];
  if (!validExtensions.includes(extension)) {
    error.value = t('upload.error.unsupportedType', { extension });
    emit('error', error.value);
    return false;
  }
  return true;
};

const processFile = async (file: File) => {
  error.value = '';
  if (!validateFileExtension(file.name)) return;
  if (!validateFileSize(file)) return;
  
  try {
    const content = await file.text();
    const language = detectLanguage(file.name);
    emit('file-loaded', content, language, file.name);
  } catch (err) {
    error.value = t('upload.error.readFailed');
    emit('error', error.value);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) processFile(file);
  if (fileInput.value) fileInput.value.value = '';
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) processFile(file);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>
