const express = require("express");
const { body, validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post(
  "/",
  [
    body("companyName").trim().notEmpty().withMessage("Company name is required"),
    body("contactPerson").trim().notEmpty().withMessage("Contact person is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("interestedService").trim().notEmpty().withMessage("Interested service is required"),
    body("message")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { companyName, contactPerson, email, interestedService, message } = req.body;

    try {
      // ── Email to Investerly team ────────────────────────────────────────
      await sendEmail({
        to: process.env.RECIPIENT_EMAIL,
        subject: `New Partner Enquiry — ${companyName}`,
        replyTo: email,
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1a2e1a,#2f6b35);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:1px;">INVESTERLY</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">New Partnership Request</p>
            </div>
            <!-- Body -->
            <div style="padding:36px 40px;background:#ffffff;">
              <h2 style="color:#1a2e1a;font-size:18px;margin:0 0 24px;">Partner Enquiry Details</h2>
              <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;">
                <tr style="background:#f1f5f1;">
                  <td style="padding:13px 16px;font-size:13px;color:#6b7280;font-weight:600;width:160px;border-bottom:1px solid #e5e7eb;">COMPANY</td>
                  <td style="padding:13px 16px;font-size:15px;color:#1a2e1a;font-weight:600;border-bottom:1px solid #e5e7eb;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding:13px 16px;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">CONTACT PERSON</td>
                  <td style="padding:13px 16px;font-size:15px;color:#374151;border-bottom:1px solid #e5e7eb;">${contactPerson}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:13px 16px;font-size:13px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb;">EMAIL</td>
                  <td style="padding:13px 16px;font-size:15px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${email}" style="color:#2f6b35;text-decoration:none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:13px 16px;font-size:13px;color:#6b7280;font-weight:600;">INTERESTED SERVICE</td>
                  <td style="padding:13px 16px;">
                    <span style="display:inline-block;background:#dcfce7;color:#166534;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">${interestedService}</span>
                  </td>
                </tr>
              </table>

              ${message ? `
              <div style="margin-top:24px;">
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:600;">ADDITIONAL DETAILS</p>
                <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;padding:16px;background:#f9fafb;border-radius:8px;">${message}</p>
              </div>
              ` : ""}

              <div style="margin-top:28px;padding:16px;background:#f0fdf4;border-left:4px solid #2f6b35;border-radius:0 8px 8px 0;">
                <p style="margin:0;font-size:13px;color:#166534;">
                  Reply directly to this email to respond to <strong>${contactPerson}</strong> at <strong>${email}</strong>
                </p>
              </div>
            </div>
            <!-- Footer -->
            <div style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Investerly · AMFI Registered Mutual Fund Distributor</p>
            </div>
          </div>
        `,
      });

      // ── Auto-reply to partner ───────────────────────────────────────────
      await sendEmail({
        to: email,
        subject: "Partnership Request Received — Investerly",
        replyTo: process.env.RECIPIENT_EMAIL,
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#1a2e1a,#2f6b35);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:1px;">INVESTERLY</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Partnership Request Received</p>
            </div>
            <div style="padding:36px 40px;background:#ffffff;">
              <p style="color:#1a2e1a;font-size:16px;margin:0 0 16px;">Hi <strong>${contactPerson}</strong>,</p>
              <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Thank you for expressing your interest in partnering with Investerly. We've received your
                request for <strong>${interestedService}</strong> and our partnership team will review
                it and reach out to you within <strong>24–48 hours</strong>.
              </p>
              <div style="background:#f1f5f1;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:13px;color:#6b7280;font-weight:600;">YOUR SUBMISSION</p>
                <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Company:</strong> ${companyName}</p>
                <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Service of Interest:</strong> ${interestedService}</p>
              </div>
              <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;">
                For urgent queries, reach us at
                <a href="tel:+917778882822" style="color:#2f6b35;">+91 7778882822</a> or
                <a href="mailto:admin@investerly.in" style="color:#2f6b35;">admin@investerly.in</a>.
              </p>
            </div>
            <div style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Investerly · AMFI Registered Mutual Fund Distributor</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">6003, World Trade Center, Ring Road, Surat 395007</p>
            </div>
          </div>
        `,
      });

      res.json({ success: true, message: "Partner enquiry sent successfully" });
    } catch (error) {
      console.error("Partner email error:", error);
      res.status(500).json({ success: false, message: "Unable to send partner enquiry" });
    }
  }
);

module.exports = router;
