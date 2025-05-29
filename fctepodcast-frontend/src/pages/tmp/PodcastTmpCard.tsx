import type { PodcastType } from "../../utils/types/PodcastType";

const PodcastTmpCard = ({ podcast }: { podcast: PodcastType }) => {
  return <div>{podcast.titulo}</div>;
};

export default PodcastTmpCard;
