import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  private generateContractNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VK-${year}${month}-${random}`;
  }

  async createFromOrder(orderId: string, userId: string, bankData: {
    iban: string;
    bic: string;
    accountHolder: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Bestellung nicht gefunden');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Keine Berechtigung');
    }

    if (order.status !== 'PAID') {
      throw new BadRequestException('Bestellung muss bezahlt sein');
    }

    if (order.fulfillmentType) {
      throw new BadRequestException('Fulfillment bereits gewählt');
    }

    const item = order.items[0];
    if (!item) {
      throw new BadRequestException('Keine Produkte in Bestellung');
    }

    const contract = await this.prisma.commissionContract.create({
      data: {
        orderId: order.id,
        userId: userId,
        contractNumber: this.generateContractNumber(),
        productName: item.product.name,
        productQuantity: item.quantity,
        purchasePrice: item.price,
        commissionRate: new Decimal(0.20),
        iban: bankData.iban,
        bic: bankData.bic,
        accountHolder: bankData.accountHolder,
        status: 'pending_signature',
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentType: 'commission' },
    });

    return contract;
  }

  async signContract(contractId: string, userId: string, signatureData: string) {
    const contract = await this.prisma.commissionContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Vertrag nicht gefunden');
    }

    if (contract.userId !== userId) {
      throw new BadRequestException('Keine Berechtigung');
    }

    if (contract.status !== 'pending_signature') {
      throw new BadRequestException('Vertrag kann nicht signiert werden');
    }

    return this.prisma.commissionContract.update({
      where: { id: contractId },
      data: {
        signatureData: signatureData,
        signedAt: new Date(),
        status: 'signed',
      },
    });
  }

  async findOne(contractId: string, userId: string) {
    const contract = await this.prisma.commissionContract.findUnique({
      where: { id: contractId },
      include: { order: true, user: true },
    });

    if (!contract) {
      throw new NotFoundException('Vertrag nicht gefunden');
    }

    if (contract.userId !== userId) {
      throw new BadRequestException('Keine Berechtigung');
    }

    return contract;
  }

  async findAllByUser(userId: string) {
    return this.prisma.commissionContract.findMany({
      where: { userId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async chooseDelivery(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Bestellung nicht gefunden');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Keine Berechtigung');
    }

    if (order.fulfillmentType) {
      throw new BadRequestException('Fulfillment bereits gewählt');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentType: 'delivery' },
    });
  }

  // Vertragstext generieren für PDF
  getContractText(contract: any, user: any): string {
    const today = new Date().toLocaleDateString('de-AT');

    return `
VERKAUFSKOMMISSIONSVERTRAG

zwischen

${user.companyName || '[FIRMENNAME]'}
${user.companyStreet || '[STRASSE]'}
${user.companyZip || '[PLZ]'} ${user.companyCity || '[STADT]'}
${user.companyCountry || '[LAND]'}
USt-IdNr.: ${user.vatId || '[UST-ID]'}
(nachfolgend "Auftraggeber" oder "Kommittent")

und

Commercehelden GmbH
www.commercehelden.com
(nachfolgend "Auftragnehmer" oder "Kommissionär")


PRÄAMBEL

Der Auftraggeber hat über das Warenpakete Portal der Trademark24-7 AG
Waren erworben und wünscht, diese durch den Auftragnehmer im Wege der
Verkaufskommission veräußern zu lassen. Der Auftragnehmer erklärt sich
bereit, die Waren im eigenen Namen, aber für Rechnung des Auftraggebers
zu verkaufen.


§ 1 VERTRAGSGEGENSTAND

(1) Der Auftraggeber beauftragt den Auftragnehmer, die nachfolgend
    bezeichneten Waren im eigenen Namen, aber für Rechnung des
    Auftraggebers zu verkaufen (Verkaufskommission gemäß §§ 383 ff UGB).

(2) Warenbezeichnung:
    Produkt: ${contract.productName}
    Menge: ${contract.productQuantity} Stück/Paletten
    Einkaufspreis: EUR ${contract.purchasePrice}
    Bestellnummer: ${contract.orderId}

(3) Der Auftragnehmer ist NICHT verpflichtet, den Auftrag anzunehmen.
    Die Annahme erfolgt ausschließlich nach freiem Ermessen des
    Auftragnehmers.


