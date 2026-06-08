-- Seed ecommerce packages for Codinou catalog

INSERT INTO packages (id, service_id, name_en, name_fr, base_price_eur, deposit_eur, timeline_en, timeline_fr, best_for_en, best_for_fr, features, sort_order)
VALUES
  (
    'shop-starter',
    'ecommerce',
    'Shop Starter',
    'Boutique Starter',
    3290,
    990,
    '4 to 6 weeks',
    '4 à 6 semaines',
    'Existing businesses moving online (up to ~75 products)',
    'Entreprises qui passent au online (jusqu''à ~75 produits)',
    '["Custom storefront + up to 75 products","Stripe checkout & order admin panel","Catalog import from Shopify, Woo, or CSV","Training, launch support & 30-day fixes"]',
    10
  ),
  (
    'shop-pro',
    'ecommerce',
    'Commerce Pro',
    'Commerce Pro',
    6900,
    2070,
    '6 to 10 weeks',
    '6 à 10 semaines',
    'Growing brands with inventory, promos & shipping zones',
    'Marques en croissance : stock, promos & zones de livraison',
    '["Full admin: products, orders, customers, stock","Promo codes, zones, carriers & email notifications","Blog, SEO, analytics & CRM/newsletter hook","2 custom sur-mesure addons included"]',
    11
  ),
  (
    'shop-enterprise',
    'ecommerce',
    'Commerce Enterprise',
    'Commerce Sur Mesure',
    12900,
    3870,
    '10 to 16 weeks',
    '10 à 16 semaines',
    'Established businesses needing B2B, ERP & custom workflows',
    'Entreprises établies : B2B, ERP & workflows custom',
    '["B2B portals, tiered pricing & quote flows","ERP / accounting / warehouse integrations","Multi-language, multi-warehouse & advanced roles","Roadmap of custom modules built with your team"]',
    12
  )
ON CONFLICT (id) DO UPDATE SET
  service_id = EXCLUDED.service_id,
  name_en = EXCLUDED.name_en,
  name_fr = EXCLUDED.name_fr,
  base_price_eur = EXCLUDED.base_price_eur,
  deposit_eur = EXCLUDED.deposit_eur,
  timeline_en = EXCLUDED.timeline_en,
  timeline_fr = EXCLUDED.timeline_fr,
  best_for_en = EXCLUDED.best_for_en,
  best_for_fr = EXCLUDED.best_for_fr,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
