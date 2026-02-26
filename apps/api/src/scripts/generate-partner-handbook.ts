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
      line-height: 1.6;
    }

    .page {
      width: 210mm;
      height: 297mm;
      padding: 20mm;
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .header {
      position: absolute;
      top: 15mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #D4AF37;
      font-size: 10pt;
      color: #666;
    }

    .footer {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      text-align: center;
      font-size: 9pt;
      color: #999;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }

    .content {
      margin-top: 25mm;
      margin-bottom: 20mm;
    }

    /* Title Page */
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
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      border-radius: 50%;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36pt;
      font-weight: bold;
    }

    .title-page h1 {
      font-size: 32pt;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .title-page .subtitle {
      font-size: 18pt;
      color: #ccc;
      margin-bottom: 40px;
    }

    .title-page .year {
      font-size: 48pt;
      color: #D4AF37;
      font-weight: bold;
    }

    /* Content Pages */
    h2 {
      font-size: 20pt;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #D4AF37;
    }

    h3 {
      font-size: 16pt;
      color: #D4AF37;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 12px;
      text-align: justify;
    }

    ul {
      margin-left: 20px;
      margin-bottom: 15px;
    }

    li {
      margin-bottom: 8px;
    }

    .highlight-box {
      background: linear-gradient(135deg, #fffbeb 0%, #fff 100%);
      border-left: 4px solid #D4AF37;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }

    .example-box {
      background: #f8f8f8;
      border: 2px solid #D4AF37;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
    }

    .step-box {
      background: white;
      border: 2px solid #D4AF37;
      padding: 12px;
      margin: 10px 0;
      border-radius: 6px;
      font-weight: bold;
    }

    .commission-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .commission-table th,
    .commission-table td {
      border: 2px solid #D4AF37;
      padding: 12px;
      text-align: left;
    }

    .commission-table th {
      background: #D4AF37;
      color: white;
      font-weight: bold;
    }

    .commission-table tr:nth-child(even) {
      background: #fffbeb;
    }

    .checklist {
      background: #fffbeb;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid #D4AF37;
    }

    .checklist li {
      list-style: none;
      padding-left: 30px;
      position: relative;
      margin-bottom: 10px;
    }

    .checklist li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #D4AF37;
      font-weight: bold;
      font-size: 14pt;
    }

    strong {
      color: #D4AF37;
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
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 2</span>
  </div>
  <div class="content">
    <h2>Willkommen bei E-Commerce Rente</h2>

    <h3>Was ist E-Commerce Rente?</h3>
    <p>E-Commerce Rente ist Deutschlands führende Plattform für <strong>kuratierte Amazon-Warenpakete</strong>, die Gewerbetreibenden im DACH-Raum den direkten Einstieg in den profitablen E-Commerce-Handel ermöglichen.</p>

    <div class="highlight-box">
      <strong>Unser Geschäftsmodell:</strong><br/>
      Wir bieten fertige Warenpakete ab <strong>€5.000</strong> mit bewährten Produkten, die sofort auf Amazon verkauft werden können. Kunden profitieren von bis zu <strong>20% ROI</strong> in 60-90 Tagen ohne eigenes Sourcing, Produktrecherche oder Listing-Aufwand.
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

    <p>Je größer Ihr Netzwerk, desto stabiler Ihr passives Einkommen!</p>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 3: PROVISIONSSYSTEM -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 3</span>
  </div>
  <div class="content">
    <h2>Das 3-Ebenen Provisionssystem</h2>

    <table class="commission-table">
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

    <h3>Rechenbeispiel: Ihr Verdienstpotenzial</h3>

    <div class="example-box">
      <p><strong>Szenario:</strong> Sie vermitteln 3 Kunden mit je €10.000 Paket-Käufen:</p>
      <ul>
        <li><strong>Ebene 1 (direkt):</strong> 3 × €10.000 × 5% = <strong>€1.500</strong></li>
      </ul>

      <p style="margin-top: 15px;"><strong>Diese 3 Kunden werden Partner und vermitteln je 2 weitere Kunden:</strong></p>
      <ul>
        <li><strong>Ebene 2:</strong> 6 × €10.000 × 2% = <strong>€1.200</strong></li>
      </ul>

      <p style="margin-top: 15px;"><strong>Diese 6 Partner vermitteln je 1 weiteren Kunden:</strong></p>
      <ul>
        <li><strong>Ebene 3:</strong> 6 × €10.000 × 1% = <strong>€600</strong></li>
      </ul>

      <p style="margin-top: 20px; font-size: 14pt;"><strong>Gesamtprovision: €3.300</strong></p>
    </div>

    <h3>Auszahlungsbedingungen</h3>
    <ul>
      <li><strong>Auszahlungsrhythmus:</strong> Monatlich zum 15. des Folgemonats</li>
      <li><strong>Mindestbetrag:</strong> €100 (kleinere Beträge werden vorgetragen)</li>
      <li><strong>Zahlungsmethode:</strong> Banküberweisung (SEPA)</li>
      <li><strong>Tracking:</strong> Echtzeit-Übersicht im Partner-Dashboard</li>
      <li><strong>Transparenz:</strong> Detaillierte Provisionsabrechnung per E-Mail</li>
    </ul>

    <div class="highlight-box">
      <strong>Top-Partner verdienen:</strong> €1.000-€5.000/Monat durch strategischen Netzwerkaufbau!
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 4: ERSTE SCHRITTE -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 4</span>
  </div>
  <div class="content">
    <h2>Erste Schritte: Ihr Start als Partner</h2>

    <div class="step-box">
      <strong>Schritt 1: Registrierung & Account erstellen</strong>
      <p style="font-weight: normal; margin-top: 8px;">
        Besuchen Sie <strong>ecommercerente.com/partner</strong> und registrieren Sie sich mit Ihren Kontaktdaten. Nach Verifizierung erhalten Sie sofort Zugang zum Partner-Dashboard.
      </p>
    </div>

    <div class="step-box">
      <strong>Schritt 2: Persönlichen Affiliate-Link generieren</strong>
      <p style="font-weight: normal; margin-top: 8px;">
        Im Dashboard finden Sie Ihren individuellen Tracking-Link. Dieser Link wird automatisch Ihrem Account zugeordnet – alle Verkäufe werden so korrekt erfasst.
      </p>
    </div>

    <div class="step-box">
      <strong>Schritt 3: Erste 3 Partner gewinnen</strong>
      <p style="font-weight: normal; margin-top: 8px;">
        Starten Sie mit Ihrem persönlichen Netzwerk: Sprechen Sie Unternehmer-Kontakte an, nutzen Sie LinkedIn oder empfehlen Sie E-Commerce Rente bei Business-Events.
      </p>
    </div>

    <div class="step-box">
      <strong>Schritt 4: Provisionen tracken im Dashboard</strong>
      <p style="font-weight: normal; margin-top: 8px;">
        Verfolgen Sie Ihre Verkäufe, Provisionen und Netzwerk-Aktivitäten in Echtzeit. Das Dashboard zeigt alle 3 Ebenen übersichtlich an.
      </p>
    </div>

    <div class="step-box">
      <strong>Schritt 5: Auszahlung beantragen</strong>
      <p style="font-weight: normal; margin-top: 8px;">
        Ab €100 Guthaben können Sie monatlich eine Auszahlung beantragen. Die Überweisung erfolgt innerhalb von 5-7 Werktagen.
      </p>
    </div>

    <h3>Schnellstart-Tipps für die ersten 30 Tage</h3>
    <ul>
      <li>Laden Sie alle <strong>Werbemittel</strong> aus dem Dashboard herunter</li>
      <li>Erstellen Sie einen <strong>LinkedIn-Post</strong> über Ihre neue Partnerschaft</li>
      <li>Kontaktieren Sie <strong>5 Unternehmer</strong> aus Ihrem Netzwerk diese Woche</li>
      <li>Buchen Sie ein <strong>Onboarding-Gespräch</strong> mit unserem Partner-Team</li>
      <li>Setzen Sie sich ein Ziel: <strong>3 Vermittlungen im ersten Monat</strong></li>
    </ul>

    <div class="highlight-box">
      <strong>Support verfügbar:</strong> Bei Fragen erreichen Sie uns unter <strong>partner@ecommercerente.com</strong>
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 5: ZIELGRUPPE -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 5</span>
  </div>
  <div class="content">
    <h2>Zielgruppe: Wer kauft unsere Warenpakete?</h2>

    <h3>Der ideale Kunde</h3>

    <div class="highlight-box">
      <strong>Perfektes Profil für E-Commerce Rente:</strong>
      <ul>
        <li><strong>Status:</strong> Gewerbetreibende, Unternehmer, Selbstständige (mit Gewerbeschein)</li>
        <li><strong>Region:</strong> Deutschland, Österreich, Schweiz (DACH-Raum)</li>
        <li><strong>Budget:</strong> Mindestens €5.000 verfügbar für Investition</li>
        <li><strong>Motivation:</strong> Passives Einkommen aufbauen, zweites Standbein, E-Commerce-Einstieg</li>
        <li><strong>Zeitbudget:</strong> Ab 2 Stunden/Woche für nebenberufliche Umsetzung</li>
        <li><strong>Tech-Affinität:</strong> Grundkenntnisse in Online-Handel oder Lernbereitschaft</li>
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

    <h3>Typische Kundenmotivationen</h3>
    <p><strong>"Ich will ein zweites Standbein aufbauen"</strong><br/>
    Unternehmer, die Risiken diversifizieren und nicht von einem Geschäftsmodell abhängig sein möchten.</p>

    <p><strong>"Ich habe Kapital, aber keine Zeit für aufwändige Projekte"</strong><br/>
    Vielbeschäftigte Selbstständige, die passiv investieren wollen ohne operativen Aufwand.</p>

    <p><strong>"Ich will in E-Commerce einsteigen, aber weiß nicht wo ich anfangen soll"</strong><br/>
    Quereinsteiger ohne Produktkenntnisse, die einen betreuten Einstieg bevorzugen.</p>

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
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 6: WERBEMITTEL & KANÄLE -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 6</span>
  </div>
  <div class="content">
    <h2>Werbemittel & Marketing-Kanäle</h2>

    <h3>📱 LinkedIn (Top-Kanal für B2B)</h3>
    <ul>
      <li><strong>Professionelle Posts:</strong> "5 Wege zu passivem Einkommen im E-Commerce"</li>
      <li><strong>Artikel schreiben:</strong> Expertise zu Amazon FBA, Warenhandel zeigen</li>
      <li><strong>Kommentare:</strong> In Unternehmer-Gruppen aktiv sein und Mehrwert bieten</li>
      <li><strong>Direktnachrichten:</strong> Persönliche Ansprache bei relevanten Kontakten</li>
    </ul>

    <h3>📸 Instagram / Facebook</h3>
    <ul>
      <li><strong>Erfolgsgeschichten:</strong> Teilen Sie Ihre Partner-Erfolge (anonymisiert)</li>
      <li><strong>Behind-the-Scenes:</strong> Zeigen Sie Ihren Weg als Affiliate</li>
      <li><strong>Stories:</strong> Kurze Tipps zu E-Commerce & passivem Einkommen</li>
      <li><strong>Reels/Videos:</strong> "So verdiene ich mit Amazon ohne eigene Produkte"</li>
    </ul>

    <h3>✉️ E-Mail-Marketing</h3>
    <ul>
      <li><strong>Newsletter:</strong> Regelmäßige Updates an Unternehmer-Kontakte</li>
      <li><strong>Persönliche Mails:</strong> Individuelle Empfehlung mit Mehrwert</li>
      <li><strong>Case Studies:</strong> Erfolgsbeispiele als PDF versenden</li>
    </ul>

    <h3>🤝 Persönliches Netzwerk</h3>
    <ul>
      <li><strong>IHK-Veranstaltungen:</strong> Networking bei Unternehmer-Events</li>
      <li><strong>Business-Frühstücke:</strong> Lokale Unternehmerkreise nutzen</li>
      <li><strong>Messen & Konferenzen:</strong> E-Commerce & Startup-Events besuchen</li>
      <li><strong>Empfehlungen:</strong> Zufriedene Kunden bitten, Sie weiterzuempfehlen</li>
    </ul>

    <h3>🎥 YouTube / Podcast</h3>
    <ul>
      <li><strong>Interviews:</strong> Gespräche mit erfolgreichen E-Commerce-Unternehmern</li>
      <li><strong>Tutorials:</strong> "Amazon FBA für Anfänger" – E-Commerce Rente als Lösung</li>
      <li><strong>Q&A-Sessions:</strong> Fragen zu passivem Einkommen beantworten</li>
    </ul>

    <h3>🎨 Bereitgestellte Marketing-Assets</h3>
    <p>Im Partner-Dashboard finden Sie:</p>
    <ul>
      <li>Social-Media-Banner (Instagram, LinkedIn, Facebook)</li>
      <li>E-Mail-Vorlagen für Erstkontakt und Follow-ups</li>
      <li>PowerPoint-Präsentation für Erstgespräche</li>
      <li>Landingpage-Texte und Produktbeschreibungen</li>
      <li>Logo-Dateien und Branding-Richtlinien</li>
    </ul>

    <div class="highlight-box">
      <strong>Best Practice:</strong> Multi-Channel-Strategie! Kombinieren Sie LinkedIn (Hauptkanal), E-Mail und persönliche Events für maximale Reichweite.
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 7: MUSTERGESPRÄCH -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 7</span>
  </div>
  <div class="content">
    <h2>Mustergespräch & Einwandbehandlung</h2>

    <h3>🎯 Gesprächseinstieg</h3>
    <div class="example-box">
      <p><strong>"Hi [Name], ich habe eine interessante Möglichkeit für dich entdeckt..."</strong></p>
      <p>"Du bist doch Unternehmer und suchst immer nach neuen Einkommensquellen, oder? Ich bin gerade auf E-Commerce Rente gestoßen – fertige Amazon-Warenpakete ab €5.000, die man sofort verkaufen kann. Bis zu 20% ROI in 90 Tagen, nebenberuflich machbar. Interesse, dass ich dir mehr erzähle?"</p>
    </div>

    <h3>❌ Einwand: "Das ist mir zu teuer"</h3>
    <div class="example-box">
      <p><strong>Antwort:</strong> "Verstehe ich. Lass uns die Rechnung anschauen: Bei einem €10.000-Paket und 20% ROI hast du nach 90 Tagen €2.000 Gewinn. Das sind €666/Monat zusätzlich – passiv, ohne Zeitaufwand. Wie viel Zeit würdest du brauchen, um mit deiner aktuellen Arbeit €2.000 extra zu verdienen?"</p>
    </div>

    <h3>❌ Einwand: "Ich habe keine Zeit dafür"</h3>
    <div class="example-box">
      <p><strong>Antwort:</strong> "Genau dafür ist E-Commerce Rente gemacht! Du brauchst nur 2 Stunden pro Woche. Die Produkte sind fertig recherchiert, die Listings vorbereitet. Du bestellst das Paket, stellst es online, fertig. Der Verkauf läuft automatisch über Amazon. Weniger Zeitaufwand geht kaum."</p>
    </div>

    <h3>❌ Einwand: "Das klingt zu riskant"</h3>
    <div class="example-box">
      <p><strong>Antwort:</strong> "Ich verstehe die Skepsis. Aber hier sind Fakten: Es sind geprüfte Markenprodukte mit nachweislicher Verkaufshistorie. Kein China-Schrott. Amazon übernimmt Versand und Kundenservice. Das Risiko ist minimal – vor allem im Vergleich zu 'blind' Produkte zu sourcen und zu hoffen, dass sie sich verkaufen."</p>
    </div>

    <h3>❌ Einwand: "Was ist Amazon überhaupt?"</h3>
    <div class="example-box">
      <p><strong>Antwort:</strong> "Amazon ist der größte Online-Marktplatz weltweit – wie ein riesiges Kaufhaus im Internet. Du stellst dort Produkte rein, Amazon kümmert sich um Lagerung, Versand und Retouren. Du verdienst an jedem Verkauf. E-Commerce Rente liefert dir die richtigen Produkte, damit du sofort loslegen kannst."</p>
    </div>

    <h3>✅ Abschluss: Zum Erstgespräch führen</h3>
    <div class="example-box">
      <p><strong>Closing:</strong> "Lass uns das vertiefen. Buche dir einfach einen 30-Minuten-Call mit dem Team von E-Commerce Rente. Die erklären dir alles im Detail, zeigen dir echte Zahlen und beantworten alle Fragen. Kostet dich nichts. Hier ist der Link: <strong>ecommercerente.com/erstgespraech</strong>"</p>
    </div>

    <div class="highlight-box">
      <strong>Pro-Tipp:</strong> Drängen Sie niemanden! Qualifizierte Leads sind wichtiger als Masse. Ein begeisterter Kunde ist mehr wert als zehn uninteressierte.
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 8: ERFOLGSBEISPIELE -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 8</span>
  </div>
  <div class="content">
    <h2>Erfolgsbeispiele & Zahlen</h2>

    <h3>📊 Partner Beispiel 1: Der Schnellstarter</h3>
    <div class="example-box">
      <p><strong>Profil:</strong> M. Schmidtner, IT-Freelancer, 34 Jahre</p>
      <p><strong>Strategie:</strong> LinkedIn-Posts über passives Einkommen, 3x/Woche</p>
      <p><strong>Ergebnis nach 2 Monaten:</strong></p>
      <ul>
        <li>3 direkte Kunden vermittelt (€10.000-Pakete)</li>
        <li>Provision: 3 × €500 = <strong>€1.500</strong></li>
        <li>Zeitaufwand: 5 Stunden/Woche (Content + Gespräche)</li>
      </ul>
      <p><strong>Learnings:</strong> "LinkedIn ist Gold für B2B. Ich poste authentisch über meinen Weg, das zieht die richtigen Leute an."</p>
    </div>

    <h3>📊 Partner Beispiel 2: Der Netzwerker</h3>
    <div class="example-box">
      <p><strong>Profil:</strong> S. Webermann, Immobilienmakler, 41 Jahre</p>
      <p><strong>Strategie:</strong> IHK-Events, Unternehmer-Frühstücke, persönliche Empfehlungen</p>
      <p><strong>Ergebnis nach 6 Monaten:</strong></p>
      <ul>
        <li>Netzwerk von 12 aktiven Partnern aufgebaut</li>
        <li>Monatliche passive Provision: <strong>€2.400</strong> (aus allen 3 Ebenen)</li>
        <li>Zeitaufwand: 3 Stunden/Woche (Betreuung + neue Kontakte)</li>
      </ul>
      <p><strong>Learnings:</strong> "Mein Immobilien-Netzwerk war der Schlüssel. Jeder Unternehmer sucht passive Investments."</p>
    </div>

    <h3>📊 Partner Beispiel 3: Die Content-Strategin</h3>
    <div class="example-box">
      <p><strong>Profil:</strong> J. Moller, Business Coach, 38 Jahre</p>
      <p><strong>Strategie:</strong> YouTube-Kanal zu "Passives Einkommen", E-Mail-Funnel</p>
      <p><strong>Ergebnis nach 4 Monaten:</strong></p>
      <ul>
        <li>8 qualifizierte Leads pro Monat über YouTube</li>
        <li>Conversion-Rate: 50% → 4 Kunden/Monat</li>
        <li>Monatliche Provision: <strong>€2.000+</strong></li>
      </ul>
      <p><strong>Learnings:</strong> "Content arbeitet 24/7 für mich. Einmal Videos produziert, laufen sie automatisch."</p>
    </div>

    <h3>📈 Durchschnittliche Zahlen (alle Partner)</h3>
    <ul>
      <li><strong>Provision pro Vermittlung:</strong> €250-€500 (abhängig von Paketgröße)</li>
      <li><strong>Durchschnitt erste 90 Tage:</strong> 2-3 Vermittlungen = €500-€1.500</li>
      <li><strong>Top 10% Partner:</strong> €1.000-€5.000/Monat nach 6-12 Monaten</li>
      <li><strong>Conversion-Rate Erstgespräch:</strong> ~40% (wenn gut qualifiziert)</li>
    </ul>

    <div class="highlight-box">
      <strong>Realistische Erwartung:</strong> Die meisten Partner verdienen im ersten Jahr €500-€2.000/Monat. Top-Performer mit strategischem Netzwerkaufbau erreichen €3.000-€5.000/Monat.
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 9: RECHTLICHES -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 9</span>
  </div>
  <div class="content">
    <h2>Rechtliches & Compliance</h2>

    <h3>⚖️ Wichtige Regelungen für Partner</h3>

    <div class="highlight-box">
      <strong>1. Nur B2B-Kunden vermitteln</strong>
      <p>E-Commerce Rente ist ausschließlich für <strong>Gewerbetreibende</strong> konzipiert. Überprüfen Sie immer den Gewerbeschein Ihrer Empfehlungen. Privatpersonen dürfen keine Warenpakete kaufen.</p>
    </div>

    <div class="highlight-box">
      <strong>2. Keine falschen Versprechen</strong>
      <p>Kommunizieren Sie <strong>realistisch</strong>:</p>
      <ul>
        <li>❌ "Du verdienst garantiert 20% ROI"</li>
        <li>✅ "Bis zu 20% ROI sind möglich – abhängig von Marktsituation und Aufwand"</li>
        <li>❌ "Das ist völlig risikofrei"</li>
        <li>✅ "Das Risiko ist minimiert durch geprüfte Produkte, aber Restrisiko bleibt"</li>
      </ul>
    </div>

    <div class="highlight-box">
      <strong>3. DSGVO-Konformität</strong>
      <p>Beachten Sie Datenschutz:</p>
      <ul>
        <li>Keine unerlaubten Massen-E-Mails ohne Einwilligung</li>
        <li>Kontaktdaten nur mit Zustimmung sammeln</li>
        <li>Partner-Dashboard nutzt verschlüsselte Datenübertragung</li>
      </ul>
    </div>

    <div class="highlight-box">
      <strong>4. Pflichtangaben bei Werbematerial</strong>
      <p>Kennzeichnen Sie Affiliate-Links:</p>
      <ul>
        <li>Social Media Posts: "Werbung | Affiliate-Link" hinzufügen</li>
        <li>E-Mails: "Dieser Link enthält eine Partnerempfehlung" vermerken</li>
        <li>Website/Blog: "Transparenzhinweis: Dies ist ein Affiliate-Link"</li>
      </ul>
    </div>

    <h3>📄 Vertragliche Basis</h3>
    <p>Ihre Partnerschaft basiert auf der <strong>Affiliate-Vereinbarung mit Commercehelden GmbH</strong>, die Sie bei Registrierung akzeptiert haben. Wichtigste Punkte:</p>
    <ul>
      <li>Provisionsanspruch entsteht bei erfolgreicher Vermittlung und Zahlungseingang</li>
      <li>Kündigung jederzeit möglich (beidseitig mit 30 Tagen Frist)</li>
      <li>Ausstehende Provisionen werden bei Kündigung ausgezahlt</li>
      <li>Wettbewerbsverbot während aktiver Partnerschaft für identische Geschäftsmodelle</li>
    </ul>

    <h3>🚫 Verbotene Praktiken</h3>
    <ul>
      <li>Spam oder aggressive Cold-Calling-Methoden</li>
      <li>Fake-Bewertungen oder manipulierte Testimonials</li>
      <li>Irreführende Werbung (z.B. "Geld-zurück-Garantie" ohne Grundlage)</li>
      <li>Verwendung von E-Commerce Rente Markenrechten ohne Genehmigung</li>
    </ul>

    <div class="highlight-box">
      <strong>Support & Compliance-Fragen:</strong><br/>
      Bei Unsicherheiten wenden Sie sich an: <strong>partner@ecommercerente.com</strong>
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 10: NÄCHSTE SCHRITTE -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 10</span>
  </div>
  <div class="content">
    <h2>Nächste Schritte & Kontakt</h2>

    <h3>✅ Ihre Checkliste für den Start heute</h3>

    <div class="checklist">
      <ul>
        <li><strong>Account einrichten:</strong> Registrierung auf ecommercerente.com/partner abschließen</li>
        <li><strong>Affiliate-Link kopieren:</strong> Persönlichen Tracking-Link aus Dashboard speichern</li>
        <li><strong>Werbemittel herunterladen:</strong> Banner, Präsentationen und Texte sichern</li>
        <li><strong>LinkedIn-Profil optimieren:</strong> Bio anpassen, ersten Post über E-Commerce verfassen</li>
        <li><strong>5 Kontakte ansprechen:</strong> Liste mit potenziellen Interessenten erstellen</li>
      </ul>
    </div>

    <h3>📞 Kontakt & Support</h3>
    <div class="example-box">
      <p><strong>E-Mail (Partner-Support):</strong><br/>
      partner@ecommercerente.com</p>

      <p style="margin-top: 15px;"><strong>E-Mail (Allgemeine Anfragen):</strong><br/>
      support@ecommercerente.com</p>

      <p style="margin-top: 15px;"><strong>Telefon / Erstgespräch buchen:</strong><br/>
      Über Website: ecommercerente.com/erstgespraech</p>

      <p style="margin-top: 15px;"><strong>Partner-Dashboard:</strong><br/>
      ecommercerente.com/partner/dashboard</p>

      <p style="margin-top: 15px;"><strong>Antwortzeit:</strong> Innerhalb 24 Stunden (Werktage)</p>
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

<!-- SEITE 11: ZIELE & WELCOME -->
<div class="page">
  <div class="header">
    <span>E-Commerce Rente Partner-Handbuch</span>
    <span>Seite 11</span>
  </div>
  <div class="content">
    <h2>Nächste Schritte & Kontakt</h2>

    <h3>🎯 Ihr Ziel für die nächsten 30 Tage</h3>
    <div class="highlight-box">
      <p><strong>Setzen Sie sich ein realistisches Ziel:</strong></p>
      <ul>
        <li>3 qualifizierte Gespräche führen</li>
        <li>1 erfolgreiche Vermittlung abschließen</li>
        <li>10 neue LinkedIn-Kontakte knüpfen</li>
        <li>Ersten Provisionscheck verdienen!</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 20px; padding: 30px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border-radius: 12px;">
      <p style="font-size: 14pt; margin-bottom: 15px;">
        <strong>QR-Code Platzhalter</strong>
      </p>
      <p style="font-size: 12pt; color: #D4AF37;">
        ecommercerente.com/partner
      </p>
      <div style="width: 80px; height: 80px; margin: 20px auto; background: white; border: 3px solid #D4AF37; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 10pt;">QR</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #fffbeb; border-radius: 8px; border: 2px solid #D4AF37;">
      <p style="font-size: 16pt; font-weight: bold; color: #1a1a1a; margin-bottom: 10px;">
        Willkommen im Team!
      </p>
      <p style="font-size: 11pt; color: #666;">
        Gemeinsam bauen wir passive Einkommensströme auf.<br/>
        Viel Erfolg als E-Commerce Rente Partner!
      </p>
    </div>
  </div>
  <div class="footer">© 2026 Commercehelden GmbH — Alle Rechte vorbehalten</div>
</div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../../../../web/public/downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('📁 Created output directory:', outputDir);
  }

  const outputPath = path.join(outputDir, 'partner-handbuch.pdf');

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('🌐 Browser launched');

  const page = await browser.newPage();

  // Set content
  await page.setContent(HTML_CONTENT, {
    waitUntil: 'networkidle0',
  });

  console.log('📄 HTML content loaded');

  // Generate PDF
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

  // Get file size
  const stats = fs.statSync(outputPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
  const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

  console.log(`📊 File size: ${fileSizeInKB} KB (${fileSizeInMB} MB)`);

  await browser.close();
  console.log('🔒 Browser closed');

  return {
    success: true,
    path: outputPath,
    sizeKB: fileSizeInKB,
    sizeMB: fileSizeInMB,
  };
}

// Run the script
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
