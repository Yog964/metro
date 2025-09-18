import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, MapPin, Navigation, Maximize2, Loader2 } from 'lucide-react';

// Import Leaflet dynamically to avoid SSR issues
let L: any = null;
let leafletLoaded = false;

const loadLeaflet = async () => {
  if (typeof window !== 'undefined' && !leafletLoaded) {
    try {
      const leaflet = await import('leaflet');
      L = leaflet.default;
      leafletLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      return false;
    }
  }
  return leafletLoaded;
};

export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'train' | 'depot' | 'station' | 'maintenance';
  status?: 'operational' | 'maintenance' | 'out-of-service' | 'alert';
  details?: {
    description?: string;
    trainNumber?: string;
    capacity?: number;
    nextStop?: string;
    arrivalTime?: string;
  };
}

interface MapComponentProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationClick?: (location: MapLocation) => void;
  className?: string;
  showControls?: boolean;
  clustered?: boolean;
}

export const MapComponent = React.memo(function MapComponent({
  locations,
  center = [9.9312, 76.2673], // Default to Kochi, India
  zoom = 10,
  height = '400px',
  onLocationClick,
  className = '',
  showControls = true,
  clustered = false
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Memoize marker colors to avoid recalculation
  const getMarkerColor = useCallback((type: string, status?: string) => {
    if (status === 'alert') return '#ef4444';
    if (status === 'maintenance') return '#f59e0b';
    if (status === 'out-of-service') return '#6b7280';
    
    switch (type) {
      case 'train': return '#2563eb';
      case 'depot': return '#059669';
      case 'station': return '#7c3aed';
      case 'maintenance': return '#dc2626';
      default: return '#6b7280';
    }
  }, []);

  // Memoize marker icons
  const getMarkerIcon = useCallback((location: MapLocation) => {
    if (!L) return null;
    
    const color = getMarkerColor(location.type, location.status);
    const size = location.type === 'train' ? 14 : 12;
    const isRound = location.type === 'train';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border: 2px solid white;
          border-radius: ${isRound ? '50%' : '3px'};
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: transform 0.15s ease;
        " 
        onmouseover="this.style.transform='translate(-50%, -50%) scale(1.2)'"
        onmouseout="this.style.transform='translate(-50%, -50%) scale(1)'"
        ></div>
      `,
      iconSize: [size + 4, size + 4],
      iconAnchor: [size / 2 + 2, size / 2 + 2]
    });
  }, [getMarkerColor]);

  // Memoize popup content
  const createPopupContent = useCallback((location: MapLocation) => {
    const statusBadge = location.status 
      ? `<span class="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 mb-1">${location.status}</span>`
      : '';
    
    return `
      <div class="p-2 min-w-[180px] max-w-[280px]">
        <div class="mb-2">
          <div class="font-medium text-sm text-gray-900 mb-1">${location.title}</div>
          ${statusBadge}
        </div>
        ${location.details?.description 
          ? `<p class="text-xs text-gray-600 mb-2">${location.details.description}</p>` 
          : ''
        }
        ${location.details?.trainNumber 
          ? `<div class="text-xs mb-1"><span class="font-medium">Train:</span> ${location.details.trainNumber}</div>` 
          : ''
        }
        ${location.details?.nextStop 
          ? `<div class="text-xs mb-1"><span class="font-medium">Next:</span> ${location.details.nextStop}</div>` 
          : ''
        }
        ${location.details?.arrivalTime 
          ? `<div class="text-xs mb-1"><span class="font-medium">ETA:</span> ${location.details.arrivalTime}</div>` 
          : ''
        }
        ${location.details?.capacity 
          ? `<div class="text-xs"><span class="font-medium">Capacity:</span> ${location.details.capacity}</div>` 
          : ''
        }
      </div>
    `;
  }, []);

  // Handle map resize with throttling
  const handleResize = useCallback(() => {
    if (mapInstanceRef.current && mapReady) {
      // Use requestAnimationFrame to throttle resize events
      requestAnimationFrame(() => {
        try {
          mapInstanceRef.current.invalidateSize({ animate: false });
        } catch (error) {
          console.warn('Map resize error:', error);
        }
      });
    }
  }, [mapReady]);

  // Initialize map once
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return null;

    try {
      setIsLoading(true);
      setError(null);

      const loaded = await loadLeaflet();
      if (!loaded || !L) {
        throw new Error('Failed to load map library');
      }

      // Clear any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create map with optimized settings
      const map = L.map(mapRef.current, {
        preferCanvas: true,
        zoomControl: false,
        attributionControl: true,
        maxZoom: 18,
        minZoom: 8,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 100,
        tap: true,
        tapTolerance: 15,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: Infinity,
        bounceAtZoomLimits: false
      });

      // Set initial view
      map.setView(center, zoom);

      // Add tiles with optimized settings
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
        minZoom: 8,
        updateWhenIdle: false,
        updateWhenZooming: false,
        keepBuffer: 2,
        reuseTiles: true
      }).addTo(map);

      // Set up resize observer for the container
      if (containerRef.current && window.ResizeObserver) {
        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(containerRef.current);
      }

      // Listen for window resize as fallback
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleResize, { passive: true });

      mapInstanceRef.current = map;
      setMapReady(true);
      setIsLoading(false);
      
      // Small delay to ensure proper initialization
      setTimeout(() => {
        if (map && mapRef.current) {
          map.invalidateSize({ animate: false });
        }
      }, 100);

      return map;
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to load map');
      setIsLoading(false);
      return null;
    }
  }, [center, zoom, handleResize]);

  // Optimized marker management
  const updateMarkers = useCallback((map: any) => {
    if (!L || !map || !mapReady) return;

    const currentMarkers = markersRef.current;
    const locationIds = new Set(locations.map(loc => loc.id));

    // Remove markers that are no longer needed
    for (const [id, marker] of currentMarkers.entries()) {
      if (!locationIds.has(id)) {
        map.removeLayer(marker);
        currentMarkers.delete(id);
      }
    }

    // Add or update markers
    locations.forEach(location => {
      const existingMarker = currentMarkers.get(location.id);
      
      if (existingMarker) {
        // Update existing marker if position changed
        const currentLatLng = existingMarker.getLatLng();
        if (currentLatLng.lat !== location.lat || currentLatLng.lng !== location.lng) {
          existingMarker.setLatLng([location.lat, location.lng]);
        }
        
        // Update popup content
        existingMarker.setPopupContent(createPopupContent(location));
      } else {
        // Create new marker
        const marker = L.marker([location.lat, location.lng], {
          icon: getMarkerIcon(location),
          riseOnHover: true,
        });

        marker.bindPopup(createPopupContent(location), {
          closeButton: true,
          maxWidth: 300,
          className: 'custom-popup',
          autoPan: true,
          autoPanPadding: [10, 10]
        });
        
        marker.on('click', (e: any) => {
          e.originalEvent?.stopPropagation();
          onLocationClick?.(location);
        });

        marker.addTo(map);
        currentMarkers.set(location.id, marker);
      }
    });

    // Fit bounds if we have locations and map is ready
    if (locations.length > 0 && map.getSize().x > 0) {
      try {
        const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
        const padding = window.innerWidth < 768 ? [10, 10] : [20, 20];
        map.fitBounds(bounds, { 
          padding: padding,
          maxZoom: 15,
          animate: false
        });
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }
  }, [locations, createPopupContent, getMarkerIcon, onLocationClick, mapReady]);

  // Control handlers
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current && mapReady) {
      mapInstanceRef.current.zoomIn(0.5);
    }
  }, [mapReady]);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current && mapReady) {
      mapInstanceRef.current.zoomOut(0.5);
    }
  }, [mapReady]);

  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current && locations.length > 0 && mapReady) {
      try {
        const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
        const padding = window.innerWidth < 768 ? [10, 10] : [20, 20];
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: padding,
          maxZoom: 15,
          animate: true,
          duration: 0.5
        });
      } catch (error) {
        console.warn('Error recentering:', error);
      }
    }
  }, [locations, mapReady]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const newValue = !prev;
      // Trigger resize after fullscreen toggle
      setTimeout(() => {
        handleResize();
      }, 200);
      return newValue;
    });
  }, [handleResize]);

  // Initialize map on mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const setup = async () => {
      timeoutId = setTimeout(async () => {
        const map = await initializeMap();
        if (map) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            updateMarkers(map);
          }, 50);
        }
      }, 100);
    };

    setup();

    return () => {
      clearTimeout(timeoutId);
      
      // Cleanup resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      // Cleanup event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current.clear();
      setMapReady(false);
    };
  }, []); // Only run once on mount

  // Update markers when locations change
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      updateMarkers(mapInstanceRef.current);
    }
  }, [updateMarkers]);

  // Handle fullscreen size changes
  useEffect(() => {
    if (mapInstanceRef.current && mapReady) {
      const timeoutId = setTimeout(() => {
        handleResize();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isFullscreen, handleResize, mapReady]);

  // Memoize legend
  const legend = useMemo(() => (
    <div className="mt-4 flex flex-wrap gap-2">
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        Trains
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-green-600"></div>
        Depots
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-purple-600"></div>
        Stations
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-red-600"></div>
        Maintenance
      </Badge>
    </div>
  ), []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}
    >
      <Card className={`overflow-hidden w-full ${isFullscreen ? 'h-full rounded-none border-0' : ''}`}>
        <div 
          ref={mapRef} 
          style={{ height: isFullscreen ? '100vh' : height }}
          className="relative bg-gray-100 w-full"
        >
          {(isLoading || error) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-[999]">
              <div className="text-center">
                {isLoading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </>
                ) : (
                  <>
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-red-600 mb-2">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => initializeMap()}
                    >
                      Retry
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {showControls && !isLoading && !error && mapReady && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1 z-[1000]">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/95 hover:bg-white shadow-lg border-0 touch-manipulation"
              onClick={handleZoomIn}
              type="button"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/95 hover:bg-white shadow-lg border-0 touch-manipulation"
              onClick={handleZoomOut}
              type="button"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/95 hover:bg-white shadow-lg border-0 touch-manipulation"
              onClick={handleRecenter}
              type="button"
              aria-label="Recenter map"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/95 hover:bg-white shadow-lg border-0 touch-manipulation"
              onClick={toggleFullscreen}
              type="button"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isFullscreen && (
          <Button
            variant="secondary"
            className="absolute top-2 left-2 md:top-4 md:left-4 z-[1000] bg-white/95 hover:bg-white shadow-lg touch-manipulation"
            onClick={toggleFullscreen}
            type="button"
          >
            Exit Fullscreen
          </Button>
        )}
      </Card>

      {!isFullscreen && legend}
    </div>
  );
});