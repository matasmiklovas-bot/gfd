import type { Locale } from './locale';

/**
 * Interface strings in both languages. Usable from server and client code.
 * Long-form copy (product descriptions, help and legal pages) lives next to the page or in data/.
 */
const DICT = {
  'nav.new': { en: 'New', lt: 'Naujienos' },
  'nav.women': { en: 'Women', lt: 'Moterims' },
  'nav.men': { en: 'Men', lt: 'Vyrams' },
  'nav.about': { en: 'About', lt: 'Apie mus' },
  'nav.menu': { en: 'Menu', lt: 'Meniu' },
  'nav.search': { en: 'Search', lt: 'Paieška' },
  'nav.account': { en: 'Account', lt: 'Paskyra' },
  'nav.bag': { en: 'Bag', lt: 'Krepšelis' },
  'nav.wishlist': { en: 'Wishlist', lt: 'Norų sąrašas' },
  'nav.close': { en: 'Close', lt: 'Uždaryti' },
  'ann.0': { en: 'Free EU shipping over €60', lt: 'Nemokamas pristatymas nuo 60 €' },
  'ann.1': { en: 'Autumn–Winter 2026 — new in', lt: 'Ruduo–žiema 2026 jau čia' },
  'ann.2': { en: '14-day returns across the EU', lt: '14 dienų grąžinimas visoje ES' },
  'product.add': { en: 'Add to bag', lt: 'Į krepšelį' },
  'product.added': { en: 'Added', lt: 'Pridėta' },
  'product.selectSize': { en: 'Select a size', lt: 'Pasirinkite dydį' },
  'product.size': { en: 'Size', lt: 'Dydis' },
  'product.soldOut': { en: 'Sold out', lt: 'Išparduota' },
  'product.new': { en: 'New', lt: 'Naujiena' },
  'product.onlyLeft': { en: 'Only {n} left', lt: 'Liko tik {n}' },
  'cart.title': { en: 'Bag', lt: 'Krepšelis' },
  'cart.empty': { en: 'Your bag is empty.', lt: 'Jūsų krepšelis tuščias.' },
  'cart.subtotal': { en: 'Subtotal', lt: 'Tarpinė suma' },
  'cart.checkout': { en: 'Checkout', lt: 'Apmokėti' },
  'cart.remove': { en: 'Remove', lt: 'Pašalinti' },
  'cart.away': { en: '{amount} away from free shipping', lt: 'Iki nemokamo pristatymo trūksta {amount}' },
  'cart.free': { en: 'Free shipping unlocked', lt: 'Pristatymas nemokamas' },
  'cart.taxes': { en: 'VAT included. Shipping and discounts at checkout.', lt: 'PVM įskaičiuotas. Pristatymo kaina ir nuolaidos – apmokant.' },
  'cart.continue': { en: 'Continue shopping', lt: 'Tęsti apsipirkimą' },
  'footer.shop': { en: 'Shop', lt: 'Parduotuvė' },
  'footer.help': { en: 'Help', lt: 'Pagalba' },
  'footer.legal': { en: 'Legal', lt: 'Teisinė informacija' },
  'footer.follow': { en: 'Follow', lt: 'Sekite' },
  'cookie.text': { en: 'We use cookies to run the store and, with your consent, to measure and improve it.', lt: 'Naudojame slapukus parduotuvės veikimui ir, jums sutikus, jos tobulinimui.' },
  'cookie.accept': { en: 'Accept', lt: 'Sutinku' },
  'cookie.reject': { en: 'Reject', lt: 'Atmesti' },
  'cookie.settings': { en: 'Settings', lt: 'Nustatymai' },
  'cookie.save': { en: 'Save choices', lt: 'Išsaugoti' },
  'meta.title': { en: 'OSTREV — Women’s and men’s fashion. Autumn–Winter 2026.', lt: 'OSTREV — moterų ir vyrų mada. Ruduo–žiema 2026.' },
  'a11y.skip': { en: 'Skip to content', lt: 'Pereiti prie turinio' },
  'nav.shop': { en: 'Shop', lt: 'Parduotuvė' },
  'nav.main': { en: 'Main', lt: 'Pagrindinis meniu' },
  'nav.newIn': { en: 'New in', lt: 'Naujienos' },
  'common.viewAll': { en: 'View all', lt: 'Žiūrėti viską' },
  'common.all': { en: 'All', lt: 'Visi' },
  'common.home': { en: 'Home', lt: 'Pradžia' },
  'checkout.secure': { en: 'Secure checkout', lt: 'Saugus apmokėjimas' },
  'footer.instagram': { en: 'OSTREV on Instagram', lt: 'OSTREV „Instagram“ paskyra' },
  'footer.tiktok': { en: 'OSTREV on TikTok', lt: 'OSTREV „TikTok“ paskyra' },
  'footer.payments': { en: 'Accepted payment methods', lt: 'Priimami mokėjimo būdai' },
  'footer.currency': { en: 'All prices in euro, VAT included', lt: 'Visos kainos eurais su PVM' },
  'footer.vat': { en: 'All prices include VAT.', lt: 'Visos kainos su PVM.' },
  'cookie.region': { en: 'Cookie consent', lt: 'Sutikimas dėl slapukų' },
  'cookie.policy': { en: 'Cookie policy', lt: 'Slapukų politika' },
  'cookie.necessary': { en: 'Necessary', lt: 'Būtini' },
  'cookie.necessaryText': { en: 'Cart, checkout, security and your cookie choice. Always on.', lt: 'Krepšelis, apmokėjimas, saugumas ir jūsų pasirinkimas dėl slapukų. Visada įjungti.' },
  'cookie.analytics': { en: 'Analytics', lt: 'Analitika' },
  'cookie.analyticsText': { en: 'Anonymous usage statistics that help us improve the store.', lt: 'Anoniminė naudojimosi statistika, padedanti tobulinti parduotuvę.' },
  'cookie.marketing': { en: 'Marketing', lt: 'Rinkodara' },
  'cookie.marketingText': { en: 'Measure ads on Instagram and TikTok.', lt: 'Reklamos „Instagram“ ir „TikTok“ vertinimas.' },
  'cookie.settingsLink': { en: 'Cookie settings', lt: 'Slapukų nustatymai' },
  'qty.for': { en: 'Quantity for {name}', lt: '{name} kiekis' },
  'qty.remove': { en: 'Remove {name}', lt: 'Pašalinti {name}' },
  'qty.decrease': { en: 'Decrease quantity', lt: 'Sumažinti kiekį' },
  'qty.increase': { en: 'Increase quantity', lt: 'Padidinti kiekį' },
  'wish.remove': { en: 'Remove {name} from wishlist', lt: 'Pašalinti {name} iš norų sąrašo' },
  'wish.save': { en: 'Save {name} to wishlist', lt: 'Išsaugoti {name} norų sąraše' },
  'cart.progress': { en: 'Progress to free shipping', lt: 'Iki nemokamo pristatymo' },
  'a11y.breadcrumb': { en: 'Breadcrumb', lt: 'Naršymo kelias' },
  'search.label': { en: 'Search products', lt: 'Ieškoti prekių' },
  'search.popular': { en: 'Popular', lt: 'Populiaru' },
  'search.none': { en: 'No results for “{q}”.', lt: 'Pagal „{q}“ nieko nerasta.' },
  'search.type': { en: 'Type to search', lt: 'Įveskite paieškos žodį' },
  'search.resultsFor': { en: '{count} for “{q}”', lt: '{count} pagal „{q}“' },
  'search.browse': { en: 'Browse all products', lt: 'Žiūrėti visas prekes' },
  'search.title': { en: 'Search', lt: 'Paieška' },
  'search.h1': { en: 'Search results for “{q}”', lt: 'Paieškos rezultatai: „{q}“' },
  'search.results': { en: 'Results', lt: 'Rezultatai' },
  'a11y.announcements': { en: 'Announcements', lt: 'Pranešimai' },
  'a11y.language': { en: 'Language', lt: 'Kalba' },
  'form.invalidEmail': { en: 'Enter a valid email address.', lt: 'Įveskite teisingą el. pašto adresą.' },
  'form.failed': { en: 'Something went wrong. Try again.', lt: 'Kažkas nepavyko. Bandykite dar kartą.' },
  'form.email': { en: 'Email address', lt: 'El. pašto adresas' },
  'form.sending': { en: 'Sending', lt: 'Siunčiama' },
  'form.consent': { en: 'By signing up you agree to receive emails from OSTREV. Unsubscribe any time. See our', lt: 'Užsiprenumeravę sutinkate gauti OSTREV laiškus. Atsisakyti galite bet kada. Daugiau – mūsų' },
  'form.privacy': { en: 'privacy policy', lt: 'privatumo politikoje' },
  'filter.title': { en: 'Filter', lt: 'Filtrai' },
  'filter.sort': { en: 'Sort', lt: 'Rikiuoti' },
  'filter.none': { en: 'Nothing matches these filters.', lt: 'Pagal šiuos filtrus prekių nėra.' },
  'filter.clearAll': { en: 'Clear filters', lt: 'Išvalyti filtrus' },
  'filter.clear': { en: 'Clear', lt: 'Išvalyti' },
  'filter.show': { en: 'Show {n}', lt: 'Rodyti ({n})' },
  'filter.products': { en: 'Products', lt: 'Prekės' },
  'filter.close': { en: 'Close filters', lt: 'Uždaryti filtrus' },
  'filter.gender': { en: 'Women / Men', lt: 'Moterims / Vyrams' },
  'filter.category': { en: 'Category', lt: 'Kategorija' },
  'filter.categories': { en: 'Categories', lt: 'Kategorijos' },
  'filter.size': { en: 'Size', lt: 'Dydis' },
  'filter.colour': { en: 'Colour', lt: 'Spalva' },
  'filter.price': { en: 'Price', lt: 'Kaina' },
  'size.title': { en: 'Size guide', lt: 'Dydžių lentelė' },
  'size.close': { en: 'Close size guide', lt: 'Uždaryti dydžių lentelę' },
  'size.intro': { en: 'Compare the measurements below with a piece you already own. The fit note on each product says whether it is cut oversized.', lt: 'Palyginkite toliau pateiktus išmatavimus su drabužiu, kurį jau turite. Prie kiekvienos prekės parašyta, ar ji laisvo kirpimo.' },
  'size.unsure': { en: 'Still unsure?', lt: 'Vis dar abejojate?' },
  'size.ask': { en: 'Ask us', lt: 'Parašykite mums' },
  'size.reply': { en: '— we reply within one working day.', lt: '– atsakome per vieną darbo dieną.' },
  'product.vat': { en: 'VAT included.', lt: 'Su PVM.' },
  'product.optionSoldOut': { en: '{name}, sold out', lt: '{name}, išparduota' },
  'product.shippingLine': { en: 'Free EU shipping over {amount}. 14-day returns.', lt: 'Nemokamas pristatymas ES nuo {amount}. Grąžinimas per 14 dienų.' },
  'product.description': { en: 'Description', lt: 'Aprašymas' },
  'product.fit': { en: 'Fit & sizing', lt: 'Kirpimas ir dydis' },
  'product.fitNote': { en: 'Exact measurements are in the size guide.', lt: 'Tikslūs išmatavimai – dydžių lentelėje.' },
  'product.material': { en: 'Material & care', lt: 'Sudėtis ir priežiūra' },
  'product.shipping': { en: 'Shipping & returns', lt: 'Pristatymas ir grąžinimas' },
  'product.shippingText': { en: 'EU delivery in 2–5 working days. {flat} flat rate, free over {free}. Orders placed before 14:00 (Vilnius time) on working days ship the same day.', lt: 'Pristatymas ES per 2–5 darbo dienas. Kaina {flat}, nemokamai nuo {free}. Darbo dienomis iki 14:00 (Vilniaus laiku) pateikti užsakymai išsiunčiami tą pačią dieną.' },
  'product.returnsText': { en: 'Return unworn items within 14 days of delivery for a full refund.', lt: 'Nedėvėtas prekes galite grąžinti per 14 dienų nuo pristatymo ir atgauti visus pinigus.' },
  'product.returnsLink': { en: 'Returns policy', lt: 'Grąžinimo sąlygos' },
  'product.recent': { en: 'Recently viewed', lt: 'Neseniai žiūrėtos' },
  'product.complete': { en: 'Complete the look', lt: 'Užbaikite derinį' },
  'product.similar': { en: 'You may also like', lt: 'Jums gali patikti' },
  'slider.prev': { en: 'Previous products', lt: 'Ankstesnės prekės' },
  'slider.next': { en: 'Next products', lt: 'Kitos prekės' },
  'gallery.label': { en: '{name} images', lt: '{name} nuotraukos' },
  'gallery.zoom': { en: 'Zoom image {i} of {n}', lt: 'Padidinti nuotrauką {i} iš {n}' },
  'gallery.zoomed': { en: 'Zoomed image', lt: 'Padidinta nuotrauka' },
  'gallery.close': { en: 'Close zoom', lt: 'Uždaryti padidinimą' },
  'nav.womenCategories': { en: 'Women’s categories', lt: 'Moteriškų prekių kategorijos' },
  'nav.menCategories': { en: 'Men’s categories', lt: 'Vyriškų prekių kategorijos' },
  'meta.categoryDescription': { en: '{description} Shop OSTREV {name} with free EU shipping over €60.', lt: '{description} OSTREV {name} su nemokamu pristatymu ES nuo 60 €.' },
  'meta.genderDescription': { en: '{description} Shop OSTREV {name} with free EU shipping over €60.', lt: '{description} OSTREV kolekcija {name} su nemokamu pristatymu ES nuo 60 €.' },
  'home.newWomen': { en: 'New in — Women', lt: 'Naujienos moterims' },
  'home.newMen': { en: 'New in — Men', lt: 'Naujienos vyrams' },
  'shop.metaTitle': { en: 'Shop all', lt: 'Visos prekės' },
  'shop.metaDescription': { en: 'Shop all OSTREV women’s and men’s fashion: coats, knitwear, shirts and jeans. Free EU shipping over €60.', lt: 'Visa OSTREV moterų ir vyrų kolekcija: paltai, megztiniai, marškiniai ir džinsai. Nemokamas pristatymas ES nuo 60 €.' },
  'new.metaDescription': { en: 'New in at OSTREV: the latest coats, knitwear, shirts and denim for women and men.', lt: 'OSTREV naujienos: naujausi paltai, megztiniai, marškiniai ir džinsai moterims ir vyrams.' },
  'new.intro': { en: 'The latest arrivals for Autumn–Winter 2026.', lt: 'Naujausi 2026 m. rudens–žiemos sezono drabužiai.' },
  'meta.productDescription': { en: '{summary} {material} {price}. Free EU shipping over €60.', lt: '{summary} {material} {price}. Nemokamas pristatymas ES nuo 60 €.' },
  'wish.empty': { en: 'Nothing saved yet. Tap the heart on any product to keep it here.', lt: 'Kol kas nieko neišsaugota. Paspauskite širdelę ant prekės ir ji atsiras čia.' },
  'wish.shop': { en: 'Shop now', lt: 'Apsipirkti' },
} as const satisfies Record<string, Record<Locale, string>>;

