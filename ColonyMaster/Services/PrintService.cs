using System.Globalization;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using ColonyMaster.Services.Interfaces;
using ColonyMaster.DTOs;

namespace ColonyMaster.Services
{
    /// <summary>
    /// PDF renderer using PdfSharpCore. Produces a basic template inspired by the provided sample.
    /// </summary>
    public class PrintService : IPrintService
    {
        private const double PageWidth = 595; // A4 72dpi approx 595x842
        private const double PageHeight = 842;

        public async Task<byte[]> RenderInvoicePdfAsync(InvoiceDto invoice)
        {
            using var doc = new PdfDocument();
            var page = doc.AddPage();
            page.Width = PageWidth;
            page.Height = PageHeight;

            using var gfx = XGraphics.FromPdfPage(page);

            // Fonts
            var fontRegular = new XFont("Arial", 10, XFontStyle.Regular);
            var fontBold = new XFont("Arial", 10, XFontStyle.Bold);
            var fontTitle = new XFont("Arial", 14, XFontStyle.Bold);

            double margin = 40;

            // Company title centered at top
            var companyName = "Colony Master Carpet Clean LLC";
            var companyFont = new XFont("Arial", 16, XFontStyle.Bold);
            var companySize = gfx.MeasureString(companyName, companyFont);
            gfx.DrawString(companyName, companyFont, XBrushes.Black, new XRect((page.Width - companySize.Width) / 2, margin - 8, companySize.Width, companySize.Height), XStringFormats.TopLeft);

            // Draw logo if available (below company title)
            var logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "company-logo.jpeg");
            double y = margin + companySize.Height + 4;
            if (File.Exists(logoPath))
            {
                using var logoStream = File.OpenRead(logoPath);
                using var ximg = XImage.FromStream(() => logoStream);
                double logoWidth = 80;
                double logoHeight = (ximg.PixelHeight / (double)ximg.PixelWidth) * logoWidth;
                gfx.DrawImage(ximg, margin, y, logoWidth, logoHeight);
            }

