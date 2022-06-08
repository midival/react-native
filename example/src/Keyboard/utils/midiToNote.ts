const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
]

export const midiToNote = (midiNote: number): string => {
    return (notes[midiNote % 12]) + " " + (Math.floor(midiNote / 12) - 2);
}