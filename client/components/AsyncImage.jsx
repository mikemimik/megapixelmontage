import { InView } from "react-intersection-observer";

import ImageContainer from "./ImageContainer";
import Image from "./Image";

export default function AsyncImage({ photo, initialInView = false }) {
  return (
    <InView rootMargin="600px 0px" initialInView={initialInView} triggerOnce>
      {({ ref, inView }) => {
        return (
          <ImageContainer ref={ref}>
            <Image photo={photo} inView={inView} />
          </ImageContainer>
        );
      }}
    </InView>
  );
}
