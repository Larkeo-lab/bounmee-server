"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpEmailTemplate = void 0;
const getOtpEmailTemplate = (otpCode, otpExpiresMinutes, language = "lo") => {
    const brandPrimary = "#3554a1";
    const brandDark = "#1e293b";
    const brandLight = "#f8fafc";
    const accentColor = "#6366f1"; // Indigo accent
    const translations = {
        en: {
            title: "Authentication - Smart POS",
            greeting: "Security Verification",
            description: "You are receiving this email because a request for identity verification was made for your <strong>Smart POS</strong> account.",
            otpLabel: "Security Code",
            otpHint: "Tap to select and copy",
            validFor: `Valid for ${otpExpiresMinutes} minutes`,
            safetyTitle: "Safety Measures",
            safetyText: "For your protection, never share this code with anyone. Smart POS employees will never ask for your verification code over the phone or email.",
            helpCenter: "Help Center",
            privacyPolicy: "Privacy Policy",
            support: "Support",
            rights: `&copy; ${new Date().getFullYear()} Smart POS Technology. All rights reserved.`,
            protecting: "Protecting your digital assets with advanced security.",
        },
        lo: {
            title: "ການຢືນຢັນຕົວຕົນ - Smart POS",
            greeting: "ການຢືນຢັນຄວາມປອດໄພ",
            description: "ທ່ານໄດ້ຮັບອີເມວນີ້ເນື່ອງຈາກມີການຮ້ອງຂໍການຢືນຢັນຕົວຕົນສຳລັບບັນຊີ <strong>Smart POS</strong> ຂອງທ່ານ.",
            otpLabel: "ລະຫັດຄວາມປອດໄພ",
            otpHint: "ແຕະເພື່ອເລືອກ ແລະ ສຳເນົາ",
            validFor: `ໃຊ້ໄດ້ພາຍໃນ ${otpExpiresMinutes} ນາທີ`,
            safetyTitle: "ມາດຕະການຄວາມປອດໄພ",
            safetyText: "ເພື່ອຄວາມປອດໄພຂອງທ່ານ, ຫ້າມແບ່ງປັນລະຫັດນີ້ໃຫ້ໃຜເດັດຂາດ. ພະນັກງານ Smart POS ຈະບໍ່ຖາມລະຫັດຢືນຢັນຂອງທ່ານຜ່ານທາງໂທລະສັບ ຫຼື ອີເມວ.",
            helpCenter: "ສູນຊ່ວຍເຫຼືອ",
            privacyPolicy: "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
            support: "ການຊ່ວຍເຫຼືອ",
            rights: `&copy; ${new Date().getFullYear()} Smart POS Technology. ສະຫງວນລິຂະສິດ.`,
            protecting: "ປົກປ້ອງຊັບສິນດິຈິຕອນຂອງທ່ານດ້ວຍຄວາມປອດໄພຂັ້ນສູງ.",
        },
    };
    const t = translations[language] || translations.lo;
    return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          background-color: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
        }

        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f1f5f9;
          padding-bottom: 40px;
        }

        .main-container {
          max-width: 520px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .header {
          background-color: #ffffff;
          padding: 20px 40px 12px 40px;
          border-bottom: 1px solid #f1f5f9;
          text-align: left;
        }

        .logo {
          height: 38px;
          width: auto;
          display: inline-block;
          vertical-align: middle;
          border-radius: 8px;
        }

        .brand-title {
          display: inline-block;
          vertical-align: middle;
          font-size: 20px;
          font-weight: 700;
          color: ${brandPrimary};
          margin: 0;
          margin-left: 12px;
        }

        .content {
          padding: 12px 40px 32px 40px;
          color: ${brandDark};
          text-align: center;
        }

        .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .description {
          font-size: 16px;
          line-height: 24px;
          color: #475569;
          margin-bottom: 24px;
        }

        .otp-container {
          background-color: #f8fafc;
          border: 1.5px solid #e6edfd;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          position: relative;
        }

        .otp-label {
          font-size: 13px;
          font-weight: 700;
          color: ${brandPrimary};
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          display: block;
        }

        .otp-code {
          font-size: 48px;
          font-weight: 800;
          color: ${brandPrimary};
          letter-spacing: 12px;
          font-family: 'JetBrains Mono', 'Monaco', monospace;
          margin: 0;
          line-height: 1;
          cursor: pointer;
          -webkit-user-select: all;
          -moz-user-select: all;
          -ms-user-select: all;
          user-select: all;
        }

        .otp-hint {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 8px;
          display: block;
        }

        .expiration {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .security-section {
          text-align: left;
          border-top: 1px solid #f1f5f9;
          padding-top: 32px;
        }

        .security-title {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }

        .security-text {
          font-size: 13px;
          line-height: 20px;
          color: #64748b;
          margin: 0;
        }

        .footer {
          text-align: center;
          padding: 0 40px 32px 40px;
        }

        .footer-links {
          margin-bottom: 16px;
        }

        .footer-link {
          font-size: 13px;
          color: ${brandPrimary};
          text-decoration: none;
          margin: 0 10px;
          font-weight: 600;
        }

        .footer-text {
          font-size: 12px;
          color: #94a3b8;
          margin: 4px 0;
        }

        .brand-footer {
          display: none;
        }

        @media screen and (max-width: 480px) {
          .main-container {
            margin: 20px 10px;
          }
          .content {
            padding: 10px 24px;
          }
          .otp-code {
            font-size: 38px;
            letter-spacing: 8px;
          }
          .greeting {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <div class="main-container">
          <div class="header">
            <img src="https://storage-console.POS.gov.la/POS-public-storage/images/original/5b7156ce-6aab-4626-8c71-cf577b4bcbaf.jpeg" alt="Smart POS Logo" class="logo" />
            <h1 class="brand-title">Smart POS</h1>
          </div>
          
          <div class="content">
            <h1 class="greeting">${t.greeting}</h1>
            <p class="description">
              ${t.description}
            </p>
            
            <div class="otp-container">
              <span class="otp-label">${t.otpLabel}</span>
              <div class="otp-code">${otpCode}</div>
              <span class="otp-hint">${t.otpHint}</span>
            </div>
            
            <div class="expiration">
              ⏱ ${t.validFor}
            </div>
            
            <div class="security-section">
              <div class="security-title">
                🛡️ ${t.safetyTitle}
              </div>
              <p class="security-text">
                ${t.safetyText}
              </p>
            </div>
          </div>
          <div class="footer">
            <div class="footer-links">
              <a href="#" class="footer-link">${t.helpCenter}</a>
              <a href="#" class="footer-link">${t.privacyPolicy}</a>
              <a href="#" class="footer-link">${t.support}</a>
            </div>
            <p class="footer-text">${t.rights}</p>
            <p class="footer-text">${t.protecting}</p>
          </div>
        </div>
      </center>
    </body>
    </html>
  `;
};
exports.getOtpEmailTemplate = getOtpEmailTemplate;
