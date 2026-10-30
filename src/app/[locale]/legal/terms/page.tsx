import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';
import { formatPrice, formatPriceShort } from '@/lib/money';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { alternates, lp } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return locale === 'lt'
    ? {
        title: 'Pirkimo taisyklės',
        description: 'Prekių pirkimo–pardavimo taisyklės užsakymams ostrev.com.',
        alternates: alternates(locale, '/legal/terms'),
      }
    : {
        title: 'Terms & conditions',
        description: 'Terms and conditions of sale for orders placed at ostrev.com.',
        alternates: alternates(locale, '/legal/terms'),
      };
}

// Template reflecting how this store works. Have it reviewed by a lawyer before launch.
export default async function TermsPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = SITE.company;
  const flat = formatPrice(FLAT_SHIPPING, locale);
  const free = formatPriceShort(FREE_SHIPPING_THRESHOLD, locale);
  const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;
  const vvtat = (
    <a href="https://vvtat.lrv.lt" target="_blank" rel="noopener noreferrer">
      vvtat.lrv.lt
    </a>
  );

  if (locale === 'lt') {
    return (
      <ContentPage
        locale={locale}
        path="/legal/terms"
        nav="legal"
        eyebrow="Teisinė informacija"
        title="Pirkimo taisyklės"
        updated="2026 m. spalio 30 d."
      >
        <h2>1. Pardavėjas</h2>
        <p>
          ostrev.com valdo {c.legalName}, {c.address}. Įmonės kodas: {c.registrationNumber}. PVM mokėtojo kodas: {c.vatNumber}.
          El. paštas: {mail}.
        </p>

        <h2>2. Taikymas</h2>
        <p>
          Šios taisyklės taikomos visiems Europos Sąjungos vartotojų užsakymams ostrev.com. Jos neriboja jūsų teisių pagal
          imperatyvias jūsų gyvenamosios šalies vartotojų apsaugos normas.
        </p>

        <h2>3. Užsakymai</h2>
        <p>
          Prekių nuotraukos yra iliustracinės; spalvos ekrane gali šiek tiek skirtis. Paspaudę „Mokėti“ pateikiate pasiūlymą
          pirkti. Sutartis sudaroma, kai atsiunčiame užsakymo patvirtinimo laišką. Jei užsakius paaiškėja, kad prekės nebėra,
          nedelsdami jus informuosime ir grąžinsime visą už ją sumokėtą sumą.
        </p>

        <h2>4. Kainos ir apmokėjimas</h2>
        <p>
          Kainos nurodytos eurais su PVM. Pristatymas ES kainuoja {flat} už užsakymą, užsakymams nuo {free} (prekių suma prieš
          nuolaidas) – nemokamai. Apmokama pateikiant užsakymą. Priimame mokėjimo korteles, Apple Pay, Google Pay, PayPal ir
          Klarna. Vienam užsakymui – vienas nuolaidos kodas.
        </p>

        <h2>5. Pristatymas</h2>
        <p>
          Į ES šalis pristatome per 2–5 darbo dienas nuo išsiuntimo. Rizika pereina jums, kai siuntinys įteikiamas jums arba jūsų
          nurodytam asmeniui. Daugiau – <Link href={lp(locale, '/help/shipping')}>Pristatymas</Link>.
        </p>

        <h2>6. Teisė atsisakyti sutarties</h2>
        <p>
          Per 14 dienų nuo prekių gavimo galite atsisakyti sutarties nenurodydami priežasties. Praneškite mums el. paštu arba
          kontaktų forma; galite naudoti pavyzdinę formą, pateiktą puslapyje{' '}
          <Link href={lp(locale, '/help/returns')}>Grąžinimas</Link>. Prekes išsiųskite per 14 dienų nuo pranešimo. Visas gautas
          įmokas, įskaitant standartinio pristatymo išlaidas, grąžiname per 14 dienų nuo jūsų pranešimo tuo pačiu mokėjimo būdu.
          Pinigų grąžinimą galime atidėti, kol gausime prekes arba grąžinimo įrodymą. Tiesiogines prekių grąžinimo išlaidas
          apmokate jūs. Atsakote už prekių vertės sumažėjimą, atsiradusį dėl naudojimo, kuris nėra būtinas prekių pobūdžiui,
          savybėms ir veikimui nustatyti.
        </p>

        <h2>7. Teisinė garantija</h2>
        <p>
          Prekių atitikčiai taikoma dvejų metų nuo pristatymo teisinė garantija. Jei prekės turi trūkumų ar neatitinka aprašymo,
          pagal taikomus teisės aktus jas pataisysime, pakeisime arba grąžinsime pinigus.
        </p>

        <h2>8. Atsakomybė</h2>
        <p>
          Atsakome už žalą, padarytą tyčia ar dėl didelio neatsargumo, ir kiek to reikalauja imperatyvios teisės normos. Neatsakome
          už vėlavimą dėl nuo mūsų nepriklausančių aplinkybių.
        </p>

        <h2>9. Intelektinė nuosavybė</h2>
        <p>Visas šios svetainės turinys, įskaitant OSTREV pavadinimą, dizainą, nuotraukas ir tekstus, priklauso mums arba mūsų licencijų davėjams.</p>

        <h2>10. Taikoma teisė ir ginčai</h2>
        <p>
          Taikoma Lietuvos Respublikos teisė, neatimant imperatyvių jūsų šalies vartotojų apsaugos normų teikiamos apsaugos. Jei
          skundo nepavyksta išspręsti kartu, galite kreiptis į Valstybinę vartotojų teisių apsaugos tarnybą ({vvtat}) arba
          kompetentingą teismą.
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage locale={locale} path="/legal/terms" nav="legal" eyebrow="Legal" title="Terms & conditions" updated="30 October 2026">
      <h2>1. Seller</h2>
      <p>
        ostrev.com is operated by {c.legalName}, {c.address}. Company code: {c.registrationNumber}. VAT number: {c.vatNumber}.
        Email: {mail}.
      </p>

      <h2>2. Scope</h2>
      <p>
        These terms apply to all orders placed at ostrev.com by consumers in the European Union. Nothing in them limits your
        rights under mandatory consumer law in your country of residence.
      </p>

      <h2>3. Orders</h2>
      <p>
        Product images are for illustration; colours can look slightly different on screen. Clicking &ldquo;Pay&rdquo; is an
        offer to buy. The contract is formed when we send the order confirmation email. If an item turns out to be unavailable
        after you order, we tell you straight away and refund any payment for it in full.
      </p>

      <h2>4. Prices and payment</h2>
      <p>
        Prices are in euro and include VAT. Shipping is {flat} per order within the EU, free on orders of {free} or more
        (subtotal before discounts). Payment is taken when you place the order. We accept cards, Apple Pay, Google Pay, PayPal
        and Klarna. One discount code per order.
      </p>

      <h2>5. Delivery</h2>
      <p>
        We deliver to EU countries within 2–5 working days of dispatch. Risk passes to you when the parcel is delivered to you
        or a person you name. See <Link href={lp(locale, '/help/shipping')}>Shipping</Link>.
      </p>

      <h2>6. Right of withdrawal</h2>
      <p>
        You can withdraw from the contract within 14 days of receiving the goods, without giving a reason. Tell us by email or
        through the contact form; you may use the model form on the <Link href={lp(locale, '/help/returns')}>Returns</Link> page.
        Send the goods back within 14 days of withdrawing. We refund all payments received, including standard delivery costs,
        within 14 days of your notice, using the original payment method. We may withhold the refund until we receive the goods
        or proof of return. You pay the direct cost of returning the goods. You are liable for any loss in value caused by
        handling beyond what is needed to establish their nature, characteristics and functioning.
      </p>

      <h2>7. Legal guarantee</h2>
      <p>
        You have a legal guarantee of conformity for two years from delivery. If goods are faulty or not as described, we
        repair, replace or refund them under applicable law.
      </p>

      <h2>8. Liability</h2>
      <p>
        We are liable for damage we cause intentionally or through gross negligence, and as required by mandatory law. We are
        not liable for delays caused by events outside our control.
      </p>

      <h2>9. Intellectual property</h2>
      <p>All content on this site, including the OSTREV name, designs, photos and text, belongs to us or our licensors.</p>

      <h2>10. Law and disputes</h2>
      <p>
        Lithuanian law applies, without removing the protection of mandatory consumer law in your country. If we cannot solve a
        complaint together, you can contact the State Consumer Rights Protection Authority of Lithuania (Valstybinė vartotojų
        teisių apsaugos tarnyba, {vvtat}) or the competent courts.
      </p>
    </ContentPage>
  );
}
