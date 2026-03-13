<template>
  <div class="min-h-screen bg-gray-900 text-white/80 p-6 md:p-12 font-sans selection:bg-cyan-500/30">
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Header -->
      <div class="space-y-2 border-b border-white/10 pb-6">
        <h1 class="text-3xl font-bold text-white tracking-tight">{{ $t('legal.privacy.title') }}</h1>
        <p class="text-xs text-white/30 uppercase tracking-widest">{{ $t('legal.privacy.lastUpdated') }}: {{ $t('legal.privacy.date') }}</p>
      </div>

      <!-- Content -->
      <div class="space-y-6 text-sm leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">1. Introduction</h2>
          <p>
            {{ $t('legal.privacy.intro') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.privacy.collectionTitle') }}</h2>
          <p>
            {{ $t('legal.privacy.collectionText') }}
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('legal.privacy.googleAccount') }}</li>
            <li>{{ $t('legal.privacy.calendarData') }}</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.privacy.usageTitle') }}</h2>
          <p>
            {{ $t('legal.privacy.usageText') }}
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('legal.privacy.usageItem1') }}</li>
            <li>{{ $t('legal.privacy.usageItem2') }}</li>
            <li>{{ $t('legal.privacy.usageItem3') }}</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.privacy.securityTitle') }}</h2>
          <p>
            {{ $t('legal.privacy.securityText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.privacy.rightsTitle') }}</h2>
          <p>
            {{ $t('legal.privacy.rightsText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.privacy.contactTitle') }}</h2>
          <p>
            {{ $t('legal.privacy.contactText') }}
            <br />
            <span class="text-cyan-400">muhamadandikawardana@gmail.com</span>
          </p>
        </section>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-white/10">
        <router-link to="/" class="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-2">
          &larr; {{ $t('legal.privacy.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific logic needed for static policy page
</script>
