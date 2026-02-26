import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
      line-height: 1.5;
    }

    .page {
      width: 210mm;
      min-height: 277mm;
      max-height: 277mm;
      padding: 15mm 20mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: auto;
    }

    h2 {
      font-size: 18pt;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 3px solid #D4AF37;
    }

    h3 {
      font-size: 14pt;
      color: #D4AF37;
      margin-top: 15px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 10px;
      font-size: 10pt;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
      margin: 8px 0;
    }

    li {
      margin-bottom: 6px;
      font-size: 10pt;
    }

    strong {
      color: #D4AF37;
      font-weight: bold;
    }

    .highlight-box {
      background: linear-gradient(135deg, #fffbeb 0%, #fff 100%);
      border-left: 4px solid #D4AF37;
      padding: 10px 12px;
      margin: 12px 0;
      font-size: 10pt;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9pt;
    }

    .table th,
    .table td {
      border: 2px solid #D4AF37;
      padding: 8px;
      text-align: left;
    }

    .table th {
      background: #D4AF37;
      color: white;
      font-weight: bold;
    }

    .table tr:nth-child(even) {
      background: #fffbeb;
    }

    /* Title Page Specific */
    .title-page {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .title-page .logo {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      border-radius: 50%;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32pt;
      font-weight: bold;
    }

    .title-page h1 {
      font-size: 28pt;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-page .subtitle {
      font-size: 16pt;
      color: #ccc;
      margin-bottom: 30px;
    }

    .title-page .year {
      font-size: 42pt;
      color: #D4AF37;
      font-weight: bold;
    }
  </style>
</head>
<body>

<!-- SEITE 1: TITELSEITE -->
<div class="page title-page">
  <div class="logo">ER</div>
  <h1>Partner-Handbuch</h1>
  <div class="subtitle">Ihr Weg zum passiven Einkommen<br/>als Affiliate-Partner</div>
  <div class="year">2026</div>
</div>

<!-- SEITE 2: WILLKOMMEN & ÜBERSICHT -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 2</span>
  </div>

  <h2>Willkommen bei E-Commerce Rente</h2>

  <h3>Was ist E-Commerce Rente?</h3>
  <p>E-Commerce Rente ist Deutschlands führende Plattform für <strong>kuratierte Amazon-Warenpakete</strong>, die Gewerbetreibenden im DACH-Raum den direkten Einstieg in den profitablen E-Commerce-Handel ermöglichen.</p>

  <div class="highlight-box">
    <strong>Unser Geschäftsmodell:</strong> Fertige Warenpakete ab <strong>€5.000</strong> mit bewährten Produkten. Kunden profitieren von bis zu <strong>20% ROI</strong> in 60-90 Tagen ohne eigenes Sourcing oder Listing-Aufwand.
  </div>

  <h3>Warum als Partner mitmachen?</h3>
  <ul>
    <li><strong>Attraktive Provisionen:</strong> Bis zu 5% auf direkte Verkäufe (€250-€500 pro Vermittlung)</li>
    <li><strong>Passives Einkommen:</strong> 3-Ebenen-System generiert wiederkehrende Einnahmen</li>
    <li><strong>B2B-Qualität:</strong> Seriöses Geschäftsmodell für Unternehmer-Netzwerke</li>
    <li><strong>Wachstumsmarkt:</strong> E-Commerce boomt – steigende Nachfrage garantiert</li>
    <li><strong>Keine Vorkenntnisse:</strong> Wir liefern alle Werbemittel und Support</li>
  </ul>

  <h3>Das 3-Ebenen Affiliate-System</h3>
  <p>Unser Provisionssystem belohnt nicht nur direkte Verkäufe, sondern auch Ihr Netzwerk:</p>
  <ul>
    <li><strong>Ebene 1 (5%):</strong> Provisionen auf Ihre direkten Kundenempfehlungen</li>
    <li><strong>Ebene 2 (2%):</strong> Provisionen auf Verkäufe Ihrer geworbenen Partner</li>
    <li><strong>Ebene 3 (1%):</strong> Provisionen auf Verkäufe von deren Partnern</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 3: PROVISIONSSYSTEM -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 3</span>
  </div>

  <h2>Das 3-Ebenen Provisionssystem</h2>

  <table class="table">
    <thead>
      <tr>
        <th>Ebene</th>
        <th>Provision</th>
        <th>Beschreibung</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Ebene 1</strong></td>
        <td><strong>5%</strong></td>
        <td>Ihre direkten Kundenempfehlungen</td>
      </tr>
      <tr>
        <td><strong>Ebene 2</strong></td>
        <td><strong>2%</strong></td>
        <td>Verkäufe Ihrer geworbenen Partner</td>
      </tr>
      <tr>
        <td><strong>Ebene 3</strong></td>
        <td><strong>1%</strong></td>
        <td>Verkäufe von deren Partnern</td>
      </tr>
    </tbody>
  </table>

  <h3>Rechenbeispiel</h3>
  <div class="highlight-box">
    <p><strong>Szenario:</strong> 3 Kunden mit je €10.000 Paket-Käufen:</p>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;"><strong>Ebene 1 (direkt):</strong> 3 × €10.000 × 5% = <strong>€1.500</strong></li>
    </ul>
    <p style="margin-top: 10px;"><strong>Diese 3 Kunden werden Partner und vermitteln je 2 weitere:</strong></p>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;"><strong>Ebene 2:</strong> 6 × €10.000 × 2% = <strong>€1.200</strong></li>
    </ul>
    <p style="margin-top: 10px;"><strong>Diese 6 Partner vermitteln je 1 weiteren:</strong></p>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;"><strong>Ebene 3:</strong> 6 × €10.000 × 1% = <strong>€600</strong></li>
    </ul>
    <p style="margin-top: 12px; font-size: 12pt;"><strong>Gesamtprovision: €3.300</strong></p>
  </div>

  <h3>Auszahlungsbedingungen</h3>
  <ul>
    <li><strong>Auszahlungsrhythmus:</strong> Monatlich zum 15. des Folgemonats</li>
    <li><strong>Mindestbetrag:</strong> €100 (kleinere Beträge werden vorgetragen)</li>
    <li><strong>Zahlungsmethode:</strong> Banküberweisung (SEPA)</li>
    <li><strong>Tracking:</strong> Echtzeit-Übersicht im Partner-Dashboard</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 4: ERSTE SCHRITTE -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 4</span>
  </div>

  <h2>Erste Schritte: Ihr Start als Partner</h2>

  <div class="highlight-box" style="margin-bottom: 12px;">
    <strong>Schritt 1: Registrierung & Account erstellen</strong>
    <p style="margin-top: 6px;">Besuchen Sie <strong>ecommercerente.com/partner</strong> und registrieren Sie sich mit Ihren Kontaktdaten. Nach Verifizierung erhalten Sie sofort Zugang zum Partner-Dashboard.</p>
  </div>

  <div class="highlight-box" style="margin-bottom: 12px;">
    <strong>Schritt 2: Persönlichen Affiliate-Link generieren</strong>
    <p style="margin-top: 6px;">Im Dashboard finden Sie Ihren individuellen Tracking-Link. Dieser Link wird automatisch Ihrem Account zugeordnet.</p>
  </div>

  <div class="highlight-box" style="margin-bottom: 12px;">
    <strong>Schritt 3: Erste 3 Partner gewinnen</strong>
    <p style="margin-top: 6px;">Starten Sie mit Ihrem persönlichen Netzwerk: Sprechen Sie Unternehmer-Kontakte an, nutzen Sie LinkedIn oder empfehlen Sie E-Commerce Rente bei Business-Events.</p>
  </div>

  <div class="highlight-box" style="margin-bottom: 12px;">
    <strong>Schritt 4: Provisionen tracken im Dashboard</strong>
    <p style="margin-top: 6px;">Verfolgen Sie Ihre Verkäufe, Provisionen und Netzwerk-Aktivitäten in Echtzeit. Das Dashboard zeigt alle 3 Ebenen übersichtlich an.</p>
  </div>

  <div class="highlight-box" style="margin-bottom: 12px;">
    <strong>Schritt 5: Auszahlung beantragen</strong>
    <p style="margin-top: 6px;">Ab €100 Guthaben können Sie monatlich eine Auszahlung beantragen. Die Überweisung erfolgt innerhalb von 5-7 Werktagen.</p>
  </div>

  <h3>Schnellstart-Tipps für die ersten 30 Tage</h3>
  <ul>
    <li>Laden Sie alle <strong>Werbemittel</strong> aus dem Dashboard herunter</li>
    <li>Erstellen Sie einen <strong>LinkedIn-Post</strong> über Ihre neue Partnerschaft</li>
    <li>Kontaktieren Sie <strong>5 Unternehmer</strong> aus Ihrem Netzwerk</li>
    <li>Setzen Sie sich ein Ziel: <strong>3 Vermittlungen im ersten Monat</strong></li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 5: ZIELGRUPPE -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 5</span>
  </div>

  <h2>Zielgruppe: Wer kauft unsere Warenpakete?</h2>

  <h3>Der ideale Kunde</h3>
  <div class="highlight-box">
    <strong>Perfektes Profil:</strong>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;"><strong>Status:</strong> Gewerbetreibende, Unternehmer, Selbstständige (mit Gewerbeschein)</li>
      <li style="margin-bottom: 6px;"><strong>Region:</strong> Deutschland, Österreich, Schweiz (DACH-Raum)</li>
      <li style="margin-bottom: 6px;"><strong>Budget:</strong> Mindestens €5.000 verfügbar</li>
      <li style="margin-bottom: 6px;"><strong>Motivation:</strong> Passives Einkommen, zweites Standbein</li>
      <li style="margin-bottom: 6px;"><strong>Zeitbudget:</strong> Ab 2 Stunden/Woche</li>
    </ul>
  </div>

  <h3>Branchen mit hohem Interesse</h3>
  <ul>
    <li><strong>Retail & Einzelhandel:</strong> Ladenbesitzer suchen Online-Zusatzgeschäft</li>
    <li><strong>Dienstleister:</strong> Berater, Coaches wollen passive Einkommensquellen</li>
    <li><strong>IT & Freelancer:</strong> Technisch versierte Selbstständige</li>
    <li><strong>Immobilien:</strong> Makler mit Unternehmerkontakten</li>
    <li><strong>Handwerk:</strong> Betriebe mit Kapital für Diversifizierung</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 6: MOTIVATIONEN & WERBEMITTEL INTRO -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 6</span>
  </div>

  <h2>Kundenmotivationen & Ausschlusskriterien</h2>

  <h3>Typische Kundenmotivationen</h3>
  <p><strong>"Ich will ein zweites Standbein aufbauen"</strong><br/>
  Unternehmer, die Risiken diversifizieren möchten.</p>

  <p><strong>"Ich habe Kapital, aber keine Zeit"</strong><br/>
  Vielbeschäftigte Selbstständige für passive Investitionen.</p>

  <p><strong>"E-Commerce Einstieg ohne Vorkenntnisse"</strong><br/>
  Quereinsteiger bevorzugen betreuten Einstieg.</p>

  <h3>❌ Nicht geeignet für</h3>
  <ul>
    <li>Privatpersonen ohne Gewerbeschein (B2B-Pflicht!)</li>
    <li>Personen unter 18 Jahren</li>
    <li>Käufer ohne verfügbares Kapital (Mindestens €5.000)</li>
    <li>Kurzfristige "Schnell-reich-werden"-Mentalität</li>
  </ul>

  <div class="highlight-box">
    <strong>Wichtig:</strong> Überprüfen Sie immer den Gewerbeschein! Nur B2B-Verkäufe sind erlaubt.
  </div>

  <h3>Marketing-Kanäle Übersicht</h3>
  <p>Im Partner-Dashboard stehen Ihnen professionelle Werbemittel zur Verfügung:</p>
  <ul>
    <li>Social-Media-Banner (Instagram, LinkedIn, Facebook)</li>
    <li>E-Mail-Vorlagen für Erstkontakt und Follow-ups</li>
    <li>PowerPoint-Präsentationen</li>
    <li>Landingpage-Texte</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 7: WERBEMITTEL & KANÄLE -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 7</span>
  </div>

  <h2>Werbemittel & Marketing-Kanäle</h2>

  <h3>📱 LinkedIn (Top-Kanal für B2B)</h3>
  <ul>
    <li><strong>Posts:</strong> "5 Wege zu passivem Einkommen im E-Commerce"</li>
    <li><strong>Artikel:</strong> Expertise zu Amazon FBA, Warenhandel zeigen</li>
    <li><strong>Direktnachrichten:</strong> Persönliche Ansprache bei relevanten Kontakten</li>
  </ul>

  <h3>📸 Instagram / Facebook</h3>
  <ul>
    <li><strong>Erfolgsgeschichten:</strong> Partner-Erfolge teilen (anonymisiert)</li>
    <li><strong>Stories:</strong> Kurze Tipps zu E-Commerce & passivem Einkommen</li>
    <li><strong>Reels:</strong> "So verdiene ich mit Amazon ohne eigene Produkte"</li>
  </ul>

  <h3>✉️ E-Mail-Marketing</h3>
  <ul>
    <li><strong>Newsletter:</strong> Regelmäßige Updates an Unternehmer-Kontakte</li>
    <li><strong>Persönliche Mails:</strong> Individuelle Empfehlung mit Mehrwert</li>
  </ul>

  <h3>🤝 Persönliches Netzwerk</h3>
  <ul>
    <li><strong>IHK-Veranstaltungen:</strong> Networking bei Unternehmer-Events</li>
    <li><strong>Business-Frühstücke:</strong> Lokale Unternehmerkreise nutzen</li>
  </ul>

  <h3>🎥 YouTube / Podcast</h3>
  <ul>
    <li><strong>Interviews:</strong> Gespräche mit E-Commerce-Unternehmern</li>
    <li><strong>Tutorials:</strong> "Amazon FBA für Anfänger"</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 8: MUSTERGESPRÄCH -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 8</span>
  </div>

  <h2>Mustergespräch & Einwandbehandlung</h2>

  <h3>🎯 Gesprächseinstieg</h3>
  <div class="highlight-box">
    <p><strong>"Hi [Name], ich habe eine interessante Möglichkeit entdeckt..."</strong></p>
    <p>"Du bist Unternehmer und suchst neue Einkommensquellen? E-Commerce Rente – fertige Amazon-Pakete ab €5.000, sofort verkaufbar. Bis zu 20% ROI in 90 Tagen, nebenberuflich machbar. Interesse?"</p>
  </div>

  <h3>❌ Einwand: "Das ist mir zu teuer"</h3>
  <div class="highlight-box">
    <p><strong>Antwort:</strong> "Bei €10.000 und 20% ROI hast du nach 90 Tagen €2.000 Gewinn. Das sind €666/Monat passiv. Wie viel Zeit bräuchtest du, um mit deiner Arbeit €2.000 extra zu verdienen?"</p>
  </div>

  <h3>❌ Einwand: "Ich habe keine Zeit"</h3>
  <div class="highlight-box">
    <p><strong>Antwort:</strong> "Genau dafür ist E-Commerce Rente gemacht! Nur 2 Stunden/Woche. Produkte sind recherchiert, Listings vorbereitet. Du bestellst, stellst online, fertig."</p>
  </div>

  <h3>❌ Einwand: "Das klingt zu riskant"</h3>
  <div class="highlight-box">
    <p><strong>Antwort:</strong> "Geprüfte Markenprodukte mit Verkaufshistorie. Kein China-Schrott. Amazon übernimmt Versand und Service. Risiko minimal – vor allem im Vergleich zu 'blind sourcen'."</p>
  </div>

  <h3>❌ Einwand: "Was ist Amazon?"</h3>
  <div class="highlight-box">
    <p><strong>Antwort:</strong> "Größter Online-Marktplatz weltweit. Du stellst Produkte rein, Amazon kümmert sich um Lagerung und Versand. E-Commerce Rente liefert die richtigen Produkte."</p>
  </div>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 9: ERFOLGSBEISPIELE -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 9</span>
  </div>

  <h2>Abschluss & Erfolgsbeispiele</h2>

  <h3>✅ Closing: Zum Erstgespräch führen</h3>
  <div class="highlight-box">
    <p><strong>Abschluss:</strong> "Buche dir einen 30-Minuten-Call mit dem Team. Die erklären dir alles, zeigen echte Zahlen. Kostet nichts. Hier der Link: <strong>ecommercerente.com/erstgespraech</strong>"</p>
  </div>

  <h3>📊 Partner Beispiel 1: Der Schnellstarter</h3>
  <div class="highlight-box">
    <p><strong>Profil:</strong> M. Schmidtner, IT-Freelancer</p>
    <p><strong>Strategie:</strong> LinkedIn-Posts 3x/Woche</p>
    <p><strong>Ergebnis nach 2 Monaten:</strong> 3 Kunden, €1.500 Provision</p>
  </div>

  <h3>📊 Partner Beispiel 2: Der Netzwerker</h3>
  <div class="highlight-box">
    <p><strong>Profil:</strong> S. Webermann, Immobilienmakler</p>
    <p><strong>Strategie:</strong> IHK-Events, Unternehmer-Frühstücke</p>
    <p><strong>Ergebnis nach 6 Monaten:</strong> 12 Partner, €2.400/Monat passiv</p>
  </div>

  <h3>📊 Partner Beispiel 3: Die Content-Strategin</h3>
  <div class="highlight-box">
    <p><strong>Profil:</strong> J. Moller, Business Coach</p>
    <p><strong>Strategie:</strong> YouTube + E-Mail-Funnel</p>
    <p><strong>Ergebnis nach 4 Monaten:</strong> 8 Leads/Monat, €2.000+ Provision</p>
  </div>

  <h3>📈 Durchschnittliche Zahlen</h3>
  <ul>
    <li><strong>Provision pro Vermittlung:</strong> €250-€500</li>
    <li><strong>Erste 90 Tage:</strong> 2-3 Vermittlungen = €500-€1.500</li>
    <li><strong>Top 10% Partner:</strong> €1.000-€5.000/Monat</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 10: RECHTLICHES -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 10</span>
  </div>

  <h2>Rechtliches & Compliance</h2>

  <h3>⚖️ Wichtige Regelungen</h3>

  <div class="highlight-box">
    <strong>1. Nur B2B-Kunden vermitteln</strong>
    <p>E-Commerce Rente ist ausschließlich für Gewerbetreibende. Überprüfen Sie immer den Gewerbeschein.</p>
  </div>

  <div class="highlight-box">
    <strong>2. Keine falschen Versprechen</strong>
    <p>Kommunizieren Sie realistisch:</p>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;">✅ "Bis zu 20% ROI sind möglich – abhängig von Marktsituation"</li>
      <li style="margin-bottom: 6px;">❌ "Du verdienst garantiert 20% ROI"</li>
    </ul>
  </div>

  <div class="highlight-box">
    <strong>3. DSGVO-Konformität</strong>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;">Keine unerlaubten Massen-E-Mails ohne Einwilligung</li>
      <li style="margin-bottom: 6px;">Kontaktdaten nur mit Zustimmung sammeln</li>
    </ul>
  </div>

  <div class="highlight-box">
    <strong>4. Pflichtangaben bei Werbematerial</strong>
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;">Social Media: "Werbung | Affiliate-Link" hinzufügen</li>
      <li style="margin-bottom: 6px;">E-Mails: "Partnerempfehlung" kennzeichnen</li>
    </ul>
  </div>

  <h3>📄 Vertragliche Basis</h3>
  <ul>
    <li>Provisionsanspruch bei erfolgreicher Vermittlung und Zahlungseingang</li>
    <li>Kündigung jederzeit möglich (30 Tage Frist)</li>
  </ul>

  <h3>🚫 Verbotene Praktiken</h3>
  <ul>
    <li>Spam oder aggressive Cold-Calling-Methoden</li>
    <li>Fake-Bewertungen oder manipulierte Testimonials</li>
  </ul>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

<!-- SEITE 11: CHECKLISTE & KONTAKT -->
<div class="page">
  <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #D4AF37; margin-bottom: 15px; padding-bottom: 8px;">
    <span style="color:#D4AF37; font-weight:bold;">E-Commerce Rente</span>
    <span style="color:#666;">Seite 11</span>
  </div>

  <h2>Nächste Schritte & Kontakt</h2>

  <h3>✅ Ihre Checkliste für den Start heute</h3>
  <ul style="list-style-type: none; padding-left: 0; margin: 10px 0;">
    <li style="margin-bottom: 8px; padding: 8px 12px; background: #fffbeb; border-left: 3px solid #D4AF37;">
      ✓ <strong>Account einrichten:</strong> Registrierung auf ecommercerente.com/partner abschließen
    </li>
    <li style="margin-bottom: 8px; padding: 8px 12px; background: #fffbeb; border-left: 3px solid #D4AF37;">
      ✓ <strong>Affiliate-Link kopieren:</strong> Persönlichen Tracking-Link aus Dashboard speichern
    </li>
    <li style="margin-bottom: 8px; padding: 8px 12px; background: #fffbeb; border-left: 3px solid #D4AF37;">
      ✓ <strong>Werbemittel herunterladen:</strong> Banner, Präsentationen und Texte sichern
    </li>
    <li style="margin-bottom: 8px; padding: 8px 12px; background: #fffbeb; border-left: 3px solid #D4AF37;">
      ✓ <strong>LinkedIn-Profil optimieren:</strong> Bio anpassen, ersten Post verfassen
    </li>
    <li style="margin-bottom: 8px; padding: 8px 12px; background: #fffbeb; border-left: 3px solid #D4AF37;">
      ✓ <strong>5 Kontakte ansprechen:</strong> Liste mit Interessenten erstellen
    </li>
  </ul>

  <h3>📞 Kontakt & Support</h3>
  <div class="highlight-box">
    <p><strong>Partner-Support:</strong> partner@ecommercerente.com</p>
    <p><strong>Allgemeine Anfragen:</strong> support@ecommercerente.com</p>
    <p><strong>Erstgespräch buchen:</strong> ecommercerente.com/erstgespraech</p>
    <p><strong>Antwortzeit:</strong> Innerhalb 24 Stunden (Werktage)</p>
  </div>

  <h3>🎯 Ihr Ziel für die nächsten 30 Tage</h3>
  <div class="highlight-box">
    <ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">
      <li style="margin-bottom: 6px;">3 qualifizierte Gespräche führen</li>
      <li style="margin-bottom: 6px;">1 erfolgreiche Vermittlung abschließen</li>
      <li style="margin-bottom: 6px;">10 neue LinkedIn-Kontakte knüpfen</li>
      <li style="margin-bottom: 6px;">Ersten Provisionscheck verdienen!</li>
    </ul>
  </div>

  <div style="text-align: center; margin-top: 20px; padding: 15px; background: #fffbeb; border-radius: 8px; border: 2px solid #D4AF37;">
    <p style="font-size: 14pt; font-weight: bold; color: #1a1a1a; margin-bottom: 8px;">
      Willkommen im Team!
    </p>
    <p style="font-size: 9pt; color: #666;">
      Gemeinsam bauen wir passive Einkommensströme auf.<br/>
      Viel Erfolg als E-Commerce Rente Partner!
    </p>
  </div>

  <div style="position:absolute; bottom: 10mm; left: 20mm; right: 20mm; border-top: 1px solid #eee; padding-top: 5px; font-size: 8pt; color: #999; display:flex; justify-content:space-between;">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</span>
  </div>
</div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  const outputDir = path.join(__dirname, '../../../../web/public/downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('📁 Created output directory:', outputDir);
  }

  const outputPath = path.join(outputDir, 'partner-handbuch.pdf');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('🌐 Browser launched');
  const page = await browser.newPage();

  await page.setContent(HTML_CONTENT, {
    waitUntil: 'networkidle0',
  });

  console.log('📄 HTML content loaded');

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  });

  console.log('✅ PDF generated successfully!');
  console.log('📍 Location:', outputPath);

  const stats = fs.statSync(outputPath);
  const fileSizeInKB = (stats.size / 1024).toFixed(2);

  console.log(`📊 File size: ${fileSizeInKB} KB`);

  await browser.close();
  console.log('🔒 Browser closed');

  return {
    success: true,
    path: outputPath,
    sizeKB: fileSizeInKB,
  };
}

generatePDF()
  .then((result) => {
    console.log('\n✨ SUCCESS!');
    console.log('Path:', result.path);
    console.log('Size:', result.sizeKB, 'KB');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ ERROR:', error);
    process.exit(1);
  });
