export type CountryResponse = {
  country_name: string;
};

export type Translation = {
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

export const portugueseTranslations:Translation = {
    "Loading": "Carregando...",
    "See tour": "Ver tour",
    "Copyright": "© 2025 Tera Arquitetura. Todos os direitos reservados.",
    "Select a tour": "Selecione um tour",
    "Explore 360° virtual tours": "Explore tours virtuais em 360°",
}

export const englishTranslations:Translation = {
    "Loading": "Loading...",
    "See tour": "See tour",
    "Copyright": "© 2025 Tera Arquitetura. All rights reserved.",
    "Select a tour": "Select a tour",
    "Explore 360° virtual tours": "Explore 360° virtual tours",
}