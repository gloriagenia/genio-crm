export async function preprocessImage(
  file: File
): Promise<string> {

  return new Promise(
    (resolve) => {

      const reader =
        new FileReader();

      reader.onload = (
        event
      ) => {

        const img =
          new Image();

        img.onload = () => {

          const canvas =
            document.createElement(
              "canvas"
            );

          const ctx =
            canvas.getContext(
              "2d"
            );

          if (!ctx) return;

          // resize kecil
          const maxWidth =
            1000;

          const scale =
            maxWidth /
            img.width;

          canvas.width =
            maxWidth;

          canvas.height =
            img.height *
            scale;

          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.7
            )
          );

        };

        img.src =
          event.target
            ?.result as string;

      };

      reader.readAsDataURL(
        file
      );

    }
  );

}