import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { SITE } from '@/lib/site';
import { alternates, lp } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  return locale === 'lt'
    ? {
        title: 'Privatumo politika',
        description: 'Kaip OSTREV renka, naudoja ir saugo jūsų asmens duomenis pagal BDAR.',
        alternates: alternates(locale, '/legal/privacy'),
      }
    : {
        title: 'Privacy policy',
        description: 'How OSTREV collects, uses and protects your personal data under the GDPR.',
        alternates: alternates(locale, '/legal/privacy'),
      };
}

// Template reflecting how this store works. Have it reviewed by a lawyer before launch.
export default async function PrivacyPage({ params }: Props) {
  const locale = await pageLocale(params);
  const c = SITE.company;
  const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;
  const vdai = (
    <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer">
      vdai.lrv.lt
    </a>
  );

  if (locale === 'lt') {
    return (
      <ContentPage
        locale={locale}
        path="/legal/privacy"
        nav="legal"
        eyebrow="Teisinė informacija"
        title="Privatumo politika"
        updated="2026 m. spalio 30 d."
      >
        <h2>Kas mes esame</h2>
        <p>
          {c.legalName} ({c.address}, įmonės kodas {c.registrationNumber}) yra jūsų asmens duomenų valdytojas. Privatumo
          klausimais rašykite {mail}.
        </p>

        <h2>Ką renkame ir kodėl</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Duomenys</th>
              <th scope="col">Tikslas</th>
              <th scope="col">Teisinis pagrindas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vardas, pavardė, el. paštas, pristatymo adresas, telefonas, užsakymo turinys</td>
              <td>Užsakymo vykdymas ir pristatymas, grąžinimas, klientų aptarnavimas</td>
              <td>Sutartis (BDAR 6 str. 1 d. b p.)</td>
            </tr>
            <tr>
              <td>Mokėjimo duomenys</td>
              <td>Apmokėjimas. Tvarko Stripe – mes niekada nematome ir nesaugome pilnų kortelės numerių</td>
              <td>Sutartis</td>
            </tr>
            <tr>
              <td>Sąskaitos ir užsakymų įrašai</td>
              <td>Apskaitos ir mokesčių prievolės</td>
              <td>Teisinė prievolė (6 str. 1 d. c p.)</td>
            </tr>
            <tr>
              <td>El. pašto adresas (naujienlaiškis)</td>
              <td>Naujienų apie kolekcijas ir pasiūlymus siuntimas</td>
              <td>Sutikimas (6 str. 1 d. a p.) – atšaukti galite bet kada</td>
            </tr>
            <tr>
              <td>Jūsų mums siunčiami pranešimai</td>
              <td>Atsakymai į jūsų klausimus</td>
              <td>Teisėtas interesas (6 str. 1 d. f p.)</td>
            </tr>
            <tr>
              <td>Naudojimosi duomenys per analitikos slapukus</td>
              <td>Parduotuvės veikimo supratimas ir tobulinimas</td>
              <td>Sutikimas – tik jei sutinkate su analitikos slapukais</td>
            </tr>
          </tbody>
        </table>

        <h2>Kam perduodame duomenis</h2>
        <p>Tik duomenų tvarkytojams, kurie padeda vykdyti parduotuvės veiklą, pagal duomenų tvarkymo sutartis:</p>
        <ul>
          <li>Stripe (mokėjimai, įskaitant PayPal ir Klarna, jei juos pasirenkate)</li>
          <li>Mūsų prieglobos paslaugų teikėjui</li>
          <li>El. pašto paslaugų teikėjui (užsakymų laiškai ir naujienlaiškis)</li>
          <li>Kurjerių tarnyboms (vardas, adresas, telefonas, el. paštas pristatymo pranešimams)</li>
        </ul>
        <p>
          Kai kurie tvarkytojai veikia už EEE ribų, pavyzdžiui, Jungtinėse Valstijose. Tokiam perdavimui taikoma ES ir JAV duomenų
          privatumo sistema arba Europos Komisijos standartinės sutarčių sąlygos. Jūsų duomenų niekada neparduodame.
        </p>

        <h2>Kiek laiko saugome</h2>
        <ul>
          <li>Užsakymų ir apskaitos įrašus – 10 metų, kaip reikalauja Lietuvos buhalterinės apskaitos įstatymai.</li>
          <li>Naujienlaiškio duomenis – kol atsisakysite prenumeratos.</li>
          <li>Klientų aptarnavimo pranešimus – 3 metus nuo paskutinio kontakto.</li>
        </ul>

        <h2>Duomenys jūsų įrenginyje</h2>
        <p>
          Jūsų krepšelis, norų sąrašas, neseniai žiūrėtos prekės, paskyros duomenys ir užsakymų istorija saugomi jūsų naršyklės
          vietinėje saugykloje šiame įrenginyje. Ištrynus naršyklės duomenis, jie išnyksta. Daugiau –{' '}
          <Link href={lp(locale, '/legal/cookies')}>slapukų politikoje</Link>.
        </p>

        <h2>Jūsų teisės</h2>
        <p>
          Galite prašyti susipažinti su savo duomenimis, juos ištaisyti ar ištrinti, apriboti tvarkymą ar nesutikti su juo, gauti
          duomenų kopiją perkeliamu formatu. Sutikimą galite atšaukti bet kada – tai neturi įtakos ankstesniam tvarkymui. Rašykite{' '}
          {mail} – atsakome per vieną mėnesį.
        </p>
        <p>
          Taip pat galite pateikti skundą Valstybinei duomenų apsaugos inspekcijai ({vdai}) arba savo ES šalies priežiūros
          institucijai.
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage locale={locale} path="/legal/privacy" nav="legal" eyebrow="Legal" title="Privacy policy" updated="30 October 2026">
      <h2>Who we are</h2>
      <p>
        {c.legalName} ({c.address}, company code {c.registrationNumber}) is the controller of your personal data. Contact us
        about privacy at {mail}.
      </p>

      <h2>What we collect and why</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Purpose</th>
            <th scope="col">Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name, email, delivery address, phone, order contents</td>
            <td>Processing and delivering your order, returns, customer service</td>
            <td>Contract (Art. 6(1)(b) GDPR)</td>
          </tr>
          <tr>
            <td>Payment details</td>
            <td>Taking payment. Handled by Stripe — we never see or store full card numbers</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Invoices and order records</td>
            <td>Accounting and tax obligations</td>
            <td>Legal obligation (Art. 6(1)(c))</td>
          </tr>
          <tr>
            <td>Email address (newsletter)</td>
            <td>Sending news about collections and offers</td>
            <td>Consent (Art. 6(1)(a)) — withdraw any time</td>
          </tr>
          <tr>
            <td>Messages you send us</td>
            <td>Answering your questions</td>
            <td>Legitimate interest (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Usage data via analytics cookies</td>
            <td>Understanding and improving the store</td>
            <td>Consent — only if you accept analytics cookies</td>
          </tr>
        </tbody>
      </table>

      <h2>Who we share it with</h2>
      <p>Only with processors who help us run the store, under data processing agreements:</p>
      <ul>
        <li>Stripe (payments, including PayPal and Klarna where you choose them)</li>
        <li>Our hosting provider</li>
        <li>Our email service provider (order emails and newsletter)</li>
        <li>Delivery carriers (name, address, phone, email for delivery updates)</li>
      </ul>
      <p>
        Some processors are based outside the EEA, such as in the United States. Those transfers are covered by the EU–US Data
        Privacy Framework or the European Commission&apos;s Standard Contractual Clauses. We never sell your data.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Order and accounting records: 10 years, as required by Lithuanian accounting law.</li>
        <li>Newsletter: until you unsubscribe.</li>
        <li>Customer service messages: 3 years after the last contact.</li>
      </ul>

      <h2>Data stored on your device</h2>
      <p>
        Your bag, wishlist, recently viewed products, account details and order history in this store are kept in your
        browser&apos;s local storage on your device. Clearing your browser data deletes them. See the{' '}
        <Link href={lp(locale, '/legal/cookies')}>cookie policy</Link>.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask for access to, correction or deletion of your data, restriction of or objection to processing, and a copy in
        a portable format. You can withdraw consent at any time without affecting earlier processing. Email {mail} — we answer
        within one month.
      </p>
      <p>
        You can also complain to the State Data Protection Inspectorate of Lithuania (Valstybinė duomenų apsaugos inspekcija,{' '}
        {vdai}) or the authority in your EU country.
      </p>
    </ContentPage>
  );
}
