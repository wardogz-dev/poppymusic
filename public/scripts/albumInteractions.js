// @ts-nocheck
// Album interactions management
export function initAlbumInteractions(stickyPlayer) {
    console.log('🎨 AlbumInteractions: Initialisation...');
    
    // Create a mapping between DOM containers and track indexes
    const containerToTrackMap = new Map();
    
    // Build the mapping by checking which containers have audio
    let trackIndex = 0;
    document.querySelectorAll('.album-container').forEach((container, domIndex) => {
        const audio = container.querySelector('audio');
        const playButton = container.querySelector('.album-play-button');
        
        if (audio && playButton) {
            containerToTrackMap.set(container, trackIndex);
            console.log(`💿 Album DOM ${domIndex} → Track ${trackIndex}: Listeners ajoutés`);
            
            // Click on album to play
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const actualTrackIndex = containerToTrackMap.get(container);
                const title = audio.getAttribute('data-title') || `Track ${actualTrackIndex}`;
                
                console.log(`🖱️ CLIC sur album DOM ${domIndex} → Track ${actualTrackIndex}: "${title}"`);
                console.log(`📊 État actuel - currentTrackIndex: ${stickyPlayer.currentTrackIndex}, audio.paused: ${audio.paused}`);
                
                // Always use sticky player to control playback
                if (stickyPlayer.currentTrackIndex === actualTrackIndex && !audio.paused) {
                    console.log('⏸️ Pause du track en cours');
                    // Pause current track
                    audio.pause();
                    container.classList.remove('playing');
                    stickyPlayer.hide();
                } else {
                    console.log(`▶️ Lecture du track ${actualTrackIndex} via StickyPlayer`);
                    // Play this track via sticky player
                    stickyPlayer.playTrack(actualTrackIndex);
                }
            });
            
            trackIndex++;
        } else {
            console.warn(`⚠️ Album DOM ${domIndex}: Audio ou bouton manquant`);
        }
    });
    
    console.log(`🎨 AlbumInteractions: ${document.querySelectorAll('.album-container').length} containers DOM, ${trackIndex} tracks avec audio`);
}

// Smooth scroll for navigation
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href')?.substring(1);
            const targetElement = targetId ? document.getElementById(targetId) : null;
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
