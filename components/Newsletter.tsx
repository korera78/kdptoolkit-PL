/**
 * Newsletter Component
 * ListMonk-powered newsletter signup with validation and GDPR compliance
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Supported languages
export type NewsletterLanguage = 'en' | 'de' | 'es' | 'fr' | 'pl';

// i18n translations
const translations: Record<NewsletterLanguage, {
  title: string;
  description: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  subscribe: string;
  subscribing: string;
  success: string;
  successMessage: string;
  gdprConsent: string;
  gdprRequired: string;
  invalidEmail: string;
  errorGeneric: string;
  errorNotConfigured: string;
}> = {
  en: {
    title: 'Subscribe to our newsletter',
    description: 'Get the latest KDP insights delivered to your inbox.',
    emailPlaceholder: 'your@email.com',
    namePlaceholder: 'Your name (optional)',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    success: 'Success!',
    successMessage: 'Check your email to confirm your subscription.',
    gdprConsent: 'I agree to receive newsletter emails and accept the privacy policy. I can unsubscribe at any time.',
    gdprRequired: 'You must accept the privacy policy to subscribe.',
    invalidEmail: 'Please enter a valid email address.',
    errorGeneric: 'Something went wrong. Please try again.',
    errorNotConfigured: 'Newsletter is not configured.',
  },
  de: {
    title: 'Newsletter abonnieren',
    description: 'Erhalte die neuesten KDP-Einblicke direkt in dein Postfach.',
    emailPlaceholder: 'deine@email.de',
    namePlaceholder: 'Dein Name (optional)',
    subscribe: 'Abonnieren',
    subscribing: 'Wird gesendet...',
    success: 'Erfolg!',
    successMessage: 'Prüfe deine E-Mails, um dein Abonnement zu bestätigen.',
    gdprConsent: 'Ich stimme dem Erhalt von Newsletter-E-Mails zu und akzeptiere die Datenschutzrichtlinie. Ich kann mich jederzeit abmelden.',
    gdprRequired: 'Du musst die Datenschutzrichtlinie akzeptieren.',
    invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    errorGeneric: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    errorNotConfigured: 'Newsletter ist nicht konfiguriert.',
  },
  es: {
    title: 'Suscríbete a nuestro boletín',
    description: 'Recibe las últimas novedades de KDP en tu bandeja de entrada.',
    emailPlaceholder: 'tu@email.com',
    namePlaceholder: 'Tu nombre (opcional)',
    subscribe: 'Suscribirse',
    subscribing: 'Enviando...',
    success: '¡Éxito!',
    successMessage: 'Revisa tu correo para confirmar tu suscripción.',
    gdprConsent: 'Acepto recibir correos del boletín y acepto la política de privacidad. Puedo darme de baja en cualquier momento.',
    gdprRequired: 'Debes aceptar la política de privacidad para suscribirte.',
    invalidEmail: 'Por favor, introduce una dirección de correo válida.',
    errorGeneric: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    errorNotConfigured: 'El boletín no está configurado.',
  },
  fr: {
    title: 'Abonnez-vous à notre newsletter',
    description: 'Recevez les dernières actualités KDP dans votre boîte mail.',
    emailPlaceholder: 'votre@email.fr',
    namePlaceholder: 'Votre nom (optionnel)',
    subscribe: "S'abonner",
    subscribing: 'Envoi en cours...',
    success: 'Succès !',
    successMessage: 'Vérifiez vos emails pour confirmer votre abonnement.',
    gdprConsent: "J'accepte de recevoir la newsletter et j'accepte la politique de confidentialité. Je peux me désabonner à tout moment.",
    gdprRequired: 'Vous devez accepter la politique de confidentialité pour vous abonner.',
    invalidEmail: 'Veuillez entrer une adresse email valide.',
    errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
    errorNotConfigured: "La newsletter n'est pas configurée.",
  },
  pl: {
    title: 'Zapisz się do newslettera',
    description: 'Otrzymuj najnowsze informacje o KDP na swoją skrzynkę.',
    emailPlaceholder: 'twoj@email.pl',
    namePlaceholder: 'Twoje imię (opcjonalnie)',
    subscribe: 'Zapisz się',
    subscribing: 'Wysyłanie...',
    success: 'Sukces!',
    successMessage: 'Sprawdź swój email, aby potwierdzić subskrypcję.',
    gdprConsent: 'Zgadzam się na otrzymywanie newslettera i akceptuję politykę prywatności. Mogę się wypisać w dowolnym momencie.',
    gdprRequired: 'Musisz zaakceptować politykę prywatności, aby się zapisać.',
    invalidEmail: 'Proszę podać prawidłowy adres email.',
    errorGeneric: 'Coś poszło nie tak. Spróbuj ponownie.',
    errorNotConfigured: 'Newsletter nie jest skonfigurowany.',
  },
};

interface NewsletterProps {
  variant?: 'inline' | 'sidebar' | 'fullwidth';
  className?: string;
  language?: NewsletterLanguage;
  showName?: boolean;
}

export default function Newsletter({
  variant = 'inline',
  className = '',
  language = 'en',
  showName = true,
}: NewsletterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  // Create dynamic schema with translated messages
  const newsletterSchema = z.object({
    email: z.string().email(t.invalidEmail),
    name: z.string().optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: t.gdprRequired,
    }),
    _gotcha: z.string().optional(),
  });

  type NewsletterFormData = z.infer<typeof newsletterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      gdprConsent: false,
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    // Check honeypot
    if (data._gotcha) {
      return; // Likely spam
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name || '',
          language,
          gdprConsent: data.gdprConsent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t.errorGeneric);
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.errorGeneric;
      setError(errorMessage);
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantClasses = {
    inline: 'max-w-md',
    sidebar: 'max-w-sm',
    fullwidth: 'max-w-2xl',
  };

  if (isSuccess) {
    return (
      <div
        className={`rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20 ${variantClasses[variant]} ${className}`}
      >
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
          {t.success}
        </h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          {t.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${variantClasses[variant]} ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.description}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Honeypot field (hidden from users) */}
        <input
          type="text"
          {...register('_gotcha')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={t.emailPlaceholder}
            {...register('email')}
            className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
            disabled={isSubmitting}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {showName && (
          <div>
            <label htmlFor="newsletter-name" className="sr-only">
              Name (optional)
            </label>
            <input
              id="newsletter-name"
              type="text"
              placeholder={t.namePlaceholder}
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* GDPR Consent Checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="newsletter-gdpr"
            type="checkbox"
            {...register('gdprConsent')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900"
            disabled={isSubmitting}
            aria-invalid={errors.gdprConsent ? 'true' : 'false'}
            aria-describedby={errors.gdprConsent ? 'gdpr-error' : undefined}
          />
          <label
            htmlFor="newsletter-gdpr"
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            {t.gdprConsent}
          </label>
        </div>
        {errors.gdprConsent && (
          <p id="gdpr-error" className="text-xs text-red-600 dark:text-red-400">
            {errors.gdprConsent.message}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
        >
          {isSubmitting ? t.subscribing : t.subscribe}
        </button>
      </form>
    </div>
  );
}
