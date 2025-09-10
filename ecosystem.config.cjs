module.exports = {
  apps: [
    {
      name: "poppymusic",
      script: "node",
      args: "./dist/server/entry.mjs",
      env: {
        NODE_ENV: "production",
        SITE_URL: "https://poppymusic.fr",
        STRIPE_PUBLIC_KEY: "REMPLACER_PAR_VOTRE_CLE_PUBLIQUE",
        STRIPE_SECRET_KEY: "REMPLACER_PAR_VOTRE_CLE_SECRETE",
        STRIPE_WEBHOOK_SECRET: "REMPLACER_PAR_VOTRE_WEBHOOK_SECRET",
        STRIPE_PRICE_ID: "REMPLACER_PAR_VOTRE_PRICE_ID",
        SUPABASE_URL: "https://ntvnhcpkzpovqgcaiawx.supabase.co",
        SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw"
      },
    },
  ],
};