export type TKey = keyof typeof DICT;

export function translate(locale: Locale, key: TKey, vars?: Record<string, string | number>) {
  let s: string = DICT[key][locale];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

/** A translator bound to one locale, for server components: const t = getT(locale). */
export function getT(locale: Locale) {
  return (key: TKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

type PluralForms = { en: [one: string, other: string]; lt: [one: string, few: string, many: string] };

/** "1 item / 2 items", "1 prekė / 2 prekės / 10 prekių". `{n}` in a form is replaced with the count. */
export function plural(locale: Locale, n: number, forms: PluralForms) {
  let form: string;
  if (locale === 'lt') {
    const [one, few, many] = forms.lt;
    const d = n % 10;
    const dd = n % 100;
    form = d === 1 && dd !== 11 ? one : d >= 2 && d <= 9 && (dd < 11 || dd > 19) ? few : many;
  } else {
    form = n === 1 ? forms.en[0] : forms.en[1];
  }
  return form.replace('{n}', String(n));
}

export const COUNT = {
  items: { en: ['{n} item', '{n} items'], lt: ['{n} prekė', '{n} prekės', '{n} prekių'] },
  products: { en: ['{n} product', '{n} products'], lt: ['{n} prekė', '{n} prekės', '{n} prekių'] },
  results: { en: ['{n} result', '{n} results'], lt: ['{n} rezultatas', '{n} rezultatai', '{n} rezultatų'] },
  saved: { en: ['{n} saved', '{n} saved'], lt: ['{n} išsaugota', '{n} išsaugotos', '{n} išsaugotų'] },
} satisfies Record<string, PluralForms>;
