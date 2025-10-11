import ResourceImage from "@/components/ResourceImage";
import { Box } from "@pawpal/ui/core";

const ColumnImage = (props: { image: string; title: string }) => {
  return (
    <Box w={64} h={64}>
      <ResourceImage
        src={props.image}
        alt={props.title}
        fallbackSrc="/assets/images/fallback-carousel.jpg"
        width={64}
        height={64}
      />
    </Box>
  );
};

export default ColumnImage;
