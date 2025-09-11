// @ts-nocheck
// Sticky Player Management
export class StickyPlayer {
    constructor() {
        this.stickyPlayer = document.getElementById('stickyPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.playerAlbumArt = document.getElementById('playerAlbumArt');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeFill = document.getElementById('volumeFill');
        
        this.currentTrackIndex = -1;
        this.tracks = [];
        this.isVisible = false;
        this.currentAudio = null;
        
        this.init();
    }
    
    init() {
        console.log('🎵 StickyPlayer: Initialisation...');
        
        // Collect all tracks that have audio elements
        const allContainers = document.querySelectorAll('.album-container');
        let trackIndex = 0;
        
        allContainers.forEach((container, domIndex) => {
            const audio = container.querySelector('audio');
            if (audio) {
                const title = audio.getAttribute('data-title') || `Track ${trackIndex + 1}`;
                const artist = audio.getAttribute('data-artist') || 'Unknown Artist';
                const albumArtImg = container.querySelector('.album-cover-closed img');
                const albumArt = albumArtImg?.src || '/images/covers/funky-thierry-closed.png';
                const audioSrc = audio.querySelector('source')?.src || 'no source';
                
                console.log(`📀 Track ${trackIndex} (DOM ${domIndex}): "${title}" by ${artist}`);
                console.log(`   🎵 Source: ${audioSrc}`);
                console.log(`   🖼️ Cover: ${albumArt}`);
                
                // Store with trackIndex (not domIndex) for consistency
                this.tracks.push({ audio, title, artist, albumArt, container, index: trackIndex, domIndex });
                trackIndex++;
            } else {
                console.log(`⚠️ Container DOM ${domIndex}: Pas d'audio trouvé`);
            }
        });
        
        console.log(`🎶 Total tracks found: ${this.tracks.length}`);
        
        this.setupControls();
        this.setupProgress();
        this.setupVolume();

        // Initialiser le volume à 70% par défaut
        this.setVolume(0.7);
    }
    
    show() {
        if (!this.isVisible) {
            this.stickyPlayer.classList.add('visible');
            this.isVisible = true;
        }
    }
    
    hide() {
        if (this.isVisible) {
            this.stickyPlayer.classList.remove('visible');
            this.isVisible = false;
        }
    }
    
    loadTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            const track = this.tracks[index];
            this.currentTrackIndex = index;
            this.currentAudio = track.audio;
            
            // Get fresh album art
            const albumArtImg = track.container.querySelector('.album-cover-closed img');
            const albumArt = albumArtImg?.src || '/images/covers/funky-thierry-closed.png';
            
            // Update sticky player UI
            this.playerTitle.textContent = track.title;
            this.playerArtist.textContent = track.artist;
            this.playerAlbumArt.src = albumArt;
            
            // Update progress display
            this.updateProgress();
            this.updateDuration();

            // Appliquer le volume actuel au nouveau track
            if (this.currentAudio) {
                const currentVolume = this.getCurrentVolume();
                this.currentAudio.volume = currentVolume;
                console.log(`🔊 Volume appliqué au nouveau track: ${(currentVolume * 100).toFixed(0)}%`);
            }
        }
    }
    
    playTrack(index) {
        console.log(`▶️ StickyPlayer: Tentative de lecture du track ${index}`);
        
        // Stop current track if playing
        this.stopAllTracks();
        
        // Load and play new track
        this.loadTrack(index);
        this.show();
        
        if (this.currentAudio) {
            console.log(`🎧 Playing: ${this.tracks[index].title}`);
            this.currentAudio.play().catch((error) => {
                console.error('❌ Erreur lecture audio:', error);
            });
            this.tracks[index].container.classList.add('playing');
        } else {
            console.error('❌ Aucun audio trouvé pour le track', index);
        }
    }
    
    stopAllTracks() {
        console.log('🛑 StickyPlayer: Arrêt de tous les tracks');
        
        // Stop all audio and remove playing states
        this.tracks.forEach((track, index) => {
            track.audio.pause();
            track.audio.currentTime = 0;
            track.container.classList.remove('playing');
            
            console.log(`⏸️ Track ${index}: Animation vinyle arrêtée`);
            
            // Reset album play buttons
            const playButton = track.container.querySelector('.album-play-button svg');
            if (playButton) {
                playButton.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
            }
        });
        
        this.currentAudio = null;
        this.currentTrackIndex = -1;
    }
    
    setupControls() {
        this.playPauseBtn.addEventListener('click', () => {
            console.log('🔘 StickyPlayer: Bouton play/pause cliqué');
            if (this.currentAudio) {
                if (this.currentAudio.paused) {
                    console.log('▶️ StickyPlayer: Lecture via bouton');
                    this.currentAudio.play();
                } else {
                    console.log('⏸️ StickyPlayer: Pause via bouton');
                    this.currentAudio.pause();
                }
            } else {
                console.warn('⚠️ StickyPlayer: Aucun audio actuel');
            }
        });
        
        this.prevBtn.addEventListener('click', () => {
            if (this.currentTrackIndex > 0) {
                this.playTrack(this.currentTrackIndex - 1);
            } else {
                this.playTrack(this.tracks.length - 1); // Loop to last
            }
        });
        
        this.nextBtn.addEventListener('click', () => {
            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.playTrack(this.currentTrackIndex + 1);
            } else {
                this.playTrack(0); // Loop to first
            }
        });
        
        // Setup audio event listeners for each track
        this.tracks.forEach((track, index) => {
            track.audio.addEventListener('play', () => {
                if (index === this.currentTrackIndex) {
                    console.log(`▶️ Audio PLAY event for track ${index}`);
                    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                    
                    // Update album play button
                    const playButton = track.container.querySelector('.album-play-button svg');
                    if (playButton) {
                        playButton.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
                    }
                    
                    // Start vinyl animation
                    track.container.classList.add('playing');
                }
            });
            
            track.audio.addEventListener('pause', () => {
                if (index === this.currentTrackIndex) {
                    console.log(`⏸️ Audio PAUSE event for track ${index}`);
                    this.playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
                    
                    // Update album play button
                    const playButton = track.container.querySelector('.album-play-button svg');
                    if (playButton) {
                        playButton.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
                    }
                    
                    // Stop vinyl animation
                    track.container.classList.remove('playing');
                }
            });
            
            track.audio.addEventListener('ended', () => {
                if (index === this.currentTrackIndex) {
                    // Auto-play next track
                    this.nextBtn.click();
                }
            });
            
            track.audio.addEventListener('timeupdate', () => {
                if (index === this.currentTrackIndex) {
                    this.updateProgress();
                }
            });
            
            track.audio.addEventListener('loadedmetadata', () => {
                if (index === this.currentTrackIndex) {
                    this.updateDuration();
                }
            });
        });
    }
    
    setupProgress() {
        this.progressBar.addEventListener('click', (e) => {
            if (this.currentAudio) {
                const rect = this.progressBar.getBoundingClientRect();
                const progress = (e.clientX - rect.left) / rect.width;
                this.currentAudio.currentTime = progress * this.currentAudio.duration;
            }
        });
    }
    
    setupVolume() {
        let isDragging = false;

        const updateVolume = (e) => {
            if (!this.volumeSlider) return;

            const rect = this.volumeSlider.getBoundingClientRect();
            const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

            // Utiliser la méthode setVolume pour une gestion cohérente
            this.setVolume(volume);
        };

        // Gestion du clic
        this.volumeSlider.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔘 Volume slider cliqué');
            updateVolume(e);
        });

        // Gestion du drag (souris)
        this.volumeSlider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            console.log('🖱️ Début drag volume');
            updateVolume(e);

            const handleMouseMove = (e) => {
                if (isDragging) {
                    updateVolume(e);
                }
            };

            const handleMouseUp = () => {
                isDragging = false;
                console.log('🖱️ Fin drag volume');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Gestion tactile pour mobile
        this.volumeSlider.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.volumeSlider.dispatchEvent(mouseEvent);
        });

        this.volumeSlider.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isDragging) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                document.dispatchEvent(mouseEvent);
            }
        });

        this.volumeSlider.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup');
            document.dispatchEvent(mouseEvent);
        });

        // Empêcher la sélection de texte pendant le drag
        this.volumeSlider.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }
    
    updateProgress() {
        if (this.currentAudio && this.currentAudio.duration) {
            const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.currentTime.textContent = this.formatTime(this.currentAudio.currentTime);
        }
    }
    
    updateDuration() {
        if (this.currentAudio && this.currentAudio.duration) {
            this.totalTime.textContent = this.formatTime(this.currentAudio.duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Méthodes de gestion du volume
    setVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));

        // Appliquer à tous les tracks
        this.tracks.forEach(track => {
            track.audio.volume = clampedVolume;
        });

        // Mettre à jour l'affichage visuel
        if (this.volumeFill) {
            this.volumeFill.style.width = `${clampedVolume * 100}%`;
        }

        console.log(`🔊 Volume défini à: ${(clampedVolume * 100).toFixed(0)}%`);
    }

    getCurrentVolume() {
        // Retourner le volume du track actuel ou une valeur par défaut
        if (this.currentAudio) {
            return this.currentAudio.volume;
        }

        // Si pas de track actuel, essayer de récupérer depuis le volumeFill
        if (this.volumeFill) {
            const width = this.volumeFill.style.width;
            if (width) {
                return parseFloat(width) / 100;
            }
        }

        // Valeur par défaut
        return 0.7;
    }
}
