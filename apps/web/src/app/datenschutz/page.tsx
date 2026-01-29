/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz | E-Commerce Rente',
  description: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-light rounded-lg shadow-xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold mb-8">
            Datenschutzerklärung
          </h1>

          <div className="prose prose-invert max-w-none">
            <div className="bg-orange/20 border-l-4 border-orange p-4 mb-6">
              <p className="text-orange font-semibold">
                ⚠️ WICHTIGER HINWEIS
              </p>
              <p className="text-white mt-2">
                Diese Datenschutzerklärung ist ein Platzhalter und muss von einem
                Fachanwalt für Datenschutzrecht geprüft und auf die spezifischen
                Gegebenheiten des Unternehmens angepasst werden. Die DSGVO-Konformität
                muss sichergestellt werden.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-xl font-semibold text-gold/80 mb-3">
                Allgemeine Hinweise
              </h3>
              <p className="text-white">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was
                mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
                besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                2. Verantwortliche Stelle
              </h2>
              <div className="bg-dark p-4 rounded border border-gold/20">
                <p className="text-white">
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser
                  Website ist:
                </p>
                <p className="text-white mt-2">
                  [FIRMENNAME EINTRAGEN]<br />
                  [ADRESSE EINTRAGEN]<br />
                  [TELEFON EINTRAGEN]<br />
                  E-Mail: [EMAIL EINTRAGEN]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                3. Datenerfassung auf dieser Website
              </h2>

              <h3 className="text-xl font-semibold text-gold/80 mb-3">
                3.1 Cookies
              </h3>
              <p className="text-white">
                Unsere Website verwendet Cookies. Cookies sind kleine Textdateien,
                die auf Ihrem Endgerät gespeichert werden und die Ihr Browser
                speichert. Einige Cookies sind technisch notwendig, andere dienen
                der Analyse des Nutzerverhaltens.
              </p>
              <div className="bg-dark p-4 rounded border border-gold/20 mt-3">
                <p className="text-white">
                  <strong>Verwendete Cookies:</strong>
                </p>
                <ul className="text-white mt-2 ml-4 list-disc">
                  <li>Session-Cookies für die Authentifizierung (Clerk)</li>
                  <li>Technisch notwendige Cookies für den Checkout-Prozess</li>
                  <li>Zahlungsabwicklung (Stripe)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                3.2 Server-Log-Dateien
              </h3>
              <p className="text-white">
                Der Provider der Seiten erhebt und speichert automatisch
                Informationen in so genannten Server-Log-Dateien, die Ihr Browser
                automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                4. Externe Dienste und Drittanbieter
              </h2>

              <h3 className="text-xl font-semibold text-gold/80 mb-3">
                4.1 Clerk (Authentifizierung)
              </h3>
              <p className="text-white">
                Wir nutzen Clerk für die Benutzerauthentifizierung und
                Benutzerverwaltung. Clerk verarbeitet dabei folgende Daten:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>E-Mail-Adresse</li>
                <li>Name (optional)</li>
                <li>Authentifizierungsdaten</li>
              </ul>
              <p className="text-white mt-2">
                Anbieter: Clerk, Inc., USA<br />
                Website:{' '}
                <a
                  href="https://clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://clerk.com
                </a>
                <br />
                Datenschutzerklärung:{' '}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://clerk.com/privacy
                </a>
              </p>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                4.2 Stripe (Zahlungsabwicklung)
              </h3>
              <p className="text-white">
                Für die Zahlungsabwicklung nutzen wir Stripe. Stripe verarbeitet
                dabei folgende Daten:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>Zahlungsdaten (Kreditkartennummer, etc.)</li>
                <li>Rechnungsdaten</li>
                <li>Bestellinformationen</li>
              </ul>
              <p className="text-white mt-2">
                Anbieter: Stripe, Inc., USA / Stripe Payments Europe, Ltd., Irland<br />
                Website:{' '}
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://stripe.com
                </a>
                <br />
                Datenschutzerklärung:{' '}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://stripe.com/privacy
                </a>
              </p>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                4.3 Resend (E-Mail-Versand)
              </h3>
              <p className="text-white">
                Für den Versand von E-Mails (Bestellbestätigungen, Benachrichtigungen)
                nutzen wir Resend. Verarbeitete Daten:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>E-Mail-Adresse</li>
                <li>Name</li>
                <li>E-Mail-Inhalte</li>
              </ul>
              <p className="text-white mt-2">
                Anbieter: Resend, Inc.<br />
                Website:{' '}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://resend.com
                </a>
                <br />
                Datenschutzerklärung:{' '}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline"
                >
                  https://resend.com/legal/privacy-policy
                </a>
              </p>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                4.4 Hosting
              </h3>
              <p className="text-white">
                Unsere Website wird gehostet bei:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>
                  <strong>Frontend:</strong> Vercel Inc., USA<br />
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    Datenschutzerklärung Vercel
                  </a>
                </li>
                <li className="mt-2">
                  <strong>Backend/API:</strong> Railway Corp., USA<br />
                  <a
                    href="https://railway.app/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 underline"
                  >
                    Datenschutzerklärung Railway
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                5. Ihre Rechte als betroffene Person
              </h2>
              <p className="text-white">
                Sie haben folgende Rechte gemäß DSGVO:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
                <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
                <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                <li><strong>Recht auf Beschwerde bei einer Aufsichtsbehörde</strong> (Art. 77 DSGVO)</li>
              </ul>
              <p className="text-white mt-4">
                Um Ihre Rechte auszuüben, wenden Sie sich bitte an die im Impressum
                genannten Kontaktdaten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                6. Datenverarbeitung im Rahmen der Geschäftstätigkeit
              </h2>

              <h3 className="text-xl font-semibold text-gold/80 mb-3">
                6.1 Bestellabwicklung
              </h3>
              <p className="text-white">
                Im Rahmen der Bestellabwicklung verarbeiten wir:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>Name und Kontaktdaten</li>
                <li>Bestelldaten und Produktinformationen</li>
                <li>Zahlungsinformationen</li>
                <li>Lieferadressen</li>
              </ul>
              <p className="text-white mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                6.2 Reseller-Programm
              </h3>
              <p className="text-white">
                Für Teilnehmer am Reseller-Programm verarbeiten wir:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>Referral-Links und vermittelte Verkäufe</li>
                <li>Provisionsdaten</li>
                <li>Bankverbindung (IBAN) für Auszahlungen</li>
                <li>Wallet-Transaktionen</li>
              </ul>
              <p className="text-white mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>

              <h3 className="text-xl font-semibold text-gold/80 mb-3 mt-6">
                6.3 Lagergebühren
              </h3>
              <p className="text-white">
                Für die Berechnung von Lagergebühren werden folgende Daten verarbeitet:
              </p>
              <ul className="text-white mt-2 ml-4 list-disc">
                <li>Bestelldatum und Bezahldatum</li>
                <li>Abholzeitpunkt</li>
                <li>Anzahl der Paletten</li>
                <li>Berechnete Lagergebühren</li>
              </ul>
              <p className="text-white mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                7. Speicherdauer
              </h2>
              <p className="text-white">
                Wir speichern personenbezogene Daten nur so lange, wie dies für die
                Erfüllung der jeweiligen Zwecke erforderlich ist oder gesetzliche
                Aufbewahrungsfristen bestehen.
              </p>
              <div className="bg-dark p-4 rounded border border-gold/20 mt-3">
                <p className="text-white">
                  <strong>Typische Speicherfristen:</strong>
                </p>
                <ul className="text-white mt-2 ml-4 list-disc">
                  <li>Bestelldaten: 10 Jahre (steuerrechtliche Aufbewahrungspflicht)</li>
                  <li>Rechnungen: 10 Jahre (§ 147 AO)</li>
                  <li>Vertragsdokumente: 6 Jahre (§ 257 HGB)</li>
                  <li>Kundenkonto: Bis zur Löschungsanfrage oder Ende der Geschäftsbeziehung</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gold mb-4">
                8. Datensicherheit
              </h2>
              <p className="text-white">
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein,
                um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen,
                Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen
                zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der
                technologischen Entwicklung fortlaufend verbessert.
              </p>
              <div className="bg-dark p-4 rounded border border-gold/20 mt-3">
                <p className="text-white">
                  <strong>Sicherheitsmaßnahmen umfassen u.a.:</strong>
                </p>
                <ul className="text-white mt-2 ml-4 list-disc">
                  <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
                  <li>Verschlüsselte Speicherung sensibler Daten</li>
                  <li>Regelmäßige Sicherheitsupdates</li>
                  <li>Zugriffskontrollen und Berechtigungskonzepte</li>
                </ul>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <p className="text-white text-sm">
                Stand: Januar 2026
              </p>
              <p className="text-white text-sm mt-2">
                Diese Datenschutzerklärung wurde zuletzt am [DATUM EINTRAGEN] aktualisiert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
