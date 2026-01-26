import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.svg";

export const boardPlaceholders = [img1, img2, img3, img4];

export const getRandomBoardThumbnail = (seed) => {
  if (!seed) {
    return boardPlaceholders[
      Math.floor(Math.random() * boardPlaceholders.length)
    ];
  }

  let hash = 0;
  const str = seed.toString();

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convert to 32bit int
  }

  const index = Math.abs(hash) % boardPlaceholders.length;
  return boardPlaceholders[index];
};

