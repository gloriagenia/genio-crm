type EditButtonProps = {
  onClick?: () => void;
};

export default function EditButton({
  onClick,
}: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        cursor-pointer
        hover:scale-110
        transition
      "
    >
      ✏️
    </button>
  );
}