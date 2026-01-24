import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.svg";

export const boardPlaceholders = [img1, img2, img3, img4];

export const getRandomBoardThumbnail = (seed) => {
  // Stable randomness based on board id
  const index = seed
    ? seed.toString().charCodeAt(0) % boardPlaceholders.length
    : Math.floor(Math.random() * boardPlaceholders.length);

  return boardPlaceholders[index];
};
