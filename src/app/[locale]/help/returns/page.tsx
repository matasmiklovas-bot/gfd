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
        title: 'Grąžinimas',
        description: 'Bet kurį OSTREV užsakymą galite grąžinti per 14 dienų nuo pristatymo ir atgauti visus pinigus. Visoje ES.',
        alternates: alternates(locale, '/help/returns'),
      }
    : {
        title: 'Returns',
        description: 'Return any OSTREV order within 14 days of delivery for a full refund. EU-wide.',
        alternates: alternates(locale, '/help/returns'),
      };
}

export default async function ReturnsPage({ params }: Props) {
  const locale = await pageLocale(params);
  const contact = lp(locale, '/help/contact');
  const mail = <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>;

  if (locale === 'lt') {
    return (
      <ContentPage
        locale={locale}
        path="/help/returns"
        nav="help"
        eyebrow="Pagalba"
        title="Grąžinimas"
        intro={<p>14 dienų nuo pristatymo. Priežasties nurodyti nereikia. Pinigus grąžiname tuo pačiu mokėjimo būdu.</p>}
      >
        <h2>Kaip grąžinti</h2>
        <ol>
          <li>
            Per 14 dienų nuo pristatymo parašykite {mail} arba užpildykite <Link href={contact}>kontaktų formą</Link>.
            Nurodykite užsakymo numerį ir grąžinamas prekes.
          </li>
          <li>Per vieną darbo dieną atsakysime ir atsiųsime grąžinimo adresą bei instrukcijas.</li>
          <li>Jei galite, supakuokite prekes į originalią pakuotę ir išsiųskite per 14 dienų nuo pranešimo mums.</li>
          <li>
            Pinigus grąžiname per 14 dienų nuo prašymo gavimo. Galime palaukti, kol prekės pasieks mus arba kol atsiųsite
            išsiuntimą patvirtinantį dokumentą.
          </li>
        </ol>

        <h2>Prekių būklė</h2>
        <p>
          Matuokitės taip, kaip parduotuvėje. Jei prekė grąžinama dėvėta, skalbta ar sugadinta labiau, nei reikia jai apžiūrėti,
          grąžinamą sumą galime sumažinti vertės praradimo dydžiu.
        </p>

        <h2>Išlaidos</h2>
        <p>
          Grąžinimo siuntimą apmokate jūs, nebent prekė yra su trūkumais arba atsiuntėme ne tą prekę. Grąžinus visą užsakymą,
          grąžiname ir pradinio standartinio pristatymo kainą.
        </p>

        <h2>Keitimas</h2>
        <p>Negalime rezervuoti kito dydžio keitimui. Grąžinkite prekę, atgausite pinigus, ir pateikite naują užsakymą.</p>

        <h2>Prekės su trūkumais</h2>
        <p>
          Pagal ES vartotojų teisę kiekvienai prekei taikoma dvejų metų teisinė garantija. Jei prekė turi trūkumų, atsiųskite
          nuotraukas – prekę pataisysime, pakeisime arba grąžinsime pinigus, įskaitant siuntimo išlaidas.
        </p>

        <h2>Pavyzdinė sutarties atsisakymo forma</h2>
        <p>Šios formos naudoti neprivalote, bet galite. Nukopijuokite ją į el. laišką adresu {SITE.supportEmail}:</p>
        <blockquote className="border-l-2 border-ink pl-4 text-[14px]">
          <p>
            Kam: {SITE.company.legalName}, {SITE.company.address}, {SITE.supportEmail}:
          </p>
          <p>
            Pranešu, kad atsisakau šių prekių pirkimo–pardavimo sutarties: [prekės]. Užsakyta [data] / gauta [data]. Užsakymo
            numeris: [numeris]. Vardas, pavardė: [vardas, pavardė]. Adresas: [adresas]. Data: [data].
          </p>
        </blockquote>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      locale={locale}
      path="/help/returns"
      nav="help"
      eyebrow="Help"
      title="Returns"
      intro={<p>14 days from delivery. No reason needed. Full refund to your original payment method.</p>}
    >
      <h2>How to return</h2>
      <ol>
        <li>
          Email {mail} or use the <Link href={contact}>contact form</Link> within 14 days of delivery. Include your order number
          and the items you are sending back.
        </li>
        <li>We reply within one working day with the return address and instructions.</li>
        <li>Pack the items in their original packaging if you can and send them within 14 days of telling us.</li>
        <li>We refund you within 14 days of receiving your request. We may wait until the items arrive, or you send proof of shipping.</li>
      </ol>

      <h2>Condition</h2>
      <p>
        Try things on like you would in a shop. If an item comes back worn, washed or damaged beyond what is needed to check it,
        we may reduce the refund to cover the loss in value.
      </p>

      <h2>Costs</h2>
      <p>
        Return shipping is paid by you, unless the item is faulty or we sent the wrong one. If you return the whole order, we
        also refund the original standard shipping cost.
      </p>

      <h2>Exchanges</h2>
      <p>We cannot hold another size for an exchange. Return the item for a refund and place a new order.</p>

      <h2>Faulty items</h2>
      <p>
        You have a two-year legal guarantee on every item under EU consumer law. If something is faulty, contact us with photos
        and we will repair, replace or refund it, including shipping.
      </p>

      <h2>Model withdrawal form</h2>
      <p>You do not have to use this form, but you can. Copy it into an email to {SITE.supportEmail}:</p>
      <blockquote className="border-l-2 border-ink pl-4 text-[14px]">
        <p>
          To {SITE.company.legalName}, {SITE.company.address}, {SITE.supportEmail}:
        </p>
        <p>
          I hereby give notice that I withdraw from my contract of sale of the following goods: [items]. Ordered on [date] /
          received on [date]. Order number: [number]. Name: [name]. Address: [address]. Date: [date].
        </p>
      </blockquote>
    </ContentPage>
  );
}