            // Date and receipt on the right
            var rightBlockX = page.Width - margin - 220;
            // Draw label and value with a bit of separation; make Date label/value bold
            gfx.DrawString("Date:", fontBold, XBrushes.Black, new XRect(rightBlockX, y, 50, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.Date.ToString("MM/dd/yyyy"), fontBold, XBrushes.Black, new XRect(rightBlockX + 60, y, 160, 16), XStringFormats.TopLeft);
            gfx.DrawString("Receipt #:", fontRegular, XBrushes.Black, new XRect(rightBlockX, y + 18, 80, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.ConsecutiveNumber, fontBold, XBrushes.Black, new XRect(rightBlockX + 60, y + 18, 160, 16), XStringFormats.TopLeft);

            y += 110;

            // Client name centered (bold) above details
            var clientName = invoice.ClientName ?? string.Empty;
            if (!string.IsNullOrWhiteSpace(clientName))
            {
                var clientNameFont = new XFont("Arial", 12, XFontStyle.Bold);
                var clientNameSize = gfx.MeasureString(clientName, clientNameFont);
                gfx.DrawString(clientName, clientNameFont, XBrushes.Black, new XRect((page.Width - clientNameSize.Width) / 2, y, clientNameSize.Width, clientNameSize.Height), XStringFormats.TopLeft);
                y += clientNameSize.Height + 6;
            }

            // Title line
            gfx.DrawLine(XPens.Black, margin, y, page.Width - margin, y);
            y += 8;

            // From and Sold To columns
            double colWidth = (page.Width - margin * 2) / 2;
            double leftX = margin;
            double rightX = margin + colWidth;

            gfx.DrawString("From:", fontBold, XBrushes.Black, new XRect(leftX, y, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.FromName ?? string.Empty, fontRegular, XBrushes.Black, new XRect(leftX, y + 16, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.FromAddress ?? string.Empty, fontRegular, XBrushes.Black, new XRect(leftX, y + 32, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString((invoice.FromCity ?? string.Empty) + ", " + (invoice.FromState ?? string.Empty) + " " + (invoice.FromPostalCode ?? string.Empty), fontRegular, XBrushes.Black, new XRect(leftX, y + 48, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString("SIN: " + (invoice.FromSIN ?? string.Empty), fontRegular, XBrushes.Black, new XRect(leftX, y + 64, colWidth, 16), XStringFormats.TopLeft);

            gfx.DrawString("Sold To:", fontBold, XBrushes.Black, new XRect(rightX, y, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.ClientName ?? string.Empty, fontRegular, XBrushes.Black, new XRect(rightX, y + 16, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString(invoice.SoldAddress ?? string.Empty, fontRegular, XBrushes.Black, new XRect(rightX, y + 32, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString((invoice.SoldCity ?? string.Empty) + ", " + (invoice.SoldState ?? string.Empty) + " " + (invoice.SoldPostalCode ?? string.Empty), fontRegular, XBrushes.Black, new XRect(rightX, y + 48, colWidth, 16), XStringFormats.TopLeft);
            gfx.DrawString("SIN: " + (invoice.SoldSIN ?? string.Empty), fontRegular, XBrushes.Black, new XRect(rightX, y + 64, colWidth, 16), XStringFormats.TopLeft);

            y += 110;

            // Table header
            double tableX = margin;
            double tableY = y;
            double tableWidth = page.Width - margin * 2;
            double descWidth = tableWidth * 0.55;
            double qtyWidth = tableWidth * 0.12;
            double unitWidth = tableWidth * 0.16;
            double totalWidth = tableWidth - descWidth - qtyWidth - unitWidth;

            // Header background (pastel red)
            var pastelRed = XColor.FromArgb(255, 255, 204, 204);
            var pastelBrush = new XSolidBrush(pastelRed);
            gfx.DrawRectangle(pastelBrush, tableX, tableY, tableWidth, 20);
            gfx.DrawRectangle(XPens.Black, tableX, tableY, tableWidth, 20);
            gfx.DrawString("Description", fontBold, XBrushes.Black, new XRect(tableX + 4, tableY + 4, descWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString("Quantity", fontBold, XBrushes.Black, new XRect(tableX + descWidth + 4, tableY + 4, qtyWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString("Unit Price", fontBold, XBrushes.Black, new XRect(tableX + descWidth + qtyWidth + 4, tableY + 4, unitWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString("Total", fontBold, XBrushes.Black, new XRect(tableX + descWidth + qtyWidth + unitWidth + 4, tableY + 4, totalWidth, 12), XStringFormats.TopLeft);

            y = tableY + 24;

            // Table rows
            var details = invoice.Details ?? new List<InvoiceDetailDto>();
            foreach (var d in details)
            {
                gfx.DrawRectangle(XPens.Black, tableX, y, tableWidth, 20);
                gfx.DrawString(d.Description ?? string.Empty, fontRegular, XBrushes.Black, new XRect(tableX + 4, y + 4, descWidth - 8, 12), XStringFormats.TopLeft);
                gfx.DrawString(d.Quantity.ToString(CultureInfo.InvariantCulture), fontRegular, XBrushes.Black, new XRect(tableX + descWidth + 4, y + 4, qtyWidth - 8, 12), XStringFormats.TopLeft);
                gfx.DrawString(d.UnitPrice.ToString("C"), fontRegular, XBrushes.Black, new XRect(tableX + descWidth + qtyWidth + 4, y + 4, unitWidth - 8, 12), XStringFormats.TopLeft);
                var lineTotal = (d.Quantity * d.UnitPrice).ToString("C");
                gfx.DrawString(lineTotal, fontRegular, XBrushes.Black, new XRect(tableX + descWidth + qtyWidth + unitWidth + 4, y + 4, totalWidth - 8, 12), XStringFormats.TopLeft);
                y += 22;
            }

            // Summary and payment area
            y += 10;

            // Left: Payment method and notes
            double leftAreaX = tableX;
            double leftAreaWidth = descWidth + qtyWidth;
            gfx.DrawString("Payment Method:", fontBold, XBrushes.Black, new XRect(leftAreaX, y, leftAreaWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(invoice.PaymentMethod ?? string.Empty, fontRegular, XBrushes.Black, new XRect(leftAreaX + 110, y, leftAreaWidth - 110, 12), XStringFormats.TopLeft);
            y += 18;

            gfx.DrawString("Notes:", fontBold, XBrushes.Black, new XRect(leftAreaX, y, leftAreaWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(invoice.Notes ?? string.Empty, fontRegular, XBrushes.Black, new XRect(leftAreaX, y + 14, leftAreaWidth, 36), XStringFormats.TopLeft);

            // Right: Subtotal, Taxes, Total, Amount Paid
            var totalsX = tableX + descWidth + qtyWidth;
            double labelWidth = unitWidth;
            double valueX = totalsX + labelWidth + 8;

            decimal taxes = invoice.Taxes;
            decimal totalAmount = invoice.Total;
            decimal subtotal = totalAmount - taxes;

            gfx.DrawString("Subtotal:", fontRegular, XBrushes.Black, new XRect(totalsX, y, labelWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(subtotal.ToString("C"), fontRegular, XBrushes.Black, new XRect(valueX, y, totalWidth - 8, 12), XStringFormats.TopRight);
            y += 16;

            gfx.DrawString("Taxes:", fontRegular, XBrushes.Black, new XRect(totalsX, y, labelWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(taxes.ToString("C"), fontRegular, XBrushes.Black, new XRect(valueX, y, totalWidth - 8, 12), XStringFormats.TopRight);
            y += 16;

            gfx.DrawString("Total:", fontBold, XBrushes.Black, new XRect(totalsX, y, labelWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(totalAmount.ToString("C"), fontBold, XBrushes.Black, new XRect(valueX, y, totalWidth - 8, 12), XStringFormats.TopRight);
            y += 20;

            gfx.DrawString("Amount Paid:", fontRegular, XBrushes.Black, new XRect(totalsX, y, labelWidth, 12), XStringFormats.TopLeft);
            gfx.DrawString(invoice.AmountPaid.ToString("C"), fontRegular, XBrushes.Black, new XRect(valueX, y, totalWidth - 8, 12), XStringFormats.TopRight);

            // Footer
            gfx.DrawString("ColonyMaster - Generated PDF", fontRegular, XBrushes.Gray, new XRect(0, page.Height - margin, page.Width, 12), XStringFormats.Center);

            // Save to memory stream
            using var ms = new MemoryStream();
            doc.Save(ms);
            ms.Position = 0;
            return await Task.FromResult(ms.ToArray());
        }
    }
}
