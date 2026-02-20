import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';

@ApiTags('users-public')
@Controller('users')
export class UsersPublicController {
  constructor(private readonly usersService: UsersService) {}

  @Get('unsubscribe/:userId')
  @ApiOperation({ summary: 'Unsubscribe from email sequences (PUBLIC)' })
  async unsubscribeUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      await this.usersService.unsubscribeUser(userId);

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Abgemeldet - E-Commerce Rente</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              .container {
                max-width: 600px;
                width: 100%;
                background: white;
                padding: 60px 40px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                text-align: center;
              }
              .icon {
                font-size: 64px;
                margin-bottom: 20px;
              }
              h1 {
                color: #10b981;
                margin-bottom: 20px;
                font-size: 32px;
                font-weight: 700;
              }
              p {
                color: #6b7280;
                line-height: 1.8;
                font-size: 16px;
                margin: 15px 0;
              }
              a {
                display: inline-block;
                margin-top: 30px;
                padding: 14px 32px;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #1f2937;
                text-decoration: none;
                font-weight: 600;
                border-radius: 8px;
                font-size: 16px;
                transition: transform 0.2s;
              }
              a:hover {
                transform: translateY(-2px);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✓</div>
              <h1>Erfolgreich abgemeldet</h1>
              <p>Sie erhalten keine weiteren E-Mails von uns.</p>
              <p>Ihre Email-Adresse wurde aus unserem Verteiler entfernt.</p>
              <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
                Bei Fragen können Sie uns jederzeit kontaktieren.
              </p>
              <a href="${process.env.FRONTEND_URL || 'https://www.ecommercerente.com'}">Zurück zur Startseite</a>
            </div>
          </body>
        </html>
      `;

      return res.status(200).send(html);
    } catch (error) {
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fehler - E-Commerce Rente</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              .container {
                max-width: 600px;
                width: 100%;
                background: white;
                padding: 60px 40px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                text-align: center;
              }
              .icon { font-size: 64px; margin-bottom: 20px; }
              h1 { color: #ef4444; margin-bottom: 20px; font-size: 28px; }
              p { color: #6b7280; line-height: 1.6; }
              a {
                display: inline-block;
                margin-top: 30px;
                padding: 14px 32px;
                background: #D4AF37;
                color: #1f2937;
                text-decoration: none;
                font-weight: 600;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✗</div>
              <h1>Fehler beim Abmelden</h1>
              <p>Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.</p>
              <a href="${process.env.FRONTEND_URL || 'https://www.ecommercerente.com'}">Zurück zur Startseite</a>
            </div>
          </body>
        </html>
      `;
      return res.status(400).send(errorHtml);
    }
  }
}
