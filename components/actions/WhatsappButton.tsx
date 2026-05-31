type WhatsappButtonProps = {
  phone?: string;
};

export default function WhatsappButton({
  phone,
}: WhatsappButtonProps) {
  function handleWhatsapp() {
    if (!phone) return;

    window.open(
      `https://wa.me/${phone}`,
      "_blank"
    );
  }

  return (
    <button
      onClick={handleWhatsapp}
      className="
        cursor-pointer
        hover:scale-110
        transition
      "
    >
      📱
    </button>
  );
}