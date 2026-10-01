# iOS odak kilidinin Xcode hedeflerini projeye ekler.
#
#   gem install xcodeproj && ruby scripts/ios-eklenti-hedefleri.rb
#
# Depo Windows'ta geliştiriliyor ve Xcode yok; `project.pbxproj`i elle yazmak
# (hedef, derleme ayarları, gömme adımı, bağımlılık, ürün başvurusu…) yüzlerce
# satırlık ve tek bir yanlış kimlikte projeyi açılmaz yapan bir iş. Bu betik
# aynı işi Xcode'un kendi biçimini bilen `xcodeproj` gem'iyle yapıyor. Mac'te ya
# da CI'da (`.github/workflows/ios-proje.yml`) çalıştırılıyor; sonuç depoya
# giriyor.
#
# Tekrar çalıştırılabilir: var olan hedefe ya da dosyaya dokunmuyor. Yeni bir
# eklenti eklenecekse aşağıdaki listeye satır eklenip betik yeniden çalıştırılır.
#
# Eklentiler ve neden var oldukları: `ios/App/App/EkranSuresiEklentisi.swift`.

require 'xcodeproj'

PROJE = File.expand_path('../ios/App/App.xcodeproj', __dir__)
DAGITIM = '16.0' # FamilyControls'ün kişisel yetkisi (.individual) iOS 16 istiyor.

EKLENTILER = [
  {
    ad: 'OdakIzleyici',
    kimlik: 'com.fluxifyinteractive.rabi.OdakIzleyici',
    kaynaklar: %w[OdakIzleyici.swift],
    varliklar: [],
  },
  {
    ad: 'KalkanGorunumu',
    kimlik: 'com.fluxifyinteractive.rabi.KalkanGorunumu',
    kaynaklar: %w[KalkanGorunumu.swift],
    varliklar: %w[tavsan_yuz.png],
  },
].freeze

proje = Xcodeproj::Project.open(PROJE)
uygulama = proje.targets.find { |t| t.name == 'App' } or abort('App hedefi yok')
uygulama_grubu = proje.main_group.children.find { |g| g.respond_to?(:path) && g.path == 'App' }

# --- Uygulamanın kendi parçaları -------------------------------------------

unless uygulama.source_build_phase.files_references.any? { |f| f.path == 'EkranSuresiEklentisi.swift' }
  dosya = uygulama_grubu.new_reference('EkranSuresiEklentisi.swift')
  uygulama.add_file_references([dosya])
end
unless uygulama_grubu.children.any? { |f| f.path == 'App.entitlements' }
  uygulama_grubu.new_reference('App.entitlements')
end
uygulama.build_configurations.each do |ayar|
  ayar.build_settings['CODE_SIGN_ENTITLEMENTS'] = 'App/App.entitlements'
end

gomme = uygulama.copy_files_build_phases.find { |p| p.name == 'Embed Foundation Extensions' }
unless gomme
  gomme = uygulama.new_copy_files_build_phase('Embed Foundation Extensions')
  gomme.symbol_dst_subfolder_spec = :plug_ins
end

# --- Eklentiler ------------------------------------------------------------

EKLENTILER.each do |e|
  next if proje.targets.any? { |t| t.name == e[:ad] }

  hedef = proje.new_target(:app_extension, e[:ad], :ios, DAGITIM, nil, :swift)

  grup = proje.main_group.new_group(e[:ad], e[:ad])
  hedef.add_file_references(e[:kaynaklar].map { |k| grup.new_reference(k) })
  e[:varliklar].each { |v| hedef.resources_build_phase.add_file_reference(grup.new_reference(v)) }
  grup.new_reference('Info.plist')
  grup.new_reference("#{e[:ad]}.entitlements")

  # Uygulamanın derleme numarası eklentilere de verilmeli: App Store, gömülü
  # eklentinin sürümü uygulamanınkiyle tutmazsa yüklemeyi reddediyor. CI ikisini
  # de komut satırından veriyor; buradakiler yalnızca Mac'te elle derlerken.
  uygulama_ayari = uygulama.build_configurations.first.build_settings
  hedef.build_configurations.each do |ayar|
    s = ayar.build_settings
    s['PRODUCT_BUNDLE_IDENTIFIER'] = e[:kimlik]
    s['PRODUCT_NAME'] = '$(TARGET_NAME)'
    s['INFOPLIST_FILE'] = "#{e[:ad]}/Info.plist"
    s['GENERATE_INFOPLIST_FILE'] = 'NO'
    s['CODE_SIGN_ENTITLEMENTS'] = "#{e[:ad]}/#{e[:ad]}.entitlements"
    s['CODE_SIGN_STYLE'] = 'Automatic'
    s['IPHONEOS_DEPLOYMENT_TARGET'] = DAGITIM
    s['TARGETED_DEVICE_FAMILY'] = '1'
    s['SWIFT_VERSION'] = '5.0'
    s['SKIP_INSTALL'] = 'YES'
    s['MARKETING_VERSION'] = uygulama_ayari['MARKETING_VERSION']
    s['CURRENT_PROJECT_VERSION'] = uygulama_ayari['CURRENT_PROJECT_VERSION']
    s['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks', '@executable_path/../../Frameworks']
  end

  uygulama.add_dependency(hedef)
  dosya = gomme.add_file_reference(hedef.product_reference, true)
  dosya.settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
end

proje.save
puts 'Hedefler: ' + proje.targets.map(&:name).join(', ')