§ 2 B2B-KLAUSEL / AUSSCHLUSS VERBRAUCHERSCHUTZ

(1) Dieser Vertrag wird ausschließlich zwischen Unternehmern im
    Sinne des § 1 Abs. 1 Z 1 KSchG geschlossen.

(2) Der Auftraggeber erklärt ausdrücklich und unwiderruflich, dass er
    im Rahmen seiner gewerblichen oder selbstständigen beruflichen
    Tätigkeit handelt und KEIN Verbraucher ist.

(3) Sämtliche Bestimmungen des Konsumentenschutzgesetzes (KSchG),
    insbesondere:
    - Rücktrittsrecht (§ 3 KSchG)
    - Informationspflichten (§§ 5a ff KSchG)
    - Gewährleistungsvorschriften zugunsten des Verbrauchers
    finden KEINE Anwendung.

(4) Stellt sich nachträglich heraus, dass der Auftraggeber Verbraucher
    ist, ist der Auftragnehmer berechtigt, den Vertrag fristlos zu
    kündigen und Schadensersatz zu verlangen.


§ 3 KOMMISSION UND VERGÜTUNG

(1) Der Auftragnehmer erhält für seine Tätigkeit eine Kommission
    in Höhe von 20% (zwanzig Prozent) des erzielten Bruttoverkaufspreises.

(2) Die Kommission ist verdient mit Abschluss des Verkaufsgeschäfts,
    unabhängig davon, ob der Käufer zahlt.

(3) Der Auftragnehmer ist berechtigt, die Kommission sowie alle
    weiteren Kosten gemäß diesem Vertrag vom Verkaufserlös einzubehalten.

(4) Der Auftraggeber hat KEINEN Anspruch auf Mindesterlöse oder
    Mindestverkaufspreise.


§ 4 RECHTE DES AUFTRAGNEHMERS

(1) Der Auftragnehmer ist berechtigt, aber NICHT verpflichtet:
    a) die Waren zu verkaufen
    b) die Waren zu bewerben
    c) die Waren zu lagern
    d) die Waren zu einem von ihm frei bestimmten Preis zu verkaufen

(2) Der Auftragnehmer kann den Verkaufspreis nach eigenem Ermessen
    festlegen. Der Auftraggeber hat KEIN Mitspracherecht bei der
    Preisgestaltung.

(3) Der Auftragnehmer kann den Verkauf jederzeit und ohne Angabe
    von Gründen einstellen.

(4) Der Auftragnehmer ist berechtigt, Unterauftragnehmer einzusetzen.


§ 5 PFLICHTEN DES AUFTRAGGEBERS

(1) Der Auftraggeber ist verpflichtet:
    a) die Waren ordnungsgemäß und vollständig zu übergeben
    b) alle erforderlichen Dokumente und Informationen bereitzustellen
    c) die Waren frei von Rechten Dritter zu liefern
    d) wahrheitsgemäße Angaben zur Ware zu machen

(2) Der Auftraggeber garantiert, dass die Waren:
    a) sein uneingeschränktes Eigentum sind
    b) nicht gestohlen, unterschlagen oder illegal erworben wurden
    c) keine Produktfälschungen oder Plagiate sind
    d) allen gesetzlichen Anforderungen entsprechen

(3) Bei Verstoß gegen diese Pflichten haftet der Auftraggeber
    unbeschränkt für alle Schäden des Auftragnehmers.


§ 6 KEINE VERKAUFSGARANTIE

(1) DER AUFTRAGNEHMER ÜBERNIMMT KEINERLEI GARANTIE FÜR DEN VERKAUF
    DER WAREN.

(2) Der Auftragnehmer schuldet lediglich ein Bemühen, nicht jedoch
    einen Verkaufserfolg.

(3) Der Auftraggeber hat KEINEN Anspruch auf:
    a) Verkauf der Waren innerhalb einer bestimmten Frist
    b) Erzielung eines bestimmten Verkaufspreises
    c) Rückgabe unverkaufter Waren
    d) Schadensersatz bei Nichtverkauf

(4) Der Auftragnehmer haftet NICHT für:
    a) Wertminderung der Waren
    b) Verderb oder Beschädigung (außer bei Vorsatz)
    c) Diebstahl oder Verlust
    d) Marktpreisschwankungen


§ 7 LAGERUNG UND KOSTEN

