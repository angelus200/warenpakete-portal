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
}
