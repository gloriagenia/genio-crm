export async function cropCenterBanner(
  imageSrc: string
): Promise<string> {

  return new Promise(
    (resolve, reject) => {

      const image =
        new Image();

      image.crossOrigin =
        "anonymous";

      image.src =
        imageSrc;

      image.onload =
        () => {

          try {

            const canvas =
              document.createElement(
                "canvas"
              );

            const ctx =
              canvas.getContext(
                "2d"
              );

            if (!ctx) {

              resolve(
                imageSrc
              );

              return;

            }

            // ====================
            // CROP TENGAH
            // ====================

            const cropWidth =
              image.width * 0.55;

            const cropHeight =
              image.height * 0.45;

            const cropX =
              (image.width -
                cropWidth) /
              2;

            const cropY =
              (image.height -
                cropHeight) /
              2;

            canvas.width =
              cropWidth;

            canvas.height =
              cropHeight;

            ctx.drawImage(

              image,

              cropX,
              cropY,

              cropWidth,
              cropHeight,

              0,
              0,

              cropWidth,
              cropHeight

            );

            const result =
              canvas.toDataURL(
                "image/jpeg",
                1
              );

            resolve(result);

          } catch (error) {

            console.log(
              error
            );

            resolve(
              imageSrc
            );

          }

        };

      image.onerror =
        () => {

          resolve(
            imageSrc
          );

        };

    }
  );

}