(1) Die Lagerung der Waren erfolgt beim Auftragnehmer oder einem
    von ihm beauftragten Dritten.

(2) Lagerkosten:
    a) Die ersten 14 Tage sind kostenfrei
    b) Ab dem 15. Tag: EUR 0,50 pro Palette und Tag
    c) Bei Sonderware (kühlpflichtig, gefährlich, sperrig):
       EUR 2,00 pro Palette und Tag ab dem 1. Tag

(3) Die Lagerkosten werden vom Verkaufserlös abgezogen. Übersteigen
    die Lagerkosten den Verkaufserlös, ist der Auftraggeber zur
    Nachzahlung verpflichtet.

(4) Nach 180 Tagen ohne Verkauf ist der Auftragnehmer berechtigt,
    die Waren ohne weitere Ankündigung zu entsorgen oder zu verwerten.
    Etwaige Kosten trägt der Auftraggeber.


§ 8 ABRECHNUNG UND AUSZAHLUNG

(1) Der Auftragnehmer erstellt nach Verkauf eine Abrechnung.

(2) Die Auszahlung erfolgt FRÜHESTENS 30 Tage nach Zahlungseingang
    des Käufers auf das vom Auftraggeber angegebene Konto.

(3) Bankverbindung des Auftraggebers:
    IBAN: ${contract.iban}
    BIC: ${contract.bic}
    Kontoinhaber: ${contract.accountHolder}

(4) Bei fehlerhaften Bankdaten trägt der Auftraggeber alle Kosten
    für Rückbuchungen und erneute Überweisungen.

(5) Auszahlungen unter EUR 50,00 werden gesammelt und erst bei
    Erreichen dieses Mindestbetrags überwiesen.

(6) Der Auftragnehmer behält sich ein Zurückbehaltungsrecht an
    allen Auszahlungen vor, bis alle Forderungen gegen den
    Auftraggeber beglichen sind.


§ 9 HAFTUNGSAUSSCHLUSS

(1) Der Auftragnehmer haftet ausschließlich bei Vorsatz.

(2) Die Haftung für leichte und grobe Fahrlässigkeit ist
    AUSGESCHLOSSEN, soweit gesetzlich zulässig.

(3) Der Auftragnehmer haftet NICHT für:
    a) Schäden an den Waren (außer bei Vorsatz)
    b) Entgangenen Gewinn des Auftraggebers
    c) Folgeschäden jeder Art
    d) Handlungen von Käufern der Waren
    e) Verzögerungen beim Verkauf
    f) Marktentwicklungen

(4) Die Haftung ist in jedem Fall der Höhe nach begrenzt auf
    50% des ursprünglichen Einkaufspreises der Waren.

(5) Der Auftraggeber stellt den Auftragnehmer von sämtlichen
    Ansprüchen Dritter frei, die im Zusammenhang mit den Waren
    geltend gemacht werden.


§ 10 KEINE GEWÄHRLEISTUNG

(1) Der Auftragnehmer übernimmt KEINERLEI Gewährleistung für:
    a) den Zustand der Waren
    b) die Verkäuflichkeit der Waren
    c) die Echtheit oder Qualität der Waren
    d) die Eignung für einen bestimmten Zweck

(2) Gewährleistungsansprüche des Auftraggebers gegen den
    Auftragnehmer sind AUSGESCHLOSSEN.

(3) Der Auftraggeber trägt das volle Risiko der Wertentwicklung
    der Waren.


§ 11 VERTRAGSDAUER UND KÜNDIGUNG

(1) Der Vertrag wird auf unbestimmte Zeit geschlossen.

(2) Der Auftragnehmer kann den Vertrag jederzeit ohne Einhaltung
    einer Frist und ohne Angabe von Gründen kündigen.

(3) Der Auftraggeber kann den Vertrag mit einer Frist von 90 Tagen
    zum Monatsende kündigen, frühestens jedoch nach Ablauf von
    12 Monaten nach Vertragsschluss.

(4) Bei Kündigung durch den Auftraggeber:
    a) werden noch ausstehende Lagerkosten sofort fällig
    b) hat der Auftraggeber die Waren innerhalb von 14 Tagen
       auf eigene Kosten abzuholen
    c) nicht abgeholte Waren verfallen ersatzlos an den Auftragnehmer

