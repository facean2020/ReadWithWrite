export async function convertToJPEG(file: File, quality: number = 0.6): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            
            const targetRatio = 3 / 2;
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            const imgRatio = imgWidth / imgHeight;

            let sx, sy, sWidth, sHeight;

            if (imgRatio > targetRatio) {
                // Image is wider than 3:2, crop left/right
                sHeight = imgHeight;
                sWidth = imgHeight * targetRatio;
                sx = (imgWidth - sWidth) / 2;
                sy = 0;
            } else {
                // Image is taller than 3:2, crop top/bottom
                sWidth = imgWidth;
                sHeight = imgWidth / targetRatio;
                sx = 0;
                sy = (imgHeight - sHeight) / 2;
            }

            const canvas = document.createElement('canvas');
            canvas.width = sWidth;
            canvas.height = sHeight;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

            // If original file is larger than 400KB, use specified quality; else use max quality
            const finalQuality = file.size > 400 * 1024 ? quality : 1.0;

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob returned null'));
                    }
                },
                'image/jpeg',
                finalQuality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}