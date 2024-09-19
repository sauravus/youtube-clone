'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function WatchComponent() {
  const videoPrefix = 'https://storage.googleapis.com/saurav-yt-processed-videos/';
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get('v');

  if (!videoSrc) {
    return <div>Video not found</div>;
  }

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  );
}

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchComponent />
    </Suspense>
  );
}
