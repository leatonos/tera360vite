export type CountryResponse = {
  country_name: string;
};

export type Translations = {
  [key: string]: string;
};

export async function getCountry(): Promise<CountryResponse> {
  
    try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    if (data && data.country_name) {
      return { country_name: data.country_name };
    }

  } catch (err) {
    console.error("Failed to fetch country", err);
  }
  return { country_name: "Unknown" };
}

export const portugueseTranslations = {
    "Loading": "Carregando...",
    "See tour": "Ver tour",
    "Copyright": "© 2025 Tera Arquitetura. Todos os direitos reservados.",
}

export const englishTranslations = {
    "Loading": "Loading...",
    "See tour": "See tour",
    "Copyright": "© 2025 Tera Arquitetura. All rights reserved.",
}