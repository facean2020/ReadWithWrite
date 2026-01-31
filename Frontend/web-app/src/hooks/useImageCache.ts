import { useState, useEffect, useRef } from 'react';
import { ImageLRUCache } from '@/utilities/lruCache';
import { getImageFromCache, putImageInCache } from '@/utilities/persistentCache';
import { convertToJPEG } from '@/utilities/convertToJPEG';

// Global in-memory LRU cache for images
const lruCache = new ImageLRUCache(100); // Capacity of 100 images

export interface UseImageCacheResult {
    src: string | null;
    loading: boolean;
    error: string | null;
}

export function useImageCache(imageUrl: string | null): UseImageCacheResult {
    const [state, setState] = useState<UseImageCacheResult>({
        src: null,
        loading: !!imageUrl,
        error: null,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!imageUrl) {
            setState({ src: null, loading: false, error: null });
            return;
        }

        // 1. Check in-memory LRU cache synchronously
        const cachedBlobUrl = lruCache.get(imageUrl);
        if (cachedBlobUrl) {
            setState({ src: cachedBlobUrl, loading: false, error: null });
            return;
        }

        let isMounted = true;
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const loadImage = async () => {
            setState({ src: null, loading: true, error: null });

            // 2. Check persistent cache
            try {
                const blob = await getImageFromCache(imageUrl);
                if (blob) {
                    const objectUrl = URL.createObjectURL(blob);
                    lruCache.put(imageUrl, objectUrl);
                    if (isMounted) {
                        setState({ src: objectUrl, loading: false, error: null });
                    }
                    return;
                }
            } catch (err) {
                console.warn('Persistent cache access failed:', err);
            }

            // 3. Fetch from network
            try {
                const response = await fetch(imageUrl, { signal: abortController.signal });
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }

                const blob = await response.blob();
                const finalBlob = await convertToJPEG(new File([blob], 'image', { type: blob.type }), 0.6);
                
                // Save to persistent cache
                await putImageInCache(imageUrl, finalBlob);
                
                // Create object URL and store in LRU
                const objectUrl = URL.createObjectURL(finalBlob);
                lruCache.put(imageUrl, objectUrl);

                if (isMounted) {
                    setState({ src: objectUrl, loading: false, error: null });
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                
                if (isMounted) {
                    setState({ 
                        src: null, 
                        loading: false, 
                        error: err instanceof Error ? err.message : 'Unknown error occurred' 
                    });
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [imageUrl]);

    return state;
}