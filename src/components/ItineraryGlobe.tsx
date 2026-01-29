import React, { useEffect, useMemo, useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

export type ItineraryPlace = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

type Arc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export default function ItineraryGlobe({
  places,
  autoRotateSpeed = 0.18,
}: {
  places: ItineraryPlace[];
  autoRotateSpeed?: number;
}) {
  const globeRef = useRef<GlobeMethods | null>(null);

  // Nettoyage des lieux (lat/lng obligatoires)
  const cleanPlaces = useMemo(() => {
    return (places || []).filter(
      (p) => isFiniteNumber(p.lat) && isFiniteNumber(p.lng)
    );
  }, [places]);

  // Arcs: trajet complet dans l'ordre du tableau
  const arcs: Arc[] = useMemo(() => {
    if (cleanPlaces.length < 2) return [];
    const out: Arc[] = [];
    for (let i = 0; i < cleanPlaces.length - 1; i++) {
      out.push({
        startLat: cleanPlaces[i].lat,
        startLng: cleanPlaces[i].lng,
        endLat: cleanPlaces[i + 1].lat,
        endLng: cleanPlaces[i + 1].lng,
      });
    }
    return out;
  }, [cleanPlaces]);

  // Points
  const pointsData = useMemo(() => {
    return cleanPlaces.map((p, idx) => ({
      id: p.id ?? String(idx),
      name: p.name ?? `Étape ${idx + 1}`,
      lat: p.lat,
      lng: p.lng,
      order: idx + 1,
    }));
  }, [cleanPlaces]);

  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Point de vue initial (altitude plus élevée pour voir le trajet)
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);
  }, [autoRotateSpeed]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        // globe sombre + relief
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        // Atmosphère légère (colle à la palette SacredWorld)
        atmosphereColor="#34E0A1"
        atmosphereAltitude={0.15}

        // Points (étapes)
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointRadius={0.35}
        pointAltitude={0.01}
        pointColor={() => '#F4C542'}
        pointLabel={(p: any) => `${p.name}`}

        // Trajet (arcs)
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => '#F4C542'}
        arcAltitude={0.25}
        arcStroke={0.6}
        arcDashLength={0.6}
        arcDashGap={1.2}
        arcDashAnimateTime={2400}
      />
    </div>
  );
}
