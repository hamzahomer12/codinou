"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Our Services",
    "nav.contact": "Contact Us",
    "nav.cta": "Start a Project",

    // Hero
    "hero.title": "We Build Websites",
    "hero.subtitle": "That Tell Your Story",
    "hero.description":
      "Codinou is a creative web development studio that transforms your ideas into beautiful, functional digital experiences. From simple websites to complete e-commerce solutions.",
    "hero.cta": "Discover Our Services",

    // About
    "about.title": "Who We Are",
    "about.description":
      "We are passionate developers and designers who believe every business deserves a unique online presence. Our creative approach reflects our process — starting from ideas and refining them into polished solutions.",
    "about.feature1.title": "Creative Approach",
    "about.feature1.desc": "Every project starts with a blank canvas and endless possibilities for your brand.",
    "about.feature2.title": "Clean Code",
    "about.feature2.desc": "We write maintainable, scalable code that performs and stands the test of time.",
    "about.feature3.title": "Personal Touch",
    "about.feature3.desc": "Your project gets our full attention and dedication from start to finish.",

    // CTA
    "cta.title": "Ready to Start Your Project?",

    // Services
    "services.title": "Our Services",
    "services.subtitle": "Choose the package that fits your needs. We offer flexible solutions for every budget.",

    "services.starter.name": "Starter",
    "services.starter.desc": "Perfect for small businesses getting started online",
    "services.starter.feature1": "Complete website creation",
    "services.starter.feature2": "1 free revision included",
    "services.starter.feature3": "Responsive design",
    "services.starter.feature4": "Basic SEO setup",

    "services.pro.name": "Pro",
    "services.pro.desc": "For businesses that want unlimited flexibility",
    "services.pro.feature1": "Complete website creation",
    "services.pro.feature2": "Unlimited revisions",
    "services.pro.feature3": "Responsive design",
    "services.pro.feature4": "Advanced SEO optimization",
    "services.pro.feature5": "Priority support",
    "services.pro.badge": "Most Popular",

    "services.ecom.name": "E-Commerce Elite",
    "services.ecom.desc": "Complete solution for online stores",
    "services.ecom.feature1": "Full e-commerce website",
    "services.ecom.feature2": "Unlimited revisions",
    "services.ecom.feature3": "E-commerce mentoring",
    "services.ecom.feature4": "Store optimization tips",
    "services.ecom.feature5": "Ongoing support",
    "services.ecom.badge": "E-Com Exclusive",

    "services.cta": "Get Started",

    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle": "Ready to bring your project to life? Let's talk about your vision.",
    "contact.name": "Your Name",
    "contact.name.placeholder": "John Doe",
    "contact.email": "Your Email",
    "contact.email.placeholder": "john@example.com",
    "contact.message": "Your Message",
    "contact.message.placeholder": "Tell us about your project...",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Message Sent!",
    "contact.success.sub": "We'll get back to you within 24 hours.",
    "contact.error": "Something went wrong. Please try again.",
    "contact.api.success": "Thanks! Your request has been received.",
    "contact.api.success.sub": "We review every message and reply quickly.",
    "contact.api.error": "Unable to send right now. Please email us directly.",
    "contact.error.invalid": "Please complete all fields with valid details.",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.tagline": "Crafted with passion by Codinou",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.services": "Nos Services",
    "nav.contact": "Contactez-nous",
    "nav.cta": "Demarrer un Projet",

    // Hero
    "hero.title": "Nous Créons des Sites Web",
    "hero.subtitle": "Qui Racontent Votre Histoire",
    "hero.description":
      "Codinou est un studio de développement web créatif qui transforme vos idées en expériences digitales belles et fonctionnelles. Des sites simples aux solutions e-commerce complètes.",
    "hero.cta": "Découvrir Nos Services",

    // About
    "about.title": "Qui Sommes-Nous",
    "about.description":
      "Nous sommes des développeurs et designers passionnés qui croient que chaque entreprise mérite une présence en ligne unique. Notre approche créative reflète notre processus — partir d'idées pour les affiner en solutions abouties.",
    "about.feature1.title": "Approche Créative",
    "about.feature1.desc": "Chaque projet commence avec une toile vierge et des possibilités infinies pour votre marque.",
    "about.feature2.title": "Code Propre",
    "about.feature2.desc": "Nous écrivons du code maintenable et évolutif qui performe et résiste au temps.",
    "about.feature3.title": "Touche Personnelle",
    "about.feature3.desc": "Votre projet reçoit toute notre attention et notre dévouement du début à la fin.",

    // CTA
    "cta.title": "Prêt à Démarrer Votre Projet ?",

    // Services
    "services.title": "Nos Services",
    "services.subtitle": "Choisissez le forfait qui correspond à vos besoins. Nous offrons des solutions flexibles pour tous les budgets.",

    "services.starter.name": "Starter",
    "services.starter.desc": "Parfait pour les petites entreprises qui débutent en ligne",
    "services.starter.feature1": "Création complète du site",
    "services.starter.feature2": "1 révision gratuite incluse",
    "services.starter.feature3": "Design responsive",
    "services.starter.feature4": "Configuration SEO de base",

    "services.pro.name": "Pro",
    "services.pro.desc": "Pour les entreprises qui veulent une flexibilité illimitée",
    "services.pro.feature1": "Création complète du site",
    "services.pro.feature2": "Révisions illimitées",
    "services.pro.feature3": "Design responsive",
    "services.pro.feature4": "Optimisation SEO avancée",
    "services.pro.feature5": "Support prioritaire",
    "services.pro.badge": "Le Plus Populaire",

    "services.ecom.name": "E-Commerce Elite",
    "services.ecom.desc": "Solution complète pour les boutiques en ligne",
    "services.ecom.feature1": "Site e-commerce complet",
    "services.ecom.feature2": "Révisions illimitées",
    "services.ecom.feature3": "Mentorat e-commerce",
    "services.ecom.feature4": "Conseils d'optimisation",
    "services.ecom.feature5": "Support continu",
    "services.ecom.badge": "Exclusif E-Com",

    "services.cta": "Commencer",

    // Contact
    "contact.title": "Contactez-Nous",
    "contact.subtitle": "Prêt à donner vie à votre projet ? Parlons de votre vision.",
    "contact.name": "Votre Nom",
    "contact.name.placeholder": "Jean Dupont",
    "contact.email": "Votre Email",
    "contact.email.placeholder": "jean@exemple.com",
    "contact.message": "Votre Message",
    "contact.message.placeholder": "Parlez-nous de votre projet...",
    "contact.send": "Envoyer",
    "contact.sending": "Envoi...",
    "contact.success": "Message Envoyé !",
    "contact.success.sub": "Nous vous répondrons sous 24 heures.",
    "contact.error": "Une erreur est survenue. Veuillez reessayer.",
    "contact.api.success": "Merci ! Votre demande a ete recue.",
    "contact.api.success.sub": "Nous examinons chaque message rapidement.",
    "contact.api.error": "Envoi impossible pour le moment. Contactez-nous par email.",
    "contact.error.invalid": "Veuillez remplir tous les champs avec des informations valides.",

    // Footer
    "footer.rights": "Tous droits réservés.",
    "footer.tagline": "Créé avec passion par Codinou",
    "footer.legal": "Mentions",
    "footer.privacy": "Confidentialite",
    "footer.terms": "Conditions d'utilisation",
  },
}

const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => translations.en[key as keyof typeof translations.en] || key,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("fr")) {
      setLanguage("fr")
    } else {
      setLanguage("en")
    }
  }, [])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}
