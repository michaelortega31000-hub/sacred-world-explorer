// PlacePhoto — renders a verified photograph if it loads, or the
// typographic PlaceSymbol if the image 404s / is missing.
//
// This replaces the previous pattern of falling back to a JPEG
// placeholder file (`/images/place-placeholder.jpg`) on load error,
// which was a baroque cathedral image that ended up captioning every
// broken-image case across the app — Khufu pyramids, museums, etc.
// Honest fallback now: a typographic identity card, not a wrong photo.

import { useState } from 'react';
import { PlaceSymbol } from './PlaceSymbol';

interface Props {
  src?: string;
  alt: string;
  type?: string;
  name?: string;
  className?: string;
}

export const PlacePhoto = ({ src, alt, type, name, className = '' }: Props) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={className}>
        <PlaceSymbol type={type} name={name} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={`${className} object-cover`}
    />
  );
};
