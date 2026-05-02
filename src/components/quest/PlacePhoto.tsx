// PlacePhoto — renders a verified photograph if it loads, or the
// typographic PlaceSymbol if the image 404s / is missing.
//
// This replaces the previous pattern of falling back to a JPEG
// placeholder file (`/images/place-placeholder.jpg`) on load error,
// which was a baroque cathedral image that ended up captioning every
// broken-image case across the app — Khufu pyramids, museums, etc.
// Honest fallback now: a typographic identity card, not a wrong photo.

import { useEffect, useState } from 'react';
import { PlaceSymbol } from './PlaceSymbol';

interface Props {
  src?: string;
  alt: string;
  type?: string;
  name?: string;
  className?: string;
  /** Forward-pass through to PlaceSymbol so the contribute CTA can attach. */
  placeId?: string;
}

export const PlacePhoto = ({ src, alt, type, name, className = '', placeId }: Props) => {
  const [errored, setErrored] = useState(false);

  // Reset error state when the src changes — without this, a card whose
  // image errored once would stay stuck on PlaceSymbol even after a new
  // src arrives (e.g. IMAGE_OVERRIDES enriches a Wikidata entry on a
  // subsequent render).
  useEffect(() => { setErrored(false); }, [src]);

  if (!src || errored) {
    return (
      <div className={className}>
        <PlaceSymbol type={type} name={name} placeId={placeId} />
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
