<template>
  <div class="min-h-screen bg-gray-900 text-white/80 p-6 md:p-12 font-sans selection:bg-cyan-500/30">
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Header -->
      <div class="space-y-2 border-b border-white/10 pb-6">
        <h1 class="text-3xl font-bold text-white tracking-tight">{{ $t('legal.terms.title') }}</h1>
        <p class="text-xs text-white/30 uppercase tracking-widest">{{ $t('legal.terms.lastUpdated') }}: {{ $t('legal.terms.date') }}</p>
      </div>

      <!-- Content -->
      <div class="space-y-6 text-sm leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.acceptanceTitle') }}</h2>
          <p>
            {{ $t('legal.terms.acceptanceText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.descriptionTitle') }}</h2>
          <p>
            {{ $t('legal.terms.descriptionText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.responsibilitiesTitle') }}</h2>
          <p>
            {{ $t('legal.terms.responsibilitiesText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.intellectualTitle') }}</h2>
          <p>
            {{ $t('legal.terms.intellectualText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.liabilityTitle') }}</h2>
          <p>
            {{ $t('legal.terms.liabilityText') }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-semibold text-white">{{ $t('legal.terms.changesTitle') }}</h2>
          <p>
            {{ $t('legal.terms.changesText') }}
          </p>
        </section>
      </div>

      <!-- Footer -->
      <div class="pt-8 border-t border-white/10">
        <router-link to="/" class="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-2">
          &larr; {{ $t('legal.terms.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific logic needed for static terms page
</script>
