import { LazyLoadImage } from "react-lazy-load-image-component";

type LazyLoadImageProps = React.ComponentProps<typeof LazyLoadImage>;

function getImageProps(props?: LazyLoadImageProps): LazyLoadImageProps {
  return {
    ...props,
    effect: "opacity",
    wrapperProps: { className: "relative w-full rounded-xl overflow-hidden" },
    className: "w-full object-cover h-auto max-h-[500px] h-full object-center"
  };
}

export function FeedImageGallary(props: { images: { url: string; alt: string }[] }) {
  const { images } = props;
  const count = images.length;

  if (!count) return null;

  if (count === 1) {
    return <LazyLoadImage {...getImageProps({ src: images[0].url, alt: images[0].alt })} />;
  }

  if (count === 2) {
    return (
      <div className="flex max-h-[500px]  flex-row gap-1 overflow-hidden">
        {images.map((image, index) => (
          <LazyLoadImage key={index} {...getImageProps({ src: image.url, alt: image.alt })} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex max-h-[500px] flex-row  gap-1 overflow-hidden">
        <LazyLoadImage {...getImageProps({ src: images[0].url, alt: images[0].alt })} />
        <div className="flex w-1/2 flex-col gap-1">
          {images.slice(1).map((image, index) => (
            <LazyLoadImage key={index} {...getImageProps({ src: image.url, alt: image.alt })} />
          ))}
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid max-h-[1000px] grid-cols-2  gap-1 overflow-hidden">
        {images.map((image, index) => (
          <LazyLoadImage key={index} {...getImageProps({ src: image.url, alt: image.alt })} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1  overflow-hidden">
      {images.map((image, index) => (
        <LazyLoadImage key={index} {...getImageProps({ src: image.url, alt: image.alt })} />
      ))}
    </div>
  );
}
