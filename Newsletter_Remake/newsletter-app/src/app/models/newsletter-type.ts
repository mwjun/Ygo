export type NewsletterType = 'dl' | 'md' | 'tcg';

export interface NewsletterConfig {
  type: NewsletterType;
  title: string;
  logoPath: string;
  formUrl: string;
  routePath: string;
}

