// Module de tracking Google Tag Manager pour Poppy Music
export class GTMTracker {
    constructor() {
        this.initialized = false;
        this.userJourney = {
            startTime: null,
            steps: [],
            completed: false,
            abandoned: false
        };
    }

    // Initialisation du tracking
    init() {
        if (this.initialized) return;

        this.userJourney.startTime = new Date().getTime();
        this.initialized = true;

        console.log('🎯 GTM Tracker initialisé');

        // Événement de début de session
        this.trackEvent('session_start', {
            page_url: window.location.href,
            page_title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent
        });
    }

    // Tracking d'événement générique
    trackEvent(eventName, parameters = {}) {
        if (typeof window !== 'undefined' && window.dataLayer) {
            const eventData = {
                event: eventName,
                timestamp: new Date().getTime(),
                ...parameters
            };

            window.dataLayer.push(eventData);
            console.log(`📊 GTM Event: ${eventName}`, eventData);
        } else {
            console.warn('⚠️ GTM not available:', eventName, parameters);
        }
    }

    // Tracking des étapes du formulaire
    trackFormStep(stepNumber, stepName, direction = 'forward') {
        const stepData = {
            step_number: stepNumber,
            step_name: stepName,
            direction: direction,
            time_spent: this.calculateTimeSpent(),
            completion_rate: Math.round((stepNumber / 12) * 100) // 12 étapes totales
        };

        this.userJourney.steps.push({
            step: stepNumber,
            name: stepName,
            timestamp: new Date().getTime(),
            direction: direction
        });

        this.trackEvent('form_step', stepData);

        // Événement spécifique selon l'étape
        switch (stepNumber) {
            case 1:
                this.trackEvent('form_start', {
                    form_name: 'brief_creation',
                    form_type: 'song_brief'
                });
                break;
            case 6:
                this.trackEvent('form_halfway', {
                    progress_percentage: 50
                });
                break;
            case 12:
                this.trackEvent('form_completion', {
                    form_name: 'brief_creation',
                    total_steps: 12,
                    total_time: this.calculateTotalTime()
                });
                break;
        }
    }

    // Tracking de la soumission du formulaire
    trackFormSubmission(formData) {
        this.trackEvent('form_submit', {
            form_name: 'brief_creation',
            form_type: 'song_brief',
            song_title: formData.songTitle || '',
            purpose_tag: formData.purposeTag || '',
            target_relation: formData.targetRelation || '',
            estimated_value: 19900, // 199€
            currency: 'EUR'
        });
    }

    // Tracking du début du paiement
    trackPaymentStart(amount, currency = 'EUR') {
        this.trackEvent('begin_checkout', {
            currency: currency,
            value: amount / 100, // Conversion cents vers euros
            items: [{
                item_name: 'Chanson personnalisée Poppy Music',
                item_category: 'Music Production',
                price: amount / 100,
                quantity: 1
            }]
        });
    }

    // Tracking de la validation du paiement
    trackPaymentComplete(sessionData) {
        this.trackEvent('purchase', {
            transaction_id: sessionData.id,
            currency: sessionData.currency || 'EUR',
            value: (sessionData.amount_total || 19900) / 100,
            tax: 0,
            shipping: 0,
            items: [{
                item_id: 'SONG_PRODUCTION_001',
                item_name: 'Chanson personnalisée Poppy Music',
                item_category: 'Music Production',
                item_variant: sessionData.metadata?.purposeTag || 'standard',
                price: (sessionData.amount_total || 19900) / 100,
                quantity: 1
            }],
            customer_email: sessionData.customer_details?.email || '',
            payment_method: 'stripe'
        });

        this.userJourney.completed = true;
    }

    // Tracking de l'abandon du formulaire
    trackFormAbandon(stepNumber, stepName) {
        if (this.userJourney.abandoned) return; // Éviter les doublons

        this.userJourney.abandoned = true;

        this.trackEvent('form_abandon', {
            step_number: stepNumber,
            step_name: stepName,
            time_spent: this.calculateTotalTime(),
            completion_rate: Math.round((stepNumber / 12) * 100),
            last_step: stepNumber
        });
    }

    // Tracking des interactions utilisateur
    trackUserInteraction(action, element, details = {}) {
        this.trackEvent('user_interaction', {
            action: action,
            element: element,
            ...details
        });
    }

    // Tracking du temps passé
    calculateTimeSpent() {
        if (!this.userJourney.startTime) return 0;
        return new Date().getTime() - this.userJourney.startTime;
    }

    calculateTotalTime() {
        return this.calculateTimeSpent();
    }

    // Tracking des erreurs
    trackError(errorType, errorMessage, details = {}) {
        this.trackEvent('error', {
            error_type: errorType,
            error_message: errorMessage,
            ...details
        });
    }

    // Tracking des clics sur boutons importants
    trackButtonClick(buttonName, pageContext) {
        this.trackEvent('button_click', {
            button_name: buttonName,
            page_context: pageContext,
            page_url: window.location.href
        });
    }

    // Méthode utilitaire pour vérifier si GTM est disponible
    isGTMAvailable() {
        return typeof window !== 'undefined' && window.dataLayer;
    }

    // Export des données de parcours utilisateur (pour debugging)
    getUserJourney() {
        return {
            ...this.userJourney,
            totalTime: this.calculateTotalTime(),
            stepsCount: this.userJourney.steps.length
        };
    }
}

// Instance globale
let gtmTracker = null;

export function getGTMTracker() {
    if (!gtmTracker) {
        gtmTracker = new GTMTracker();
    }
    return gtmTracker;
}

// Fonction d'initialisation automatique
export function initGTMTracking() {
    if (typeof window !== 'undefined') {
        const tracker = getGTMTracker();
        tracker.init();

        // Tracking automatique des clics sur boutons importants
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track-click]');
            if (target) {
                const buttonName = target.getAttribute('data-track-click');
                tracker.trackButtonClick(buttonName, window.location.pathname);
            }
        });

        // Tracking automatique de l'abandon de page
        window.addEventListener('beforeunload', () => {
            // Cette logique sera gérée par le formulaire lui-même
        });
    }
}
