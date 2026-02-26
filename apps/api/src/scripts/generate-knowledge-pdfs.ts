import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.join(__dirname, '../../../web/public/downloads/knowledge');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const baseStyles = `
  @page {
    margin: 0;
    size: A4;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    background: white;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    background: white;
    position: relative;
  }
  .header {
    background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%);
    color: white;
    padding: 20px 30px;
    margin: -20mm -20mm 30px -20mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header h1 {
    font-size: 24px;
    font-weight: bold;
  }
  .header .brand {
    font-size: 18px;
    font-weight: 600;
  }
  .footer {
    position: fixed;
    bottom: 15mm;
    left: 20mm;
    right: 20mm;
    text-align: center;
    font-size: 11px;
    color: #666;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  h1 {
    color: #D4AF37;
    font-size: 28px;
    margin: 30px 0 15px 0;
  }
  h2 {
    color: #D4AF37;
    font-size: 22px;
    margin: 25px 0 12px 0;
  }
  h3 {
    color: #1a1a1a;
    font-size: 18px;
    margin: 20px 0 10px 0;
  }
  p {
    margin: 10px 0;
    font-size: 14px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 13px;
  }
  th {
    background: #D4AF37;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #ddd;
  }
  tr:nth-child(even) {
    background: #f5f5f5;
  }
  ul, ol {
    margin: 15px 0 15px 25px;
  }
  li {
    margin: 8px 0;
    font-size: 14px;
  }
  .checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #D4AF37;
    margin-right: 8px;
    vertical-align: middle;
  }
  .section {
    margin: 30px 0;
    page-break-inside: avoid;
  }
  .formula {
    background: #f5f5f5;
    padding: 15px;
    border-left: 4px solid #D4AF37;
    margin: 15px 0;
    font-family: monospace;
  }
  .example {
    background: #fffbf0;
    border: 1px solid #D4AF37;
    padding: 15px;
    margin: 15px 0;
  }
`;

