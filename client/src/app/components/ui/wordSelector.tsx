type WordSelectorProps = {
  words: string[];
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
};

type WordProps = {
  word: string;
  isSelected: boolean;
  onToggle: () => void;
};

function Word({ word, isSelected, onToggle }: WordProps) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-md font-medium ${
        isSelected
          ? "bg-indigo-700 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {word}
    </button>
  );
}

export default function WordSelector({
  words,
  selectedWords,
  setSelectedWords,
}: WordSelectorProps) {
  const toggleWordSelection = (word: string) => {
    setSelectedWords((prevSelected) =>
      prevSelected.includes(word)
        ? prevSelected.filter((w) => w !== word) // Unselect if already selected
        : [...prevSelected, word] // Select if not already selected
    );
  };

  return (
    <div className="p-4 rounded-md shadow-md ml-48 mr-48">
      <div className="flex flex-wrap justify-center items-center gap-6">
        {words.map((word) => (
          <Word
            key={word}
            word={word}
            isSelected={selectedWords.includes(word)}
            onToggle={() => toggleWordSelection(word)}
          />
        ))}
      </div>
    </div>
  );
}