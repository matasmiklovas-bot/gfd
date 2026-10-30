import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/content/ContentPage';
import { formatPrice, formatPriceShort } from '@/lib/money';
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { alternates, lp } from '@/lib/locale';
import { pageLocale, type LocaleParams } from '@/lib/pageLocale';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const flat = formatPrice(FLAT_SHIPPING, locale);
  const free = formatPriceShort(FREE_SHIPPING_THRESHOLD, locale);
  return locale === 'lt'
    ? {
        title: 'Pristatymas',
        description: `OSTREV siunčia į visas 27 ES šalis per 2–5 darbo dienas. Kaina ${flat}, nemokamai nuo ${free}.`,
        alternates: alternates(locale, '/help/shipping'),
      }
    : {
        title: 'Shipping',
        description: `OSTREV ships to all 27 EU countries in 2–5 working days. ${flat} flat rate, free over ${free}.`,
        alternates: alternates(locale, '/help/shipping'),
      };
}

export default async function ShippingPage({ params }: Props) {
  const locale = await pageLocale(params);
  const flat = formatPrice(FLAT_SHIPPING, locale);
  const free = formatPriceShort(FREE_SHIPPING_THRESHOLD, locale);
  const contact = lp(locale, '/help/contact');

  if (locale === 'lt') {
    return (
      <ContentPage
        locale={locale}
        path="/help/shipping"
        nav="help"
        eyebrow="Pagalba"
        title="Pristatymas"
        intro={<p>Siunčiame į visas ES šalis. Su sekimu, per 2–5 darbo dienas. Nemokamai nuo {free}.</p>}
      >
        <h2>Kainos</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Užsakymo suma</th>
              <th scope="col">Pristatymas</th>
              <th scope="col">Terminas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Iki {free}</td>
              <td>{flat}</td>
              <td>2–5 darbo dienos</td>
            </tr>
            <tr>
              <td>{free} ir daugiau</td>
              <td>Nemokamai</td>
              <td>2–5 darbo dienos</td>
            </tr>
          </tbody>
        </table>
        <p>
          Nemokamo pristatymo riba skaičiuojama nuo prekių sumos prieš nuolaidos kodus. Į Lietuvą, Latviją ir Estiją siuntiniai
          paprastai keliauja 1–3 darbo dienas.
        </p>

        <h2>Išsiuntimas</h2>
        <p>
          Darbo dieną iki 14:00 Vilniaus laiku pateikti užsakymai išsiunčiami tą pačią dieną. Vėliau, savaitgaliais ar Lietuvos
          valstybinių švenčių dienomis pateikti užsakymai išsiunčiami kitą darbo dieną. Išpardavimų metu pridėkite vieną dieną.
        </p>

        <h2>Siuntos sekimas</h2>
        <p>Vos išsiuntę atsiųsime el. laišką su sekimo nuoroda. Paskyros nereikia.</p>

        <h2>Muitai ir mokesčiai</h2>
        <p>Jokių. Siunčiame iš Lietuvos, ES viduje. Visos kainos su PVM. Už ES ribų kol kas nesiunčiame.</p>

        <h2>Problemos su pristatymu</h2>
        <p>
          Jei siuntinys vėluoja, yra pažeistas ar dingo, <Link href={contact}>parašykite mums</Link> ir nurodykite užsakymo
          numerį. Situaciją išspręsime su vežėju ir prekes pakeisime arba grąžinsime pinigus.
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      locale={locale}
      path="/help/shipping"
      nav="help"
      eyebrow="Help"
      title="Shipping"
      intro={<p>We ship to every EU country. Tracked, 2–5 working days. Free over {free}.</p>}
    >
      <h2>Rates</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Order subtotal</th>
            <th scope="col">Shipping</th>
            <th scope="col">Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Under {free}</td>
            <td>{flat}</td>
            <td>2–5 working days</td>
          </tr>
          <tr>
            <td>{free} and over</td>
            <td>Free</td>
            <td>2–5 working days</td>
          </tr>
        </tbody>
      </table>
      <p>
        The free shipping threshold is based on your subtotal before discount codes. Lithuania, Latvia and Estonia usually
        arrive within 1–3 working days.
      </p>

      <h2>Dispatch</h2>
      <p>
        Orders placed before 14:00 Vilnius time on a working day leave our warehouse the same day. Orders placed later, at
        weekends or on Lithuanian public holidays leave the next working day. During sales, allow one extra day.
      </p>

      <h2>Tracking</h2>
      <p>You get an email with a tracking link as soon as your parcel ships. No account needed.</p>

      <h2>Customs and duties</h2>
      <p>None. We ship from Lithuania, inside the EU. All prices include VAT. We do not ship outside the EU yet.</p>

      <h2>Problems with delivery</h2>
      <p>
        If your parcel is late, damaged or missing, <Link href={contact}>contact us</Link> with your order number. We will sort
        it out with the carrier and replace or refund the order.
      </p>
    </ContentPage>
  );
}
