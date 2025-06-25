export const isImageBright = (imageSrc: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Para evitar problemas de CORS se a imagem permitir

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(false);

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r,
        g,
        b,
        brightnessSum = 0;
      const sampleSize = 10; // Para otimizar, podemos amostrar 1 a cada N pixels

      for (let i = 0; i < data.length; i += 4 * sampleSize) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        // Fórmula de luminância aproximada
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        brightnessSum += brightness;
      }

      const averageBrightness =
        brightnessSum / (data.length / (4 * sampleSize));

      resolve(averageBrightness > 130); // Limite ajustável: acima de 130 considera imagem clara
    };

    img.onerror = () => resolve(false); // Se der erro, assume como escura

    img.src = imageSrc;
  });
};
