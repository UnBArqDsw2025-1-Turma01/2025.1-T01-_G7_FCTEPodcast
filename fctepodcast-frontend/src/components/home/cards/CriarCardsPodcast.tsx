import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";

interface PodcastCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  onPress?: () => void;
  index?: number;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const PodcastCard = ({
  title,
  subtitle,
  description,
  imageUrl,
  onPress,
  index = 0,
}: PodcastCardProps) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className="min-w-[100px]"
    >
      <Card
        isPressable
        shadow="sm"
        onPress={onPress || (() => console.log(`${title} card pressed`))}
        className="py-4"
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-roboto uppercase font-bold">{subtitle}</p>
          <small className="text-default-500">{description}</small>
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt={`${title} cover`}
            className="object-cover rounded-xl"
            src={imageUrl}
            width={200}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PodcastCard;
