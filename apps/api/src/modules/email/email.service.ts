import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress = 'noreply@ecommercerente.com';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured. Emails will not be sent.');
    }
    this.resend = new Resend(apiKey);
  }

  async sendOrderConfirmation(to: string, order: any) {
    try {
      const itemsHtml = order.items
        .map(
          (item: any) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${Number(item.price).toFixed(2)} €</td>
          </tr>
        `,
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">Bestellung bestätigt! 🎉</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und werden sie schnellstmöglich bearbeiten.
                </p>

                <!-- Order Details -->
                <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #FFD700;">
                  <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">Bestellnummer</h2>
                  <p style="margin: 0; color: #6b7280; font-family: monospace; font-size: 14px;">${order.id}</p>
                </div>

                <!-- Products Table -->
                <h2 style="color: #1f2937; font-size: 18px; margin: 30px 0 15px 0;">Bestellte Produkte</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 14px; font-weight: 600;">Produkt</th>
                      <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px; font-weight: 600;">Menge</th>
                      <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">Preis</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding: 16px 12px 12px 12px; text-align: right; font-weight: 600; color: #1f2937; font-size: 16px;">Gesamtbetrag:</td>
                      <td style="padding: 16px 12px 12px 12px; text-align: right; font-weight: 700; color: #FFD700; font-size: 18px;">${Number(order.totalAmount).toFixed(2)} €</td>
                    </tr>
                  </tfoot>
                </table>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/orders" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Bestellung ansehen</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wurde.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `Bestellbestätigung - #${order.id.substring(0, 8)}`,
        html,
      });

      this.logger.log(`Order confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send order confirmation email to ${to}:`, error);
    }
  }

  async sendPaymentSuccess(to: string, order: any, userName: string) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Zahlung erfolgreich! ✅</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${userName},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Ihre Zahlung wurde erfolgreich verarbeitet! Wir beginnen nun mit der Bearbeitung Ihrer Bestellung.
                </p>

                <!-- Order Info -->
                <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                  <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">Bestelldetails</h2>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Bestellnummer:</strong> ${order.id.substring(0, 8)}
                  </p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Betrag:</strong> ${Number(order.totalAmount).toFixed(2)} €
                  </p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Status:</strong> Bezahlt
                  </p>
                </div>

                <h2 style="color: #1f2937; font-size: 18px; margin: 30px 0 15px 0;">Nächste Schritte</h2>
                <ol style="color: #374151; line-height: 1.8; padding-left: 20px;">
                  <li>Wir verpacken Ihre Warenpakete sorgfältig</li>
                  <li>Sie erhalten eine Versandbenachrichtigung mit Tracking-Nummer</li>
                  <li>Ihre Pakete werden direkt an Ihre Adresse geliefert</li>
                </ol>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/orders" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Bestellstatus verfolgen</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `Zahlung erfolgreich - #${order.id.substring(0, 8)}`,
        html,
      });

      this.logger.log(`Payment success email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send payment success email to ${to}:`, error);
    }
  }

  async sendWelcome(to: string, name: string) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">Willkommen! 🎉</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${name},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Herzlich willkommen bei <strong>E-Commerce Rente</strong> - Ihrem Premium-Portal für hochwertige Warenpakete!
                </p>

                <!-- Features -->
                <div style="margin: 30px 0;">
                  <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Was Sie erwartet:</h2>

                  <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #FFD700;">
                    <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">🎁 Premium Warenpakete</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Entdecken Sie sorgfältig zusammengestellte Produktpakete mit attraktiven Rabatten.</p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #FFD700;">
                    <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">💰 Provisionsmodell</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Als Reseller können Sie durch Empfehlungen attraktive Provisionen verdienen.</p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #FFD700;">
                    <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">🚀 Schneller Versand</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Wir versenden Ihre Bestellungen schnell und zuverlässig direkt zu Ihnen.</p>
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/products" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Produkte entdecken</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Bei Fragen oder Anregungen stehen wir Ihnen jederzeit zur Verfügung. Viel Erfolg mit unserem Portal!
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: 'Willkommen bei E-Commerce Rente! 🎉',
        html,
      });

      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}:`, error);
    }
  }

  async sendCommissionEarned(to: string, commission: any, resellerName: string) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Provision verdient! 💰</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${resellerName},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Gute Nachrichten! Sie haben eine neue Provision verdient.
                </p>

                <!-- Commission Amount -->
                <div style="margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-radius: 12px; text-align: center; border: 2px solid #8b5cf6;">
                  <div style="font-size: 48px; font-weight: 700; color: #8b5cf6; margin-bottom: 10px;">
                    ${Number(commission.amount).toFixed(2)} €
                  </div>
                  <div style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">
                    Provision gutgeschrieben
                  </div>
                </div>

                <!-- Commission Details -->
                <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                  <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Details</h2>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Bestellung:</strong> #${commission.orderId.substring(0, 8)}
                  </p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Status:</strong> ${commission.status === 'PENDING' ? 'Ausstehend' : 'Ausgezahlt'}
                  </p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>Datum:</strong> ${new Date(commission.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; padding: 15px; background-color: #fffbeb; border-radius: 6px; border-left: 4px solid #FFD700;">
                  💡 <strong>Tipp:</strong> Die Provision wird Ihrem Wallet gutgeschrieben und kann für zukünftige Bestellungen verwendet werden.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Wallet ansehen</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Vielen Dank für Ihre erfolgreiche Empfehlung! Teilen Sie weiterhin Ihren Referral-Code, um mehr Provisionen zu verdienen.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `Neue Provision: ${Number(commission.amount).toFixed(2)} € verdient! 💰`,
        html,
      });

      this.logger.log(`Commission earned email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send commission earned email to ${to}:`, error);
    }
  }

  async sendLeadThankYou(to: string, lead: any, consultant?: any) {
    try {
      const isQualified = lead.isQualified;

      let subject: string;
      let html: string;

      if (isQualified && consultant) {
        // QUALIFIZIERT - Mit Calendly Link
        subject = 'Ihr Erstgespräch - Jetzt Termin buchen! 📞';
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Ihr Erstgespräch wartet! 📞</h1>
                </div>

                <!-- Content -->
                <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                    Hallo ${lead.firstName},
                  </p>

                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Vielen Dank für Ihr Interesse an E-Commerce Rente! Basierend auf Ihren Angaben sind Sie für ein persönliches Erstgespräch qualifiziert.
                  </p>

                  <!-- Consultant Info -->
                  <div style="margin: 30px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Ihr Gesprächspartner</h2>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                      <strong>Name:</strong> ${consultant.name}
                    </p>
                    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                      <strong>Email:</strong> ${consultant.email}
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${consultant.calendlyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Jetzt Termin buchen</a>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                    Im Gespräch klären wir Ihre Fragen und besprechen, wie E-Commerce Rente Sie bei Ihrem Vorhaben unterstützen kann.
                  </p>

                  <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                    Wir freuen uns auf Sie!
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                  <p style="margin: 10px 0 0 0;">
                    <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;
      } else {
        // NICHT QUALIFIZIERT - Freundliche Absage
        subject = 'Vielen Dank für Ihr Interesse';
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">Vielen Dank für Ihr Interesse! 🙏</h1>
                </div>

                <!-- Content -->
                <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                    Hallo ${lead.firstName},
                  </p>

                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Vielen Dank für Ihre Bewerbung bei E-Commerce Rente.
                  </p>

                  <!-- Info Box -->
                  <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; line-height: 1.6;">
                      Aufgrund unseres Mindestinvestitionsvolumens von <strong>10.000 €</strong> können wir Ihnen aktuell kein persönliches Erstgespräch anbieten.
                    </p>
                    <p style="margin: 15px 0 0 0; color: #92400e; line-height: 1.6;">
                      Wir speichern Ihre Anfrage und melden uns bei Ihnen, sobald passende Angebote für Ihr Budget verfügbar sind.
                    </p>
                  </div>

                  <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                    Wir wünschen Ihnen viel Erfolg auf Ihrem Weg in den E-Commerce!
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">© 2024 E-Commerce Rente - Premium Warenpakete Portal</p>
                  <p style="margin: 10px 0 0 0;">
                    <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;
      }

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html,
      });

      this.logger.log(`Lead thank you email sent to ${to} (qualified: ${isQualified})`);
    } catch (error) {
      this.logger.error(`Failed to send lead thank you email to ${to}:`, error);
    }
  }

  async sendConsultantLeadNotification(to: string, lead: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Neuer qualifizierter Lead! 🎯</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Ein neuer Lead wurde Ihnen zugewiesen:
                </p>

                <!-- Lead Details Table -->
                <table style="width: 100%; margin: 20px 0; background-color: #f9fafb; border-radius: 8px;">
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.firstName} ${lead.lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Firma:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Telefon:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Budget:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><span style="color: #10b981; font-weight: 600;">${lead.budget}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Branche:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.industry}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>E-Commerce Erfahrung:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.ecommerceExperience}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Firmengröße:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.companySize}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Zeitrahmen:</strong></td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${lead.timeframe}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px;"><strong>Quelle:</strong></td>
                    <td style="padding: 12px;">${lead.source}</td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; padding: 15px; background-color: #fffbeb; border-radius: 6px; border-left: 4px solid #FFD700;">
                  💡 <strong>Tipp:</strong> Der Lead hat bereits eine Bestätigungsmail mit Ihrem Calendly-Link erhalten.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/admin/crm/leads" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Lead im CRM ansehen</a>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente - Admin Benachrichtigung</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `Neuer qualifizierter Lead: ${lead.firstName} ${lead.lastName}`,
        html,
      });

      this.logger.log(`Consultant lead notification sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send consultant lead notification to ${to}:`, error);
    }
  }

  // ========================================
  // EMAIL AUTOMATION SEQUENZEN
  // ========================================

  /**
   * FUNNEL SEQUENZ - Email 2: 24h Reminder für qualifizierte Leads
   * Gesendet 24h nach Bewerbung wenn noch nicht gebucht
   */
  async sendLeadReminder24h(to: string, lead: any, consultant: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Ihr Termin wartet noch 📞</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${lead.firstName},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Wir haben gestern Ihren reservierten Beratungsplatz für Sie freigehalten. Haben Sie schon Ihren Termin gebucht?
                </p>

                <!-- Benefits -->
                <div style="margin: 30px 0;">
                  <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Warum ein Erstgespräch lohnt:</h2>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">✓ <strong>Individuelle Beratung</strong> - Maßgeschneidert auf Ihr Business</p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">✓ <strong>Praxis-Erfahrung</strong> - Von echten E-Commerce-Experten</p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">✓ <strong>Konkrete Strategie</strong> - Direkt umsetzbare Handlungsschritte</p>
                  </div>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; padding: 15px; background-color: #fffbeb; border-radius: 6px; border-left: 4px solid #f59e0b;">
                  ⏰ <strong>Begrenzte Verfügbarkeit:</strong> Unsere Beratungsplätze sind limitiert und werden nach dem First-Come-First-Served-Prinzip vergeben.
                </p>

                <!-- Consultant Info -->
                <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Ihr Gesprächspartner</h3>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    <strong>${consultant.name}</strong>
                  </p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                    ${consultant.email}
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${consultant.calendlyUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Jetzt Termin sichern</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Wir freuen uns auf das Gespräch mit Ihnen!
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente | Commercehelden GmbH</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a> |
                  <a href="${process.env.FRONTEND_URL}/funnel/unsubscribe/${lead.id}" style="color: #9ca3af; text-decoration: underline;">Abmelden</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `${lead.firstName}, Ihr Termin wartet noch - Jetzt buchen!`,
        html,
      });

      this.logger.log(`Lead 24h reminder sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send lead 24h reminder to ${to}:`, error);
    }
  }

  /**
   * FUNNEL SEQUENZ - Email 3: 72h Urgency für qualifizierte Leads
   * Gesendet 72h nach Bewerbung wenn noch nicht gebucht
   */
  async sendLeadUrgency72h(to: string, lead: any, consultant: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #FFA500 0%, #FF6B6B 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Letzte Chance ⏰</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${lead.firstName},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Ihr reservierter Beratungsplatz läuft in Kürze ab. Dies ist Ihre letzte Chance, sich einen exklusiven Termin zu sichern.
                </p>

                <!-- Urgency Box -->
                <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #f59e0b; text-align: center;">
                  <div style="font-size: 20px; font-weight: 700; color: #92400e; margin-bottom: 10px;">
                    🔥 Ihr Platz läuft bald ab
                  </div>
                  <p style="margin: 0; color: #78350f; font-size: 14px;">
                    Unsere Beratungsplätze sind stark nachgefragt. Sichern Sie sich jetzt Ihren Termin, bevor er an andere Interessenten vergeben wird.
                  </p>
                </div>

                <!-- Social Proof -->
                <div style="margin: 30px 0;">
                  <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Das sagen unsere Partner:</h2>

                  <div style="margin: 15px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <p style="margin: 0; color: #374151; font-size: 14px; font-style: italic;">
                      &quot;Das Erstgespräch hat mir die Augen geöffnet. Innerhalb von 3 Monaten konnte ich meinen ersten 5-stelligen Umsatz realisieren.&quot;
                    </p>
                    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
                      - Michael S., E-Commerce Partner seit 2025
                    </p>
                  </div>

                  <div style="margin: 15px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <p style="margin: 0; color: #374151; font-size: 14px; font-style: italic;">
                      &quot;Professionelle Beratung auf höchstem Niveau. Die Expertise hat sich sofort ausgezahlt.&quot;
                    </p>
                    <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
                      - Sandra K., Online-Händlerin
                    </p>
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${consultant.calendlyUrl}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 20px; box-shadow: 0 8px 16px rgba(255, 165, 0, 0.3); animation: pulse 2s infinite;">Jetzt letzten Platz sichern</a>
                </div>

                <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">
                  Nach Ablauf wird Ihr Platz automatisch freigegeben
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente | Commercehelden GmbH</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a> |
                  <a href="${process.env.FRONTEND_URL}/funnel/unsubscribe/${lead.id}" style="color: #9ca3af; text-decoration: underline;">Abmelden</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `${lead.firstName}, Ihr reservierter Platz läuft bald ab ⏰`,
        html,
      });

      this.logger.log(`Lead 72h urgency sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send lead 72h urgency to ${to}:`, error);
    }
  }

  /**
   * FUNNEL SEQUENZ - Email 4: Content Email für nicht-qualifizierte Leads (7 Tage)
   * Gesendet 7 Tage nach Bewerbung
   */
  async sendLeadContentEmail7d(to: string, lead: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">E-Commerce Starter Guide 📚</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${lead.firstName},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Sie möchten in den E-Commerce einsteigen? Hier sind <strong>5 bewährte Wege</strong>, wie Sie starten können:
                </p>

                <!-- Content List -->
                <div style="margin: 30px 0;">
                  <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">1️⃣ Dropshipping</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Starten Sie ohne eigenes Lager. Niedrige Einstiegskosten, flexibles Geschäftsmodell. Ideal für Einsteiger mit kleinerem Budget.
                    </p>
                  </div>

                  <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">2️⃣ Amazon FBA</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Nutzen Sie die Reichweite von Amazon. Lagerung und Versand übernimmt Amazon für Sie. Skalierbar ab mittlerem Budget.
                    </p>
                  </div>

                  <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">3️⃣ Print-on-Demand</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Verkaufen Sie individualisierte Produkte ohne Lagerhaltung. T-Shirts, Tassen, Poster - nur bei Bestellung produziert.
                    </p>
                  </div>

                  <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">4️⃣ Affiliate Marketing</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Verdienen Sie Provisionen durch Produktempfehlungen. Kein eigenes Produkt nötig, Start mit minimalem Investment möglich.
                    </p>
                  </div>

                  <div style="margin: 20px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #D4AF37;">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">5️⃣ Digitale Produkte</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      E-Books, Online-Kurse, Templates - einmal erstellen, unendlich oft verkaufen. Hohe Margen, keine Lagerkosten.
                    </p>
                  </div>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; padding: 15px; background-color: #f0fdf4; border-radius: 6px; border-left: 4px solid #10b981;">
                  💡 <strong>Unser Tipp:</strong> Starten Sie klein, testen Sie verschiedene Ansätze und skalieren Sie das, was funktioniert.
                </p>

                <!-- CTA -->
                <div style="margin: 30px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Bereit für mehr?</h3>
                  <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                    Registrieren Sie sich in unserem Portal und entdecken Sie exklusive Ressourcen für E-Commerce-Einsteiger.
                  </p>
                  <a href="${process.env.FRONTEND_URL}/sign-up" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Jetzt kostenlos registrieren</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Wir wünschen Ihnen viel Erfolg auf Ihrem E-Commerce-Weg!
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente | Commercehelden GmbH</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a> |
                  <a href="${process.env.FRONTEND_URL}/funnel/unsubscribe/${lead.id}" style="color: #9ca3af; text-decoration: underline;">Abmelden</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `E-Commerce Starter Guide für ${lead.firstName}`,
        html,
      });

      this.logger.log(`Lead 7d content email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send lead 7d content email to ${to}:`, error);
    }
  }

  /**
   * USER SEQUENZ - Email 2: Onboarding "Wie es funktioniert" (48h)
   * Gesendet 48h nach Registrierung wenn keine Bestellung
   */
  async sendUserOnboarding2(to: string, user: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">So funktioniert E-Commerce Rente 🚀</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${user.firstName || user.name},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Bereit, mit uns durchzustarten? Hier erfahren Sie in <strong>3 einfachen Schritten</strong>, wie E-Commerce Rente funktioniert:
                </p>

                <!-- Steps -->
                <div style="margin: 30px 0;">
                  <div style="margin: 25px 0; padding: 25px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border-left: 6px solid #FFD700;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1f2937; font-size: 20px; margin-right: 15px;">1</div>
                      <h3 style="margin: 0; color: #1f2937; font-size: 18px;">Warenpakete durchstöbern</h3>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Entdecken Sie unsere sorgfältig zusammengestellten Premium-Produktpakete. Von Lifestyle bis Elektronik - alles mit attraktiven Großhandelspreisen.
                    </p>
                  </div>

                  <div style="margin: 25px 0; padding: 25px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border-left: 6px solid #FFD700;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1f2937; font-size: 20px; margin-right: 15px;">2</div>
                      <h3 style="margin: 0; color: #1f2937; font-size: 18px;">Paket auswählen & bestellen</h3>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Wählen Sie das Warenpaket, das zu Ihrem Business passt. Sichere Zahlung, professionelles Fulfillment - alles aus einer Hand.
                    </p>
                  </div>

                  <div style="margin: 25px 0; padding: 25px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; border-left: 6px solid #FFD700;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1f2937; font-size: 20px; margin-right: 15px;">3</div>
                      <h3 style="margin: 0; color: #1f2937; font-size: 18px;">Verdienen & wachsen</h3>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Verkaufen Sie die Produkte mit Gewinn oder verdienen Sie als Reseller attraktive Provisionen. Empfehlen Sie uns weiter und profitieren Sie von unserem 3-Ebenen-Provisionssystem.
                    </p>
                  </div>
                </div>

                <!-- Trust Elements -->
                <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; text-align: center;">🛡️ Warum E-Commerce Rente?</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                    <li><strong>Sicherheit:</strong> B2B-geprüfte Lieferanten und Qualitätskontrollen</li>
                    <li><strong>Professionalität:</strong> Schnelles Fulfillment und zuverlässiger Versand</li>
                    <li><strong>Support:</strong> Persönliche Beratung und direkter Ansprechpartner</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/products" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Jetzt Warenpakete ansehen</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 0;">
                  Haben Sie Fragen? Unser Support-Team steht Ihnen jederzeit zur Verfügung.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente | Commercehelden GmbH</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a> |
                  <a href="${process.env.FRONTEND_URL}/users/unsubscribe/${user.id}" style="color: #9ca3af; text-decoration: underline;">Abmelden</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: 'So funktioniert E-Commerce Rente - Ihre ersten Schritte',
        html,
      });

      this.logger.log(`User onboarding 2 email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send user onboarding 2 email to ${to}:`, error);
    }
  }

  /**
   * USER SEQUENZ - Email 3: Einladung zum Erstgespräch (5 Tage)
   * Gesendet 5 Tage nach Registrierung wenn keine Bestellung
   */
  async sendUserOnboarding3(to: string, user: any) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Können wir Ihnen helfen? 🤝</h1>
              </div>

              <!-- Content -->
              <div style="background-color: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
                  Hallo ${user.firstName || user.name},
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Wir haben bemerkt, dass Sie noch keine Bestellung aufgegeben haben. Gibt es etwas, bei dem wir Sie unterstützen können?
                </p>

                <!-- Value Prop -->
                <div style="margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-radius: 12px; text-align: center; border: 2px solid #8b5cf6;">
                  <h2 style="margin: 0 0 15px 0; color: #6b21a8; font-size: 22px;">Kostenlose persönliche Beratung</h2>
                  <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                    Vereinbaren Sie ein unverbindliches Erstgespräch mit unseren E-Commerce-Experten. Wir helfen Ihnen, die richtige Strategie für Ihr Business zu finden.
                  </p>
                </div>

                <!-- Benefits -->
                <div style="margin: 30px 0;">
                  <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Was Sie erwartet:</h3>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      <strong>✓ Individuelle Strategie</strong><br>
                      <span style="color: #6b7280;">Maßgeschneiderte Empfehlungen für Ihr Business-Modell</span>
                    </p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      <strong>✓ Praktische Tipps</strong><br>
                      <span style="color: #6b7280;">Direkt umsetzbare Handlungsschritte von Praktikern</span>
                    </p>
                  </div>

                  <div style="margin: 15px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      <strong>✓ Erfolgsstrategie</strong><br>
                      <span style="color: #6b7280;">Lernen Sie, wie unsere erfolgreichsten Partner vorgehen</span>
                    </p>
                  </div>
                </div>

                <!-- Testimonial -->
                <div style="margin: 30px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #FFD700;">
                  <p style="margin: 0; color: #374151; font-size: 14px; font-style: italic; line-height: 1.6;">
                    &quot;Das Beratungsgespräch war der Wendepunkt für mein Business. Innerhalb von 2 Monaten habe ich meinen ersten 5-stelligen Umsatz erreicht.&quot;
                  </p>
                  <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
                    - Lisa M., E-Commerce Unternehmerin
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL}/erstgespraech" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1f2937; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Jetzt Erstgespräch vereinbaren</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; line-height: 1.6; text-align: center; margin-bottom: 0;">
                  100% kostenlos & unverbindlich • 30 Minuten • Online via Zoom
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2024 E-Commerce Rente | Commercehelden GmbH</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL}" style="color: #FFD700; text-decoration: none;">Portal besuchen</a> |
                  <a href="${process.env.FRONTEND_URL}/users/unsubscribe/${user.id}" style="color: #9ca3af; text-decoration: underline;">Abmelden</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject: `${user.firstName || user.name}, können wir Ihnen helfen?`,
        html,
      });

      this.logger.log(`User onboarding 3 email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send user onboarding 3 email to ${to}:`, error);
    }
  }
}
