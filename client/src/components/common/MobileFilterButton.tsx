interface MobileFilterButtonProps {
  onClick: () => void;
}

const MobileFilterButton = ({ onClick }: MobileFilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-24 right-4 z-40 flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary p-3 font-bold text-black shadow-2xl transition-transform hover:scale-105 md:hidden sm:right-6 sm:p-4"
  >
    <span className="material-symbols-outlined">tune</span>
   
  </button>
);

export default MobileFilterButton;