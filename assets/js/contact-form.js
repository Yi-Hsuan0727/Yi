/*
 * ContactFormLogic: Footer contact form submission and success states.
 */
const ContactFormLogic = {
    recipientEmail: 'yche1356@asu.edu',
    endpoint: 'https://formsubmit.co/ajax/yche1356@asu.edu',
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;

        const form = document.querySelector('.site-contact-form');
        if (!form) return;

        this.isInitialized = true;
        this.form = form;
        this.submitBtn = form.querySelector('.site-contact-submit');
        this.successPanel = form.querySelector('.site-contact-success');
        this.errorPanel = form.querySelector('.site-contact-error');
        this.fieldsWrap = form.querySelector('.site-contact-fields');

        form.addEventListener('submit', this.handleSubmit.bind(this));
    },

    handleSubmit: async function(event) {
        event.preventDefault();
        if (!this.form || this.form.dataset.state === 'submitting') return;

        this.clearFeedback();
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        const formData = new FormData(this.form);
        const payload = {
            name: (formData.get('name') || '').toString().trim(),
            email: (formData.get('email') || '').toString().trim(),
            message: (formData.get('message') || '').toString().trim(),
            _subject: 'Portfolio contact form — new message',
            _replyto: (formData.get('email') || '').toString().trim(),
            _captcha: 'false',
            _template: 'table'
        };

        if (!payload.name || !payload.email || !payload.message) {
            this.showError('Please fill in all fields before sending.');
            return;
        }

        this.setSubmitting(true);

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(function() {
                return {};
            });

            if (!response.ok || (result.success !== 'true' && result.success !== true)) {
                throw new Error(result.message || 'Unable to send your message right now.');
            }

            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError(error.message || 'Something went wrong. Please try again or email me directly.');
        } finally {
            this.setSubmitting(false);
        }
    },

    setSubmitting: function(isSubmitting) {
        if (!this.form || !this.submitBtn) return;

        this.form.dataset.state = isSubmitting ? 'submitting' : 'idle';
        this.submitBtn.disabled = isSubmitting;
        this.submitBtn.textContent = isSubmitting ? 'Sending…' : 'Send message';
    },

    clearFeedback: function() {
        if (this.successPanel) {
            this.successPanel.hidden = true;
        }
        if (this.errorPanel) {
            this.errorPanel.hidden = true;
            this.errorPanel.textContent = '';
        }
        if (this.fieldsWrap) {
            this.fieldsWrap.hidden = false;
        }
    },

    showSuccess: function() {
        if (this.fieldsWrap) {
            this.fieldsWrap.hidden = true;
        }
        if (this.errorPanel) {
            this.errorPanel.hidden = true;
        }
        if (this.successPanel) {
            this.successPanel.hidden = false;
            this.successPanel.focus();
        }
    },

    showError: function(message) {
        if (!this.errorPanel) return;
        this.errorPanel.hidden = false;
        this.errorPanel.textContent = message;
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ContactFormLogic.init.bind(ContactFormLogic));
} else {
    setTimeout(function() {
        ContactFormLogic.init();
    }, 100);
}
