document.addEventListener('DOMContentLoaded', function () {
    // Replace the existing declarations with these:
    const urlInput = document.getElementById('url-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrContainer = document.getElementById('qr-container');
    const qrCodeDiv = document.getElementById('qr-code');
    const urlDisplay = document.getElementById('url-display'); // This was missing
    const downloadBtn = document.getElementById('download-btn');
    const colorSelect = document.getElementById('color-select');
    const bgColorSelect = document.getElementById('bg-color-select');
    const sizeSelect = document.getElementById('size-select');
    const includeUrlCheckbox = document.getElementById('include-url');

    generateBtn.addEventListener('click', generateQRCode);

    function generateQRCode() {
        const url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        // Update URL text display
        urlDisplay.textContent = url;
        urlDisplay.style.display = includeUrlCheckbox.checked ? 'block' : 'none';

        // Determine QR code size based on selection
        const sizeMap = { 1: 150, 2: 250, 3: 350, 4: 450 };
        const size = sizeMap[sizeSelect.value];

        // Clear previous QR code
        qrCodeDiv.innerHTML = '';

        // Generate QR code
        const qr = qrcode(0, 'L');
        qr.addData(url);
        qr.make();

        // Create QR code image
        const qrImg = qr.createImgTag(10, 0, {
            alt: 'QR Code',
            width: size,
            height: size,
            color: colorSelect.value,
            bgColor: bgColorSelect.value
        });

        qrCodeDiv.innerHTML = qrImg;
        qrContainer.style.display = 'flex';

        // Set up download
        const img = qrCodeDiv.querySelector('img');
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const includeUrl = includeUrlCheckbox.checked;

            // Calculate canvas dimensions
            const borderWidth = 2;
            const padding = 20;
            const textHeight = includeUrl ? 50 : 0;
            const totalPadding = padding + (includeUrl ? 30 : 0);

            canvas.width = size + (padding * 2);
            canvas.height = size + totalPadding + textHeight;
            const ctx = canvas.getContext('2d');

            // Draw white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw border
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(
                borderWidth / 2,
                borderWidth / 2,
                canvas.width - borderWidth,
                canvas.height - borderWidth - (includeUrl ? textHeight : 0)
            );

            // Draw QR code centered
            const qrX = (canvas.width - size) / 2;
            const qrY = padding / 2;
            ctx.drawImage(img, qrX, qrY, size, size);

            // Draw URL text if enabled
            if (includeUrl) {
                ctx.fillStyle = '#333333';
                ctx.font = '14px Courier New';
                ctx.textAlign = 'center';

                // Calculate text position
                const textX = canvas.width / 2;
                const textY = size + padding + 25;

                // Draw URL text
                const lines = wrapText(ctx, url, canvas.width - 40);
                lines.forEach((line, i) => {
                    ctx.fillText(line, textX, textY + (i * 16));
                });
            }

            // Update download link
            canvas.toBlob(function (blob) {
                const url = URL.createObjectURL(blob);
                downloadBtn.href = url;
            }, 'image/png');
        };
    }

    // Helper function to wrap text
    function wrapText(context, text, maxWidth) {
        const words = text.split('');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + word).width;
            if (width < maxWidth) {
                currentLine += word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Update display when checkbox changes
    includeUrlCheckbox.addEventListener('change', function () {
        urlTextDiv.style.display = this.checked ? 'block' : 'none';
        if (qrContainer.style.display === 'flex') {
            generateQRCode(); // Regenerate to update download image
        }
    });
});