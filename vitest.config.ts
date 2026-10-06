import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // `.claude/worktrees/` altındaki depo kopyalarının testleri de taranıyordu;
    // varsayılan dışlamalar korunuyor, `.claude` ekleniyor.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
})
