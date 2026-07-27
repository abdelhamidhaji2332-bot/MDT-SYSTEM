import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { User, POI } from '../types';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface TacticalMapProps {
  users: User[];
  pois: POI[];
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ users, pois }) => {
  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-full bg-black/80 text-emerald-500 p-8 text-center border border-emerald-500/20 rounded-xl">
        <div className="max-w-md">
          <h2 className="text-xl font-bold mb-4">MAP_DATA_UNAVAILABLE</h2>
          <p className="mb-4">Google Maps API Key Required</p>
          <ul className="text-left text-sm space-y-2 mb-4">
            <li>1. Open Settings (⚙️ gear icon)</li>
            <li>2. Select Secrets</li>
            <li>3. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>4. The app rebuilds automatically.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Map
        defaultCenter={{ lat: 37.42, lng: -122.08 }}
        defaultZoom={13}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '500px' }}
        className="rounded-xl border border-white/10"
      >
        {users.filter(u => u.location).map(u => (
          <AdvancedMarker key={u.id} position={u.location!}>
            <Pin background="#10b981" glyphColor="#fff" />
          </AdvancedMarker>
        ))}
        {pois.filter(p => p.location).map(p => (
          <AdvancedMarker key={p.id} position={p.location!}>
            <Pin background="#ef4444" glyphColor="#fff" />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
};

export default TacticalMap;