(5) Das Recht zur außerordentlichen Kündigung durch den Auftragnehmer
    bleibt unberührt und kann insbesondere ausgeübt werden bei:
    a) Zahlungsverzug des Auftraggebers
    b) Falschangaben des Auftraggebers
    c) Insolvenz des Auftraggebers
    d) Rufschädigung durch den Auftraggeber


§ 12 VERTRAULICHKEIT

(1) Der Auftraggeber verpflichtet sich, alle Informationen über:
    a) Verkaufspreise
    b) Käufer
    c) Geschäftspraktiken des Auftragnehmers
    streng vertraulich zu behandeln.

(2) Bei Verstoß: Vertragsstrafe von EUR 10.000,00 pro Verstoß.


§ 13 SCHIEDSKLAUSEL UND ANWENDBARES RECHT

(1) Es gilt ausschließlich österreichisches materielles Recht unter
    Ausschluss des UN-Kaufrechts (CISG) und der Verweisungsnormen
    des IPRG.

(2) SCHIEDSKLAUSEL:

    Alle Streitigkeiten, die sich aus diesem Vertrag ergeben oder
    auf dessen Verletzung, Auflösung oder Nichtigkeit beziehen,
    werden nach der Schiedsordnung des Internationalen
    Schiedsgerichts der Wirtschaftskammer Österreich in Wien
    (Vienna International Arbitral Centre - VIAC) von einem oder
    mehreren gemäß dieser Schiedsordnung ernannten Schiedsrichtern
    endgültig entschieden.

(3) Schiedsverfahren:
    a) Anzahl der Schiedsrichter: EINER (Einzelschiedsrichter)
    b) Schiedsort: Wien, Österreich
    c) Verfahrenssprache: Deutsch
    d) Der Schiedsspruch ist endgültig und für beide Parteien bindend
    e) Der ordentliche Rechtsweg ist AUSGESCHLOSSEN

(4) Der Auftraggeber verzichtet unwiderruflich auf:
    a) jegliche Anfechtung des Schiedsspruchs, soweit gesetzlich
       zulässig
    b) Rechtsmittel gegen Zwischenentscheidungen
    c) die Einrede der Unzuständigkeit des Schiedsgerichts

(5) Kosten des Schiedsverfahrens:
    a) Jede Partei trägt zunächst ihre eigenen Kosten
    b) Die unterliegende Partei trägt die gesamten Kosten des
       Schiedsverfahrens einschließlich der Kosten der Gegenseite
    c) Bei teilweisem Unterliegen erfolgt Kostenteilung nach
       billigem Ermessen des Schiedsgerichts

(6) Vertraulichkeit des Schiedsverfahrens:
    Das Schiedsverfahren und der Schiedsspruch sind streng
    vertraulich. Die Parteien verpflichten sich, keine Informationen
    über das Verfahren an Dritte weiterzugeben.

(7) Einstweiliger Rechtsschutz:
    Der Auftragnehmer ist berechtigt, vor Einleitung oder während
    des Schiedsverfahrens einstweiligen Rechtsschutz bei den
    ordentlichen Gerichten zu beantragen. Der Auftraggeber verzichtet
    auf dieses Recht.

(8) Schiedsgerichtliche Zuständigkeit:
    Vienna International Arbitral Centre (VIAC)
    Wiedner Hauptstraße 63
    1045 Wien, Österreich
    www.viac.eu


§ 14 SCHLUSSBESTIMMUNGEN

(1) Änderungen und Ergänzungen dieses Vertrages bedürfen der
    Schriftform. Dies gilt auch für die Abbedingung dieser Klausel.

(2) Sollten einzelne Bestimmungen unwirksam sein, bleibt die
    Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame
    Bestimmung ist durch eine wirksame Bestimmung zu ersetzen, die
    dem wirtschaftlichen Zweck am nächsten kommt.

(3) Mündliche Nebenabreden bestehen nicht.

(4) Der Auftraggeber bestätigt, diesen Vertrag vollständig gelesen
    und verstanden zu haben, insbesondere die Haftungsausschlüsse
    und den Ausschluss von Gewährleistungsrechten.


Ort, Datum: ${today}


_________________________________
Auftraggeber (Kommittent)
${user.companyName || '[FIRMENNAME]'}


_________________________________
Auftragnehmer (Kommissionär)
Commercehelden GmbH


Vertragsnummer: ${contract.contractNumber}
Erstellt am: ${today}
    `;
  }
}