function createHTMLTemplate(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">E-Commerce Rente</div>
      <div>${title}</div>
    </div>
    ${content}
    <div class="footer">
      © E-Commerce Rente | ecommercerente.com
    </div>
  </div>
</body>
</html>
  `;
}

async function generatePDF1() {
  const content = `
    <h1>Amazon Seller Checkliste</h1>
    <p>Ihre komplette Checkliste für den erfolgreichen Start als Amazon Seller. 50+ Punkte, aufgeteilt in 6 Kategorien.</p>

    <div class="section">
      <h2>1. Konto & Registrierung</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> Amazon Seller Central Konto erstellt</li>
        <li><span class="checkbox"></span> Geschäftsdaten verifiziert</li>
        <li><span class="checkbox"></span> Bankverbindung hinterlegt</li>
        <li><span class="checkbox"></span> Steuernummer eingegeben</li>
        <li><span class="checkbox"></span> Zwei-Faktor-Authentifizierung aktiviert</li>
        <li><span class="checkbox"></span> Markenregistrierung geprüft</li>
        <li><span class="checkbox"></span> AGB & Richtlinien gelesen</li>
        <li><span class="checkbox"></span> Versandeinstellungen konfiguriert</li>
        <li><span class="checkbox"></span> Rückgaberichtlinie definiert</li>
        <li><span class="checkbox"></span> Notfallkontakt hinterlegt</li>
      </ul>
    </div>

    <div class="section">
      <h2>2. Produktrecherche</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> Nischenstrategie definiert</li>
        <li><span class="checkbox"></span> Suchvolumen analysiert (min. 1000/Monat)</li>
        <li><span class="checkbox"></span> Wettbewerb bewertet (unter 1000 Reviews)</li>
        <li><span class="checkbox"></span> BSR unter 50.000 geprüft</li>
        <li><span class="checkbox"></span> Saisonalität analysiert</li>
        <li><span class="checkbox"></span> Margenberechnung durchgeführt (min. 30%)</li>
        <li><span class="checkbox"></span> Patente & Marken geprüft</li>
        <li><span class="checkbox"></span> Lieferanten recherchiert</li>
        <li><span class="checkbox"></span> Musterbestellung aufgegeben</li>
        <li><span class="checkbox"></span> Qualitätskontrolle durchgeführt</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. Listing-Optimierung</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> Hauptkeyword im Titel</li>
        <li><span class="checkbox"></span> 5 Bullet Points optimiert</li>
        <li><span class="checkbox"></span> Backend-Keywords ausgefüllt</li>
        <li><span class="checkbox"></span> A+ Content erstellt</li>
        <li><span class="checkbox"></span> 7-9 professionelle Produktfotos</li>
        <li><span class="checkbox"></span> Hauptbild weißer Hintergrund</li>
        <li><span class="checkbox"></span> Preis wettbewerbsfähig gesetzt</li>
        <li><span class="checkbox"></span> Varianten konfiguriert</li>
        <li><span class="checkbox"></span> Brand Story erstellt</li>
        <li><span class="checkbox"></span> Q&A vorbereitet</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. Logistik & FBA Setup</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> FBA aktiviert</li>
        <li><span class="checkbox"></span> FNSKU-Label vorbereitet</li>
        <li><span class="checkbox"></span> Versandplan erstellt</li>
        <li><span class="checkbox"></span> Kartonlabels gedruckt</li>
        <li><span class="checkbox"></span> Spediteur beauftragt</li>
        <li><span class="checkbox"></span> Warehouse-Adresse hinterlegt</li>
        <li><span class="checkbox"></span> Inventory-Limits geprüft</li>
        <li><span class="checkbox"></span> Long-Term Storage Fees kalkuliert</li>
        <li><span class="checkbox"></span> Reorder-Point definiert</li>
        <li><span class="checkbox"></span> Backup-Lieferant identifiziert</li>
      </ul>
    </div>

    <div class="section">
      <h2>5. Launch & Marketing</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> PPC Kampagne erstellt</li>
        <li><span class="checkbox"></span> Auto-Targeting aktiviert</li>
        <li><span class="checkbox"></span> Budget festgelegt (min. €20/Tag)</li>
        <li><span class="checkbox"></span> Vine-Programm beantragt</li>
        <li><span class="checkbox"></span> Erste Bewertungen generiert</li>
        <li><span class="checkbox"></span> Social Proof aufgebaut</li>
        <li><span class="checkbox"></span> Außerhalb Amazon Traffic geplant</li>
        <li><span class="checkbox"></span> Promotions eingerichtet</li>
        <li><span class="checkbox"></span> Coupon erstellt</li>
        <li><span class="checkbox"></span> A/B Test gestartet</li>
      </ul>
    </div>

    <div class="section">
      <h2>6. Rechtliches & Steuern</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> USt-IdNr. vorhanden</li>
        <li><span class="checkbox"></span> Impressum korrekt</li>
        <li><span class="checkbox"></span> DSGVO-konform</li>
        <li><span class="checkbox"></span> Produkthaftpflicht abgeschlossen</li>
        <li><span class="checkbox"></span> CE-Kennzeichnung geprüft</li>
        <li><span class="checkbox"></span> REACH-Konformität</li>
        <li><span class="checkbox"></span> Verpackungsgesetz (LUCID) registriert</li>
        <li><span class="checkbox"></span> Reverse Charge verstanden</li>
        <li><span class="checkbox"></span> Steuerberater konsultiert</li>
        <li><span class="checkbox"></span> Buchhaltung aufgesetzt</li>
      </ul>
    </div>
  `;

  return createHTMLTemplate('Amazon Seller Checkliste', content);
}

async function generatePDF2() {
  const content = `
    <h1>Produktrecherche Template</h1>
    <p>Professionelle Vorlage zur systematischen Produktanalyse und ROI-Bewertung.</p>

    <div class="section">
      <h2>1. Produkt-Grunddaten</h2>
      <table>
        <thead>
          <tr>
            <th>Produktname</th>
            <th>ASIN</th>
            <th>Kategorie</th>
            <th>Hauptkeyword</th>
            <th>Bewertung (1-10)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>2. Marktanalyse</h2>
      <table>
        <thead>
          <tr>
            <th>Metrik</th>
            <th>Wert</th>
            <th>Bewertung</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monatliches Suchvolumen</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>BSR (Best Seller Rank)</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Anzahl Wettbewerber</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Ø Wettbewerber-Reviews</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Ø Wettbewerber-Preis</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Saisonalität (Jan-Dez)</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>3. Kostenrechnung</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Kosten (€)</th>
            <th>Anteil (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Einkaufspreis</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Frachtkosten</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Importzoll</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Amazon Referral Fee (8-15%)</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>FBA-Gebühr</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Storage-Gebühr</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>PPC-Budget</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>Sonstige</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr style="font-weight: bold;"><td>SUMME KOSTEN</td><td>&nbsp;</td><td>100%</td></tr>
          <tr style="font-weight: bold;"><td>Verkaufspreis</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr style="font-weight: bold; color: #D4AF37;"><td>ROHGEWINN</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr style="font-weight: bold; color: #D4AF37;"><td>ROI</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>4. Top 5 Wettbewerber</h2>
      <table>
        <thead>
          <tr>
            <th>Rang</th>
            <th>Seller</th>
            <th>ASIN</th>
            <th>Preis</th>
            <th>Reviews</th>
            <th>Rating</th>
            <th>Stärken</th>
            <th>Schwächen</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>5</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>5. Go/No-Go Entscheidung</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> Marge > 30%</li>
        <li><span class="checkbox"></span> Suchvolumen > 1000</li>
        <li><span class="checkbox"></span> Reviews < 1000</li>
        <li><span class="checkbox"></span> Keine Patentprobleme</li>
        <li><span class="checkbox"></span> Lieferant gefunden</li>
      </ul>
      <p style="margin-top: 20px;"><strong>Entscheidung:</strong></p>
      <p><span class="checkbox"></span> GO &nbsp;&nbsp;&nbsp; <span class="checkbox"></span> NO-GO</p>
      <p style="margin-top: 15px;"><strong>Notizen:</strong></p>
      <div style="border: 1px solid #ddd; min-height: 100px; padding: 10px; margin-top: 10px;"></div>
    </div>
  `;

  return createHTMLTemplate('Produktrecherche Template', content);
}

async function generatePDF3() {
  const content = `
    <h1>Steuer-Guide: Reverse Charge</h1>
    <p>Umfassender Leitfaden zum Reverse-Charge-Verfahren im E-Commerce.</p>

    <div class="section">
      <h2>Kapitel 1: Was ist Reverse Charge?</h2>
      <p>Das <strong>Reverse-Charge-Verfahren</strong> (Umkehrung der Steuerschuldnerschaft) gilt im B2B-Handel innerhalb der EU. Statt dass der Lieferant die Mehrwertsteuer abführt, schuldet der Leistungsempfänger die Steuer. Dadurch entfällt die Umsatzsteuerausweisung auf der Rechnung.</p>
      <div class="example">
        <strong>Beispiel:</strong> Ein deutscher Händler verkauft Waren im Wert von €1.000 an ein österreichisches Unternehmen. Statt €1.190 (inkl. 19% dt. MwSt.) zu berechnen, stellt er nur €1.000 in Rechnung und vermerkt "Reverse Charge". Das österreichische Unternehmen zahlt dann die österreichische USt direkt ans Finanzamt.
      </div>
    </div>

    <div class="section">
      <h2>Kapitel 2: Wann gilt Reverse Charge?</h2>
      <table>
        <thead>
          <tr>
            <th>Bedingung</th>
            <th>Nein</th>
            <th>Ja</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Ist der Kunde ein Unternehmer (B2B)?</strong></td>
            <td>→ Normaler USt-Satz</td>
            <td>→ Weiter zu 2</td>
          </tr>
          <tr>
            <td><strong>2. Hat der Kunde eine gültige USt-IdNr.?</strong></td>
            <td>→ Normaler USt-Satz</td>
            <td>→ Weiter zu 3</td>
          </tr>
          <tr>
            <td><strong>3. Ist der Kunde in einem anderen EU-Land?</strong></td>
            <td>→ Normaler USt-Satz</td>
            <td>→ <strong style="color: #D4AF37;">REVERSE CHARGE</strong></td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 15px;"><strong>Sonderfall Schweiz:</strong> Exportlieferung (0% MWST, Einfuhrumsatzsteuer beim Empfänger)</p>
    </div>

    <div class="section">
      <h2>Kapitel 3: Korrekte Rechnungsstellung</h2>
      <p><strong>Pflichtangaben auf Reverse-Charge-Rechnungen:</strong></p>
      <ul>
        <li>Hinweis: "Steuerschuldnerschaft des Leistungsempfängers" (DE) oder "Reverse Charge"</li>
        <li>KEINE Umsatzsteuer ausweisen</li>
        <li>USt-IdNr. des Lieferanten</li>
        <li>USt-IdNr. des Kunden</li>
        <li>Netto-Betrag = Rechnungsbetrag</li>
      </ul>

      <div class="example">
        <h3>Muster-Rechnung</h3>
        <p><strong>Von:</strong> Musterfirma GmbH, DE123456789 (USt-IdNr.)<br>
        <strong>An:</strong> Beispiel KG, AT U12345678 (UID)<br>
        <strong>Lieferung:</strong> 100 Stück Artikel XYZ<br>
        <strong>Betrag:</strong> €1.000,00 (Netto)<br>
        <strong>Hinweis:</strong> <span style="color: #D4AF37; font-weight: bold;">Steuerschuldnerschaft des Leistungsempfängers (§13b UStG)</span><br>
        <strong>Zu zahlen:</strong> €1.000,00</p>
      </div>
    </div>

    <div class="section">
      <h2>Kapitel 4: DACH-Spezifika</h2>
      <table>
        <thead>
          <tr>
            <th>Land</th>
            <th>Hinweistext</th>
            <th>Rechtsgrundlage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deutschland</td>
            <td>"Steuerschuldnerschaft des Leistungsempfängers"</td>
            <td>§13b UStG</td>
          </tr>
          <tr>
            <td>Österreich</td>
            <td>"Übergang der Steuerschuld"</td>
            <td>§19 UStG</td>
          </tr>
          <tr>
            <td>Schweiz</td>
            <td>"Exportlieferung steuerbefreit"</td>
            <td>Art. 18 MWSTG</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 5: Häufige Fehler</h2>
      <ol>
        <li><strong>USt trotzdem ausgewiesen:</strong> Wenn Sie auf einer Reverse-Charge-Rechnung Umsatzsteuer ausweisen, schulden Sie diese dem Finanzamt!</li>
        <li><strong>Fehlender Pflichthinweis:</strong> Ohne korrekten Hinweistext ist die Rechnung nicht gültig.</li>
        <li><strong>Ungültige USt-IdNr. nicht geprüft:</strong> Immer über VIES-System prüfen!</li>
        <li><strong>Falsches Land des Leistungsorts:</strong> Bei Dienstleistungen gelten Sonderregeln.</li>
        <li><strong>Privatpersonen falsch behandelt:</strong> Reverse Charge gilt NUR bei B2B.</li>
      </ol>
    </div>

    <div class="section">
      <h2>Kapitel 6: Checkliste pro Rechnung</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> B2B-Kunde verifiziert</li>
        <li><span class="checkbox"></span> USt-IdNr. im VIES geprüft</li>
        <li><span class="checkbox"></span> Richtiger Hinweistext auf Rechnung</li>
        <li><span class="checkbox"></span> Keine USt ausgewiesen</li>
        <li><span class="checkbox"></span> Beide USt-IdNr. auf Rechnung</li>
        <li><span class="checkbox"></span> In Buchführung korrekt erfasst</li>
      </ul>
    </div>
  `;

  return createHTMLTemplate('Steuer-Guide Reverse Charge', content);
}

async function generatePDF4() {
  const content = `
    <h1>ROI Kalkulations-Template</h1>
    <p>Professionelle Vorlage zur Berechnung des Return on Investment für Warenpaket-Deals.</p>

    <div class="section">
      <h2>1. Warenpaket-Kalkulation</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Betrag (€)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Warenpaket Einkaufspreis</td><td>&nbsp;</td></tr>
          <tr><td>Transportkosten (Lieferant → Lager)</td><td>&nbsp;</td></tr>
          <tr><td>Zollgebühren (falls Import)</td><td>&nbsp;</td></tr>
          <tr><td>Etikettierung/Vorbereitung</td><td>&nbsp;</td></tr>
          <tr><td>FBA-Einlieferungskosten</td><td>&nbsp;</td></tr>
          <tr style="font-weight: bold; background: #D4AF37; color: white;"><td>GESAMTINVESTITION</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>2. Amazon-Gebühren pro Einheit</h2>
      <table>
        <thead>
          <tr>
            <th>Gebühr</th>
            <th>Prozent/Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Referral Fee</td><td>&nbsp;%</td></tr>
          <tr><td>FBA Fulfillment Fee</td><td>€&nbsp;</td></tr>
          <tr><td>Monthly Storage Fee</td><td>€&nbsp;</td></tr>
          <tr><td>Long-Term Storage (falls >365 Tage)</td><td>€&nbsp;</td></tr>
          <tr><td>Returns Processing</td><td>€&nbsp;</td></tr>
          <tr style="font-weight: bold;"><td>SUMME GEBÜHREN</td><td>€&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>3. Break-Even Analyse</h2>
      <div class="formula">
        Break-Even Preis = (Einkaufspreis + Gebühren) / (1 - Gewinnmarge%)
      </div>
      <div class="example">
        <h3>Beispielrechnung</h3>
        <p><strong>Warenpaket:</strong> €5.000 für 200 Einheiten = €25/Einheit<br>
        <strong>Amazon-Gebühren:</strong> €10/Einheit<br>
        <strong>Ziel-Gewinnmarge:</strong> 30%<br>
        <strong>Break-Even Preis:</strong> (€25 + €10) / (1 - 0.30) = <strong style="color: #D4AF37;">€50,00</strong></p>
      </div>
    </div>

    <div class="section">
      <h2>4. 12-Monats-Projektion</h2>
      <table>
        <thead>
          <tr>
            <th>Monat</th>
            <th>Verkaufte Einheiten</th>
            <th>Umsatz (€)</th>
            <th>Kosten (€)</th>
            <th>Gewinn (€)</th>
            <th>Kumulierter ROI (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>3</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>4</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>5</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>6</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>7</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>8</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>9</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>10</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>11</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>12</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>5. Szenarien-Analyse</h2>
      <table>
        <thead>
          <tr>
            <th>Szenario</th>
            <th>Verkaufspreis</th>
            <th>Einheiten/Monat</th>
            <th>Monatlicher Gewinn</th>
            <th>ROI nach 12 Monaten</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #e8f5e9;"><td><strong>Best Case</strong></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr style="background: #fff3e0;"><td><strong>Base Case</strong></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr style="background: #ffebee;"><td><strong>Worst Case</strong></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    </div>
  `;

  return createHTMLTemplate('ROI Kalkulations-Template', content);
}

async function generatePDF5() {
  const content = `
    <h1>Amazon FBA Grundlagen</h1>
    <p>Ihr kostenloser Einsteiger-Guide zu Amazon FBA (Fulfillment by Amazon).</p>

    <div class="section">
      <h2>Kapitel 1: Was ist Amazon FBA?</h2>
      <p><strong>FBA = Fulfillment by Amazon.</strong> Du schickst deine Produkte an ein Amazon-Lager, Amazon lagert, verpackt und versendet für dich. Du konzentrierst dich auf Produkte und Marketing.</p>
      <div class="example">
        <strong>Vorteil:</strong> Amazon übernimmt Lagerung, Versand, Kundenservice und Retouren. Du sparst Zeit und profitierst von Prime-Versand, was die Buy-Box-Chance erhöht.
      </div>
    </div>

    <div class="section">
      <h2>Kapitel 2: Wie funktioniert FBA?</h2>
      <table>
        <thead>
          <tr>
            <th>Schritt</th>
            <th>Aktion</th>
            <th>Wer macht es?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Produkt sourcen & einkaufen</td><td>Du</td></tr>
          <tr><td>2</td><td>An Amazon FBA Lager senden</td><td>Du</td></tr>
          <tr><td>3</td><td>Einlagerung & Inventarverwaltung</td><td>Amazon</td></tr>
          <tr><td>4</td><td>Kunde bestellt</td><td>Automatisch</td></tr>
          <tr><td>5</td><td>Pick, Pack, Ship</td><td>Amazon</td></tr>
          <tr><td>6</td><td>Kundenservice & Retouren</td><td>Amazon</td></tr>
          <tr><td>7</td><td>Auszahlung alle 14 Tage</td><td>Amazon → Du</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 3: FBA vs. FBM Vergleich</h2>
      <table>
        <thead>
          <tr>
            <th>Kriterium</th>
            <th>FBA</th>
            <th>FBM (Selbstversand)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Lagerung</td><td>Amazon übernimmt</td><td>Eigenes Lager</td></tr>
          <tr><td>Versand</td><td>Amazon Prime</td><td>Eigener Versand</td></tr>
          <tr><td>Kundenservice</td><td>Amazon übernimmt</td><td>Eigene Bearbeitung</td></tr>
          <tr><td>Kosten</td><td>Gebühren pro Einheit</td><td>Eigenkosten</td></tr>
          <tr><td>Buy Box Chance</td><td>Sehr hoch ✓</td><td>Mittel</td></tr>
          <tr><td>Kontrolle</td><td>Gering</td><td>Hoch</td></tr>
          <tr><td>Empfehlung</td><td><strong>Einsteiger</strong></td><td>Fortgeschrittene</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 4: Kosten & Gebühren</h2>
      <table>
        <thead>
          <tr>
            <th>Gebührenart</th>
            <th>Betrag</th>
            <th>Wann fällig?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Referral Fee</td><td>8-15% vom VK-Preis</td><td>Pro Verkauf</td></tr>
          <tr><td>FBA Fulfillment Fee</td><td>€2,50 - €8,00</td><td>Pro Sendung</td></tr>
          <tr><td>Monthly Storage</td><td>€0,75/m³ (Jan-Sep)<br>€2,40/m³ (Okt-Dez)</td><td>Monatlich</td></tr>
          <tr><td>Professional Plan</td><td>€39/Monat</td><td>Monatlich</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 5: Erste Schritte Checkliste</h2>
      <ul style="list-style: none;">
        <li><span class="checkbox"></span> Amazon Seller Central Account erstellen</li>
        <li><span class="checkbox"></span> Professional Plan wählen (€39/Monat)</li>
        <li><span class="checkbox"></span> Bankdaten hinterlegen</li>
        <li><span class="checkbox"></span> Steuernummer eingeben</li>
        <li><span class="checkbox"></span> Erstes Produkt auswählen</li>
        <li><span class="checkbox"></span> FNSKU-Labels erstellen</li>
        <li><span class="checkbox"></span> Versandplan erstellen</li>
        <li><span class="checkbox"></span> Erste Lieferung ans FBA-Lager senden</li>
      </ul>
    </div>

    <div class="section">
      <h2>Kapitel 6: Top 5 Anfängerfehler</h2>
      <ol>
        <li><strong>Zu viel Inventar auf einmal</strong><br>
        Fehler: 1.000 Einheiten bestellen bevor das Produkt getestet wurde.<br>
        Lösung: Erst mit 100-200 Einheiten starten und testen.</li>

        <li><strong>PPC vernachlässigt</strong><br>
        Fehler: Darauf hoffen, dass Kunden das Produkt organisch finden.<br>
        Lösung: Von Tag 1 an Werbung schalten (min. €20/Tag Budget).</li>

        <li><strong>Reviews ignoriert</strong><br>
        Fehler: Keine Strategie für erste Bewertungen.<br>
        Lösung: Vine-Programm nutzen, Follow-Up-Emails senden.</li>

        <li><strong>Saisonalität nicht bedacht</strong><br>
        Fehler: Winterprodukt im Sommer launchen.<br>
        Lösung: Immer Jahreskalender und Google Trends prüfen.</li>

        <li><strong>Gebühren unterschätzt</strong><br>
        Fehler: Nur auf Einkaufspreis schauen, Gebühren vergessen.<br>
        Lösung: Immer Amazon FBA Calculator nutzen!</li>
      </ol>
    </div>
  `;

  return createHTMLTemplate('Amazon FBA Grundlagen', content);
}

async function generatePDF6() {
  const content = `
    <h1>Marketplace Starter Guide</h1>
    <p>Umfassender Vergleich der 3 großen DACH-Marktplätze: Amazon, eBay, Kaufland.</p>

    <div class="section">
      <h2>Kapitel 1: Die 3 großen DACH Marktplätze</h2>
      <p>Amazon.de, eBay.de und Kaufland.de sind die führenden E-Commerce-Plattformen im deutschsprachigen Raum. Jede hat ihre eigenen Stärken, Zielgruppen und Gebührenmodelle.</p>
    </div>

    <div class="section">
      <h2>Kapitel 2: Großer Vergleich</h2>
      <table>
        <thead>
          <tr>
            <th>Kriterium</th>
            <th>Amazon.de</th>
            <th>eBay.de</th>
            <th>Kaufland.de</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monatliche Besucher</td><td>500 Mio</td><td>120 Mio</td><td>40 Mio</td></tr>
          <tr><td>Verkäufer</td><td>700.000+</td><td>150.000+</td><td>50.000+</td></tr>
          <tr><td>Käufervertrauen</td><td>Sehr hoch ✓✓✓</td><td>Hoch ✓✓</td><td>Mittel ✓</td></tr>
          <tr><td>Gebühren</td><td>8-15% + €39/Mon</td><td>5-10% + Listing</td><td>5-16% + €39/Mon</td></tr>
          <tr><td>Fulfillment</td><td>FBA verfügbar ✓</td><td>eBay-Versand</td><td>Kaufland Fulfill.</td></tr>
          <tr><td>Prime/Plus</td><td>Amazon Prime ✓</td><td>eBay Plus ✓</td><td>Nein</td></tr>
          <tr><td>Rücksendequote</td><td>Hoch</td><td>Mittel</td><td>Niedrig</td></tr>
          <tr><td><strong>Ideal für</strong></td><td><strong>Neue Produkte</strong></td><td><strong>Gebraucht</strong></td><td><strong>Alternativen</strong></td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 3: Gebührenvergleich Detail</h2>
      <table>
        <thead>
          <tr>
            <th>Kategorie</th>
            <th>Amazon</th>
            <th>eBay</th>
            <th>Kaufland</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Elektronik</td><td>8%</td><td>5-9%</td><td>8%</td></tr>
          <tr><td>Bekleidung</td><td>15%</td><td>10%</td><td>16%</td></tr>
          <tr><td>Haushalt</td><td>12%</td><td>8%</td><td>12%</td></tr>
          <tr><td>Spielzeug</td><td>15%</td><td>10%</td><td>15%</td></tr>
          <tr><td>Bücher</td><td>15%</td><td>8%</td><td>12%</td></tr>
          <tr><td>Sport</td><td>12%</td><td>9%</td><td>12%</td></tr>
        </tbody>
      </table>
      <p style="margin-top: 15px;"><strong>Hinweis:</strong> Alle Gebühren zzgl. monatlicher Grundgebühr (Amazon/Kaufland: €39, eBay: variabel).</p>
    </div>

    <div class="section">
      <h2>Kapitel 4: Welcher Marktplatz für welches Produkt?</h2>
      <table>
        <thead>
          <tr>
            <th>Produkttyp</th>
            <th>Empfehlung</th>
            <th>Begründung</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Neue Markenprodukte</td><td><strong>Amazon</strong></td><td>Höchste Reichweite, Prime-Vorteil</td></tr>
          <tr><td>Gebraucht/Vintage</td><td><strong>eBay</strong></td><td>Spezielle Käuferschaft, Auktionen</td></tr>
          <tr><td>Preissensitive Produkte</td><td><strong>Kaufland</strong></td><td>Weniger Wettbewerb, günstig positioniert</td></tr>
          <tr><td>Nischenprodukte</td><td><strong>Alle 3</strong></td><td>Multi-Channel maximiert Reichweite</td></tr>
          <tr><td>B-Ware/Retouren</td><td><strong>eBay</strong></td><td>Käufer erwarten Rabatte</td></tr>
          <tr><td>Lebensmittel</td><td><strong>Kaufland</strong></td><td>Expertise im Food-Bereich</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Kapitel 5: Multi-Channel Setup Guide</h2>
      <p><strong>Empfohlene Strategie (Schritt-für-Schritt):</strong></p>
      <ol>
        <li><strong>Monat 1-3: Amazon etablieren</strong><br>
        Starten Sie mit Amazon, da hier die höchste Reichweite und das beste Fulfillment (FBA) verfügbar ist. Optimieren Sie Listings, sammeln Sie erste Reviews.</li>

        <li><strong>Monat 4-6: eBay parallel</strong><br>
        Erweitern Sie auf eBay, insbesondere für B-Ware, Restposten oder gebrauchte Artikel. Nutzen Sie eBay Plus für schnelleren Versand.</li>

        <li><strong>Monat 7-9: Kaufland hinzufügen</strong><br>
        Fügen Sie Kaufland als dritten Kanal hinzu, vor allem wenn Sie preissensitive Käufer ansprechen möchten.</li>

        <li><strong>Monat 10-12: Automatisierung</strong><br>
        Implementieren Sie Multi-Channel-Tools wie Billbee, Plentymarkets oder JTL für zentrale Verwaltung von Inventar, Bestellungen und Versand.</li>
      </ol>
    </div>

    <div class="section">
      <h2>Kapitel 6: 90-Tage Starter-Plan</h2>
      <table>
        <thead>
          <tr>
            <th>Zeitraum</th>
            <th>Aufgabe</th>
            <th>Ziel</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Tag 1-7</td><td>Accounts erstellen & Verifizierung</td><td>Alle 3 Konten aktiv</td></tr>
          <tr><td>Tag 8-14</td><td>Erstes Produkt listen (nur Amazon)</td><td>Erstes Listing live</td></tr>
          <tr><td>Tag 15-30</td><td>PPC starten & Optimieren</td><td>Erste Verkäufe</td></tr>
          <tr><td>Tag 31-60</td><td>eBay hinzufügen</td><td>2 Kanäle aktiv</td></tr>
          <tr><td>Tag 61-90</td><td>Kaufland + Automatisierung</td><td>3 Kanäle + Tools</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Empfohlene Tools</h2>
      <ul>
        <li><strong>Billbee:</strong> Multi-Channel Bestellverwaltung, ab €29/Monat</li>
        <li><strong>Plentymarkets:</strong> Enterprise-Lösung mit allen Features, ab €89/Monat</li>
        <li><strong>JTL-Wawi:</strong> Kostenlose ERP-Lösung für kleine bis mittlere Seller</li>
        <li><strong>Helium 10:</strong> Amazon-spezifisches Tool für Produktrecherche & Optimierung</li>
      </ul>
    </div>
  `;

  return createHTMLTemplate('Marketplace Starter Guide', content);
}

async function main() {
  console.log('🚀 Starting PDF generation...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const pdfs = [
    { name: 'amazon-seller-checkliste.pdf', generator: generatePDF1 },
    { name: 'produktrecherche-template.pdf', generator: generatePDF2 },
    { name: 'steuer-guide-reverse-charge.pdf', generator: generatePDF3 },
    { name: 'roi-kalkulation.pdf', generator: generatePDF4 },
    { name: 'amazon-fba-grundlagen.pdf', generator: generatePDF5 },
    { name: 'marketplace-starter-guide.pdf', generator: generatePDF6 },
  ];

  for (const pdf of pdfs) {
    try {
      console.log(`📄 Generating ${pdf.name}...`);

      const page = await browser.newPage();
      const html = await pdf.generator();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const outputPath = path.join(OUTPUT_DIR, pdf.name);
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      });

      await page.close();

      const stats = fs.statSync(outputPath);
      console.log(`   ✓ Generated ${pdf.name} (${(stats.size / 1024).toFixed(2)} KB)\n`);
    } catch (error) {
      console.error(`   ✗ Error generating ${pdf.name}:`, error);
    }
  }

  await browser.close();
  console.log('✅ All PDFs generated successfully!');
}

main().catch(console.error);
