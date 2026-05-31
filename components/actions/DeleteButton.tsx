type DeleteButtonProps = {
  onClick?: () => void;
};

export default function DeleteButton({
  onClick,
}: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        cursor-pointer
        hover:scale-110
        transition
      "
    >
      🗑️
    </button>
  );
}